import React from 'react';
import { Language } from '../types';
import { translations, statsData } from '../data/portfolioData';

interface StatsAndMilestonesProps {
  lang: Language;
}

export const StatsAndMilestones: React.FC<StatsAndMilestonesProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section id="stats" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#38B000]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Numbers / Stats Grid */}
      <div>
        <div className="flex items-center space-x-3 mb-4 justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#76FF03]" />
          <span className="text-xs font-bold font-mono tracking-[0.25em] text-[#76FF03] uppercase">
            IMPACT & METRICS
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight text-center mb-16">
          {t.stats.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className="arcade-card p-8 rounded-2xl kinetic-hover flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#76FF03]/20 to-transparent pointer-events-none" />

              <div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-mono tracking-tighter mb-2 group-hover:text-[#76FF03] transition-colors flex items-baseline">
                  <span>{stat.value}</span>
                  <span className="text-[#76FF03] text-3xl sm:text-4xl">{stat.suffix}</span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-gray-200 uppercase tracking-wide mb-2">
                  {stat.label}
                </h3>
              </div>

              <p className="text-xs text-gray-400 font-normal leading-relaxed pt-4 border-t border-white/10">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
