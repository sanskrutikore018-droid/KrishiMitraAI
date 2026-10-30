import uuid
from typing import Dict, Any, List, Optional, Tuple
from app.models.schemas import FarmerProfile, SchemeEvaluation, ChatResponse
from app.services.schemes_service import SchemesService
from app.services.eligibility import evaluate_all_schemes
from app.services.gemini_extractor import extract_slots_with_gemini

# In-memory session store
# session_id -> {"profile": FarmerProfile, "history": List[Dict[str, str]], "language": str}
SESSIONS: Dict[str, Dict[str, Any]] = {}

REQUIRED_SLOT_SEQUENCE = [
    "district",
    "land_area_acres",
    "ownership_type",
    "crops",
    "has_irrigation"
]

QUESTIONS = {
    "district": {
        "kn": "ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಜಿಲ್ಲೆ ಯಾವುದು ಎಂದು ದಯವಿಟ್ಟು ತಿಳಿಸಿ (ಉದಾ: ಬೆಳಗಾವಿ, ಮಂಡ್ಯ, ಶಿವಮೊಗ್ಗ)?",
        "hi": "नमस्ते! कृपया बताएं कि आपकी कृषि भूमि किस जिले में स्थित है (जैसे: बेलगावी, मांड्या, धारवाड़)?",
        "mr": "नमस्कार! तुमची शेतजमीन कोणत्या जिल्ह्यात आहे ते कृपया सांगा (उदा: बेळगाव, धारवाड, कोल्हापूर)?",
        "en": "Namaskara! Which district is your farmland located in (e.g., Belagavi, Mandya, Shimoga)?"
    },
    "land_area_acres": {
        "kn": "ನಿಮ್ಮಲ್ಲಿ ಒಟ್ಟು ಎಷ್ಟು ಎಕರೆ ಕೃಷಿ ಭೂಮಿ ಇದೆ (ಉದಾ: 3 ಎಕರೆ, 5 ಎಕರೆ)?",
        "hi": "आपके पास कुल कितने एकड़ कृषि भूमि है (जैसे: 3 एकड़, 5 एकड़)?",
        "mr": "तुमच्याकडे एकूण किती एकर शेतजमीन आहे (उदा: 3 एकर, 5 एकर)?",
        "en": "How many acres of agricultural land do you cultivate (e.g., 3 acres, 5 acres)?"
    },
    "ownership_type": {
        "kn": "ನೀವು ಸ್ವಂತ ಭೂಮಿಯ ಮಾಲೀಕರಾಗಿದ್ದೀರಾ ಅಥವಾ ಗೇಣಿ/ಬಾಡಿಗೆ ಆಧಾರದಲ್ಲಿ ಕೃಷಿ ಮಾಡುತ್ತಿದ್ದೀರಾ?",
        "hi": "क्या आप भूमि के स्वयं मालिक हैं या बटाईदार/किरायेदार के रूप में खेती कर रहे हैं?",
        "mr": "तुम्ही स्वतः जमिनीचे मालक आहात की कुळ/भाडेतत्त्वावर शेती करत आहात?",
        "en": "Are you the registered land owner, or cultivating as a tenant/sharecropper?"
    },
    "crops": {
        "kn": "ಪ್ರಸ್ತುತ ಯಾವ ಮುಖ್ಯ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯುತ್ತಿದ್ದೀರಿ (ಉದಾ: ಭತ್ತ, ಕಬ್ಬು, ರಾಗಿ, ಮೆಕ್ಕೆಜೋಳ)?",
        "hi": "वर्तमान में आप कौन सी मुख्य फसलें उगा रहे हैं (जैसे: गेहूं, धान, गन्ना, कपास, सोयाबीन)?",
        "mr": "सध्या तुम्ही कोणती मुख्य पिके घेत आहात (उदा: ऊस, सोयाबीन, भात, कापूस, ज्वारी)?",
        "en": "What primary crops are you cultivating (e.g., paddy, sugarcane, ragi, maize)?"
    },
    "has_irrigation": {
        "kn": "ನಿಮ್ಮ ಜಮೀನಿಗೆ ಬೋರ್‌ವೆಲ್, ಬಾವಿ ಅಥವಾ ಕಾಲುವೆ ನೀರಿನ ಸೌಲಭ್ಯವಿದೆಯೇ, ಅಥವಾ ಮಳೆ ಆಶ್ರಯವೇ?",
        "hi": "क्या आपकी जमीन पर नलकूप (बोरवेल), कुआं या नहर की सिंचाई सुविधा है, या यह वर्षा आधारित है?",
        "mr": "तुमच्या शेतात विहीर, कूपनलिका (बोरवेल) किंवा कालव्याचे पाणी आहे की शेती पावसावर अवलंबून आहे?",
        "en": "Does your land have an assured water source (borewell, well, canal), or is it rainfed?"
    }
}

