import os
import io
import re
import base64
import logging
import tempfile
import asyncio
import subprocess
from pathlib import Path
from typing import Optional, Dict, Any, List
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

def get_ffmpeg_executable() -> Optional[str]:
    """Finds ffmpeg executable using imageio-ffmpeg or system path."""
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        pass
    import shutil
    return shutil.which("ffmpeg")

def probe_audio_duration(file_path: str) -> Optional[float]:
    """Probes exact audio duration in seconds using ffmpeg or wave."""
    # 1. Try wave module for WAV files
    if file_path.lower().endswith(".wav"):
        try:
            import wave
            with wave.open(file_path, "rb") as wf:
                return wf.getnframes() / float(wf.getframerate())
        except Exception:
            pass

    # 2. Try ffmpeg probe
    ffmpeg_exe = get_ffmpeg_executable()
    if not ffmpeg_exe:
        return None

    try:
        cmd = [ffmpeg_exe, "-i", file_path]
        proc = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True, timeout=10)
        match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.?\d*)", proc.stderr)
        if match:
            h, m, s = match.groups()
            return int(h) * 3600 + int(m) * 60 + float(s)
    except Exception as e:
        logger.warning(f"Failed to probe audio duration with ffmpeg: {e}")

    return None

def slice_audio_file(file_path: str, duration: float, chunk_dur: float = 24.0, overlap: float = 2.0) -> List[str]:
    """Slices long audio into overlapping 16kHz mono WAV chunks under 25s for Sarvam synchronous STT."""
    ffmpeg_exe = get_ffmpeg_executable()
    if not ffmpeg_exe:
        return []

    step = max(5.0, chunk_dur - overlap)
    chunks = []
    curr = 0.0
    idx = 0

    while curr < duration:
        actual_len = min(chunk_dur, duration - curr)
        if actual_len < 1.0:
            break

        base, _ = os.path.splitext(file_path)
        chunk_path = f"{base}_chunk_{idx}.wav"
        slice_cmd = [
            ffmpeg_exe, "-y",
            "-ss", f"{curr:.3f}",
            "-t", f"{actual_len:.3f}",
            "-i", file_path,
            "-ar", "16000",
            "-ac", "1",
            "-c:a", "pcm_s16le",
            chunk_path
        ]
        try:
            subprocess.run(slice_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, timeout=30)
            chunks.append(chunk_path)
        except Exception as e:
            logger.error(f"Error slicing audio chunk {idx} at {curr}s: {e}")
            break

        curr += step
        idx += 1

    return chunks

def merge_overlapping_transcripts(chunks: List[str]) -> str:
    """Merges overlapping transcript chunks, deduplicating matching boundary phrases."""
    cleaned = [c.strip() for c in chunks if c and c.strip()]
    if not cleaned:
        return ""
    if len(cleaned) == 1:
        return cleaned[0]

    full_text = cleaned[0]
    for next_chunk in cleaned[1:]:
        words_prev = full_text.split()
        words_next = next_chunk.split()

        max_overlap = min(len(words_prev), len(words_next), 15)
        best_overlap_len = 0

        for k in range(max_overlap, 1, -1):
            prev_suffix = "".join(ch for ch in " ".join(words_prev[-k:]).lower() if ch.isalnum() or ch.isspace())
            next_prefix = "".join(ch for ch in " ".join(words_next[:k]).lower() if ch.isalnum() or ch.isspace())
            if prev_suffix == next_prefix:
                best_overlap_len = k
                break

        if best_overlap_len > 0:
            remainder = " ".join(words_next[best_overlap_len:])
            if remainder:
                full_text = full_text + " " + remainder
        else:
            full_text = full_text + " " + next_chunk

    return full_text

