import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Calendar,
  User,
  Layers,
} from 'lucide-react';
import { Discipline, Project, Language } from '../types';
import {
  getStoredProjects,
  getProjectsForDiscipline,
  subscribeToPortfolioChanges,
} from '../utils/portfolioStorage';
import { playClickSound, playHoverSound } from '../utils/audio';

interface DisciplineDetailPageProps {
  discipline: Discipline;
  lang: Language;
  onBackToPortfolio: () => void;
  onSelectProject: (project: Project) => void;
  onOpenProjectPlanner?: () => void;
}

export const DisciplineDetailPage: React.FC<DisciplineDetailPageProps> = ({
  discipline,
  lang,
  onBackToPortfolio,
  onSelectProject,
  onOpenProjectPlanner,
}) => {
  const [allProjects, setAllProjects] = useState<Project[]>(getStoredProjects);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  useEffect(() => {
    const handleUpdate = () => {
      setAllProjects(getStoredProjects());
    };
    const unsubscribe = subscribeToPortfolioChanges(handleUpdate);
    return () => unsubscribe();
  }, []);

  // Filter projects assigned to this discipline
  const assignedProjects = React.useMemo(() => {
    return getProjectsForDiscipline(discipline.id, allProjects);
  }, [discipline.id, allProjects]);

  const visibleSlides = (discipline.slides || []).filter((s) => s.visible !== false);

  const title = lang === 'es' ? discipline.titleEs : discipline.titleEn;
  const subtitle = lang === 'es' ? discipline.subtitleEs : discipline.subtitleEn;
  const desc = lang === 'es' ? discipline.descEs : discipline.descEn;
  const verticalText = lang === 'es' ? discipline.verticalTextEs : discipline.verticalTextEn;

  const nextSlide = () => {
    if (visibleSlides.length <= 1) return;
    playClickSound();
    setActiveSlideIndex((prev) => (prev + 1) % visibleSlides.length);
  };

  const prevSlide = () => {
    if (visibleSlides.length <= 1) return;
    playClickSound();
    setActiveSlideIndex((prev) => (prev - 1 + visibleSlides.length) % visibleSlides.length);
  };

  return (
    <div className="relative min-h-screen bg-[#050B05] text-white pt-24 pb-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto selection:bg-[#76FF03] selection:text-[#050B05]">
      {/* Background Ambient Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#76FF03]/8 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Breadcrumb & Back Navigation */}
      <div className="mb-10 sm:mb-14">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onBackToPortfolio();
          }}
          onMouseEnter={playHoverSound}
          className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 hover:bg-[#76FF03] border border-white/15 hover:border-[#76FF03] text-gray-300 hover:text-[#050B05] transition-all duration-300 shadow-lg cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">
            {lang === 'es' ? 'Volver al Portafolio' : 'Back to Portfolio'}
          </span>
        </button>
      </div>

      {/* Hero Header for Discipline */}
      <header className="relative mb-16 sm:mb-20 pb-12 border-b border-white/10 space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-md bg-[#76FF03]/15 border border-[#76FF03]/40 text-[#76FF03] font-mono text-xs font-black tracking-widest uppercase">
            {discipline.number} • {lang === 'es' ? 'ESPECIALIDAD' : 'SPECIALTY'}
          </span>
          {verticalText && (
            <span className="text-xs font-mono text-gray-400 tracking-widest uppercase hidden sm:inline-block">
              {verticalText}
            </span>
          )}
        </div>

        {/* Big Bold Cyber Title */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tight text-white leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base md:text-lg font-mono font-bold text-[#76FF03] tracking-wide uppercase">
              {subtitle}
            </p>
          )}
        </div>

        {/* Description Paragraph */}
        {desc && (
          <p className="max-w-3xl text-sm sm:text-base text-gray-300 font-light leading-relaxed">
            {desc}
          </p>
        )}

        {/* Assigned Projects Metric Pill */}
        <div className="pt-2 flex items-center gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
            <FolderOpen className="w-4 h-4 text-[#76FF03]" />
            <span>
              {assignedProjects.length}{' '}
              {lang === 'es'
                ? assignedProjects.length === 1
                  ? 'PROYECTO DISPONIBLE'
                  : 'PROYECTOS EN ESTA SECCIÓN'
                : 'WORKS IN THIS SECTION'}
            </span>
          </div>

          {onOpenProjectPlanner && (
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenProjectPlanner();
              }}
              onMouseEnter={playHoverSound}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#76FF03]/10 hover:bg-[#76FF03] border border-[#76FF03]/40 text-[#76FF03] hover:text-[#050B05] transition-all text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Cotizar en esta área' : 'Quote this area'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Featured Slides Showcase (if renders/slides exist) */}
      {visibleSlides.length > 0 && (
        <section className="mb-20 sm:mb-24 space-y-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#76FF03] flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>{lang === 'es' ? 'GALERÍA DE RENDERS & VISUALES' : 'RENDERS & VISUAL SHOWCASE'}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Anterior slide"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#76FF03] hover:text-[#050B05] border border-white/15 text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-gray-400">
                {activeSlideIndex + 1} / {visibleSlides.length}
              </span>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Siguiente slide"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#76FF03] hover:text-[#050B05] border border-white/15 text-white transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-[#081208] border border-white/15 shadow-2xl">
            <img
              src={visibleSlides[activeSlideIndex]?.image}
              alt={visibleSlides[activeSlideIndex]?.title || 'Discipline Visual'}
              className="w-full h-full object-contain p-4 transition-all duration-700"
            />
            {visibleSlides[activeSlideIndex]?.title && (
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs font-mono text-white font-bold">
                {visibleSlides[activeSlideIndex]?.title}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects Grid of This Discipline */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-1">
              {lang === 'es' ? 'CATÁLOGO DEDICADO' : 'DEDICATED CATALOG'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-white">
              {lang === 'es'
                ? `TRABAJOS DE ${title}`
                : `${title} PRODUCTIONS`}
            </h2>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {assignedProjects.length}{' '}
            {lang === 'es' ? 'producciones cargadas' : 'productions loaded'}
          </span>
        </div>

        {assignedProjects.length === 0 ? (
          /* Clean Empty State */
          <div className="p-12 sm:p-20 text-center rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
            <FolderOpen className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white uppercase font-mono">
              {lang === 'es' ? 'Sin proyectos en esta sección aún' : 'No projects in this section yet'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              {lang === 'es'
                ? 'Puedes asignar producciones a esta especialidad desde el Dashboard de Administración seleccionando la categoría correspondiente.'
                : 'You can assign productions to this discipline from the Admin Dashboard by selecting the corresponding category.'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onBackToPortfolio();
                }}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-[#76FF03] hover:text-[#050B05] border border-white/20 text-white font-mono text-xs font-bold uppercase transition-all cursor-pointer"
              >
                {lang === 'es' ? 'Ver Todos los Proyectos' : 'View All Projects'}
              </button>
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {assignedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  playClickSound();
                  onSelectProject(project);
                }}
                onMouseEnter={playHoverSound}
                className="group relative rounded-2xl overflow-hidden bg-[#0a140a] border border-white/10 hover:border-[#76FF03] shadow-lg hover:shadow-[0_15px_40px_rgba(118,255,3,0.2)] transition-all duration-500 cursor-pointer flex flex-col justify-between"
              >
                {/* Artwork Thumbnail Presentation */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050B05] flex items-center justify-center p-4 border-b border-white/10">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Category Pill Tag Overlay */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold uppercase text-[#76FF03]">
                    {project.category}
                  </div>
                  {/* Year Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-gray-300">
                    {project.year}
                  </div>
                </div>

                {/* Card Content & Meta */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    {project.shortDesc && (
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {project.shortDesc}
                      </p>
                    )}
                  </div>

                  {/* Client & Tags Row */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                      <span className="flex items-center gap-1.5 truncate max-w-[65%]">
                        <User className="w-3.5 h-3.5 text-[#76FF03]" />
                        <span className="truncate">{project.client}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{project.year}</span>
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="w-full py-2.5 px-4 rounded-xl bg-white/5 group-hover:bg-[#76FF03] border border-white/10 group-hover:border-[#76FF03] text-gray-300 group-hover:text-[#050B05] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300">
                      <span>{lang === 'es' ? 'Ver Detalles Completos' : 'View Full Details'}</span>
                      <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DisciplineDetailPage;
