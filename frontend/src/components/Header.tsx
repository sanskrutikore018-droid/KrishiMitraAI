'use client';

import React from 'react';
import { Languages, Sprout, ShieldCheck, RefreshCw, Activity } from 'lucide-react';
import { Language } from '../types';
import { getDictionary } from '../lib/i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isBackendHealthy: boolean;
  onResetSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isBackendHealthy,
  onResetSession
}) => {
  const dict = getDictionary(language);

  return (
    <header className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white shadow-lg sticky top-0 z-40 border-b-2 border-amber-500">
      {/* Top microbar */}
      <div className="bg-emerald-950/80 px-4 py-1 text-xs font-medium text-emerald-200/90 flex justify-between items-center border-b border-emerald-800/40">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>{dict.govHeader}</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] text-emerald-100">
              {isBackendHealthy ? dict.liveStatus : dict.offlineStatus}
            </span>
          </div>
          <span className="text-emerald-400 hidden sm:inline">|</span>
          <span className="text-amber-300 hidden sm:inline font-semibold">
            {dict.voiceFirstTag}
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center shadow-md border border-white/20 text-emerald-950">
            <Sprout className="w-6 h-6 text-emerald-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">
                {dict.appTitle}
              </h1>
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                AI Voice
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium">
              {dict.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onResetSession}
            title="Reset Conversation & Profile"
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/60 transition flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ಹೊಸದು / New</span>
          </button>

          {/* Language Toggle Pill */}
          <button
            onClick={() => onLanguageChange(language === 'kn' ? 'en' : 'kn')}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-md transition transform active:scale-95"
          >
            <Languages className="w-4 h-4 text-emerald-950" />
            <span>{dict.switchLanguage}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

