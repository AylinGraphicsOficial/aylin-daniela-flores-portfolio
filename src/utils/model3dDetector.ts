/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Detector & Parser de Modelos 3D y Plataformas Externas
 *
 * Soporta:
 * 1. Sketchfab (URLs de modelos, IDs, embeds y snippets de iframe)
 * 2. Spline 3D (URLs de my.spline.design y snippets)
 * 3. Vectary 3D (app.vectary.com/p/...)
 * 4. URLs directas .GLB / .GLTF (locales /uploads/ o externas en CDN / GitHub / Drive)
 * 5. Snippets genéricos de <iframe> de visores 3D
 * 6. Modelos procedurales Three.js
 */

export type Model3DPlatform =
  | 'sketchfab'
  | 'spline'
  | 'vectary'
  | 'glb'
  | 'embed'
  | 'procedural';

export interface Model3DDetection {
  platform: Model3DPlatform;
  isEmbed: boolean;
  embedUrl: string;
  externalUrl?: string;
  directGlbUrl?: string;
  titleSuggestion?: string;
  platformName: string;
  badge: string;
  icon: string;
  iconColor: string;
  rawInput: string;
}

/**
 * Extrae la URL contenida en el atributo `src` de un fragmento HTML `<iframe>`
 */
export function extractIframeSrc(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed.includes('<iframe')) return null;

  const match = trimmed.match(/src=["']([^"']+)["']/i);
  if (match && match[1]) {
    return match[1].replace(/&amp;/g, '&');
  }
  return null;
}

/**
 * Convierte un slug de Sketchfab o nombre de archivo en un título legible
 * ej: "vintage-cyber-car-950c4558509e403d8dca86a82c40c886" -> "Vintage Cyber Car"
 */
function slugToTitle(slug: string): string {
  if (!slug) return '';
  // Quitar hash hexadecimal de 32 caracteres si viene pegado al final
  const cleaned = slug.replace(/-[a-f0-9]{32}$/i, '');
  return cleaned
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Analiza enlaces de Sketchfab (modelos, embeds o iframes)
 */
export function parseSketchfab(input: string): {
  id: string;
  embedUrl: string;
  externalUrl: string;
  titleSuggestion?: string;
} | null {
  if (!input || typeof input !== 'string') return null;

  // Extraer si viene dentro de un iframe
  const iframeSrc = extractIframeSrc(input);
  const target = iframeSrc || input.trim();

  // 1. Coincidencia con slug completo: sketchfab.com/3d-models/[slug]-[id]
  const fullSlugMatch = target.match(
    /sketchfab\.com\/3d-models\/([a-z0-9-_]+)-([a-f0-9]{32})/i
  );
  if (fullSlugMatch && fullSlugMatch[2]) {
    const slug = fullSlugMatch[1];
    const id = fullSlugMatch[2].toLowerCase();
    return {
      id,
      embedUrl: `https://sketchfab.com/models/${id}/embed?autostart=1&camera=0&ui_theme=dark&ui_watermark=0&ui_infos=0&ui_controls=1&ui_annotations=0`,
      externalUrl: `https://sketchfab.com/3d-models/${slug}-${id}`,
      titleSuggestion: slugToTitle(slug),
    };
  }

  // 2. Coincidencia con models/[id] o models/[id]/embed
  const modelIdMatch = target.match(/sketchfab\.com\/models\/([a-f0-9]{32})/i);
  if (modelIdMatch && modelIdMatch[1]) {
    const id = modelIdMatch[1].toLowerCase();
    return {
      id,
      embedUrl: `https://sketchfab.com/models/${id}/embed?autostart=1&camera=0&ui_theme=dark&ui_watermark=0&ui_infos=0&ui_controls=1&ui_annotations=0`,
      externalUrl: `https://sketchfab.com/models/${id}`,
    };
  }

  // 3. Coincidencia con cualquier ID de 32 chars en dominio sketchfab
  if (target.includes('sketchfab.com')) {
    const anyIdMatch = target.match(/([a-f0-9]{32})/i);
    if (anyIdMatch && anyIdMatch[1]) {
      const id = anyIdMatch[1].toLowerCase();
      return {
        id,
        embedUrl: `https://sketchfab.com/models/${id}/embed?autostart=1&camera=0&ui_theme=dark&ui_watermark=0&ui_infos=0&ui_controls=1&ui_annotations=0`,
        externalUrl: `https://sketchfab.com/models/${id}`,
      };
    }
  }

  return null;
}

/**
 * Analiza enlaces de Spline 3D
 */
export function parseSpline(input: string): {
  embedUrl: string;
  externalUrl: string;
  titleSuggestion?: string;
} | null {
  if (!input || typeof input !== 'string') return null;

  const iframeSrc = extractIframeSrc(input);
  const target = iframeSrc || input.trim();

  // Coincidencia con my.spline.design/[id]
  const splineMatch = target.match(/my\.spline\.design\/([a-zA-Z0-9-_]+)/i);
  if (splineMatch && splineMatch[1]) {
    const id = splineMatch[1];
    return {
      embedUrl: `https://my.spline.design/${id}/`,
      externalUrl: `https://my.spline.design/${id}/`,
      titleSuggestion: slugToTitle(id),
    };
  }

  return null;
}

/**
 * Analiza enlaces de Vectary 3D
 */
export function parseVectary(input: string): {
  embedUrl: string;
  externalUrl: string;
} | null {
  if (!input || typeof input !== 'string') return null;

  const iframeSrc = extractIframeSrc(input);
  const target = iframeSrc || input.trim();

  const match = target.match(/app\.vectary\.com\/p\/([a-zA-Z0-9-_]+)/i);
  if (match && match[1]) {
    const id = match[1];
    return {
      embedUrl: `https://app.vectary.com/p/${id}/`,
      externalUrl: `https://app.vectary.com/p/${id}/`,
    };
  }

  return null;
}

/**
 * Determina si la URL corresponde a un archivo GLB/GLTF directo
 */
export function isDirectGlbUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().split('?')[0].toLowerCase();
  return (
    clean.endsWith('.glb') ||
    clean.endsWith('.gltf') ||
    clean.includes('/uploads/upload_') ||
    clean.startsWith('/models/')
  );
}

