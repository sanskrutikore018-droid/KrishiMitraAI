from typing import List, Dict, Any, Tuple
from app.models.schemas import FarmerProfile, SchemeEvaluation, RuleCheckResult

KARNATAKA_DISTRICTS = {
    "bagalkot", "ballari", "belagavi", "bengaluru rural", "bengaluru urban", "bidar",
    "chamarajanagar", "chikkaballapur", "chikkamagaluru", "chitradurga", "dakshina kannada",
    "davanagere", "dharwad", "gadag", "hassan", "haveri", "kalaburagi", "kodagu", "kolar",
    "koppal", "mandya", "mysuru", "raichur", "ramanagara", "shivamogga", "tumakuru",
    "udupi", "uttara kannada", "vijayanagara", "yadgir"
}

# Crop mapping: handles Kannada, common aliases, English
CROP_CANONICAL_MAP = {
    "ಭತ್ತ": "paddy", "bhatta": "paddy", "rice": "paddy", "paddy": "paddy",
    "ರಾಗಿ": "ragi", "finger millet": "ragi",
    "ಕಬ್ಬು": "sugarcane", "kabbu": "sugarcane", "sugarcane": "sugarcane",
    "ಜೋಳ": "jowar", "jola": "jowar", "sorghum": "jowar", "jowar": "jowar",
    "ಮೆಕ್ಕೆಜೋಳ": "maize", "corn": "maize", "makka jola": "maize", "maize": "maize",
    "ಹತ್ತಿ": "cotton", "hatti": "cotton", "cotton": "cotton",
    "ಶೇಂಗಾ": "groundnut", "ಕಡಲೆಕಾಯಿ": "groundnut", "peanut": "groundnut", "groundnut": "groundnut",
    "ಸೂರ್ಯಕಾಂತಿ": "sunflower", "sunflower": "sunflower",
    "ಸೋಯಾಬೀನ್": "soybean", "soyabean": "soybean",
    "ತೊಗರಿ": "tur", "togari": "tur", "pigeon pea": "tur", "arhar": "tur", "tur": "tur",
    "ಕಡಲೆ": "gram", "chickpea": "gram", "bengal gram": "gram", "gram": "gram",
    "ಹೆಸರು": "moong", "green gram": "moong", "moong": "moong",
    "ಉದ್ದು": "urad", "black gram": "urad", "urad": "urad",
    "ಈರುಳ್ಳಿ": "onion", "eerulli": "onion", "onion": "onion",
    "ಆಲೂಗಡ್ಡೆ": "potato", "aloo": "potato", "potato": "potato",
    "ಮೆಣಸಿನಕಾಯಿ": "chilli", "menasinakai": "chilli", "chilli": "chilli",
    "ಟೊಮೆಟೊ": "tomato", "tamata": "tomato", "tomato": "tomato",
    "ಅಡಿಕೆ": "arecanut", "adike": "arecanut", "arecanut": "arecanut", "betel nut": "arecanut",
    "ಕಾಫಿ": "coffee", "kaapi": "coffee", "coffee": "coffee",
    "ಬಾಳೆ": "banana", "bale": "banana", "banana": "banana",
    "ದಾಳಿಂಬೆ": "pomegranate", "dalimbe": "pomegranate", "pomegranate": "pomegranate",
    "ದ್ರಾಕ್ಷಿ": "grapes", "drakshi": "grapes", "grapes": "grapes",
    "ಗೋಧಿ": "wheat", "godhi": "wheat", "wheat": "wheat"
}

def canonicalize_crop(crop_name: str) -> str:
    cleaned = crop_name.strip().lower()
    return CROP_CANONICAL_MAP.get(cleaned, cleaned)

