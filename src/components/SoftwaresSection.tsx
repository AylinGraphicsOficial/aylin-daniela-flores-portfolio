import React, { useState } from 'react';
import { Language } from '../types';
import { playHoverSound, playClickSound } from '../utils/audio';
import { Cpu, CheckCircle2, Sparkles, Award } from 'lucide-react';

interface SoftwaresSectionProps {
  lang: Language;
}

interface SoftwareItem {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  roleEs: string;
  roleEn: string;
  descEs: string;
  descEn: string;
  proficiency: number;
  levelEs: string;
  levelEn: string;
  glowColor: string;
}

const softwaresData: SoftwareItem[] = [
  {
    id: 'illustrator',
    name: 'Adobe Illustrator',
    shortName: 'Illustrator',
    logo: '/images/softwares/ai.svg',
    roleEs: 'Diseño Vectorial & Branding',
    roleEn: 'Vector Design & Branding',
    descEs: 'Creación de identidades de marca, isotipos, tipografía vectorial, señalética y artes finales para impresión de alta precisión.',
    descEn: 'Brand identities, vector logotypes, typography, iconography, and high-precision print-ready assets.',
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
    descEs: 'Fotocomposición avanzada, retoque digital de alta fidelidad, mapas de textura y preparación técnica en perfiles de color.',
    descEn: 'Advanced composite art, high-end photo retouching, texture mapping, and CMYK/RGB technical color profiling.',
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
    descEs: 'Animación cinética 2D/3D, tipografía dinámica, efectos visuales (VFX), compositing y piezas audiovisuales de alto impacto.',
    descEn: 'Kinetic 2D/3D animation, dynamic typography, visual effects, compositing, and high-impact motion pieces.',
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
    descEs: 'Modelado poligonal y hard-surface, topología limpia, texturizado procedural e iluminación con motores Cycles y Eevee.',
    descEn: 'Polygonal and hard-surface 3D modeling, clean topology, procedural shading, and Cycles/Eevee photoreal rendering.',
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
    descEs: 'Corrección de color cinematográfica, etalonaje profesional en curvas/nodos y montaje de secuencias con fidelidad de audio.',
    descEn: 'Cinematic color correction, professional node-based color grading, and broadcast-quality sequence assembly.',
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
    descEs: 'Creación de micro-contenido dinámico para Reels, Shorts y TikTok con transiciones kinetic y ritmo de retención.',
    descEn: 'Dynamic short-form video production for Reels, Shorts, and TikTok with kinetic pacing and high viewer retention.',
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
    descEs: 'Kits de marca interactivos, plantillas estandarizadas para equipos comerciales y prototipos rápidos de redes sociales.',
    descEn: 'Interactive brand kits, standardized marketing templates for client teams, and rapid social media collateral.',
    proficiency: 95,
    levelEs: 'Experto',
    levelEn: 'Expert',
    glowColor: 'rgba(0, 196, 204, 0.45)',
  },
];

export const SoftwaresSection: React.FC<SoftwaresSectionProps> = ({ lang }) => {
  const isEs = lang === 'es';
  const [activeSoftwareId, setActiveSoftwareId] = useState<string | null>(null);

  const activeSoftware = softwaresData.find((s) => s.id === activeSoftwareId);

  return (
    <section
      id="softwares"
      className="w-full py-16 md:py-24 relative border-t border-white/10 overflow-hidden"
      aria-label={isEs ? 'Softwares dominados' : 'Mastered software tools'}
    >
      {/* Ambient kinetic background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-[#76FF03]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#38B000]/6 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          {/* Badge with white text and neon green hover glow */}
          <div className="section-tag-pill">
            <Cpu className="badge-icon" />
            <span>{isEs ? 'SOFTWARES DOMINADOS' : 'MASTERED SOFTWARE'}</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none max-w-3xl">
            {isEs ? 'Herramientas & Software ' : 'Technical & Creative '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#76FF03] via-[#A3E635] to-[#38B000]">
              {isEs ? 'Profesional' : 'Stack'}
            </span>
          </h2>

          <p className="text-sm md:text-base text-gray-300 max-w-2xl font-medium tracking-wide">
            {isEs
              ? 'Dominio técnico y creativo en herramientas de diseño gráfico, modelado 3D, animación y postproducción audiovisual.'
              : 'Technical and creative mastery across graphic design, 3D modeling, animation, and audiovisual post-production.'}
          </p>
        </div>

        {/* 7 Interactive Software Cards in Line */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 md:gap-4 lg:gap-4">
          {softwaresData.map((software) => {
            const isHovered = activeSoftwareId === software.id;

            return (
              <div
                key={software.id}
                onMouseEnter={() => {
                  playHoverSound();
                  setActiveSoftwareId(software.id);
                }}
                onMouseLeave={() => setActiveSoftwareId(null)}
                onClick={() => {
                  playClickSound();
                  setActiveSoftwareId(software.id);
                }}
                className={`arcade-card group relative p-4 md:p-5 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer select-none ${
                  isHovered
                    ? 'border-[#76FF03] shadow-[0_0_30px_rgba(118,255,3,0.35)] -translate-y-2 scale-[1.03] z-20'
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
                <div className="w-16 h-16 md:w-20 md:h-20 mb-3.5 flex items-center justify-center relative">
                  {/* Subtle Logo Radial Glow */}
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
                    className="w-14 h-14 md:w-16 md:h-16 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                    loading="lazy"
                  />
                </div>

                {/* Software Name */}
                <div className="space-y-1 w-full mb-3">
                  <h3 className="text-sm md:text-base font-black text-white uppercase tracking-tight leading-tight group-hover:text-[#76FF03] transition-colors">
                    {software.shortName}
                  </h3>
                  <p className="text-[11px] font-mono text-gray-400 leading-snug line-clamp-2">
                    {isEs ? software.roleEs : software.roleEn}
                  </p>
                </div>

                {/* Proficiency Metric Pill */}
                <div className="w-full pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-gray-400 font-medium">
                    {isEs ? software.levelEs : software.levelEn}
                  </span>
                  <span className="text-[#76FF03] font-bold">
                    {software.proficiency}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Detail Card Box when hovering/clicking on a software */}
        <div className="mt-8 p-5 md:p-6 rounded-2xl glass-panel border border-white/10 relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 flex-shrink-0">
                <img
                  src={activeSoftware ? activeSoftware.logo : softwaresData[0].logo}
                  alt={activeSoftware ? activeSoftware.name : softwaresData[0].name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                    {activeSoftware ? activeSoftware.name : softwaresData[0].name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-[#76FF03]/10 border border-[#76FF03]/30 text-[#76FF03] text-[10px] font-mono font-bold uppercase">
                    {activeSoftware
                      ? (isEs ? activeSoftware.levelEs : activeSoftware.levelEn)
                      : (isEs ? softwaresData[0].levelEs : softwaresData[0].levelEn)}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-3xl leading-relaxed">
                  {activeSoftware
                    ? (isEs ? activeSoftware.descEs : activeSoftware.descEn)
                    : (isEs ? softwaresData[0].descEs : softwaresData[0].descEn)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10 self-stretch md:self-auto justify-center">
              <Sparkles className="w-4 h-4 text-[#76FF03]" />
              <span>{isEs ? 'Pipeline de Producción Integrado' : 'Integrated Production Pipeline'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoftwaresSection;
