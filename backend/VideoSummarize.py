import os
import time
import tempfile
from typing import Optional, Tuple
from urllib.parse import unquote_plus
from starlette.datastructures import Headers
import boto3
from io import BytesIO
import subprocess
from moviepy.editor import VideoFileClip, AudioFileClip

from openai import OpenAI
from elevenlabs import ElevenLabs


from fastapi import FastAPI, UploadFile, Form, HTTPException, Request, BackgroundTasks

from dotenv import load_dotenv
from fastapi.responses import FileResponse
from pydantic import BaseModel


# ────────────────────────────── OpenAI Configuration ───────────────────────────────
load_dotenv()
client = OpenAI(api_key = os.getenv("OPENAI_API_KEY"))
INSTR = "You are an assistant that takes in documents and a prompt about a topic from the document and summarizes them into a condensed explanation. Return the summarization only unless further instructions are given in the prompt"
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
def _cleanup(path: str):
    try:
        os.remove(path)
    except OSError:
        pass

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

def summarize(cookie_header: str, prompt: str = "Summarize", video: bool = False):
    # First we need to insert the character details into the prompt if its video mode
    if video:
        prompt = prompt + "Create a transcript of the summary in a verbal explanation style by (Replace with character name). "
        "Litter brainrot terms to the transcript to make it more appealing to GenZ" \
        " Incorporate the character's speaking style as well as slangs/mannerisms and try to explain with analogies common to the character." \
        "Return only the transcript of the explanation with no character names in it or symbols"
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

    if video:
    # 5. generate MP3 if mode is video
        audio_bytes = generate_tts(script)
        return asst_id, thread_id, script, audio_bytes
    
    # Return only the script if mode is text summarize
    else:
        return asst_id, thread_id, script

# ────────────────────────────── FastAPI endpoint configuration ───────────────────────────────

app = FastAPI(title="TextExtract")

class Response(BaseModel):
    assistant_id: str
    thread_id: str
    reply: str

@app.post("/summarize-text")
async def summarize_text(prompt: str = Form(...), cookie_header: str = Request):
    """
    The summarize feature without using any brainrot. Used only for text summarize
    """
    asst_id, thread_id, script = summarize(cookie_header, prompt)
    return script

# Cookie Header is set to String and not Cookie as we are manually parsing our cookie via helper functions.

@app.post("/summarize-into-video/")
async def summarize_into_video(
    background_tasks: BackgroundTasks,
    prompt: str = Form(...),
    cookie_header: str = Header(..., alias="X-Cookie-Header"),
):
    """
    1. Summarize + TTS → audio_bytes
    2. Whisper → subtitles.srt
    3. SRT → ASS
    4. Load bg1.mp4, replace audio, burn in subtitles → final.mp4
    5. Stream final.mp4 back, then clean up all temps
    """
    # 0) get script & audio
    # asst_id, thread_id, script, audio_bytes = summarize(...)

    # (for demo)
    asst_id = "1"
    thread_id = "1"
    audio_bytes = b"..."  # your TTS blob

    # 1) write audio to a temp file
    audio_tmp = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
    audio_tmp.write(audio_bytes)
    audio_tmp.flush()
    audio_tmp.close()

    # 2) whisper → srt
    srt_tmp = tempfile.NamedTemporaryFile(suffix=".srt", delete=False, mode="w", encoding="utf-8")
    try:
        whisper_resp = client.audio.transcriptions.create(
            file=("audio.mp3", open(audio_tmp.name, "rb"), "audio/mpeg"),
            model="whisper-1",
            response_format="srt"
        )
    except Exception as e:
        _cleanup(audio_tmp.name)
        raise HTTPException(status_code=500, detail=f"Whisper failed: {e}")
    srt_tmp.write(whisper_resp)
    srt_tmp.flush()
    srt_tmp.close()

    # 3) convert to ASS
    ass_tmp = tempfile.NamedTemporaryFile(suffix=".ass", delete=False)
    ass_tmp.close()
    srt_to_ass(srt_tmp.name, ass_tmp.name)

    # 4a) attach audio to background video
    temp_video = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
    temp_video.close()
    clip = VideoFileClip("bg1.mp4")
    audio_clip = AudioFileClip(audio_tmp.name)
    duration = audio_clip.duration + 1
    clip = clip.subclip(0, duration).set_audio(audio_clip)
    clip.write_videofile(
        temp_video.name,
        codec="libx264",
        audio_codec="aac",
        fps=30,
        threads=4,
        preset="ultrafast"
    )

    # 4b) burn subtitles into final
    final_tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
    final_tmp.close()
    burn_subtitles_top(temp_video.name, ass_tmp.name, final_tmp.name, marginV=20)

    # 5) schedule all temps for deletion once response is done
    for path in [audio_tmp.name, srt_tmp.name, ass_tmp.name, temp_video.name]:
        background_tasks.add_task(_cleanup, path)

    headers = {
        "X-Assistant-ID": asst_id,
        "X-Thread-ID": thread_id,
        "Content-Disposition": 'attachment; filename="summary_video.mp4"'
    }

    return FileResponse(
        final_tmp.name,
        media_type="video/mp4",
        headers=headers,
        background=BackgroundTasks().add_task(_cleanup, final_tmp.name)
    )


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
