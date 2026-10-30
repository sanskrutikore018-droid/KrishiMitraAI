'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Globe, Settings, Shield, ChevronDown, Sparkles } from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';

interface CinematicNavbarProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenSettings: () => void;
  isBackendHealthy: boolean;
}

export const CinematicNavbar: React.FC<CinematicNavbarProps> = ({
  language,
  onLanguageChange,
  onOpenSettings,
  isBackendHealthy
}) => {
  const dict = getDictionary(language);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languageOptions: { code: SupportedLanguage; label: string; sub: string }[] = [
    { code: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada' },
    { code: 'en', label: 'English', sub: 'English' },
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
    { code: 'mr', label: 'मराठी', sub: 'Marathi' }
  ];

  const currentLangLabel = languageOptions.find((l) => l.code === language)?.label || 'ಕನ್ನಡ';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#041209]/85 backdrop-blur-2xl border-b border-emerald-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.7)] py-3'
          : 'bg-gradient-to-b from-black/90 via-[#041209]/60 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Left */}
        <a href="#hero" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-800 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)] border border-emerald-400/40 group-hover:scale-105 group-hover:border-lime-400 transition-all duration-300">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-xl font-bold tracking-tight text-white drop-shadow-md">
                Krishi Mitra AI
              </span>
              <span
                className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
                title={isBackendHealthy ? 'Deterministic API: Connected' : 'Fallback Mode'}
              />
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-300/85 font-medium tracking-wide">
              An Initiative for Indian Agriculture
            </p>
          </div>
        </a>

        {/* Center Desktop Editorial Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-emerald-100/90 tracking-wider uppercase">
          <a href="#hero" className="hover:text-emerald-300 transition duration-200">
            {dict.navHome}
          </a>
          <a href="#story" className="hover:text-emerald-300 transition duration-200">
            {dict.navStory}
          </a>
          <a href="#voice-core" className="hover:text-emerald-300 transition duration-200 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
            <span className="text-lime-300 font-bold">{dict.navVoice}</span>
          </a>
          <a href="#schemes" className="hover:text-emerald-300 transition duration-200">
            {dict.navSchemes}
          </a>
          <a href="#eligibility" className="hover:text-emerald-300 transition duration-200">
            {dict.navEligibility}
          </a>
        </div>

        {/* Right Section: Emblem, Language Selector, Settings */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          {/* Government of India Emblem Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-400/40 text-[11px] text-amber-200 shadow-sm backdrop-blur-md">
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold tracking-wider uppercase text-[10px]">{dict.govIndia}</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0a2313]/80 hover:bg-[#0f2e1a] text-xs font-bold text-emerald-100 border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-200 shadow-md backdrop-blur-md"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLangLabel}</span>
              <ChevronDown className="w-3 h-3 text-emerald-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-44 rounded-2xl bg-[#091f11]/95 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      onLanguageChange(opt.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                      language === opt.code
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white font-extrabold shadow-md'
                        : 'text-emerald-200 hover:bg-emerald-900/60'
                    }`}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <span className="text-[10px] text-emerald-300/70">{opt.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-full bg-[#0a2313]/80 hover:bg-[#0f2e1a] text-emerald-200 border border-emerald-400/30 hover:border-emerald-400/60 transition shadow-md backdrop-blur-md"
            title={dict.settingsTitle}
          >
            <Settings className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>
    </nav>
  );
};
