import { Project, Discipline, DisciplineSlide, ExperienceItem, SocialLink, ContactMessage, CommentItem } from '../types';
import { projectsData, experienceData } from '../data/portfolioData';

const PROJECTS_STORAGE_KEY = 'aylin_portfolio_projects_v4';
const DISCIPLINES_STORAGE_KEY = 'aylin_portfolio_disciplines_v4';
const SECTIONS_STORAGE_KEY = 'aylin_portfolio_sections_v3';
const MESSAGES_STORAGE_KEY = 'aylin_portfolio_messages_v1';
const COMMENTS_STORAGE_KEY = 'aylin_portfolio_comments_v1';
const EVENT_NAME = 'aylin_portfolio_data_changed';
const SYNC_STATUS_KEY = 'aylin_db_sync_status';
const PENDING_QUEUE_KEY = 'aylin_portfolio_pending_writes_v1';
const LOCAL_META_KEY = 'aylin_portfolio_local_meta_v1';
const SYNC_LOCK_KEY = 'aylin_portfolio_sync_lock_v1';

// API Endpoints
const API_BASE = '/api';
const PROJECTS_API = `${API_BASE}/projects.php`;
const DISCIPLINES_API = `${API_BASE}/disciplines.php`;
const SETTINGS_API = `${API_BASE}/settings.php`;
const MESSAGES_API = `${API_BASE}/messages.php`;
const COMMENTS_API = `${API_BASE}/comments.php`;
const UPLOAD_API = `${API_BASE}/upload.php`;
const INIT_DB_API = `${API_BASE}/init_db.php`;

// ----- Pending writes queue (offline-first, eventually consistent) -----
interface PendingWrite {
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: string;
  attempts: number;
  queuedAt: number;
  lastError?: string;
}

const readPendingQueue = (): PendingWrite[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PENDING_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writePendingQueue = (q: PendingWrite[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(q));
  } catch {}
};

const enqueueWrite = (w: Omit<PendingWrite, 'attempts' | 'queuedAt'>): void => {
  const q = readPendingQueue();
  q.push({ ...w, attempts: 0, queuedAt: Date.now() });
  writePendingQueue(q);
};

const clearQueuedWrite = (matchUrl: string, method: string): void => {
  const q = readPendingQueue().filter(
    (w) => !(w.method === method && w.url === matchUrl)
  );
  writePendingQueue(q);
};

// ----- Local meta (per-item lastLocalWriteAt to prevent remote-overwrites-local) -----
interface LocalMeta {
  [itemId: string]: number; // ms timestamp of last local mutation
}

const readLocalMeta = (): LocalMeta => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeLocalMeta = (meta: LocalMeta): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_META_KEY, JSON.stringify(meta));
  } catch {}
};

const markLocalMutation = (itemId: string): void => {
  const meta = readLocalMeta();
  meta[itemId] = Date.now();
  writeLocalMeta(meta);
};

const shouldAcceptRemote = (itemId: string, remoteUpdatedAt: string | undefined): boolean => {
  if (!remoteUpdatedAt) return true;
  const localTs = readLocalMeta()[itemId] || 0;
  const remoteTs = new Date(remoteUpdatedAt).getTime();
  if (!Number.isFinite(remoteTs)) return true;
  // Accept remote only if it's strictly newer than last local mutation
  return remoteTs > localTs;
};

// ----- Deduplicated event notification -----
let notifyScheduled = false;
const scheduleNotifyDataChanged = (): void => {
  if (typeof window === 'undefined') return;
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  });
};

export const initialDisciplinesData: Discipline[] = [
  {
    id: 'modelado-3d',
    number: '01',
    verticalTextEs: 'MODELADO 3D & RENDERIZADO CGI',
    verticalTextEn: '3D MODELING & CGI RENDERING',
    titleEs: 'MODELADO 3D',
    titleEn: '3D MODELING',
    subtitleEs: 'DISEÑO & VISUALIZACIÓN COMERCIAL',
    subtitleEn: 'COMMERCIAL DESIGN & 3D VISUALIZATION',
    descEs:
      'Creación de geometría 3D de alta fidelidad, modelado hard-surface, stands comerciales para exposiciones, texturizado PBR e iluminación fotográfica con Blender y Octane Render.',
    descEn:
      'High-fidelity 3D geometry creation, hard-surface modeling, commercial exhibition stands, PBR texturing, and photorealistic studio lighting with Blender and Octane Render.',
    image: '/images/orbit-stand.webp',
    slides: [
      {
        id: 's3d-1',
        image: '/images/orbit-stand.webp',
        title: 'Orbit 3D Stand',
        visible: true,
      },
      {
        id: 's3d-2',
        image: '/images/retro-mini.jpg',
        title: 'Retro Mini Classic',
        visible: true,
      },
      {
        id: 's3d-3',
        image: '/images/orbit-carrito.png',
        title: 'Street Craft Gourmet 3D',
        visible: true,
      },
    ],
    targetProjectId: 'demo-modelado-3d',
    projectIds: ['demo-modelado-3d'],
    visible: true,
    order: 1,
  },
  {
    id: 'branding',
    number: '02',
    verticalTextEs: 'IDENTIDAD VISUAL & SISTEMAS DE MARCA',
    verticalTextEn: 'VISUAL IDENTITY & BRAND SYSTEMS',
    titleEs: 'BRANDING',
    titleEn: 'BRANDING',
    subtitleEs: 'DISEÑO DE IDENTIDAD & DIRECCIÓN DE ARTE',
    subtitleEn: 'IDENTITY DESIGN & ART DIRECTION',
    descEs:
      'Desarrollo integral de identidades corporativas, logotipos memorables, manuales de marca, empaques y universos visuales distintivos que posicionan marcas con autoridad en su industria.',
    descEn:
      'Comprehensive corporate brand identities, memorable logos, brand style guidelines, packaging, and distinctive visual ecosystems crafted to position brands ahead.',
    image: '/images/orbit-stand-diana.webp',
    slides: [
      {
        id: 'sbr-1',
        image: '/images/orbit-stand-diana.webp',
        title: 'Diana Brand Experience 3D',
        visible: true,
      },
      {
        id: 'sbr-2',
        image: '/images/brands/holy-nation.webp',
        title: 'Holy Nation Identity',
        visible: true,
      },
      {
        id: 'sbr-3',
        image: '/images/brands/cattleya.webp',
        title: 'Cattleya Floral Studio',
        visible: true,
      },
    ],
    targetProjectId: 'demo-branding',
    projectIds: ['demo-branding'],
    visible: true,
    order: 2,
  },
  {
    id: 'edicion-video',
    number: '03',
    verticalTextEs: 'MOTION GRAPHICS & POST-PRODUCCIÓN',
    verticalTextEn: 'MOTION GRAPHICS & POST-PRODUCTION',
    titleEs: 'EDICIÓN DE VIDEO',
    titleEn: 'VIDEO EDITING',
    subtitleEs: 'MONTAJE CINEMATOGRÁFICO & RITMO VISUAL',
    subtitleEn: 'CINEMATIC EDITING & VISUAL PACING',
    descEs:
      'Edición audiovisual dinámica, corrección de color profesional, animación tipográfica y motion graphics con After Effects y Premiere Pro para spots publicitarios y campañas de alto impacto.',
    descEn:
      'Dynamic audiovisual editing, professional color grading, kinetic typography, and motion graphics with After Effects and Premiere Pro for commercials and high-converting campaigns.',
    image: '/images/hero-hands.jpg',
    slides: [
      {
        id: 'svid-1',
        image: '/images/hero-hands.jpg',
        title: 'Kinetic Motion Typography',
        visible: true,
      },
    ],
    targetProjectId: 'demo-edicion-video',
    projectIds: ['demo-edicion-video'],
    visible: true,
    order: 3,
  },
  {
    id: 'social-media',
    number: '04',
    verticalTextEs: 'ESTRATEGIA VISUAL & CONTENIDO DIGITAL',
    verticalTextEn: 'VISUAL STRATEGY & DIGITAL CONTENT',
    titleEs: 'SOCIAL MEDIA DESIGNER',
    titleEn: 'SOCIAL MEDIA DESIGNER',
    subtitleEs: 'CONTENIDO DE ALTO ENGAGEMENT & DISEÑO DIGITAL',
    subtitleEn: 'HIGH-ENGAGEMENT CONTENT & DIGITAL DESIGN',
    descEs:
      'Diseño estratégico de piezas gráficas para redes sociales, carruseles de alto valor, creatividades publicitarias y feeds optimizados para maximizar la retención, interacción y conversiones.',
    descEn:
      'Strategic social media graphic design, high-value educational carousels, ad creatives, and optimized feeds designed to maximize audience retention, engagement, and conversion.',
    image: '/images/orbit-tablet.webp',
    slides: [
      {
        id: 'ssm-1',
        image: '/images/orbit-tablet.webp',
        title: 'Interactive Tablet & Digital Feed',
        visible: true,
      },
    ],
    targetProjectId: 'demo-social-media',
    projectIds: ['demo-social-media'],
    visible: true,
    order: 4,
  },
];

