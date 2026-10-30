import os
import wave
import tempfile
import pytest
from app.services.sarvam_service import (
    probe_audio_duration,
    slice_audio_file,
    merge_overlapping_transcripts
)

def test_merge_overlapping_transcripts():
    # Test case 1: 3-chunk overlap (500-word paragraph simulation)
    chunk1 = "I am a small farmer in Belagavi Karnataka with three acres of land and my main crop is tomato"
    chunk2 = "three acres of land and my main crop is tomato but recently I have observed yellow leaves and black spots"
    chunk3 = "yellow leaves and black spots on the lower foliage which is spreading to other plants rapidly"

    merged = merge_overlapping_transcripts([chunk1, chunk2, chunk3])
    expected = "I am a small farmer in Belagavi Karnataka with three acres of land and my main crop is tomato but recently I have observed yellow leaves and black spots on the lower foliage which is spreading to other plants rapidly"
    assert merged == expected

def test_probe_and_slice_audio():
    # Create 60-second test WAV file
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        path = f.name

    try:
        with wave.open(path, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(16000)
            wf.writeframes(b"\x00\x00" * 16000 * 60)

        duration = probe_audio_duration(path)
        assert duration is not None
        assert 59.0 <= duration <= 61.0

        # Slice into 24-second chunks with 2-second overlap
        chunks = slice_audio_file(path, duration, chunk_dur=24.0, overlap=2.0)
        assert len(chunks) == 3 # 0-24s, 22-46s, 44-60s
        for c in chunks:
            assert os.path.exists(c)
            with wave.open(c, "rb") as cwf:
                cdur = cwf.getnframes() / cwf.getframerate()
                assert cdur <= 24.5
            os.remove(c)
    finally:
        if os.path.exists(path):
            os.remove(path)