QUICK_REPLIES = {
    "district": {
        "kn": ["ಬೆಳಗಾವಿ", "ಮಂಡ್ಯ", "ಶಿವಮೊಗ್ಗ", "ಧಾರವಾಡ", "ಮೈಸೂರು", "ಹಾವೇರಿ"],
        "hi": ["बेलगावी", "मांड्या", "शिवमोग्गा", "धारवाड़", "मैसूर", "हावेरी"],
        "mr": ["बेळगाव", "धारवाड", "मांड्या", "शिमोगा", "म्हैसूर", "हावेरी"],
        "en": ["Belagavi", "Mandya", "Shivamogga", "Dharwad", "Mysuru", "Haveri"]
    },
    "land_area_acres": {
        "kn": ["2 ಎಕರೆ", "3.5 ಎಕರೆ", "5 ಎಕರೆ", "8 ಎಕರೆ"],
        "hi": ["2 एकड़", "3.5 एकड़", "5 एकड़", "8 एकड़"],
        "mr": ["2 एकर", "3.5 एकर", "5 एकर", "8 एकर"],
        "en": ["2 Acres", "3.5 Acres", "5 Acres", "8 Acres"]
    },
    "ownership_type": {
        "kn": ["ಸ್ವಂತ ಭೂಮಿ (Owner)", "ಗೇಣಿದಾರ (Tenant)", "ಪಾಲುದಾರ (Sharecropper)"],
        "hi": ["खुद की जमीन (मालिक)", "किरायेदार (Tenant)", "बटाईदार (Sharecropper)"],
        "mr": ["स्वतःची जमीन (मालक)", "भाडेकरू (Tenant)", "कुळ/भागीदार (Sharecropper)"],
        "en": ["Owner", "Tenant", "Sharecropper"]
    },
    "crops": {
        "kn": ["ಭತ್ತ (Paddy)", "ಕಬ್ಬು (Sugarcane)", "ರಾಗಿ (Ragi)", "ಹತ್ತಿ (Cotton)", "ಮೆಕ್ಕೆಜೋಳ (Maize)"],
        "hi": ["गेहूं (Wheat)", "धान (Paddy)", "गन्ना (Sugarcane)", "कपास (Cotton)", "सोयाबीन (Soybean)"],
        "mr": ["ऊस (Sugarcane)", "सोयाबीन (Soybean)", "भात (Paddy)", "कापूस (Cotton)", "ज्वारी (Jowar)"],
        "en": ["Paddy", "Sugarcane", "Ragi", "Cotton", "Maize"]
    },
    "has_irrigation": {
        "kn": ["ಹೌದು, ಬೋರ್‌ವೆಲ್/ಬಾವಿ ಇದೆ", "ಇಲ್ಲ, ಮಳೆ ಆಶ್ರಯ"],
        "hi": ["हाँ, बोरवेल/कुआं है", "नहीं, बारिश पर निर्भर"],
        "mr": ["हो, विहीर/कूपनलिका आहे", "नाही, पावसावर आधारित"],
        "en": ["Yes, Borewell/Canal", "No, Rainfed"]
    }
}

