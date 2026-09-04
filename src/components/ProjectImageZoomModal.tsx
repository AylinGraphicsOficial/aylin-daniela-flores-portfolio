import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move,
  Layers,
  Info,
} from 'lucide-react';
import { Language } from '../types';
import { playClickSound, playHoverSound } from '../utils/audio';

interface ProjectImageZoomModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  projectTitle: string;
  lang?: Language;
  onClose: () => void;
}

export const ProjectImageZoomModal: React.FC<ProjectImageZoomModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  projectTitle,
  lang = 'es',
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHelpHint, setShowHelpHint] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync index if initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(Math.max(0, initialIndex), Math.max(0, images.length - 1)));
      resetZoom();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex, images.length]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    playClickSound();
    resetZoom();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length, resetZoom]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    playClickSound();
    resetZoom();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length, resetZoom]);

  // One-click quick zoom toggle: 1x <-> 2.5x
  const handleToggleQuickZoom = () => {
    playClickSound();
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => {
    playClickSound();
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    playClickSound();
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Keyboard navigation & zoom shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playClickSound();
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0' || e.key === 'r' || e.key === 'R') {
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose, resetZoom]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.25, 4));
    } else {
      setScale((prev) => {
        const next = Math.max(prev - 0.25, 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Double click to zoom in/out
  const handleDoubleClick = (e: React.MouseEvent) => {
    playClickSound();
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = (e.clientX - (rect.left + rect.width / 2)) * -0.5;
      const offsetY = (e.clientY - (rect.top + rect.height / 2)) * -0.5;
      setPosition({ x: offsetX, y: offsetY });
    }
  };

  // Drag to pan when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const isHeroImage = currentIndex === 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-[#050B05]/95 backdrop-blur-2xl text-white select-none animate-fade-in"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Controls Bar */}
      <div className="flex-shrink-0 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-white/10 bg-[#050B05]/90 z-20">
        {/* Left: Project title & Image badge */}
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#76FF03]/10 border border-[#76FF03]/30 text-[#76FF03] text-xs font-mono font-bold tracking-wider uppercase">
            <Layers className="w-3.5 h-3.5" />
            {isHeroImage
              ? lang === 'es'
                ? 'Render Principal'
                : 'Main Render'
              : lang === 'es'
              ? `Vista de Detalle ${currentIndex} / ${images.length - 1}`
              : `Detail View ${currentIndex} / ${images.length - 1}`}
          </span>
          <div className="truncate">
            <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white truncate">
              {projectTitle}
            </h3>
            <span className="text-[11px] font-mono text-gray-400 block sm:hidden">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>

        {/* Center: Prominent "HACER ZOOM" & Zoom controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-black/60 border border-white/15 px-2.5 py-1.5 rounded-2xl shadow-xl">
          {/* Main "Hacer Zoom" Button with Glow */}
          <button
            type="button"
            onClick={handleToggleQuickZoom}
            onMouseEnter={playHoverSound}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all duration-300 cursor-pointer shadow-md ${
              scale > 1
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-[#76FF03] text-[#050B05] hover:bg-[#8aff29] hover:shadow-[0_0_20px_rgba(118,255,3,0.6)]'
            }`}
            title={scale > 1 ? 'Alejar (Ajustar a pantalla)' : 'Hacer Zoom (Aumentar detalles 2.5x)'}
          >
            {scale > 1 ? (
              <>
                <ZoomOut className="w-3.5 h-3.5" />
                <span>{lang === 'es' ? 'Alejar' : 'Zoom Out'}</span>
              </>
            ) : (
              <>
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{lang === 'es' ? 'Hacer Zoom' : 'Zoom In'}</span>
              </>
            )}
          </button>

          {/* Zoom In button (+) */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 4}
            onMouseEnter={playHoverSound}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Aumentar zoom (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out button (-) */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 1}
            onMouseEnter={playHoverSound}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Reducir zoom (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Current Zoom Level Badge */}
          <span className="text-[11px] font-mono font-bold text-[#76FF03] min-w-[42px] text-center px-1">
            {Math.round(scale * 100)}%
          </span>

          {/* Reset button (↺) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              resetZoom();
            }}
            disabled={scale === 1 && position.x === 0 && position.y === 0}
            onMouseEnter={playHoverSound}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Ajustar y centrar imagen (0 / R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Fullscreen and Close */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            onMouseEnter={playHoverSound}
            className="hidden md:flex p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white cursor-pointer border border-white/10 transition-colors"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            onMouseEnter={playHoverSound}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 transition-all duration-300 cursor-pointer flex items-center space-x-1.5 shadow-md"
            title="Cerrar visor (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-mono font-bold uppercase">
              {lang === 'es' ? 'Cerrar' : 'Close'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        className={`flex-1 relative overflow-hidden flex items-center justify-center ${
          scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleDoubleClick}
      >
        {/* Floating Pan Hint when zoomed in */}
        {scale > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center space-x-2 bg-black/80 backdrop-blur-md border border-[#76FF03]/40 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#76FF03] shadow-lg animate-fade-in">
            <Move className="w-3.5 h-3.5 animate-pulse" />
            <span>
              {lang === 'es'
                ? 'Arrastra con el ratón para examinar detalles finos'
                : 'Click & drag to explore fine render details'}
            </span>
          </div>
        )}

        {/* Floating Quick Double-Click Tip (auto fades) */}
        {scale === 1 && showHelpHint && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center space-x-2 bg-black/75 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-[11px] font-mono text-gray-300 shadow-md">
            <Info className="w-3.5 h-3.5 text-[#76FF03]" />
            <span>
              {lang === 'es'
                ? 'Haz clic en "Hacer Zoom", usa la rueda o doble clic para ampliar'
                : 'Click "Zoom In", use scroll wheel or double click to zoom'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowHelpHint(false);
              }}
              className="pointer-events-auto ml-1 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* The Scalable High-Res Image */}
        <div
          className="transition-transform duration-200 ease-out select-none flex items-center justify-center p-4"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <img
            ref={imgRef}
            src={currentImage}
            alt={`${projectTitle} - render ${currentIndex + 1}`}
            draggable={false}
            className="max-w-[90vw] max-h-[74vh] object-contain rounded-xl shadow-2xl pointer-events-none border border-white/10"
          />
        </div>

        {/* Previous Image Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            onMouseEnter={playHoverSound}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-[#76FF03] border border-white/20 hover:border-[#76FF03] text-white hover:text-[#050B05] flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 cursor-pointer group"
            title="Render anterior (←)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Next Image Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            onMouseEnter={playHoverSound}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-[#76FF03] border border-white/20 hover:border-[#76FF03] text-white hover:text-[#050B05] flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 cursor-pointer group"
            title="Siguiente render (→)"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnails Carousel Bar */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-white/10 bg-[#050B05]/95 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-1">
          {images.map((imgSrc, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  playClickSound();
                  resetZoom();
                  setCurrentIndex(idx);
                }}
                onMouseEnter={playHoverSound}
                className={`relative flex-shrink-0 w-14 h-10 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group ${
                  isActive
                    ? 'border-[#76FF03] shadow-[0_0_15px_rgba(118,255,3,0.5)] scale-105'
                    : 'border-white/20 hover:border-white/60 opacity-60 hover:opacity-100'
                }`}
                title={
                  idx === 0
                    ? lang === 'es'
                      ? 'Render Principal'
                      : 'Main Render'
                    : lang === 'es'
                    ? `Vista de Detalle #${idx}`
                    : `Detail View #${idx}`
                }
              >
                <img
                  src={imgSrc}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold text-white bg-black/80 px-1 rounded">
                  #{idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectImageZoomModal;
