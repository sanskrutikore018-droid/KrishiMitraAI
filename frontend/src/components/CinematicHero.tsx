'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles, Shield, Globe } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { SupportedLanguage } from '../lib/i18n';
import { AiNodeVisualizer } from './AiNodeVisualizer';

interface CinematicHeroProps {
  onStartJourney: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onStartJourney
}) => {
  const { language, setLanguage, dict, availableLanguages } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.2
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 35, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  const handleScrollExplore = () => {
    const el = document.getElementById('story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#041209] text-white"
    >
      {/* 1. CINEMATIC VIDEO BACKGROUND & MULTI-LAYERED VANTARA ATMOSPHERE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Looping Agricultural Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none transition-transform duration-1000 ease-out brightness-[0.78]"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-sun-over-a-green-field-5178/1080p.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-wind-blowing-through-a-wheat-field-42795-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Cinematic Multi-layered Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-[#041209] pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#041209]/40 to-[#041209]/95 pointer-events-none" />

        {/* Ambient atmospheric green & gold glow orbs */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[850px] h-[500px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Subtle Floating Organic Spore Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/3 left-1/5 w-1.5 h-1.5 rounded-full bg-lime-300 animate-particle shadow-[0_0_10px_#a3e635]" />
          <div className="absolute top-1/2 left-2/3 w-2 h-2 rounded-full bg-emerald-400 animate-particle [animation-delay:2s] shadow-[0_0_12px_#34d399]" />
          <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 rounded-full bg-amber-300 animate-particle [animation-delay:4s] shadow-[0_0_8px_#fde047]" />
        </div>
      </div>

      {/* Spacer for sticky navbar */}
      <div className="h-20 sm:h-24" />

      {/* 2. MAIN CENTER HERO CONTENT WITH DUAL COLUMN EDITORIAL LAYOUT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full my-auto py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column (7 cols): Oversized Editorial Typography & Controls */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start justify-center"
          >
            {/* Top Editorial Badges */}
            <motion.div
              variants={lineVariants}
              className="flex flex-wrap items-center gap-2.5 mb-6"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-200 text-xs font-semibold backdrop-blur-xl shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
                <span className="tracking-wide">{dict.appSubtitle}</span>
              </div>

              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-400/40 text-xs font-semibold text-amber-200 backdrop-blur-md shadow-sm">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="tracking-wider uppercase text-[10px]">{dict.govIndia}</span>
              </div>
            </motion.div>

            {/* Oversized Editorial Serif Typography with Staggered Reveal */}
            <div className="space-y-1 sm:space-y-2 mb-6">
              <motion.h1
                variants={lineVariants}
                className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
              >
                {dict.heroTitle1}
              </motion.h1>

              <motion.h2
                variants={lineVariants}
                className="font-editorial italic text-4xl sm:text-6xl md:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-300 to-green-200 tracking-tight leading-[1.08] drop-shadow-2xl"
              >
                {dict.heroTitle2}
              </motion.h2>

              <motion.h2
                variants={lineVariants}
                className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-emerald-100/90 tracking-tight leading-[1.08] drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
              >
                {dict.heroTitle3}
              </motion.h2>
            </div>

            {/* Subtext: Government schemes • Eligibility guidance • In your language */}
            <motion.p
              variants={lineVariants}
              className="text-base sm:text-lg md:text-xl text-emerald-100/90 max-w-xl font-normal tracking-wide mb-8 drop-shadow-md leading-relaxed"
            >
              {dict.heroSubtitle}
            </motion.p>

            {/* Action Controls with Spring Physics */}
            <motion.div
              variants={lineVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
            >
              {/* Language Selector Pill with all 5 languages */}
              <div className="flex items-center space-x-2.5 bg-[#0a2313]/90 backdrop-blur-2xl border border-emerald-400/40 rounded-2xl px-4 py-3.5 text-xs font-bold text-white shadow-xl hover:border-lime-400 transition-all duration-300">
                <Globe className="w-4 h-4 text-lime-400" />
                <span className="text-emerald-300 font-medium">ಭಾಷೆ / Lang:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="bg-transparent text-emerald-100 font-extrabold focus:outline-none cursor-pointer"
                  aria-label="Choose Language"
                >
                  {availableLanguages.map((opt) => (
                    <option key={opt.code} value={opt.code} className="bg-[#041209] text-white py-1">
                      {opt.label} ({opt.sub})
                    </option>
                  ))}
                </select>
              </div>

              {/* Primary CTA Button: Start Your Journey -> with Glowing Spring Interaction */}
              <motion.button
                onClick={onStartJourney}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-extrabold text-sm sm:text-base shadow-[0_10px_35px_rgba(16,185,129,0.45)] hover:shadow-[0_15px_45px_rgba(132,204,22,0.55)] flex items-center justify-center space-x-3 group border border-lime-300/40 cursor-pointer transition-all"
              >
                <span className="tracking-wide">{dict.heroCTA}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column (5 cols): Interactive AI Node Visualizer Widget */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <AiNodeVisualizer language={language} />
          </div>
        </div>
      </div>

      {/* 3. PULSING INTERACTIVE "SCROLL TO EXPLORE" INDICATOR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 pb-8 flex flex-col items-center justify-center text-center cursor-pointer"
        onClick={handleScrollExplore}
      >
        <motion.div
          whileHover={{ y: 3 }}
          className="group flex flex-col items-center space-y-2.5 text-xs font-semibold text-emerald-300/80 hover:text-white transition"
        >
          <span className="tracking-widest uppercase text-[11px] font-bold text-emerald-300 group-hover:text-emerald-100 transition">
            {dict.scrollExplore}
          </span>
          <div className="w-9 h-9 rounded-full bg-white/5 border border-emerald-400/40 flex items-center justify-center group-hover:border-lime-400 group-hover:bg-emerald-500/20 transition-all duration-300 shadow-lg">
            <ChevronDown className="w-4 h-4 text-lime-400 animate-bounce" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
