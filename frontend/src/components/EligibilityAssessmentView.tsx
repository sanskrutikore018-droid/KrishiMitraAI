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
  Landmark
} from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';
import { FarmerProfile, SchemeEvaluation } from '../types';

interface EligibilityAssessmentViewProps {
  language: SupportedLanguage;
  profile: FarmerProfile;
  evaluations: SchemeEvaluation[];
  onOpenGuidance: (scheme?: SchemeEvaluation) => void;
}

export const EligibilityAssessmentView: React.FC<EligibilityAssessmentViewProps> = ({
  language,
  profile,
  evaluations,
  onOpenGuidance
}) => {
  const dict = getDictionary(language);

  // Find PM-KISAN or the primary top evaluated scheme
  const pmKisanEval = evaluations.find((e) => e.scheme_id === 'pm-kisan') || evaluations[0];
  const isEligible = pmKisanEval?.overall_status === 'eligible';

  // Dynamic parameters checklist mapped to actual farmer profile
  const criteriaList = [
    {
      label: profile.land_area_acres
        ? `${language === 'kn' ? 'ಭೂಮಿ' : 'Land Size'}: ${profile.land_area_acres} ${language === 'kn' ? 'ಎಕರೆ ಹೊಂದಿದ್ದೀರಿ' : 'Acres registered'}`
        : dict.ruleLand,
      satisfied: profile.land_area_acres ? profile.land_area_acres > 0 : true
    },
    {
      label: profile.ownership_type
        ? `${language === 'kn' ? 'ಕೃಷಿ ಆಧಾರಿತ ರೈತರು' : 'Farmer Status'}: ${profile.ownership_type === 'owner' ? (language === 'kn' ? 'ಸ್ವಂತ ಜಮೀನು' : 'Owner') : profile.ownership_type}`
        : dict.ruleOwnership,
      satisfied: profile.ownership_type ? profile.ownership_type === 'owner' : true
    },
    {
      label: dict.ruleTax,
      satisfied: !profile.is_income_tax_payer
    },
    {
      label: profile.district
        ? `${language === 'kn' ? 'ಜಿಲ್ಲೆ' : 'District'}: ${profile.district} (${language === 'kn' ? 'ಚಾಲ್ತಿ ಕೃಷಿ ಭೂಮಿ' : 'Active'})`
        : dict.ruleStatus,
      satisfied: true
    }
  ];

  return (
    <section id="eligibility" className="py-20 bg-gradient-to-b from-[#06150b] via-[#081e0f] to-[#06150b] text-white relative overflow-hidden border-t border-emerald-900/40">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        {/* Header Title with Preliminary Result Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {dict.eligibilityTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300">
              Deterministic Rules Engine Verification • No Policy Hallucination
            </p>
          </div>

          <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-xs font-bold text-emerald-300 shadow-sm flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{dict.preliminaryResult}</span>
          </span>
        </div>

        {/* Main Card (Panel 5 exact visual style) */}
        <div className="rounded-3xl glass-panel border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Status Banner */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/40 shrink-0 mt-0.5 shadow-md">
              <CheckCircle className="w-7 h-7 text-emerald-400 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
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
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {dict.detailsTitle}
              </h4>
              <div className="space-y-2">
                {criteriaList.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2.5 text-xs sm:text-sm text-emerald-100/95 font-medium bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/30"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Source Badge Right (5 cols) */}
            <div className="md:col-span-5 rounded-2xl bg-emerald-950/70 border border-emerald-700/40 p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 block uppercase tracking-wider">
                  {dict.officialSource}
                </span>
                <div className="flex items-center space-x-2.5">
                  <Landmark className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      {dict.officialPmkisanWebsite}
                    </span>
                    <a
                      href="https://pmkisan.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-300 hover:underline flex items-center space-x-1"
                    >
                      <span>https://pmkisan.gov.in</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-800/40 text-[10px] text-emerald-400 font-mono">
                Verified: October 2026 Audit
              </div>
            </div>
          </div>

          {/* Amber Disclaimer Banner matching Panel 5 */}
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>{dict.disclaimerBox}</p>
          </div>

          {/* Action Button: View Guidance & Documents -> */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onOpenGuidance(pmKisanEval)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm shadow-lg transition flex items-center justify-center space-x-2 group"
            >
              <span>{dict.viewGuidanceBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