def evaluate_pm_kisan(scheme_data: Dict[str, Any], profile: FarmerProfile) -> SchemeEvaluation:
    rules: List[RuleCheckResult] = []
    missing_fields: List[str] = []

    # Rule 1: Land Ownership (Must be owner)
    if profile.ownership_type is None:
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Land Ownership Title",
            rule_label_kn="ಭೂ ಮಾಲೀಕತ್ವದ ಹಕ್ಕು",
            status="unknown",
            farmer_value=None,
            required_value="owner",
            explanation_en="PM-KISAN requires holding clear cultivable land ownership in farmer's name.",
            explanation_kn="ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆಗೆ ರೈತರ ಹೆಸರಿನಲ್ಲಿ ಸ್ಪಷ್ಟ ಕೃಷಿ ಭೂಮಿ ಮಾಲೀಕತ್ವ ಇರಬೇಕು."
        ))
        missing_fields.append("ownership_type")
    elif profile.ownership_type == "owner":
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Land Ownership Title",
            rule_label_kn="ಭೂ ಮಾಲೀಕತ್ವದ ಹಕ್ಕು",
            status="satisfied",
            farmer_value="owner",
            required_value="owner",
            explanation_en="Verified: You are a registered landholding farmer.",
            explanation_kn="ದೃಢೀಕರಿಸಲಾಗಿದೆ: ನೀವು ಕೃಷಿ ಭೂಮಿಯ ಮಾಲೀಕರಾಗಿದ್ದೀರಿ."
        ))
    else:
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Land Ownership Title",
            rule_label_kn="ಭೂ ಮಾಲೀಕತ್ವದ ಹಕ್ಕು",
            status="not_satisfied",
            farmer_value=profile.ownership_type,
            required_value="owner",
            explanation_en=f"Ineligible: PM-KISAN guidelines strictly exclude {profile.ownership_type}s. Only land owners are eligible.",
            explanation_kn=f"ಅನರ್ಹ: ಪಿಎಂ-ಕಿಸಾನ್ ಮಾರ್ಗಸೂಚಿಯಂತೆ {profile.ownership_type} ಗಳಿಗೆ ಅವಕಾಶವಿಲ್ಲ. ಕೇವಲ ಸ್ವಂತ ಭೂಮಿ ಹೊಂದಿರುವ ಮಾಲೀಕರಿಗೆ ಮಾತ್ರ ಅನ್ವಯಿಸುತ್ತದೆ."
        ))

    # Rule 2: Land Area (Any cultivable land >= 0.01 acre)
    if profile.land_area_acres is None:
        rules.append(RuleCheckResult(
            rule_key="land_area_acres",
            rule_label_en="Cultivable Land Area",
            rule_label_kn="ಕೃಷಿ ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ",
            status="unknown",
            farmer_value=None,
            required_value=">= 0.01 acres",
            explanation_en="Please provide your total landholding size in acres.",
            explanation_kn="ದಯವಿಟ್ಟು ನಿಮ್ಮ ಒಟ್ಟು ಕೃಷಿ ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣವನ್ನು ಎಕರೆಗಳಲ್ಲಿ ತಿಳಿಸಿ."
        ))
        missing_fields.append("land_area_acres")
    elif profile.land_area_acres > 0:
        rules.append(RuleCheckResult(
            rule_key="land_area_acres",
            rule_label_en="Cultivable Land Area",
            rule_label_kn="ಕೃಷಿ ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ",
            status="satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value=">= 0.01 acres",
            explanation_en=f"Satisfied: Landholding of {profile.land_area_acres} acres meets criteria (all sizes eligible since 2019 expansion).",
            explanation_kn=f"ಪೂರೈಸಲಾಗಿದೆ: {profile.land_area_acres} ಎಕರೆ ಭೂಮಿ ನಿಯಮಾವಳಿಗೆ ಸೂಕ್ತವಾಗಿದೆ (2019 ರ ನಂತರ ಎಲ್ಲಾ ವಿಸ್ತೀರ್ಣಕ್ಕೂ ಅನ್ವಯ)."
        ))
    else:
        rules.append(RuleCheckResult(
            rule_key="land_area_acres",
            rule_label_en="Cultivable Land Area",
            rule_label_kn="ಕೃಷಿ ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ",
            status="not_satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value="> 0 acres",
            explanation_en="Ineligible: Land area must be greater than 0.",
            explanation_kn="ಅನರ್ಹ: ಕೃಷಿ ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ ಸೊನ್ನೆಗಿಂತ ಹೆಚ್ಚಿರಬೇಕು."
        ))

    # Rule 3: Statutory Exclusions (Income Tax / Institutional)
    if profile.is_income_tax_payer:
        rules.append(RuleCheckResult(
            rule_key="tax_exclusion",
            rule_label_en="Income Tax Exclusion",
            rule_label_kn="ಆದಾಯ ತೆರಿಗೆ ವಿನಾಯಿತಿ ಪರಿಶೀಲನೆ",
            status="not_satisfied",
            farmer_value="Tax Payer",
            required_value="Non-tax payer",
            explanation_en="Disqualified: Income tax payees in last assessment year are excluded from PM-KISAN.",
            explanation_kn="ಅನರ್ಹ: ಹಿಂದಿನ ವರ್ಷದಲ್ಲಿ ಆದಾಯ ತೆರಿಗೆ ಪಾವತಿಸಿದವರು ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆಗೆ ಅರ್ಹರಲ್ಲ."
        ))
    elif profile.is_institutional:
        rules.append(RuleCheckResult(
            rule_key="institutional_exclusion",
            rule_label_en="Institutional Landholder Check",
            rule_label_kn="ಸಂಸ್ಥಾಗತ ಭೂಮಾಲೀಕ ಪರಿಶೀಲನೆ",
            status="not_satisfied",
            farmer_value="Institutional",
            required_value="Individual family",
            explanation_en="Disqualified: Institutional landholders are excluded.",
            explanation_kn="ಅನರ್ಹ: ಸಂಸ್ಥಾಗತ ಭೂಮಾಲೀಕರಿಗೆ ಈ ಯೋಜನೆ ಅನ್ವಯಿಸುವುದಿಲ್ಲ."
        ))
    else:
        rules.append(RuleCheckResult(
            rule_key="tax_exclusion",
            rule_label_en="Statutory Exclusion Check",
            rule_label_kn="ಶಾಸನಬದ್ಧ ಹೊರಗಿಡುವಿಕೆ ಪರಿಶೀಲನೆ",
            status="satisfied",
            farmer_value="Compliant",
            required_value="Non-excluded family",
            explanation_en="Satisfied: No disqualifying income tax or institutional criteria declared.",
            explanation_kn="ಪೂರೈಸಲಾಗಿದೆ: ಯಾವುದೇ ಆದಾಯ ತೆರಿಗೆ ಅಥವಾ ಸಂಸ್ಥಾಗತ ಅನರ್ಹತೆಯಿಲ್ಲ."
        ))

    overall = determine_overall_status(rules)

    return SchemeEvaluation(
        scheme_id=scheme_data["id"],
        scheme_name=scheme_data["name"],
        short_name=scheme_data["short_name"],
        category=scheme_data["category"],
        is_demo=scheme_data.get("is_demo", False),
        watermark_notice=scheme_data.get("watermark_notice"),
        verification_status=scheme_data["verification_status"],
        verification_date=scheme_data["verification_date"],
        verified_by=scheme_data["verified_by"],
        official_source_url=scheme_data["official_source_url"],
        application_portal=scheme_data["application_portal"],
        helpline=scheme_data["helpline"],
        description=scheme_data["description"],
        benefits=scheme_data["benefits"],
        overall_status=overall,
        rules_breakdown=rules,
        missing_fields_for_scheme=missing_fields,
        required_documents=scheme_data["required_documents"]
    )

