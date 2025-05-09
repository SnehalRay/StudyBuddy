import os
import time
from typing import Optional, Tuple

from openai import OpenAI
from fastapi import FastAPI, UploadFile, Form, HTTPException
from pydantic import BaseModel


# ────────────────────────────── Configuration ───────────────────────────────
client = OpenAI(api_key = os.getenv("OPENAI_API_KEY"))
INSTR = "You are an assistant that takes in documents and a prompt about a topic from the document and summarizes them into Peter Griffin - Stewie styled conversations. When the user asks to summarize a document, you will just return a conversation between Peter and Stewie about that topic as if either Peter is learning while Stewie explains or Stewie is learning while Peter explains. Only return text back, no numbers or symbols. Be extremely detailed and try making it a 2 minute long conversation"
MODEL = "gpt-4o"       
FILE_TOOL = {"type":"file_search"}                              

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
async def summarize(
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