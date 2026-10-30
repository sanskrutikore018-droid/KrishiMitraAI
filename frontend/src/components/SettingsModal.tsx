'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Settings,
  Shield,
  HelpCircle,
  Check,
  Globe,
  Cpu,
  Volume2,
  Sparkles,
  Key,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { SupportedLanguage } from '../lib/i18n';
import { getVoiceStatus, saveSarvamApiKey, testSarvamVoice, VoiceStatus } from '../lib/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: SupportedLanguage;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { language, setLanguage, dict, availableLanguages } = useTranslation();

  const [voiceInput, setVoiceInput] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [saveChat, setSaveChat] = useState(true);

  // Sarvam AI Voice Configuration State
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus | null>(null);
  const [sarvamKeyInput, setSarvamKeyInput] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadVoiceStatus();
    }
    return () => {
      if (testAudioRef.current) {
        testAudioRef.current.pause();
        testAudioRef.current = null;
      }
    };
  }, [isOpen]);

  const loadVoiceStatus = async () => {
    const status = await getVoiceStatus();
    setVoiceStatus(status);
  };

  const handleSaveSarvamKey = async () => {
    if (!sarvamKeyInput.trim()) return;
    setIsSavingKey(true);
    setSaveFeedback(null);
    const res = await saveSarvamApiKey(sarvamKeyInput.trim());
    setSaveFeedback(res);
    setIsSavingKey(false);
    if (res.success) {
      setSarvamKeyInput('');
      await loadVoiceStatus();
    }
  };

  const handleTestSarvamVoice = async () => {
    setIsTestingVoice(true);
    try {
      const res = await testSarvamVoice(language);
      if (res.success && res.audioBase64) {
        if (testAudioRef.current) {
          testAudioRef.current.pause();
        }
        const audio = new Audio(`data:audio/wav;base64,${res.audioBase64}`);
        testAudioRef.current = audio;
        audio.onended = () => setIsTestingVoice(false);
        audio.onerror = () => setIsTestingVoice(false);
        await audio.play();
      } else {
        alert(res.error || 'Failed to synthesize test voice. Please check your Sarvam API key.');
        setIsTestingVoice(false);
      }
    } catch (err) {
      setIsTestingVoice(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#081e0f] border border-emerald-500/40 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-950/80 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Settings className="w-5 h-5 text-lime-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              {dict.settingsTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-900 text-emerald-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body matching Panel 7 */}
        <div className="p-6 space-y-5 text-xs sm:text-sm max-h-[75vh] overflow-y-auto">
          {/* Section: Language Switcher (Panel 7 style) */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-lime-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{dict.languageName} / Language Selection</span>
            </span>
            <div className="grid grid-cols-1 gap-2">
              {availableLanguages.map((opt) => {
                const isSelected = language === opt.code;
                return (
                  <button
                    key={opt.code}
                    onClick={() => setLanguage(opt.code)}
                    className={`w-full px-3.5 py-2.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 border-lime-400 text-white font-bold shadow-md'
                        : 'bg-[#041209]/60 border-emerald-800/40 text-emerald-200 hover:bg-emerald-900/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm font-semibold">{opt.label}</span>
                      <span className="text-[11px] opacity-75">({opt.sub})</span>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-white text-emerald-900 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-emerald-500/40" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Sarvam AI Voice Engine */}
          <div className="border-t border-emerald-800/40 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-lime-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-lime-400" />
                <span>Sarvam AI Voice Engine</span>
              </span>
              {voiceStatus?.sarvam_configured ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-lime-300 border border-emerald-400/30 text-[10px] font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                  <span>Connected</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  Fallback Mode
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#041209]/80 border border-emerald-800/50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-300/80 font-medium">Models Active:</span>
                <span className="text-emerald-100 font-mono text-[11px]">
                  Saaras v2 (STT) • Bulbul v1 (TTS)
                </span>
              </div>

              {voiceStatus?.sarvam_configured ? (
                <div className="space-y-2 pt-1 border-t border-emerald-900/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-300/80">API Key:</span>
                    <span className="font-mono text-lime-300 text-[11px]">
                      {voiceStatus.masked_key || '••••••••••••••••'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={handleTestSarvamVoice}
                      disabled={isTestingVoice}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                    >
                      {isTestingVoice ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Speaking...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Test Sarvam Voice</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setVoiceStatus({ ...voiceStatus, sarvam_configured: false })}
                      className="py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-semibold transition cursor-pointer"
                    >
                      Change Key
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1 border-t border-emerald-900/60">
                  <label className="block text-[11px] font-semibold text-emerald-200">
                    Connect Sarvam AI Subscription Key:
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Key className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={sarvamKeyInput}
                        onChange={(e) => setSarvamKeyInput(e.target.value)}
                        placeholder="Paste Sarvam API key here"
                        className="w-full pl-8 pr-2.5 py-1.5 bg-[#020a05] border border-emerald-500/40 rounded-xl text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-lime-400"
                      />
                    </div>
                    <button
                      onClick={handleSaveSarvamKey}
                      disabled={isSavingKey || !sarvamKeyInput.trim()}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center space-x-1 shrink-0 ${
                        sarvamKeyInput.trim() && !isSavingKey
                          ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-emerald-950 hover:scale-105 cursor-pointer shadow-md'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSavingKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>Connect</span>
                    </button>
                  </div>

                  {saveFeedback && (
                    <div
                      className={`p-2 rounded-xl text-xs flex items-center space-x-1.5 ${
                        saveFeedback.success
                          ? 'bg-emerald-500/20 text-lime-300 border border-emerald-400/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {saveFeedback.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{saveFeedback.message}</span>
                    </div>
                  )}

                  <p className="text-[10px] text-emerald-400/70 pt-0.5">
                    Keys are kept secure on your local server. Get your key at{' '}
                    <a
                      href="https://www.sarvam.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lime-300 underline font-semibold"
                    >
                      sarvam.ai
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-emerald-800/40 pt-4 space-y-3">
            <span className="text-[11px] font-bold text-lime-400 uppercase tracking-wider block">
              ವ್ಯవಸ್ಥಾ ಆದ್ಯತೆಗಳು / Preferences
            </span>

            {/* Toggle 1: Voice Input */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#041209]/60 border border-emerald-800/40">
              <span className="font-semibold text-emerald-100">
                {dict.voiceInputSetting}
              </span>
              <button
                onClick={() => setVoiceInput(!voiceInput)}
                className={`w-11 h-6 rounded-full transition duration-200 relative p-0.5 ${
                  voiceInput ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    voiceInput ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Auto Play Response */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#041209]/60 border border-emerald-800/40">
              <span className="font-semibold text-emerald-100">
                {dict.autoPlaySetting}
              </span>
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`w-11 h-6 rounded-full transition duration-200 relative p-0.5 ${
                  autoPlay ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    autoPlay ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Save Conversation */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#041209]/60 border border-emerald-800/40">
              <span className="font-semibold text-emerald-100">
                {dict.saveChatSetting}
              </span>
              <button
                onClick={() => setSaveChat(!saveChat)}
                className={`w-11 h-6 rounded-full transition duration-200 relative p-0.5 ${
                  saveChat ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    saveChat ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="pt-2 space-y-2 text-xs text-emerald-300">
            <a
              href="#story"
              onClick={onClose}
              className="flex items-center space-x-2 p-2.5 rounded-xl hover:bg-emerald-900/40 transition"
            >
              <Shield className="w-4 h-4 text-lime-400" />
              <span>{dict.privacyPolicy}</span>
            </a>
            <a
              href="#eligibility"
              onClick={onClose}
              className="flex items-center space-x-2 p-2.5 rounded-xl hover:bg-emerald-900/40 transition"
            >
              <HelpCircle className="w-4 h-4 text-lime-400" />
              <span>{dict.helpSupport}</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-emerald-950/80 border-t border-emerald-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs transition shadow-md"
          >
            ಸರಿ / Done
          </button>
        </div>
      </div>
    </div>
  );
};
