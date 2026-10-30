'use client';

import React from 'react';
import { AlertCircle, Heart, Shield, Cpu, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { getDictionary } from '../lib/i18n';

interface DisclaimerFooterProps {
  language: Language;
}

export const DisclaimerFooter: React.FC<DisclaimerFooterProps> = ({ language }) => {
  const dict = getDictionary(language);

  return (
    <footer className="mt-12 bg-emerald-950 text-emerald-100 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 space-y-6">
        {/* Legal Disclaimer Box */}
        <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
              {dict.disclaimerTitle}
            </h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed font-normal">
              {dict.disclaimerText}
            </p>
          </div>
        </div>

        {/* Portal Links & Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-emerald-900 text-xs">
          <div>
            <h5 className="font-bold text-white mb-2 uppercase tracking-wider">
              {language === 'kn' ? 'ಅಧಿಕೃತ ಕೃಷಿ ಪೋರ್ಟಲ್‌ಗಳು' : 'Official Portals'}
            </h5>
            <ul className="space-y-1.5 text-emerald-300">
              <li>
                <a
                  href="https://pmkisan.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmfby.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>PMFBY Fasal Bima Yojana</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href="https://raitamitra.karnataka.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>Karnataka Raita Mitra Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-2 uppercase tracking-wider">
              {language === 'kn' ? 'ರೈತ ಸಹಾಯವಾಣಿ ಸಂಪರ್ಕ' : 'Kisan Helplines'}
            </h5>
            <div className="space-y-1.5 text-emerald-300">
              <p>Kisan Call Centre: <strong className="text-white">1800-180-1551</strong> (Toll Free)</p>
              <p>PM-KISAN Helpline: <strong className="text-white">155261 / 011-24300606</strong></p>
              <p>PMFBY Helpline: <strong className="text-white">14447</strong></p>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white mb-2 uppercase tracking-wider">
              {language === 'kn' ? 'ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಆರ್ಕಿಟೆಕ್ಚರ್' : 'System Architecture'}
            </h5>
            <p className="text-emerald-300 leading-relaxed mb-2">
              Next.js 15, FastAPI, Deterministic Python Rules Engine, Google Gemini API, Sarvam AI (Saarika & Bulbul), Web Speech fallback.
            </p>
            <div className="inline-flex items-center space-x-1 text-[11px] bg-emerald-900 px-2 py-0.5 rounded text-amber-300 font-semibold border border-emerald-800">
              <Shield className="w-3 h-3" />
              <span>Oct 2026 Audit Ready</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-4 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-400 gap-2">
          <p>© 2026 KRISHI MITRA AI. Built with pride for Indian Farmers.</p>
          <div className="flex items-center space-x-1">
            <span>Empowering Annadatas with AI & Voice</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

