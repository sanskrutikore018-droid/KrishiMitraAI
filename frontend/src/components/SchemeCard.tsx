'use client';

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  ExternalLink,
  FileCheck2,
  PhoneCall,
  Coins
} from 'lucide-react';
import { SchemeEvaluation, Language } from '../types';
import { getDictionary } from '../lib/i18n';

interface SchemeCardProps {
  evaluation: SchemeEvaluation;
  language: Language;
  onOpenEvidence: (scheme: SchemeEvaluation) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  evaluation,
  language,
  onOpenEvidence
}) => {
  const dict = getDictionary(language);

  const statusConfig = {
    eligible: {
      label: dict.status.eligible,
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      badgeBg: 'bg-emerald-600',
      badgeText: 'text-white',
      icon: CheckCircle
    },
    ineligible: {
      label: dict.status.ineligible,
      bg: 'bg-rose-50/70',
      border: 'border-rose-300',
      badgeBg: 'bg-rose-600',
      badgeText: 'text-white',
      icon: XCircle
    },
    needs_more_info: {
      label: dict.status.needs_more_info,
      bg: 'bg-amber-50/70',
      border: 'border-amber-300',
      badgeBg: 'bg-amber-500',
      badgeText: 'text-emerald-950',
      icon: HelpCircle
    }
  };

  const currentStatus = statusConfig[evaluation.overall_status] || statusConfig.needs_more_info;
  const StatusIcon = currentStatus.icon;

  return (
    <div
      className={`rounded-2xl border-2 shadow-sm transition hover:shadow-md overflow-hidden flex flex-col justify-between ${
        currentStatus.bg
      } ${currentStatus.border}`}
    >
      {/* Demo Watermark Banner if demo scheme */}
      {evaluation.is_demo && (
        <div className="bg-amber-500 text-emerald-950 px-4 py-1 text-[11px] font-black uppercase tracking-wider flex items-center justify-between border-b border-amber-600">
          <div className="flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{dict.demoBadge}</span>
          </div>
          <span className="text-[10px] lowercase opacity-90">prototype data</span>
        </div>
      )}

      {/* Main Card Body */}
      <div className="p-4 sm:p-5 flex-1">
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Status Badge */}
            <span
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs ${currentStatus.badgeBg} ${currentStatus.badgeText}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{currentStatus.label}</span>
            </span>

            {/* Verification Badge */}
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-gray-200 text-gray-700 shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>{dict.verifiedDate}</span>
            </span>
          </div>

          <span className="text-[10px] text-gray-500 font-mono">
            ID: {evaluation.scheme_id}
          </span>
        </div>

        {/* Scheme Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-1">
          {dict.schemeCatalog?.[evaluation.scheme_id]?.name || (language === 'kn' ? evaluation.scheme_name.kn : evaluation.scheme_name.en)}
        </h3>
        <p className="text-xs text-emerald-900/80 font-medium mb-3">
          {evaluation.short_name}
        </p>

        {/* Benefits Highlight Box */}
        <div className="mb-4 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 mb-1">
            <Coins className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{dict.benefitsHeading}</span>
          </div>
          <div className="text-sm font-extrabold text-emerald-700 mb-1">
            {evaluation.benefits.amount}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {dict.schemeCatalog?.[evaluation.scheme_id]?.desc || (language === 'kn' ? evaluation.benefits.kn : evaluation.benefits.en)}
          </p>
        </div>

        {/* Deterministic Rules Breakdown */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            {dict.rulesCheckHeading}:
          </h4>
          <div className="space-y-1.5">
            {evaluation.rules_breakdown.map((rule, idx) => {
              const isSat = rule.status === 'satisfied';
              const isNotSat = rule.status === 'not_satisfied';
              const isUnk = rule.status === 'unknown';

              return (
                <div
                  key={idx}
                  className="flex items-start space-x-2 text-xs p-2 rounded-lg bg-white/80 border border-gray-100"
                >
                  <div className="mt-0.5 shrink-0">
                    {isSat && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    {isNotSat && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    {isUnk && <HelpCircle className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">
                        {language === 'kn' ? rule.rule_label_kn : rule.rule_label_en}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isSat
                            ? 'text-emerald-700 bg-emerald-50'
                            : isNotSat
                            ? 'text-rose-700 bg-rose-50'
                            : 'text-amber-700 bg-amber-50'
                        }`}
                      >
                        {isSat
                          ? dict.satisfied
                          : isNotSat
                          ? dict.notSatisfied
                          : dict.unknown}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                      {language === 'kn' ? rule.explanation_kn : rule.explanation_en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 sm:p-4 bg-white/90 border-t border-gray-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenEvidence(evaluation)}
          className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition flex items-center justify-center space-x-1.5"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>{dict.viewDocuments}</span>
        </button>

        <a
          href={evaluation.official_source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 text-xs font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 transition flex items-center space-x-1"
          title={dict.officialPortal}
        >
          <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          <span className="hidden sm:inline">{dict.officialPortal}</span>
        </a>
      </div>
    </div>
  );
};

