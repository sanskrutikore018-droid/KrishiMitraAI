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
      img: '/images/mechanization.jpg',
      title: dict.storyCard1Title,
      desc: dict.storyCard1Desc,
      tag: 'Mechanization',
      accent: 'border-lime-400/40'
    },
    {
      img: '/images/soil-health.jpg',
      title: dict.storyCard2Title,
      desc: dict.storyCard2Desc,
      tag: 'Soil Health',
      accent: 'border-emerald-400/40'
    },
    {
      img: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=800&auto=format&fit=crop',
      title: dict.storyCard3Title,
      desc: dict.storyCard3Desc,
      tag: 'Direct Income',
      accent: 'border-amber-400/40'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.96 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.18,
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as any
      }
    })
  };

  return (
    <section
      id="story"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-[#041209] via-[#0a1c12] to-[#041209] text-white overflow-hidden border-t border-emerald-950/80"
    >
      {/* Subtle Parallax Background Orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        className="absolute top-1/4 left-0 w-[550px] h-[550px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 35, 0], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
        className="absolute bottom-10 right-0 w-[600px] h-[600px] bg-lime-600/10 rounded-full blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Narrative Headline & Mission with scroll reveal */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-7"
          >
            {/* Mission Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-xl shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span className="tracking-wide">{dict.appTitle} Mission</span>
            </div>

            {/* Editorial Serif Story Headline */}
            <div className="space-y-3">
              <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-white tracking-tight leading-[1.14]">
                {dict.storyHeading}
              </h2>
              <p className="font-editorial italic text-2xl sm:text-3xl text-lime-300 font-light">
                {dict.storySubheading}
              </p>
            </div>

            <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed font-normal">
              {dict.storyDesc}
            </p>

            {/* 3 Featured Interactive Pillar Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="vantara-card p-4 rounded-2xl flex flex-col items-center text-center space-y-2.5 transition shadow-lg cursor-pointer border border-emerald-500/25 hover:border-lime-400"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                  <Landmark className="w-5 h-5 text-emerald-300 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  {dict.feat1}
                </span>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="vantara-card p-4 rounded-2xl flex flex-col items-center text-center space-y-2.5 transition shadow-lg cursor-pointer border border-amber-500/25 hover:border-amber-400"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Scale className="w-5 h-5 text-amber-300 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  {dict.feat2}
                </span>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="vantara-card p-4 rounded-2xl flex flex-col items-center text-center space-y-2.5 transition shadow-lg cursor-pointer border border-green-500/25 hover:border-green-400"
              >
                <div className="w-11 h-11 rounded-xl bg-lime-500/20 text-lime-300 flex items-center justify-center border border-lime-400/30">
                  <Compass className="w-5 h-5 text-lime-300 stroke-[2.2]" />
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
                className="group relative rounded-3xl overflow-hidden vantara-card transition-all duration-300 border border-emerald-500/30 hover:border-lime-400/60 flex flex-col shadow-2xl cursor-pointer"
              >
                {/* Photo Thumbnail */}
                <div className="h-52 sm:h-60 w-full relative overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041209] via-[#041209]/30 to-transparent opacity-95" />

                  {/* Corner Pill */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#041209]/85 backdrop-blur-xl border border-emerald-400/40 text-[10px] font-extrabold text-emerald-300 shadow-md">
                    {card.tag}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#0a1c12] to-[#041209] space-y-2.5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-lime-300 transition-colors">
                      {card.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-lime-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </div>
                  <p className="text-xs text-emerald-200/80 leading-relaxed font-normal">
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
