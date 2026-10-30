'use client';

import React from 'react';
import { Landmark, Scale, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';

interface StorytellingSectionProps {
  language: SupportedLanguage;
}

export const StorytellingSection: React.FC<StorytellingSectionProps> = ({ language }) => {
  const dict = getDictionary(language);

  const storyCards = [
    {
      img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop',
      title: dict.storyCard1Title,
      desc: dict.storyCard1Desc
    },
    {
      img: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=800&auto=format&fit=crop',
      title: dict.storyCard2Title,
      desc: dict.storyCard2Desc
    },
    {
      img: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=800&auto=format&fit=crop',
      title: dict.storyCard3Title,
      desc: dict.storyCard3Desc
    }
  ];

  return (
    <section id="story" className="relative py-20 sm:py-28 bg-gradient-to-b from-[#06150b] via-[#081f10] to-[#07160b] text-white overflow-hidden border-t border-emerald-900/30">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative Headline & Mission */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{dict.appTitle} Story</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {dict.storyHeading}
              </h2>
              <p className="text-xl sm:text-2xl text-emerald-300/90 font-bold">
                {dict.storySubheading}
              </p>
            </div>

            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-normal">
              {dict.storyDesc}
            </p>

            {/* 3 Featured Badges with line icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="glass-card p-3 rounded-2xl flex flex-col items-center text-center space-y-2 transition hover:border-emerald-400/40">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                  <Landmark className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  {dict.feat1}
                </span>
              </div>

              <div className="glass-card p-3 rounded-2xl flex flex-col items-center text-center space-y-2 transition hover:border-emerald-400/40">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Scale className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  {dict.feat2}
                </span>
              </div>

              <div className="glass-card p-3 rounded-2xl flex flex-col items-center text-center space-y-2 transition hover:border-emerald-400/40">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-300 flex items-center justify-center border border-green-400/30">
                  <Compass className="w-5 h-5 text-green-300" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  {dict.feat3}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Floating Photographic Narrative Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {storyCards.map((card, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden glass-card transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-950/80 border border-emerald-500/20 flex flex-col"
              >
                {/* Photo Thumbnail */}
                <div className="h-48 sm:h-56 w-full relative overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091f11] via-transparent to-transparent opacity-90" />
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#091f11]/90 to-[#07160b]">
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-emerald-300 transition">
                    {card.title}
                  </h3>
                  <p className="text-xs text-emerald-200/70 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
