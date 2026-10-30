'use client';

import React from 'react';
import { ArrowRight, ChevronDown, Sparkles, Sprout, ShieldCheck } from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';

interface CinematicHeroProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onStartJourney: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  language,
  onLanguageChange,
  onStartJourney
}) => {
  const dict = getDictionary(language);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#07170b]">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 z-0">
        {/* Cinematic landscape background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop')`
          }}
        />

        {/* Ambient atmospheric lighting and mist gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06150b] via-[#06150b]/60 to-black/40" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#06150b]/40 to-[#06150b]/90" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Spacer for sticky navbar */}
      <div className="h-20" />

      {/* Center Content: Oversized Typography & Controls */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full my-auto py-12 flex flex-col items-start justify-center">
        {/* Subtle Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{dict.appSubtitle}</span>
        </div>

        {/* Oversized Cinematic Typography */}
        <div className="space-y-1 sm:space-y-2 mb-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-md">
            {dict.heroTitle1}
          </h1>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-emerald-300 tracking-tight leading-[1.08] drop-shadow-md">
            {dict.heroTitle2}
          </h2>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-emerald-100 tracking-tight leading-[1.08] drop-shadow-md">
            {dict.heroTitle3}
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-emerald-100/90 max-w-2xl font-medium tracking-wide mb-8 drop-shadow-sm leading-relaxed">
          {dict.heroSubtitle}
        </p>

        {/* Interactive Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          {/* Language Selector Pill */}
          <div className="flex items-center space-x-2 bg-emerald-950/80 backdrop-blur-md border border-emerald-400/30 rounded-2xl px-4 py-3 text-xs font-bold text-white shadow-xl">
            <span className="text-emerald-400">ಭಾಷೆ / Lang:</span>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-emerald-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="kn" className="bg-[#091f11] text-white">ಕನ್ನಡ (Kannada)</option>
              <option value="en" className="bg-[#091f11] text-white">English</option>
              <option value="hi" className="bg-[#091f11] text-white">हिन्दी (Hindi)</option>
              <option value="mr" className="bg-[#091f11] text-white">मराठी (Marathi)</option>
            </select>
          </div>

          {/* Primary CTA Button: Start Your Journey -> */}
          <button
            onClick={onStartJourney}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold text-sm sm:text-base shadow-2xl shadow-emerald-900/60 transition transform active:scale-95 flex items-center justify-center space-x-2 group border border-emerald-300/30"
          >
            <span>{dict.heroCTA}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition duration-200" />
          </button>
        </div>
      </div>

      {/* Bottom Scroll Indicator with bouncing icon */}
      <div className="relative z-10 pb-8 flex flex-col items-center justify-center text-center">
        <a
          href="#story"
          className="group flex flex-col items-center space-y-1.5 text-xs font-semibold text-emerald-300/80 hover:text-white transition"
        >
          <span className="tracking-widest uppercase text-[11px] font-bold">
            {dict.scrollExplore}
          </span>
          <div className="w-7 h-7 rounded-full bg-white/5 border border-emerald-400/30 flex items-center justify-center group-hover:border-emerald-300 transition">
            <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
};
