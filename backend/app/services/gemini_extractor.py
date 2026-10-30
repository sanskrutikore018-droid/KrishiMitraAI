import os
import re
import json
import logging
from typing import Dict, Any, Optional, List
import httpx
from app.models.schemas import FarmerProfile
from app.services.eligibility import canonicalize_crop, KARNATAKA_DISTRICTS

logger = logging.getLogger(__name__)

KANNADA_DISTRICT_MAP = {
    "ಬೆಳಗಾವಿ": "Belagavi", "ಬೆಳಗಾಂ": "Belagavi", "belagavi": "Belagavi", "belgaum": "Belagavi",
    "ಮಂಡ್ಯ": "Mandya", "mandya": "Mandya",
    "ಮೈಸೂರು": "Mysuru", "mysuru": "Mysuru", "mysore": "Mysuru",
    "ಶಿವಮೊಗ್ಗ": "Shivamogga", "shivamogga": "Shivamogga", "shimoga": "Shivamogga",
    "ಧಾರವಾಡ": "Dharwad", "dharwad": "Dharwad",
    "ದಾವಣಗೆರೆ": "Davanagere", "davanagere": "Davanagere",
    "ಬಾಗಲಕೋಟೆ": "Bagalkot", "bagalkot": "Bagalkot",
    "ಬಳ್ಳಾರಿ": "Ballari", "ballari": "Ballari", "bellary": "Ballari",
    "ವಿಜಯನಗರ": "Vijayanagara", "vijayanagara": "Vijayanagara",
    "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ": "Bengaluru Rural", "bengaluru rural": "Bengaluru Rural",
    "ಬೆಂಗಳೂರು": "Bengaluru Urban", "bengaluru urban": "Bengaluru Urban", "bangalore": "Bengaluru Urban",
    "ಬೀದರ್": "Bidar", "bidar": "Bidar",
    "ಚಾಮರಾಜನಗರ": "Chamarajanagar", "chamarajanagar": "Chamarajanagar",
    "ಚಿಕ್ಕಬಳ್ಳಾಪುರ": "Chikkaballapur", "chikkaballapur": "Chikkaballapur",
    "ಚಿಕ್ಕಮಗಳೂರು": "Chikkamagaluru", "chikkamagaluru": "Chikkamagaluru",
    "ಚಿತ್ರದುರ್ಗ": "Chitradurga", "chitradurga": "Chitradurga",
    "ದಕ್ಷಿಣ ಕನ್ನಡ": "Dakshina Kannada", "dakshina kannada": "Dakshina Kannada", "mangalore": "Dakshina Kannada",
    "ಗದಗ": "Gadag", "gadag": "Gadag",
    "ಹಾಸನ": "Hassan", "hassan": "Hassan",
    "ಹಾವೇರಿ": "Haveri", "haveri": "Haveri",
    "ಕಲಬುರಗಿ": "Kalaburagi", "ಗುಲ್ಬರ್ಗ": "Kalaburagi", "kalaburagi": "Kalaburagi", "gulbarga": "Kalaburagi",
    "ಕೊಡಗು": "Kodagu", "kodagu": "Kodagu", "coorg": "Kodagu",
    "ಕೋಲಾರ": "Kolar", "kolar": "Kolar",
    "ಕೊಪ್ಪಳ": "Koppal", "koppal": "Koppal",
    "ರಾಯಚೂರು": "Raichur", "raichur": "Raichur",
    "ರಾಮನಗರ": "Ramanagara", "ramanagara": "Ramanagara",
    "ತುಮಕೂರು": "Tumakuru", "tumakuru": "Tumakuru", "tumkur": "Tumakuru",
    "ಉಡುಪಿ": "Udupi", "udupi": "Udupi",
    "ಉತ್ತರ ಕನ್ನಡ": "Uttara Kannada", "uttara kannada": "Uttara Kannada", "karwar": "Uttara Kannada",
    "ಯಾದಗಿರಿ": "Yadgir", "yadgir": "Yadgir"
}

