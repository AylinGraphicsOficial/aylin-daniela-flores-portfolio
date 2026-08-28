import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, MoveRight, Layers, ArrowUpRight } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { key: 'ALL', labelEs: 'TODOS', labelEn: 'ALL' },
    { key: '3D MODELING', labelEs: 'MODELADO 3D', labelEn: '3D MODELING' },
    { key: 'BRANDING', labelEs: 'BRANDING', labelEn: 'BRANDING' },
    { key: 'DIGITAL ART', labelEs: 'ARTE DIGITAL', labelEn: 'DIGITAL ART' },
    { key: 'MOTION', labelEs: 'VIDEO & MOTION', labelEn: 'VIDEO & MOTION' },
  ];

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesCategory =
        activeCategory === 'ALL' || project.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.client.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#050B05] text-white pt-24 pb-28 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#76FF03]/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Navigation Row */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-10 md:mb-14">
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
            {filteredProjects.length} {lang === 'es' ? 'PROYECTOS' : 'PROJECTS'}
          </span>
        </div>
      </div>

      {/* Main Wix-Inspired Header */}
      <div className="max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/15">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#76FF03] uppercase block mb-2">
              {lang === 'es' ? 'CATÁLOGO DE TRABAJOS DESTACADOS' : 'FEATURED WORKS CATALOG'}
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase italic tracking-tight text-white leading-none">
              {lang === 'es' ? 'PORTAFOLIO' : 'PORTFOLIO'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md font-medium leading-relaxed">
            {lang === 'es'
              ? 'Explora la colección completa de renders 3D, identidades de marca, empaques y producciones comerciales creadas por Aylin Daniela Flores.'
              : 'Explore the full showcase of 3D renders, brand identities, packaging, and commercial visual productions by Aylin Daniela Flores.'}
          </p>
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveCategory(cat.key);
                  }}
                  onMouseEnter={playHoverSound}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#76FF03] text-[#050B05] shadow-[0_0_20px_rgba(118,255,3,0.5)] scale-105'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {lang === 'es' ? cat.labelEs : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'es' ? 'Buscar proyectos...' : 'Search projects...'}
              className="w-full bg-[#081208] border border-white/15 focus:border-[#76FF03] text-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-[#76FF03] transition-all placeholder:text-gray-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* 2-Column Wix Game Designer Project Grid Layout */}
      <div className="max-w-7xl mx-auto">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10">
            <Layers className="w-12 h-12 text-[#76FF03] mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === 'es' ? 'No se encontraron proyectos' : 'No projects found'}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {lang === 'es'
                ? 'Intenta con otro término de búsqueda o selecciona otra categoría.'
                : 'Try adjusting your search or category filter.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('ALL');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#76FF03] text-[#050B05] text-xs font-bold rounded-xl"
            >
              {lang === 'es' ? 'Restablecer Filtros' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  playClickSound();
                  onSelectProject(project);
                }}
                onMouseEnter={playHoverSound}
                className="group cursor-pointer flex flex-col transition-all duration-300"
              >
                {/* Visual Card Image Box (Wix-style large rounded rectangle) */}
                <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#081208] border border-white/15 group-hover:border-[#76FF03]/70 group-hover:shadow-[0_15px_40px_rgba(118,255,3,0.18)] transition-all duration-500">
                  {/* Subtle dark ambient gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050B05]/80 via-transparent to-[#050B05]/30 z-10 opacity-70 group-hover:opacity-40 transition-opacity" />

                  {/* Artwork Image */}
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Floating Category & Year Badges */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#050B05]/90 backdrop-blur-md border border-[#76FF03]/50 text-[#76FF03] text-[10px] font-mono font-bold rounded-full shadow-lg">
                      {project.category}
                    </span>
                    <span className="px-2.5 py-1 bg-[#050B05]/90 backdrop-blur-md border border-white/15 text-gray-300 text-[10px] font-mono rounded-full">
                      {project.year}
                    </span>
                  </div>

                  {/* Hover Inspect Action Button (Top-Right) */}
                  <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#050B05]/85 backdrop-blur-md border border-white/20 group-hover:border-[#76FF03] group-hover:bg-[#76FF03] text-white group-hover:text-[#050B05] flex items-center justify-center transition-all duration-300 shadow-xl group-hover:rotate-45">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Below-Card Typography (Title in Bold Italic + Subtitle / Role) */}
                <div className="mt-5 px-1">
                  <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm font-medium text-gray-400">
                    <span>{project.client}</span>
                    <span>•</span>
                    <span className="text-gray-300">
                      {project.tags.slice(0, 3).join(', ')}
                    </span>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed font-normal">
                    {project.shortDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Call-To-Action Banner */}
      <div className="max-w-7xl mx-auto mt-24 pt-16 border-t border-white/15">
        <div className="glass-panel p-8 sm:p-12 md:p-16 rounded-3xl border border-[#76FF03]/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-gradient-to-r from-[#050B05] via-[#081A08] to-[#050B05]">
          {/* Radial glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#76FF03]/15 rounded-full blur-[100px] pointer-events-none" />

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
