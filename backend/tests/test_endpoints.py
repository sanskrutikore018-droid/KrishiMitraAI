import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["schemes_loaded"] == 5

def test_get_schemes():
    response = client.get("/api/schemes")
    assert response.status_code == 200
    schemes = response.json()
    assert len(schemes) == 5
    ids = [s["id"] for s in schemes]
    assert "pm-kisan" in ids
    assert "pmfby" in ids
    assert "demo-micro-irrigation" in ids
    assert "demo-agri-equipment" in ids
    assert "demo-soil-improvement" in ids

def test_evaluate_eligibility_api():
    payload = {
        "district": "Belagavi",
        "land_area_acres": 3.0,
        "crops": ["paddy"],
        "ownership_type": "owner",
        "has_irrigation": True,
        "is_income_tax_payer": False
    }
    response = client.post("/api/eligibility/evaluate", json=payload)
    assert response.status_code == 200
    evaluations = response.json()
    assert len(evaluations) == 5
    pm_kisan_eval = next(e for e in evaluations if e["scheme_id"] == "pm-kisan")
    assert pm_kisan_eval["overall_status"] == "eligible"

def test_chat_interaction_kannada_slot_extraction():
    # Spoken farmer message in Kannada
    payload = {
        "message": "ನನಗೆ ಬೆಳಗಾವಿ ಜಿಲ್ಲೆಯಲ್ಲಿ 4 ಎಕರೆ ಸ್ವಂತ ಜಮೀನು ಇದೆ, ನಾನು ಭತ್ತ ಬೆಳೆಯುತ್ತಿದ್ದೇನೆ.",
        "language": "kn"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] is not None
    profile = data["extracted_profile"]
    assert profile["district"] == "Belagavi"
    assert profile["land_area_acres"] == 4.0
    assert profile["ownership_type"] == "owner"
    assert "paddy" in profile["crops"]
    assert len(data["scheme_evaluations"]) == 5
    assert len(data["suggested_quick_replies"]) > 0

def test_voice_stt_without_key_graceful_fallback():
    # Sending dummy wav bytes without Sarvam API key should not crash
    dummy_wav = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
    files = {"file": ("test.wav", dummy_wav, "audio/wav")}
    data = {"language_code": "kn-IN"}
    response = client.post("/api/voice/stt", files=files, data=data)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["provider"] == "fallback_browser_required"

def test_voice_tts_without_key_graceful_fallback():
    payload = {
        "text": "ನಮಸ್ಕಾರ, ನಿಮ್ಮ ಜಿಲ್ಲೆ ಯಾವುದು?",
        "language": "kn"
    }
    response = client.post("/api/voice/tts", json=payload)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is False
    assert res_data["provider"] == "browser_speech_synthesis_fallback"

