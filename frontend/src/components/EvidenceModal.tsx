'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  FileCheck,
  PhoneCall,
  ExternalLink,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { SchemeEvaluation, Language } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface EvidenceModalProps {
  scheme: SchemeEvaluation | null;
  language?: Language;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  scheme,
  onClose
}) => {
  const { dict, language } = useTranslation();
  if (!scheme) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-emerald-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                {dict.schemeCatalog?.[scheme.scheme_id]?.name || (language === 'kn' ? scheme.scheme_name.kn : scheme.scheme_name.en)}
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                {dict.modalTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-700/80 text-emerald-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-gray-800 text-xs sm:text-sm">
          {/* Demo Banner */}
          {scheme.is_demo && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wide block">
                  {dict.demoBadge}
                </span>
                <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                  {scheme.watermark_notice ||
                    'Prototype scheme data for technical demonstration purposes only.'}
                </p>
              </div>
            </div>
          )}

          {/* Audit & Authority Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-start space-x-2">
              <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-emerald-950 block">
                  {dict.verifiedByText}
                </span>
                <span className="text-xs text-gray-700 leading-snug">
                  {scheme.verified_by}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Calendar className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-emerald-950 block">
                  {dict.verifiedDate}
                </span>
                <span className="text-xs text-gray-700">
                  Status: <strong className="text-emerald-700 uppercase">{scheme.verification_status}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Scheme Description */}
          <div>
            <h4 className="font-bold text-gray-900 mb-1.5 text-xs uppercase tracking-wider">
              {language === 'kn' ? 'ಯೋಜನೆಯ ಸಾರಾಂಶ:' : 'Scheme Overview:'}
            </h4>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {language === 'kn' ? scheme.description.kn : scheme.description.en}
            </p>
          </div>

          {/* Required Documents Checklist */}
          <div>
            <div className="flex items-center space-x-1.5 mb-2 font-bold text-gray-900 text-xs uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>{dict.documentsRequiredHeading}:</span>
            </div>
            <div className="space-y-2">
              {scheme.required_documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-white shadow-2xs"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-gray-800 text-xs sm:text-sm">
                      {language === 'kn' ? doc.name_kn : doc.name_en}
                    </span>
                  </div>
                  {doc.mandatory && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                      {language === 'kn' ? 'ಕಡ್ಡಾಯ' : 'Mandatory'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Helpline and Source */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-950 block">
                  {dict.helpline}
                </span>
                <span className="text-sm font-black text-emerald-950">
                  {scheme.helpline}
                </span>
              </div>
            </div>

            <a
              href={`tel:${scheme.helpline.split('/')[0].trim()}`}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-xs transition shrink-0"
            >
              {language === 'kn' ? 'ಕರೆ ಮಾಡಿ' : 'Call Helpline'}
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            {dict.closeModal}
          </button>

          <a
            href={scheme.application_portal || scheme.official_source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition flex items-center space-x-2"
          >
            <span>{dict.officialPortal}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

