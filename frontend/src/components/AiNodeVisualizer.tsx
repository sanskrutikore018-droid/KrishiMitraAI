'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Leaf,
  Bug,
  ShieldCheck,
  Activity,
  Radio,
  CheckCircle2,
  Users,
  ChevronRight,
  TrendingUp,
  Droplets,
  Layers
} from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';

interface AiNodeVisualizerProps {
  language: SupportedLanguage;
}

export const AiNodeVisualizer: React.FC<AiNodeVisualizerProps> = ({ language }) => {
  const dict = getDictionary(language);
  const [activeNode, setActiveNode] = useState<string>('neural');

  const nodes = [
    {
      id: 'neural',
      title: language === 'kn' ? 'ನ್ಯೂರಲ್ ಅರ್ಹತಾ ಇಂಜಿನ್' : 'Neural Eligibility Core',
      badge: 'Zero Hallucination',
      icon: Cpu,
      value: '100% Deterministic',
      metric: 'October 2026 MoA&FW Rules',
      color: 'from-emerald-400 to-green-500',
      description:
        language === 'kn'
          ? 'ಕೇಂದ್ರ ಮತ್ತು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ನಿಯಮಾವಳಿಗಳ ಆಧಾರದ ಮೇಲೆ ಕಂಪ್ಯೂಟರ್ ಪರಿಶೀಲನೆ.'
          : 'Strict rule-based evaluation mapped to official Gazette guidelines with zero LLM policy hallucination.'
    },
    {
      id: 'crop_health',
      title: language === 'kn' ? 'ಬೆಳೆ ಆರೋಗ್ಯ & ಕೀಟ ಪತ್ತೆ' : 'Crop Health & Pest Detection',
      badge: 'Precision Agritech',
      icon: Leaf,
      value: 'NDVI 0.84 Optimal',
      metric: 'PMFBY Risk Mitigation',
      color: 'from-green-400 to-emerald-600',
      description:
        language === 'kn'
          ? 'ಬೆಳೆ ಹಾನಿ ಮತ್ತು ನೈಸರ್ಗಿಕ ವಿಕೋಪಗಳ ವಿರುದ್ಧ 90% ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಯುಕ್ತ ಬೆಳೆ ವಿಮೆ ರಕ್ಷಣೆ.'
          : 'Continuous monitoring of pest threats and unseasonal rain risks subsidized under PMFBY.'
    },
    {
      id: 'irrigation_mesh',
      title: language === 'kn' ? 'ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ಗ್ರಿಡ್' : 'Micro-Irrigation Grid',
      badge: '90% Capital Subsidy',
      icon: Droplets,
      value: '5.0 Acre Small Farmer Cap',
      metric: 'Drip & Sprinkler Scheme',
      color: 'from-teal-400 to-emerald-500',
      description:
        language === 'kn'
          ? 'ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ ಹನಿ/ತುಂತುರು ನೀರಾವರಿ ಉಪಕರಣಗಳಿಗೆ ಶೇಕಡಾ 90 ರಿಯಾಯಿತಿ.'
          : 'Assisted capital assistance packages for verified borewell and open well farmlands.'
    }
  ];

  const current = nodes.find((n) => n.id === activeNode) || nodes[0];
  const CurrentIcon = current.icon;

  return (
    <div className="w-full max-w-xl">
      {/* Floating Glassmorphic Container inspired by Image 1 & Image 2 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="p-5 sm:p-6 rounded-3xl backdrop-blur-2xl bg-black/45 border border-emerald-500/35 shadow-[0_0_60px_rgba(16,185,129,0.25)] space-y-4"
      >
        {/* Top Header: Active Telemetry Badge */}
        <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative z-10" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
              {language === 'kn' ? 'ಲೈವ್ ಅಗ್ರಿಟೆಕ್ ನೋಡ್ ಸಂವೇದಕ' : 'Live Agritech Node Telemetry'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-[11px] font-bold text-amber-300">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Active Sync</span>
          </div>
        </div>

        {/* Floating Node Selector Pills (Image 1 style) */}
        <div className="grid grid-cols-3 gap-2">
          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = activeNode === node.id;

            return (
              <motion.button
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`p-3 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-600/50 to-emerald-950/80 border-emerald-400 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                    : 'bg-black/30 border-white/10 text-emerald-300/70 hover:bg-emerald-950/40 hover:text-white'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-emerald-400 text-emerald-950 shadow-md'
                      : 'bg-white/5 text-emerald-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold line-clamp-1 leading-tight">
                  {node.title}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Node Details Card with Spring Physics */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 space-y-2.5 shadow-inner"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CurrentIcon className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {current.title}
                </h4>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 shadow-sm">
                {current.badge}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-base sm:text-lg font-black text-emerald-300">
                {current.value}
              </span>
              <span className="text-[11px] text-emerald-400/80 font-mono">
                {current.metric}
              </span>
            </div>

            <p className="text-xs text-emerald-100/80 leading-relaxed font-normal pt-1">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Floating Community Stat Badge matching Image 1 ("578M+ Clients Active" style) */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-emerald-700 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white">
                KM
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-600 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white">
                KA
              </div>
              <div className="w-7 h-7 rounded-full bg-green-500 border-2 border-black flex items-center justify-center text-[10px] font-bold text-emerald-950">
                AI
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white text-xs block">
                5.8M+ Karnataka Farmlands
              </span>
              <span className="text-[10px] text-emerald-300/70">
                Raitha Samparka Kendra Network
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[11px]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

