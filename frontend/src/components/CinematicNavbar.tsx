'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Globe, Settings, Shield, ChevronDown, Check, User, LogOut } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SupportedLanguage } from '../lib/i18n';

interface CinematicNavbarProps {
  onOpenSettings: () => void;
  isBackendHealthy: boolean;
}

export const CinematicNavbar: React.FC<CinematicNavbarProps> = ({
  onOpenSettings,
  isBackendHealthy
}) => {
  const { language, setLanguage, dict, availableLanguages, currentLanguageMeta } = useTranslation();
  const { user, isAuthenticated, openLogin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#041209]/90 backdrop-blur-2xl border-b border-emerald-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.7)] py-3'
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

          {/* 5-Language Reactive Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0a2313]/90 hover:bg-[#0f2e1a] text-xs font-bold text-emerald-100 border border-emerald-400/40 hover:border-lime-400 transition-all duration-200 shadow-md backdrop-blur-md"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-lime-400" />
              <span>{currentLanguageMeta.label}</span>
              <ChevronDown className={`w-3 h-3 text-emerald-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-52 rounded-2xl bg-[#091f11]/95 backdrop-blur-2xl border border-emerald-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-emerald-400 font-bold border-b border-emerald-800/40 mb-1">
                  ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language
                </div>
                {availableLanguages.map((opt) => {
                  const isSelected = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLanguage(opt.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all duration-150 ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 text-white font-extrabold shadow-md'
                          : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm leading-tight">{opt.label}</span>
                        <span className="text-[10px] opacity-75">{opt.sub} ({opt.region})</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Farmer Authentication: Login Button OR Profile Avatar Pill */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/90 via-[#0a2313] to-emerald-950/90 border border-emerald-400/50 hover:border-lime-400 transition shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-emerald-950 font-black text-xs flex items-center justify-center shadow-xs">
                  {user.name ? user.name[0].toUpperCase() : 'R'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-white block leading-tight max-w-[95px] truncate group-hover:text-lime-300 transition">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-lime-300 font-mono block leading-tight">
                    {user.land_area_acres || 2.5} ac • {user.district || 'Belagavi'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-emerald-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-[#091f11]/95 backdrop-blur-2xl border border-emerald-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="border-b border-emerald-800/40 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-emerald-950 font-black text-sm flex items-center justify-center shadow-md">
                        {user.name ? user.name[0].toUpperCase() : 'R'}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-white text-sm truncate">{user.name}</h4>
                        <span className="text-[10px] text-emerald-400 font-mono">+91 {user.phone}</span>
                      </div>
                    </div>
                    <div className="mt-2 inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-lime-300 border border-emerald-400/30 text-[10px] font-bold">
                      <Check className="w-3 h-3 text-lime-400 stroke-[3]" />
                      <span>{dict.verifiedFarmerBadge}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-emerald-200 text-xs">
                    <div className="flex justify-between">
                      <span className="text-emerald-400/80">{dict.districtLabel}:</span>
                      <span className="font-semibold text-white">{user.district || 'Belagavi'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400/80">{dict.landSizeLabel}:</span>
                      <span className="font-semibold text-white">{user.land_area_acres} Acres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400/80">{dict.ownershipLabel}:</span>
                      <span className="font-semibold text-white capitalize">{user.ownership_type}</span>
                    </div>
                  </div>

                  {user.crops && user.crops.length > 0 && (
                    <div className="pt-1 border-t border-emerald-800/30">
                      <span className="text-[10px] text-emerald-400 block mb-1 font-bold">{dict.cropsLabel}:</span>
                      <div className="flex flex-wrap gap-1">
                        {user.crops.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/50 text-[10px] text-emerald-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{dict.logout}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLogin}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center space-x-1.5 border border-emerald-400/40 transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-white" />
              <span>{dict.login}</span>
            </button>
          )}

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-full bg-[#0a2313]/90 hover:bg-[#0f2e1a] text-emerald-200 border border-emerald-400/40 hover:border-lime-400 transition shadow-md backdrop-blur-md"
            title={dict.settingsTitle}
          >
            <Settings className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>
    </nav>
  );
};
