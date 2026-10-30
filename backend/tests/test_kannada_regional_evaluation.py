import asyncio
import pytest
from app.services.conversation_manager import ConversationManager
from app.services.gemini_extractor import extract_slots_heuristic
from app.models.schemas import FarmerProfile

def test_region_1_dharwad_north_karnataka():
    """Scenario 1: Dharwad / Hubballi dialect (ಹೊಲ ಐತ್ರಿ, ಖುಷ್ಕಿ, ಸಿಗ್ತದ್ರಿ)."""
    text = "ಧಾರವಾಡ ತಾಲೂಕಿನಾಗ ನಮ್ದು 5 ಎಕರೆ ಖುಷ್ಕಿ ಹೊಲ ಐತ್ರಿ. ಹತ್ತಿ ಮತ್ತು ಸೋಯಾಬೀನ್ ಬಿತ್ತನೆ ಮಾಡ್ಬೇಕಂತೀವಿ, ಯಾವ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಸಿಗ್ತದ್ರಿ?"
    slots = extract_slots_heuristic(text)
    assert slots.get("district") == "Dharwad"
    assert slots.get("land_area_acres") == 5.0
    assert "cotton" in slots.get("crops", [])
    assert "soybean" in slots.get("crops", [])
    assert slots.get("has_irrigation") is False

def test_region_2_belagavi_border_region():
    """Scenario 2: Belagavi / Gokak region (ಕಬ್ಬಿನ ತೋಟ, ಬೋರ್‌ವೆಲ್ ನೀರಾವರಿ)."""
    text = "ಬೆಳಗಾವಿ ಗೋಕಾಕ್ ಹತ್ರ ನಂದು 4 ಎಕರೆ ಕಬ್ಬಿನ ತೋಟ ಇದೆ. ಬೋರ್‌ವೆಲ್ ನೀರಾವರಿ ಇದೆ, ಡ್ರಿಪ್ ಇರಿಗೇಷನ್ ಸಬ್ಸಿಡಿ ಹೇಗೆ ಪಡೀಬೇಕು?"
    slots = extract_slots_heuristic(text)
    assert slots.get("district") == "Belagavi"
    assert slots.get("land_area_acres") == 4.0
    assert "sugarcane" in slots.get("crops", [])
    assert slots.get("has_irrigation") is True

def test_region_3_mandya_mysuru_southern_karnataka():
    """Scenario 3: Mandya / Maddur (ಸ್ವಂತ ಗದ್ದೆ, ಕಾಲುವೆ ನೀರು, ಭತ್ತ)."""
    text = "ಮಂಡ್ಯ ಜಿಲ್ಲೆಯ ಮದ್ದೂರಿನಲ್ಲಿ ನಮ್ಮ ಕುಟುಂಬಕ್ಕೆ 3 ಎಕರೆ ಸ್ವಂತ ಗದ್ದೆ ಇದೆ, ಕಾಲುವೆ ನೀರಿದೆ. ಭತ್ತ ನಾಟಿ ಮಾಡಿದ್ದೇವೆ, PM-KISAN ಹಣ ಬಂದಿಲ್ಲ."
    slots = extract_slots_heuristic(text)
    assert slots.get("district") == "Mandya"
    assert slots.get("land_area_acres") == 3.0
    assert "paddy" in slots.get("crops", [])
    assert slots.get("ownership_type") == "owner"
    assert slots.get("has_irrigation") is True

def test_region_4_kalaburagi_kalyana_karnataka():
    """Scenario 4: Kalaburagi / Jewargi (ತೊಗರಿ, ಜೋಳ, ಮಳೆಯಾಶ್ರಿತ)."""
    text = "ಕಲಬುರಗಿ ಜೇವರ್ಗಿ ಕಡೆ ನಮಗೆ 6 ಎಕರೆ ಮಳೆಯಾಶ್ರಿತ ಜಮೀನಿದೆ. ಪ್ರಮುಖವಾಗಿ ತೊಗರಿ ಮತ್ತು ಜೋಳ ಬೆಳೆಯುತ್ತಿದ್ದೇವೆ. ಬೆಳೆ ವಿಮೆ ಅರ್ಜಿ ಹೇಗೆ ಮಾಡುವುದು?"
    slots = extract_slots_heuristic(text)
    assert slots.get("district") == "Kalaburagi"
    assert slots.get("land_area_acres") == 6.0
    assert "tur" in slots.get("crops", [])
    assert "jowar" in slots.get("crops", [])
    assert slots.get("has_irrigation") is False

def test_region_5_coastal_mangaluru_udupi():
    """Scenario 5: Coastal Karnataka / Puttur (ಅಡಿಕೆ ತೋಟ, ಬಾವಿ ನೀರು)."""
    text = "ದಕ್ಷಿಣ ಕನ್ನಡ ಪುತ್ತೂರು ಬಳಿ 2.5 ಎಕರೆ ಅಡಿಕೆ ತೋಟವಿದೆ. ಬಾವಿ ನೀರು ಇದೆ. ಕೃಷಿ ಯಂತ್ರೋಪಕರಣಕ್ಕೆ ಸಹಾಯಧನ ಸಿಗುತ್ತದೆಯೇ?"
    slots = extract_slots_heuristic(text)
    assert slots.get("district") == "Dakshina Kannada"
    assert slots.get("land_area_acres") == 2.5
    assert "arecanut" in slots.get("crops", [])
    assert slots.get("has_irrigation") is True

