'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, Scale, Compass, Sparkles, ArrowUpRight } from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';

interface StorytellingSectionProps {
  language: SupportedLanguage;
}

export const StorytellingSection: React.FC<StorytellingSectionProps> = ({ language }) => {
  const dict = getDictionary(language);

  const storyCards = [
    {
      img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop',
      title: dict.storyCard1Title,
      desc: dict.storyCard1Desc,
      tag: 'Mechanization'
    },
    {
      img: '/images/soil-health.jpg',
      title: dict.storyCard2Title,
      desc: dict.storyCard2Desc,
      tag: 'Soil Health'
    },
    {
      img: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=800&auto=format&fit=crop',
      title: dict.storyCard3Title,
      desc: dict.storyCard3Desc,
      tag: 'Direct Income'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.18,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any
      }
    })
  };

  return (
    <section
      id="story"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-[#06150b] via-[#092211] to-[#07160b] text-white overflow-hidden border-t border-emerald-900/40"
    >
      {/* Subtle Parallax Background Orbs */}
      <motion.div
        animate={{ y: [0, -25, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        className="absolute bottom-10 right-0 w-[550px] h-[550px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative Headline & Mission with scroll reveal */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{dict.appTitle} Mission</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
                {dict.storyHeading}
              </h2>
              <p className="text-xl sm:text-2xl text-emerald-300 font-bold">
                {dict.storySubheading}
              </p>
            </div>

            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-normal">
              {dict.storyDesc}
            </p>

            {/* 3 Featured Interactive Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="glass-card p-3.5 rounded-2xl flex flex-col items-center text-center space-y-2 transition shadow-lg cursor-pointer border border-emerald-500/25 hover:border-emerald-400"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                  <Landmark className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  {dict.feat1}
                </span>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="glass-card p-3.5 rounded-2xl flex flex-col items-center text-center space-y-2 transition shadow-lg cursor-pointer border border-amber-500/25 hover:border-amber-400"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Scale className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  {dict.feat2}
                </span>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="glass-card p-3.5 rounded-2xl flex flex-col items-center text-center space-y-2 transition shadow-lg cursor-pointer border border-green-500/25 hover:border-green-400"
              >
                <div className="w-11 h-11 rounded-xl bg-green-500/20 text-green-300 flex items-center justify-center border border-green-400/30">
                  <Compass className="w-5 h-5 text-green-300" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  {dict.feat3}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: 3 Floating Photographic Narrative Cards with Staggered Scroll Triggers */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {storyCards.map((card, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group relative rounded-3xl overflow-hidden glass-card transition-all duration-300 border border-emerald-500/30 hover:border-emerald-400/60 flex flex-col shadow-2xl cursor-pointer"
              >
                {/* Photo Thumbnail */}
                <div className="h-52 sm:h-60 w-full relative overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091f11] via-black/20 to-transparent opacity-90" />

                  {/* Corner Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-[10px] font-bold text-emerald-300">
                    {card.tag}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#091f11] to-[#07160b] space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition">
                      {card.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </div>
                  <p className="text-xs text-emerald-200/75 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
