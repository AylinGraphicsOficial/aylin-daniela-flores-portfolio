import React from 'react';
import { ArrowLeft, Sparkles, MoveRight } from 'lucide-react';
import { Project, Language } from '../types';
import { projectsData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';

interface ProjectsGalleryPageProps {
  lang: Language;
  onNavigateHome: () => void;
  onSelectProject: (project: Project) => void;
  onOpenProjectPlanner: () => void;
}

export const ProjectsGalleryPage: React.FC<ProjectsGalleryPageProps> = ({
  lang,
  onNavigateHome,
  onSelectProject,
  onOpenProjectPlanner,
}) => {
  return (
    <div className="min-h-screen bg-[#050B05] text-white pt-24 pb-28 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#76FF03]/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* Top Navigation Row */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onNavigateHome();
          }}
          onMouseEnter={playHoverSound}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#76FF03] text-gray-300 hover:text-[#050B05] border border-white/10 hover:border-[#76FF03] transition-all duration-300 cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs sm:text-sm font-bold font-mono tracking-wider uppercase">
            {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#76FF03] bg-[#76FF03]/10 border border-[#76FF03]/30 px-3 py-1 rounded-full uppercase tracking-wider">
            {projectsData.length} {lang === 'es' ? 'PROYECTOS' : 'PROJECTS'}
          </span>
        </div>
      </div>

      {/* Giant Wix-Style Portfolio Title Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase italic tracking-tighter text-white leading-none mb-8">
          {lang === 'es' ? 'PORTAFOLIO' : 'PORTFOLIO'}
        </h1>
        <div className="w-full h-px bg-white/15" />
      </div>

      {/* 2-Column Wix Game Designer Project Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 lg:gap-x-16 lg:gap-y-20">
          {projectsData.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                playClickSound();
                onSelectProject(project);
              }}
              onMouseEnter={playHoverSound}
              className="group cursor-pointer flex flex-col"
            >
              {/* Wix-Style Large Rounded Image Card */}
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-[#081208] border border-white/15 group-hover:border-[#76FF03]/70 group-hover:shadow-[0_20px_50px_rgba(118,255,3,0.2)] transition-all duration-500 flex items-center justify-center p-4 sm:p-6">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Below-Card Typography (Title in Bold Italic + Role Subtitle) */}
              <div className="mt-6">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors leading-tight mb-1.5">
                  {project.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400 font-normal tracking-wide">
                  {project.client} • {lang === 'es' ? 'Diseñadora Principal' : 'Lead Designer'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Call-To-Action Banner */}
      <div className="max-w-7xl mx-auto mt-28 pt-16 border-t border-white/15">
        <div className="glass-panel p-8 sm:p-12 md:p-16 rounded-3xl border border-[#76FF03]/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-gradient-to-r from-[#050B05] via-[#081A08] to-[#050B05]">
          <div className="max-w-xl text-center md:text-left z-10">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-2">
              {lang === 'es' ? '¿TIENES UN PROYECTO EN MENTE?' : 'HAVE A PROJECT IN MIND?'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase italic tracking-tight leading-tight mb-3">
              {lang === 'es' ? 'Hagamos algo extraordinario' : "Let's create something extraordinary"}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              {lang === 'es'
                ? 'Disponible para identidades visuales, modelado 3D comercial, diseño de stands y edición audiovisual.'
                : 'Available for brand identities, commercial 3D modeling, exhibition stands, and video editing.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 z-10">
            <SpecularButton
              onClick={() => {
                playClickSound();
                onOpenProjectPlanner();
              }}
              onMouseEnter={playHoverSound}
              variant="primary"
              size="lg"
              radius={14}
              className="text-xs sm:text-sm font-bold tracking-wider text-[#76FF03] flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-[#76FF03]" />
              <span>{lang === 'es' ? 'INICIAR PROYECTO' : 'START PROJECT'}</span>
            </SpecularButton>

            <SpecularButton
              onClick={() => {
                playClickSound();
                onNavigateHome();
                setTimeout(() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              onMouseEnter={playHoverSound}
              variant="glass"
              size="lg"
              radius={14}
              className="text-xs sm:text-sm font-bold tracking-wider flex items-center space-x-2"
            >
              <span>{lang === 'es' ? 'CONTACTAR' : 'CONTACT'}</span>
              <MoveRight className="w-4 h-4" />
            </SpecularButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsGalleryPage;