KANNADA_CROP_KEYWORDS = {
    "ಭತ್ತ": "paddy", "ಭತ್ತದ": "paddy", "ಅಕ್ಕಿ": "paddy", "bhatta": "paddy", "rice": "paddy", "paddy": "paddy",
    "ರಾಗಿ": "ragi", "ರಾಗಿಯ": "ragi", "ragi": "ragi",
    "ಕಬ್ಬು": "sugarcane", "ಕಬ್ಬಿನ": "sugarcane", "kabbu": "sugarcane", "sugarcane": "sugarcane",
    "ಜೋಳ": "jowar", "ಜೋಳದ": "jowar", "jola": "jowar", "jowar": "jowar",
    "ಮೆಕ್ಕೆಜೋಳ": "maize", "ಮೆಕ್ಕೆಜೋಳದ": "maize", "maize": "maize", "corn": "maize",
    "ಹತ್ತಿ": "cotton", "ಹತ್ತಿಯ": "cotton", "hatti": "cotton", "cotton": "cotton",
    "ಶೇಂಗಾ": "groundnut", "ಶೇಂಗಾದ": "groundnut", "ಕಡಲೆಕಾಯಿ": "groundnut", "groundnut": "groundnut", "peanut": "groundnut",
    "ಸೂರ್ಯಕಾಂತಿ": "sunflower", "sunflower": "sunflower",
    "ಸೋಯಾಬೀನ್": "soybean", "soyabean": "soybean",
    "ತೊಗರಿ": "tur", "ತೊಗರಿಯ": "tur", "togari": "tur", "tur": "tur",
    "ಕಡಲೆ": "gram", "ಕಡಲೆಯ": "gram", "kadale": "gram", "gram": "gram", "chickpea": "gram",
    "ಹೆಸರು": "moong", "hesaru": "moong", "moong": "moong",
    "ಉದ್ದು": "urad", "uddu": "urad", "urad": "urad",
    "ಈರುಳ್ಳಿ": "onion", "eerulli": "onion", "onion": "onion",
    "ಆಲೂಗಡ್ಡೆ": "potato", "aloo": "potato", "potato": "potato",
    "ಮೆಣಸಿನಕಾಯಿ": "chilli", "menasinakai": "chilli", "chilli": "chilli",
    "ಟೊಮೆಟೊ": "tomato", "ಟೊಮೇಟೊ": "tomato", "ತಮೋಟ": "tomato", "tamata": "tomato", "tomato": "tomato",
    "ಅಡಿಕೆ": "arecanut", "ಅಡಿಕೆಯ": "arecanut", "adike": "arecanut", "arecanut": "arecanut",
    "ಕಾಫಿ": "coffee", "kaapi": "coffee", "coffee": "coffee",
    "ಬಾಳೆ": "banana", "bale": "banana", "banana": "banana",
    "ದಾಳಿಂಬೆ": "pomegranate", "dalimbe": "pomegranate", "pomegranate": "pomegranate",
    "ದ್ರಾಕ್ಷಿ": "grapes", "drakshi": "grapes", "grapes": "grapes",
    "ಗೋಧಿ": "wheat", "godhi": "wheat", "wheat": "wheat",
    # Hindi and Marathi crop terms
    "गेहूं": "wheat", "गहू": "wheat",
    "धान": "paddy", "चावल": "paddy", "भात": "paddy", "तांदूळ": "paddy",
    "गन्ना": "sugarcane", "ऊस": "sugarcane",
    "कपास": "cotton", "कापूस": "cotton",
    "सोयाबीन": "soybean", "सोयाबिन": "soybean",
    "मक्का": "maize", "मका": "maize",
    "चना": "gram", "हरभरा": "gram", "छोला": "gram",
    "अरहर": "tur", "तूर": "tur", "दाल": "tur",
    "मूंग": "moong", "मूग": "moong",
    "उड़द": "urad", "उडीद": "urad",
    "मूंगफली": "groundnut", "भुईमूग": "groundnut", "शेंगदाणा": "groundnut",
    "बाजरा": "bajra", "बाजरी": "bajra",
    "ज्वार": "jowar", "ज्वारी": "jowar",
    "प्याज़": "onion", "प्याज": "onion", "कांदा": "onion",
    "आलू": "potato", "बटाटा": "potato",
    "टमाटर": "tomato", "टोमॅटो": "tomato",
    "मिर्च": "chilli", "मिरची": "chilli",
    "अनार": "pomegranate", "डाळिंब": "pomegranate",
    "अंगूर": "grapes", "द्राक्षे": "grapes",
    "सरसों": "mustard", "मोहरी": "mustard"
}