export interface AboutSectionData {
  name: string;
  title: string;
  location: string;
  bioEs: string;
  bioEn: string;
  photo: string;
  cvUrl: string;
  whatsapp: string;
  email: string;
  instagram: string;
  behance: string;
  linkedin: string;
}

export interface DiplomadoItem {
  id: string;
  title: string;
  degree?: string;
  institution?: string;
  src: string;
  year?: string;
  visible?: boolean;
}

export interface Lab3DModelItem {
  id: string;
  name: string;
  url: string;
  type: 'glb' | 'procedural';
  proceduralKey?: string;
  stats?: string;
  visible?: boolean;
  icon?: string;
  iconColor?: string;
  badge?: string;
}

export interface Lab3DData {
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  defaultModelId: string;
  lightingColor: string;
  autoRotate: boolean;
  models: Lab3DModelItem[];
}

export const initialAboutData: AboutSectionData = {
  name: 'Aylin Daniela Flores',
  title: 'Diseñadora Gráfica & Modeladora 3D',
  location: 'Sonsonate, El Salvador',
  bioEs:
    'Licenciada en Artes Plásticas (Opción Diseño Gráfico) graduada de la Universidad de El Salvador. Cuento con más de 6 años de experiencia profesional en identidad visual, modelado 3D, branding, preprensa técnica y edición audiovisual.',
  bioEn:
    'Bachelor of Fine Arts (Graphic Design Major) from Universidad de El Salvador with 6+ years of professional expertise in visual identity, 3D CGI modeling, commercial branding, prepress, and video editing.',
  photo: '/images/fotografia-aylin.png',
  cvUrl: '',
  whatsapp: '+503 7000 0000',
  email: 'aylinflores.diseno@gmail.com',
  instagram: 'https://instagram.com/',
  behance: 'https://behance.net/',
  linkedin: 'https://linkedin.com/',
};

export const initialDiplomadosData: DiplomadoItem[] = [
  {
    id: 'dip-1',
    title: 'Diplomado Adobe After Effects',
    degree: 'Especialista en Motion Graphics & Animación',
    institution: 'Academia de Formación Digital',
    src: '/images/diplomados/diplomado-after-effects-2023.webp',
    year: '2023',
    visible: true,
  },
  {
    id: 'dip-2',
    title: 'Taller de Creación de Contenido',
    degree: 'Certificación en Estrategia de Contenido Digital',
    institution: 'Crehana / Domestika',
    src: '/images/diplomados/diplomado-creacion-contenido-2025.webp',
    year: '2025',
    visible: true,
  },
  {
    id: 'dip-3',
    title: 'Diseño Gráfico Publicitario',
    degree: 'Especialidad en Diseño Gráfico Publicitario',
    institution: 'CETEC-ES Centro de Estudios Técnicos',
    src: '/images/diplomados/diplomado-diseno-grafico-publicitario-2021.webp',
    year: '2021',
    visible: true,
  },
  {
    id: 'dip-4',
    title: 'Branding para Diseñadores',
    degree: 'Diploma de Participación en Branding & Identidad',
    institution: 'Webinar Especializado',
    src: '/images/diplomados/diplomado-branding-disenadores-2023.webp',
    year: '2023',
    visible: true,
  },
  {
    id: 'dip-5',
    title: 'Diseño Narrativo para Videojuegos',
    degree: 'Certificado de Aprobación en Diseño Narrativo',
    institution: 'Domestika',
    src: '/images/diplomados/diplomado-diseno-narrativo-videojuegos.webp',
    year: '2023',
    visible: true,
  },
  {
    id: 'dip-6',
    title: 'Diseño de Personajes para Videojuegos',
    degree: 'Certificado de Animación y Personajes 3D',
    institution: 'Domestika',
    src: '/images/diplomados/diplomado-diseno-personajes-animacion-2022.webp',
    year: '2022',
    visible: true,
  },
];

