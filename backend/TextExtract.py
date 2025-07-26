import os
import time
from typing import Optional, Tuple
from urllib.parse import unquote_plus
from starlette.datastructures import Headers
import boto3
from io import BytesIO
import subprocess
from moviepy.editor import VideoFileClip, AudioFileClip

from openai import OpenAI
from elevenlabs import ElevenLabs


from fastapi import FastAPI, UploadFile, Form, HTTPException, Request

from dotenv import load_dotenv
from fastapi.responses import FileResponse
from pydantic import BaseModel


# ────────────────────────────── OpenAI Configuration ───────────────────────────────
load_dotenv()
client = OpenAI(api_key = os.getenv("OPENAI_API_KEY"))
INSTR = "You are an assistant that takes in documents and a prompt about a topic from the document and summarizes them into Peter Griffin style explanation. Incorporate brainrot terms and lingo. Return the transcript of the explanation only. Don't add anything but the transcript."
MODEL = "gpt-4o"       
FILE_TOOL = {"type":"file_search"}        

# ────────────────────────────── AWS Configuration ───────────────────────────────
S3_BUCKET = os.getenv("S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION", "us-east-1") # Defaults to us-east-1

s3 = boto3.client("s3", region_name = AWS_REGION)

# ────────────────────────────── ElevenLabs Configuration ───────────────────────────────
eleven = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
VOICE_ID = "0OU8GtAGLNJOOEVYe36E"
TTS_MODEL = "eleven_multilingual_v2"

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


# ────────────────────────────── Methods ───────────────────────────────

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
    raise HTTPException(status_code=400, detail=f"Cookie '{cookie_name}' not found in header")

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

def generate_tts(script: str) -> bytes:
    buf = BytesIO()
    for chunk in eleven.text_to_speech.convert(
        text=script,
        voice_id=VOICE_ID,
        model_id=TTS_MODEL,
        output_format="mp3_44100_128"
    ):
        buf.write(chunk)
    return buf.getvalue()

def summarize(cookie_header: str, prompt: str) -> Tuple[str,str,str,bytes]:
    # 1. extract folderSession
    folder = get_fileid(cookie_header)
    # 2. list & download first object
    resp = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f"{folder}/")
    items = resp.get("Contents", [])
    if not items:
        raise HTTPException(404, f"No files under {folder}/")
    key = items[0]["Key"]
    raw = download_s3_object(key)

    # 3. wrap & upload to OpenAI
    fname = os.path.basename(key).split("|")[0].strip()
    fname = fname.split("-")[0]
    print(fname)
    upload_blob = make_uploadfile(raw, fname, "application/pdf")
    file_id = upload_file(upload_blob)

    # 4. create assistant + ask
    asst_id = create_assistant()
    thread_id, script = ask_assistant(asst_id, prompt, file_id)

    # 5. generate MP3
    audio_bytes = generate_tts(script)

    return asst_id, thread_id, script, audio_bytes

# ────────────────────────────── FastAPI endpoint configuration ───────────────────────────────

app = FastAPI(title="TextExtract")

class Response(BaseModel):
    assistant_id: str
    thread_id: str
    reply: str

# Cookie Header is set to String and not Cookie as we are manually parsing our cookie via helper functions.
@app.post("/summarize-into-video/")
async def summarize_into_video(
    prompt: str = Form(...),
    cookie_header: str = Request
):
    """
    1. Summarize + TTS → audio_bytes
    2. Whisper → subtitles.srt
    3. SRT → ASS
    4. Load bg1.mp4, replace audio, burn in subtitles → final.mp4
    5. Stream final.mp4 back
    """
    # Commenting this because it can extensively burn through ElevenLabs Token
    asst_id = "1"
    thread_id = "1"
    # try:
    #     # your summarize helper now returns audio bytes too
    #     asst_id, thread_id, script, audio_bytes = summarize(cookie_header, prompt)
    # except HTTPException as e:
    #     raise e
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))

    # 1) Save audio to disk
    audio_path = "temp_audio.mp3"
    # with open(audio_path, "wb") as f:
    #     f.write(audio_bytes)

    # 2) Whisper transcription → SRT
    try:
        whisper_resp = client.audio.transcriptions.create(
            file=("audio.mp3", open(audio_path, "rb"), "audio/mpeg"),
            model="whisper-1",
            response_format="srt"
        )
    except Exception as e:
        print("Failed to use whisper to create captions with error: ", e)
    
    srt_path = "subtitles.srt"
    with open(srt_path, "w") as f:
        f.write(whisper_resp)

    # 3) Convert to ASS
    ass_path = "subtitles.ass"
    srt_to_ass(srt_path, ass_path)

    # 4) Prepare video + burn subtitles
    bg_video = "bg1.mp4"
    temp_video = "with_audio.mp4"
    final_video = "final.mp4"

    # replace bg audio
    clip = VideoFileClip(bg_video)
    audio_clip = AudioFileClip(audio_path)
    duration = audio_clip.duration + 1  # optional padding
    clip = clip.subclip(0, duration).set_audio(audio_clip)
    clip.write_videofile(
        temp_video,
        codec="libx264",
        audio_codec="aac",
        fps=30,
        threads=4,
        preset="ultrafast"
    )

    # burn subtitles
    burn_subtitles_top(temp_video, ass_path, final_video, marginV=20)

    # 5) Stream back with headers
    headers = {
        "X-Assistant-ID": asst_id,
        "X-Thread-ID": thread_id,
        "Content-Disposition": 'attachment; filename="summary_video.mp4"'
    }
    return FileResponse(final_video, media_type="video/mp4", headers=headers)


# ────────────────────────────── Video Helpers ───────────────────────────────


def srt_to_ass(srt_path: str, ass_path: str):
    subprocess.run(
        ["ffmpeg", "-y", "-i", srt_path, ass_path],
        check=True
    )

def burn_subtitles_top(input_video: str, ass_file: str, output_video: str, marginV: int = 20):
    # Alignment=6 → top‐center
    vf = f"subtitles={ass_file}:force_style='Alignment=6,MarginV={marginV}'"
    subprocess.run(
        ["ffmpeg", "-y", "-i", input_video, "-vf", vf, "-c:a", "copy", output_video],
        check=True
    )
