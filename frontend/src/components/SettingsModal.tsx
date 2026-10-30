'use client';

import React, { useState } from 'react';
import { X, Settings, Shield, HelpCircle, Check, Globe } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { SupportedLanguage } from '../lib/i18n';

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