export const initialLab3DData: Lab3DData = {
  titleEs: 'LABORATORIO 3D INTERACTIVO',
  titleEn: 'INTERACTIVE 3D LAB',
  subtitleEs:
    'Rota, inspecciona la geometría e interactúa con modelos tridimensionales en tiempo real en tu navegador.',
  subtitleEn:
    'Rotate, inspect geometry, and explore real-time materials in the browser.',
  defaultModelId: 'torre-castillo',
  lightingColor: '#76FF03',
  autoRotate: true,
  models: [
    {
      id: 'torre-castillo',
      name: 'Torre Castillo 3D',
      url: '/models/torre-castillo.glb',
      type: 'glb',
      stats: 'Modelado GLB • Geometría & Texturas PBR',
      visible: true,
      icon: 'castle',
      iconColor: '#76FF03',
      badge: 'GLB',
    },
    {
      id: 'm3d-1787986860201',
      name: 'Cipitio Encastre 3D',
      url: '/models/cipitio-encastre.glb',
      type: 'glb',
      stats: 'Modelado 3D GLB • Geometría & Shaders PBR',
      visible: true,
      icon: 'ghost',
      iconColor: '#00E5FF',
      badge: 'GLB',
    },
    {
      id: 'm3d-1787986928956',
      name: 'Honda 150L XR 2025',
      url: '/models/honda-150l-xr.glb',
      type: 'glb',
      stats: 'Modelado 3D GLB • Geometría & Shaders PBR',
      visible: true,
      icon: 'bike',
      iconColor: '#FF007F',
      badge: 'GLB',
    },
    {
      id: 'm3d-1787990325278',
      name: 'Gatito Animado 3D',
      url: '/models/gatito-animado.glb',
      type: 'glb',
      stats: 'Modelado 3D GLB • Geometría & Shaders PBR',
      visible: true,
      icon: 'cat',
      iconColor: '#FFB700',
      badge: 'GLB',
    },
    {
      id: 'm3d-1787991602970',
      name: 'Dinosaurio Pepakura',
      url: '/models/dinosaurio-pepakura.glb',
      type: 'glb',
      stats: 'Modelado 3D GLB • Geometría & Shaders PBR',
      visible: true,
      icon: 'turtle',
      iconColor: '#A855F7',
      badge: 'GLB',
    },
    {
      id: 'm3d-1788387556598',
      name: 'DARION',
      url: '/models/darion.glb',
      type: 'glb',
      stats: 'Modelado 3D GLB • Geometría & Shaders PBR',
      visible: true,
      icon: 'bot',
      iconColor: '#38B000',
      badge: 'GLB',
    },
  ],
};

// Helper to notify all subscribers that data has changed (deduplicated per tick)
const notifyDataChanged = scheduleNotifyDataChanged;

export const subscribeToPortfolioChanges = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
};

// ==================== REMOTE SYNC ENGINE ====================

let isSyncing = false;

const safeParseArray = async (res: Response): Promise<any[] | null> => {
  try {
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
};

const safeParseObject = async (res: Response): Promise<Record<string, any> | null> => {
  try {
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
};

const DELETED_PROJECTS_KEY = 'aylin_portfolio_deleted_projects_v1';

const readDeletedProjectIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DELETED_PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const markProjectDeleted = (id: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const list = readDeletedProjectIds();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(DELETED_PROJECTS_KEY, JSON.stringify(list));
    }
  } catch {}
};

const unmarkProjectDeleted = (id: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const list = readDeletedProjectIds().filter((d) => d !== id);
    localStorage.setItem(DELETED_PROJECTS_KEY, JSON.stringify(list));
  } catch {}
};

const mergeByUpdatedAt = <T extends { id: string; updatedAt?: string }>(
  local: T[],
  remote: T[],
  apiEndpoint: string,
  wrapPayload?: (item: T) => any,
  deletedIdsSet?: Set<string>
): { merged: T[]; changed: boolean } => {
  const localById = new Map(local.map((p) => [p.id, p]));
  const merged: T[] = [];
  let changed = false;
  const seenIds = new Set<string>();

  const isProjectsEndpoint = apiEndpoint.includes('projects');
  const reservedDisciplineIds = new Set(['modelado-3d', 'branding', 'edicion-video', 'social-media']);

  for (const r of remote) {
    // If this is the projects endpoint and remote item has a reserved discipline ID, reject and purge from remote!
    if (isProjectsEndpoint && reservedDisciplineIds.has(r.id)) {
      changed = true;
      enqueueWrite({
        endpoint: apiEndpoint,
        method: 'POST',
        url: `${apiEndpoint}?action=delete&id=${encodeURIComponent(r.id)}`,
      });
      continue;
    }

    // If item was explicitly deleted locally, DO NOT resurrect it! Enforce remote deletion.
    if (deletedIdsSet && deletedIdsSet.has(r.id)) {
      changed = true;
      enqueueWrite({
        endpoint: apiEndpoint,
        method: 'POST',
        url: `${apiEndpoint}?action=delete&id=${encodeURIComponent(r.id)}`,
      });
      continue;
    }

    seenIds.add(r.id);
    const l = localById.get(r.id);
    if (!l) {
      // Brand-new remote item → take it
      merged.push(r);
      changed = true;
      continue;
    }
    if (shouldAcceptRemote(r.id, r.updatedAt)) {
      merged.push(r);
      if (JSON.stringify(l) !== JSON.stringify(r)) changed = true;
    } else {
      // Local is newer → keep local, but mark as pending so next sync re-pushes to correct endpoint
      merged.push(l);
      const payload = wrapPayload ? wrapPayload(l) : l;
      enqueueWrite({
        endpoint: apiEndpoint,
        method: 'POST',
        url: apiEndpoint,
        body: JSON.stringify(payload),
      });
    }
  }

  // Preserve local items that remote doesn't have (unless they were deleted or invalid)
  for (const l of local) {
    if (deletedIdsSet && deletedIdsSet.has(l.id)) {
      continue; // Was intentionally deleted, do NOT resurrect!
    }
    if (isProjectsEndpoint && reservedDisciplineIds.has(l.id)) {
      continue; // Discipline must never exist in projects list!
    }
    if (!seenIds.has(l.id)) {
      merged.push(l);
      const payload = wrapPayload ? wrapPayload(l) : l;
      enqueueWrite({
        endpoint: apiEndpoint,
        method: 'POST',
        url: apiEndpoint,
        body: JSON.stringify(payload),
      });
      changed = true;
    }
  }

  return { merged, changed };
};

/**
 * Fetch latest projects, disciplines and sections from Hostinger MySQL API.
 * Uses timestamp-based merge to avoid losing recent local edits.
 */
