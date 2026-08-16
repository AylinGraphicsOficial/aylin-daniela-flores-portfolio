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
  tags: string[];
  modelType?: 'car' | 'hand' | 'poly' | 'cube';
  featured?: boolean;
  bentoSpan?: string; // Tailwind grid span classes
  deliverables?: string[];
  metrics?: { label: string; value: string }[];
  colorPalette?: string[];
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
