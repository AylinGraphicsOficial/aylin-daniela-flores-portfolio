import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, Sparkles, Film } from 'lucide-react';
import { Project, Language, Discipline, DisciplineSlide } from '../types';
import {
  getStoredProjects,
  getStoredDisciplines,
  getCategoryFallbackImage,
  subscribeToPortfolioChanges,
} from '../utils/portfolioStorage';
import { playClickSound, playHoverSound } from '../utils/audio';
import { getProjectPrimaryMedia } from '../utils/mediaDetector';

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
  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = touchStartYRef.current !== null ? e.changedTouches[0].clientY - touchStartYRef.current : 0;
      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        if (deltaX < 0) {
          playClickSound();
          setCurrentSlideIndex((prev) =>
            prev === visibleSlides.length - 1 ? 0 : prev + 1
          );
        } else {
          playClickSound();
          setCurrentSlideIndex((prev) =>
            prev === 0 ? visibleSlides.length - 1 : prev - 1
          );
        }
      }
      touchStartXRef.current = null;
      touchStartYRef.current = null;
    }
  };

  const activeSlide = visibleSlides[currentSlideIndex] || visibleSlides[0];

  return (
    <div
      className="flex flex-row items-start gap-2.5 sm:gap-8 md:gap-12 group cursor-pointer"
      onClick={onSelect}
      onMouseEnter={playHoverSound}
    >
      {/* Left Side: Bold Italic Number + Vertical Label */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1 sm:pt-2 w-7 sm:w-16">
        <span className="text-2xl sm:text-5xl md:text-6xl font-black italic tracking-tighter text-white select-none leading-none">
          {discipline.number}
        </span>
        <span className="text-[8px] sm:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-400 font-bold [writing-mode:vertical-rl] rotate-180 mt-4 sm:mt-10 select-none whitespace-nowrap">
          {lang === 'es' ? discipline.verticalTextEs : discipline.verticalTextEn}
        </span>
      </div>

      {/* Right Side: Main Interactive Slider Card + Typography */}
      <div className="flex-1 min-w-0">
        {/* Interactive Image Slider Card */}
        <div
          className="relative aspect-[16/9] sm:aspect-[16/7] md:aspect-[21/9] w-full rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-[#081208] shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-500 flex items-center justify-center p-2.5 sm:p-5 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Active Image Render with smooth transition */}
          <img
            key={activeSlide.id || activeSlide.image}
            src={activeSlide.image}
            alt={activeSlide.title || discipline.titleEs}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              let fallback = discipline.image || '/images/orbit-stand.webp';
              if (discipline.id === 'edicion-video') fallback = '/images/hero-hands.jpg';
              else if (discipline.id === 'social-media') fallback = '/images/orbit-tablet.webp';
              else if (discipline.id === 'branding') fallback = '/images/brands/holy-nation.webp';
              else if (discipline.id === 'modelado-3d') fallback = '/images/orbit-stand.webp';

              e.currentTarget.src = fallback;
            }}
            className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />

          {/* Left / Right Arrow Controls (Visible only if more than 1 slide) */}
          {visibleSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevSlide}
                onMouseEnter={playHoverSound}
                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/80 hover:bg-[#76FF03] text-white hover:text-[#050B05] flex items-center justify-center backdrop-blur-md transition-all z-20 cursor-pointer shadow-lg active:scale-95 border-0"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                onMouseEnter={playHoverSound}
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/80 hover:bg-[#76FF03] text-white hover:text-[#050B05] flex items-center justify-center backdrop-blur-md transition-all z-20 cursor-pointer shadow-lg active:scale-95 border-0"
                aria-label="Slide siguiente"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* Progress Dots */}
              <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/70 backdrop-blur-md">
                {visibleSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      setCurrentSlideIndex(idx);
                    }}
                    aria-label={`Ir a diapositiva ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIndex
                        ? 'w-5 sm:w-6 bg-[#76FF03]'
                        : 'w-1.5 bg-white/30 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Slide Title Badge (Optional) */}
          {activeSlide.title && (
            <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-black/75 backdrop-blur-md text-[10px] sm:text-xs font-mono font-medium text-white shadow-md max-w-[65vw] truncate">
              {activeSlide.title}
            </div>
          )}
        </div>

        {/* Text Details & Interactive Link Below the Image */}
        <div className="space-y-3">
          <div
            onClick={onSelect}
            onMouseEnter={playHoverSound}
            className="inline-flex items-center gap-3 cursor-pointer group/title"
          >
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tight text-white group-hover/title:text-[#76FF03] transition-colors leading-none">
              {lang === 'es' ? discipline.titleEs : discipline.titleEn}
            </h3>
            <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white/10 group-hover:bg-[#76FF03] text-white group-hover:text-[#050B05] flex items-center justify-center transition-all duration-300 group-hover:rotate-45 flex-shrink-0 shadow-lg border-0">
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
  onSelectDiscipline,
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
    if (onSelectDiscipline) {
      onSelectDiscipline(item);
    } else {
      const target =
        projects.find((p) => p.id === item.targetProjectId) || projects[0];
      if (target) onSelectProject(target);
    }
  };

  return (
    <section
      id="work"
      className="py-16 sm:py-20 md:py-32 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto relative"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-20 space-y-4">
        {/* Category Pill Tag */}
        <div className="section-tag-pill">
          <span className="badge-dot" />
          <span>{lang === 'es' ? 'PORTAFOLIO' : 'PORTFOLIO'}</span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-6xl md:text-7xl font-black text-white uppercase italic tracking-tight leading-none">
          {lang === 'es' ? 'PORTAFOLIO & ESPECIALIDADES' : 'PORTFOLIO & DISCIPLINES'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl font-normal leading-relaxed">
          {lang === 'es'
            ? 'Explora las disciplinas clave y la colección de proyectos 3D, branding y producción visual creados por Aylin Daniela Flores.'
            : 'Explore key creative disciplines and the showcase of 3D, branding, and visual productions crafted by Aylin Daniela Flores.'}
        </p>
      </div>

      {/* 4 Hero Discipline Showcase Sections with Interactive Sliders */}
      <div className="space-y-16 sm:space-y-28">
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
      <div className="my-16 sm:my-32">
        <div className="w-full h-px bg-white/5 mb-12 sm:mb-16" />

        {/* Centered Catalog Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#76FF03] uppercase block mb-2">
            {lang === 'es' ? 'TODAS LAS PRODUCCIONES' : 'ALL PRODUCTIONS'}
          </span>
          <h3 className="text-3xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tight text-white leading-none">
            {lang === 'es' ? 'CATÁLOGO DE PROYECTOS' : 'PROJECTS CATALOG'}
          </h3>
        </div>

        {/* 4-Column Grid: Closer Gap (gap-4 sm:gap-5), Larger Ratio (aspect-[16/10]), Flat borderless cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {projects
            .filter((p) => p.visibleInCatalog !== false)
            .map((project) => {
            const media = getProjectPrimaryMedia(project);
            const customImage = project.image && project.image.trim() ? project.image.trim() : '';
            const displayMediaSrc =
              customImage
                ? customImage
                : media.type === 'gif'
                ? media.gifSrc || getCategoryFallbackImage(project.category)
                : media.hasVideo && media.thumbnailUrl
                ? media.thumbnailUrl
                : getCategoryFallbackImage(project.category);

            return (
              <div
                key={project.id}
                onClick={() => {
                  playClickSound();
                  onSelectProject(project);
                }}
                onMouseEnter={playHoverSound}
                className="group cursor-pointer flex flex-col"
              >
                {/* Refined Image Card (Flat borderless, aspect-[16/10]) */}
                <div className="relative aspect-[16/10] w-full rounded-[8px] overflow-hidden bg-[#081208] shadow-[0_8px_24px_rgba(0,0,0,0.6)] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.9)] transition-all duration-500 flex items-center justify-center p-3 sm:p-3.5">
                  {/* Media Type Badges */}
                  {media.hasMultipleVideos ? (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-[#76FF03] font-mono text-[9px] font-bold tracking-wider shadow">
                      <Film className="w-2.5 h-2.5 text-[#76FF03]" />
                      <span>2 VIDEOS (YT + MP4)</span>
                    </div>
                  ) : media.hasVideo ? (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-[#76FF03] font-mono text-[9px] font-bold tracking-wider shadow">
                      <Play className="w-2.5 h-2.5 fill-[#76FF03]" />
                      <span>{media.type === 'youtube' ? 'VIDEO / YT' : 'CLIP MP4'}</span>
                    </div>
                  ) : null}

                  {media.type === 'gif' && (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-cyan-300 font-mono text-[9px] font-bold tracking-wider shadow">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>GIF</span>
                    </div>
                  )}

                  {/* Play Button Overlay on Hover for Videos */}
                  {media.hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="w-10 h-10 rounded-full bg-[#76FF03] text-black flex items-center justify-center shadow-[0_0_20px_rgba(118,255,3,0.8)] transform group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                      </div>
                    </div>
                  )}

                  <img
                    src={displayMediaSrc}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      const fallback = getCategoryFallbackImage(project.category);
                      e.currentTarget.src = fallback;
                    }}
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorksBentoGrid;