export const syncFromRemoteServer = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || isSyncing) return false;
  isSyncing = true;

  try {
    // 1. Replay any queued writes first (so the server reflects our local state)
    await replayPendingWrites();

    const [projRes, discRes, secRes, msgRes, cmtRes] = await Promise.all([
      fetch(PROJECTS_API, { cache: 'no-store' }),
      fetch(DISCIPLINES_API, { cache: 'no-store' }),
      fetch(SETTINGS_API, { cache: 'no-store' }),
      fetch(MESSAGES_API, { cache: 'no-store' }).catch(() => null),
      fetch(`${COMMENTS_API}?all=1`, { cache: 'no-store' }).catch(() => null),
    ]);

    let changed = false;

    const remoteProjects = await safeParseArray(projRes);
    if (remoteProjects) {
      const localProjects = readJson<any[]>(PROJECTS_STORAGE_KEY, []);
      const deletedIds = readDeletedProjectIds();
      const deletedSet = new Set(deletedIds);
      const { merged, changed: c } = mergeByUpdatedAt(
        localProjects,
        remoteProjects,
        PROJECTS_API,
        (p) => p,
        deletedSet
      );
      if (c || merged.length !== localProjects.length) {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(merged));
        changed = true;
      }
    }

    const remoteDisciplines = await safeParseArray(discRes);
    if (remoteDisciplines) {
      const localDisciplines = readJson<any[]>(DISCIPLINES_STORAGE_KEY, []);
      const { merged, changed: c } = mergeByUpdatedAt(
        localDisciplines,
        remoteDisciplines,
        DISCIPLINES_API,
        (d) => ({ disciplines: [d] })
      );
      if (c || merged.length !== localDisciplines.length) {
        localStorage.setItem(DISCIPLINES_STORAGE_KEY, JSON.stringify(merged));
        changed = true;
      }
    }

    const remoteSections = await safeParseObject(secRes);
    if (remoteSections) {
      if (remoteSections.about && !remoteSections.about.photo) {
        remoteSections.about.photo = '/images/fotografia-aylin.png';
      }
      const localSections = readJson<Record<string, any>>(SECTIONS_STORAGE_KEY, {});
      const next = { ...localSections };
      let sectionsChanged = false;
      for (const [k, v] of Object.entries(remoteSections)) {
        const localItem = next[k];
        if (shouldAcceptRemote(k, (v as any)?.updatedAt)) {
          if (JSON.stringify(localItem) !== JSON.stringify(v)) sectionsChanged = true;
          next[k] = v;
        } else if (!localItem) {
          next[k] = v;
          sectionsChanged = true;
        }
      }
      if (sectionsChanged) {
        localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(next));
        changed = true;
      }
    }

    const remoteMsgs = msgRes ? await safeParseArray(msgRes) : null;
    if (remoteMsgs) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(remoteMsgs));
      changed = true;
    }

    const remoteCmts = cmtRes ? await safeParseArray(cmtRes) : null;
    if (remoteCmts && remoteCmts.length > 0) {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(remoteCmts));
      changed = true;
    }

    if (changed) {
      localStorage.setItem(
        SYNC_STATUS_KEY,
        JSON.stringify({ connected: true, lastSync: new Date().toISOString() })
      );
      notifyDataChanged();
    }

    return true;
  } catch (err) {
    console.warn('Live API sync note (using local cache):', err);
    return false;
  } finally {
    isSyncing = false;
  }
};

/**
 * Replay queued writes against the remote API. Called before sync.
 */
const replayPendingWrites = async (): Promise<void> => {
  const queue = readPendingQueue();
  if (queue.length === 0) return;
  const remaining: PendingWrite[] = [];
  for (const w of queue) {
    if (w.attempts >= 5) {
      // Give up after 5 attempts — keep in queue for manual inspection
      remaining.push(w);
      continue;
    }
    try {
      const init: RequestInit = {
        method: w.method,
        headers: w.body ? { 'Content-Type': 'application/json' } : undefined,
        body: w.body,
      };
      const res = await fetch(w.url, init);
      if (res.ok) {
        // success — drop from queue
      } else {
        remaining.push({ ...w, attempts: w.attempts + 1, lastError: `HTTP ${res.status}` });
      }
    } catch (err: any) {
      remaining.push({ ...w, attempts: w.attempts + 1, lastError: String(err?.message || err) });
    }
  }
  writePendingQueue(remaining);
};

const readJson = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: any): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to write ${key}:`, err);
  }
};

// ==================== MULTI-DEVICE REAL-TIME SYNC ENGINE ====================

export const getCategoryFallbackImage = (category?: string): string => {
  switch (category) {
    case '3D MODELING':
      return '/images/orbit-stand.webp';
    case 'BRANDING':
      return '/images/brands/holy-nation.webp';
    case 'MOTION':
      return '/images/hero-hands.jpg';
    case 'DIGITAL ART':
      return '/images/orbit-tablet.webp';
    default:
      return '/images/orbit-stand.webp';
  }
};

export const resolveMediaUrl = (url?: string, fallback = '/images/orbit-stand-diana.webp'): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  return url.trim();
};

// Initial and continuous real-time sync across devices and tabs
if (typeof window !== 'undefined') {
  // 1. Initial background sync when module loads
  setTimeout(() => {
    syncFromRemoteServer();
  }, 100);

  // 2. Debounced sync on focus / tab visibility — coalesces rapid events into one sync
  let syncDebounceHandle: ReturnType<typeof setTimeout> | null = null;
  const scheduleSync = () => {
    if (syncDebounceHandle !== null) clearTimeout(syncDebounceHandle);
    syncDebounceHandle = setTimeout(() => {
      syncDebounceHandle = null;
      syncFromRemoteServer();
    }, 1500);
  };
  window.addEventListener('focus', scheduleSync);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') scheduleSync();
  });

  // 3. Autonomous periodic live polling every 60 seconds (was 20s — reduced to avoid races)
  setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      syncFromRemoteServer();
    }
  }, 60000);
}

// ==================== SECTIONS DATA GETTERS & SETTERS ====================

export const getStoredSection = <T>(sectionKey: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(SECTIONS_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed[sectionKey] !== undefined ? parsed[sectionKey] : fallback;
  } catch {
    return fallback;
  }
};

export const saveStoredSection = async (
  sectionKey: string,
  data: any
): Promise<void> => {
  const allSections = readJson<Record<string, any>>(SECTIONS_STORAGE_KEY, {});
  allSections[sectionKey] = data;
  writeJson(SECTIONS_STORAGE_KEY, allSections);
  markLocalMutation(sectionKey);
  notifyDataChanged();

  try {
    const res = await fetch(`${SETTINGS_API}?section=${encodeURIComponent(sectionKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      enqueueWrite({
        endpoint: SETTINGS_API,
        method: 'POST',
        url: `${SETTINGS_API}?section=${encodeURIComponent(sectionKey)}`,
        body: JSON.stringify(data),
      });
    }
  } catch (err) {
    console.warn(`Could not sync section ${sectionKey} with remote API:`, err);
    enqueueWrite({
      endpoint: SETTINGS_API,
      method: 'POST',
      url: `${SETTINGS_API}?section=${encodeURIComponent(sectionKey)}`,
      body: JSON.stringify(data),
    });
  }
};

