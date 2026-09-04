import { Project, Discipline, ExperienceItem, SocialLink } from '../types';
import { projectsData, experienceData } from '../data/portfolioData';

const PROJECTS_STORAGE_KEY = 'aylin_portfolio_projects_v2';
const DISCIPLINES_STORAGE_KEY = 'aylin_portfolio_disciplines_v2';
const SECTIONS_STORAGE_KEY = 'aylin_portfolio_sections_v2';
const EVENT_NAME = 'aylin_portfolio_data_changed';
const SYNC_STATUS_KEY = 'aylin_db_sync_status';

// API Endpoints
const API_BASE = '/api';
const PROJECTS_API = `${API_BASE}/projects.php`;
const DISCIPLINES_API = `${API_BASE}/disciplines.php`;
const SETTINGS_API = `${API_BASE}/settings.php`;
const UPLOAD_API = `${API_BASE}/upload.php`;
const INIT_DB_API = `${API_BASE}/init_db.php`;

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
    targetProjectId: 'orbit-stand-exhibition',
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
    targetProjectId: 'diana-brand-experience',
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
    image: '/images/diplomados/diplomado-after-effects-2023.webp',
    slides: [
      {
        id: 'svid-1',
        image: '/images/diplomados/diplomado-after-effects-2023.webp',
        title: 'After Effects Master Suite',
        visible: true,
      },
      {
        id: 'svid-2',
        image: '/images/hero-hands.jpg',
        title: 'Kinetic Motion Typography',
        visible: true,
      },
    ],
    targetProjectId: 'cyber-kinetic-intro',
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
    image: '/images/diplomados/diplomado 2-Taller-de-creacion-de-contenido-2025.webp',
    slides: [
      {
        id: 'ssm-1',
        image: '/images/diplomados/diplomado 2-Taller-de-creacion-de-contenido-2025.webp',
        title: 'Content Creation Masterclass 2025',
        visible: true,
      },
      {
        id: 'ssm-2',
        image: '/images/orbit-tablet.webp',
        title: 'Interactive Tablet & Digital Feed',
        visible: true,
      },
    ],
    targetProjectId: 'digital-product-ui-3d',
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
  src: string;
  year?: string;
  institution?: string;
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
    title: 'Diplomado Adobe After Effects (2023)',
    src: '/images/diplomados/diplomado-after-effects-2023.webp',
    year: '2023',
    visible: true,
  },
  {
    id: 'dip-2',
    title: 'Taller de Creación de Contenido (2025)',
    src: '/images/diplomados/diplomado-creacion-contenido-2025.webp',
    year: '2025',
    visible: true,
  },
  {
    id: 'dip-3',
    title: 'Diseño Gráfico Publicitario (2021)',
    src: '/images/diplomados/diplomado-diseno-grafico-publicitario-2021.webp',
    year: '2021',
    visible: true,
  },
  {
    id: 'dip-4',
    title: 'Webinar Branding para Diseñadores (2023)',
    src: '/images/diplomados/diplomado-branding-disenadores-2023.webp',
    year: '2023',
    visible: true,
  },
  {
    id: 'dip-5',
    title: 'Introducción al Diseño Narrativo para Videojuegos',
    src: '/images/diplomados/diplomado-diseno-narrativo-videojuegos.webp',
    year: '2023',
    visible: true,
  },
  {
    id: 'dip-6',
    title: 'Diseño de Personajes para Animación y Videojuegos (2022)',
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
    },
    {
      id: 'retro-car',
      name: 'Retro Mini 3D',
      url: '',
      type: 'procedural',
      proceduralKey: 'retroCar',
      stats: '24 Vertices • 28 Structural Edges • 4-Wheel Axle Grid',
      visible: true,
    },
    {
      id: 'cyber-hand',
      name: 'Tactile Hand',
      url: '',
      type: 'procedural',
      proceduralKey: 'cyberHand',
      stats: '36 Articulated Joints • 42 Phalange Nodes',
      visible: true,
    },
    {
      id: 'brand-poly',
      name: 'Polyhedron',
      url: '',
      type: 'procedural',
      proceduralKey: 'brandPoly',
      stats: '12 Facets • 30 Kinetic Edges • Icosahedral Symmetry',
      visible: true,
    },
    {
      id: 'hyper-cube',
      name: 'Tesseract 4D',
      url: '',
      type: 'procedural',
      proceduralKey: 'hyperCube',
      stats: '16 Vertices • 32 Isometric Hyper-Edges',
      visible: true,
    },
  ],
};

// Helper to notify all subscribers that data has changed
const notifyDataChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
};

export const subscribeToPortfolioChanges = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
};

// ==================== REMOTE SYNC ENGINE ====================

let isSyncing = false;

/**
 * Fetch latest projects, disciplines and sections from Hostinger MySQL API
 */
