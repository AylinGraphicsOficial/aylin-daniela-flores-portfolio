export type MediaType = 'youtube' | 'vimeo' | 'video' | 'gif' | 'image';

export interface MediaDetectionResult {
  type: MediaType;
  originalUrl: string;
  embedUrl?: string;
  videoId?: string;
  thumbnailUrl?: string;
  isValid: boolean;
}

export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const shortsMatch = trimmed.match(/(?:youtube\.com|youtu\.be)\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1].split('?')[0];
  const standardMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (standardMatch && standardMatch[1]) return standardMatch[1];
  return null;
}

export function extractVimeoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const match = url.trim().match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/i);
  return match && match[1] ? match[1] : null;
}

export function detectMedia(url?: string): MediaDetectionResult {
  if (!url || !url.trim()) {
    return { type: 'image', originalUrl: '', isValid: false };
  }
  const cleanUrl = url.trim();
  const ytId = extractYouTubeId(cleanUrl);
  if (ytId) {
    return {
      type: 'youtube',
      originalUrl: cleanUrl,
      videoId: ytId,
      embedUrl: 'https://www.youtube-nocookie.com/embed/' + ytId + '?rel=0&modestbranding=1',
      thumbnailUrl: 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg',
      isValid: true,
    };
  }
  const vimeoId = extractVimeoId(cleanUrl);
  if (vimeoId) {
    return {
      type: 'vimeo',
      originalUrl: cleanUrl,
      videoId: vimeoId,
      embedUrl: 'https://player.vimeo.com/video/' + vimeoId + '?title=0&byline=0&portrait=0',
      isValid: true,
    };
  }
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(cleanUrl) || cleanUrl.includes('/uploads/video_') || cleanUrl.includes('/uploads/clip_')) {
    return {
      type: 'video',
      originalUrl: cleanUrl,
      embedUrl: cleanUrl,
      isValid: true,
    };
  }
  if (/\.(gif)(\?.*)?$/i.test(cleanUrl) || cleanUrl.includes('.gif')) {
    return {
      type: 'gif',
      originalUrl: cleanUrl,
      thumbnailUrl: cleanUrl,
      isValid: true,
    };
  }
  return {
    type: 'image',
    originalUrl: cleanUrl,
    thumbnailUrl: cleanUrl,
    isValid: true,
  };
}

export interface ProjectPrimaryMedia {
  type: 'youtube' | 'vimeo' | 'video' | 'gif' | 'image';
  embedUrl?: string;
  videoSrc?: string;
  clipSrc?: string;
  gifSrc?: string;
  imageSrc: string;
  thumbnailUrl: string;
  hasVideo: boolean;
  hasMultipleVideos?: boolean;
}

export interface ProjectMediaItem {
  id: string;
  type: 'youtube' | 'vimeo' | 'video' | 'gif' | 'image';
  sourceType: 'youtube' | 'vimeo' | 'clip' | 'gif' | 'render' | 'gallery';
  title: string;
  subtitle?: string;
  url: string;
  embedUrl?: string;
  videoSrc?: string;
  gifSrc?: string;
  imageSrc?: string;
  thumbnailUrl: string;
  badge: string;
  badgeColor?: string;
  isVideo: boolean;
  isPrimary?: boolean;
}

export interface ProjectMediaCollection {
  primaryMedia: ProjectPrimaryMedia;
  items: ProjectMediaItem[];
  videos: ProjectMediaItem[];
  hasMultipleVideos: boolean;
  hasVideo: boolean;
  hasClip: boolean;
  hasGif: boolean;
  hasHeroImage: boolean;
  totalMediaCount: number;
}

