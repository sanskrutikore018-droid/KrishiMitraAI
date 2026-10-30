'use client';

import React from 'react';
import { Home, Landmark, Mic, ShieldCheck, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../lib/i18n';
import { useTranslation } from '../context/LanguageContext';

interface MobileBottomNavProps {
  language?: SupportedLanguage;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = () => {
  const { dict } = useTranslation();

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 vantara-panel rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] py-2.5 px-4 flex items-center justify-around text-[10px] font-bold text-emerald-200 border border-emerald-400/40">
      <a
        href="#hero"
        className="flex flex-col items-center space-y-1 hover:text-lime-300 transition"
      >
        <Home className="w-5 h-5 text-emerald-300 stroke-[2.2]" />
        <span>{dict.navHome}</span>
      </a>

      <a
        href="#schemes"
        className="flex flex-col items-center space-y-1 hover:text-lime-300 transition"
      >
        <Landmark className="w-5 h-5 text-emerald-300 stroke-[2.2]" />
        <span>{dict.navSchemes}</span>
      </a>

      {/* Prominent Center Voice AI Glowing Button (Panel 6 exact style) */}
      <a
        href="#voice-core"
        className="-mt-7 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-green-500 to-lime-400 text-emerald-950 flex items-center justify-center shadow-[0_0_25px_rgba(132,204,22,0.6)] border-3 border-[#041209] transition-transform active:scale-95"
        title={dict.navVoice}
      >
        <Mic className="w-6 h-6 stroke-[2.5]" />
      </a>

      <a
        href="#eligibility"
        className="flex flex-col items-center space-y-1 hover:text-lime-300 transition"
      >
        <ShieldCheck className="w-5 h-5 text-emerald-300 stroke-[2.2]" />
        <span>{dict.navEligibility}</span>
      </a>

      <a
        href="#story"
        className="flex flex-col items-center space-y-1 hover:text-lime-300 transition"
      >
        <Sparkles className="w-5 h-5 text-amber-300 stroke-[2.2]" />
        <span>{dict.navStory}</span>
      </a>
    </div>
  );
};
