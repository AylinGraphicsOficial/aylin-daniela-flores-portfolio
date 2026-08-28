import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project, Language, Discipline, DisciplineSlide } from '../types';
import {
  getStoredProjects,
  getStoredDisciplines,
  subscribeToPortfolioChanges,
} from '../utils/portfolioStorage';
import { playClickSound, playHoverSound } from '../utils/audio';

interface WorksBentoGridProps {
  lang: Language;
  onSelectProject: (project: Project) => void;
}

// Sub-component for interactive image slider in each discipline
const DisciplineSliderCard: React.FC<{
  discipline: Discipline;
  lang: Language;
  onSelect: () => void;
}> = ({ discipline, lang, onSelect }) => {
  const visibleSlides: DisciplineSlide[] =
    discipline.slides && discipline.slides.length > 0
      ? discipline.slides.filter((s) => s.visible)
      : [{ id: 'fallback', image: discipline.image, visible: true }];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setCurrentSlideIndex((prev) =>
      prev === 0 ? visibleSlides.length - 1 : prev - 1
    );
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setCurrentSlideIndex((prev) =>
      prev === visibleSlides.length - 1 ? 0 : prev + 1
    );
  };

  const activeSlide = visibleSlides[currentSlideIndex] || visibleSlides[0];

  return (
    <div
      className="flex flex-row items-start gap-4 sm:gap-8 md:gap-12 group cursor-pointer"
      onClick={onSelect}
      onMouseEnter={playHoverSound}
    >
      {/* Left Side: Bold Italic Number + Vertical Label */}
      <div className="flex flex-col items-center flex-shrink-0 pt-2 w-10 sm:w-16">
        <span className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tighter text-white select-none leading-none">
          {discipline.number}
        </span>
        <span className="text-[9px] sm:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-400 font-bold [writing-mode:vertical-rl] rotate-180 mt-6 sm:mt-10 select-none whitespace-nowrap">
          {lang === 'es' ? discipline.verticalTextEs : discipline.verticalTextEn}
        </span>
      </div>

      {/* Right Side: Main Interactive Slider Card + Typography */}
      <div className="flex-1 min-w-0">
        {/* Interactive Image Slider Card */}
        <div className="relative aspect-[16/8] sm:aspect-[16/7] md:aspect-[21/9] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#081208] border border-white/15 group-hover:border-[#76FF03]/70 group-hover:shadow-[0_25px_60px_rgba(118,255,3,0.2)] transition-all duration-500 flex items-center justify-center p-3 sm:p-5">
          {/* Active Image Render with smooth transition */}
          <img
            key={activeSlide.id || activeSlide.image}
            src={activeSlide.image}
            alt={activeSlide.title || discipline.titleEs}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-all duration-700 ease-out"
          />

          {/* Slider Prev / Next Arrows (if more than 1 slide) */}
          {visibleSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#76FF03] text-white hover:text-black border border-white/20 hover:border-[#76FF03] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
                title="Diapositiva Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#76FF03] text-white hover:text-black border border-white/20 hover:border-[#76FF03] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
                title="Siguiente Diapositiva"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots Indicators */}
              <div className="absolute bottom-5 right-6 flex items-center gap-1.5 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {visibleSlides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      setCurrentSlideIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlideIndex
                        ? 'w-6 bg-[#76FF03]'
                        : 'w-2 bg-white/40 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Below-Card Typography: Title + Arrow + Subtitle + Description */}
        <div className="mt-6 sm:mt-8">
          {/* Title & Arrow Row */}
          <div className="flex items-center gap-3 sm:gap-5">
            <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors leading-tight">
              {lang === 'es' ? discipline.titleEs : discipline.titleEn}
            </h3>
            <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-white/20 group-hover:border-[#76FF03] group-hover:bg-[#76FF03] text-white group-hover:text-[#050B05] flex items-center justify-center transition-all duration-300 group-hover:rotate-45 flex-shrink-0 shadow-lg">
              <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Subtitle */}
          <span className="text-[11px] sm:text-xs md:text-sm font-mono font-bold tracking-widest text-[#76FF03] uppercase mt-2.5 mb-2 block">
            {lang === 'es' ? discipline.subtitleEs : discipline.subtitleEn}
          </span>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-3xl leading-relaxed font-normal">
            {lang === 'es' ? discipline.descEs : discipline.descEn}
          </p>
        </div>
      </div>
    </div>
  );
};

