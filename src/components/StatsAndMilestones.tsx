import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Language } from '../types';
import { translations, statsData, testimonialsData } from '../data/portfolioData';

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
      <div className="mb-24">
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
              className="glass-panel p-8 rounded-2xl kinetic-hover flex flex-col justify-between border border-white/10 relative overflow-hidden group"
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

      {/* Testimonials & Client Reviews */}
      <div id="testimonials" className="pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-[#76FF03] fill-[#76FF03]" />
              <span className="text-xs font-bold font-mono tracking-widest text-[#76FF03] uppercase">
                TESTIMONIALS & TRUST
              </span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              {t.stats.clientReviews}
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">
            Verified Client Endorsements
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.map((test) => (
            <div
              key={test.id}
              className="glass-panel p-8 rounded-2xl flex flex-col justify-between border border-white/10 hover:border-[#76FF03]/40 transition-all relative"
            >
              <Quote className="w-8 h-8 text-[#76FF03]/40 mb-4" />

              <p className="text-sm md:text-base text-gray-200 leading-relaxed italic mb-8">
                "{test.quote}"
              </p>

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={test.avatar}
                    alt={test.author}
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                    className="w-11 h-11 rounded-full object-cover border border-[#76FF03]/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none mb-1">
                      {test.author}
                    </h4>
                    <span className="text-xs text-gray-400 font-mono block">
                      {test.role} • {test.company}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#76FF03] uppercase">
                    PROJECT: {test.projectRef}
                  </span>
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-[#76FF03] fill-[#76FF03]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
