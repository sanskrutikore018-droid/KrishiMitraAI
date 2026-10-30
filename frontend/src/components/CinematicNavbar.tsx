'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Globe, Settings, Shield, ChevronDown } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 40);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07160ad9] backdrop-blur-md border-b border-emerald-900/40 shadow-xl py-2.5'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Left */}
        <a href="#hero" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg border border-emerald-400/30 group-hover:scale-105 transition">
            <Sprout className="w-5 h-5 text-emerald-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-sm">
                Krishi Mitra AI
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title={isBackendHealthy ? 'Live API' : 'Fallback'} />
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-300/80 font-medium">
              Your AI Farming Companion
            </p>
          </div>
        </a>

        {/* Center Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-7 text-xs font-semibold text-emerald-100/90 tracking-wide">
          <a href="#hero" className="hover:text-emerald-300 transition duration-150">
            {dict.navHome}
          </a>
          <a href="#story" className="hover:text-emerald-300 transition duration-150">
            {dict.navStory}
          </a>
          <a href="#voice-core" className="hover:text-emerald-300 transition duration-150 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{dict.navVoice}</span>
          </a>
          <a href="#schemes" className="hover:text-emerald-300 transition duration-150">
            {dict.navSchemes}
          </a>
          <a href="#eligibility" className="hover:text-emerald-300 transition duration-150">
            {dict.navEligibility}
          </a>
        </div>

        {/* Right Section: Emblem, Language Selector, Settings */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Government of India Emblem Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-emerald-400/20 text-[11px] text-emerald-200">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium tracking-wide">{dict.govIndia}</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900 text-xs font-bold text-emerald-100 border border-emerald-500/30 transition shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLangLabel}</span>
              <ChevronDown className="w-3 h-3 text-emerald-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-[#091f11] border border-emerald-500/30 shadow-2xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      onLanguageChange(opt.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                      language === opt.code
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-emerald-200 hover:bg-emerald-900/60'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] opacity-70">{opt.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/30 transition"
            title={dict.settingsTitle}
          >
            <Settings className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>
    </nav>
  );
};