def evaluate_pmfby(scheme_data: Dict[str, Any], profile: FarmerProfile) -> SchemeEvaluation:
    rules: List[RuleCheckResult] = []
    missing_fields: List[str] = []
    eligible_crops = set(scheme_data["eligibility_rules"]["crops"])

    # Rule 1: Crop Eligibility
    if not profile.crops:
        rules.append(RuleCheckResult(
            rule_key="crop_notified",
            rule_label_en="Notified Crop Verification",
            rule_label_kn="ಅಧಿಸೂಚಿತ ಬೆಳೆ ಪರಿಶೀಲನೆ",
            status="unknown",
            farmer_value=None,
            required_value="Notified food, oilseed, or horticultural crop",
            explanation_en="Please specify which crop you are cultivating.",
            explanation_kn="ದಯವಿಟ್ಟು ನೀವು ಯಾವ ಬೆಳೆ ಬೆಳೆಯುತ್ತಿದ್ದೀರಿ ಎಂದು ತಿಳಿಸಿ."
        ))
        missing_fields.append("crops")
    else:
        canonical_crops = [canonicalize_crop(c) for c in profile.crops]
        matched_crops = [c for c in canonical_crops if c in eligible_crops]
        if matched_crops:
            rules.append(RuleCheckResult(
                rule_key="crop_notified",
                rule_label_en="Notified Crop Verification",
                rule_label_kn="ಅಧಿಸೂಚಿತ ಬೆಳೆ ಪರಿಶೀಲನೆ",
                status="satisfied",
                farmer_value=", ".join(profile.crops),
                required_value="Notified food/oilseed/commercial crop",
                explanation_en=f"Satisfied: Crop ({', '.join(matched_crops)}) is notified under PMFBY insurance coverage.",
                explanation_kn=f"ಪೂರೈಸಲಾಗಿದೆ: ನಿಮ್ಮ ಬೆಳೆ ({', '.join(profile.crops)}) ಪಿಎಂಎಫ್‌ಬಿವೈ ವಿಮಾ ವ್ಯಾಪ್ತಿಗೆ ಅಧಿಸೂಚಿಸಲ್ಪಟ್ಟಿದೆ."
            ))
        else:
            rules.append(RuleCheckResult(
                rule_key="crop_notified",
                rule_label_en="Notified Crop Verification",
                rule_label_kn="ಅಧಿಸೂಚಿತ ಬೆಳೆ ಪರಿಶೀಲನೆ",
                status="not_satisfied",
                farmer_value=", ".join(profile.crops),
                required_value="Notified PMFBY crop",
                explanation_en=f"Crop ({', '.join(profile.crops)}) may not be notified under the standard PMFBY list for this cluster.",
                explanation_kn=f"ನಿಮ್ಮ ಬೆಳೆ ({', '.join(profile.crops)}) ಈ ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿ ಸಾಮಾನ್ಯ ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳ ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲದಿರಬಹುದು."
            ))

    # Rule 2: Insurable Interest (Owner, Tenant, Sharecropper all eligible)
    if profile.ownership_type is None:
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Farmer Cultivator Status",
            rule_label_kn="ರೈತ ಸಾಗುವಳಿದಾರರ ಸ್ಥಿತಿ",
            status="unknown",
            farmer_value=None,
            required_value="Owner, Tenant, or Sharecropper",
            explanation_en="Please state if you own the land or cultivate as a tenant.",
            explanation_kn="ನೀವು ಸ್ವಂತ ಭೂಮಿಯಲ್ಲಿ ಅಥವಾ ಗೇಣಿ/ಪಾಲುದಾರಿಕೆಯಲ್ಲಿ ಕೃಷಿ ಮಾಡುತ್ತಿದ್ದೀರಾ ತಿಳಿಸಿ."
        ))
        missing_fields.append("ownership_type")
    elif profile.ownership_type in ["owner", "tenant", "sharecropper"]:
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Farmer Cultivator Status",
            rule_label_kn="ರೈತ ಸಾಗುವಳಿದಾರರ ಸ್ಥಿತಿ",
            status="satisfied",
            farmer_value=profile.ownership_type,
            required_value="Owner or Tenant",
            explanation_en=f"Satisfied: Both owners and tenant/sharecropper farmers with insurable interest can enroll.",
            explanation_kn=f"ಪೂರೈಸಲಾಗಿದೆ: ಸ್ವಂತ ಭೂಮಿ ಮತ್ತು ಗೇಣಿದಾರರಿಬ್ಬರೂ ಬೆಳೆ ವಿಮೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು."
        ))
    else:
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Farmer Cultivator Status",
            rule_label_kn="ರೈತ ಸಾಗುವಳಿದಾರರ ಸ್ಥಿತಿ",
            status="not_satisfied",
            farmer_value=profile.ownership_type,
            required_value="Owner or Tenant",
            explanation_en="Invalid cultivator category.",
            explanation_kn="ಅಮಾನ್ಯ ಸಾಗುವಳಿದಾರರ ವರ್ಗ."
        ))

    # Rule 3: Cultivable Land Area
    if profile.land_area_acres is None:
        rules.append(RuleCheckResult(
            rule_key="land_area_acres",
            rule_label_en="Insured Area",
            rule_label_kn="ವಿಮೆ ಮಾಡಿಸಲಾದ ವಿಸ್ತೀರ್ಣ",
            status="unknown",
            farmer_value=None,
            required_value=">= 0.01 acres",
            explanation_en="Please confirm the cultivated acreage for premium calculation.",
            explanation_kn="ವಿಮಾ ಪ್ರೀಮಿಯಂ ಲೆಕ್ಕಾಚಾರಕ್ಕಾಗಿ ಬಿತ್ತನೆ ವಿಸ್ತೀರ್ಣ ತಿಳಿಸಿ."
        ))
        missing_fields.append("land_area_acres")
    elif profile.land_area_acres > 0:
        rules.append(RuleCheckResult(
            rule_key="land_area_acres",
            rule_label_en="Insured Area",
            rule_label_kn="ವಿಮೆ ಮಾಡಿಸಲಾದ ವಿಸ್ತೀರ್ಣ",
            status="satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value=">= 0.01 acres",
            explanation_en=f"Satisfied: {profile.land_area_acres} acres is eligible for premium coverage.",
            explanation_kn=f"ಪೂರೈಸಲಾಗಿದೆ: {profile.land_area_acres} ಎಕರೆ ವಿಸ್ತೀರ್ಣಕ್ಕೆ ವಿಮಾ ರಕ್ಷಣೆ ಪಡೆಯಬಹುದು."
        ))
    else:
        rules.append(RuleCheckResult(
            rule_key="land_area_acres",
            rule_label_en="Insured Area",
            rule_label_kn="ವಿಮೆ ಮಾಡಿಸಲಾದ ವಿಸ್ತೀರ್ಣ",
            status="not_satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value="> 0 acres",
            explanation_en="Area must be positive.",
            explanation_kn="ವಿಸ್ತೀರ್ಣ ಧನಾತ್ಮಕವಾಗಿರಬೇಕು."
        ))

    overall = determine_overall_status(rules)

    return SchemeEvaluation(
        scheme_id=scheme_data["id"],
        scheme_name=scheme_data["name"],
        short_name=scheme_data["short_name"],
        category=scheme_data["category"],
        is_demo=scheme_data.get("is_demo", False),
        watermark_notice=scheme_data.get("watermark_notice"),
        verification_status=scheme_data["verification_status"],
        verification_date=scheme_data["verification_date"],
        verified_by=scheme_data["verified_by"],
        official_source_url=scheme_data["official_source_url"],
        application_portal=scheme_data["application_portal"],
        helpline=scheme_data["helpline"],
        description=scheme_data["description"],
        benefits=scheme_data["benefits"],
        overall_status=overall,
        rules_breakdown=rules,
        missing_fields_for_scheme=missing_fields,
        required_documents=scheme_data["required_documents"]
    )

