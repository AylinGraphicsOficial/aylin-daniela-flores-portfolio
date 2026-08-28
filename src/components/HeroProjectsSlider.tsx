import React, { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { projectsData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audio';
import './HeroProjectsSlider.css';

interface HeroProjectsSliderProps {
  onSelectProject?: (project: Project) => void;
  speed?: number; // seconds for complete loop
}

// Curated list of high-impact hero showcase projects
const showcaseProjects: Project[] = [
  ...projectsData,
  {
    id: 'orbit-stand-exhibition',
    title: 'Kinetic 3D Stand Exhibition',
    category: '3D MODELING',
    year: '2024',
    client: 'Studio Kinetic Showcase',
    shortDesc: 'Spatial architectural visualization, stage lighting and interactive brand stand 3D environment.',
    fullDesc: 'Architectural space rendering and brand exhibition booth design featuring dynamic neon light fixtures, realistic physical materials, and interactive spatial layout.',
    image: '/images/orbit-stand.webp',
    galleryImages: ['/images/orbit-stand.webp', '/images/orbit-stand-diana.webp'],
    tags: ['3D Modeling', 'Exhibition', 'Blender', 'Lighting'],
    featured: true,
    deliverables: ['3D Stand Model', '4K Architectural Renders', 'Lighting Setup'],
    metrics: [{ label: 'Resolution', value: '4K Ultra HD' }],
    colorPalette: ['#050B05', '#76FF03', '#38B000', '#FFFFFF']
  },
  {
    id: 'diana-brand-experience',
    title: 'Diana Interactive Brand Stand',
    category: 'BRANDING',
    year: '2024',
    client: 'Diana Corporación',
    shortDesc: 'Brand experiential design, modular commercial stand and 3D promotional assets.',
    fullDesc: 'Creative brand deployment and modular exhibition stand engineering with custom corporate iconography, promotional displays, and vibrant brand styling.',
    image: '/images/orbit-stand-diana.webp',
    galleryImages: ['/images/orbit-stand-diana.webp'],
    tags: ['Branding', 'Spatial Design', 'Commercial', 'Render'],
    featured: true,
    deliverables: ['Brand Stand', 'Point of Sale Graphics', '3D Preview'],
    metrics: [{ label: 'Audience Reach', value: '50K+ Visitors' }],
    colorPalette: ['#76FF03', '#050B05', '#FFFFFF']
  },
  {
    id: 'digital-product-ui-3d',
    title: 'Next-Gen Digital Tablet & UI 3D',
    category: 'DIGITAL ART',
    year: '2024',
    client: 'Kinetic Lab UI',
    shortDesc: 'Surreal hardware and futuristic touch UI visualization with cybernetic lighting.',
    fullDesc: 'Conceptual hardware study and tactile touchscreen interface with holographic depth, emissive neon materials, and sleek minimalist dark aesthetic.',
    image: '/images/orbit-tablet.webp',
    galleryImages: ['/images/orbit-tablet.webp'],
    tags: ['UI/UX', 'Digital Art', '3D Hardware', 'Cyberpunk'],
    featured: true,
    deliverables: ['3D Device Asset', 'Holographic UI Assets', 'Key Visuals'],
    metrics: [{ label: 'Render Depth', value: '32-bit Float' }],
    colorPalette: ['#050B05', '#76FF03', '#A3E635']
  }
];

export const HeroProjectsSlider: React.FC<HeroProjectsSliderProps> = ({
  onSelectProject,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Triple set for completely seamless infinite loop
  const displayList = [...showcaseProjects, ...showcaseProjects, ...showcaseProjects];

  const handleCardClick = (project: Project) => {
    playClickSound();
    if (onSelectProject) {
      onSelectProject(project);
    } else {
      const workSection = document.getElementById('work');
      if (workSection) {
        workSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="hero-slider-wrapper relative w-full overflow-hidden select-none py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left Deep Gradient Transition Overlay (blends text seamlessly into the slider) */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 md:w-52 lg:w-64 bg-gradient-to-r from-[#050B05] via-[#050B05]/90 to-transparent z-20 pointer-events-none" />

      {/* Right Subtle Edge Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#050B05] via-[#050B05]/70 to-transparent z-20 pointer-events-none" />

      {/* Track */}
      <div
        ref={trackRef}
        className={`hero-slider-track flex items-center gap-5 sm:gap-6 ${
          isPaused ? 'hero-slider-track--paused' : ''
        }`}
      >
        {displayList.map((project, index) => (
          <div
            key={`${project.id}-${index}`}
            onClick={() => handleCardClick(project)}
            onMouseEnter={playHoverSound}
            className="hero-slider-card group relative flex-shrink-0 w-[260px] sm:w-[290px] md:w-[320px] h-[340px] sm:h-[370px] md:h-[400px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out border border-white/10 hover:border-[#76FF03]/60 bg-[#081208]/75 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.75)] hover:shadow-[0_0_35px_rgba(118,255,3,0.35)] hover:-translate-y-2 flex flex-col justify-between p-4 sm:p-5"
          >
            {/* Ambient inner card glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050B05] via-[#050B05]/40 to-transparent z-10 opacity-90 group-hover:opacity-75 transition-opacity" />

            {/* Top Bar: Category Pill & Year */}
            <div className="relative z-20 flex items-center justify-between">
              <span className="px-2.5 py-1 bg-[#050B05]/80 backdrop-blur-md border border-[#76FF03]/40 text-[#76FF03] text-[10px] font-mono font-bold rounded-full tracking-wider">
                {project.category}
              </span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-mono rounded-full">
                {project.year}
              </span>
            </div>

            {/* Middle: Project Image */}
            <div className="absolute inset-0 overflow-hidden flex items-center justify-center p-6">
              <img
                src={project.image}
                alt={project.title}
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out [filter:drop-shadow(0_12px_24px_rgba(0,0,0,0.9))]"
              />
            </div>

            {/* Bottom: Info Bar */}
            <div className="relative z-20 pt-2 transform translate-y-0.5 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-gray-400 block truncate mb-0.5">
                    {project.client}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-[#76FF03] transition-colors leading-tight line-clamp-1">
                    {project.title}
                  </h3>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 group-hover:bg-[#76FF03] text-white group-hover:text-[#050B05] group-hover:border-[#76FF03] flex items-center justify-center transition-all duration-300 flex-shrink-0 group-hover:rotate-45 shadow-md">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroProjectsSlider;
