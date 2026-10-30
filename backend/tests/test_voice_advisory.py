import asyncio
import pytest
from app.services.conversation_manager import ConversationManager
from app.models.schemas import FarmerProfile

def test_long_tomato_disease_query_en():
    q = "My tomato plants have yellow leaves, the growth is very slow, and I have noticed small spots on the leaves for the last few days. What could be the reason, and what should I do to protect my crop?"
    res = asyncio.run(ConversationManager.process_farmer_message(q, language="en"))
    assert "Early Blight" in res.response_text or "Septoria" in res.response_text or "Mancozeb" in res.response_text

def test_long_scheme_availability_query_en():
    q = "I am a farmer from Karnataka, and I want to know which government schemes are available for small farmers, what eligibility conditions I must satisfy, and how I can apply for those schemes."
    res = asyncio.run(ConversationManager.process_farmer_message(q, language="en"))
    assert "PM-KISAN" in res.response_text or "government" in res.response_text.lower()

def test_kannada_tomato_disease_query():
    q = "ನನ್ನ ಟೊಮೆಟೊ ಗಿಡಗಳ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ ಮತ್ತು ಎಲೆಗಳ ಮೇಲೆ ಕಪ್ಪು ಚುಕ್ಕೆಗಳು ಕಾಣಿಸಿಕೊಂಡಿವೆ. ಇದಕ್ಕೆ ಕಾರಣವೇನು ಮತ್ತು ನಾನು ಏನು ಪರಿಹಾರ ಮಾಡಬೇಕು?"
    res = asyncio.run(ConversationManager.process_farmer_message(q, language="kn"))
    assert "ಟೊಮೆಟೊ" in res.response_text or "ಶಿಲೀಂಧ್ರ" in res.response_text or "ಬೆಳೆ" in res.response_text

def test_hindi_scheme_query():
    q = "मैं एक छोटा किसान हूँ और मुझे जानना है कि छोटे किसानों के लिए कौन सी सरकारी योजनाएं उपलब्ध हैं और उनके लिए क्या पात्रता है?"
    res = asyncio.run(ConversationManager.process_farmer_message(q, language="hi"))
    assert "योजना" in res.response_text or "पीएम-किसान" in res.response_text

def test_profile_slot_extraction_boundaries():
    profile = FarmerProfile(district="Belagavi")
    q = "I have 2.5 acres of land and I own this farm"
    res = asyncio.run(ConversationManager.process_farmer_message(q, language="en", profile_override=profile))
    assert res.extracted_profile.land_area_acres == 2.5
    assert res.extracted_profile.ownership_type == "owner"
