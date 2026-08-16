import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currentTrailX = -100;
    let currentTrailY = -100;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPosition({ x: mouseX, y: mouseY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = Boolean(
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('.kinetic-hover') ||
        target.closest('.cursor-pointer')
      );
      setIsHovered(isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    const animateTrail = () => {
      currentTrailX += (mouseX - currentTrailX) * 0.18;
      currentTrailY += (mouseY - currentTrailY) * 0.18;
      setTrailPos({ x: currentTrailX, y: currentTrailY });
      animId = requestAnimationFrame(animateTrail);
    };

    animId = requestAnimationFrame(animateTrail);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer Trail Ring */}
      <div
        className={`fixed pointer-events-none z-[9998] rounded-full border border-[#76FF03]/50 transition-all duration-150 ease-out mix-blend-screen ${
          isHovered
            ? 'w-14 h-14 bg-[#76FF03]/10 border-[#76FF03] shadow-[0_0_20px_rgba(118,255,3,0.4)]'
            : isClicking
            ? 'w-7 h-7 bg-[#38B000]/20 border-[#38B000]'
            : 'w-8 h-8'
        }`}
        style={{
          left: `${trailPos.x}px`,
          top: `${trailPos.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Center Precise Dot */}
      <div
        className={`fixed pointer-events-none z-[9999] rounded-full bg-[#76FF03] shadow-[0_0_10px_#76FF03] transition-transform duration-75 ease-out ${
          isHovered
            ? 'w-2 h-2 scale-150 bg-white shadow-[0_0_15px_#FFFFFF]'
            : isClicking
            ? 'w-3 h-3 scale-90 bg-[#76FF03]'
            : 'w-2.5 h-2.5'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
};
