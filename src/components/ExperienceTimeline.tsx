import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Language, ExperienceItem } from '../types';
import { translations } from '../data/portfolioData';
import { playClickSound } from '../utils/audio';
import {
  getStoredExperience,
  subscribeToPortfolioChanges,
} from '../utils/portfolioStorage';

interface ExperienceTimelineProps {
  lang: Language;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ lang }) => {
  const t = translations[lang];
  const [experiences, setExperiences] = useState<ExperienceItem[]>(getStoredExperience);
  const [expandedId, setExpandedId] = useState<string>(() => {
    const list = getStoredExperience();
    return list[0]?.id || '';
  });

  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredExperience();
      setExperiences(updated);
      if (!expandedId && updated.length > 0) {
        setExpandedId(updated[0].id);
      }
    };
    handleUpdate();
    const unsubscribe = subscribeToPortfolioChanges(handleUpdate);
    return () => unsubscribe();
  }, [expandedId]);

  const toggleExpand = (id: string) => {
    playClickSound();
    setExpandedId(prev => (prev === id ? '' : id));
  };

  return (
    <section id="experience" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="section-tag-pill mb-3">
          <span className="badge-dot" />
          <span>{lang === 'es' ? 'EXPERIENCIA' : 'EXPERIENCE'}</span>
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
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#76FF03] via-[#38B000] to-transparent transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(118,255,3,0.4)]" />

        <div className="space-y-12">
          {experiences.map((item, idx) => {
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
                <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-[#050B05] border-2 border-[#76FF03] transform -translate-x-[11px] md:-translate-x-1/2 flex items-center justify-center z-20 shadow-[0_0_15px_#76FF03] group-hover:scale-125 transition-transform duration-300">
                  <div className="w-2 h-2 rounded-full bg-[#76FF03]" />
                </div>

                {/* Left/Right Side Card */}
                <div className="w-full md:w-[46%] pl-12 md:pl-0">
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="arcade-card p-6 rounded-2xl cursor-pointer kinetic-hover hover:border-[#76FF03]/80 transition-all"
                  >
                    {/* Role & Company */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg md:text-xl font-black text-white group-hover:text-[#76FF03] transition-colors">
                            {item.role}
                          </h3>
                          {item.isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40">
                              ACTUAL
                            </span>
                          )}
                        </div>
                        <p className="text-[#76FF03] font-mono text-xs md:text-sm font-semibold mt-0.5">
                          {item.company}
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-[#76FF03] transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Period & Location */}
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 mb-4">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#76FF03]" />
                        <span>{item.period}</span>
                      </span>
                      {item.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-[#76FF03]" />
                          <span>{item.location}</span>
                        </span>
                      )}
                    </div>

                    {/* Short description */}
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Expanded details */}
                    {isExpanded && item.responsibilities && item.responsibilities.length > 0 && (
                      <div className="pt-4 border-t border-white/10 space-y-3 animate-fade-in">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#76FF03] font-bold block">
                          Responsabilidades Clave:
                        </span>
                        <ul className="space-y-2">
                          {item.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start space-x-2 text-xs text-gray-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#76FF03] flex-shrink-0 mt-0.5" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tools Tags */}
                    {item.toolsUsed && item.toolsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/5">
                        {item.toolsUsed.map((tool, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white/5 text-gray-300 border border-white/10"
                          >
                            {tool}
                          </span>
                        ))}
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

export default ExperienceTimeline;
