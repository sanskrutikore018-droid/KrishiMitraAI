'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Mic, Landmark, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../lib/i18n';
import { useTranslation } from '../context/LanguageContext';

interface LiquidGlassCapsuleProps {
  language?: SupportedLanguage;
}

export const LiquidGlassCapsule: React.FC<LiquidGlassCapsuleProps> = () => {
  const { dict } = useTranslation();
  const [activeItem, setActiveItem] = useState<string>('home');

  const navItems = [
    { id: 'home', label: dict.navHome, icon: Home, href: '#hero' },
    { id: 'voice', label: dict.navVoice, icon: Mic, href: '#voice-core' },
    { id: 'schemes', label: dict.navSchemes, icon: Landmark, href: '#schemes' },
    { id: 'eligibility', label: dict.navEligibility, icon: CheckCircle2, href: '#eligibility' }
  ];

  const handleScroll = (href: string, id: string) => {
    setActiveItem(id);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hidden lg:flex justify-center -mt-6 mb-10 relative z-30">
      {/* Centered Liquid Glass Capsule inspired by Image 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="p-1.5 rounded-full backdrop-blur-2xl bg-black/40 border border-emerald-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center space-x-1"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleScroll(item.href, item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-emerald-950 shadow-lg shadow-emerald-500/30'
                  : 'text-emerald-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

