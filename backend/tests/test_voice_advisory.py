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

def test_500_word_full_farming_narrative():
    narrative = """
    Hello Krishi Mitra AI, I am a farmer from Belagavi district in northern Karnataka and I need your urgent help.
    I own about 4.5 acres of agricultural land which has been cultivated by my family for many generations.
    On my land, I am primarily growing tomato on two acres, sugarcane on one and a half acres, and paddy on one acre.
    We have a borewell on our farm so we have irrigation facility, but recently the weather has been unpredictable with unseasonal humidity.
    Over the last ten days, I have noticed severe problems in my tomato field. The leaves at the bottom of the plants started turning yellow,
    and now there are distinct concentric brown and black spots appearing on the leaves. The growth of the tomato plants has become completely stunted,
    and some of the developing fruits have sunken dark patches near the stem end. I spoke with a neighboring farmer who suggested it could be early blight
    or a bacterial infection, but I am not sure what fungicide or organic bio-agent I should spray. I have tried spraying simple neem oil three days ago,
    but the spots are still multiplying and moving up toward the top branches of the crop.
    What is the exact reason for these symptoms on my tomato crop, and what specific protective measures, chemicals, or bio-fungicides like Trichoderma or Mancozeb
    should I apply immediately to save the harvest?
    Secondly, because of these crop losses and escalating input costs for fertilizers and seeds, I am facing severe financial hardship.
    I want to understand what government welfare schemes and financial subsidies are available for farmers like me with four point five acres of land in Karnataka.
    Am I eligible for PM-KISAN Samman Nidhi to receive direct financial assistance, and what are the land ceiling rules?
    Also, since my tomato and paddy crops are suffering from pest damage and climate variations, how does the PMFBY Pradhan Mantri Fasal Bima Yojana crop insurance scheme work?
    What premium rate do I have to pay for kharif or commercial horticulture crops, what documentation is required, and how do I register an insurance claim if more than thirty percent of my tomato crop is damaged?
    Lastly, are there any state government subsidies for drip irrigation systems, solar water pumps, or mechanized equipment like power tillers to reduce my cultivation expenses?
    Please give me a complete step-by-step guidance covering both my crop disease remedy and the government subsidy schemes I can apply for.
    """
    res = asyncio.run(ConversationManager.process_farmer_message(narrative, language="en"))
    assert res.extracted_profile.district == "Belagavi"
    assert res.extracted_profile.land_area_acres == 4.5
    assert "tomato" in res.extracted_profile.crops
    assert res.extracted_profile.ownership_type == "owner"
    assert res.extracted_profile.has_irrigation is True
    assert "Early Blight" in res.response_text or "Septoria" in res.response_text or "Mancozeb" in res.response_text
