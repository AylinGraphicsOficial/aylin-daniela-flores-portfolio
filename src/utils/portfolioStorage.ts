import { Project, Discipline } from '../types';
import { projectsData } from '../data/portfolioData';

const PROJECTS_STORAGE_KEY = 'aylin_portfolio_projects_v2';
const DISCIPLINES_STORAGE_KEY = 'aylin_portfolio_disciplines_v2';
const EVENT_NAME = 'aylin_portfolio_data_changed';

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
    targetProjectId: 'motion-typography',
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
    targetProjectId: 'orbit-tablet-visual',
    visible: true,
    order: 4,
  },
];

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

// ==================== PROJECTS CRUD ====================

export const getStoredProjects = (): Project[] => {
  if (typeof window === 'undefined') return projectsData;
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsData));
      return projectsData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading stored projects:', err);
    return projectsData;
  }
};

export const saveProject = (project: Project): void => {
  const current = getStoredProjects();
  const index = current.findIndex((p) => p.id === project.id);
  let updated: Project[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    updated = [
      {
        ...project,
        id: project.id || `project-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...current,
    ];
  }
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  notifyDataChanged();
};

export const deleteProject = (projectId: string): void => {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== projectId);
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  notifyDataChanged();
};

export const toggleProjectFeatured = (projectId: string): boolean => {
  const current = getStoredProjects();
  const project = current.find((p) => p.id === projectId);
  if (!project) return false;
  const nextFeatured = !project.featured;
  project.featured = nextFeatured;
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(current));
  notifyDataChanged();
  return nextFeatured;
};

// ==================== DISCIPLINES CRUD ====================

export const getStoredDisciplines = (): Discipline[] => {
  if (typeof window === 'undefined') return initialDisciplinesData;
  try {
    const raw = localStorage.getItem(DISCIPLINES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        DISCIPLINES_STORAGE_KEY,
        JSON.stringify(initialDisciplinesData)
      );
      return initialDisciplinesData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading stored disciplines:', err);
    return initialDisciplinesData;
  }
};

export const saveDiscipline = (discipline: Discipline): void => {
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
  localStorage.setItem(DISCIPLINES_STORAGE_KEY, JSON.stringify(current));
  notifyDataChanged();
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
  localStorage.setItem(DISCIPLINES_STORAGE_KEY, JSON.stringify(current));
  notifyDataChanged();
};

export const deleteDisciplineSlide = (
  disciplineId: string,
  slideId: string
): void => {
  const current = getStoredDisciplines();
  const discipline = current.find((d) => d.id === disciplineId);
  if (!discipline) return;
  discipline.slides = discipline.slides.filter((s) => s.id !== slideId);
  localStorage.setItem(DISCIPLINES_STORAGE_KEY, JSON.stringify(current));
  notifyDataChanged();
};

// ==================== BACKUP / EXPORT / IMPORT ====================

export const exportPortfolioJSON = (): string => {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    projects: getStoredProjects(),
    disciplines: getStoredDisciplines(),
  };
  return JSON.stringify(data, null, 2);
};

export const importPortfolioJSON = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.projects && Array.isArray(parsed.projects)) {
      localStorage.setItem(
        PROJECTS_STORAGE_KEY,
        JSON.stringify(parsed.projects)
      );
    }
    if (parsed.disciplines && Array.isArray(parsed.disciplines)) {
      localStorage.setItem(
        DISCIPLINES_STORAGE_KEY,
        JSON.stringify(parsed.disciplines)
      );
    }
    notifyDataChanged();
    return true;
  } catch (err) {
    console.error('Error importing portfolio JSON:', err);
    return false;
  }
};

export const resetPortfolioToDefaults = (): void => {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsData));
  localStorage.setItem(
    DISCIPLINES_STORAGE_KEY,
    JSON.stringify(initialDisciplinesData)
  );
  notifyDataChanged();
};
