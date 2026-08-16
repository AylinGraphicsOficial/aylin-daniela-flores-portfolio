import React, { useState } from 'react';
import { Box, Sparkles, PenTool, Video, Award, Compass } from 'lucide-react';
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

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState<string>(skillCategoriesData[0].id);

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
    <section id="about" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#76FF03]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Orbit Section: Aylin's Portrait with 3D Project Assets in Orbit */}
      <div className="w-full max-w-4xl mx-auto mb-12 flex flex-col items-center">
        <div className="w-full relative py-4">
          <OrbitImages
            images={orbitImagesList}
            altPrefix="Aylin Flores 3D Project"
            shape="ellipse"
            baseWidth={1000}
            radiusX={460}
            radiusY={175}
            rotation={-6}
            duration={22}
            itemSize={135}
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
                />
              </div>
            }
          />
        </div>
      </div>

      {/* Bio & Professional Statement Centered Below Orbit */}
      <div className="w-full max-w-4xl mx-auto space-y-6 text-center mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mx-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#76FF03]" />
          <span className="text-xs font-bold tracking-[0.25em] text-[#76FF03] uppercase font-mono">
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
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-gray-300">
          <Compass className="w-4 h-4 text-[#76FF03]" />
          <span className="text-gray-400 uppercase">{t.about.basedIn}:</span>
          <span className="text-white font-bold">{t.about.location}</span>
        </div>

        {/* Software Stack Badges */}
        <div className="pt-4 flex flex-col items-center">
          <span className="text-xs font-mono text-gray-400 block mb-3 uppercase tracking-wider">
            {lang === 'es' ? 'HERRAMIENTAS & SOFTWARE DOMINADO' : 'TECH & SOFTWARE STACK'}
          </span>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
            {[
              'Adobe Illustrator',
              'Adobe Photoshop',
              'Adobe After Effects',
              'Blender 3D',
              'ZBrush',
              'CapCut',
              'DaVinci Resolve',
              'Canva',
              'Pre-prensa (CMYK)',
              'Microsoft Excel',
            ].map(tool => (
              <span
                key={tool}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#76FF03]/50 text-xs font-mono text-gray-200 hover:text-white transition-colors"
              >
                {tool}
              </span>
            ))}
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
