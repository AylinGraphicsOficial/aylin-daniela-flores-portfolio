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
  gifSrc?: string;
  imageSrc: string;
  thumbnailUrl: string;
  hasVideo: boolean;
}

export function getProjectPrimaryMedia(project: {
  videoUrl?: string;
  videoClip?: string;
  gifUrl?: string;
  image?: string;
}): ProjectPrimaryMedia {
  if (project.videoUrl && project.videoUrl.trim()) {
    const detected = detectMedia(project.videoUrl);
    if (detected.type === 'youtube' || detected.type === 'vimeo' || detected.type === 'video') {
      return {
        type: detected.type,
        embedUrl: detected.embedUrl,
        videoSrc: detected.type === 'video' ? detected.originalUrl : undefined,
        imageSrc: project.image || detected.thumbnailUrl || '',
        thumbnailUrl: detected.thumbnailUrl || project.image || '',
        hasVideo: true,
      };
    }
  }
  if (project.videoClip && project.videoClip.trim()) {
    return {
      type: 'video',
      videoSrc: project.videoClip.trim(),
      embedUrl: project.videoClip.trim(),
      imageSrc: project.image || '',
      thumbnailUrl: project.image || '',
      hasVideo: true,
    };
  }
  if (project.gifUrl && project.gifUrl.trim()) {
    return {
      type: 'gif',
      gifSrc: project.gifUrl.trim(),
      imageSrc: project.gifUrl.trim(),
      thumbnailUrl: project.gifUrl.trim(),
      hasVideo: false,
    };
  }
  if (project.image && project.image.trim()) {
    const detectedImg = detectMedia(project.image);
    if (detectedImg.type === 'youtube' || detectedImg.type === 'vimeo' || detectedImg.type === 'video') {
      return {
        type: detectedImg.type,
        embedUrl: detectedImg.embedUrl,
        videoSrc: detectedImg.type === 'video' ? detectedImg.originalUrl : undefined,
        imageSrc: detectedImg.thumbnailUrl || project.image,
        thumbnailUrl: detectedImg.thumbnailUrl || project.image,
        hasVideo: true,
      };
    }
    if (detectedImg.type === 'gif') {
      return {
        type: 'gif',
        gifSrc: project.image,
        imageSrc: project.image,
        thumbnailUrl: project.image,
        hasVideo: false,
      };
    }
  }
  return {
    type: 'image',
    imageSrc: project.image || '',
    thumbnailUrl: project.image || '',
    hasVideo: false,
  };
}