'use client';

import React from 'react';
import {
  ShieldCheck,
  Calendar,
  ExternalLink,
  ArrowRight,
  Sprout,
  Shield,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';
import { SchemeEvaluation } from '../types';

interface SchemesShowcaseProps {
  schemes: SchemeEvaluation[];
  language: SupportedLanguage;
  onSelectScheme: (scheme: SchemeEvaluation) => void;
}

export const SchemesShowcase: React.FC<SchemesShowcaseProps> = ({
  schemes,
  language,
  onSelectScheme
}) => {
  const dict = getDictionary(language);

  // Separate primary verified schemes and prototype demo schemes
  const verifiedSchemes = schemes.filter((s) => !s.is_demo);
  const demoSchemes = schemes.filter((s) => s.is_demo);

  const schemeImages: Record<string, string> = {
    'pm-kisan': 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    'pmfby': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800&auto=format&fit=crop',
    'demo-micro-irrigation': 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop',
    'demo-agri-equipment': 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop',
    'demo-soil-improvement': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop'
  };

  return (
    <section id="schemes" className="py-20 bg-[#06150b] text-white relative overflow-hidden border-t border-emerald-900/40">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <Sprout className="w-4 h-4" />
            <span>{dict.schemesHeading}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {dict.schemesHeading}
          </h2>
          <p className="text-sm sm:text-base text-emerald-200/80 font-medium max-w-xl">
            {dict.schemesSubheading}
          </p>
        </div>

        {/* 2 Featured Primary Scheme Cards (matching Panel 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {verifiedSchemes.map((scheme) => (
            <div
              key={scheme.scheme_id}
              className="group relative rounded-3xl overflow-hidden glass-panel border border-emerald-500/30 shadow-2xl transition duration-500 hover:border-emerald-400/60 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Photo Header */}
              <div className="h-56 sm:h-64 relative overflow-hidden">
                <img
                  src={schemeImages[scheme.scheme_id] || schemeImages['pm-kisan']}
                  alt={scheme.short_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091f11] via-[#091f11]/40 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-[11px] font-bold text-emerald-300 flex items-center space-x-1.5 shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{scheme.verification_status.toUpperCase()}</span>
                  </div>
                </div>

                {/* Benefit Pill */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="bg-emerald-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-400/30 text-xs sm:text-sm font-extrabold text-amber-300 shadow-lg">
                    {scheme.benefits.amount}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30 text-emerald-300">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition">
                      {scheme.short_name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                    {language === 'kn' ? scheme.scheme_name.kn : scheme.scheme_name.en}
                  </p>
                  <p className="text-xs text-emerald-100/70 leading-relaxed pt-1 line-clamp-2">
                    {language === 'kn' ? scheme.description.kn : scheme.description.en}
                  </p>
                </div>

                {/* Bottom Action */}
                <button
                  onClick={() => onSelectScheme(scheme)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center space-x-2 group/btn"
                >
                  <span>{dict.viewDetails}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Watermarked Demo Prototype Schemes (Grid) */}
        {demoSchemes.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>ಡೆಮೊ ಮಾದರಿ ಯೋಜನೆಗಳು / Prototype Demonstration Schemes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoSchemes.map((demo) => (
                <div
                  key={demo.scheme_id}
                  onClick={() => onSelectScheme(demo)}
                  className="glass-card p-4 rounded-2xl border border-amber-500/30 hover:border-amber-400/60 cursor-pointer transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        DEMO WATERMARK
                      </span>
                      <span className="text-[11px] font-bold text-emerald-300">
                        {demo.benefits.amount?.split(' ')[0]}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      {demo.short_name}
                    </h4>
                    <p className="text-xs text-emerald-200/70 mt-1 line-clamp-2">
                      {language === 'kn' ? demo.description.kn : demo.description.en}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between text-xs text-amber-300/90 font-semibold">
                    <span>{dict.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Verification Status Audit Bar (Panel 4) */}
        <div className="p-4 rounded-2xl glass-card flex flex-wrap items-center justify-around gap-4 text-xs font-medium text-emerald-200 border border-emerald-500/20">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{dict.verifiedGov}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{dict.lastUpdated}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>{dict.officialLinks}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