class ConversationManager:

    @staticmethod
    def get_or_create_session(session_id: Optional[str], language: str = "kn") -> Tuple[str, Dict[str, Any]]:
        if not session_id or session_id not in SESSIONS:
            new_id = session_id or str(uuid.uuid4())
            SESSIONS[new_id] = {
                "profile": FarmerProfile(),
                "history": [],
                "language": language
            }
            return new_id, SESSIONS[new_id]
        session = SESSIONS[session_id]
        if language:
            session["language"] = language
        return session_id, session

    @staticmethod
    def get_missing_slots(profile: FarmerProfile) -> List[str]:
        missing = []
        if not profile.district:
            missing.append("district")
        if profile.land_area_acres is None:
            missing.append("land_area_acres")
        if not profile.ownership_type:
            missing.append("ownership_type")
        if not profile.crops:
            missing.append("crops")
        if profile.has_irrigation is None:
            missing.append("has_irrigation")
        return missing

    @classmethod
    async def process_farmer_message(
        cls,
        message: str,
        session_id: Optional[str] = None,
        language: str = "kn",
        profile_override: Optional[FarmerProfile] = None
    ) -> ChatResponse:
        sid, session = cls.get_or_create_session(session_id, language)

        # 1. Start with current profile or override
        current_profile = profile_override if profile_override else session["profile"]

        # 2. Extract slots from incoming message using Gemini/Heuristic
        updated_profile = await extract_slots_with_gemini(message, current_profile)
        session["profile"] = updated_profile

        # 3. Evaluate eligibility deterministically
        all_schemes = SchemesService.load_schemes()
        evaluations = evaluate_all_schemes(all_schemes, updated_profile)

        # 4. Check missing slots
        missing = cls.get_missing_slots(updated_profile)
        is_complete = len(missing) == 0

        # 5. Formulate response
        if is_complete:
            # Count eligible schemes
            eligible_count = sum(1 for e in evaluations if e.overall_status == "eligible")
            if language == "kn":
                response_text = (
                    f"ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ವಿವರಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ: {updated_profile.district} ಜಿಲ್ಲೆ, "
                    f"{updated_profile.land_area_acres} ಎಕರೆ, {', '.join(updated_profile.crops)} ಬೆಳೆ. "
                    f"ನಿಮಗಾಗಿ {eligible_count} ಯೋಜನೆಗಳು ಅರ್ಹವಾಗಿವೆ! ಕೆಳಗಿನ ಕಾರ್ಡ್‌ಗಳಲ್ಲಿ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ."
                )
                quick_replies = ["PM-KISAN ದಾಖಲೆಗಳು", "PMFBY ಅರ್ಜಿ ವಿವರ", "ಹೊಸದಾಗಿ ಪರಿಶೀಲಿಸಿ"]
            elif language == "hi":
                response_text = (
                    f"धन्यवाद! आपका विवरण पूर्ण हो गया है: {updated_profile.district} ज़िला, "
                    f"{updated_profile.land_area_acres} एकड़, {', '.join(updated_profile.crops)} की खेती। "
                    f"आप {eligible_count} सरकारी योजनाओं के लिए पात्र हैं! नीचे दिए गए कार्ड्स में पूर्ण विवरण देखें।"
                )
                quick_replies = ["PM-KISAN दस्तावेज़", "PMFBY योजना विवरण", "पुनः जांचें"]
            elif language == "mr":
                response_text = (
                    f"धन्यवाद! तुमची माहिती पूर्ण झाली आहे: {updated_profile.district} जिल्हा, "
                    f"{updated_profile.land_area_acres} एकर, {', '.join(updated_profile.crops)} पीक. "
                    f"तुम्ही {eligible_count} शासकीय योजनांसाठी पात्र आहात! खालील कार्ड्समध्ये सविस्तर माहिती तपासा."
                )
                quick_replies = ["PM-KISAN कागदपत्रे", "PMFBY अर्ज माहिती", "पुन्हा तपासा"]
            else:
                response_text = (
                    f"Thank you! Your profile is complete: {updated_profile.district} district, "
                    f"{updated_profile.land_area_acres} acres, cultivating {', '.join(updated_profile.crops)}. "
                    f"You qualify for {eligible_count} government scheme(s)! Review your verification breakdown below."
                )
                quick_replies = ["PM-KISAN Docs", "PMFBY Details", "Start Over"]
            next_slot = None
        else:
            next_slot = missing[0]
            question_dict = QUESTIONS.get(next_slot, {})
            response_text = question_dict.get(language, question_dict.get("en", "Please provide more details."))
            quick_replies = QUICK_REPLIES.get(next_slot, {}).get(language, [])

        # Record history
        session["history"].append({"role": "user", "content": message})
        session["history"].append({"role": "assistant", "content": response_text})

        return ChatResponse(
            session_id=sid,
            response_text=response_text,
            language=language,
            extracted_profile=updated_profile,
            missing_slots=missing,
            is_profile_complete=is_complete,
            scheme_evaluations=evaluations,
            suggested_quick_replies=quick_replies,
            slot_just_filled=next_slot
        )

