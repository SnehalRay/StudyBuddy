import os
import time
from typing import Optional, Tuple
from urllib.parse import unquote_plus
from starlette.datastructures import Headers
import boto3
from io import BytesIO

from openai import OpenAI
from fastapi import FastAPI, UploadFile, Form, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel


# ────────────────────────────── OpenAI Configuration ───────────────────────────────
load_dotenv()
client = OpenAI(api_key = os.getenv("OPENAI_API_KEY"))
INSTR = "You are an assistant that takes in documents and a prompt about a topic from the document and summarizes them into Peter Griffin - Stewie styled conversations. When the user asks to summarize a document, you will just return a conversation between Peter and Stewie about that topic as if either Peter is learning while Stewie explains or Stewie is learning while Peter explains. Only return text back, no numbers or symbols. Be extremely detailed and try making it a 2 minute long conversation"
MODEL = "gpt-4o"       
FILE_TOOL = {"type":"file_search"}        

# ────────────────────────────── AWS Configuration ───────────────────────────────
S3_BUCKET = os.getenv("S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION", "us-east-1") # Defaults to us-east-1

s3 = boto3.client("s3", region_name = AWS_REGION)
# ────────────────────────────── Helper Functions ───────────────────────────────

def upload_file(upload: UploadFile) -> str:
    "returns file id of uploaded file"
    response = client.files.create(
        file=(upload.filename, upload.file, upload.content_type),
        purpose="assistants"
    )
    return response.id

def create_assistant() -> str:
    "Creates an assistant and attaches the file. Returns assistant id"
    # create an assistant with "file_search" tool enabled
    assistant = client.beta.assistants.create(
        name="Brainrot Bot",
        instructions=INSTR,
        model=MODEL,
        tools=[FILE_TOOL]
    )

    # # attach the file to the assistant
    # client.beta.assistants.files.create(
    #     assitant_id=assistant.id,
    #     file_id=file_id
    # )
    return assistant.id

def ask_assistant(
        assistant_id:str,
        prompt:str,
        file_id:str,
        thread_id:Optional[str] = None
        
    ) -> Tuple[str,str]: # returns thread_id and reply

    if thread_id:
        print("Retrieving existing thread")
        try:
            thread = client.beta.threads.retrieve(thread_id=thread_id)
        except Exception as e:
            print("error retrieving thread", e)
            thread_id = None
    if not thread_id:
        try:
            thread = client.beta.threads.create()
            print("new thread created")
        except Exception as e:
            print("Error creating new thread", e)
            raise
    
    # send the prompt to assistant
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=prompt,
        attachments=[
            {
                "file_id":file_id,
                "tools":[FILE_TOOL]
            }
        ]
    )

    # run assistant 
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )

    while True:
        status = client.beta.threads.runs.retrieve(
            thread_id=thread.id, run_id=run.id
        )
        if status.status == "completed":
            break
        if status.status == "failed":
            raise RuntimeError("Assistant run failed.")
        time.sleep(1) # one second delay before rechecking status

    # collect response
    msgs = client.beta.threads.messages.list(thread_id=thread.id)
    for m in msgs.data:
        if m.role == "assistant":
            return thread.id, m.content[0].text.value
    
    raise RuntimeError("Assistant responded with no assistant message")

# ────────────────────────────── FastAPI endpoint configuration ───────────────────────────────

app = FastAPI(title="TextExtract")

class Response(BaseModel):
    assistant_id: str
    thread_id: str
    reply: str


@app.post("/summarize/", response_model=Response)
async def summarize_fast(
    file: UploadFile, 
    prompt: str = Form(...)
):
    # 1. upload file
    file_id = upload_file(file)
    # 2. create assistant with attached file
    assistant_id = create_assistant()
    # 3. ask question
    thread_id, reply = ask_assistant(assistant_id=assistant_id, prompt=prompt, file_id=file_id)

    return Response(
        assistant_id=assistant_id,
        thread_id=thread_id,
        reply=reply
    )

# ────────────────────────────── Non-API configuration ───────────────────────────────



def get_fileid(cookie_header: str, cookie_name: str = "folderSession") -> str:
    """
    Parse a cookie header and return the URL-decoded value of folderSession
    """
    
    # Decode cookie
    # 1. Split the cookie first
    for part in cookie_header.split(";"):
        name, _, val = part.strip().partition("=")
        if name == cookie_name and val:
            # Returns the decoded value
            decoded = unquote_plus(val)
            return decoded
    raise ValueError(f"cookie {cookie_name} not found in header")

def download_s3_object(key: str) -> bytes:
    """
    Fetch the object at the corresponding key from the configured bucket
    Returns its raw bytes
    """
    resp = s3.get_object(Bucket=S3_BUCKET, Key=key)
    return resp["Body"].read()

def make_uploadfile(data: bytes, filename: str, content_type: str) -> UploadFile:
    """
    Turns raw bytes into an UploadFile so TextExtract can send the file to OAI
    """
    hdrs = Headers({"content-type": content_type})
    stream = BytesIO(data)
    return UploadFile(file=stream, filename=filename, headers=hdrs)

def summarize(cookie_header: str, prompt: str, cookie_name: str="folderSession") -> Tuple[str, str, str]:
    """
    1. Parse and URL decode cookie
    2. List Objects under that prefix in S3 -> Pick the filekey
    3. Download the raw bytes
    4. Convert the bytes to FastAPI UploadFile
    5. Upload to OpenAI, create assistant ask question
    """
    folder_prefix = get_fileid(cookie_header, cookie_name)

    resp = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=folder_prefix + "/")
    contents = resp.get("Contents", [])
    if not contents:
        raise HTTPException(404, f"No files found under {folder_prefix}/")
    
    # Get the file_key
    file_key = contents[0]["Key"]

    # Download raw bytes
    raw = download_s3_object(file_key)

    # Wrap in upload file
    ext = os.path.splitext(file_key)[1] or ""
    fname = os.path.basename(file_key).split("|")[0].strip(" ") # Removes spaces, takes the filename only and excludes the email
    upload_blob = make_uploadfile(raw, fname, "application/pdf")
 

    file_id = upload_file(upload_blob)

    assistant_id = create_assistant()
    thread_id, reply = ask_assistant(assistant_id, prompt, file_id)

    return assistant_id, thread_id, reply




