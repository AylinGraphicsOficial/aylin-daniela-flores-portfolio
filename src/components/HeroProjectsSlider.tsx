import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    id: 'corporate-identity-system',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1400&q=85',
    title: 'Nexus Fintech Corporate Identity System',
    category: 'BRANDING',
    year: '2024',
    projectRef: projectsData.find(p => p.id === 'corporate-identity-system')
  },
  {
    id: 'orbit-stand-exhibition',
    image: '/images/orbit-stand.webp',
    title: 'Kinetic 3D Stand Exhibition',
    category: '3D MODELING',
    year: '2024',
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
  const timerRef = useRef<number | null>(null);

  const total = sliderItems.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
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
      className="hero-cinematic-slider relative w-full h-full select-none group/slider flex items-center justify-center pointer-events-auto overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Galería interactiva de proyectos destacados en pantalla completa"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#76FF03]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Slide Stage (Full 100% Width & Height Canvas) */}
      <div className="hero-slider-mask-box relative w-full h-full overflow-hidden">
        
        {/* Slides Stack */}
        {sliderItems.map((item, index) => {
          const isActive = index === currentIndex;
          const isPrev = (currentIndex - 1 + total) % total === index;
          const isNext = (currentIndex + 1) % total === index;

          let stateClass = 'hero-slide-fade--hidden';
          if (isActive) stateClass = 'hero-slide-fade--active';
          else if (isPrev) stateClass = 'hero-slide-fade--prev';
          else if (isNext) stateClass = 'hero-slide-fade--next';

          return (
            <div
              key={item.id}
              onClick={() => isActive && handleSlideClick(item)}
              className={`hero-slide-fade absolute inset-0 cursor-pointer ${stateClass}`}
              aria-hidden={!isActive}
            >
              {/* Full-Scale Image Presentation extending across the right half and center */}
              <div className="relative w-full h-full flex items-center justify-center lg:justify-end pr-0 sm:pr-4 md:pr-8 lg:pr-12 xl:pr-20 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="hero-slide-img w-auto h-full max-h-[92%] sm:max-h-[95%] max-w-[90vw] lg:max-w-[65vw] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] transition-transform duration-1000 ease-out group-hover/slider:scale-[1.02]"
                />
              </div>

              {/* Minimal Aesthetic Pill Caption (Bottom-Right) */}
              <div className="absolute bottom-6 right-24 sm:right-32 md:right-44 lg:right-48 z-30 hidden sm:flex items-center gap-2.5 bg-[#050B05]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-[#76FF03] tracking-wider uppercase">
                  {item.category}
                </span>
                <span className="text-gray-500 font-mono text-[10px]">•</span>
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[150px] sm:max-w-[220px] md:max-w-[320px]">
                  {item.title}
                </span>
              </div>
            </div>
          );
        })}

        {/* PRIMARY LEFT DARK DIFFUSION (Ensures 100% text readability with smooth organic blend) */}
        <div className="hero-slider-fade-left absolute inset-y-0 left-0 w-full lg:w-[58%] xl:w-[50%] bg-gradient-to-r from-[#050B05] via-[#050B05]/90 via-45% to-transparent pointer-events-none z-20" />

        {/* Interactive Left Arrow (<) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playClickSound();
            goToPrev();
          }}
          onMouseEnter={playHoverSound}
          aria-label="Proyecto anterior"
          className="hero-arrow-btn hero-arrow-btn--left absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#050B05]/85 hover:bg-[#76FF03] text-white hover:text-[#050B05] border border-white/20 hover:border-[#76FF03] flex items-center justify-center transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.85)] hover:shadow-[0_0_30px_rgba(118,255,3,0.7)] hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* Interactive Right Arrow (>) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playClickSound();
            goToNext();
          }}
          onMouseEnter={playHoverSound}
          aria-label="Proyecto siguiente"
          className="hero-arrow-btn hero-arrow-btn--right absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#050B05]/85 hover:bg-[#76FF03] text-white hover:text-[#050B05] border border-white/20 hover:border-[#76FF03] flex items-center justify-center transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.85)] hover:shadow-[0_0_30px_rgba(118,255,3,0.7)] hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* Modern Segmented Progress Bar (Bottom-Right) */}
        <div className="absolute bottom-6 right-6 sm:right-10 md:right-14 z-30 flex items-center gap-1.5 bg-[#050B05]/85 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-lg">
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
                  ? 'w-7 bg-[#76FF03] shadow-[0_0_12px_rgba(118,255,3,0.9)]'
                  : 'w-1.5 bg-white/25 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroProjectsSlider;
