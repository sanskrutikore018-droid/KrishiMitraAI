'use client';

import React, { useState } from 'react';
import { X, Settings, Shield, HelpCircle, FileText, Check } from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;
  const dict = getDictionary(language);

  const [voiceInput, setVoiceInput] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [saveChat, setSaveChat] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#081e0f] border border-emerald-500/40 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-950/80 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-emerald-400" />
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
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Toggle 1: Voice Input */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/30">
            <div className="flex items-center space-x-2.5">
              <span className="font-semibold text-emerald-100">
                {dict.voiceInputSetting}
              </span>
            </div>
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
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/30">
            <div className="flex items-center space-x-2.5">
              <span className="font-semibold text-emerald-100">
                {dict.autoPlaySetting}
              </span>
            </div>
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
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/30">
            <div className="flex items-center space-x-2.5">
              <span className="font-semibold text-emerald-100">
                {dict.saveChatSetting}
              </span>
            </div>
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

          {/* Links */}
          <div className="pt-2 space-y-2 text-xs text-emerald-300">
            <a
              href="#story"
              onClick={onClose}
              className="flex items-center space-x-2 p-2.5 rounded-xl hover:bg-emerald-900/40 transition"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{dict.privacyPolicy}</span>
            </a>
            <a
              href="#eligibility"
              onClick={onClose}
              className="flex items-center space-x-2 p-2.5 rounded-xl hover:bg-emerald-900/40 transition"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>{dict.helpSupport}</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-emerald-950/80 border-t border-emerald-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
          >
            ಸರಿ / Done
          </button>
        </div>
      </div>
    </div>
  );
};

