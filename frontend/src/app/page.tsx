'use client';

import React, { useState, useEffect } from 'react';
import { CinematicNavbar } from '../components/CinematicNavbar';
import { CinematicHero } from '../components/CinematicHero';
import { StorytellingSection } from '../components/StorytellingSection';
import { LuminousVoiceCore } from '../components/LuminousVoiceCore';
import { FarmerProfileTracker } from '../components/FarmerProfileTracker';
import { SchemesShowcase } from '../components/SchemesShowcase';
import { EligibilityAssessmentView } from '../components/EligibilityAssessmentView';
import { EvidenceModal } from '../components/EvidenceModal';
import { SettingsModal } from '../components/SettingsModal';
import { DisclaimerFooter } from '../components/DisclaimerFooter';
import { MobileBottomNav } from '../components/MobileBottomNav';
import {
  FarmerProfile,
  SchemeEvaluation,
  ChatMessage
} from '../types';
import { SupportedLanguage, getDictionary } from '../lib/i18n';
import {
  checkBackendHealth,
  evaluateProfile,
  sendChatMessage
} from '../lib/api';

export default function Home() {
  const [language, setLanguage] = useState<SupportedLanguage>('kn');
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [profile, setProfile] = useState<FarmerProfile>({
    district: null,
    land_area_acres: null,
    crops: [],
    ownership_type: null,
    season: null,
    has_irrigation: null
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [schemes, setSchemes] = useState<SchemeEvaluation[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<SchemeEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dict = getDictionary(language);

  // Initialize on mount
  useEffect(() => {
    const initApp = async () => {
      // 1. Health check
      const health = await checkBackendHealth();
      setIsBackendHealthy(health.healthy);

      // 2. Initial schemes evaluation
      const initialEvaluations = await evaluateProfile(profile);
      setSchemes(initialEvaluations);

      // 3. Welcome message
      setMessages([
        {
          id: 'welcome-init',
          role: 'assistant',
          content:
            language === 'kn'
              ? 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಮಿತ್ರ AI. ನಿಮ್ಮ ಕೃಷಿ ಭೂಮಿ, ಬೆಳೆ ಮತ್ತು ಜಿಲ್ಲೆಯ ವಿವರಗಳನ್ನು ಹೇಳಿ, ನಿಮಗೆ ಸೂಕ್ತವಾದ ಸರ್ಕಾರಿ ಸಹಾಯಧನ ಮತ್ತು ಬೆಳೆ ವಿಮೆ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ ಕೊಡುತ್ತೇನೆ.'
              : 'Namaskara! I am your Krishi Mitra AI assistant. Tell me about your farmland, district, and crops to evaluate your eligibility for official schemes.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    };

    initApp();
  }, []);

  const handleStartJourney = () => {
    const el = document.getElementById('voice-core');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // 1. Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // 2. Call backend chat API
    const response = await sendChatMessage(text, sessionId || undefined, language as any);

    if (response) {
      if (response.session_id) {
        setSessionId(response.session_id);
      }
      if (response.extracted_profile) {
        setProfile(response.extracted_profile);
      }
      if (response.scheme_evaluations) {
        setSchemes(response.scheme_evaluations);
      }

      // Append assistant response
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response_text,
        audioBase64: response.response_audio_base64 || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } else {
      // Local fallback in case backend is offline
      const fallbackMsg: ChatMessage = {
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'kn'
            ? 'ಸರ್ವರ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು FastAPI ಬ್ಯಾಕೆಂಡ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಪರಿಶೀಲಿಸಿ.'
            : 'Unable to reach backend server. Please make sure FastAPI backend is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }

    setIsLoading(false);
  };

  const handleManualProfileUpdate = async (updated: FarmerProfile) => {
    setProfile(updated);
    setIsLoading(true);
    const evaluations = await evaluateProfile(updated);
    setSchemes(evaluations);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#07160b] text-[#f0f4f0] font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Cinematic Sticky Navigation Bar */}
      <CinematicNavbar
        language={language}
        onLanguageChange={setLanguage}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isBackendHealthy={isBackendHealthy}
      />

      {/* 2. Cinematic Animated Hero Section (Panel 1) */}
      <CinematicHero
        language={language}
        onLanguageChange={setLanguage}
        onStartJourney={handleStartJourney}
      />

      {/* 3. Scrolling Transition Storytelling Section (Panel 2) */}
      <StorytellingSection language={language} />

      {/* 4. Interactive Luminous AI Voice Assistant Core (Panel 3 & 6) */}
      <LuminousVoiceCore
        language={language}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        messages={messages}
        currentProfile={profile}
      />

      {/* 5. Farmer Profile Slot Status Tracker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-[#091f11] p-1 rounded-3xl border border-emerald-500/20 shadow-xl">
          <FarmerProfileTracker
            profile={profile}
            language={language as any}
            onUpdateProfile={handleManualProfileUpdate}
          />
        </div>
      </div>

      {/* 6. Government Schemes Showcase Section (Panel 4) */}
      <SchemesShowcase
        schemes={schemes}
        language={language}
        onSelectScheme={(s) => setSelectedScheme(s)}
      />

      {/* 7. Eligibility Assessment View (Panel 5) */}
      <EligibilityAssessmentView
        language={language}
        profile={profile}
        evaluations={schemes}
        onOpenGuidance={(scheme) => setSelectedScheme(scheme || schemes[0])}
      />

      {/* Evidence & Details Dossier Modal */}
      <EvidenceModal
        scheme={selectedScheme}
        language={language as any}
        onClose={() => setSelectedScheme(null)}
      />

      {/* Settings & Privacy Modal (Panel 7) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
      />

      {/* Statutory Disclaimer & Footer */}
      <DisclaimerFooter language={language as any} />

      {/* Mobile Floating Bottom Navigation (Panel 6) */}
      <MobileBottomNav language={language} />
    </div>
  );
}
