import os
import io
import base64
import logging
from typing import Optional, Dict, Any
import httpx
from app.models.schemas import STTResponse, TTSResponse

logger = logging.getLogger(__name__)

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"

SARVAM_LANG_MAP = {
    "kn": "kn-IN",
    "hi": "hi-IN",
    "mr": "mr-IN",
    "te": "te-IN",
    "en": "en-IN"
}

SARVAM_SPEAKER_MAP = {
    "kn-IN": "meera",
    "hi-IN": "swara",
    "mr-IN": "swara",
    "te-IN": "ananya",
    "en-IN": "arvind"
}

def resolve_sarvam_lang(code: str) -> str:
    cleaned = code.lower().split("-")[0]
    return SARVAM_LANG_MAP.get(cleaned, "kn-IN")

class SarvamVoiceService:

    @classmethod
    def get_api_key(cls) -> Optional[str]:
        key = os.getenv("SARVAM_API_KEY", "").strip()
        if not key or key == "your_sarvam_api_key_here":
            return None
        return key

    @classmethod
    async def speech_to_text(cls, audio_bytes: bytes, filename: str = "audio.wav", language_code: str = "kn-IN") -> STTResponse:
        api_key = cls.get_api_key()
        lang_param = resolve_sarvam_lang(language_code)
        if not api_key:
            logger.info("Sarvam API key not configured; client should use browser Web Speech API fallback.")
            return STTResponse(
                transcript="",
                language_code=lang_param,
                confidence=0.0,
                provider="fallback_browser_required"
            )

        headers = {
            "api-subscription-key": api_key
        }

        try:
            files = {
                "file": (filename, audio_bytes, "audio/wav")
            }
            # Official current Sarvam STT model (Saaras) with transcribe mode
            data = {
                "model": "saaras:v2",
                "language_code": lang_param,
                "mode": "transcribe"
            }

            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(SARVAM_STT_URL, headers=headers, files=files, data=data)
                if resp.status_code == 200:
                    res_json = resp.json()
                    transcript = res_json.get("transcript", "")
                    return STTResponse(
                        transcript=transcript,
                        language_code=lang_param,
                        confidence=0.95,
                        provider="sarvam:saaras:v2"
                    )
                else:
                    logger.warning(f"Sarvam STT returned status {resp.status_code}")
                    return STTResponse(
                        transcript="",
                        language_code=lang_param,
                        confidence=0.0,
                        provider="fallback_browser_required"
                    )
        except Exception as e:
            logger.error(f"Error calling Sarvam STT: {e}")
            return STTResponse(
                transcript="",
                language_code=language_code,
                confidence=0.0,
                provider="fallback_browser_required"
            )

    @classmethod
    async def text_to_speech(cls, text: str, language: str = "kn", speaker: Optional[str] = None) -> TTSResponse:
        api_key = cls.get_api_key()
        if not api_key:
            return TTSResponse(
                audio_base64=None,
                provider="browser_speech_synthesis_fallback",
                success=False,
                error="Sarvam API key not configured. Fallback to browser TTS."
            )

        headers = {
            "api-subscription-key": api_key,
            "Content-Type": "application/json"
        }

        target_lang = resolve_sarvam_lang(language)
        chosen_speaker = speaker or SARVAM_SPEAKER_MAP.get(target_lang, "meera")

        payload = {
            "inputs": [text[:500]], # Sarvam TTS limit
            "target_language_code": target_lang,
            "speaker": chosen_speaker,
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.5,
            "speech_sample_rate": 22050,
            "enable_preprocessing": True,
            "model": "bulbul:v1"
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(SARVAM_TTS_URL, headers=headers, json=payload)
                if resp.status_code == 200:
                    res_json = resp.json()
                    # Sarvam returns {"audios": ["<base64_wav>"]}
                    audios = res_json.get("audios", [])
                    if audios and len(audios) > 0:
                        return TTSResponse(
                            audio_base64=audios[0],
                            audio_format="audio/wav",
                            provider="sarvam:bulbul:v1",
                            success=True
                        )
                    else:
                        return TTSResponse(
                            audio_base64=None,
                            provider="browser_speech_synthesis_fallback",
                            success=False,
                            error="No audio content returned by Sarvam TTS"
                        )
                else:
                    logger.warning(f"Sarvam TTS failed with {resp.status_code}: {resp.text}")
                    return TTSResponse(
                        audio_base64=None,
                        provider="browser_speech_synthesis_fallback",
                        success=False,
                        error=f"Sarvam API status {resp.status_code}"
                    )
        except Exception as e:
            logger.error(f"Error calling Sarvam TTS: {e}")
            return TTSResponse(
                audio_base64=None,
                provider="browser_speech_synthesis_fallback",
                success=False,
                error=str(e)
            )