export const getStoredAbout = (): AboutSectionData => {
  return getStoredSection<AboutSectionData>('about', initialAboutData);
};

export const saveStoredAbout = (data: AboutSectionData) => {
  return saveStoredSection('about', data);
};

export const getStoredExperience = (): ExperienceItem[] => {
  return getStoredSection<ExperienceItem[]>('experience', experienceData);
};

export const saveStoredExperience = (data: ExperienceItem[]) => {
  return saveStoredSection('experience', data);
};

export const getStoredDiplomados = (): DiplomadoItem[] => {
  return getStoredSection<DiplomadoItem[]>('diplomados', initialDiplomadosData);
};

export const saveStoredDiplomados = (data: DiplomadoItem[]) => {
  return saveStoredSection('diplomados', data);
};

export const getStoredLab3D = (): Lab3DData => {
  return getStoredSection<Lab3DData>('lab3d', initialLab3DData);
};

export const saveStoredLab3D = (data: Lab3DData) => {
  return saveStoredSection('lab3d', data);
};

export const initialSocialLinks: SocialLink[] = [
  { id: 'soc-1', label: 'INSTAGRAM', href: 'https://instagram.com', iconPreset: 'instagram', visible: true, order: 1 },
  { id: 'soc-2', label: 'BEHANCE', href: 'https://behance.net', iconPreset: 'behance', visible: true, order: 2 },
  { id: 'soc-3', label: 'LINKEDIN', href: 'https://linkedin.com', iconPreset: 'linkedin', visible: true, order: 3 },
  { id: 'soc-4', label: 'DRIBBBLE', href: 'https://dribbble.com', iconPreset: 'dribbble', visible: true, order: 4 },
  { id: 'soc-5', label: 'ARTSTATION', href: 'https://artstation.com', iconPreset: 'artstation', visible: true, order: 5 },
];

export const getStoredSocials = (): SocialLink[] => {
  return getStoredSection<SocialLink[]>('socials', initialSocialLinks);
};

export const saveStoredSocials = (data: SocialLink[]) => {
  return saveStoredSection('socials', data);
};

// ==================== MESSAGES & INBOX DATA ====================

export const getStoredMessages = (): ContactMessage[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveContactMessage = async (
  msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>
): Promise<ContactMessage> => {
  const current = getStoredMessages();
  const newMsg: ContactMessage = {
    ...msgData,
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  const updated = [newMsg, ...current];
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
  notifyDataChanged();

  try {
    const res = await fetch(MESSAGES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMsg),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.id) {
        newMsg.id = data.data.id;
      }
    }
  } catch (err) {
    console.warn('Could not sync message with remote MySQL:', err);
  }

  return newMsg;
};

export const markMessageAsRead = async (id: string, isRead = true): Promise<boolean> => {
  const current = getStoredMessages();
  const msg = current.find((m) => m.id === id);
  if (!msg) return false;

  msg.isRead = isRead;
  msg.updatedAt = new Date().toISOString();
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(current));
  notifyDataChanged();

  try {
    await fetch(MESSAGES_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isRead }),
    });
    return true;
  } catch (err) {
    console.warn('Could not update message read status on remote server:', err);
    return false;
  }
};

export const deleteStoredMessage = async (id: string): Promise<boolean> => {
  const current = getStoredMessages();
  const updated = current.filter((m) => m.id !== id);
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
  notifyDataChanged();

  try {
    await fetch(`${MESSAGES_API}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return true;
  } catch (err) {
    console.warn('Could not delete message on remote server:', err);
    return false;
  }
};

export const syncMessagesFromRemote = async (): Promise<ContactMessage[]> => {
  try {
    const res = await fetch(MESSAGES_API, { cache: 'no-store' });
    if (res.ok) {
      const remote = await res.json();
      if (Array.isArray(remote)) {
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(remote));
        notifyDataChanged();
        return remote;
      }
    }
  } catch (err) {
    console.warn('Could not fetch messages from remote server:', err);
  }
  return getStoredMessages();
};

// ==================== COMMENTS & FEEDBACK DATA ====================

export const initialCommentsData: CommentItem[] = [
  {
    id: 'cmt-1',
    name: 'Carlos Mendoza',
    email: 'carlos@apexauto.com',
    company: 'Apex Auto Studio',
    rating: 5,
    comment: 'El nivel de detalle en el modelado 3D del Retro Mini superó todas nuestras expectativas. La iluminación y los materiales procedurales son de calidad de cine.',
    status: 'approved',
    featured: true,
    createdAt: '2026-08-20T14:30:00Z',
  },
  {
    id: 'cmt-2',
    name: 'Sofía Valiente',
    email: 'sofia@holynation.com',
    company: 'Holy Nation Apparel',
    rating: 5,
    comment: 'Aylin capturó a la perfección la esencia urbana y espiritual de nuestra marca. La identidad visual y la tipografía personalizada impulsaron nuestras ventas un 40%.',
    status: 'approved',
    featured: true,
    createdAt: '2026-08-25T19:15:00Z',
  },
  {
    id: 'cmt-3',
    name: 'Roberto Henríquez',
    email: 'r.henriquez@diana.com.sv',
    company: 'Diana Brand Experience',
    rating: 5,
    comment: 'Trabajo excepcional en el stand 3D y visuales para nuestra convención. La fluidez en los tiempos de entrega y la dirección creativa fueron impecables.',
    status: 'approved',
    featured: true,
    createdAt: '2026-09-01T10:00:00Z',
  },
];

export const getStoredComments = (): CommentItem[] => {
  if (typeof window === 'undefined') return initialCommentsData;
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialCommentsData;
  } catch {
    return initialCommentsData;
  }
};

export const saveStoredComment = async (
  commentData: Omit<CommentItem, 'id' | 'createdAt'>
): Promise<CommentItem> => {
  const current = getStoredComments();
  const newComment: CommentItem = {
    ...commentData,
    featured: commentData.featured !== undefined ? commentData.featured : true,
    id: `cmt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newComment, ...current];
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updated));
  notifyDataChanged();

  try {
    const res = await fetch(COMMENTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.id) {
        newComment.id = data.data.id;
      }
    }
  } catch (err) {
    console.warn('Could not sync comment with remote MySQL:', err);
  }

  return newComment;
};

