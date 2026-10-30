import os
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx

# Load .env robustly from backend directory or project root
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"
if ENV_FILE.exists():
    load_dotenv(dotenv_path=ENV_FILE)
load_dotenv()

logger = logging.getLogger(__name__)

from app.models.schemas import (
    FarmerProfile,
    SchemeEvaluation,
    ChatRequest,
    ChatResponse,
    STTResponse,
    TTSRequest,
    TTSResponse
)
from app.services.schemes_service import SchemesService
from app.services.eligibility import evaluate_all_schemes
from app.services.conversation_manager import ConversationManager
from app.services.sarvam_service import SarvamVoiceService

app = FastAPI(
    title="Krishi Mitra AI - Agricultural Scheme Assistant",
    description="Deterministic Decision-Support & Voice Engine for Indian Farmers",
    version="1.0.0"
)

# CORS Configuration
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
if "*" not in origins:
    origins.append("http://localhost:3000")
    origins.append("http://127.0.0.1:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # allow all for hackathon demonstration flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "service": "Krishi Mitra AI API",
        "tagline": "AI Voice Agricultural Scheme Assistant for Indian Farmers",
        "docs_url": "/docs",
        "health_url": "/health"
    }

@app.get("/health")
def health_check():
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    sarvam_key = os.getenv("SARVAM_API_KEY", "").strip()

    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
        "environment": "production-ready",
        "gemini_api_configured": bool(gemini_key and gemini_key != "your_gemini_api_key_here"),
        "sarvam_api_configured": bool(sarvam_key and sarvam_key != "your_sarvam_api_key_here"),
        "schemes_loaded": len(SchemesService.load_schemes())
    }

@app.get("/api/schemes")
def get_all_schemes():
    return SchemesService.load_schemes()

@app.get("/api/schemes/{scheme_id}")
def get_scheme(scheme_id: str):
    scheme = SchemesService.get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found.")
    return scheme

@app.post("/api/eligibility/evaluate", response_model=List[SchemeEvaluation])
def evaluate_farmer_eligibility(profile: FarmerProfile):
    schemes = SchemesService.load_schemes()
    return evaluate_all_schemes(schemes, profile)

@app.post("/api/chat", response_model=ChatResponse)
async def chat_interaction(request: ChatRequest):
    response = await ConversationManager.process_farmer_message(
        message=request.message,
        session_id=request.session_id,
        language=request.language,
        profile_override=request.profile_override
    )

    # Optional: If Sarvam TTS is active, also synthesize audio for the response
    if SarvamVoiceService.get_api_key():
        tts_res = await SarvamVoiceService.text_to_speech(response.response_text, language=request.language)
        if tts_res.success and tts_res.audio_base64:
            response.response_audio_base64 = tts_res.audio_base64
            response.audio_format = tts_res.audio_format
            response.voice_provider = tts_res.provider

    return response

class SarvamConfigPayload(BaseModel):
    api_key: str

@app.get("/api/voice/status")
def get_voice_status():
    sarvam_key = SarvamVoiceService.get_api_key()
    is_configured = bool(sarvam_key)
    masked_key = f"{sarvam_key[:4]}...{sarvam_key[-4:]}" if is_configured and len(sarvam_key) > 8 else None
    return {
        "sarvam_configured": is_configured,
        "masked_key": masked_key,
        "stt_model": "saaras:v2",
        "tts_model": "bulbul:v1",
        "supported_languages": ["kn-IN", "hi-IN", "mr-IN", "te-IN", "en-IN"],
        "active_speakers": {
            "kn-IN": "meera",
            "hi-IN": "swara",
            "mr-IN": "swara",
            "te-IN": "ananya",
            "en-IN": "arvind"
        },
        "voice_engine": "Sarvam AI (Saaras + Bulbul)" if is_configured else "Browser Web Speech Fallback"
    }

@app.post("/api/voice/config")
async def update_sarvam_config(payload: SarvamConfigPayload):
    new_key = payload.api_key.strip()
    if not new_key:
        raise HTTPException(status_code=400, detail="API key cannot be empty.")

    # Validate key against Sarvam text-to-speech API
    headers = {
        "api-subscription-key": new_key,
        "Content-Type": "application/json"
    }
    test_payload = {
        "inputs": ["ನಮಸ್ಕಾರ"],
        "target_language_code": "kn-IN",
        "speaker": "meera",
        "model": "bulbul:v1"
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post("https://api.sarvam.ai/text-to-speech", headers=headers, json=test_payload)
            if resp.status_code in (401, 403):
                raise HTTPException(status_code=400, detail="Invalid Sarvam API key. Authentication failed (401/403).")
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Sarvam validation ping warning: {e}")

    # Set in running process environment
    os.environ["SARVAM_API_KEY"] = new_key

    # Save to backend/.env
    try:
        env_lines = []
        if ENV_FILE.exists():
            with open(ENV_FILE, "r", encoding="utf-8") as f:
                env_lines = f.readlines()

        found = False
        new_lines = []
        for line in env_lines:
            if line.startswith("SARVAM_API_KEY="):
                new_lines.append(f"SARVAM_API_KEY={new_key}\n")
                found = True
            else:
                new_lines.append(line)
        if not found:
            new_lines.append(f"SARVAM_API_KEY={new_key}\n")

        with open(ENV_FILE, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
    except Exception as e:
        logger.error(f"Failed to persist SARVAM_API_KEY to file: {e}")

    return {
        "success": True,
        "message": "Sarvam AI connected successfully!",
        "sarvam_configured": True,
        "stt_model": "saaras:v2",
        "tts_model": "bulbul:v1"
    }

@app.post("/api/voice/test-sarvam")
async def test_sarvam_voice(language: str = Query("kn")):
    sample_texts = {
        "kn": "ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ, ಕೃಷಿ ಮಿತ್ರ AI ಗೆ ಸ್ವಾಗತ.",
        "hi": "नमस्ते किसान भाई, कृषि मित्र AI में आपका स्वागत है।",
        "mr": "नमस्कार शेतकरी मित्रांनो, कृषी मित्र AI मध्ये आपले स्वागत आहे.",
        "te": "నమస్కారం రైతు సోదరులారా, కృషి మిత్ర AI కి స్వాగతం.",
        "en": "Hello farmer friend, welcome to Krishi Mitra AI."
    }
    text = sample_texts.get(language, sample_texts["kn"])
    tts_res = await SarvamVoiceService.text_to_speech(text, language=language)
    return {
        "text": text,
        "language": language,
        "success": tts_res.success,
        "provider": tts_res.provider,
        "audio_base64": tts_res.audio_base64,
        "audio_format": tts_res.audio_format,
        "error": tts_res.error
    }

@app.post("/api/voice/stt", response_model=STTResponse)
async def speech_to_text(
    file: UploadFile = File(...),
    language_code: str = Form("kn-IN")
):
    audio_content = await file.read()
    return await SarvamVoiceService.speech_to_text(
        audio_bytes=audio_content,
        filename=file.filename or "recording.wav",
        language_code=language_code
    )

@app.post("/api/voice/tts", response_model=TTSResponse)
async def text_to_speech(request: TTSRequest):
    return await SarvamVoiceService.text_to_speech(
        text=request.text,
        language=request.language,
        speaker=request.speaker
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