def evaluate_demo_micro_irrigation(scheme_data: Dict[str, Any], profile: FarmerProfile) -> SchemeEvaluation:
    rules: List[RuleCheckResult] = []
    missing_fields: List[str] = []

    # Rule 1: Land holding ceiling (<= 12.5 acres)
    if profile.land_area_acres is None:
        rules.append(RuleCheckResult(
            rule_key="land_ceiling",
            rule_label_en="Land Holding Ceiling (<= 12.5 acres)",
            rule_label_kn="ಗರಿಷ್ಠ ಭೂಮಿತಿ (<= 12.5 ಎಕರೆ)",
            status="unknown",
            farmer_value=None,
            required_value="<= 12.5 acres",
            explanation_en="Please provide land size to calculate subsidy tier (90% for <= 5 acres, 45% above).",
            explanation_kn="ಸಹಾಯಧನದ ಶೇಕಡಾವಾರು ಲೆಕ್ಕಹಾಕಲು ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ ತಿಳಿಸಿ (5 ಎಕರೆವರೆಗೆ 90%, ಮೇಲ್ಪಟ್ಟು 45%)."
        ))
        missing_fields.append("land_area_acres")
    elif profile.land_area_acres <= 5.0 and profile.land_area_acres > 0:
        rules.append(RuleCheckResult(
            rule_key="land_ceiling",
            rule_label_en="Land Holding Ceiling",
            rule_label_kn="ಗರಿಷ್ಠ ಭೂಮಿತಿ",
            status="satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value="<= 12.5 acres",
            explanation_en=f"Satisfied: Small/Marginal farmer quota ({profile.land_area_acres} acres <= 5 acres) qualifies for peak 90% subsidy.",
            explanation_kn=f"ಪೂರೈಸಲಾಗಿದೆ: ಸಣ್ಣ/ಅತಿ ಸಣ್ಣ ರೈತರ ಕೋಟಾದಡಿ ({profile.land_area_acres} ಎಕರೆ) ಗರಿಷ್ಠ 90% ಸಹಾಯಧನ ಲಭ್ಯ."
        ))
    elif profile.land_area_acres <= 12.5:
        rules.append(RuleCheckResult(
            rule_key="land_ceiling",
            rule_label_en="Land Holding Ceiling",
            rule_label_kn="ಗರಿಷ್ಠ ಭೂಮಿತಿ",
            status="satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value="<= 12.5 acres",
            explanation_en=f"Satisfied: Medium/Large farmer quota ({profile.land_area_acres} acres) qualifies for 45-50% subsidy.",
            explanation_kn=f"ಪೂರೈಸಲಾಗಿದೆ: ಮಧ್ಯಮ/ದೊಡ್ಡ ರೈತರ ಕೋಟಾದಡಿ ({profile.land_area_acres} ಎಕರೆ) 45-50% ಸಹಾಯಧನ ಲಭ್ಯ."
        ))
    else:
        rules.append(RuleCheckResult(
            rule_key="land_ceiling",
            rule_label_en="Land Holding Ceiling",
            rule_label_kn="ಗರಿಷ್ಠ ಭೂಮಿತಿ",
            status="not_satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value="<= 12.5 acres",
            explanation_en=f"Ineligible: Holding exceeds scheme maximum limit of 12.5 acres.",
            explanation_kn=f"ಅನರ್ಹ: ಭೂ ಹಿಡುವಳಿ ಗರಿಷ್ಠ ಮಿತಿಯಾದ 12.5 ಎಕರೆಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ."
        ))

    # Rule 2: Water Source / Irrigation requirement
    if profile.has_irrigation is None:
        rules.append(RuleCheckResult(
            rule_key="water_source",
            rule_label_en="Assured Irrigation Source",
            rule_label_kn="ಖಚಿತ ನೀರಾವರಿ ಮೂಲ",
            status="unknown",
            farmer_value=None,
            required_value="Borewell, Open Well, or Canal connection",
            explanation_en="Micro-irrigation requires an existing functional water source (borewell/well/canal).",
            explanation_kn="ಹನಿ/ತುಂತುರು ನೀರಾವರಿಗೆ ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಬೋರ್‌ವೆಲ್/ಬಾವಿ/ಕಾಲುವೆ ನೀರಿನ ಮೂಲ ಕಡ್ಡಾಯ."
        ))
        missing_fields.append("has_irrigation")
    elif profile.has_irrigation:
        rules.append(RuleCheckResult(
            rule_key="water_source",
            rule_label_en="Assured Irrigation Source",
            rule_label_kn="ಖಚಿತ ನೀರಾವರಿ ಮೂಲ",
            status="satisfied",
            farmer_value="Functional source confirmed",
            required_value="Assured source required",
            explanation_en="Satisfied: Functional water source confirmed.",
            explanation_kn="ಪೂರೈಸಲಾಗಿದೆ: ಚಾಲ್ತಿಯಲ್ಲಿರುವ ನೀರಿನ ಮೂಲ ದೃಢಪಟ್ಟಿದೆ."
        ))
    else:
        rules.append(RuleCheckResult(
            rule_key="water_source",
            rule_label_en="Assured Irrigation Source",
            rule_label_kn="ಖಚಿತ ನೀರಾವರಿ ಮೂಲ",
            status="not_satisfied",
            farmer_value="No water source",
            required_value="Assured source required",
            explanation_en="Ineligible: Micro-irrigation equipment cannot be sanctioned without a water source.",
            explanation_kn="ಅನರ್ಹ: ನೀರಿನ ಮೂಲವಿಲ್ಲದೆ ಹನಿ ನೀರಾವರಿ ಉಪಕರಣ ಮಂಜೂರು ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ."
        ))

    # Rule 3: State / District (Karnataka)
    if profile.district is None:
        rules.append(RuleCheckResult(
            rule_key="state_jurisdiction",
            rule_label_en="State Jurisdiction Check",
            rule_label_kn="ರಾಜ್ಯ ವ್ಯಾಪ್ತಿ ಪರಿಶೀಲನೆ",
            status="unknown",
            farmer_value=None,
            required_value="Karnataka district",
            explanation_en="Please provide your district name.",
            explanation_kn="ದಯವಿಟ್ಟು ನಿಮ್ಮ ಜಿಲ್ಲೆಯ ಹೆಸರನ್ನು ತಿಳಿಸಿ."
        ))
        missing_fields.append("district")
    else:
        d_clean = profile.district.strip().lower()
        if d_clean in KARNATAKA_DISTRICTS or "karnataka" in d_clean:
            rules.append(RuleCheckResult(
                rule_key="state_jurisdiction",
                rule_label_en="State Jurisdiction Check",
                rule_label_kn="ರಾಜ್ಯ ವ್ಯಾಪ್ತಿ ಪರಿಶೀಲನೆ",
                status="satisfied",
                farmer_value=profile.district,
                required_value="Karnataka district",
                explanation_en=f"Satisfied: {profile.district} is within Karnataka jurisdiction.",
                explanation_kn=f"ಪೂರೈಸಲಾಗಿದೆ: {profile.district} ಕರ್ನಾಟಕ ರಾಜ್ಯ ವ್ಯಾಪ್ತಿಯಲ್ಲಿದೆ."
            ))
        else:
            rules.append(RuleCheckResult(
                rule_key="state_jurisdiction",
                rule_label_en="State Jurisdiction Check",
                rule_label_kn="ರಾಜ್ಯ ವ್ಯಾಪ್ತಿ ಪರಿಶೀಲನೆ",
                status="satisfied", # Fallback lenient for demonstration unless explicitly non-Karnataka
                farmer_value=profile.district,
                required_value="Karnataka district",
                explanation_en=f"District noted: {profile.district}.",
                explanation_kn=f"ಜಿಲ್ಲೆ ದಾಖಲಾಗಿದೆ: {profile.district}."
            ))

    overall = determine_overall_status(rules)

    return SchemeEvaluation(
        scheme_id=scheme_data["id"],
        scheme_name=scheme_data["name"],
        short_name=scheme_data["short_name"],
        category=scheme_data["category"],
        is_demo=scheme_data.get("is_demo", True),
        watermark_notice=scheme_data.get("watermark_notice"),
        verification_status=scheme_data["verification_status"],
        verification_date=scheme_data["verification_date"],
        verified_by=scheme_data["verified_by"],
        official_source_url=scheme_data["official_source_url"],
        application_portal=scheme_data["application_portal"],
        helpline=scheme_data["helpline"],
        description=scheme_data["description"],
        benefits=scheme_data["benefits"],
        overall_status=overall,
        rules_breakdown=rules,
        missing_fields_for_scheme=missing_fields,
        required_documents=scheme_data["required_documents"]
    )

