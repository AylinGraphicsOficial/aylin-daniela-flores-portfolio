import React, { useState, useEffect } from 'react';
import { Box, Sparkles, PenTool, Video, Award, Compass, Cpu } from 'lucide-react';
import { Language } from '../types';
import { translations, skillCategoriesData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';
import { OrbitImages } from './OrbitImages';
import {
  getStoredAbout,
  subscribeToPortfolioChanges,
  AboutSectionData,
} from '../utils/portfolioStorage';

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
  const [aboutData, setAboutData] = useState<AboutSectionData>(getStoredAbout);
  const [activeCategory, setActiveCategory] = useState<string>(skillCategoriesData[0].id);
  const [hoveredSoftwareId, setHoveredSoftwareId] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setAboutData(getStoredAbout());
    };
    handleUpdate();
    const unsubscribe = subscribeToPortfolioChanges(handleUpdate);
    return () => unsubscribe();
  }, []);

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

  const bioText = lang === 'es' ? (aboutData.bioEs || t.about.bio) : (aboutData.bioEn || t.about.bio);
  const locationText = aboutData.location || t.about.location;
  const photoUrl = aboutData.photo || '/images/fotografia-aylin.png';

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
                  src={photoUrl}
                  alt={`${aboutData.name || 'Aylin Daniela Flores'} - ${aboutData.title || 'Diseñadora Gráfica'}`}
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
          {bioText}
        </p>

        {/* Location Tag */}
        <div className="section-tag-pill mx-auto tracking-normal">
          <Compass className="badge-icon" />
          <span className="text-gray-300 font-normal uppercase">{t.about.basedIn}:</span>
          <span className="text-white font-bold">{locationText}</span>
        </div>

        {/* Softwares Dominados - 7 Arcade Cards */}
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
                      : 'linear-gradient(180deg, rgba(8, 18, 8, 0.8) 0%, rgba(5, 11, 5, 0.9) 100%)',
                  }}
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center p-2.5 mb-2 group-hover:scale-110 transition-transform">
                    <img
                      src={software.logo}
                      alt={software.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-0.5 mb-2">
                    <h4 className="text-xs md:text-sm font-black text-white group-hover:text-[#76FF03] transition-colors leading-tight truncate max-w-full">
                      {software.shortName}
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400 block truncate">
                      {lang === 'es' ? software.roleEs : software.roleEn}
                    </span>
                  </div>

                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#76FF03] rounded-full"
                      style={{ width: `${software.proficiency}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
