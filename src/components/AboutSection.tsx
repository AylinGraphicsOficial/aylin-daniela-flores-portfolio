import React, { useState } from 'react';
import { Box, Sparkles, PenTool, Video, Award, Compass, Cpu } from 'lucide-react';
import { Language } from '../types';
import { translations, skillCategoriesData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';

import { OrbitImages } from './OrbitImages';

interface AboutSectionProps {
  lang: Language;
}

const orbitImagesList = [
  '/images/orbit-carrito.png',
  '/images/orbit-stand.webp',
  '/images/orbit-tablet.webp',
  '/images/orbit-stand-diana.webp',
];

const softwaresData = [
  {
    id: 'illustrator',
    name: 'Adobe Illustrator',
    shortName: 'Illustrator',
    logo: '/images/softwares/ai.svg',
    roleEs: 'Diseño Vectorial & Branding',
    roleEn: 'Vector Design & Branding',
    proficiency: 98,
    levelEs: 'Experto',
    levelEn: 'Expert',
    glowColor: 'rgba(253, 153, 0, 0.45)',
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    shortName: 'Photoshop',
    logo: '/images/softwares/ps.svg',
    roleEs: 'Edición & Composición',
    roleEn: 'Digital Editing & Compositing',
    proficiency: 96,
    levelEs: 'Experto',
    levelEn: 'Expert',
    glowColor: 'rgba(49, 168, 255, 0.45)',
  },
  {
    id: 'after-effects',
    name: 'Adobe After Effects',
    shortName: 'After Effects',
    logo: '/images/softwares/ae.svg',
    roleEs: 'Motion Graphics & VFX',
    roleEn: 'Motion Graphics & VFX',
    proficiency: 92,
    levelEs: 'Avanzado',
    levelEn: 'Advanced',
    glowColor: 'rgba(153, 153, 255, 0.45)',
  },
  {
    id: 'blender',
    name: 'Blender 3D',
    shortName: 'Blender',
    logo: '/images/softwares/blender.webp',
    roleEs: 'Modelado 3D & Shading',
    roleEn: '3D Modeling & Shading',
    proficiency: 94,
    levelEs: 'Avanzado',
    levelEn: 'Advanced',
    glowColor: 'rgba(234, 118, 0, 0.45)',
  },
  {
    id: 'davinci',
    name: 'DaVinci Resolve',
    shortName: 'DaVinci Resolve',
    logo: '/images/softwares/davinci.webp',
    roleEs: 'Color Grading & Montaje',
    roleEn: 'Color Grading & Post',
    proficiency: 88,
    levelEs: 'Avanzado',
    levelEn: 'Advanced',
    glowColor: 'rgba(255, 85, 85, 0.45)',
  },
  {
    id: 'capcut',
    name: 'CapCut',
    shortName: 'CapCut',
    logo: '/images/softwares/capcut.svg',
    roleEs: 'Edición Ágil & Social Media',
    roleEn: 'Fast-Paced Social Video',
    proficiency: 95,
    levelEs: 'Experto',
    levelEn: 'Expert',
    glowColor: 'rgba(118, 255, 3, 0.45)',
  },
  {
    id: 'canva',
    name: 'Canva',
    shortName: 'Canva',
    logo: '/images/softwares/canva.webp',
    roleEs: 'Prototipado & Plantillas',
    roleEn: 'Brand Kits & Rapid Assets',
    proficiency: 95,
    levelEs: 'Experto',
    levelEn: 'Expert',
    glowColor: 'rgba(0, 196, 204, 0.45)',
  },
];

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState<string>(skillCategoriesData[0].id);
  const [hoveredSoftwareId, setHoveredSoftwareId] = useState<string | null>(null);

  const currentCategory = skillCategoriesData.find(c => c.id === activeCategory) || skillCategoriesData[0];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case '3d-modeling':
        return <Box className="w-5 h-5" />;
      case 'branding':
      case 'branding-graphic':
        return <Award className="w-5 h-5" />;
      case 'illustration':
        return <PenTool className="w-5 h-5" />;
      case 'motion':
      case 'video-motion':
        return <Video className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="about" className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#76FF03]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Orbit Section: Aylin's Portrait with 3D Project Assets in Orbit */}
      <div className="w-full max-w-4xl mx-auto mb-4 flex flex-col items-center">
        <div className="w-full relative">
          <OrbitImages
            images={orbitImagesList}
            altPrefix="Aylin Flores 3D Project"
            shape="ellipse"
            baseWidth={1000}
            baseHeight={540}
            radiusX={460}
            radiusY={175}
            rotation={-6}
            duration={22}
            itemSize={142}
            showPath={true}
            pathColor="rgba(118, 255, 3, 0.45)"
            pathWidth={2.5}
            responsive={true}
            centerContent={
              <div className="relative w-56 sm:w-64 md:w-80 lg:w-96 aspect-[3/4] flex items-center justify-center select-none pointer-events-none">
                {/* Radial Glow */}
                <div className="absolute inset-0 bg-[#76FF03]/25 rounded-full blur-[85px] pointer-events-none animate-pulse-glow" />
                <img
                  src="/images/fotografia-aylin.png"
                  alt="Aylin Daniela Flores Calles - Diseñadora Gráfica & Modeladora 3D"
                  width={800}
                  height={1067}
                  className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_20px_rgba(118,255,3,0.25)]"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 65%, rgba(0,0,0,0.7) 80%, transparent 98%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 65%, rgba(0,0,0,0.7) 80%, transparent 98%)',
                  }}
                />
              </div>
            }
          />
        </div>
      </div>

      {/* Bio & Professional Statement Centered Below Orbit */}
      <div className="w-full max-w-4xl mx-auto space-y-6 text-center mb-10">
        <div className="section-tag-pill mx-auto">
          <span className="badge-dot" />
          <span>
            {lang === 'es' ? 'PERFIL PROFESIONAL' : 'CREATIVE PROFILE & MASTERY'}
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none">
          {t.about.titleSub}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#76FF03] via-[#A3E635] to-[#38B000]">
            {t.about.titleHighlight}
          </span>{' '}
          {t.about.titleEnd}
        </h2>

        <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto border-y border-[#76FF03]/30 py-4 font-normal">
          {t.about.bio}
        </p>

        <p className="text-sm text-gray-400 leading-relaxed max-w-3xl mx-auto">
          {lang === 'es'
            ? 'Con sólida formación en la Universidad de El Salvador y dominio de herramientas de diseño profesional, modelado 3D y edición audiovisual, transformo ideas en identidades visuales impactantes, artes finales con fidelidad cromática y contenido que cautiva audiencias.'
            : 'Backed by academic training at Universidad de El Salvador and mastery in professional design, 3D modeling, and audiovisual postproduction, I transform ideas into striking visual identities, print-ready files, and compelling digital content.'}
        </p>

        {/* Location Tag */}
        <div className="section-tag-pill mx-auto tracking-normal">
          <Compass className="badge-icon" />
          <span className="text-gray-300 font-normal uppercase">{t.about.basedIn}:</span>
          <span className="text-white font-bold">{t.about.location}</span>
        </div>

        {/* Softwares Dominados - 7 Arcade Cards directly below Location Tag (No bottom detail box) */}
        <div className="w-full pt-10 pb-2">
          <div className="flex flex-col items-center text-center mb-8 space-y-2">
            <div className="section-tag-pill">
              <Cpu className="badge-icon" />
              <span>{lang === 'es' ? 'SOFTWARES DOMINADOS' : 'MASTERED SOFTWARE'}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              {lang === 'es' ? 'Herramientas & Software ' : 'Technical & Creative '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#76FF03] via-[#A3E635] to-[#38B000]">
                {lang === 'es' ? 'Profesional' : 'Stack'}
              </span>
            </h3>
            <p className="text-xs md:text-sm text-gray-300 max-w-xl">
              {lang === 'es'
                ? 'Dominio técnico y creativo en herramientas de diseño gráfico, modelado 3D, animación y postproducción audiovisual.'
                : 'Technical and creative mastery across graphic design, 3D modeling, animation, and audiovisual post-production.'}
            </p>
          </div>

          {/* 7 Software Arcade Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-3.5 max-w-6xl mx-auto">
            {softwaresData.map((software) => {
              const isHovered = hoveredSoftwareId === software.id;
              return (
                <div
                  key={software.id}
                  onMouseEnter={() => {
                    playHoverSound();
                    setHoveredSoftwareId(software.id);
                  }}
                  onMouseLeave={() => setHoveredSoftwareId(null)}
                  onClick={playClickSound}
                  className={`arcade-card group relative p-3.5 md:p-4 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer select-none ${
                    isHovered
                      ? 'border-[#76FF03] shadow-[0_0_25px_rgba(118,255,3,0.35)] -translate-y-2 scale-[1.03] z-20'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  style={{
                    background: isHovered
                      ? 'linear-gradient(180deg, rgba(12, 28, 12, 0.95) 0%, rgba(5, 11, 5, 0.98) 100%)'
                      : 'linear-gradient(180deg, rgba(8, 18, 8, 0.82) 0%, rgba(4, 10, 4, 0.9) 100%)',
                  }}
                >
                  {/* Neon Top Edge Highlight on Hover */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#76FF03] to-transparent transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Software Logo Container */}
                  <div className="w-14 h-14 md:w-16 md:h-16 mb-2.5 flex items-center justify-center relative">
                    <div
                      className="absolute inset-0 rounded-2xl blur-lg transition-opacity duration-300 pointer-events-none"
                      style={{
                        backgroundColor: software.glowColor,
                        opacity: isHovered ? 0.65 : 0.15,
                      }}
                    />
                    <img
                      src={software.logo}
                      alt={software.name}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                      loading="lazy"
                    />
                  </div>

                  {/* Software Name */}
                  <div className="space-y-0.5 w-full mb-2.5">
                    <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-tight leading-tight group-hover:text-[#76FF03] transition-colors">
                      {software.shortName}
                    </h4>
                    <p className="text-[10px] font-mono text-gray-400 leading-snug line-clamp-2">
                      {lang === 'es' ? software.roleEs : software.roleEn}
                    </p>
                  </div>

                  {/* Proficiency Metric Pill */}
                  <div className="w-full pt-1.5 border-t border-white/10 flex items-center justify-between font-mono text-[9px] sm:text-[10px]">
                    <span className="text-gray-400 font-medium">
                      {lang === 'es' ? software.levelEs : software.levelEn}
                    </span>
                    <span className="text-[#76FF03] font-bold">
                      {software.proficiency}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Core Capabilities & Skills Breakdown */}
      <div className="mt-12 glass-panel p-6 md:p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4 pb-6 border-b border-white/10">
          <div>
            <h3 className="text-xs font-bold text-[#76FF03] uppercase tracking-widest font-mono mb-1">
              {t.about.skillsTabTitle}
            </h3>
            <h4 className="text-2xl font-black text-white uppercase tracking-tight">
              {currentCategory.name}
            </h4>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              {currentCategory.description}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {skillCategoriesData.map(cat => {
              const isSelected = activeCategory === cat.id;
              return (
                <SpecularButton
                  key={cat.id}
                  onClick={() => {
                    playClickSound();
                    setActiveCategory(cat.id);
                  }}
                  onMouseEnter={playHoverSound}
                  variant={isSelected ? 'solid-lime' : 'glass'}
                  size="sm"
                  radius={12}
                  className="text-xs font-bold"
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.name.split(' ')[0]}</span>
                </SpecularButton>
              );
            })}
          </div>
        </div>

        {/* Skill Bars for Active Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentCategory.skills.map(skill => (
            <div key={skill.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{skill.name}</span>
                  {skill.isHighlight && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#38B000]/30 text-[#76FF03] border border-[#38B000]">
                      PRIMARY
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-[#76FF03] font-bold">
                  {skill.level}%
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#38B000] to-[#76FF03] rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_#76FF03]"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-gray-400 font-mono pt-1">
                <span>Experience: {skill.experience}</span>
                <span>Production-ready</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
