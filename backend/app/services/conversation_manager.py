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

# Agronomic and Scheme Advisory Knowledge Base for Indian Farmers
AGRONOMIC_ADVISORY = {
    "tomato_disease": {
        "kn": (
            "ಟೊಮೆಟೊ ಎಲೆಗಳು ಹಳದಿಯಾಗುವುದು ಸಾಮಾನ್ಯವಾಗಿ 'ಮುಂಚಿನ ಅಂಗಮಾರಿ' (Early Blight) "
            "ಅಥವಾ 'ಸೆಪ್ಟೋರಿಯಾ ಎಲೆ ಚುಕ್ಕೆ' (Septoria Leaf Spot) ಶಿಲೀಂಧ್ರ ರೋಗದ ಲಕ್ಷಣವಾಗಿದೆ.\n\n"
            "ಪರಿಹಾರ ಕ್ರಮಗಳು (UAS ಧಾರವಾಡ & ಬೆಂಗಳೂರು ಕೃಷಿ ವಿವಿ ಶಿಫಾರಸು):\n"
            "1. ಸೋಂಕಿತ ಕೆಳಗಿನ ಎಲೆಗಳನ್ನು ಕಿತ್ತು ತಕ್ಷಣ ನಾಶಪಡಿಸಿ (ತೋಟದಿಂದ ದೂರ ಹಾಕಿ).\n"
            "2. ನೀರನ್ನು ಗಿಡದ ಮೇಲಿಂದ ಸಿಂಪಡಿಸದೆ, ಬುಡಕ್ಕೆ ಮಾತ್ರ ಹನಿ ನೀರಾವರಿ ಮೂಲಕ ಕೊಡಿ.\n"
            "3. ಜೈವಿಕ ನಿಯಂತ್ರಣಕ್ಕೆ 'ಟ್ರೈಕೋಡರ್ಮಾ ವಿರಿಡೆ' (Trichoderma viride 5g/L) ಅಥವಾ ಮ್ಯಾಂಕೋಜೆಬ್ (Mancozeb 2g/L) ಸಂಜೆ ವೇಳೆ ಸಿಂಪಡಿಸಿ.\n"
            "4. ರಸಹೀರುವ ಕೀಟಗಳ ನಿಯಂತ್ರಣಕ್ಕೆ ಬೇವಿನ ಎಣ್ಣೆ (Neem Oil 5ml/L) ಬಳಸಿ.\n\n"
            "ರೋಗದ ನಿಖರ ಹಂತ ತಿಳಿಯಲು ಉಪಯುಕ್ತ ಪ್ರಶ್ನೆಗಳು:\n"
            "• ಹಳದಿ ಬಣ್ಣವು ಕೆಳಗಿನ ಹಳೆಯ ಎಲೆಗಳಲ್ಲಿ ಪ್ರಾರಂಭವಾಗಿದೆಯೇ ಅಥವಾ ಮೇಲಿನ ಹೊಸ ಕುಡಿಗಳಲ್ಲೇ?\n"
            "• ಎಲೆಗಳ ಮೇಲೆ ಕಪ್ಪು ಅಥವಾ ಕಂದು ಬಣ್ಣದ ವೃತ್ತಾಕಾರದ ಚುಕ್ಕೆಗಳು ಕಾಣಿಸುತ್ತಿವೆಯೇ?"
        ),
        "hi": (
            "टमाटर के पौधों में पत्तियों का पीला पड़ना और छोटे धब्बे आना मुख्य रूप से 'अगेती झुलसा' (Early Blight) "
            "या पर्ण चित्ती (Leaf Spot) फफूंद रोग का लक्षण है।\n\n"
            "सुरक्षात्मक उपाय (ICAR एवं कृषि विवि दिशानिर्देश):\n"
            "1. संक्रमित निचली पत्तियों को तुरंत हटाकर खेत से दूर नष्ट करें।\n"
            "2. पत्तियों पर पानी डालने के बजाय सीधे जड़ों में ड्रिप द्वारा पानी दें।\n"
            "3. जैविक उपचार के लिए ट्राइकोडर्मा विरिडे या मेंकोज़ेब (Mancozeb 2 ग्राम प्रति लीटर पानी) का छिड़काव करें।\n"
            "4. रस चूसने वाले कीटों से बचाव के लिए नीम तेल (5 मिली/लीटर) का प्रयोग करें।\n\n"
            "रोग की सही स्थिति जानने के लिए:\n"
            "• क्या पीलापन पुरानी निचली पत्तियों में है या नई ऊपरी कोपलों में?\n"
            "• क्या पत्तियों पर गोल कत्थई या काले घेरे वाले धब्बे हैं?"
        ),
        "mr": (
            "टोमॅटोच्या रोपांची पाने पिवळी पडणे आणि त्यावर ठिपके येणे हे मुख्यत्वे 'करपा' (Early Blight) "
            "किंवा बुरशीजन्य रोगाचे (Septoria Leaf Spot) लक्षण आहे.\n\n"
            "उपाययोजना (कृषी विद्यापीठ शिफारस):\n"
            "1. बाधित झालेली खालची पाने काढून शेताबाहेर नष्ट करा.\n"
            "2. पानांवर पाणी न शिंपडता फक्त मुळाशी ठिबकद्वारे पाणी द्या.\n"
            "3. जैविक नियंत्रणासाठी ट्रायकोडर्मा विरिडी किंवा मॅन्कोझेब (2 ग्रॅम/लिटर) फवारा.\n"
            "4. संरक्षणासाठी कडुनिंब तेल (5 मिली/लिटर) वापरा.\n\n"
            "रोगाची तीव्रता तपासण्यासाठी:\n"
            "• पिवळेपणा खालच्या जुन्या पानांवर आहे की वरच्या नव्या पानांवर?\n"
            "• पानांवर काळपट-तपकिरी वर्तुळाकार ठिपके दिसत आहेत का?"
        ),
        "en": (
            "Yellowing leaves with small spots and stunted growth in tomato plants commonly indicate 'Early Blight' "
            "(Alternaria solani) or Septoria leaf spot fungal infection.\n\n"
            "Recommended Protection Steps (ICAR & UAS Dharwad Guidelines):\n"
            "1. Prune and destroy infected lower leaves immediately to stop spore spread.\n"
            "2. Water at the base of the plant using drip irrigation; avoid wetting foliage.\n"
            "3. Spray Trichoderma viride bio-fungicide or Mancozeb/Copper Oxychloride (2g/L).\n"
            "4. Apply neem oil (5ml/L) as a safe organic deterrent against sap-sucking pests.\n\n"
            "To confirm the exact disease stage:\n"
            "• Are older lower leaves turning yellow first, or newly sprouted top shoots?\n"
            "• Do the spots have dark concentric target-like rings?"
        )
    },
    "general_schemes": {
        "kn": (
            "ಭಾರತ ಸರ್ಕಾರದ ಮತ್ತು ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ರೈತ ಯೋಜನೆಗಳು:\n"
            "1. **PM-KISAN**: ಅರ್ಹ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ ವಾರ್ಷಿಕ ₹6,000 ನೇರ ನಗದು ನೆರವು (3 ಕಂತುಗಳಲ್ಲಿ).\n"
            "2. **PMFBY ಬೆಳೆ ವಿಮೆ**: ಬರ, ಅತಿವೃಷ್ಟಿ, ರೋಗಗಳಿಂದ ಬೆಳೆ ನಷ್ಟವಾದರೆ ಗರಿಷ್ಠ ಪರಿಹಾರ; ಕೇವಲ 1.5%–2% ಪ್ರೀಮಿಯಂ.\n"
            "3. **ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ ಸಬ್ಸಿಡಿ**: ಟ್ರ್ಯಾಕ್ಟರ್, ಪವರ್ ಟಿಲ್ಲರ್‌ಗಳಿಗೆ 50% ವರೆಗೆ ರಿಯಾಯಿತಿ."
        ),
        "hi": (
            "भारत सरकार और राज्य की प्रमुख किसान कल्याण योजनाएं:\n"
            "1. **PM-KISAN सम्मान निधि**: पात्र किसानों को ₹6,000 प्रति वर्ष की प्रत्यक्ष आर्थिक सहायता (3 किश्तों में)।\n"
            "2. **PMFBY फसल बीमा**: सूखा, बाढ़ या फसल रोगों से नुकसान होने पर व्यापक सुरक्षा (केवल 1.5%–2% प्रीमियम)।\n"
            "3. **कृषि यंत्रीकरण व ड्रिप सिंचाई**: कृषि उपकरणों और सूक्ष्म सिंचाई पर 50% तक सरकारी अनुदान।"
        ),
        "mr": (
            "शेतकऱ्यांसाठी प्रमुख शासकीय योजना:\n"
            "1. **PM-KISAN सन्मान निधी**: सर्व पात्र शेतकऱ्यांना वार्षिक ₹6,000 थेट बँक खात्यात (3 हप्त्यांत).\n"
            "2. **PMFBY पीक विमा**: दुष्काळ, रोग किंवा अतिवृष्टीमुळे झालेल्या नुकसानीवर संपूर्ण विमा संरक्षण (फक्त 1.5%–2% प्रीमियम).\n"
            "3. **ठिबक सिंचन व अवजारे अनुदान**: कृषी अवजारे व सूक्ष्म सिंचनासाठी 50% पर्यंत शासकीय अनुदान."
        ),
        "en": (
            "Key Government Schemes Available for Indian Farmers:\n"
            "1. **PM-KISAN Samman Nidhi**: Direct financial assistance of ₹6,000/year in 3 equal instalments for landholding farmer families.\n"
            "2. **PMFBY Crop Insurance**: Comprehensive safety net against drought, flood, and pests with subsidized farmer premiums (1.5%–2%).\n"
            "3. **Farm Mechanization & Micro-Irrigation**: Subsidies up to 50% on drip systems and certified agricultural equipment."
        )
    }
}

