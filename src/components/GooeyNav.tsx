import React, { useRef, useEffect, useState, useCallback } from 'react';
import './GooeyNav.css';
import { play8BitArcadeSound } from '../utils/audio';

export interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: string[];
  initialActiveIndex?: number;
  onItemClick?: (item: GooeyNavItem, index: number) => void;
  className?: string;
}

const DEFAULT_COLORS = [
  '#76FF03', // Electric Lime
  '#38B000', // Kinetic Green
  '#00E5FF', // Neon Cyan
  '#FFEE00', // Arcade Yellow
  '#FFFFFF', // Pure White
  '#FF3366', // Arcade Magenta
];

export const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 550,
  particleCount = 20,
  particleDistances = [75, 15],
  timeVariance = 200,
  colors = DEFAULT_COLORS,
  initialActiveIndex = 0,
  onItemClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLUListElement | null>(null);
  const filterRef = useRef<HTMLSpanElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const updateEffectPosition = useCallback((element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
  }, []);

  const make8BitExplosion = useCallback((targetElement: HTMLElement) => {
    if (!containerRef.current) return;

    // Play synthesized 8-bit sound
    play8BitArcadeSound();

    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const centerX = targetRect.left - containerRect.left + targetRect.width / 2;
    const centerY = targetRect.top - containerRect.top + targetRect.height / 2;

    const [maxDist] = particleDistances;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4 - 0.2);
      const distance = maxDist * (0.6 + Math.random() * 0.8);
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      const duration = animationTime + (Math.random() * timeVariance - timeVariance / 2);
      const pixelSize = Math.floor(Math.random() * 5 + 5); // 5px to 9px pixel squares
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rotationStep = (Math.floor(Math.random() * 4) * 90);

      const particle = document.createElement('span');
      particle.className = 'pixel-particle';
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.setProperty('--end-x', `${endX}px`);
      particle.style.setProperty('--end-y', `${endY}px`);
      particle.style.setProperty('--px-size', `${pixelSize}px`);
      particle.style.setProperty('--time', `${duration}ms`);
      particle.style.setProperty('--color', color);
      particle.style.setProperty('--rot', `${rotationStep}deg`);

      containerRef.current.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, duration + 50);
    }
  }, [animationTime, colors, particleCount, particleDistances, timeVariance]);

  const handleItemSelect = (
    e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>,
    item: GooeyNavItem,
    index: number
  ) => {
    setActiveIndex(index);
    const liEl = (e.currentTarget as HTMLElement).closest('li') as HTMLElement | null;

    if (liEl) {
      updateEffectPosition(liEl);
      make8BitExplosion(liEl);

      if (filterRef.current) {
        filterRef.current.classList.remove('active');
        void filterRef.current.offsetWidth;
        filterRef.current.classList.add('active');
      }
    }

    if (onItemClick) {
      onItemClick(item, index);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    item: GooeyNavItem,
    index: number
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = (e.currentTarget as HTMLElement).closest('li') as HTMLElement | null;
      if (liEl) {
        setActiveIndex(index);
        updateEffectPosition(liEl);
        make8BitExplosion(liEl);
        if (onItemClick) {
          onItemClick(item, index);
        }
      }
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex] as HTMLElement | undefined;
    if (activeLi) {
      updateEffectPosition(activeLi);
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex] as HTMLElement | undefined;
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex, updateEffectPosition, items]);

  return (
    <div className={`gooey-nav-container ${className}`.trim()} ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <li key={item.href} className={isActive ? 'active' : ''}>
                <a
                  href={item.href}
                  onClick={(e) => handleItemSelect(e, item, index)}
                  onTouchEnd={(e) => handleItemSelect(e, item, index)}
                  onKeyDown={(e) => handleKeyDown(e, item, index)}
                  tabIndex={0}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <span className="effect filter active" ref={filterRef} />
    </div>
  );
};

export default GooeyNav;