def test_region_6_bengaluru_code_switching():
    """Scenario 6: Bengaluru / Nelamangala code-switching (3 ಎಕರೆ ಲ್ಯಾಂಡ್, ಟೊಮೆಟೊ ಮತ್ತು ರಾಗಿ ಕ್ರಾಪ್, ಬೋರ್‌ವೆಲ್)."""
    text = "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ ನೆಲಮಂಗಲದಲ್ಲಿ 3 ಎಕರೆ ಲ್ಯಾಂಡ್ ಇದೆ, ಟೊಮೆಟೊ ಮತ್ತು ರಾಗಿ ಕ್ರಾಪ್ ಇದೆ. ಬೋರ್‌ವೆಲ್ ಇದೆ, PM Kisan eligibility ಇದೆಯೇ?"
    slots = extract_slots_heuristic(text)
    assert slots.get("district") == "Bengaluru Rural"
    assert slots.get("land_area_acres") == 3.0
    assert "tomato" in slots.get("crops", [])
    assert "ragi" in slots.get("crops", [])
    assert slots.get("has_irrigation") is True

def test_conversational_botanical_follow_up():
    """Scenario 7: Natural conversational botanical query (Phase 5 requirement)."""
    q = "ನನ್ನ ಟೊಮೇಟೊ ಗಿಡದ ಎಲೆ ಹಳದಿ ಆಗ್ತಾ ಇದೆ. ಏನು ಮಾಡ್ಬೇಕು?"
    res = asyncio.run(ConversationManager.process_farmer_message(q, language="kn"))
    # Verifies advisory provides remedies and diagnostic follow-up questions
    assert "ಟೊಮೆಟೊ" in res.response_text or "ಅಂಗಮಾರಿ" in res.response_text or "ಶಿಲೀಂಧ್ರ" in res.response_text
    assert "ಟ್ರೈಕೋಡರ್ಮಾ" in res.response_text or "ಮ್ಯಾಂಕೋಜೆಬ್" in res.response_text
    assert "ಹಳದಿ" in res.response_text

def test_north_karnataka_dialect_style():
    """Verifies North Karnataka conversational dialect tuning."""
    q = "ನನ್ನ ಟೊಮೇಟೊ ಗಿಡದ ಎಲೆ ಹಳದಿ ಆಗ್ತಾ ಇದೆ. ಏನ್ ಮಾಡ್ಬೇಕ್ರಿ?"
    res = asyncio.run(ConversationManager.process_farmer_message(
        q, language="kn", speaking_style="north_karnataka"
    ))
    assert res.speaking_style == "north_karnataka"
    # Verifies regional honorifics and dialect tone
    assert "ಮಾಡ್ರೀ" in res.response_text or "ಸ್ಪ್ರೇ ಮಾಡ್ರೀ" in res.response_text or "ನೋಡ್ರೀ" in res.response_text or "ಹಾಕ್ರಿ" in res.response_text

def test_south_karnataka_dialect_style():
    """Verifies South Karnataka (Mandya/Mysuru) dialect tuning."""
    q = "ಮಂಡ್ಯ ಜಿಲ್ಲೆ, 3 ಎಕರೆ ಸ್ವಂತ ಗದ್ದೆ, ಭತ್ತ. ಯಾವ ಯೋಜನೆ ಸಿಗುತ್ತೆ?"
    res = asyncio.run(ConversationManager.process_farmer_message(
        q, language="kn", speaking_style="south_karnataka"
    ))
    assert res.speaking_style == "south_karnataka"
    assert "ಸ್ವಾಮಿ" in res.response_text or "ಕಣ್ರೀ" in res.response_text

def test_multi_turn_conversational_memory():
    """Verifies multi-turn memory retains context for follow-up inquiries."""
    session_id = "test-multi-turn-session-123"
    # Turn 1: Farmer mentions initial tomato symptom
    t1_msg = "ನನ್ನ ಟೊಮೇಟೊ ಗಿಡದ ಎಲೆ ಹಳದಿ ಆಗ್ತಾ ಇದೆ. ಏನು ಮಾಡ್ಬೇಕು?"
    res1 = asyncio.run(ConversationManager.process_farmer_message(
        t1_msg, session_id=session_id, language="kn"
    ))
    assert "ಅಂಗಮಾರಿ" in res1.response_text or "ಟೊಮೆಟೊ" in res1.response_text

    # Turn 2: Farmer replies to the diagnostic questions with specific details (without repeating crop name)
    t2_msg = "ಕೆಳಗಿನ ಎಲೆಗಳಲ್ಲಿ ಕಪ್ಪು ಚುಕ್ಕೆಗಳು ಕಾಣ್ತಾ ಇವೆ. ಎಷ್ಟು ದಿನದಲ್ಲಿ ಔಷಧ ಸಿಂಪಡಿಸಬೇಕು?"
    res2 = asyncio.run(ConversationManager.process_farmer_message(
        t2_msg, session_id=session_id, language="kn"
    ))
    # System should connect turn 2 to turn 1's disease topic and give precise spray timeline
    assert "ಮ್ಯಾಂಕೋಜೆಬ್" in res2.response_text or "ಸಿಂಪಡಣೆ" in res2.response_text or "ದಿನಗಳ ನಂತರ" in res2.response_text
    
    # Cleanup session
    ConversationManager.reset_session(session_id)

