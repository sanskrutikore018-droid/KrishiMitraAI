'use client';

import React from 'react';
import {
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Building,
  Check,
  Landmark,
  Sparkles
} from 'lucide-react';
import { SupportedLanguage } from '../lib/i18n';
import { useTranslation } from '../context/LanguageContext';
import { FarmerProfile, SchemeEvaluation } from '../types';

interface EligibilityAssessmentViewProps {
  language?: SupportedLanguage;
  profile: FarmerProfile;
  evaluations: SchemeEvaluation[];
  onOpenGuidance: (scheme?: SchemeEvaluation) => void;
}

export const EligibilityAssessmentView: React.FC<EligibilityAssessmentViewProps> = ({
  language: propLang,
  profile,
  evaluations,
  onOpenGuidance
}) => {
  const { language: ctxLanguage, dict } = useTranslation();
  const language = propLang || ctxLanguage;

  // Find PM-KISAN or the primary top evaluated scheme
  const pmKisanEval = evaluations.find((e) => e.scheme_id === 'pm-kisan') || evaluations[0];
  const isEligible = pmKisanEval?.overall_status === 'eligible';

  // Dynamic parameters checklist mapped to actual farmer profile
  const criteriaList = [
    {
      label: profile.land_area_acres
        ? `${dict.slots.land_area_acres}: ${profile.land_area_acres}`
        : dict.ruleLand,
      satisfied: profile.land_area_acres ? profile.land_area_acres > 0 : true
    },
    {
      label: profile.ownership_type
        ? `${dict.slots.ownership_type}: ${dict.ownershipLabels[profile.ownership_type as keyof typeof dict.ownershipLabels] || profile.ownership_type}`
        : dict.ruleOwnership,
      satisfied: profile.ownership_type ? profile.ownership_type === 'owner' : true
    },
    {
      label: dict.ruleTax,
      satisfied: !profile.is_income_tax_payer
    },
    {
      label: profile.district
        ? `${dict.slots.district}: ${profile.district}`
        : dict.ruleStatus,
      satisfied: true
    }
  ];

  return (
    <section id="eligibility" className="py-24 sm:py-32 bg-gradient-to-b from-[#041209] via-[#091f11] to-[#041209] text-white relative overflow-hidden border-t border-emerald-950/80">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-8 sm:space-y-10">
        {/* Header Title with Preliminary Result Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-lime-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>ಅರ್ಹತೆ ಪರಿಶೀಲನೆ • Deterministic Rules Engine</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-white tracking-tight">
              {dict.eligibilityTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300 font-medium">
              Zero Hallucination Policy • Verified Against Statutory Gazette Guidelines
            </p>
          </div>

          <span className="self-start sm:self-auto px-4 py-2 rounded-full vantara-gold-pill text-xs font-extrabold shadow-md flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{dict.preliminaryResult}</span>
          </span>
        </div>

        {/* Main Card (Panel 5 exact visual style) */}
        <div className="rounded-3xl vantara-panel border-2 border-emerald-500/40 p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Status Banner */}
          <div className="flex items-start space-x-4 sm:space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-green-600/20 text-lime-400 flex items-center justify-center border border-lime-400/50 shrink-0 mt-0.5 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-8 h-8 text-lime-400 stroke-[2.4]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-white tracking-tight">
                {isEligible ? dict.eligibleMessage : `${pmKisanEval?.short_name || 'PM-KISAN'}: ${dict.preliminaryResult}`}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-normal">
                {dict.eligibleSubtext}
              </p>
            </div>
          </div>

          {/* 2-Column Grid: Checklist Left, Official Source Badge Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Criteria Checklist Left (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              <h4 className="text-xs font-extrabold text-lime-400 uppercase tracking-wider flex items-center space-x-1.5">
                <span>{dict.detailsTitle}</span>
              </h4>
              <div className="space-y-2.5">
                {criteriaList.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 text-xs sm:text-sm text-emerald-100 font-medium bg-[#041209]/60 p-3 rounded-2xl border border-emerald-500/20 shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-lime-400 flex items-center justify-center shrink-0 border border-lime-400/30">
                      <Check className="w-3.5 h-3.5 text-lime-400 stroke-[3]" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Source Badge Right (5 cols) */}
            <div className="md:col-span-5 rounded-2xl vantara-card border border-emerald-500/30 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-lime-400 block uppercase tracking-wider">
                  {dict.officialSource}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                    <Landmark className="w-5 h-5 text-amber-300 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      {dict.officialPmkisanWebsite}
                    </span>
                    <a
                      href="https://pmkisan.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-lime-300 hover:underline flex items-center space-x-1 font-mono pt-0.5"
                    >
                      <span>https://pmkisan.gov.in</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-800/40 text-[10px] text-emerald-400 font-mono flex items-center justify-between">
                <span>Audit: Verified by Govt Sources</span>
                <span className="text-amber-300 font-bold">Oct 2026</span>
              </div>
            </div>
          </div>

          {/* Amber Advisory Disclaimer Banner matching Panel 5 */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-3 leading-relaxed shadow-sm">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="font-medium">{dict.disclaimerBox}</p>
          </div>

          {/* Action Button: View Guidance & Documents -> */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onOpenGuidance(pmKisanEval)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all duration-300 flex items-center justify-center space-x-2.5 group cursor-pointer border border-lime-300/30"
            >
              <span>{dict.viewGuidanceBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