MULTILINGUAL_DISTRICT_MAP = {
    # Hindi
    "बेलगावी": "Belagavi", "बेलगाम": "Belagavi",
    "मांड्या": "Mandya", "मंड्या": "Mandya",
    "मैसूर": "Mysuru", "मैसुरु": "Mysuru",
    "शिमोगा": "Shivamogga", "शिवमोग्गा": "Shivamogga",
    "धारवाड़": "Dharwad", "धारवाड": "Dharwad",
    "दावणगेरे": "Davanagere", "बागलकोट": "Bagalkot",
    "बेलारी": "Ballari", "विजयनगर": "Vijayanagara",
    "बीदर": "Bidar", "हासन": "Hassan", "हावेरी": "Haveri",
    "कलबुर्गी": "Kalaburagi", "गुलबर्गा": "Kalaburagi",
    "कोलार": "Kolar", "कोप्पल": "Koppal", "रायचूर": "Raichur",
    "तुमकुर": "Tumakuru", "उडुपी": "Udupi", "उत्तर कन्नड़": "Uttara Kannada",
    "दक्षिण कन्नड़": "Dakshina Kannada", "यादगीर": "Yadgir",
    # Marathi
    "बेळगाव": "Belagavi", "बेळगावी": "Belagavi",
    "धारवाड": "Dharwad", "म्हैसूर": "Mysuru", "शिमोगा": "Shivamogga",
    "गुलबर्गा": "Kalaburagi", "कलबुर्गी": "Kalaburagi", "रायचूर": "Raichur"
}

def extract_slots_heuristic(text: str) -> Dict[str, Any]:
    """Deterministic regex and keyword extractor for Kannada, Hindi, Marathi, and English."""
    extracted: Dict[str, Any] = {}
    lower_text = text.lower()

    # 1. District extraction
    for k_name, en_district in KANNADA_DISTRICT_MAP.items():
        if k_name in lower_text:
            extracted["district"] = en_district
            break
    if "district" not in extracted:
        for m_name, en_district in MULTILINGUAL_DISTRICT_MAP.items():
            if m_name in text:
                extracted["district"] = en_district
                break

    # 2. Land area extraction
    # Patterns like: "5 ಎಕರೆ", "2.5 acre", "10 acres", "40 ಗುಂಟೆ", "3 एकड़", "4 एकर", "20 गुंठे"
    guntha_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:ಗುಂಟೆ|ಗಂಟೆ|गुंठे|गुंठा|गुंठे|gunta|guntas)", text, re.IGNORECASE)
    if guntha_match:
        guntas = float(guntha_match.group(1))
        extracted["land_area_acres"] = round(guntas / 40.0, 2)
    else:
        acre_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:ಎಕರೆ|ಎಕ್ರೆ|एकड़|एकर|acres?|\bac\b)", text, re.IGNORECASE)
        if acre_match:
            extracted["land_area_acres"] = float(acre_match.group(1))

    # 3. Ownership extraction
    if any(w in lower_text for w in [
        "ಸ್ವಂತ", "ಮಾಲೀಕ", "ನನ್ನ ಭೂಮಿ",
        "मालिक", "खुद की", "अपनी जमीन", "स्वयं की",
        "मालक", "स्वतःची", "स्वतःची जमीन",
        "own", "owner", "ownership"
    ]):
        extracted["ownership_type"] = "owner"
    elif any(w in lower_text for w in [
        "ಗೇಣಿ", "ಬಾಡಿಗೆ", "ಕೌಲು",
        "किरायेदार", "बटाईदार", "पट्टेदार",
        "भाडेकरू", "कुळ", "भाडेतत्त्वावर",
        "tenant", "lease", "rent"
    ]):
        extracted["ownership_type"] = "tenant"
    elif any(w in lower_text for w in [
        "ಪಾಲು", "ಪಾಲುದಾರ",
        "बटाई", "साझेदार", "भागीदार", "हिस्सेदार",
        "वाटणीदार", "भागीदारी",
        "sharecropper"
    ]):
        extracted["ownership_type"] = "sharecropper"

    # 4. Crop extraction
    detected_crops = set()
    for kw, crop_en in KANNADA_CROP_KEYWORDS.items():
        if kw in lower_text or kw in text:
            detected_crops.add(crop_en)
    if detected_crops:
        extracted["crops"] = list(detected_crops)

    # 5. Irrigation extraction
    if any(w in lower_text or w in text for w in [
        "ಬೋರ್‌ವೆಲ್", "ಬೋರ್ವೆಲ್", "ಬಾವಿ", "ಕಾಲುವೆ", "ಹನಿ ನೀರಾವರಿ",
        "बोरवेल", "नलकूप", "कुआं", "कुआँ", "नहर", "सिंचाई", "ड्रिप",
        "कूपनलिका", "विहीर", "कालवा", "ठिबक सिंचन", "बागायत",
        "borewell", "well", "canal", "irrigated", "drip"
    ]):
        extracted["has_irrigation"] = True
    elif any(w in lower_text or w in text for w in [
        "ಮಳೆ ಆಶ್ರಯ", "ಮಳೆಯಾಶ್ರಿತ", "ಮಳೆಯಾಧಾರಿತ", "ಖುಷ್ಕಿ", "ನೀರಿಲ್ಲ",
        "बारिश पर आधारित", "वर्षा आधारित", "असिंचित", "सूखा", "पानी नहीं है",
        "पावसावर", "कोरडवाहू", "जिरायत", "पाणी नाही",
        "rainfed", "dryland", "no water"
    ]):
        extracted["has_irrigation"] = False

    # 6. Season extraction
    if any(w in lower_text or w in text for w in ["ಮುಂಗಾರು", "ಖಾರೀಫ್", "खरीफ", "खरीप", "kharif"]):
        extracted["season"] = "kharif"
    elif any(w in lower_text or w in text for w in ["ಹಿಂಗಾರು", "ರಬಿ", "रबी", "रब्बी", "rabi"]):
        extracted["season"] = "rabi"
    elif any(w in lower_text or w in text for w in ["ಬೇಸಿಗೆ", "जायद", "उन्हाळी", "summer"]):
        extracted["season"] = "summer"

    # 7. Tax exclusion check
    if any(w in lower_text or w in text for w in ["ತೆರಿಗೆ ಕಟ್ಟುತ್ತೇನೆ", "इनकम टैक्स", "आयकर", "उत्पन्न कर", "tax payer", "income tax"]):
        extracted["is_income_tax_payer"] = True

    return extracted

