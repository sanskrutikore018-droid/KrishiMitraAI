from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class FarmerProfile(BaseModel):
    district: Optional[str] = Field(None, description="District name, e.g., Belagavi, Mandya, Shimoga")
    land_area_acres: Optional[float] = Field(None, description="Landholding size in acres")
    crops: List[str] = Field(default_factory=list, description="List of cultivated crops, e.g., paddy, sugarcane, ragi")
    ownership_type: Optional[Literal["owner", "tenant", "sharecropper"]] = Field(
        None, description="Land ownership status: owner, tenant, or sharecropper"
    )
    season: Optional[Literal["kharif", "rabi", "summer", "annual"]] = Field(
        None, description="Cultivation season"
    )
    has_irrigation: Optional[bool] = Field(
        None, description="Whether farmer has borewell/canal/well irrigation source"
    )
    is_income_tax_payer: Optional[bool] = Field(
        False, description="Whether anyone in the family paid income tax in last assessment year"
    )
    is_institutional: Optional[bool] = Field(
        False, description="Whether the land is held by an institution/trust/entity"
    )

class RuleCheckResult(BaseModel):
    rule_key: str
    rule_label_en: str
    rule_label_kn: str
    rule_label_hi: Optional[str] = None
    rule_label_mr: Optional[str] = None
    status: Literal["satisfied", "not_satisfied", "unknown", "not_applicable"]
    farmer_value: Any = None
    required_value: Any = None
    explanation_en: str
    explanation_kn: str
    explanation_hi: Optional[str] = None
    explanation_mr: Optional[str] = None

class SchemeEvaluation(BaseModel):
    scheme_id: str
    scheme_name: Dict[str, str]
    short_name: str
    category: str
    is_demo: bool
    watermark_notice: Optional[str] = None
    verification_status: str
    verification_date: str
    verified_by: str
    official_source_url: str
    application_portal: str
    helpline: str
    description: Dict[str, str]
    benefits: Dict[str, Any]
    overall_status: Literal["eligible", "ineligible", "needs_more_info"]
    rules_breakdown: List[RuleCheckResult]
    missing_fields_for_scheme: List[str]
    required_documents: List[Dict[str, Any]]
    confidence_score: float = 1.0

class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    language: Literal["kn", "hi", "mr", "te", "en"] = "kn"
    profile_override: Optional[FarmerProfile] = None
    speaking_style: Optional[str] = Field("standard", description="Regional speaking style or dialect preference")

class ChatResponse(BaseModel):
    session_id: str
    response_text: str
    response_audio_base64: Optional[str] = None
    audio_format: Optional[str] = None
    language: Literal["kn", "hi", "mr", "te", "en"] = "kn"
    extracted_profile: FarmerProfile
    missing_slots: List[str]
    is_profile_complete: bool
    scheme_evaluations: List[SchemeEvaluation]
    suggested_quick_replies: List[str] = Field(default_factory=list)
    slot_just_filled: Optional[str] = None
    voice_provider: Optional[str] = None
    speaking_style: Optional[str] = "standard"

class STTResponse(BaseModel):
    transcript: str
    language_code: str
    confidence: float = 0.95
    provider: str

class TTSRequest(BaseModel):
    text: str
    language: Literal["kn", "hi", "mr", "te", "en"] = "kn"
    speaker: Optional[str] = None

class TTSResponse(BaseModel):
    audio_base64: Optional[str] = None
    audio_format: str = "audio/wav"
    provider: str
    success: bool
    error: Optional[str] = None

