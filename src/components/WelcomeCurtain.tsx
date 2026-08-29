import React, { useState, useEffect } from 'react';
import { play8BitArcadeSound } from '../utils/audio';

interface WelcomeCurtainProps {
  onComplete?: () => void;
}

export const WelcomeCurtain: React.FC<WelcomeCurtainProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  const statusMessages = [
    'INICIALIZANDO STUDIO KINETIC...',
    'CARGANDO TOPOLOGÍA 3D Y SHADERS...',
    'CALIBRANDO MOTOR WEBGL & AUDIO...',
    'SISTEMA LISTO • ¡BIENVENIDO!',
  ];

  useEffect(() => {
    // Smooth progress counter reaching 100% in ~3.4 seconds (+1 second)
    const startTime = Date.now();
    const duration = 3400; // 3.4s loading + 0.6s exit = 4.0s total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (currentProgress < 30) {
        setStatusIndex(0);
      } else if (currentProgress < 65) {
        setStatusIndex(1);
      } else if (currentProgress < 95) {
        setStatusIndex(2);
      } else {
        setStatusIndex(3);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setProgress(100);
        setStatusIndex(3);
        try {
          play8BitArcadeSound();
        } catch {
          // Graceful fallback
        }

        // Trigger smooth curtain exit transition
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsRendered(false);
            onComplete?.();
          }, 700); // 700ms smooth curtain dissolve
        }, 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Allow instant skip on click or Escape key
  const handleSkip = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      setIsRendered(false);
      onComplete?.();
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isRendered) return null;

  // Calculate 8-bit progress block segments (20 segments)
  const totalBlocks = 20;
  const activeBlocks = Math.round((progress / 100) * totalBlocks);

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-between p-6 md:p-10 bg-[#050B05] select-none cursor-pointer overflow-hidden transition-all duration-700 ease-out ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none blur-sm'
          : 'opacity-100 scale-100'
      }`}
      aria-label="Pantalla de bienvenida y carga"
    >
      {/* Retro 8-bit Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(118, 255, 3, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(118, 255, 3, 0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient Central Green Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[600px] h-[360px] sm:h-[450px] bg-[#76FF03]/22 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />

      {/* Top 8-Bit Status Bar */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between font-mono text-[10px] sm:text-xs text-gray-400 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-ping" />
          <span className="text-[#76FF03] font-bold tracking-widest uppercase">
            [ SYSTEM STATUS: INITIALIZING ]
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-gray-400">
          <span>PORTAFOLIO AYLIN FLORES</span>
          <span className="text-white/40">•</span>
          <span className="text-[#76FF03]">60 FPS READY</span>
        </div>
        <div className="text-gray-400 tracking-wider">
          <span className="text-white font-bold">{progress}%</span>
        </div>
      </div>

      {/* Centerpiece: Hands Entering + 3D Glowing Logo */}
      <div className="relative z-10 w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-4">
        {/* Hands + Logo Container */}
        <div className="relative w-full max-w-3xl h-[240px] sm:h-[300px] md:h-[360px] flex items-center justify-center">
          {/* Left Hand entering smoothly from left */}
          <div
            className="absolute left-2 sm:left-8 md:left-16 lg:left-24 bottom-0 w-32 sm:w-44 md:w-56 aspect-[840/1376] z-10 pointer-events-none transition-transform duration-1000 ease-out"
            style={{
              transform: isExiting
                ? 'translateX(-80px) scale(0.95)'
                : 'translateX(0px) scale(1)',
              animation: 'handIntroLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards, handFloatLeft 3s ease-in-out infinite 1.2s',
            }}
          >
            <img
              src="/images/mano-2.webp"
              alt="Mano Izquierda 3D"
              className="w-full h-full object-contain [filter:drop-shadow(0_12px_24px_rgba(0,0,0,0.9))_drop-shadow(0_0_15px_rgba(118,255,3,0.3))]"
            />
          </div>

          {/* Center 3D Glowing Logo */}
          <div
            className="relative z-20 w-24 sm:w-32 md:w-40 aspect-[2519/2743] pointer-events-none -mt-16 sm:-mt-24 md:-mt-32 transition-transform duration-1000 ease-out"
            style={{
              animation: 'logoIntroPop 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, logoFloatPulse 3s ease-in-out infinite 1.2s',
            }}
          >
            <img
              src="/logo.webp"
              alt="Aylin Flores Isotipo 3D"
              className="w-full h-full object-contain [filter:drop-shadow(0_0_35px_rgba(118,255,3,0.85))_drop-shadow(0_0_10px_#76FF03)]"
            />
          </div>

          {/* Right Hand entering smoothly from right */}
          <div
            className="absolute right-2 sm:right-8 md:right-16 lg:right-24 bottom-0 w-32 sm:w-44 md:w-56 aspect-[840/1376] z-10 pointer-events-none transition-transform duration-1000 ease-out"
            style={{
              transform: isExiting
                ? 'translateX(80px) scale(0.95)'
                : 'translateX(0px) scale(1)',
              animation: 'handIntroRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards, handFloatRight 3s ease-in-out infinite 1.2s',
            }}
          >
            <img
              src="/images/mano-1.webp"
              alt="Mano Derecha 3D"
              className="w-full h-full object-contain [filter:drop-shadow(0_12px_24px_rgba(0,0,0,0.9))_drop-shadow(0_0_15px_rgba(118,255,3,0.3))]"
            />
          </div>
        </div>

        {/* Title: PORTAFOLIO AYLIN FLORES */}
        <div className="text-center mt-3 sm:mt-5 space-y-1.5 sm:space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none [text-shadow:0_0_20px_rgba(118,255,3,0.4)]">
            PORTAFOLIO{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#76FF03] via-[#A3E635] to-[#38B000]">
              AYLIN FLORES
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs md:text-sm font-mono text-gray-300 tracking-[0.25em] uppercase font-semibold">
            STUDIO KINETIC • DISEÑO & MODELADO 3D
          </p>
        </div>
      </div>

      {/* Bottom: 8-Bit Progress Bar & System Messages */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center space-y-3 pb-2">
        {/* Dynamic Status Text */}
        <div className="font-mono text-xs sm:text-sm text-[#76FF03] font-bold tracking-wider text-center flex items-center space-x-2">
          <span className="inline-block animate-pulse">&gt;</span>
          <span>{statusMessages[statusIndex]}</span>
        </div>

        {/* 8-Bit Block Progress Bar */}
        <div className="w-full bg-[#081208] border border-[#76FF03]/40 rounded-lg p-1.5 shadow-[0_0_20px_rgba(118,255,3,0.2)]">
          <div className="grid grid-cols-20 gap-1 h-3 sm:h-3.5 w-full">
            {Array.from({ length: totalBlocks }).map((_, index) => {
              const isFilled = index < activeBlocks;
              return (
                <div
                  key={index}
                  className={`h-full rounded-[2px] transition-all duration-150 ${
                    isFilled
                      ? 'bg-[#76FF03] shadow-[0_0_8px_#76FF03]'
                      : 'bg-white/5'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Skip hint */}
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hover:text-gray-300 transition-colors">
          [ CLIC O ESC PARA ENTRAR DIRECTO ]
        </div>
      </div>
    </div>
  );
};

export default WelcomeCurtain;
