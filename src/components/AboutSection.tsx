import React, { useState } from 'react';
import { Box, Sparkles, PenTool, Video, Award, Compass } from 'lucide-react';
import { Language } from '../types';
import { translations, skillCategoriesData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audio';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState<string>(skillCategoriesData[0].id);

  const currentCategory = skillCategoriesData.find(c => c.id === activeCategory) || skillCategoriesData[0];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case '3d-modeling':
        return <Box className="w-5 h-5" />;
      case 'branding':
        return <Award className="w-5 h-5" />;
      case 'illustration':
        return <PenTool className="w-5 h-5" />;
      case 'motion':
        return <Video className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="about" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#76FF03]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
        {/* Left: Professional Portrait Frame */}
        <div className="lg:col-span-5 relative group">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#38B000] to-[#76FF03] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

          <div className="glass-panel p-2.5 rounded-2xl relative z-10 overflow-hidden shadow-2xl">
            <div className="relative overflow-hidden rounded-xl bg-[#081008]">
              <img
                src="https://lh3.googleusercontent.com/aida/AP1WRLvxeIHRvpbdLpeUScKUJ5xTQW7Yq9K0PAFaMTMshS6gmcYiyYK1vopOlC14dLTowETVvN4D3tCgyPOk5XIk3RC_Y7oRZALojwqzWl99WlrxGX81O-F-5cAfOkwiroDu2Vg46gPH9NrXFJhqB2Gnas4F0uAXNlLtkO3HreiYkn9OGpsf0XDHgmu2PZGyh5DsnTyQOnemj2OphXYzsp1_NfIBIyJbnIPU4m1a44RVkm6ADrFN-3Q76fz_eVvF"
                alt="Aylin Daniela Flores - Senior Graphic Designer & 3D Modeler"
                className="w-full h-auto object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-102"
              />

              {/* Location Tag */}
              <div className="absolute bottom-4 left-4 right-4 glass-panel-heavy p-3 rounded-xl flex items-center justify-between border border-white/20">
                <div>
                  <span className="text-[10px] font-mono text-[#76FF03] font-bold block uppercase tracking-widest">
                    {t.about.basedIn}
                  </span>
                  <span className="text-sm font-black text-white font-mono">
                    {t.about.location}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#76FF03]/20 border border-[#76FF03]/50 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-[#76FF03]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Bio & Creative Statement */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#76FF03]" />
            <span className="text-xs font-bold tracking-[0.25em] text-[#76FF03] uppercase font-mono">
              CREATIVE PROFILE & MASTERY
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none">
            {t.about.titleSub}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#76FF03] via-[#A3E635] to-[#38B000]">
              {t.about.titleHighlight}
            </span>{' '}
            {t.about.titleEnd}
          </h2>

          <p className="text-base md:text-lg text-gray-300 leading-relaxed border-l-2 border-[#76FF03] pl-6 py-1">
            {t.about.bio}
          </p>

          <p className="text-sm text-gray-400 leading-relaxed">
            With a multidisciplinary foundation covering photorealistic 3D modeling, high-poly sculpting, automotive topology, and holistic brand systems, I bridge the gap between creative visual artistry and real-world brand impact.
          </p>

          {/* Software Stack Badges */}
          <div className="pt-2">
            <span className="text-xs font-mono text-gray-400 block mb-3 uppercase tracking-wider">
              TECH & SOFTWARE STACK
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Blender 4.x',
                'Cinema 4D',
                'Substance 3D',
                'Octane / Redshift',
                'ZBrush',
                'Adobe Illustrator',
                'Photoshop',
                'After Effects',
                'Figma',
                'WebGL 3D',
              ].map(tool => (
                <span
                  key={tool}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#76FF03]/50 text-xs font-mono text-gray-200 hover:text-white transition-colors"
                >
                  {tool}
                </span>
              ))}
            </div>
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
                <button
                  key={cat.id}
                  onClick={() => {
                    playClickSound();
                    setActiveCategory(cat.id);
                  }}
                  onMouseEnter={playHoverSound}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#76FF03] text-[#050B05] shadow-[0_0_20px_rgba(118,255,3,0.4)]'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.name.split(' ')[0]}</span>
                </button>
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
