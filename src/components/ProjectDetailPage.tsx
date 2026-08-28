import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Box, Sparkles } from 'lucide-react';
import { Project, Language } from '../types';
import { projectsData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';

interface ProjectDetailPageProps {
  project: Project;
  lang: Language;
  onBackToPortfolio: () => void;
  onSelectProject: (project: Project) => void;
  onOpenProjectPlanner: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  lang,
  onBackToPortfolio,
  onSelectProject,
  onOpenProjectPlanner,
}) => {
  const currentIndex = projectsData.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0
      ? projectsData[currentIndex - 1]
      : projectsData[projectsData.length - 1];
  const nextProject =
    currentIndex < projectsData.length - 1
      ? projectsData[currentIndex + 1]
      : projectsData[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

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
            onBackToPortfolio();
          }}
          onMouseEnter={playHoverSound}
          className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#76FF03] text-gray-300 hover:text-[#050B05] border border-white/10 hover:border-[#76FF03] transition-all duration-300 cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs sm:text-sm font-bold font-mono tracking-wider uppercase">
            {lang === 'es' ? 'Volver al Portafolio' : 'Back to Portfolio'}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#76FF03] bg-[#76FF03]/10 border border-[#76FF03]/30 px-3 py-1 rounded-full uppercase tracking-wider">
            {project.category} • {project.year}
          </span>
        </div>
      </div>

      {/* Giant Wix-Style Project Title Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase italic tracking-tighter text-white leading-none mb-8">
          {project.title}
        </h1>
        <div className="w-full h-px bg-white/15 mb-12" />

        {/* 2-Column Wix Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column: Role & Full Description */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-1.5">
                {lang === 'es' ? 'ROL' : 'ROLE'}
              </span>
              <p className="text-base sm:text-lg text-white font-bold tracking-wide">
                {project.client} • {lang === 'es' ? 'Diseñadora Principal' : 'Lead Designer'}
              </p>
            </div>

            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-2">
                {lang === 'es' ? 'DESCRIPCIÓN' : 'DESCRIPTION'}
              </span>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                {project.fullDesc || project.shortDesc}
              </p>
            </div>

            {project.metrics && project.metrics.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-2">
                  {lang === 'es' ? 'IMPACTO & RESULTADOS' : 'IMPACT & RESULTS'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-[#76FF03]/10 border border-[#76FF03]/30 px-3.5 py-1.5 rounded-xl text-xs font-mono text-[#76FF03]"
                    >
                      <span className="font-bold text-white mr-1.5">{m.value}</span>
                      <span className="text-[11px] text-gray-300">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Year, Category, Platform/Tools */}
          <div className="md:col-span-5 space-y-6 md:border-l md:border-white/10 md:pl-10">
            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-1">
                {lang === 'es' ? 'AÑO' : 'YEAR'}
              </span>
              <p className="text-base sm:text-lg text-white font-mono font-bold">
                {project.year}
              </p>
            </div>

            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-1">
                {lang === 'es' ? 'GÉNERO / CATEGORÍA' : 'GENRE / CATEGORY'}
              </span>
              <p className="text-base sm:text-lg text-white font-medium">
                {project.category}
              </p>
            </div>

            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-1">
                {lang === 'es' ? 'HERRAMIENTAS / PLATAFORMA' : 'TOOLS / PLATFORM'}
              </span>
              <p className="text-sm sm:text-base text-gray-300 font-mono">
                {project.tags.join(' • ')}
              </p>
            </div>

            <div className="pt-4">
              <SpecularButton
                onClick={() => {
                  playClickSound();
                  onOpenProjectPlanner();
                }}
                onMouseEnter={playHoverSound}
                variant="primary"
                size="md"
                radius={12}
                className="w-full text-xs font-bold font-mono tracking-wider flex items-center justify-center space-x-2 text-[#76FF03]"
              >
                <Sparkles className="w-4 h-4 text-[#76FF03]" />
                <span>{lang === 'es' ? 'COTIZAR PROYECTO SIMILAR' : 'QUOTE SIMILAR PROJECT'}</span>
              </SpecularButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Full-Bleed Artwork Showcase (Matching Wix Game Designer Gallery) */}
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 mt-16">
        {/* Main Hero Artwork */}
        <div className="w-full rounded-3xl overflow-hidden bg-[#0a120a] border border-white/15 shadow-2xl relative group">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto max-h-[85vh] object-contain mx-auto transition-transform duration-700 ease-out p-2 sm:p-4"
          />
        </div>

        {/* Sub-Gallery Section Header */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <div className="pt-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tight text-white mb-8">
              {lang === 'es' ? 'VISTAS DE DETALLE & RENDER' : 'DETAIL VIEWS & RENDERS'}
            </h2>

            {/* 2-Column Grid of Project Renders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {project.galleryImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden bg-[#081208] border border-white/15 hover:border-[#76FF03]/60 transition-all duration-500 shadow-xl group aspect-[16/10] flex items-center justify-center p-4"
                >
                  <img
                    src={imgSrc}
                    alt={`${project.title} detail ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Wix-Style Project Navigator */}
      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/15">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Previous Project Link */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onSelectProject(prevProject);
            }}
            onMouseEnter={playHoverSound}
            className="group flex items-center gap-3 text-left cursor-pointer transition-transform hover:-translate-x-1"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 group-hover:border-[#76FF03] group-hover:bg-[#76FF03] text-white group-hover:text-[#050B05] flex items-center justify-center transition-all duration-300">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                {lang === 'es' ? 'PROYECTO ANTERIOR' : 'PREVIOUS PROJECT'}
              </span>
              <span className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors">
                {prevProject.title}
              </span>
            </div>
          </button>

          {/* Center Back to Portfolio */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onBackToPortfolio();
            }}
            onMouseEnter={playHoverSound}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-mono font-bold tracking-widest text-gray-300 hover:text-white border border-white/10 uppercase transition-all"
          >
            {lang === 'es' ? 'TODOS LOS PROYECTOS' : 'ALL PROJECTS'}
          </button>

          {/* Next Project Link */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onSelectProject(nextProject);
            }}
            onMouseEnter={playHoverSound}
            className="group flex items-center gap-3 text-right cursor-pointer transition-transform hover:translate-x-1"
          >
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                {lang === 'es' ? 'SIGUIENTE PROYECTO' : 'NEXT PROJECT'}
              </span>
              <span className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors">
                {nextProject.title}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/20 group-hover:border-[#76FF03] group-hover:bg-[#76FF03] text-white group-hover:text-[#050B05] flex items-center justify-center transition-all duration-300">
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
