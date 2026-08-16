import React, { useState } from 'react';
import { Briefcase, Calendar, MapPin, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations, experienceData } from '../data/portfolioData';
import { playClickSound } from '../utils/audio';

interface ExperienceTimelineProps {
  lang: Language;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ lang }) => {
  const t = translations[lang];
  const [expandedId, setExpandedId] = useState<string>(experienceData[0].id);

  const toggleExpand = (id: string) => {
    playClickSound();
    setExpandedId(prev => (prev === id ? '' : id));
  };

  return (
    <section id="experience" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
          <span className="text-[11px] font-bold font-mono tracking-widest text-[#00E5FF] uppercase">
            CAREER TRAJECTORY
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-4">
          {t.experience.title}
        </h2>
        <p className="text-gray-400 text-sm md:text-base">
          {t.experience.subtitle}
        </p>
      </div>

      {/* Timeline Container */}
      <div className="max-w-4xl mx-auto relative">
        {/* Central Glowing Vertical Track */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00E5FF] via-[#0052FF] to-transparent transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(0,229,255,0.4)]" />

        <div className="space-y-12">
          {experienceData.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col md:flex-row items-start ${
                  isEven ? 'md:flex-row-reverse' : ''
                } group`}
              >
                {/* Center Node Indicator */}
                <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-[#0A0F14] border-2 border-[#00E5FF] transform -translate-x-[11px] md:-translate-x-1/2 flex items-center justify-center z-20 shadow-[0_0_15px_#00E5FF] group-hover:scale-125 transition-transform duration-300">
                  <div className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                </div>

                {/* Left/Right Side Card */}
                <div className="w-full md:w-[46%] pl-12 md:pl-0">
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="glass-panel p-6 rounded-2xl cursor-pointer kinetic-hover border border-white/10 hover:border-[#00E5FF]/60 transition-all"
                  >
                    {/* Role & Company */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg md:text-xl font-black text-white group-hover:text-[#00E5FF] transition-colors">
                            {item.role}
                          </h3>
                          {item.isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00E5FF] text-[#0A0F14]">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-300 font-mono mt-0.5">
                          {item.company}
                        </h4>
                      </div>

                      <button className="p-1 rounded bg-white/5 text-gray-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 font-mono mb-4 pb-3 border-b border-white/10">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#00E5FF]" />
                        <span>{item.period}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0052FF]" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-gray-300 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Expandable Key Responsibilities */}
                    {isExpanded && (
                      <div className="pt-3 space-y-3 animate-fade-in border-t border-white/5">
                        <span className="text-xs font-bold font-mono text-[#00E5FF] uppercase block">
                          KEY DELIVERABLES & IMPACT:
                        </span>
                        <ul className="space-y-2 text-xs text-gray-300">
                          {item.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF] mt-0.5 flex-shrink-0" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Tool Stack */}
                        <div className="pt-2">
                          <span className="text-[11px] font-mono text-gray-400 block mb-1.5">
                            CORE ARSENAL:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.toolsUsed.map((tool) => (
                              <span
                                key={tool}
                                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-gray-200"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
