import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Box, Sparkles, ZoomIn, Maximize2, Layers, ExternalLink, Play, Film, Video } from 'lucide-react';
import { Project, Language } from '../types';
import { getStoredProjects } from '../utils/portfolioStorage';
import { playClickSound, playHoverSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';
import { ProjectImageZoomModal } from './ProjectImageZoomModal';
import { getProjectPrimaryMedia, getProjectMediaCollection, ProjectMediaItem } from '../utils/mediaDetector';

interface ProjectDetailPageProps {
  project: Project;
  lang: Language;
  onBackToPortfolio: () => void;
  onSelectProject: (project: Project) => void;
  onOpenProjectPlanner: () => void;
}

const handleImgError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  originalUrl: string,
  _category?: string
) => {
  const imgEl = e.currentTarget;

  // 1. If it's a legacy la-rebusca relative card asset, map to the production location:
  if (originalUrl.includes('la-rebusca') || originalUrl.includes('naipe') || originalUrl.includes('packagin')) {
    const rebuscaMap: Record<string, string> = {
      imagen_naipes: '/images/projects/la-rebusca/imagen_naipes@300x.webp',
      naipe1: '/images/projects/la-rebusca/naipe1@300x.webp',
      naipe2: '/images/projects/la-rebusca/naipe2@300x.webp',
      naipe3: '/images/projects/la-rebusca/naipe3@300x.webp',
      naipe4: '/images/projects/la-rebusca/naipe4@300x.webp',
      packagin_1: '/images/projects/la-rebusca/packagin 1@300x.webp',
      packagin2: '/images/projects/la-rebusca/packagin2@300x.webp',
      post_losrebusca: '/images/projects/la-rebusca/post_losrebusca@300x.webp',
    };
    for (const [key, fallbackUrl] of Object.entries(rebuscaMap)) {
      if (originalUrl.toLowerCase().includes(key.toLowerCase()) && !imgEl.src.endsWith(fallbackUrl) && imgEl.src !== fallbackUrl) {
        imgEl.src = fallbackUrl;
        return;
      }
    }
  }

  // 2. Prevent infinite loop and avoid swapping user custom images with diana/orbit-stand!
  if (imgEl.dataset.hasFailed) return;
  imgEl.dataset.hasFailed = 'true';
  imgEl.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="%23050B05"><rect width="800" height="600" fill="%230a140a"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="%2376FF03" font-family="monospace" font-size="18" letter-spacing="2">MEDIA NO DISPONIBLE</text><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%23888888" font-family="sans-serif" font-size="13">No se pudo cargar la imagen original</text></svg>';
};

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  lang,
  onBackToPortfolio,
  onSelectProject,
  onOpenProjectPlanner,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [zoomInitialIndex, setZoomInitialIndex] = useState<number>(0);

  const mediaCollection = useMemo(() => getProjectMediaCollection(project), [project]);
  const primaryMedia = mediaCollection.primaryMedia;

  // Selected media ID for the main showcase player
  const [selectedMediaId, setSelectedMediaId] = useState<string>(() => {
    if (mediaCollection.videos.length > 0) return mediaCollection.videos[0].id;
    return mediaCollection.items[0]?.id || 'media-hero-image';
  });

  useEffect(() => {
    if (mediaCollection.videos.length > 0) {
      setSelectedMediaId(mediaCollection.videos[0].id);
    } else {
      setSelectedMediaId(mediaCollection.items[0]?.id || 'media-hero-image');
    }
  }, [project.id, mediaCollection.items]);

  const currentMedia: ProjectMediaItem | undefined = useMemo(() => {
    return mediaCollection.items.find((item) => item.id === selectedMediaId) || mediaCollection.items[0];
  }, [mediaCollection.items, selectedMediaId]);

  // Read dynamically from stored projects so newly added dashboard projects navigate correctly
  const allProjects = useMemo(() => {
    const list = getStoredProjects();
    return list.length > 0 ? list : [project];
  }, [project]);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0
      ? allProjects[currentIndex - 1]
      : allProjects[allProjects.length - 1] || project;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : allProjects[0] || project;

  // Build unified high-res image list for zoom viewer
  const allImages = useMemo(() => {
    const list: string[] = [];
    if (project.image && project.image.trim() !== '') list.push(project.image);
    if (project.galleryImages && project.galleryImages.length > 0) {
      project.galleryImages.forEach((img) => {
        if (img && img.trim() !== '' && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list.length > 0 ? list : (project.image ? [project.image] : []);
  }, [project.image, project.galleryImages]);

  const handleOpenZoom = (targetImgUrl: string) => {
    playClickSound();
    const idx = allImages.indexOf(targetImgUrl);
    setZoomInitialIndex(idx >= 0 ? idx : 0);
    setIsZoomOpen(true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

  return (
    <div className="min-h-screen bg-[#050B05] text-white pt-24 pb-28 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#76FF03]/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* Top Navigation Row */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onBackToPortfolio();
          }}
          onMouseEnter={playHoverSound}
          className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#76FF03] text-gray-300 hover:text-[#050B05] border border-white/10 hover:border-[#76FF03] transition-all duration-300 cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs sm:text-sm font-bold font-mono tracking-wider uppercase">
            {lang === 'es' ? 'Volver al Portafolio' : 'Back to Portfolio'}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#76FF03] bg-[#76FF03]/10 border border-[#76FF03]/30 px-3 py-1 rounded-full uppercase tracking-wider">
            {project.category} • {project.year}
          </span>
        </div>
      </div>

      {/* Giant Wix-Style Project Title Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 mb-8">
          <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase italic tracking-tighter text-white leading-none inline-block break-words max-w-full">
            {project.title}
          </h1>

          {project.logo && (
            <div className="inline-flex items-center justify-center p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-md shadow-[0_0_25px_rgba(118,255,3,0.18)] hover:border-[#76FF03]/60 hover:scale-105 transition-all duration-300">
              <img
                src={project.logo}
                alt={`${project.title} Logo`}
                className="h-14 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[140px] sm:max-w-[200px] md:max-w-[260px] object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              />
            </div>
          )}
        </div>
        <div className="w-full h-px bg-white/15 mb-12" />

        {/* 2-Column Wix Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column: Role & Full Description */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-1.5">
                {lang === 'es' ? 'ROL' : 'ROLE'}
              </span>
              <p className="text-base sm:text-lg text-white font-bold tracking-wide">
                {project.client} • {lang === 'es' ? 'Diseñadora Principal' : 'Lead Designer'}
              </p>
            </div>

            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-2">
                {lang === 'es' ? 'DESCRIPCIÓN' : 'DESCRIPTION'}
              </span>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                {project.fullDesc || project.shortDesc}
              </p>
            </div>

            {project.metrics && project.metrics.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-2">
                  {lang === 'es' ? 'IMPACTO & RESULTADOS' : 'IMPACT & RESULTS'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-[#76FF03]/10 border border-[#76FF03]/30 px-3.5 py-1.5 rounded-xl text-xs font-mono text-[#76FF03]"
                    >
                      <span className="font-bold text-white mr-1.5">{m.value}</span>
                      <span className="text-[11px] text-gray-300">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Year, Category, Platform/Tools */}
          <div className="md:col-span-5 space-y-6 md:border-l md:border-white/10 md:pl-10">
            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-1">
                {lang === 'es' ? 'AÑO' : 'YEAR'}
              </span>
              <p className="text-base sm:text-lg text-white font-mono font-bold">
                {project.year}
              </p>
            </div>

            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-1">
                {lang === 'es' ? 'GÉNERO / CATEGORÍA' : 'GENRE / CATEGORY'}
              </span>
              <p className="text-base sm:text-lg text-white font-medium">
                {project.category}
              </p>
            </div>

            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-1">
                {lang === 'es' ? 'HERRAMIENTAS / PLATAFORMA' : 'TOOLS / PLATFORM'}
              </span>
              <p className="text-sm sm:text-base text-gray-300 font-mono">
                {project.tags.join(' • ')}
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <SpecularButton
                onClick={() => {
                  playClickSound();
                  onOpenProjectPlanner();
                }}
                onMouseEnter={playHoverSound}
                variant="primary"
                size="md"
                radius={12}
                className="w-full text-xs font-bold font-mono tracking-wider flex items-center justify-center space-x-2 text-[#76FF03]"
              >
                <Sparkles className="w-4 h-4 text-[#76FF03]" />
                <span>{lang === 'es' ? 'COTIZAR PROYECTO SIMILAR' : 'QUOTE SIMILAR PROJECT'}</span>
              </SpecularButton>

              {/* Dynamic External Link Button ("VER MÁS DEL TRABAJO") - Configurable from Dashboard */}
              <a
                href={project.externalLink && project.externalLink.trim() !== '' ? project.externalLink : 'https://www.behance.net/aylinflores'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                onMouseEnter={playHoverSound}
                className="w-full group/extbtn relative inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#76FF03]/20 via-[#76FF03]/10 to-transparent hover:from-[#76FF03] hover:to-[#38B000] border border-[#76FF03]/60 hover:border-[#76FF03] text-[#76FF03] hover:text-[#050B05] font-mono text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(118,255,3,0.15)] hover:shadow-[0_0_30px_rgba(118,255,3,0.7)] hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 transition-transform group-hover/extbtn:translate-x-0.5 group-hover/extbtn:-translate-y-0.5" />
                <span>
                  {project.externalLinkText && project.externalLinkText.trim() !== ''
                    ? project.externalLinkText
                    : lang === 'es'
                    ? 'VER MÁS DEL TRABAJO'
                    : 'EXPLORE FULL WORK'}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Full-Bleed Media Showcase (Video Player / Hero Artwork) */}
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14 mt-16">
        {/* Dynamic Media Switcher Tabs if project has multiple visual/audiovisual elements */}
        {mediaCollection.items.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-white/[0.03] backdrop-blur-md max-w-fit mx-auto">
            {mediaCollection.items.map((item) => {
              const isSelected = item.id === currentMedia?.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSelectedMediaId(item.id);
                  }}
                  onMouseEnter={playHoverSound}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#76FF03] text-[#050B05] shadow-[0_0_25px_rgba(118,255,3,0.45)] scale-[1.02]'
                      : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.sourceType === 'youtube' ? (
                    <Play className={`w-3.5 h-3.5 ${isSelected ? 'fill-black' : 'fill-current text-red-400'}`} />
                  ) : item.sourceType === 'clip' ? (
                    <Film className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-cyan-400'}`} />
                  ) : item.sourceType === 'gif' ? (
                    <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-purple-400'}`} />
                  ) : (
                    <ZoomIn className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {item.sourceType === 'youtube'
                      ? lang === 'es'
                        ? 'Video YouTube'
                        : 'YouTube Video'
                      : item.sourceType === 'clip'
                      ? lang === 'es'
                        ? 'Clip Directo (MP4)'
                        : 'Direct Clip (MP4)'
                      : item.sourceType === 'gif'
                      ? lang === 'es'
                        ? 'GIF Animado'
                        : 'Animated GIF'
                      : lang === 'es'
                      ? 'Render Hero (Zoom HD)'
                      : 'Hero Render (Zoom HD)'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Media Showcase Player / Viewer */}
        {currentMedia && (
          <div
            id="main-media-showcase"
            className="w-full rounded-3xl overflow-hidden bg-black shadow-2xl relative transition-all duration-500"
          >
            {/* 1. YouTube or Vimeo Video Embed */}
            {currentMedia.type === 'youtube' || currentMedia.type === 'vimeo' ? (
              <div className="relative w-full aspect-video">
                <iframe
                  key={currentMedia.embedUrl}
                  src={currentMedia.embedUrl}
                  title={project.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : currentMedia.type === 'video' ? (
              /* 2. Direct Video Clip Player (HTML5 Native MP4/WebM) */
              <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-black">
                <video
                  key={currentMedia.videoSrc}
                  src={currentMedia.videoSrc}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-auto max-h-[85vh] object-contain mx-auto rounded-2xl shadow-2xl"
                />
              </div>
            ) : currentMedia.type === 'gif' ? (
              /* 3. Animated GIF Showcase */
              <div
                onClick={() => handleOpenZoom(currentMedia.gifSrc || currentMedia.url)}
                onMouseEnter={playHoverSound}
                className="w-full rounded-3xl overflow-hidden bg-[#0a120a] relative group cursor-pointer transition-all duration-500 p-2 sm:p-4 flex items-center justify-center"
                title={lang === 'es' ? 'Clic para ampliar GIF' : 'Click to expand GIF'}
              >
                <img
                  src={currentMedia.gifSrc || currentMedia.url}
                  alt={project.title}
                  className="w-full h-auto max-h-[85vh] object-contain mx-auto transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                />
              </div>
            ) : (
              /* 4. Main Hero Artwork with Interactive Zoom Overlay */
              <div
                onClick={() => handleOpenZoom(currentMedia.imageSrc || currentMedia.url)}
                onMouseEnter={playHoverSound}
                className="w-full rounded-3xl overflow-hidden bg-[#0a120a] relative group cursor-pointer transition-all duration-500 p-2 sm:p-4 flex items-center justify-center"
                title={lang === 'es' ? 'Clic para ampliar y hacer zoom en alta resolución' : 'Click to expand and zoom in high-res'}
              >
                <img
                  src={currentMedia.imageSrc || currentMedia.url}
                  alt={project.title}
                  onError={(e) => handleImgError(e, currentMedia.imageSrc || currentMedia.url, project.category)}
                  className="w-full h-auto max-h-[85vh] object-contain mx-auto transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                />

                {/* Floating Zoom Badge */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md text-gray-200 group-hover:text-white transition-all shadow-xl font-mono text-xs font-bold">
                    <ZoomIn className="w-4 h-4 text-[#76FF03] group-hover:scale-110 transition-transform" />
                    <span>{lang === 'es' ? 'Hacer Zoom / Ver Detalle' : 'Zoom In / View Details'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Header Badge indicating the currently playing media */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 pointer-events-none">
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-black/85 backdrop-blur-md text-[#76FF03] text-xs font-mono font-bold shadow-lg">
                {currentMedia.isVideo ? (
                  <Play className="w-3 h-3 fill-[#76FF03]" />
                ) : currentMedia.type === 'gif' ? (
                  <Sparkles className="w-3 h-3 text-[#76FF03]" />
                ) : (
                  <ZoomIn className="w-3 h-3 text-[#76FF03]" />
                )}
                <span>
                  {currentMedia.badge} • {currentMedia.title}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Audiovisual Media Grid: Shows all videos/clips when project has multiple videos */}
        {mediaCollection.videos.length > 1 && (
          <div className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#76FF03] uppercase block mb-1">
                  {lang === 'es' ? 'PRODUCCIONES AUDIOVISUALES' : 'AUDIOVISUAL PRODUCTIONS'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
                  {lang === 'es' ? 'VIDEOS & CLIPS DE ESTE PROYECTO' : 'PROJECT VIDEOS & CLIPS'}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-gray-400 mt-1">
                  {lang === 'es'
                    ? 'Este proyecto cuenta con múltiples producciones de video. Selecciona cualquiera para reproducirlo en el visor principal.'
                    : 'This project features multiple video productions. Select any to play in the main showcase viewer.'}
                </p>
              </div>

              <span className="text-xs font-mono text-[#76FF03] bg-[#76FF03]/10 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto font-bold">
                <Film className="w-3.5 h-3.5 text-[#76FF03]" />
                <span>
                  {mediaCollection.videos.length}{' '}
                  {lang === 'es' ? 'Videos Disponibles' : 'Videos Available'}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {mediaCollection.videos.map((vidItem, vIdx) => {
                const isCurrent = vidItem.id === currentMedia?.id;
                return (
                  <div
                    key={vidItem.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedMediaId(vidItem.id);
                      const el = document.getElementById('main-media-showcase');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    onMouseEnter={playHoverSound}
                    className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                      isCurrent
                        ? 'bg-[#76FF03]/10 shadow-[0_0_35px_rgba(118,255,3,0.2)] ring-1 ring-[#76FF03]'
                        : 'bg-white/[0.03] hover:bg-white/[0.07] shadow-lg hover:shadow-2xl'
                    }`}
                  >
                    <div>
                      {/* Top Bar with Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-black/80 text-[#76FF03] flex items-center gap-1.5 shadow">
                          <Film className="w-3 h-3 text-[#76FF03]" />
                          <span>{vidItem.badge}</span>
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {lang === 'es' ? `Video #${vIdx + 1}` : `Video #${vIdx + 1}`}
                        </span>
                      </div>

                      {/* Mini Video / Thumbnail Preview Box */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center mb-4 shadow-md">
                        {vidItem.type === 'video' ? (
                          <video
                            src={vidItem.videoSrc}
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img
                            src={vidItem.thumbnailUrl || project.image}
                            alt={vidItem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}

                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${
                              isCurrent
                                ? 'bg-[#76FF03] text-[#050B05] scale-110 shadow-[0_0_20px_#76FF03]'
                                : 'bg-black/80 text-[#76FF03] group-hover:scale-110'
                            }`}
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Video Title & Subtitle */}
                      <h4 className="text-base sm:text-lg font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors leading-snug">
                        {vidItem.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        {vidItem.subtitle}
                      </p>
                    </div>

                    {/* Footer Status and Play Button */}
                    <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-bold flex items-center gap-2 ${
                          isCurrent ? 'text-[#76FF03]' : 'text-gray-300 group-hover:text-white'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-ping" />
                            <span>{lang === 'es' ? 'Reproduciendo en Visor' : 'Playing in Viewer'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-[#76FF03] fill-[#76FF03]" />
                            <span>{lang === 'es' ? 'Reproducir este Video' : 'Play this Video'}</span>
                          </>
                        )}
                      </span>

                      {vidItem.url && vidItem.type === 'youtube' && (
                        <a
                          href={vidItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-mono text-gray-400 hover:text-[#76FF03] flex items-center gap-1 transition-colors"
                          title="Abrir directamente en YouTube"
                        >
                          <span>YouTube</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sub-Gallery Section Header */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <div className="pt-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tight text-white">
                  {lang === 'es' ? 'VISTAS DE DETALLE & RENDER' : 'DETAIL VIEWS & RENDERS'}
                </h2>
                <p className="text-xs sm:text-sm font-mono text-gray-400 mt-1">
                  {lang === 'es'
                    ? `Galería de renders de producción (${project.galleryImages.length} ${project.galleryImages.length === 1 ? 'render' : 'renders'}) • Clic en cualquier imagen para hacer zoom detallado`
                    : `Production renders gallery (${project.galleryImages.length} ${project.galleryImages.length === 1 ? 'render' : 'renders'}) • Click any image for deep detail zoom`}
                </p>
              </div>

              <span className="self-start sm:self-auto text-xs font-mono text-[#76FF03] bg-[#76FF03]/10 border border-[#76FF03]/30 px-3 py-1.5 rounded-full flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {project.galleryImages.length}{' '}
                  {lang === 'es'
                    ? project.galleryImages.length === 1
                    ? 'Render'
                    : 'Renders'
                    : 'Renders'}
                </span>
              </span>
            </div>

            {/* Grid of Project Renders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {project.galleryImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenZoom(imgSrc)}
                  onMouseEnter={playHoverSound}
                  className="rounded-3xl overflow-hidden bg-[#081208] border border-white/15 hover:border-[#76FF03] hover:shadow-[0_0_35px_rgba(118,255,3,0.25)] transition-all duration-500 shadow-xl group aspect-[16/10] flex items-center justify-center p-4 relative cursor-pointer"
                  title={lang === 'es' ? `Ver render #${idx + 1} y hacer zoom` : `View render #${idx + 1} and zoom`}
                >
                  {/* Slot Number Tag */}
                  <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-gray-300 group-hover:text-[#76FF03] group-hover:border-[#76FF03]/50 transition-colors">
                    VISTA #{idx + 1}
                  </div>

                  {/* The Image */}
                  <img
                    src={imgSrc}
                    alt={`${project.title} detail ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => handleImgError(e, imgSrc, project.category)}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Hover Floating Button "Hacer Zoom" */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#76FF03] text-[#050B05] font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(118,255,3,0.8)] scale-90 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn className="w-4 h-4" />
                      <span>{lang === 'es' ? 'Hacer Zoom & Ver Detalles' : 'Zoom In & View Details'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive High-Res Zoom & Lightbox Modal */}
      <ProjectImageZoomModal
        isOpen={isZoomOpen}
        images={allImages}
        initialIndex={zoomInitialIndex}
        projectTitle={project.title}
        lang={lang}
        onClose={() => setIsZoomOpen(false)}
      />

      {/* Bottom Wix-Style Project Navigator */}
      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/15">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Previous Project Link */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onSelectProject(prevProject);
            }}
            onMouseEnter={playHoverSound}
            className="group flex items-center gap-3 text-left cursor-pointer transition-transform hover:-translate-x-1"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 group-hover:border-[#76FF03] group-hover:bg-[#76FF03] text-white group-hover:text-[#050B05] flex items-center justify-center transition-all duration-300">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                {lang === 'es' ? 'PROYECTO ANTERIOR' : 'PREVIOUS PROJECT'}
              </span>
              <span className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors">
                {prevProject.title}
              </span>
            </div>
          </button>

          {/* Center Back to Portfolio */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onBackToPortfolio();
            }}
            onMouseEnter={playHoverSound}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-mono font-bold tracking-widest text-gray-300 hover:text-white border border-white/10 uppercase transition-all"
          >
            {lang === 'es' ? 'TODOS LOS PROYECTOS' : 'ALL PROJECTS'}
          </button>

          {/* Next Project Link */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onSelectProject(nextProject);
            }}
            onMouseEnter={playHoverSound}
            className="group flex items-center gap-3 text-right cursor-pointer transition-transform hover:translate-x-1"
          >
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                {lang === 'es' ? 'SIGUIENTE PROYECTO' : 'NEXT PROJECT'}
              </span>
              <span className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-white group-hover:text-[#76FF03] transition-colors">
                {nextProject.title}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/20 group-hover:border-[#76FF03] group-hover:bg-[#76FF03] text-white group-hover:text-[#050B05] flex items-center justify-center transition-all duration-300">
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
