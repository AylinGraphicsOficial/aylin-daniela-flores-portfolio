import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';
import { projectsData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audio';
import './HeroProjectsSlider.css';

interface HeroProjectsSliderProps {
  onSelectProject?: (project: Project) => void;
  intervalMs?: number; // default 3000ms (3s)
}

interface SlideItem {
  id: string;
  image: string;
  title: string;
  category: string;
  year: string;
  projectRef?: Project;
}

const sliderItems: SlideItem[] = [
  {
    id: 'retro-mini-render',
    image: '/images/retro-mini.jpg',
    title: 'Retro Mini Classic 3D Render',
    category: '3D MODELING',
    year: '2023',
    projectRef: projectsData.find(p => p.id === 'retro-mini-render')
  },
  {
    id: 'kinetic-touch-hands',
    image: '/images/hero-hands.jpg',
    title: 'Kinetic Touch & Fluid Synergy',
    category: 'DIGITAL ART',
    year: '2024',
    projectRef: projectsData.find(p => p.id === 'kinetic-touch-hands')
  },
  {
    id: 'orbit-stand-exhibition',
    image: '/images/orbit-stand.webp',
    title: 'Kinetic 3D Stand Exhibition',
    category: '3D MODELING',
    year: '2024',
  },
  {
    id: 'corporate-identity-system',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1400&q=85',
    title: 'Nexus Fintech Corporate Identity System',
    category: 'BRANDING',
    year: '2024',
    projectRef: projectsData.find(p => p.id === 'corporate-identity-system')
  },
  {
    id: 'diana-brand-experience',
    image: '/images/orbit-stand-diana.webp',
    title: 'Diana Interactive Brand Stand',
    category: 'BRANDING',
    year: '2024',
  },
  {
    id: 'lumina-beverage-packaging',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=85',
    title: 'Lumina Craft Botanical Beverage 3D',
    category: '3D MODELING',
    year: '2023',
    projectRef: projectsData.find(p => p.id === 'lumina-beverage-packaging')
  },
  {
    id: 'digital-product-ui-3d',
    image: '/images/orbit-tablet.webp',
    title: 'Next-Gen Digital Tablet & UI 3D',
    category: 'DIGITAL ART',
    year: '2024',
  },
  {
    id: 'orbit-carrito-render',
    image: '/images/orbit-carrito.png',
    title: '3D Stand & Carrito Retail Visual',
    category: '3D MODELING',
    year: '2024',
  },
  {
    id: 'cyber-kinetic-intro',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=85',
    title: 'Aura Kinetic Motion Typography',
    category: 'MOTION',
    year: '2024',
    projectRef: projectsData.find(p => p.id === 'cyber-kinetic-intro')
  }
];

export const HeroProjectsSlider: React.FC<HeroProjectsSliderProps> = ({
  onSelectProject,
  intervalMs = 3000, // 3 seconds per transition
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const timerRef = useRef<number | null>(null);

  const total = sliderItems.length;

  const goToNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Automatic 3-second interval timer
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = window.setInterval(() => {
      goToNext();
    }, intervalMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isPaused, intervalMs, goToNext]);

  const handleSlideClick = (item: SlideItem) => {
    playClickSound();
    if (item.projectRef && onSelectProject) {
      onSelectProject(item.projectRef);
    } else {
      const workSection = document.getElementById('work');
      if (workSection) {
        workSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="hero-slider-container relative w-full h-[420px] sm:h-[480px] md:h-[520px] lg:h-[560px] xl:h-[600px] select-none rounded-3xl overflow-hidden group/slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Galería de proyectos destacados"
    >
      {/* Ambient background glow behind the right slider */}
      <div className="absolute -inset-4 bg-[#76FF03]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Main Glass Frame */}
      <div className="relative w-full h-full bg-[#081208]/85 border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        {/* Slides Images Stack */}
        {sliderItems.map((item, index) => {
          const isActive = index === currentIndex;
          const isPrev = (currentIndex - 1 + total) % total === index;
          const isNext = (currentIndex + 1) % total === index;

          let positionClass = 'hero-slide--hidden';
          if (isActive) positionClass = 'hero-slide--active';
          else if (isPrev) positionClass = 'hero-slide--prev';
          else if (isNext) positionClass = 'hero-slide--next';

          return (
            <div
              key={item.id}
              onClick={() => isActive && handleSlideClick(item)}
              className={`hero-slide absolute inset-0 cursor-pointer ${positionClass}`}
              aria-hidden={!isActive}
            >
              {/* High-Impact Image */}
              <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-10 md:p-14 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] transition-transform duration-700 ease-out group-hover/slider:scale-105"
                />
              </div>

              {/* Minimal Aesthetic Floating Caption Badge */}
              <div className="absolute bottom-6 left-8 sm:left-12 z-30 flex items-center gap-3 bg-[#050B05]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-[#76FF03] tracking-wider uppercase">
                  {item.category}
                </span>
                <span className="text-gray-500 font-mono text-[10px]">•</span>
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[160px] sm:max-w-[240px] md:max-w-[320px]">
                  {item.title}
                </span>
              </div>
            </div>
          );
        })}

        {/* Left Smooth Degradado Transition (Blends smoothly into the text background) */}
        <div className="hero-slider-degradado-left absolute left-0 top-0 bottom-0 w-28 sm:w-40 md:w-56 lg:w-72 bg-gradient-to-r from-[#050B05] via-[#050B05]/90 to-transparent pointer-events-none z-20" />

        {/* Right Subtle Edge Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#050B05]/80 to-transparent pointer-events-none z-20" />

        {/* Interactive Navigation Arrows (< and >) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playClickSound();
            goToPrev();
          }}
          onMouseEnter={playHoverSound}
          aria-label="Proyecto anterior"
          className="hero-slider-arrow hero-slider-arrow--left absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#050B05]/85 hover:bg-[#76FF03] text-white hover:text-[#050B05] border border-white/15 hover:border-[#76FF03] flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(118,255,3,0.6)] hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playClickSound();
            goToNext();
          }}
          onMouseEnter={playHoverSound}
          aria-label="Proyecto siguiente"
          className="hero-slider-arrow hero-slider-arrow--right absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#050B05]/85 hover:bg-[#76FF03] text-white hover:text-[#050B05] border border-white/15 hover:border-[#76FF03] flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(118,255,3,0.6)] hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Subtle Progress Bar Indicators (Bottom-Right) */}
        <div className="absolute bottom-6 right-6 sm:right-8 z-30 flex items-center gap-1.5 bg-[#050B05]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {sliderItems.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                setCurrentIndex(idx);
              }}
              aria-label={`Ir al proyecto ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-[#76FF03] shadow-[0_0_10px_rgba(118,255,3,0.8)]'
                  : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroProjectsSlider;