def evaluate_demo_agri_equipment(scheme_data: Dict[str, Any], profile: FarmerProfile) -> SchemeEvaluation:
    rules: List[RuleCheckResult] = []
    missing_fields: List[str] = []

    # Rule 1: Ownership (Must be owner for machinery subsidy)
    if profile.ownership_type is None:
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Land Ownership for Mechanization",
            rule_label_kn="ಯಾಂತ್ರೀಕರಣಕ್ಕಾಗಿ ಭೂ ಮಾಲೀಕತ್ವ",
            status="unknown",
            farmer_value=None,
            required_value="owner",
            explanation_en="Farm mechanization equipment subsidies require ownership title (RTC).",
            explanation_kn="ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ ಸಬ್ಸಿಡಿಗೆ ಸ್ವಂತ ಪಹಣಿ (ಆರ್‌ಟಿಸಿ) ಇರಬೇಕು."
        ))
        missing_fields.append("ownership_type")
    elif profile.ownership_type == "owner":
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Land Ownership for Mechanization",
            rule_label_kn="ಯಾಂತ್ರೀಕರಣಕ್ಕಾಗಿ ಭೂ ಮಾಲೀಕತ್ವ",
            status="satisfied",
            farmer_value="owner",
            required_value="owner",
            explanation_en="Satisfied: Land title record available for machine pledge.",
            explanation_kn="ಪೂರೈಸಲಾಗಿದೆ: ಯಂತ್ರ ಸಬ್ಸಿಡಿಗೆ ಮಾಲೀಕತ್ವ ಅರ್ಹವಾಗಿದೆ."
        ))
    else:
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Land Ownership for Mechanization",
            rule_label_kn="ಯಾಂತ್ರೀಕರಣಕ್ಕಾಗಿ ಭೂ ಮಾಲೀಕತ್ವ",
            status="not_satisfied",
            farmer_value=profile.ownership_type,
            required_value="owner",
            explanation_en=f"Ineligible: Individual machinery subsidy requires registered ownership.",
            explanation_kn=f"ಅನರ್ಹ: ಯಂತ್ರೋಪಕರಣ ಸಬ್ಸಿಡಿಗೆ ಸ್ವಂತ ಭೂಮಾಲೀಕತ್ವ ಕಡ್ಡಾಯ."
        ))

    # Rule 2: Land size between 1.0 and 25.0 acres
    if profile.land_area_acres is None:
        rules.append(RuleCheckResult(
            rule_key="land_area_range",
            rule_label_en="Farm Size Threshold (1.0 - 25.0 acres)",
            rule_label_kn="ಕೃಷಿ ಭೂಮಿಯ ಮಿತಿ (1.0 - 25.0 ಎಕರೆ)",
            status="unknown",
            farmer_value=None,
            required_value="1.0 - 25.0 acres",
            explanation_en="Please provide land size (minimum 1.0 acre required for mechanization subsidies).",
            explanation_kn="ಕೃಷಿ ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ ತಿಳಿಸಿ (ಯಂತ್ರ ಸಬ್ಸಿಡಿಗೆ ಕನಿಷ್ಠ 1.0 ಎಕರೆ ಅಗತ್ಯ)."
        ))
        missing_fields.append("land_area_acres")
    elif 1.0 <= profile.land_area_acres <= 25.0:
        rules.append(RuleCheckResult(
            rule_key="land_area_range",
            rule_label_en="Farm Size Threshold",
            rule_label_kn="ಕೃಷಿ ಭೂಮಿಯ ಮಿತಿ",
            status="satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value="1.0 - 25.0 acres",
            explanation_en=f"Satisfied: Landholding of {profile.land_area_acres} acres qualifies for equipment subsidy quota.",
            explanation_kn=f"ಪೂರೈಸಲಾಗಿದೆ: {profile.land_area_acres} ಎಕರೆ ಭೂಮಿಗೆ ಯಂತ್ರೋಪಕರಣ ಸಬ್ಸಿಡಿ ಲಭ್ಯ."
        ))
    elif profile.land_area_acres < 1.0:
        rules.append(RuleCheckResult(
            rule_key="land_area_range",
            rule_label_en="Farm Size Threshold",
            rule_label_kn="ಕೃಷಿ ಭೂಮಿಯ ಮಿತಿ",
            status="not_satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value=">= 1.0 acre",
            explanation_en="Ineligible: Minimum holding for power tillers/tractors is 1.0 acre.",
            explanation_kn="ಅನರ್ಹ: ಪವರ್ ಟಿಲ್ಲರ್/ಟ್ರ್ಯಾಕ್ಟರ್ ಸಬ್ಸಿಡಿಗೆ ಕನಿಷ್ಠ 1.0 ಎಕರೆ ಇರಬೇಕು."
        ))
    else:
        rules.append(RuleCheckResult(
            rule_key="land_area_range",
            rule_label_en="Farm Size Threshold",
            rule_label_kn="ಕೃಷಿ ಭೂಮಿಯ ಮಿತಿ",
            status="not_satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value="<= 25.0 acres",
            explanation_en="Ineligible: Holding exceeds maximum 25.0 acre subsidy cap.",
            explanation_kn="ಅನರ್ಹ: ಭೂಮಿ ಗರಿಷ್ಠ 25.0 ಎಕರೆ ಮಿತಿಯನ್ನು ಮೀರಿದೆ."
        ))

    overall = determine_overall_status(rules)

    return SchemeEvaluation(
        scheme_id=scheme_data["id"],
        scheme_name=scheme_data["name"],
        short_name=scheme_data["short_name"],
        category=scheme_data["category"],
        is_demo=scheme_data.get("is_demo", True),
        watermark_notice=scheme_data.get("watermark_notice"),
        verification_status=scheme_data["verification_status"],
        verification_date=scheme_data["verification_date"],
        verified_by=scheme_data["verified_by"],
        official_source_url=scheme_data["official_source_url"],
        application_portal=scheme_data["application_portal"],
        helpline=scheme_data["helpline"],
        description=scheme_data["description"],
        benefits=scheme_data["benefits"],
        overall_status=overall,
        rules_breakdown=rules,
        missing_fields_for_scheme=missing_fields,
        required_documents=scheme_data["required_documents"]
    )

