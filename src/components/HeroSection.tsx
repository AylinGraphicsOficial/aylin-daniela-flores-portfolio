import React, { useState } from 'react';
import { ArrowDown, Sparkles, FileText, MoveRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/portfolioData';
import { playClickSound } from '../utils/audio';

interface HeroSectionProps {
  lang: Language;
  onOpenCVModal: () => void;
  onOpenProjectPlanner: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onOpenCVModal,
  onOpenProjectPlanner,
}) => {
  const t = translations[lang];

  // Mouse tilt parallax for hero floating cards
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 20, y: y * 20 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex items-center px-4 md:px-8 max-w-7xl mx-auto overflow-hidden pt-24 md:pt-32 pb-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full relative z-10 items-center">
        {/* Left Column: Kinetic Text & CTAs */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-6">
            <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-ping" />
            <span className="text-[11px] font-bold font-mono tracking-widest text-[#76FF03] uppercase">
              {t.hero.badgeAvailable}
            </span>
          </div>

          <h2 className="text-xs md:text-sm font-bold tracking-[0.25em] text-[#76FF03] mb-2 uppercase">
            {t.hero.portfolioOf}
          </h2>

          {/* Main Giant Kinetic Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-black text-white tracking-tighter uppercase leading-[0.92] mb-6">
            <span>{t.hero.titleLine1}</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              {t.hero.titleLine2}
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#76FF03] to-[#38B000]">
              {t.hero.titleLine3}
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed font-normal">
            {t.hero.subtitle}
          </p>

          {/* CTA Group */}
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#work"
              onClick={playClickSound}
              className="px-8 py-4 bg-[#76FF03] hover:bg-[#50E310] text-[#050B05] font-black text-xs md:text-sm tracking-wider rounded-xl shadow-[0_0_25px_rgba(118,255,3,0.4)] hover:shadow-[0_0_35px_rgba(118,255,3,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-2"
            >
              <span>{t.hero.viewProjects}</span>
              <MoveRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                playClickSound();
                onOpenCVModal();
              }}
              className="px-6 py-4 border-2 border-white/20 hover:border-[#76FF03] text-white hover:text-[#76FF03] font-bold text-xs md:text-sm tracking-wider rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-[#76FF03]" />
              <span>{t.hero.downloadCv}</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onOpenProjectPlanner();
              }}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-[#76FF03]/40 text-[#76FF03] font-bold text-xs md:text-sm tracking-wider rounded-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.hero.startProjectBtn}</span>
            </button>
          </div>

          {/* Quick Metrics Ticker Under Hero */}
          <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
            <div>
              <div className="text-xl md:text-2xl font-black text-white font-mono">6+ YRS</div>
              <div className="text-[11px] text-gray-400 font-medium">Professional Experience</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-[#76FF03] font-mono">120+</div>
              <div className="text-[11px] text-gray-400 font-medium">3D Assets Rendered</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-white font-mono">100%</div>
              <div className="text-[11px] text-gray-400 font-medium">Original Craft</div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Interactive 3D Render Artworks */}
        <div className="lg:col-span-4 relative flex justify-center items-center min-h-[380px] lg:min-h-[480px]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-72 h-72 bg-[#76FF03]/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />

          {/* Primary Floating 3D Artwork Card */}
          <div
            className="relative z-20 w-full max-w-[360px] glass-panel p-3 rounded-2xl shadow-2xl transition-transform duration-200 ease-out animate-float-slow"
            style={{
              transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`,
            }}
          >
            <div className="relative overflow-hidden rounded-xl bg-[#081008] border border-white/10 group">
              <img
                src="/images/hero-hands.jpg"
                alt="3D Hands Visualization"
                width={512}
                height={298}
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#050B05]/80 backdrop-blur-md p-3 rounded-lg border border-white/10 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-[#76FF03] block">STUDY NO. 01</span>
                  <span className="text-xs font-bold text-white">Kinetic Touch Anatomy</span>
                </div>
                <span className="px-2 py-0.5 bg-[#38B000]/40 border border-[#76FF03] text-[10px] text-white font-mono rounded">
                  ZBRUSH / C4D
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Floating Offset Vehicle Card */}
          <div
            className="absolute -bottom-10 -right-4 lg:-right-10 z-10 w-3/4 max-w-[280px] glass-panel p-2.5 rounded-2xl shadow-2xl transition-transform duration-300 ease-out animate-float-delay hidden sm:block"
            style={{
              transform: `perspective(1000px) rotateY(${tilt.x * 1.5}deg) rotateX(${-tilt.y * 1.5}deg)`,
            }}
          >
            <div className="relative overflow-hidden rounded-lg bg-[#081008] border border-white/10">
              <img
                src="/images/retro-mini.jpg"
                alt="3D Car Render"
                width={462}
                height={512}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain"
              />
              <div className="p-2 bg-[#050B05]/90 flex justify-between items-center">
                <span className="text-[10px] font-bold text-white">Retro Mini Render</span>
                <span className="text-[10px] font-mono text-[#76FF03]">OCTANE 8K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Downward Scroll Indicator */}
      <a
        href="#about"
        onClick={playClickSound}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-400 hover:text-[#76FF03] transition-colors group cursor-pointer"
      >
        <span className="text-[10px] font-bold font-mono tracking-widest uppercase mb-1">
          SCROLL TO EXPLORE
        </span>
        <ArrowDown className="w-4 h-4 text-[#76FF03] animate-bounce" />
      </a>
    </section>
  );
};