export const syncFromRemoteServer = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || isSyncing) return false;
  isSyncing = true;

  try {
    const [projRes, discRes, secRes] = await Promise.all([
      fetch(PROJECTS_API, { cache: 'no-store' }),
      fetch(DISCIPLINES_API, { cache: 'no-store' }),
      fetch(SETTINGS_API, { cache: 'no-store' }),
    ]);

    let changed = false;

    if (projRes.ok) {
      const remoteProjects = await projRes.json();
      if (Array.isArray(remoteProjects) && remoteProjects.length > 0) {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(remoteProjects));
        changed = true;
      }
    }

    if (discRes.ok) {
      const remoteDisciplines = await discRes.json();
      if (Array.isArray(remoteDisciplines) && remoteDisciplines.length > 0) {
        localStorage.setItem(DISCIPLINES_STORAGE_KEY, JSON.stringify(remoteDisciplines));
        changed = true;
      }
    }

    if (secRes.ok) {
      const remoteSections = await secRes.json();
      if (remoteSections && typeof remoteSections === 'object') {
        localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(remoteSections));
        changed = true;
      }
    }

    if (changed) {
      localStorage.setItem(
        SYNC_STATUS_KEY,
        JSON.stringify({
          connected: true,
          lastSync: new Date().toISOString(),
        })
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

// Initial background sync when module loads in browser
if (typeof window !== 'undefined') {
  setTimeout(() => {
    syncFromRemoteServer();
  }, 100);
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
  let allSections: Record<string, any> = {};
  try {
    const raw = localStorage.getItem(SECTIONS_STORAGE_KEY);
    if (raw) allSections = JSON.parse(raw);
  } catch {}

  allSections[sectionKey] = data;
  localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(allSections));
  notifyDataChanged();

  try {
    await fetch(`${SETTINGS_API}?section=${encodeURIComponent(sectionKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn(`Could not sync section ${sectionKey} with remote API:`, err);
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

export const getStoredProjects = (): Project[] => {
  if (typeof window === 'undefined') return projectsData;
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsData));
      return projectsData;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : projectsData;
  } catch (err) {
    console.error('Error reading stored projects:', err);
    return projectsData;
  }
};

export const saveProject = async (project: Project): Promise<void> => {
  const current = getStoredProjects();
  const index = current.findIndex((p) => p.id === project.id);
  let updated: Project[];
  const finalProject = {
    ...project,
    id: project.id || `proj-${Date.now()}`,
    updatedAt: new Date().toISOString(),
    createdAt: project.createdAt || new Date().toISOString(),
  };

  if (index >= 0) {
    updated = [...current];
    updated[index] = finalProject;
  } else {
    updated = [finalProject, ...current];
  }

  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  notifyDataChanged();

  try {
    await fetch(PROJECTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalProject),
    });
  } catch (err) {
    console.warn('Could not sync project with remote API:', err);
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== projectId);
  
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  notifyDataChanged();

  try {
    await fetch(`${PROJECTS_API}?action=delete&id=${encodeURIComponent(projectId)}`, {
      method: 'POST',
    });
  } catch (err) {
    console.warn('Could not sync delete with remote API:', err);
  }
};

export const toggleProjectFeatured = async (projectId: string): Promise<boolean> => {
  const current = getStoredProjects();
  const project = current.find((p) => p.id === projectId);
  if (!project) return false;

  const nextFeatured = !project.featured;
  project.featured = nextFeatured;
  project.updatedAt = new Date().toISOString();

  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(current));
  notifyDataChanged();

  try {
    await fetch(`${PROJECTS_API}?action=toggle_featured&id=${encodeURIComponent(projectId)}`, {
      method: 'POST',
    });
  } catch (err) {
    console.warn('Could not sync toggle featured with remote API:', err);
  }

  return nextFeatured;
};

// ==================== DISCIPLINES CRUD ====================

export const getStoredDisciplines = (): Discipline[] => {
  if (typeof window === 'undefined') return initialDisciplinesData;
  try {
    const raw = localStorage.getItem(DISCIPLINES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DISCIPLINES_STORAGE_KEY, JSON.stringify(initialDisciplinesData));
      return initialDisciplinesData;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialDisciplinesData;
  } catch (err) {
    console.error('Error reading stored disciplines:', err);
    return initialDisciplinesData;
  }
};

export const saveDiscipline = async (discipline: Discipline): Promise<void> => {
  const current = getStoredDisciplines();
  const index = current.findIndex((d) => d.id === discipline.id);
  let updated: Discipline[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = discipline;
  } else {
    updated = [...current, discipline];
  }

  localStorage.setItem(DISCIPLINES_STORAGE_KEY, JSON.stringify(updated));
  notifyDataChanged();

  try {
    await fetch(DISCIPLINES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discipline),
    });
  } catch (err) {
    console.warn('Could not sync discipline with remote API:', err);
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

    notifyDataChanged();
    return true;
  } catch (err) {
    console.error('Error importing portfolio JSON:', err);
    return false;
  }
};

export const resetPortfolioToDefaults = async (): Promise<void> => {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsData));
  localStorage.setItem(DISCIPLINES_STORAGE_KEY, JSON.stringify(initialDisciplinesData));
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
