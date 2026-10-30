'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Leaf,
  Activity,
  CheckCircle2,
  Droplets
} from 'lucide-react';
import { SupportedLanguage } from '../lib/i18n';
import { useTranslation } from '../context/LanguageContext';

interface AiNodeVisualizerProps {
  language?: SupportedLanguage;
}

export const AiNodeVisualizer: React.FC<AiNodeVisualizerProps> = ({ language: propLang }) => {
  const { language: ctxLang } = useTranslation();
  const language = propLang || ctxLang;
  const [activeNode, setActiveNode] = useState<string>('neural');

  const nodes = [
    {
      id: 'neural',
      title:
        language === 'kn'
          ? 'ನ್ಯೂರಲ್ ಅರ್ಹತಾ ಇಂಜಿನ್'
          : language === 'te'
          ? 'న్యూరల్ అర్హత ఇంజిన్'
          : language === 'hi'
          ? 'न्यूरल पात्रता इंजन'
          : language === 'mr'
          ? 'न्यूरल पात्रता इंजिन'
          : 'Neural Eligibility Core',
      shortTitle:
        language === 'kn'
          ? 'ನ್ಯೂರಲ್ ಇಂಜಿನ್'
          : language === 'te'
          ? 'న్యూరల్ కోర్'
          : language === 'hi'
          ? 'न्यूरल कोर'
          : language === 'mr'
          ? 'न्यूरल इंजिन'
          : 'Neural Core',
      badge: 'Zero Hallucination',
      icon: Cpu,
      value: '100% Deterministic',
      metric: 'October 2026 MoA&FW Rules',
      color: 'from-emerald-400 to-green-500',
      description:
        language === 'kn'
          ? 'ಕೇಂದ್ರ ಮತ್ತು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಗೆಜೆಟ್ ನಿಯಮಾವಳಿಗಳ ಆಧಾರದ ಮೇಲೆ ಕಂಪ್ಯೂಟರ್ ಪರಿಶೀಲನೆ.'
          : language === 'te'
          ? 'కేంద్ర మరియు రాష్ట్ర ప్రభుత్వాల అధికారిక నిబంధనల ఆధారంగా ఖచ్చితమైన కంప్యూటర్ పరిశీలన.'
          : language === 'hi'
          ? 'केंद्र और राज्य सरकार के आधिकारिक राजपत्र नियमों के अनुसार कंप्यूटर आधारित सटीक जांच।'
          : language === 'mr'
          ? 'केंद्र आणि राज्य सरकारच्या अधिकृत नियमांनुसार कॉम्प्युटर आधारित अचूक पडताळणी.'
          : 'Strict rule-based evaluation mapped to official Gazette guidelines with zero LLM policy hallucination.'
    },
    {
      id: 'crop_health',
      title:
        language === 'kn'
          ? 'ಬೆಳೆ ಆರೋಗ್ಯ & ಕೀಟ ಪತ್ತೆ'
          : language === 'te'
          ? 'పంట ఆరోగ్యం & తెగుళ్ల గుర్తింపు'
          : language === 'hi'
          ? 'फसल स्वास्थ्य एवं कीट पहचान'
          : language === 'mr'
          ? 'पीक आरोग्य आणि कीड नियंत्रण'
          : 'Crop Health & Pest Detection',
      shortTitle:
        language === 'kn'
          ? 'ಬೆಳೆ ಆರೋಗ್ಯ'
          : language === 'te'
          ? 'పంట ఆరోగ్యం'
          : language === 'hi'
          ? 'फसल स्वास्थ्य'
          : language === 'mr'
          ? 'पीक आरोग्य'
          : 'Crop Health',
      badge: 'Precision Agritech',
      icon: Leaf,
      value: 'NDVI 0.84 Optimal',
      metric: 'PMFBY Risk Mitigation',
      color: 'from-green-400 to-emerald-600',
      description:
        language === 'kn'
          ? 'ಬೆಳೆ ಹಾನಿ ಮತ್ತು ನೈಸರ್ಗಿಕ ವಿಕೋಪಗಳ ವಿರುದ್ಧ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಯುಕ್ತ ಬೆಳೆ ವಿಮೆ ರಕ್ಷಣೆ.'
          : language === 'te'
          ? 'పంట నష్టం మరియు ప్రకృతి వైపరీత్యాల నుండి ప్రభుత్వ సబ్సిడీతో కూడిన పంట భీమా రక్షణ.'
          : language === 'hi'
          ? 'फसल क्षति और प्राकृतिक आपदाओं के विरुद्ध सरकारी सब्सिडी युक्त फसल बीमा सुरक्षा।'
          : language === 'mr'
          ? 'पीक नुकसान आणि नैसर्गिक संकटांविरुद्ध शासकीय अनुदानासह पीक विमा संरक्षण.'
          : 'Continuous monitoring of pest threats and unseasonal rain risks subsidized under PMFBY.'
    },
    {
      id: 'irrigation_mesh',
      title:
        language === 'kn'
          ? 'ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ಗ್ರಿಡ್'
          : language === 'te'
          ? 'సూక్ష్మ నీటిపారుదల గ్రిడ్'
          : language === 'hi'
          ? 'सूक्ष्म सिंचाई ग्रिड'
          : language === 'mr'
          ? 'ठिबक व तुषार सिंचन नेटवर्क'
          : 'Micro-Irrigation Grid',
      shortTitle:
        language === 'kn'
          ? 'ಹನಿ ನೀರಾವರಿ'
          : language === 'te'
          ? 'నీటిపారుదల'
          : language === 'hi'
          ? 'सूक्ष्म सिंचाई'
          : language === 'mr'
          ? 'ठिबक सिंचन'
          : 'Irrigation',
      badge: 'Capital Subsidy',
      icon: Droplets,
      value: '90% Subsidy Eligible',
      metric: 'Drip & Sprinkler Mesh',
      color: 'from-lime-400 to-emerald-500',
      description:
        language === 'kn'
          ? 'ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ ಹನಿ ನೀರಾವರಿ ಸ್ಥಾಪನೆಗೆ ಗರಿಷ್ಠ ಸಹಾಯಧನ.'
          : language === 'te'
          ? 'చిన్న మరియు సన్నకారు రైతులకు డ్రిప్ మరియు స్ప్రింక్లర్ ఏర్పాటుకు గరిష్ట రాయితీ.'
          : language === 'hi'
          ? 'लघु एवं सीमांत किसानों के लिए ड्रिप एवं स्प्रिंकलर स्थापना पर अधिकतम अनुदान।'
          : language === 'mr'
          ? 'लहान आणि अत्यल्प भूधारक शेतकऱ्यांना ठिबक सिंचनासाठी भरघोस शासकीय अनुदान.'
          : 'High capital subsidy facilitation for drip, micro-sprinkler and solar pump sets.'
    }
  ];

  const currentActive = nodes.find((n) => n.id === activeNode) || nodes[0];
  const IconComponent = currentActive.icon;

  return (
    <div className="relative w-full max-w-md lg:max-w-lg select-none">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-green-500/10 to-lime-500/20 rounded-3xl blur-xl opacity-75 pointer-events-none" />

      {/* Main Glassmorphic Container matching Image 1 "Tech Nature" */}
      <div className="relative rounded-3xl vantara-panel p-5 sm:p-6 text-white border border-emerald-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
        {/* Top Header Row with Active Node Counter & Live Pulse */}
        <div className="flex items-center justify-between border-b border-emerald-800/40 pb-4 mb-4 gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-lime-400 shrink-0">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white tracking-wide block truncate">
                AgriTech Precision Matrix
              </span>
              <span className="text-[10px] text-lime-400 font-mono truncate block">
                5 Languages Active • Deterministic
              </span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 flex items-center space-x-1.5 shadow-inner shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
            <span>578M+ Farmers</span>
          </div>
        </div>

        {/* 3 Interactive Clickable Nodes */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = activeNode === node.id;
            return (
              <motion.button
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`p-2.5 sm:p-3 rounded-2xl flex flex-col items-center text-center space-y-1 sm:space-y-1.5 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-600/90 to-green-700/80 border-2 border-lime-400 shadow-[0_0_20px_rgba(132,204,22,0.4)] text-white'
                    : 'bg-[#041209]/70 hover:bg-[#092211] border border-emerald-500/20 text-emerald-200'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                <span className="text-[10px] sm:text-[11px] font-bold leading-tight break-words line-clamp-1">
                  {node.shortTitle}
                </span>
                <span className="text-[9px] opacity-75 font-mono">
                  {isSelected ? 'Active' : 'Select'}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Node Detail Card with Animated Content Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentActive.id}-${language}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#041209]/90 to-[#0a2313]/90 border border-emerald-400/30 space-y-3 shadow-inner"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shrink-0">
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white tracking-tight truncate">
                    {currentActive.title}
                  </h4>
                  <span className="text-[10px] text-lime-400 font-semibold uppercase tracking-wider block truncate">
                    {currentActive.badge}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-white block">
                  {currentActive.value}
                </span>
                <span className="text-[9px] text-emerald-300/70 font-mono">
                  {currentActive.metric}
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-100/85 leading-relaxed font-normal break-words">
              {currentActive.description}
            </p>

            {/* Micro verification pills */}
            <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-300">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                <span>Statutory Rule Validated</span>
              </span>
              <span className="font-mono text-lime-400 font-bold">100% Free Tier</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
