# Uses the ElevenLab API to clone voices of different characters:

import os
from elevenlabs.client import ElevenLabs
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()
elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

def cloneVoice(id):
    voice = elevenlabs.voices.ivc.create(
    name= f"Voice Generation {id}",
    # Replace with the paths to your audio files.
    # The more files you add, the better the clone will be.
    files=[BytesIO(open(r"/home/lucid/Downloads/ElevenCloningData/Sydney_trimmed.mp3", "rb").read())])
    print(voice.voice_id)


cloneVoice("6")