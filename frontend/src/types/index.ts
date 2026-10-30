export type Language = 'kn' | 'en' | 'hi' | 'mr';
export type SupportedLanguage = Language;

export interface FarmerProfile {
  district?: string | null;
  land_area_acres?: number | null;
  crops: string[];
  ownership_type?: 'owner' | 'tenant' | 'sharecropper' | null;
  season?: 'kharif' | 'rabi' | 'summer' | 'annual' | null;
  has_irrigation?: boolean | null;
  is_income_tax_payer?: boolean;
  is_institutional?: boolean;
}

export interface RuleCheckResult {
  rule_key: string;
  rule_label_en: string;
  rule_label_kn: string;
  status: 'satisfied' | 'not_satisfied' | 'unknown' | 'not_applicable';
  farmer_value?: any;
  required_value?: any;
  explanation_en: string;
  explanation_kn: string;
}

export interface RequiredDocument {
  name_en: string;
  name_kn: string;
  mandatory: boolean;
}

export interface SchemeEvaluation {
  scheme_id: string;
  scheme_name: {
    en: string;
    kn: string;
  };
  short_name: string;
  category: string;
  is_demo: boolean;
  watermark_notice?: string | null;
  verification_status: string;
  verification_date: string;
  verified_by: string;
  official_source_url: string;
  application_portal: string;
  helpline: string;
  description: {
    en: string;
    kn: string;
  };
  benefits: {
    amount?: string;
    installments?: string;
    premium_subsidy?: string;
    en: string;
    kn: string;
  };
  overall_status: 'eligible' | 'ineligible' | 'needs_more_info';
  rules_breakdown: RuleCheckResult[];
  missing_fields_for_scheme: string[];
  required_documents: RequiredDocument[];
  confidence_score?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  audioBase64?: string | null;
  timestamp: string;
}

export interface ChatResponse {
  session_id: string;
  response_text: string;
  response_audio_base64?: string | null;
  audio_format?: string | null;
  language: Language;
  extracted_profile: FarmerProfile;
  missing_slots: string[];
  is_profile_complete: boolean;
  scheme_evaluations: SchemeEvaluation[];
  suggested_quick_replies: string[];
  slot_just_filled?: string | null;
  voice_provider?: string | null;
}
