import os
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

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
