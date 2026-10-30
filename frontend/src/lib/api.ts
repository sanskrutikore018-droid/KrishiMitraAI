import { FarmerProfile, SchemeEvaluation, ChatResponse, Language } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function checkBackendHealth(): Promise<{ healthy: boolean; data?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return { healthy: true, data };
    }
    return { healthy: false };
  } catch (err) {
    return { healthy: false };
  }
}

export async function fetchAllSchemes(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/schemes`, {
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch schemes:', err);
    return [];
  }
}

export async function evaluateProfile(profile: FarmerProfile): Promise<SchemeEvaluation[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/eligibility/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (err) {
    console.error('Failed to evaluate eligibility:', err);
    return [];
  }
}

export async function sendChatMessage(
  message: string,
  sessionId?: string,
  language: Language = 'kn',
  profileOverride?: FarmerProfile
): Promise<ChatResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        language,
        profile_override: profileOverride
      })
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('Chat API error:', err);
    return null;
  }
}

export async function sendAudioForSTT(audioBlob: Blob, language: Language = 'kn'): Promise<{ transcript: string; provider: string } | null> {
  try {
    const langMap: Record<Language, string> = {
      kn: 'kn-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      te: 'te-IN',
      en: 'en-IN'
    };
    const formData = new FormData();
    const ext = audioBlob.type.includes('webm') ? 'webm' : 'wav';
    formData.append('file', audioBlob, `voice_input.${ext}`);
    formData.append('language_code', langMap[language] || 'kn-IN');

    const res = await fetch(`${API_BASE_URL}/api/voice/stt`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error('STT API error:', err);
    return null;
  }
}

export async function requestTTS(text: string, language: Language = 'kn'): Promise<{ audioBase64?: string; success: boolean; provider: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/voice/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language })
    });
    if (res.ok) {
      const data = await res.json();
      return {
        audioBase64: data.audio_base64,
        success: data.success,
        provider: data.provider
      };
    }
    return null;
  } catch (err) {
    console.error('TTS API error:', err);
    return null;
  }
}

export interface VoiceStatus {
  sarvam_configured: boolean;
  masked_key?: string | null;
  stt_model: string;
  tts_model: string;
  supported_languages: string[];
  active_speakers: Record<string, string>;
  voice_engine: string;
}

export async function getVoiceStatus(): Promise<VoiceStatus | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/voice/status`, {
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function saveSarvamApiKey(apiKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/voice/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: data.message || 'Sarvam AI connected successfully!' };
    }
    return { success: false, message: data.detail || 'Failed to connect Sarvam AI' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error saving API key' };
  }
}

export async function testSarvamVoice(language: Language = 'kn'): Promise<{ success: boolean; audioBase64?: string; text?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/voice/test-sarvam?language=${language}`, {
      method: 'POST'
    });
    if (res.ok) {
      const data = await res.json();
      return {
        success: data.success,
        audioBase64: data.audio_base64,
        text: data.text,
        error: data.error
      };
    }
    return { success: false, error: `HTTP ${res.status}` };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