class SarvamVoiceService:

    @classmethod
    def get_api_key(cls) -> Optional[str]:
        key = os.getenv("SARVAM_API_KEY", "").strip()
        if not key or key == "your_sarvam_api_key_here":
            return None
        return key

    @classmethod
    async def _call_sarvam_stt_single(
        cls,
        client: httpx.AsyncClient,
        audio_bytes: bytes,
        filename: str,
        lang_param: str,
        api_key: str
    ) -> str:
        """Sends a single audio chunk (<= 30s) to Sarvam AI STT."""
        headers = {
            "api-subscription-key": api_key
        }

        if filename.endswith(".webm"):
            content_type = "audio/webm"
        elif filename.endswith(".mp3"):
            content_type = "audio/mpeg"
        elif filename.endswith(".ogg"):
            content_type = "audio/ogg"
        elif filename.endswith(".m4a") or filename.endswith(".mp4"):
            content_type = "audio/mp4"
        else:
            content_type = "audio/wav"

        files = {
            "file": (filename, audio_bytes, content_type)
        }
        data = {
            "model": "saaras:v3",
            "language_code": lang_param,
            "mode": "transcribe"
        }

        resp = await client.post(SARVAM_STT_URL, headers=headers, files=files, data=data)
        if resp.status_code == 400 and "model" in resp.text.lower():
            data["model"] = "saaras:v2"
            resp = await client.post(SARVAM_STT_URL, headers=headers, files=files, data=data)

        if resp.status_code == 200:
            res_json = resp.json()
            return res_json.get("transcript", "").strip()
        else:
            logger.warning(f"Sarvam STT chunk returned status {resp.status_code}: {resp.text}")
            return ""

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

        suffix = Path(filename).suffix or ".wav"
        temp_input = None
        temp_chunks: List[str] = []

        try:
            # 1. Write audio bytes to temporary file for duration probe & potential chunking
            with tempfile.NamedTemporaryFile(suffix=f".tmp{suffix}", delete=False) as tf:
                tf.write(audio_bytes)
                temp_input = tf.name

            duration = probe_audio_duration(temp_input)
            logger.info(f"Received audio for STT: {len(audio_bytes)} bytes, probed duration = {duration}s")

            async with httpx.AsyncClient(timeout=90.0) as client:
                # 2. If short audio (<= 28s), send directly in single call
                if duration is None or duration <= 28.0:
                    transcript = await cls._call_sarvam_stt_single(client, audio_bytes, filename, lang_param, api_key)
                    if transcript:
                        logger.info(f"Sarvam STT single-call success ({len(transcript)} chars): '{transcript[:60]}...'")
                        return STTResponse(
                            transcript=transcript,
                            language_code=lang_param,
                            confidence=0.98,
                            provider="sarvam:saaras"
                        )
                    else:
                        return STTResponse(
                            transcript="",
                            language_code=lang_param,
                            confidence=0.0,
                            provider="fallback_browser_required"
                        )

                # 3. Long audio (> 28s): Slice into overlapping 24s chunks to comply with Sarvam 30s limit
                logger.info(f"Long audio detected ({duration:.2f}s > 28s). Slicing into overlapping chunks for 500-600 word natural speech support...")
                temp_chunks = slice_audio_file(temp_input, duration, chunk_dur=24.0, overlap=2.0)

                if not temp_chunks:
                    # Fallback to direct call if slicing fails
                    transcript = await cls._call_sarvam_stt_single(client, audio_bytes, filename, lang_param, api_key)
                    return STTResponse(
                        transcript=transcript,
                        language_code=lang_param,
                        confidence=0.98 if transcript else 0.0,
                        provider="sarvam:saaras"
                    )

                logger.info(f"Processing {len(temp_chunks)} audio chunks concurrently with Sarvam AI STT...")

                # Read all chunk bytes and launch concurrent requests
                async def transcribe_chunk(idx: int, path: str) -> str:
                    try:
                        with open(path, "rb") as cf:
                            c_bytes = cf.read()
                        res = await cls._call_sarvam_stt_single(client, c_bytes, f"chunk_{idx}.wav", lang_param, api_key)
                        return res
                    except Exception as ce:
                        logger.error(f"Error transcribing chunk {idx}: {ce}")
                        return ""

                tasks = [transcribe_chunk(i, path) for i, path in enumerate(temp_chunks)]
                chunk_transcripts = await asyncio.gather(*tasks)

                # 4. Merge transcripts with overlap deduplication
                unified_transcript = merge_overlapping_transcripts(list(chunk_transcripts))
                logger.info(f"Successfully assembled {len(temp_chunks)} chunks into unified transcript ({len(unified_transcript)} chars, {len(unified_transcript.split())} words)!")

                return STTResponse(
                    transcript=unified_transcript,
                    language_code=lang_param,
                    confidence=0.98,
                    provider="sarvam:saaras-chunked"
                )

        except Exception as e:
            logger.error(f"Error in Sarvam STT pipeline: {e}")
            return STTResponse(
                transcript="",
                language_code=language_code,
                confidence=0.0,
                provider="fallback_browser_required"
            )
        finally:
            # Clean up temporary audio files safely
            if temp_input and os.path.exists(temp_input):
                try:
                    os.remove(temp_input)
                except Exception:
                    pass
            for cp in temp_chunks:
                if os.path.exists(cp):
                    try:
                        os.remove(cp)
                    except Exception:
                        pass

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
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(SARVAM_TTS_URL, headers=headers, json=payload)
                if resp.status_code == 200:
                    res_json = resp.json()
                    audios = res_json.get("audios", [])
                    if audios and len(audios) > 0:
                        audio_base64 = audios[0]
                        return TTSResponse(
                            audio_base64=audio_base64,
                            audio_format="audio/wav",
                            provider="sarvam:bulbul:v1",
                            success=True
                        )
                return TTSResponse(
                    audio_base64=None,
                    provider="browser_speech_synthesis_fallback",
                    success=False,
                    error=f"Sarvam TTS failed with status {resp.status_code}"
                )
        except Exception as e:
            logger.error(f"Error calling Sarvam TTS: {e}")
            return TTSResponse(
                audio_base64=None,
                provider="browser_speech_synthesis_fallback",
                success=False,
                error=str(e)
            )