def detect_advisory_inquiry(message: str) -> Optional[str]:
    """Detects if farmer's query contains a specific agricultural problem or scheme question."""
    lowered = message.lower()
    
    # Pure Kannada & Regional Dialect keywords (North Karnataka, South Karnataka, Coastal):
    kn_crops = [
        "ಟೊಮೆಟೊ", "ಟೊಮೇಟೊ", "ತಮೋಟ", "ಗಿಡ", "ಗಿಡದ", "ಗಿಡಗಳು", "ಬೆಳೆ", "ಬೆಳಿ",
        "ಹೊಲ", "ಗದ್ದೆ", "ತೋಟ", "ತೊಗರಿ", "ಹತ್ತಿ", "ಕಬ್ಬು", "ಭತ್ತ"
    ]
    kn_symptoms = [
        "ಹಳದಿ", "ಎಲೆ", "ಎಲಿ", "ಆಗ್ತಾ ಇದೆ", "ಆಗ್ಯಾವ", "ಚುಕ್ಕೆ", "ಚುಕ್ಕೆಗಳು", "ಬಿದ್ದಾವ",
        "ರೋಗ", "ಕೀಟ", "ಹುಳ", "ಹುಳ ಹತ್ತೇತಿ", "ಬೆಳವಣಿಗೆ", "ಕುಂಠಿತ", "ಪರಿಹಾರ", "ಔಷಧ",
        "ಏನು ಮಾಡ್ಬೇಕು", "ಏನ್ ಮಾಡ್ಬೇಕ್ರಿ", "ರಕ್ಷಣೆ"
    ]
    
    # Check for tomato disease / yellow leaves / spots across languages
    tomato_crop_terms = [
        "tomato", "ಟೊಮೆಟೊ", "ಟೊಮೇಟೊ", "ತಮೋಟ", "टमाटर", "टोमॅटो", "tomatoes"
    ]
    disease_keywords = [
        "yellow", "leaves", "spots", "growth", "slow", "blight", "fungus", "protect", "disease", "pest", "leaf",
        "ಹಳದಿ", "ಎಲೆ", "ಎಲೆಗಳು", "ಚುಕ್ಕೆ", "ಚುಕ್ಕೆಗಳು", "ರೋಗ", "ಕೀಟ", "ಬೆಳವಣಿಗೆ", "ಪರಿಹಾರ",
        "पीले", "पत्ते", "धब्बे", "रोग", "कीट", "रोकथाम", "उपाय", "झुलसा",
        "पिवळी", "पाने", "ठिपके", "कीड", "करपा"
    ]
    
    if any(c in lowered for c in tomato_crop_terms) and any(k in lowered for k in disease_keywords):
        return "tomato_disease"
    
    # Specific Kannada check: ಟೊಮೆಟೊ / ಗಿಡ / ಎಲೆಗಳು + ಹಳದಿ / ಚುಕ್ಕೆ
    if any(c in lowered for c in kn_crops) and any(s in lowered for s in kn_symptoms):
        return "tomato_disease"

    # General crop health check
    if any(k in lowered for k in ["yellow leaves", "spots on leaves", "leaf spot", "plants have yellow", "ರೋಗ", "रोग", "पीले पत्ते", "पिवळी पाने"]):
        return "tomato_disease"

    # Check for general government schemes inquiry
    scheme_keywords = [
        "which government schemes", "schemes are available", "eligibility conditions", "how i can apply",
        "what schemes", "available for small farmers", "ಯಾವ ಯೋಜನೆಗಳು", "ಸರ್ಕಾರಿ ಯೋಜನೆ", "ಯೋಜನೆ ಲಭ್ಯ",
        "ಯೋಜನೆಗಳು", "ಯೋಜನೆಗೆ ಅರ್ಜಿ", "ಅರ್ಹತೆ",
        "सरकारी योजना", "कौन सी योजना", "पात्रता", "योजना उपलब्ध", "सरकारी योजनाओं",
        "शासकीय योजना", "कोणत्या योजना", "अर्ज कसा करावा", "पात्रता अटी"
    ]
    if any(k in lowered for k in scheme_keywords):
        return "general_schemes"

    return None

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
        advisory_type = detect_advisory_inquiry(message)
        advisory_prefix = ""
        if advisory_type and advisory_type in AGRONOMIC_ADVISORY:
            advisory_prefix = AGRONOMIC_ADVISORY[advisory_type].get(language, AGRONOMIC_ADVISORY[advisory_type]["en"]) + "\n\n"

        if is_complete:
            # Count eligible schemes
            eligible_count = sum(1 for e in evaluations if e.overall_status == "eligible")
            if language == "kn":
                response_text = (
                    f"{advisory_prefix}ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ವಿವರಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ: {updated_profile.district} ಜಿಲ್ಲೆ, "
                    f"{updated_profile.land_area_acres} ಎಕರೆ, {', '.join(updated_profile.crops)} ಬೆಳೆ. "
                    f"ನಿಮಗಾಗಿ {eligible_count} ಯೋಜನೆಗಳು ಅರ್ಹವಾಗಿವೆ! ಕೆಳಗಿನ ಕಾರ್ಡ್‌ಗಳಲ್ಲಿ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ."
                )
                quick_replies = ["PM-KISAN ದಾಖಲೆಗಳು", "PMFBY ಅರ್ಜಿ ವಿವರ", "ಹೊಸದಾಗಿ ಪರಿಶೀಲಿಸಿ"]
            elif language == "hi":
                response_text = (
                    f"{advisory_prefix}धन्यवाद! आपका विवरण पूर्ण हो गया है: {updated_profile.district} ज़िला, "
                    f"{updated_profile.land_area_acres} एकड़, {', '.join(updated_profile.crops)} की खेती। "
                    f"आप {eligible_count} सरकारी योजनाओं के लिए पात्र हैं! नीचे दिए गए कार्ड्स में पूर्ण विवरण देखें।"
                )
                quick_replies = ["PM-KISAN दस्तावेज़", "PMFBY योजना विवरण", "पुनः जांचें"]
            elif language == "mr":
                response_text = (
                    f"{advisory_prefix}धन्यवाद! तुमची माहिती पूर्ण झाली आहे: {updated_profile.district} जिल्हा, "
                    f"{updated_profile.land_area_acres} एकर, {', '.join(updated_profile.crops)} पीक. "
                    f"तुम्ही {eligible_count} शासकीय योजनांसाठी पात्र आहात! खालील कार्ड्समध्ये सविस्तर माहिती तपासा."
                )
                quick_replies = ["PM-KISAN कागदपत्रे", "PMFBY अर्ज माहिती", "पुन्हा तपासा"]
            else:
                response_text = (
                    f"{advisory_prefix}Thank you! Your profile is complete: {updated_profile.district} district, "
                    f"{updated_profile.land_area_acres} acres, cultivating {', '.join(updated_profile.crops)}. "
                    f"You qualify for {eligible_count} government scheme(s)! Review your verification breakdown below."
                )
                quick_replies = ["PM-KISAN Docs", "PMFBY Details", "Start Over"]
            next_slot = None
        else:
            next_slot = missing[0]
            question_dict = QUESTIONS.get(next_slot, {})
            slot_prompt = question_dict.get(language, question_dict.get("en", "Please provide more details."))

            if advisory_prefix:
                followup_intro = {
                    "kn": "ನಿಮ್ಮ ಕೃಷಿ ಭೂಮಿಗೆ ಸೂಕ್ತವಾದ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಹಾಗೂ ಬೆಳೆ ವಿಮೆ ಪರಿಶೀಲಿಸಲು:\n",
                    "hi": "अपनी कृषि भूमि के लिए लागू सरकारी सब्सिडी और फसल बीमा जांचने के लिए:\n",
                    "mr": "आपल्या शेतीसाठी लागू शासकीय अनुदान व पीक विमा तपासण्यासाठी:\n",
                    "en": "To verify exact government subsidies and crop insurance available for your farm:\n"
                }
                response_text = f"{advisory_prefix}{followup_intro.get(language, followup_intro['en'])}{slot_prompt}"
            else:
                response_text = slot_prompt

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