export function getProjectPrimaryMedia(project: {
  videoUrl?: string;
  videoClip?: string;
  gifUrl?: string;
  image?: string;
}): ProjectPrimaryMedia {
  const customImage = project.image && project.image.trim() ? project.image.trim() : '';
  const hasClip = Boolean(project.videoClip && project.videoClip.trim());
  const hasUrl = Boolean(project.videoUrl && project.videoUrl.trim());
  const hasMultipleVideos = hasUrl && hasClip;

  if (project.videoUrl && project.videoUrl.trim()) {
    const detected = detectMedia(project.videoUrl);
    if (detected.type === 'youtube' || detected.type === 'vimeo' || detected.type === 'video') {
      return {
        type: detected.type,
        embedUrl: detected.embedUrl,
        videoSrc: detected.type === 'video' ? detected.originalUrl : undefined,
        clipSrc: hasClip ? project.videoClip?.trim() : undefined,
        imageSrc: customImage || detected.thumbnailUrl || '',
        thumbnailUrl: customImage || detected.thumbnailUrl || '',
        hasVideo: true,
        hasMultipleVideos,
      };
    }
  }
  if (project.videoClip && project.videoClip.trim()) {
    return {
      type: 'video',
      videoSrc: project.videoClip.trim(),
      clipSrc: project.videoClip.trim(),
      embedUrl: project.videoClip.trim(),
      imageSrc: customImage || '',
      thumbnailUrl: customImage || '',
      hasVideo: true,
      hasMultipleVideos: false,
    };
  }
  if (project.gifUrl && project.gifUrl.trim()) {
    return {
      type: 'gif',
      gifSrc: project.gifUrl.trim(),
      imageSrc: customImage || project.gifUrl.trim(),
      thumbnailUrl: customImage || project.gifUrl.trim(),
      hasVideo: false,
      hasMultipleVideos: false,
    };
  }
  if (customImage) {
    const detectedImg = detectMedia(customImage);
    if (detectedImg.type === 'youtube' || detectedImg.type === 'vimeo' || detectedImg.type === 'video') {
      return {
        type: detectedImg.type,
        embedUrl: detectedImg.embedUrl,
        videoSrc: detectedImg.type === 'video' ? detectedImg.originalUrl : undefined,
        imageSrc: customImage || detectedImg.thumbnailUrl || '',
        thumbnailUrl: customImage || detectedImg.thumbnailUrl || '',
        hasVideo: true,
        hasMultipleVideos: false,
      };
    }
    if (detectedImg.type === 'gif') {
      return {
        type: 'gif',
        gifSrc: customImage,
        imageSrc: customImage,
        thumbnailUrl: customImage,
        hasVideo: false,
        hasMultipleVideos: false,
      };
    }
  }
  return {
    type: 'image',
    imageSrc: customImage,
    thumbnailUrl: customImage,
    hasVideo: false,
    hasMultipleVideos: false,
  };
}

export function getProjectMediaCollection(project: {
  videoUrl?: string;
  videoClip?: string;
  gifUrl?: string;
  image?: string;
  galleryImages?: string[];
}): ProjectMediaCollection {
  const items: ProjectMediaItem[] = [];
  const customImage = project.image && project.image.trim() ? project.image.trim() : '';

  // 1. YouTube / Vimeo Video URL
  if (project.videoUrl && project.videoUrl.trim()) {
    const detected = detectMedia(project.videoUrl);
    if (detected.type === 'youtube' || detected.type === 'vimeo' || detected.type === 'video') {
      const isYt = detected.type === 'youtube';
      const isVm = detected.type === 'vimeo';
      items.push({
        id: 'media-video-url',
        type: detected.type,
        sourceType: isYt ? 'youtube' : isVm ? 'vimeo' : 'clip',
        title: isYt ? 'Video Principal en YouTube' : isVm ? 'Video Principal en Vimeo' : 'Video Principal (Enlace)',
        subtitle: isYt ? 'Reproducción HD / YouTube' : isVm ? 'Reproducción Vimeo HD' : 'Transmisión Web',
        url: detected.originalUrl,
        embedUrl: detected.embedUrl,
        videoSrc: detected.type === 'video' ? detected.originalUrl : undefined,
        thumbnailUrl: customImage || detected.thumbnailUrl || '',
        badge: isYt ? 'YOUTUBE' : isVm ? 'VIMEO' : 'VIDEO WEB',
        badgeColor: isYt ? '#FF0000' : isVm ? '#1AB7EA' : '#76FF03',
        isVideo: true,
        isPrimary: true,
      });
    }
  }

  // 2. Direct Video Clip (MP4/WebM)
  if (project.videoClip && project.videoClip.trim()) {
    const clipUrl = project.videoClip.trim();
    items.push({
      id: 'media-video-clip',
      type: 'video',
      sourceType: 'clip',
      title: 'Clip de Video Directo (MP4/WebM)',
      subtitle: 'Video nativo en alta definición subido a Hostinger',
      url: clipUrl,
      embedUrl: clipUrl,
      videoSrc: clipUrl,
      thumbnailUrl: customImage || '',
      badge: 'CLIP MP4',
      badgeColor: '#00E5FF',
      isVideo: true,
      isPrimary: items.length === 0,
    });
  }

  // 3. Animated GIF
  if (project.gifUrl && project.gifUrl.trim()) {
    const gif = project.gifUrl.trim();
    items.push({
      id: 'media-gif',
      type: 'gif',
      sourceType: 'gif',
      title: 'Animación en Formato GIF',
      subtitle: 'Secuencia gráfica animada en bucle',
      url: gif,
      gifSrc: gif,
      thumbnailUrl: gif,
      badge: 'GIF ANIMADO',
      badgeColor: '#A855F7',
      isVideo: false,
      isPrimary: items.length === 0,
    });
  }

  // 4. Hero Render / Main Image
  if (customImage) {
    items.push({
      id: 'media-hero-image',
      type: 'image',
      sourceType: 'render',
      title: 'Render Hero / Portada Principal',
      subtitle: 'Imagen promocional en alta resolución con zoom interactivo',
      url: customImage,
      imageSrc: customImage,
      thumbnailUrl: customImage,
      badge: 'RENDER HD',
      badgeColor: '#76FF03',
      isVideo: false,
      isPrimary: items.length === 0,
    });
  }

  // 5. Check if any gallery items are videos or clips
  if (project.galleryImages && project.galleryImages.length > 0) {
    project.galleryImages.forEach((gUrl, idx) => {
      if (!gUrl || !gUrl.trim()) return;
      const cleanGUrl = gUrl.trim();
      const detected = detectMedia(cleanGUrl);
      if (detected.isValid && (detected.type === 'video' || detected.type === 'youtube' || detected.type === 'vimeo')) {
        items.push({
          id: `media-gallery-video-${idx}`,
          type: detected.type,
          sourceType: detected.type === 'video' ? 'clip' : detected.type,
          title: `Video Adicional #${idx + 1}`,
          subtitle: 'Clip audiovisual complementario',
          url: cleanGUrl,
          embedUrl: detected.embedUrl,
          videoSrc: detected.type === 'video' ? detected.originalUrl : undefined,
          thumbnailUrl: detected.thumbnailUrl || customImage || '',
          badge: detected.type === 'youtube' ? 'YOUTUBE' : 'CLIP ADICIONAL',
          badgeColor: '#00E5FF',
          isVideo: true,
          isPrimary: false,
        });
      }
    });
  }

  const primaryMedia = getProjectPrimaryMedia(project);
  const videos = items.filter((i) => i.isVideo);
  const hasMultipleVideos = videos.length > 1;

  return {
    primaryMedia,
    items,
    videos,
    hasMultipleVideos,
    hasVideo: videos.length > 0,
    hasClip: Boolean(project.videoClip && project.videoClip.trim()),
    hasGif: Boolean(project.gifUrl && project.gifUrl.trim()),
    hasHeroImage: Boolean(customImage),
    totalMediaCount: items.length,
  };
}

