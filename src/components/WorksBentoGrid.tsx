import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Project, Language } from '../types';
import { translations, projectsData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audio';

interface WorksBentoGridProps {
  lang: Language;
  onSelectProject: (project: Project) => void;
}

export const WorksBentoGrid: React.FC<WorksBentoGridProps> = ({
  lang,
  onSelectProject,
}) => {
  const t = translations[lang];
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const categories = ['ALL', '3D MODELING', 'BRANDING', 'DIGITAL ART', 'MOTION'];

  const filteredProjects = activeFilter === 'ALL'
    ? projectsData
    : projectsData.filter((p) => p.category === activeFilter);

  return (
    <section id="work" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#76FF03]" />
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-[#76FF03] uppercase">
              CURATED PORTFOLIO
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none">
            {t.work.title}
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  playClickSound();
                  setActiveFilter(cat);
                }}
                onMouseEnter={playHoverSound}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all ${
                  isSelected
                    ? 'bg-[#76FF03] text-[#050B05] shadow-[0_0_20px_rgba(118,255,3,0.4)]'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {filteredProjects.map((project, idx) => {
          const isLarge = project.id === 'retroMini' || idx === 0;
          const isWide = project.id === 'corporate-identity-system';
          const isSquare = project.id === 'kinetic-touch-hands';

          // Determine responsive bento column span
          let colSpan = 'md:col-span-6';
          if (isLarge) colSpan = 'md:col-span-8';
          else if (isSquare) colSpan = 'md:col-span-4';
          else if (isWide) colSpan = 'md:col-span-12';

          return (
            <div
              key={project.id}
              onClick={() => {
                playClickSound();
                onSelectProject(project);
              }}
              className={`${colSpan} glass-panel rounded-2xl overflow-hidden group cursor-pointer relative kinetic-hover flex flex-col justify-between min-h-[360px] md:min-h-[420px] bg-[#081008]/90 border border-white/10`}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B05] via-[#050B05]/40 to-transparent z-10 opacity-90 group-hover:opacity-80 transition-opacity" />

              {/* Project Image */}
              <div className="absolute inset-0 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-contain p-6 group-hover:scale-108 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Top Tags Bar */}
              <div className="relative z-20 p-6 flex justify-between items-start">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#050B05]/80 backdrop-blur-md border border-[#76FF03]/50 text-[#76FF03] text-[10px] font-mono font-bold rounded-full">
                    {project.category}
                  </span>
                  <span className="px-2.5 py-1 bg-[#050B05]/80 backdrop-blur-md border border-white/10 text-gray-300 text-[10px] font-mono rounded-full">
                    {project.year}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#76FF03] text-white group-hover:text-[#050B05] flex items-center justify-center transition-all duration-300 shadow-lg group-hover:rotate-45">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-20 p-6 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[11px] font-mono text-gray-400 block mb-1">
                  Client: {project.client}
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white group-hover:text-[#76FF03] transition-colors leading-tight mb-2">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mb-4 font-normal">
                  {project.shortDesc}
                </p>

                {/* Sub-tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono text-gray-300"
                    >
                      #{t}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono text-[#76FF03]">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
