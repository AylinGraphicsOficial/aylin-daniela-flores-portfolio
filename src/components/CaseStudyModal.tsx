import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Layers, Palette, CheckCircle2 } from 'lucide-react';
import { Project, Language } from '../types';
import { playClickSound } from '../utils/audio';

interface CaseStudyModalProps {
  project: Project | null;
  lang: Language;
  onClose: () => void;
  onSelectAnotherProject?: (proj: Project) => void;
  onOpenProjectPlanner: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onOpenProjectPlanner,
}) => {
  if (!project) return null;

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const gallery = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.image];

  const handleNextImage = () => {
    playClickSound();
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevImage = () => {
    playClickSound();
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl glass-panel-heavy rounded-2xl border border-white/20 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-[#050B05]/90 z-20">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-[#38B000]/30 border border-[#38B000] text-[#76FF03] text-xs font-mono font-bold rounded-full">
              {project.category}
            </span>
            <span className="text-xs font-mono text-gray-400">
              {project.year} • Client: {project.client}
            </span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-4 md:p-8 space-y-8 bg-[#081008]">
          {/* Main Title & Subtitle */}
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-2">
              {project.title}
            </h2>
            <p className="text-base text-gray-300 max-w-3xl leading-relaxed">
              {project.shortDesc}
            </p>
          </div>

          {/* Interactive Image Gallery Carousel */}
          <div className="relative rounded-2xl overflow-hidden bg-[#050B05] border border-white/10 min-h-[300px] md:min-h-[460px] flex items-center justify-center">
            <img
              src={gallery[activeImageIndex]}
              alt={project.title}
              className="w-full h-full max-h-[500px] object-contain transition-all duration-500"
            />

            {gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Thumbnails Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  {gallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playClickSound();
                        setActiveImageIndex(idx);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        activeImageIndex === idx ? 'bg-[#76FF03] w-6' : 'bg-white/40 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Key Metrics / Highlights Grid */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-xl text-center">
                  <div className="text-xl md:text-2xl font-black text-[#76FF03] font-mono mb-1">
                    {m.value}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Deep-Dive Narrative & Deliverables */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-[#76FF03] uppercase font-mono tracking-widest flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>PROJECT SCOPE & CREATIVE EXECUTION</span>
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                {project.fullDesc}
              </p>

              {/* Tags */}
              <div className="pt-2">
                <span className="text-xs text-gray-400 block mb-2 font-mono">TOOLS & DISCIPLINES:</span>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-gray-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-6">
              {/* Deliverables */}
              {project.deliverables && (
                <div className="glass-panel p-5 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#76FF03]" />
                    <span>CLIENT DELIVERABLES</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-300">
                    {project.deliverables.map((deliv, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#76FF03]" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Color Palette */}
              {project.colorPalette && (
                <div className="glass-panel p-5 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-[#76FF03]" />
                    <span>COLOR HARMONY</span>
                  </h4>
                  <div className="flex space-x-2">
                    {project.colorPalette.map((hex, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full h-8 rounded-md border border-white/20 shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-[10px] font-mono text-gray-400 mt-1">{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer inside Modal */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-gray-400 font-mono">
              Ready to create something similar for your company?
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                  onOpenProjectPlanner();
                }}
                className="px-6 py-3 bg-[#76FF03] hover:bg-[#50E310] text-[#050B05] font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(118,255,3,0.4)] transition-all"
              >
                START A SIMILAR PROJECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