async def extract_slots_with_gemini(text: str, current_profile: FarmerProfile) -> FarmerProfile:
    """Uses Gemini API (if key available) or heuristic fallback to parse farmer input."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    # Always run heuristic extractor as baseline
    heuristic_data = extract_slots_heuristic(text)

    if not api_key or api_key == "your_gemini_api_key_here":
        logger.info("Using deterministic heuristic parser (no GEMINI_API_KEY set).")
        return merge_profile(current_profile, heuristic_data)

    prompt = f"""
You are an expert NLP extraction engine for Indian farmers in Karnataka, India.
Given a farmer's spoken or typed message in Kannada or English (or code-mixed Kanglish), extract agricultural profile parameters.

Existing profile so far:
{current_profile.model_dump_json()}

Farmer's new message:
"{text}"

Return ONLY a valid JSON object with the following schema:
{{
  "district": "<Karnataka district in English e.g. Belagavi, Mandya, Shimoga or null>",
  "land_area_acres": <number or null>,
  "crops": ["<crop names standardized in English lowercase e.g. paddy, ragi, sugarcane, maize, cotton>"],
  "ownership_type": "<'owner' or 'tenant' or 'sharecropper' or null>",
  "season": "<'kharif' or 'rabi' or 'summer' or 'annual' or null>",
  "has_irrigation": <true or false or null>,
  "is_income_tax_payer": <true or false or null>
}}
Do NOT output markdown backticks (```json), only the raw JSON.
"""

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                url,
                json={"contents": [{"parts": [{"text": prompt}]}]},
                headers={"Content-Type": "application/json"}
            )
            if resp.status_code == 200:
                data = resp.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                # Clean any markdown if included
                if raw_text.startswith("```"):
                    raw_text = re.sub(r"^```(?:json)?", "", raw_text)
                    raw_text = re.sub(r"```$", "", raw_text).strip()
                parsed = json.loads(raw_text)
                return merge_profile(current_profile, parsed)
            else:
                logger.warning(f"Gemini API returned status {resp.status_code}, falling back to heuristic: {resp.text}")
                return merge_profile(current_profile, heuristic_data)
    except Exception as e:
        logger.warning(f"Gemini API call failed ({e}), using heuristic parser.")
        return merge_profile(current_profile, heuristic_data)

def merge_profile(existing: FarmerProfile, new_data: Dict[str, Any]) -> FarmerProfile:
    """Merges new slot values into existing profile without overwriting with None."""
    data = existing.model_dump()

    for k, v in new_data.items():
        if v is not None:
            if k == "crops":
                if isinstance(v, list) and len(v) > 0:
                    current_crops = set(data.get("crops", []))
                    for crop in v:
                        current_crops.add(canonicalize_crop(crop))
                    data["crops"] = list(current_crops)
            elif k == "district" and isinstance(v, str):
                cleaned_d = v.strip().title()
                data["district"] = cleaned_d
            else:
                data[k] = v

    return FarmerProfile(**data)
