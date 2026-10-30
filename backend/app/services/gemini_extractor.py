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
    "ಭತ್ತ": "paddy", "ಅಕ್ಕಿ": "paddy", "bhatta": "paddy", "rice": "paddy", "paddy": "paddy",
    "ರಾಗಿ": "ragi", "ragi": "ragi",
    "ಕಬ್ಬು": "sugarcane", "kabbu": "sugarcane", "sugarcane": "sugarcane",
    "ಜೋಳ": "jowar", "jola": "jowar", "jowar": "jowar",
    "ಮೆಕ್ಕೆಜೋಳ": "maize", "maize": "maize", "corn": "maize",
    "ಹತ್ತಿ": "cotton", "hatti": "cotton", "cotton": "cotton",
    "ಶೇಂಗಾ": "groundnut", "ಕಡಲೆಕಾಯಿ": "groundnut", "groundnut": "groundnut", "peanut": "groundnut",
    "ಸೂರ್ಯಕಾಂತಿ": "sunflower", "sunflower": "sunflower",
    "ಸೋಯಾಬೀನ್": "soybean", "soyabean": "soybean",
    "ತೊಗರಿ": "tur", "togari": "tur", "tur": "tur",
    "ಕಡಲೆ": "gram", "kadale": "gram", "gram": "gram", "chickpea": "gram",
    "ಹೆಸರು": "moong", "hesaru": "moong", "moong": "moong",
    "ಉದ್ದು": "urad", "uddu": "urad", "urad": "urad",
    "ಈರುಳ್ಳಿ": "onion", "eerulli": "onion", "onion": "onion",
    "ಆಲೂಗಡ್ಡೆ": "potato", "aloo": "potato", "potato": "potato",
    "ಮೆಣಸಿನಕಾಯಿ": "chilli", "menasinakai": "chilli", "chilli": "chilli",
    "ಟೊಮೆಟೊ": "tomato", "tamata": "tomato", "tomato": "tomato",
    "ಅಡಿಕೆ": "arecanut", "adike": "arecanut", "arecanut": "arecanut",
    "ಕಾಫಿ": "coffee", "kaapi": "coffee", "coffee": "coffee",
    "ಬಾಳೆ": "banana", "bale": "banana", "banana": "banana",
    "ದಾಳಿಂಬೆ": "pomegranate", "dalimbe": "pomegranate", "pomegranate": "pomegranate",
    "ದ್ರಾಕ್ಷಿ": "grapes", "drakshi": "grapes", "grapes": "grapes",
    "ಗೋಧಿ": "wheat", "godhi": "wheat", "wheat": "wheat"
}

def extract_slots_heuristic(text: str) -> Dict[str, Any]:
    """Deterministic regex and keyword extractor for Kannada and English."""
    extracted: Dict[str, Any] = {}
    lower_text = text.lower()

    # 1. District extraction
    for k_name, en_district in KANNADA_DISTRICT_MAP.items():
        if k_name in lower_text:
            extracted["district"] = en_district
            break

    # 2. Land area extraction
    # Patterns like: "5 ಎಕರೆ", "2.5 acre", "10 acres", "40 ಗುಂಟೆ" (1 acre = 40 gunta)
    guntha_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:ಗುಂಟೆ|ಗಂಟೆ|gunta|guntas)", text, re.IGNORECASE)
    if guntha_match:
        guntas = float(guntha_match.group(1))
        extracted["land_area_acres"] = round(guntas / 40.0, 2)
    else:
        acre_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:ಎಕರೆ|ಎಕ್ರೆ|acre|acres|ac)", text, re.IGNORECASE)
        if acre_match:
            extracted["land_area_acres"] = float(acre_match.group(1))

    # 3. Ownership extraction
    if any(w in lower_text for w in ["ಸ್ವಂತ", "ಮಾಲೀಕ", "ನನ್ನ ಭೂಮಿ", "own", "owner", "ownership"]):
        extracted["ownership_type"] = "owner"
    elif any(w in lower_text for w in ["ಗೇಣಿ", "ಬಾಡಿಗೆ", "ಕೌಲು", "tenant", "lease", "rent"]):
        extracted["ownership_type"] = "tenant"
    elif any(w in lower_text for w in ["ಪಾಲು", "ಪಾಲುದಾರ", "sharecropper"]):
        extracted["ownership_type"] = "sharecropper"

    # 4. Crop extraction
    detected_crops = set()
    for kw, crop_en in KANNADA_CROP_KEYWORDS.items():
        if kw in lower_text:
            detected_crops.add(crop_en)
    if detected_crops:
        extracted["crops"] = list(detected_crops)

    # 5. Irrigation extraction
    if any(w in lower_text for w in ["ಬೋರ್‌ವೆಲ್", "ಬೋರ್ವೆಲ್", "ಬಾವಿ", "ಕಾಲುವೆ", "ಹನಿ ನೀರಾವರಿ", "borewell", "well", "canal", "irrigated", "drip"]):
        extracted["has_irrigation"] = True
    elif any(w in lower_text for w in ["ಮಳೆ ಆಶ್ರಯ", "ಖುಷ್ಕಿ", "ನೀರಿಲ್ಲ", "rainfed", "dryland", "no water"]):
        extracted["has_irrigation"] = False

    # 6. Season extraction
    if any(w in lower_text for w in ["ಮುಂಗಾರು", "ಖಾರೀಫ್", "kharif"]):
        extracted["season"] = "kharif"
    elif any(w in lower_text for w in ["ಹಿಂಗಾರು", "ರಬಿ", "rabi"]):
        extracted["season"] = "rabi"
    elif any(w in lower_text for w in ["ಬೇಸಿಗೆ", "summer"]):
        extracted["season"] = "summer"

    # 7. Tax exclusion check
    if any(w in lower_text for w in ["ತೆರಿಗೆ ಕಟ್ಟುತ್ತೇನೆ", "tax payer", "income tax"]):
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
