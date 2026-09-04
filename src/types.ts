export type Language = 'en' | 'es';

export interface Project {
  id: string;
  title: string;
  category: '3D MODELING' | 'BRANDING' | 'DIGITAL ART' | 'MOTION';
  year: string;
  client: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  galleryImages?: string[];
  logo?: string; // Logotipo o imagen representativa del proyecto / marca a la par del título
  sliderImage?: string; // Imagen personalizada para el slider del Hero
  sliderTitle?: string; // Título personalizado para el slider del Hero
  sliderOrder?: number; // Orden de visualización en el slider del Hero
  videoUrl?: string; // YouTube, Vimeo, direct MP4 URL
  videoClip?: string; // Small MP4 or WebM video file
  gifUrl?: string; // Animated GIF
  tags: string[];
  modelType?: 'car' | 'hand' | 'poly' | 'cube';
  featured?: boolean;
  bentoSpan?: string; // Tailwind grid span classes
  deliverables?: string[];
  metrics?: { label: string; value: string }[];
  colorPalette?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DisciplineSlide {
  id: string;
  image: string;
  title?: string;
  description?: string;
  visible: boolean;
  videoUrl?: string;
}

export interface Discipline {
  id: string;
  number: string;
  verticalTextEs: string;
  verticalTextEn: string;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  descEs: string;
  descEn: string;
  image: string;
  slides: DisciplineSlide[];
  targetProjectId: string;
  visible: boolean;
  order: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  isCurrent?: boolean;
  description: string;
  responsibilities: string[];
  toolsUsed: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  skills: { name: string; level: number; experience: string; isHighlight?: boolean }[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  projectRef: string;
}

export interface ProjectInquiry {
  services: string[];
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  logoUrl?: string;
  iconPreset?: string;
  visible: boolean;
  order?: number;
}