def evaluate_demo_soil_improvement(scheme_data: Dict[str, Any], profile: FarmerProfile) -> SchemeEvaluation:
    rules: List[RuleCheckResult] = []
    missing_fields: List[str] = []

    # Rule 1: Agricultural landholder / tenant (All recognized)
    if profile.ownership_type is None:
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Cultivator Status",
            rule_label_kn="ಸಾಗುವಳಿದಾರರ ಸ್ಥಿತಿ",
            status="unknown",
            farmer_value=None,
            required_value="Owner, Tenant, or Sharecropper",
            explanation_en="Cultivator status needed for Soil Health Card registration.",
            explanation_kn="ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ನೋಂದಣಿಗೆ ಸಾಗುವಳಿದಾರರ ವಿವರ ಅಗತ್ಯ."
        ))
        missing_fields.append("ownership_type")
    else:
        rules.append(RuleCheckResult(
            rule_key="ownership_type",
            rule_label_en="Cultivator Status",
            rule_label_kn="ಸಾಗುವಳಿದಾರರ ಸ್ಥಿತಿ",
            status="satisfied",
            farmer_value=profile.ownership_type,
            required_value="Any active cultivator",
            explanation_en="Satisfied: Soil testing is open to all active farmers.",
            explanation_kn="ಪೂರೈಸಲಾಗಿದೆ: ಮಣ್ಣು ಪರೀಕ್ಷೆ ಎಲ್ಲಾ ಕೃಷಿಕರಿಗೆ ಮುಕ್ತವಾಗಿದೆ."
        ))

    # Rule 2: Land size (0.1 to 50 acres)
    if profile.land_area_acres is None:
        rules.append(RuleCheckResult(
            rule_key="land_area_acres",
            rule_label_en="Sample Plot Size",
            rule_label_kn="ಮಣ್ಣಿನ ಮಾದರಿ ಪ್ಲಾಟ್ ವಿಸ್ತೀರ್ಣ",
            status="unknown",
            farmer_value=None,
            required_value=">= 0.1 acres",
            explanation_en="Please provide plot acreage for grid sample planning.",
            explanation_kn="ಮಣ್ಣಿನ ಮಾದರಿ ಸಂಗ್ರಹಣೆಗೆ ವಿಸ್ತೀರ್ಣ ತಿಳಿಸಿ."
        ))
        missing_fields.append("land_area_acres")
    elif 0.1 <= profile.land_area_acres <= 50.0:
        rules.append(RuleCheckResult(
            rule_key="land_area_acres",
            rule_label_en="Sample Plot Size",
            rule_label_kn="ಮಣ್ಣಿನ ಮಾದರಿ ಪ್ಲಾಟ್ ವಿಸ್ತೀರ್ಣ",
            status="satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value="0.1 - 50.0 acres",
            explanation_en=f"Satisfied: {profile.land_area_acres} acres eligible for free soil health testing & micronutrient subsidy.",
            explanation_kn=f"ಪೂರೈಸಲಾಗಿದೆ: {profile.land_area_acres} ಎಕರೆಗೆ ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಪೋಷಕಾಂಶ ಸಬ್ಸಿಡಿ ಲಭ್ಯ."
        ))
    else:
        rules.append(RuleCheckResult(
            rule_key="land_area_acres",
            rule_label_en="Sample Plot Size",
            rule_label_kn="ಮಣ್ಣಿನ ಮಾದರಿ ಪ್ಲಾಟ್ ವಿಸ್ತೀರ್ಣ",
            status="not_satisfied",
            farmer_value=f"{profile.land_area_acres} acres",
            required_value="0.1 - 50.0 acres",
            explanation_en="Land size outside testing program bounds.",
            explanation_kn="ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ ಕಾರ್ಯಕ್ರಮದ ಮಿತಿಯ ಹೊರಗಿದೆ."
        ))

    overall = determine_overall_status(rules)

    return SchemeEvaluation(
        scheme_id=scheme_data["id"],
        scheme_name=scheme_data["name"],
        short_name=scheme_data["short_name"],
        category=scheme_data["category"],
        is_demo=scheme_data.get("is_demo", True),
        watermark_notice=scheme_data.get("watermark_notice"),
        verification_status=scheme_data["verification_status"],
        verification_date=scheme_data["verification_date"],
        verified_by=scheme_data["verified_by"],
        official_source_url=scheme_data["official_source_url"],
        application_portal=scheme_data["application_portal"],
        helpline=scheme_data["helpline"],
        description=scheme_data["description"],
        benefits=scheme_data["benefits"],
        overall_status=overall,
        rules_breakdown=rules,
        missing_fields_for_scheme=missing_fields,
        required_documents=scheme_data["required_documents"]
    )

def determine_overall_status(rules: List[RuleCheckResult]) -> str:
    # If any rule is not_satisfied -> overall is ineligible
    if any(r.status == "not_satisfied" for r in rules):
        return "ineligible"
    # If any rule is unknown -> overall is needs_more_info
    if any(r.status == "unknown" for r in rules):
        return "needs_more_info"
    # All rules satisfied
    return "eligible"

def evaluate_all_schemes(schemes: List[Dict[str, Any]], profile: FarmerProfile) -> List[SchemeEvaluation]:
    evaluators = {
        "pm-kisan": evaluate_pm_kisan,
        "pmfby": evaluate_pmfby,
        "demo-micro-irrigation": evaluate_demo_micro_irrigation,
        "demo-agri-equipment": evaluate_demo_agri_equipment,
        "demo-soil-improvement": evaluate_demo_soil_improvement
    }

    results: List[SchemeEvaluation] = []
    for s in schemes:
        sid = s["id"]
        if sid in evaluators:
            results.append(evaluators[sid](s, profile))
    return results

