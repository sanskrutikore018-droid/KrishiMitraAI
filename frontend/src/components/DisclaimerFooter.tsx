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
    <footer className="mt-16 bg-[#020804] text-emerald-100 border-t border-emerald-950/80">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 space-y-8">
        {/* Legal Disclaimer Box */}
        <div className="vantara-card rounded-2xl p-5 sm:p-6 flex items-start space-x-3.5 border-amber-500/30">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
              {dict.disclaimerTitle}
            </h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed font-normal">
              {dict.disclaimerText}
            </p>
          </div>
        </div>

        {/* Portal Links & Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-emerald-950 text-xs">
          <div>
            <h5 className="font-bold text-white mb-3 uppercase tracking-wider">
              {language === 'kn' ? 'ಅಧಿಕೃತ ಕೃಷಿ ಪೋರ್ಟಲ್‌ಗಳು' : 'Official Portals'}
            </h5>
            <ul className="space-y-2 text-emerald-300/90">
              <li>
                <a
                  href="https://pmkisan.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center space-x-1.5 transition"
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
                  className="hover:text-amber-300 flex items-center space-x-1.5 transition"
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
                  className="hover:text-amber-300 flex items-center space-x-1.5 transition"
                >
                  <span>Karnataka Raita Mitra Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 uppercase tracking-wider">
              {language === 'kn' ? 'ರೈತ ಸಹಾಯವಾಣಿ ಸಂಪರ್ಕ' : 'Kisan Helplines'}
            </h5>
            <div className="space-y-2 text-emerald-300/90">
              <p>Kisan Call Centre: <strong className="text-white">1800-180-1551</strong> (Toll Free)</p>
              <p>PM-KISAN Helpline: <strong className="text-white">155261 / 011-24300606</strong></p>
              <p>PMFBY Insurance Support: <strong className="text-white">1800-200-5142</strong></p>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 uppercase tracking-wider">
              {language === 'kn' ? 'ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ನೀತಿ' : 'Architecture & Zero-Hallucination'}
            </h5>
            <p className="text-emerald-300/80 leading-relaxed font-normal">
              Built with Next.js 15, FastAPI, and deterministic rule matrices. AI intent extraction is strictly separated from eligibility verification to prevent false policy guarantees.
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-400/70 gap-2">
          <span>© 2026 Krishi Mitra AI (ಕೃಷಿ ಮಿತ್ರ). Dedicated to Indian Farmers.</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-emerald-300">
              <Shield className="w-3.5 h-3.5 text-lime-400" />
              <span>Gazette Verified Sources</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