/**
 * Detecta y clasifica cualquier entrada de modelo 3D (archivo local, URL web, Sketchfab, Spline, etc.)
 */
export function detectModel3D(
  rawInput: string,
  explicitType?: string
): Model3DDetection {
  const trimmed = (rawInput || '').trim();

  // Si se indicó explícitamente procedural
  if (explicitType === 'procedural' || trimmed.startsWith('procedural:')) {
    return {
      platform: 'procedural',
      isEmbed: false,
      embedUrl: '',
      platformName: 'Procedural Three.js',
      badge: 'PROCEDURAL',
      icon: 'sparkles',
      iconColor: '#76FF03',
      rawInput: trimmed,
    };
  }

  // 1. Probar Sketchfab
  const skfb = parseSketchfab(trimmed);
  if (skfb) {
    return {
      platform: 'sketchfab',
      isEmbed: true,
      embedUrl: skfb.embedUrl,
      externalUrl: skfb.externalUrl,
      titleSuggestion: skfb.titleSuggestion,
      platformName: 'Sketchfab 3D',
      badge: 'SKETCHFAB',
      icon: 'globe',
      iconColor: '#00E5FF',
      rawInput: trimmed,
    };
  }

  // 2. Probar Spline
  const spline = parseSpline(trimmed);
  if (spline) {
    return {
      platform: 'spline',
      isEmbed: true,
      embedUrl: spline.embedUrl,
      externalUrl: spline.externalUrl,
      titleSuggestion: spline.titleSuggestion,
      platformName: 'Spline 3D Cloud',
      badge: 'SPLINE',
      icon: 'sparkles',
      iconColor: '#FF007F',
      rawInput: trimmed,
    };
  }

  // 3. Probar Vectary
  const vectary = parseVectary(trimmed);
  if (vectary) {
    return {
      platform: 'vectary',
      isEmbed: true,
      embedUrl: vectary.embedUrl,
      externalUrl: vectary.externalUrl,
      platformName: 'Vectary 3D',
      badge: 'VECTARY',
      icon: 'box',
      iconColor: '#FFB700',
      rawInput: trimmed,
    };
  }

  // 4. Si contiene etiqueta <iframe> genérica
  const iframeSrc = extractIframeSrc(trimmed);
  if (iframeSrc) {
    return {
      platform: 'embed',
      isEmbed: true,
      embedUrl: iframeSrc,
      externalUrl: iframeSrc,
      platformName: 'Visor 3D Embebido',
      badge: 'EMBED 3D',
      icon: 'globe',
      iconColor: '#00E5FF',
      rawInput: trimmed,
    };
  }

  // 5. Archivo GLB directo (local o remoto)
  if (isDirectGlbUrl(trimmed) || explicitType === 'glb') {
    // Extraer sugerencia de título desde el nombre del archivo
    let titleSug = '';
    try {
      const filename = trimmed.split('/').pop()?.split('?')[0] || '';
      const cleanName = filename
        .replace(/^upload_\d+_[a-f0-9]+_/i, '')
        .replace(/\.(glb|gltf)$/i, '')
        .replace(/[-_]+/g, ' ')
        .trim();
      if (cleanName) {
        titleSug = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }
    } catch {
      // Ignorar error de parsing
    }

    const isRemote = /^https?:\/\//i.test(trimmed);

    return {
      platform: 'glb',
      isEmbed: false,
      embedUrl: '',
      directGlbUrl: trimmed,
      titleSuggestion: titleSug,
      platformName: isRemote ? 'GLB Remoto (Nube)' : 'Archivo GLB Local',
      badge: isRemote ? 'GLB WEB' : 'GLB',
      icon: 'box',
      iconColor: '#76FF03',
      rawInput: trimmed,
    };
  }

  // 6. Si es una URL HTTPS cualquiera que empiece con http(s)
  if (/^https?:\/\//i.test(trimmed)) {
    return {
      platform: 'embed',
      isEmbed: true,
      embedUrl: trimmed,
      externalUrl: trimmed,
      platformName: 'Visor Web 3D',
      badge: 'WEB 3D',
      icon: 'globe',
      iconColor: '#00E5FF',
      rawInput: trimmed,
    };
  }

  // Fallback: tratar como archivo local GLB o procedural
  return {
    platform: 'glb',
    isEmbed: false,
    embedUrl: '',
    directGlbUrl: trimmed,
    platformName: 'Modelo 3D',
    badge: '3D',
    icon: 'box',
    iconColor: '#76FF03',
    rawInput: trimmed,
  };
}

/**
 * Determina de forma rápida si un modelo debe renderizarse en Three.js o mediante iframe
 */
export function isExternal3DEmbed(urlOrType?: string): boolean {
  if (!urlOrType) return false;
  const detection = detectModel3D(urlOrType);
  return detection.isEmbed;
}