export const toggleCommentStatus = async (
  id: string,
  status: 'approved' | 'pending'
): Promise<boolean> => {
  const current = getStoredComments();
  const cmt = current.find((c) => c.id === id);
  if (!cmt) return false;

  cmt.status = status;
  cmt.updatedAt = new Date().toISOString();
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(current));
  notifyDataChanged();

  try {
    await fetch(COMMENTS_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    return true;
  } catch (err) {
    console.warn('Could not update comment status on remote MySQL:', err);
    return false;
  }
};

export const toggleCommentFeatured = async (id: string): Promise<boolean> => {
  const current = getStoredComments();
  const cmt = current.find((c) => c.id === id);
  if (!cmt) return false;

  cmt.featured = cmt.featured === false ? true : false;
  cmt.updatedAt = new Date().toISOString();
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(current));
  notifyDataChanged();

  try {
    await fetch(COMMENTS_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, featured: cmt.featured ? 1 : 0 }),
    });
    return true;
  } catch (err) {
    console.warn('Could not update comment featured status on remote MySQL:', err);
    return false;
  }
};

export const updateStoredComment = async (
  id: string,
  updatedFields: Partial<CommentItem>
): Promise<boolean> => {
  const current = getStoredComments();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) return false;

  current[index] = {
    ...current[index],
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(current));
  notifyDataChanged();

  try {
    await fetch(COMMENTS_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updatedFields }),
    });
    return true;
  } catch (err) {
    console.warn('Could not update comment on remote MySQL:', err);
    return false;
  }
};

