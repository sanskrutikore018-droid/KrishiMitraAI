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
    'demo-agri-equipment': '/images/mechanization.jpg',
    'demo-soil-improvement': '/images/soil-health.jpg'
  };

  return (
    <section id="schemes" className="py-24 sm:py-32 bg-[#041209] text-white relative overflow-hidden border-t border-emerald-950/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-14">
        {/* Editorial Section Header matching Panel 4 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-lime-400 uppercase tracking-widest">
            <Sprout className="w-4 h-4" />
            <span>ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು • Verified National Schemes</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight">
            {language === 'kn' ? 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು' : 'Government Schemes'}
          </h2>
          <p className="font-editorial italic text-xl sm:text-2xl text-emerald-300 font-light">
            {language === 'kn' ? 'Government Schemes' : 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು'}
          </p>
          <p className="text-sm sm:text-base text-emerald-200/80 font-normal max-w-xl leading-relaxed">
            {dict.schemesSubheading}
          </p>
        </div>

        {/* 2 Featured Primary Scheme Cards (matching Panel 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {verifiedSchemes.map((scheme) => (
            <div
              key={scheme.scheme_id}
              className="group relative rounded-3xl overflow-hidden vantara-panel border border-emerald-500/30 shadow-2xl transition-all duration-500 hover:border-lime-400/60 hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Photo Header */}
              <div className="h-56 sm:h-64 relative overflow-hidden">
                <img
                  src={schemeImages[scheme.scheme_id] || schemeImages['pm-kisan']}
                  alt={scheme.short_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041209] via-[#041209]/40 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className="px-3.5 py-1.5 rounded-full bg-[#041209]/90 backdrop-blur-md border border-emerald-400/40 text-[11px] font-bold text-lime-300 flex items-center space-x-1.5 shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                    <span>{scheme.verification_status.toUpperCase()}</span>
                  </div>
                </div>

                {/* Benefit Pill */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="vantara-gold-pill backdrop-blur-xl px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black shadow-lg">
                    {scheme.benefits.amount}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30 text-lime-300">
                      <Sprout className="w-4 h-4 stroke-[2.3]" />
                    </div>
                    <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-white group-hover:text-lime-300 transition-colors">
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

                {/* Bottom Action: "ವಿವರಗಳನ್ನು ನೋಡಿ →" / "View Details →" */}
                <button
                  onClick={() => onSelectScheme(scheme)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 hover:from-emerald-600 hover:to-lime-600 text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all duration-300 flex items-center justify-center space-x-2.5 group/btn cursor-pointer border border-emerald-400/30"
                >
                  <span>{dict.viewDetails}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition duration-200" />
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
                  className="vantara-card p-5 rounded-2xl border border-amber-500/30 hover:border-amber-400/60 cursor-pointer transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        DEMO SCHEME
                      </span>
                      <span className="text-[11px] font-bold text-lime-300">
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
        <div className="p-4 sm:p-5 rounded-2xl vantara-card flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-emerald-200 border border-emerald-500/25">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400" />
            <span>{dict.verifiedGov}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-lime-400" />
            <span>{dict.lastUpdated}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4 text-lime-400" />
            <span>{dict.officialLinks}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
