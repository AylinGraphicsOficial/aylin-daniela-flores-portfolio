import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Project, Language } from '../types';
import { projectsData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audio';

interface WorksBentoGridProps {
  lang: Language;
  onSelectProject: (project: Project) => void;
}

interface DisciplineItem {
  id: string;
  number: string;
  verticalTextEs: string;
  verticalTextEn: string;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  descEs: string;
  descEn: string;
  image: string;
  targetProjectId: string;
}

export const WorksBentoGrid: React.FC<WorksBentoGridProps> = ({
  lang,
  onSelectProject,
}) => {
  const disciplines: DisciplineItem[] = [
    {
      id: 'modelado-3d',
      number: '01',
      verticalTextEs: 'MODELADO 3D & RENDERIZADO CGI',
      verticalTextEn: '3D MODELING & CGI RENDERING',
      titleEs: 'MODELADO 3D',
      titleEn: '3D MODELING',
      subtitleEs: 'DISEÑO & VISUALIZACIÓN COMERCIAL',
      subtitleEn: 'COMMERCIAL DESIGN & 3D VISUALIZATION',
      descEs:
        'Creación de geometría 3D de alta fidelidad, modelado hard-surface, stands comerciales para exposiciones, texturizado PBR e iluminación fotográfica con Blender y Octane Render.',
      descEn:
        'High-fidelity 3D geometry creation, hard-surface modeling, commercial exhibition stands, PBR texturing, and photorealistic studio lighting with Blender and Octane Render.',
      image: '/images/orbit-stand.webp',
      targetProjectId: 'orbit-stand-exhibition',
    },
    {
      id: 'branding',
      number: '02',
      verticalTextEs: 'IDENTIDAD VISUAL & SISTEMAS DE MARCA',
      verticalTextEn: 'VISUAL IDENTITY & BRAND SYSTEMS',
      titleEs: 'BRANDING',
      titleEn: 'BRANDING',
      subtitleEs: 'DISEÑO DE IDENTIDAD & DIRECCIÓN DE ARTE',
      subtitleEn: 'IDENTITY DESIGN & ART DIRECTION',
      descEs:
        'Desarrollo integral de identidades corporativas, logotipos memorables, manuales de marca, empaques y universos visuales distintivos que posicionan marcas con autoridad en su industria.',
      descEn:
        'Comprehensive corporate brand identities, memorable logos, brand style guidelines, packaging, and distinctive visual ecosystems crafted to position brands ahead.',
      image: '/images/orbit-stand-diana.webp',
      targetProjectId: 'diana-brand-experience',
    },
    {
      id: 'edicion-video',
      number: '03',
      verticalTextEs: 'MOTION GRAPHICS & POST-PRODUCCIÓN',
      verticalTextEn: 'MOTION GRAPHICS & POST-PRODUCTION',
      titleEs: 'EDICIÓN DE VIDEO',
      titleEn: 'VIDEO EDITING',
      subtitleEs: 'MONTAJE CINEMATOGRÁFICO & RITMO VISUAL',
      subtitleEn: 'CINEMATIC EDITING & VISUAL PACING',
      descEs:
        'Edición audiovisual dinámica, corrección de color profesional, animación tipográfica y motion graphics con After Effects y Premiere Pro para spots publicitarios y campañas de alto impacto.',
      descEn:
        'Dynamic audiovisual editing, professional color grading, kinetic typography, and motion graphics with After Effects and Premiere Pro for commercials and high-converting campaigns.',
      image: '/images/diplomados/diplomado-after-effects-2023.webp',
      targetProjectId: 'motion-typography',
    },
    {
      id: 'social-media',
      number: '04',
      verticalTextEs: 'ESTRATEGIA VISUAL & CONTENIDO DIGITAL',
      verticalTextEn: 'VISUAL STRATEGY & DIGITAL CONTENT',
      titleEs: 'SOCIAL MEDIA DESIGNER',
      titleEn: 'SOCIAL MEDIA DESIGNER',
      subtitleEs: 'CONTENIDO DE ALTO ENGAGEMENT & DISEÑO DIGITAL',
      subtitleEn: 'HIGH-ENGAGEMENT CONTENT & DIGITAL DESIGN',
      descEs:
        'Diseño estratégico de piezas gráficas para redes sociales, carruseles de alto valor, creatividades publicitarias y feeds optimizados para maximizar la retención, interacción y conversiones.',
      descEn:
        'Strategic social media graphic design, high-value educational carousels, ad creatives, and optimized feeds designed to maximize audience retention, engagement, and conversion.',
      image: '/images/diplomados/diplomado 2-Taller-de-creacion-de-contenido-2025.webp',
      targetProjectId: 'orbit-tablet-visual',
    },
  ];

  const handleDisciplineClick = (item: DisciplineItem) => {
    playClickSound();
    const target =
      projectsData.find((p) => p.id === item.targetProjectId) || projectsData[0];
    onSelectProject(target);
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

      {/* 4 Hero Discipline Showcase Sections (Matching Wix Game Designer Style) */}
      <div className="space-y-20 sm:space-y-28">
        {disciplines.map((item) => (
          <div
            key={item.id}
            className="flex flex-row items-start gap-4 sm:gap-8 md:gap-12 group cursor-pointer"
            onClick={() => handleDisciplineClick(item)}
            onMouseEnter={playHoverSound}
          >
            {/* Left Side: Bold Italic Number + Vertical Label */}
            <div className="flex flex-col items-center flex-shrink-0 pt-2 w-10 sm:w-16">
              <span className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tighter text-white select-none leading-none">
                {item.number}
              </span>
              <span className="text-[9px] sm:text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-400 font-bold [writing-mode:vertical-rl] rotate-180 mt-6 sm:mt-10 select-none whitespace-nowrap">
                {lang === 'es' ? item.verticalTextEs : item.verticalTextEn}
              </span>
            </div>

            {/* Right Side: Main Representative Card + Typography */}
            <div className="flex-1 min-w-0">
              {/* Representative Large Rounded Card */}
              <div className="relative aspect-[16/8] sm:aspect-[16/7] md:aspect-[21/9] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#081208] border border-white/15 group-hover:border-[#76FF03]/70 group-hover:shadow-[0_25px_60px_rgba(118,255,3,0.2)] transition-all duration-500 flex items-center justify-center p-3 sm:p-5">
                <img
                  src={item.image}
                  alt={item.titleEs}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Below-Card Typography: Title + Arrow + Subtitle + Description */}
              <div className="mt-6 sm:mt-8">
                {/* Title & Arrow Row */}
                <div className="flex items-center gap-3 sm:gap-5">
                  <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors leading-tight">
                    {lang === 'es' ? item.titleEs : item.titleEn}
                  </h3>
                  <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-white/20 group-hover:border-[#76FF03] group-hover:bg-[#76FF03] text-white group-hover:text-[#050B05] flex items-center justify-center transition-all duration-300 group-hover:rotate-45 flex-shrink-0 shadow-lg">
                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* Subtitle */}
                <span className="text-[11px] sm:text-xs md:text-sm font-mono font-bold tracking-widest text-[#76FF03] uppercase mt-2.5 mb-2 block">
                  {lang === 'es' ? item.subtitleEs : item.subtitleEn}
                </span>

                {/* Description */}
                <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-3xl leading-relaxed font-normal">
                  {lang === 'es' ? item.descEs : item.descEn}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider to Projects Catalog Grid */}
      <div className="my-24 sm:my-32">
        <div className="w-full h-px bg-white/15 mb-16" />

        <div className="mb-14">
          <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#76FF03] uppercase block mb-2">
            {lang === 'es' ? 'TODAS LAS PRODUCCIONES' : 'ALL PRODUCTIONS'}
          </span>
          <h3 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tight text-white leading-none">
            {lang === 'es' ? 'CATÁLOGO DE PROYECTOS' : 'PROJECTS CATALOG'}
          </h3>
        </div>

        {/* 2-Column Wix Game Designer Project Grid */}
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
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors leading-tight mb-1.5">
                  {project.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-400 font-normal tracking-wide">
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
