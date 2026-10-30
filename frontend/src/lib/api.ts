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
    const formData = new FormData();
    formData.append('file', audioBlob, 'voice_input.wav');
    formData.append('language_code', language === 'kn' ? 'kn-IN' : 'en-IN');

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

