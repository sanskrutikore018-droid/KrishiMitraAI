'use client';

import React from 'react';
import { Home, Landmark, Mic, CheckCircle2 } from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';

interface MobileBottomNavProps {
  language: SupportedLanguage;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ language }) => {
  const dict = getDictionary(language);

  return (
    <div className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-[#07190d]/95 backdrop-blur-xl border border-emerald-500/40 rounded-3xl shadow-2xl py-2 px-3 flex items-center justify-around text-[10px] text-emerald-200">
      <a
        href="#hero"
        className="flex flex-col items-center space-y-0.5 hover:text-emerald-300 transition"
      >
        <Home className="w-5 h-5 text-emerald-400" />
        <span>{dict.navHome}</span>
      </a>

      <a
        href="#schemes"
        className="flex flex-col items-center space-y-0.5 hover:text-emerald-300 transition"
      >
        <Landmark className="w-5 h-5 text-emerald-400" />
        <span>{dict.navSchemes}</span>
      </a>

      {/* Prominent Center Voice AI Button */}
      <a
        href="#voice-core"
        className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-emerald-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 border-2 border-[#07190d] animate-bounce"
        title={dict.navVoice}
      >
        <Mic className="w-6 h-6 stroke-[2.5]" />
      </a>

      <a
        href="#story"
        className="flex flex-col items-center space-y-0.5 hover:text-emerald-300 transition"
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <span>{dict.navStory}</span>
      </a>

      <a
        href="#eligibility"
        className="flex flex-col items-center space-y-0.5 hover:text-emerald-300 transition"
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <span>{dict.navEligibility}</span>
      </a>
    </div>
  );
};
