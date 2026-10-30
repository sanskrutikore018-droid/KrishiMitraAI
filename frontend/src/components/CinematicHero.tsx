'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles, Shield, Globe } from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';
import { AiNodeVisualizer } from './AiNodeVisualizer';

interface CinematicHeroProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onStartJourney: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  language,
  onLanguageChange,
  onStartJourney
}) => {
  const dict = getDictionary(language);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 35, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.85,
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
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-black text-white"
    >
      {/* 1. CINEMATIC VIDEO BACKGROUND & CINEMATIC GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* High-definition Looping Agricultural Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none transition-transform duration-1000 ease-out"
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

        {/* Cinematic Multi-layered Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-[#06150b]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/85 pointer-events-none" />

        {/* Ambient atmospheric green glow orb */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[750px] h-[450px] bg-emerald-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      </div>

      {/* Spacer for sticky navbar */}
      <div className="h-20 sm:h-24" />

      {/* 2. MAIN CENTER HERO CONTENT WITH DUAL COLUMN LAYOUT (Typography Left + AI Node Visualizer Right) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full my-auto py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (7 cols): Oversized Typography & Controls */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start justify-center"
          >
            {/* Top Badges */}
            <motion.div
              variants={lineVariants}
              className="flex flex-wrap items-center gap-2.5 mb-5"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-200 text-xs font-semibold backdrop-blur-xl shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{dict.appSubtitle}</span>
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/20 text-xs font-medium text-emerald-100 backdrop-blur-md">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{dict.govIndia}</span>
              </div>
            </motion.div>

            {/* Oversized Cinematic Typography with Staggered Reveal */}
            <div className="space-y-1 sm:space-y-2 mb-5">
              <motion.h1
                variants={lineVariants}
                className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.06] drop-shadow-2xl"
              >
                {dict.heroTitle1}
              </motion.h1>

              <motion.h2
                variants={lineVariants}
                className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-200 tracking-tight leading-[1.06] drop-shadow-2xl"
              >
                {dict.heroTitle2}
              </motion.h2>

              <motion.h2
                variants={lineVariants}
                className="text-4xl sm:text-6xl md:text-7xl font-black text-emerald-100/90 tracking-tight leading-[1.06] drop-shadow-2xl"
              >
                {dict.heroTitle3}
              </motion.h2>
            </div>

            {/* Subtitle with fade-in */}
            <motion.p
              variants={lineVariants}
              className="text-sm sm:text-base md:text-lg text-emerald-100/90 max-w-xl font-medium tracking-wide mb-7 drop-shadow-md leading-relaxed"
            >
              {dict.heroSubtitle}
            </motion.p>

            {/* Action Controls with Spring Physics */}
            <motion.div
              variants={lineVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
            >
              {/* Language Selector Pill */}
              <div className="flex items-center space-x-2 bg-emerald-950/80 backdrop-blur-xl border border-emerald-400/40 rounded-2xl px-4 py-3 text-xs font-bold text-white shadow-xl hover:border-emerald-300 transition">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-medium">ಭಾಷೆ / Lang:</span>
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                  className="bg-transparent text-emerald-200 font-extrabold focus:outline-none cursor-pointer"
                >
                  <option value="kn" className="bg-[#091f11] text-white">ಕನ್ನಡ (Kannada)</option>
                  <option value="en" className="bg-[#091f11] text-white">English</option>
                  <option value="hi" className="bg-[#091f11] text-white">हिन्दी (Hindi)</option>
                  <option value="mr" className="bg-[#091f11] text-white">मराठी (Marathi)</option>
                </select>
              </div>

              {/* Primary CTA Button: Start Your Journey -> with Spring Interaction */}
              <motion.button
                onClick={onStartJourney}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 hover:from-emerald-500 hover:to-green-400 text-white font-black text-sm sm:text-base shadow-2xl shadow-emerald-900/80 flex items-center justify-center space-x-2.5 group border border-emerald-300/40 cursor-pointer"
              >
                <span>{dict.heroCTA}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column (5 cols): Interactive AI Node Visualizer Widget (Image 1 "Tech Nature" style) */}
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
          className="group flex flex-col items-center space-y-2 text-xs font-semibold text-emerald-300/80 hover:text-white transition"
        >
          <span className="tracking-widest uppercase text-[11px] font-bold text-emerald-300 group-hover:text-emerald-100 transition">
            {dict.scrollExplore}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-emerald-400/40 flex items-center justify-center group-hover:border-emerald-300 group-hover:bg-emerald-500/10 transition shadow-lg">
            <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