export const WorksBentoGrid: React.FC<WorksBentoGridProps> = ({
  lang,
  onSelectProject,
}) => {
  const [projects, setProjects] = useState<Project[]>(getStoredProjects);
  const [disciplines, setDisciplines] = useState<Discipline[]>(getStoredDisciplines);

  // Subscribe to live changes from storage
  useEffect(() => {
    const handleUpdate = () => {
      setProjects(getStoredProjects());
      setDisciplines(getStoredDisciplines());
    };
    handleUpdate();
    const unsubscribe = subscribeToPortfolioChanges(handleUpdate);
    return () => unsubscribe();
  }, []);

  const handleDisciplineClick = (item: Discipline) => {
    playClickSound();
    const target =
      projects.find((p) => p.id === item.targetProjectId) || projects[0];
    if (target) onSelectProject(target);
  };

  return (
    <section
      id="work"
      className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-16 sm:mb-20 space-y-4">
        {/* Category Pill Tag */}
        <div className="section-tag-pill">
          <span className="badge-dot" />
          <span>{lang === 'es' ? 'PORTAFOLIO' : 'PORTFOLIO'}</span>
        </div>

        {/* Section Title */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase italic tracking-tight leading-none">
          {lang === 'es' ? 'PORTAFOLIO & ESPECIALIDADES' : 'PORTFOLIO & DISCIPLINES'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl font-normal leading-relaxed">
          {lang === 'es'
            ? 'Explora las disciplinas clave y la colección de proyectos 3D, branding y producción visual creados por Aylin Daniela Flores.'
            : 'Explore key creative disciplines and the showcase of 3D, branding, and visual productions crafted by Aylin Daniela Flores.'}
        </p>
      </div>

      {/* 4 Hero Discipline Showcase Sections with Interactive Sliders */}
      <div className="space-y-20 sm:space-y-28">
        {disciplines
          .filter((d) => d.visible !== false)
          .map((item) => (
            <DisciplineSliderCard
              key={item.id}
              discipline={item}
              lang={lang}
              onSelect={() => handleDisciplineClick(item)}
            />
          ))}
      </div>

      {/* Divider to Projects Catalog Grid */}
      <div className="my-24 sm:my-32">
        <div className="w-full h-px bg-white/15 mb-16" />

        {/* Centered Catalog Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#76FF03] uppercase block mb-2">
            {lang === 'es' ? 'TODAS LAS PRODUCCIONES' : 'ALL PRODUCTIONS'}
          </span>
          <h3 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tight text-white leading-none">
            {lang === 'es' ? 'CATÁLOGO DE PROYECTOS' : 'PROJECTS CATALOG'}
          </h3>
        </div>

        {/* 4-Column Grid: Closer Gap (gap-4 sm:gap-5), Larger Ratio (aspect-[16/10]), 15% Reduced Corners (rounded-[8px]) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                playClickSound();
                onSelectProject(project);
              }}
              onMouseEnter={playHoverSound}
              className="group cursor-pointer flex flex-col"
            >
              {/* Refined Image Card (Larger aspect ratio, rounded-[8px], closer spacing) */}
              <div className="relative aspect-[16/10] w-full rounded-[8px] overflow-hidden bg-[#081208] border border-white/15 group-hover:border-[#76FF03]/70 group-hover:shadow-[0_12px_30px_rgba(118,255,3,0.25)] transition-all duration-500 flex items-center justify-center p-3 sm:p-3.5">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Below-Card Typography: Balanced Height and Aesthetic Proportions */}
              <div className="mt-3">
                <h4 className="text-base sm:text-[17px] font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors leading-snug line-clamp-2 min-h-[2.6rem] flex items-start">
                  {project.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-400 font-mono tracking-wide mt-1 truncate">
                  {project.client} • {lang === 'es' ? 'Diseñadora Principal' : 'Lead Designer'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorksBentoGrid;