export const deleteStoredComment = async (id: string): Promise<boolean> => {
  const current = getStoredComments();
  const updated = current.filter((c) => c.id !== id);
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updated));
  notifyDataChanged();

  try {
    await fetch(`${COMMENTS_API}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return true;
  } catch (err) {
    console.warn('Could not delete comment on remote MySQL:', err);
    return false;
  }
};

export const syncCommentsFromRemote = async (): Promise<CommentItem[]> => {
  try {
    const res = await fetch(`${COMMENTS_API}?all=1`, { cache: 'no-store' });
    if (res.ok) {
      const remote = await res.json();
      if (Array.isArray(remote) && remote.length > 0) {
        localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(remote));
        notifyDataChanged();
        return remote;
      }
    }
  } catch (err) {
    console.warn('Could not fetch comments from remote server:', err);
  }
  return getStoredComments();
};

// ==================== DATABASE STATUS HELPER ====================

export interface DatabaseStatusInfo {
  connected: boolean;
  database: string;
  totalProjects: number;
  totalDisciplines: number;
  lastSync?: string;
  message?: string;
}

export const checkDatabaseStatus = async (): Promise<DatabaseStatusInfo> => {
  try {
    const res = await fetch(INIT_DB_API, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        database: data.database || 'u888615463_2026_portfolio',
        totalProjects: data.totalProjects || getStoredProjects().length,
        totalDisciplines: data.totalDisciplines || getStoredDisciplines().length,
        lastSync: new Date().toLocaleTimeString(),
        message: data.message || 'Conectado a Hostinger MySQL en vivo',
      };
    }
  } catch {}

  const projects = getStoredProjects();
  const disciplines = getStoredDisciplines();
  return {
    connected: false,
    database: 'u888615463_2026_portfolio (Caché local)',
    totalProjects: projects.length,
    totalDisciplines: disciplines.length,
    lastSync: new Date().toLocaleTimeString(),
    message: 'Modo local activo con sincronización automática',
  };
};

// ==================== MEDIA UPLOADER ====================

export interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  fileType?: string;
  fileSize?: number;
  error?: string;
}

export const uploadMediaFile = async (file: File): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(UPLOAD_API, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errJson.error || `Error ${response.status}: no se pudo subir el archivo.`,
      };
    }

    const data: UploadResult = await response.json();
    return data;
  } catch (err) {
    console.error('Error uploading file to Hostinger:', err);
    return {
      success: false,
      error: 'No se pudo conectar con el servidor de subidas de Hostinger.',
    };
  }
};

// ==================== PROJECTS CRUD ====================

/**
 * Read projects from local cache. NEVER seeds defaults — empty cache returns []
 * (remote sync will populate it). This is critical to prevent stale hard-coded
 * projects from replacing real ones uploaded via the dashboard.
 */
export const getStoredProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const deletedSet = new Set(readDeletedProjectIds());
    const reservedDisciplineIds = new Set(['modelado-3d', 'branding', 'edicion-video', 'social-media']);
    return parsed.filter(
      (p) => p && p.id && !deletedSet.has(p.id) && !reservedDisciplineIds.has(p.id)
    );
  } catch (err) {
    console.error('Error reading stored projects:', err);
    return [];
  }
};

/**
 * Resolve which projects belong to a discipline using ONLY explicit links:
 *  1. project.disciplineId === disciplineId
 *  2. discipline.projectIds includes project.id
 * No category-based fallbacks — categories are decorative, never structural.
 */
export const getProjectsForDiscipline = (
  disciplineId: string,
  allProjects?: Project[],
  allDisciplines?: Discipline[]
): Project[] => {
  const projects = allProjects || getStoredProjects();
  const disciplines = allDisciplines || getStoredDisciplines();
  const discipline = disciplines.find((d) => d.id === disciplineId);

  return projects.filter((p) => {
    // 1. Explicit disciplineId on project
    if (p.disciplineId && p.disciplineId === disciplineId) return true;
    // 2. Explicit projectIds list on discipline
    if (discipline && Array.isArray(discipline.projectIds) && discipline.projectIds.includes(p.id)) return true;
    return false;
  });
};

export const toggleProjectInDiscipline = async (
  disciplineId: string,
  projectId: string
): Promise<void> => {
  const currentDisciplines = getStoredDisciplines();
  const discIndex = currentDisciplines.findIndex((d) => d.id === disciplineId);
  if (discIndex < 0) return;

  const disc = currentDisciplines[discIndex];
  const currentIds = disc.projectIds || [];
  let nextIds: string[];
  if (currentIds.includes(projectId)) {
    nextIds = currentIds.filter((id) => id !== projectId);
  } else {
    nextIds = [...currentIds, projectId];
  }
  const updatedDisc: Discipline = { ...disc, projectIds: nextIds, updatedAt: new Date().toISOString() };
  await saveDiscipline(updatedDisc);
};

/**
 * Save a project: idempotent local write + verified remote POST.
 * On network failure, write is queued for replay on next sync.
 */
export const saveProject = async (project: Project): Promise<boolean> => {
  const current = getStoredProjects();
  const index = current.findIndex((p) => p.id === project.id);
  const now = new Date().toISOString();
  const finalProject: Project = {
    ...project,
    id: project.id || `proj-${Date.now()}`,
    updatedAt: now,
    createdAt: project.createdAt || now,
  };

  // Re-enable if it was marked deleted in the past
  unmarkProjectDeleted(finalProject.id);

  let updated: Project[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = finalProject;
  } else {
    updated = [finalProject, ...current];
  }

  writeJson(PROJECTS_STORAGE_KEY, updated);
  markLocalMutation(finalProject.id);
  notifyDataChanged();

  try {
    const res = await fetch(PROJECTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalProject),
    });
    if (!res.ok) {
      console.warn('Remote API returned non-OK status on saveProject:', res.status);
      enqueueWrite({ endpoint: PROJECTS_API, method: 'POST', url: PROJECTS_API, body: JSON.stringify(finalProject) });
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Could not sync project with remote API:', err);
    enqueueWrite({ endpoint: PROJECTS_API, method: 'POST', url: PROJECTS_API, body: JSON.stringify(finalProject) });
    return false;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  // 1. Mark as tombstone so background sync NEVER resurrects it
  markProjectDeleted(projectId);

  // 2. Remove from local projects cache immediately
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== projectId);
  writeJson(PROJECTS_STORAGE_KEY, updated);
  markLocalMutation(projectId);

  // 3. Remove from any discipline assignments
  const disciplines = getStoredDisciplines();
  let disciplinesUpdated = false;
  const updatedDisciplines = disciplines.map((disc) => {
    let changed = false;
    let nextProjectIds = disc.projectIds;
    if (Array.isArray(disc.projectIds) && disc.projectIds.includes(projectId)) {
      nextProjectIds = disc.projectIds.filter((id) => id !== projectId);
      changed = true;
    }
    let nextTarget = disc.targetProjectId;
    if (disc.targetProjectId === projectId) {
      nextTarget = nextProjectIds && nextProjectIds.length > 0 ? nextProjectIds[0] : '';
      changed = true;
    }
    if (changed) {
      disciplinesUpdated = true;
      return { ...disc, projectIds: nextProjectIds, targetProjectId: nextTarget, updatedAt: new Date().toISOString() };
    }
    return disc;
  });
  if (disciplinesUpdated) {
    writeJson(DISCIPLINES_STORAGE_KEY, updatedDisciplines);
  }

  // 4. Notify UI components
  notifyDataChanged();

  // 5. Send delete to remote API
  try {
    const res = await fetch(`${PROJECTS_API}?action=delete&id=${encodeURIComponent(projectId)}`, {
      method: 'POST',
    });
    if (!res.ok) {
      enqueueWrite({
        endpoint: PROJECTS_API,
        method: 'POST',
        url: `${PROJECTS_API}?action=delete&id=${encodeURIComponent(projectId)}`,
      });
    }
  } catch (err) {
    console.warn('Could not sync delete with remote API:', err);
    enqueueWrite({
      endpoint: PROJECTS_API,
      method: 'POST',
      url: `${PROJECTS_API}?action=delete&id=${encodeURIComponent(projectId)}`,
    });
  }
};

export const toggleProjectFeatured = async (projectId: string): Promise<boolean> => {
  const current = getStoredProjects();
  const project = current.find((p) => p.id === projectId);
  if (!project) return false;

  const nextFeatured = !project.featured;
  const updated: Project = {
    ...project,
    featured: nextFeatured,
    updatedAt: new Date().toISOString(),
  };
  const next = current.map((p) => (p.id === projectId ? updated : p));
  writeJson(PROJECTS_STORAGE_KEY, next);
  markLocalMutation(projectId);
  notifyDataChanged();

  try {
    const res = await fetch(`${PROJECTS_API}?action=toggle_featured&id=${encodeURIComponent(projectId)}`, {
      method: 'POST',
    });
    if (!res.ok) {
      enqueueWrite({
        endpoint: PROJECTS_API,
        method: 'POST',
        url: `${PROJECTS_API}?action=toggle_featured&id=${encodeURIComponent(projectId)}`,
        body: JSON.stringify(updated),
      });
    }
  } catch (err) {
    console.warn('Could not sync toggle featured with remote API:', err);
    enqueueWrite({
      endpoint: PROJECTS_API,
      method: 'POST',
      url: `${PROJECTS_API}?action=toggle_featured&id=${encodeURIComponent(projectId)}`,
      body: JSON.stringify(updated),
    });
  }

  return nextFeatured;
};

/**
 * Bulk save: merges incoming projects into existing list (upsert by id),
 * preserving items not in the incoming list. Avoids wiping items from
 * other devices.
 */
export const saveAllProjects = async (incoming: Project[]): Promise<void> => {
  const current = getStoredProjects();
  const deletedSet = new Set(readDeletedProjectIds());
  const byId = new Map<string, Project>(
    current.filter((p) => !deletedSet.has(p.id)).map((p) => [p.id, p])
  );
  for (const p of incoming) {
    if (!deletedSet.has(p.id)) {
      byId.set(p.id, { ...p, updatedAt: p.updatedAt || new Date().toISOString() });
    }
  }
  const merged = Array.from(byId.values());
  writeJson(PROJECTS_STORAGE_KEY, merged);
  incoming.forEach((p) => markLocalMutation(p.id));
  notifyDataChanged();

  try {
    const res = await fetch(PROJECTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projects: incoming }),
    });
    if (!res.ok) {
      enqueueWrite({
        endpoint: PROJECTS_API,
        method: 'POST',
        url: PROJECTS_API,
        body: JSON.stringify({ projects: incoming }),
      });
    }
  } catch (err) {
    console.warn('Could not sync all projects with remote API:', err);
    enqueueWrite({
      endpoint: PROJECTS_API,
      method: 'POST',
      url: PROJECTS_API,
      body: JSON.stringify({ projects: incoming }),
    });
  }
};

// ==================== DISCIPLINES CRUD ====================

/**
 * Read disciplines from local cache. NEVER seeds defaults — empty cache returns [].
 */
export const getStoredDisciplines = (): Discipline[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DISCIPLINES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading stored disciplines:', err);
    return [];
  }
};

export const saveDiscipline = async (discipline: Discipline): Promise<void> => {
  const current = getStoredDisciplines();
  const index = current.findIndex((d) => d.id === discipline.id);
  const now = new Date().toISOString();
  const final: Discipline = { ...discipline, updatedAt: discipline.updatedAt || now };
  let updated: Discipline[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = final;
  } else {
    updated = [...current, final];
  }

  writeJson(DISCIPLINES_STORAGE_KEY, updated);
  markLocalMutation(final.id);
  notifyDataChanged();

  try {
    const res = await fetch(DISCIPLINES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(final),
    });
    if (!res.ok) {
      enqueueWrite({ endpoint: DISCIPLINES_API, method: 'POST', url: DISCIPLINES_API, body: JSON.stringify(final) });
    }
  } catch (err) {
    console.warn('Could not sync discipline with remote API:', err);
    enqueueWrite({ endpoint: DISCIPLINES_API, method: 'POST', url: DISCIPLINES_API, body: JSON.stringify(final) });
  }
};

export const saveAllDisciplines = async (incoming: Discipline[]): Promise<void> => {
  const current = getStoredDisciplines();
  const byId = new Map<string, Discipline>(current.map((d) => [d.id, d]));
  for (const d of incoming) {
    byId.set(d.id, { ...d, updatedAt: d.updatedAt || new Date().toISOString() });
  }
  const merged = Array.from(byId.values());
  writeJson(DISCIPLINES_STORAGE_KEY, merged);
  incoming.forEach((d) => markLocalMutation(d.id));
  notifyDataChanged();

  try {
    const res = await fetch(DISCIPLINES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disciplines: incoming }),
    });
    if (!res.ok) {
      enqueueWrite({ endpoint: DISCIPLINES_API, method: 'POST', url: DISCIPLINES_API, body: JSON.stringify({ disciplines: incoming }) });
    }
  } catch (err) {
    console.warn('Could not sync disciplines with remote API:', err);
    enqueueWrite({ endpoint: DISCIPLINES_API, method: 'POST', url: DISCIPLINES_API, body: JSON.stringify({ disciplines: incoming }) });
  }
};

export const toggleDisciplineSlideVisibility = (
  disciplineId: string,
  slideId: string
): void => {
  const current = getStoredDisciplines();
  const discipline = current.find((d) => d.id === disciplineId);
  if (!discipline) return;
  const slide = discipline.slides.find((s) => s.id === slideId);
  if (!slide) return;
  slide.visible = !slide.visible;
  saveDiscipline(discipline);
};

export const addDisciplineSlide = (
  disciplineId: string,
  image: string,
  title?: string
): void => {
  const current = getStoredDisciplines();
  const discipline = current.find((d) => d.id === disciplineId);
  if (!discipline) return;
  discipline.slides.push({
    id: `slide-${Date.now()}`,
    image,
    title: title || 'Nueva Diapositiva',
    visible: true,
  });
  saveDiscipline(discipline);
};

export const deleteDisciplineSlide = (
  disciplineId: string,
  slideId: string
): void => {
  const current = getStoredDisciplines();
  const discipline = current.find((d) => d.id === disciplineId);
  if (!discipline) return;
  discipline.slides = discipline.slides.filter((s) => s.id !== slideId);
  saveDiscipline(discipline);
};

export const reorderDisciplineSlide = (
  disciplineId: string,
  slideId: string,
  direction: 'up' | 'down'
): void => {
  const current = getStoredDisciplines();
  const discipline = current.find((d) => d.id === disciplineId);
  if (!discipline || !discipline.slides) return;
  const idx = discipline.slides.findIndex((s) => s.id === slideId);
  if (idx < 0) return;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= discipline.slides.length) return;
  const temp = discipline.slides[idx];
  discipline.slides[idx] = discipline.slides[targetIdx];
  discipline.slides[targetIdx] = temp;
  saveDiscipline(discipline);
};

export const updateDisciplineSlide = (
  disciplineId: string,
  slideId: string,
  updates: Partial<DisciplineSlide>
): void => {
  const current = getStoredDisciplines();
  const discipline = current.find((d) => d.id === disciplineId);
  if (!discipline || !discipline.slides) return;
  const slide = discipline.slides.find((s) => s.id === slideId);
  if (!slide) return;
  Object.assign(slide, updates);
  saveDiscipline(discipline);
};

// ==================== BACKUP / EXPORT / IMPORT ====================

export const exportPortfolioJSON = (): string => {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    database: 'u888615463_2026_portfolio',
    projects: getStoredProjects(),
    disciplines: getStoredDisciplines(),
    about: getStoredAbout(),
    experience: getStoredExperience(),
    diplomados: getStoredDiplomados(),
    lab3d: getStoredLab3D(),
    socials: getStoredSocials(),
    messages: getStoredMessages(),
    comments: getStoredComments(),
  };
  return JSON.stringify(data, null, 2);
};

export const importPortfolioJSON = async (jsonString: string): Promise<boolean> => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.projects && Array.isArray(parsed.projects)) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(parsed.projects));
      await fetch(PROJECTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: parsed.projects }),
      }).catch(() => {});
    }
    if (parsed.disciplines && Array.isArray(parsed.disciplines)) {
      localStorage.setItem(DISCIPLINES_STORAGE_KEY, JSON.stringify(parsed.disciplines));
      await fetch(DISCIPLINES_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disciplines: parsed.disciplines }),
      }).catch(() => {});
    }
    if (parsed.about) saveStoredAbout(parsed.about);
    if (parsed.experience) saveStoredExperience(parsed.experience);
    if (parsed.diplomados) saveStoredDiplomados(parsed.diplomados);
    if (parsed.lab3d) saveStoredLab3D(parsed.lab3d);
    if (parsed.socials) saveStoredSocials(parsed.socials);
    if (parsed.messages && Array.isArray(parsed.messages)) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(parsed.messages));
    }
    if (parsed.comments && Array.isArray(parsed.comments)) {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(parsed.comments));
    }

    notifyDataChanged();
    return true;
  } catch (err) {
    console.error('Error importing portfolio JSON:', err);
    return false;
  }
};

export const resetPortfolioToDefaults = async (): Promise<void> => {
  writeJson(PROJECTS_STORAGE_KEY, projectsData);
  writeJson(DISCIPLINES_STORAGE_KEY, initialDisciplinesData);
  saveStoredAbout(initialAboutData);
  saveStoredExperience(experienceData);
  saveStoredDiplomados(initialDiplomadosData);
  saveStoredLab3D(initialLab3DData);
  notifyDataChanged();

  try {
    await fetch(INIT_DB_API, { cache: 'no-store' });
  } catch (err) {
    console.warn('Could not reset remote database:', err);
  }
};