/**
 * Detecta si una imagen es una silueta o render aislado sin fondo (canal alfa transparente).
 * Casos emblemáticos del portafolio:
 * - Stand Diana (Stand_Diana-principal_300x.webp / orbit-stand-diana)
 * - Los Rebusca (imagen_naipes_300x.webp / cartas de baraja)
 * - Renders de productos aislados o logos vectoriales sobre fondo transparente.
 */
export function isCutoutMedia(url?: string, title?: string): boolean {
  if (!url) return false;
  const cleanUrl = url.toLowerCase().trim();
  const cleanTitle = (title || '').toLowerCase().trim();

  // Los videos, clips y JPEGs por definición técnica tienen fondo opaco completo
  if (
    cleanUrl.endsWith('.jpg') ||
    cleanUrl.endsWith('.jpeg') ||
    cleanUrl.includes('.jpg?') ||
    cleanUrl.includes('.jpeg?') ||
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.mov') ||
    cleanUrl.includes('youtube.com') ||
    cleanUrl.includes('youtu.be') ||
    cleanUrl.includes('vimeo.com')
  ) {
    return false;
  }

  // Patrones claros de imágenes sin fondo / siluetas transparentes
  const cutoutPatterns = [
    'stand_diana',
    'stand diana',
    'orbit-stand',
    'los-rebusca',
    'los rebusca',
    'naipes',
    'naipe',
    'holy-nation',
    'cutout',
    'isolated',
    'transparen',
    'sin-fondo',
    'sin_fondo',
    'nofondo',
    'alpha',
    'silueta',
  ];

  return cutoutPatterns.some((pattern) => cleanUrl.includes(pattern) || cleanTitle.includes(pattern));
}

export interface MediaPreviewFitOptions {
  url?: string;
  hasVideo?: boolean;
  explicitFit?: 'cover' | 'contain' | 'auto';
  title?: string;
}

/**
 * Determina el modo de ajuste estético para previsualización ('cover' o 'contain').
 * - 'cover': Ocupa el 100% del área del contenedor sin bordes ni franjas negras (p-0 + object-cover).
 * - 'contain': Mantiene la silueta centrada y protegida con padding (p-3/p-4 + object-contain).
 */
export function getMediaPreviewFit(options: MediaPreviewFitOptions): 'cover' | 'contain' {
  const { url, hasVideo, explicitFit, title } = options;

  if (explicitFit === 'cover') return 'cover';
  if (explicitFit === 'contain') return 'contain';

  // Si tiene video (YouTube, MP4 o reel), siempre debe llenar el contenedor completo
  if (hasVideo) return 'cover';

  if (!url) return 'cover';

  // Si es detectado como silueta o render aislado sin fondo
  if (isCutoutMedia(url, title)) {
    return 'contain';
  }

  // Por defecto, imágenes con fondo completo, fotografías, renders con escena y banners ocupan el 100%
  return 'cover';
}