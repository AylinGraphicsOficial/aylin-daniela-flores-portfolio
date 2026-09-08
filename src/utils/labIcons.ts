import type { LucideIcon } from 'lucide-react';
import {
  Box,
  Castle,
  Bike,
  Cat,
  Dog,
  Bird,
  Fish,
  Rabbit,
  Turtle,
  Bug,
  Bot,
  Rocket,
  Ghost,
  Car,
  Plane,
  Star,
  Gem,
  Crown,
  Palette,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface LabIconOption {
  key: string;
  label: string;
  Icon: LucideIcon;
}

export const LAB_MODEL_ICONS: LabIconOption[] = [
  { key: 'box', label: 'Cubo Genérico', Icon: Box },
  { key: 'castle', label: 'Castillo / Torre', Icon: Castle },
  { key: 'bike', label: 'Motocicleta', Icon: Bike },
  { key: 'cat', label: 'Gato', Icon: Cat },
  { key: 'dog', label: 'Perro', Icon: Dog },
  { key: 'bird', label: 'Ave', Icon: Bird },
  { key: 'fish', label: 'Pez', Icon: Fish },
  { key: 'rabbit', label: 'Conejo', Icon: Rabbit },
  { key: 'turtle', label: 'Tortuga / Reptil', Icon: Turtle },
  { key: 'bug', label: 'Insecto', Icon: Bug },
  { key: 'bot', label: 'Robot / Personaje', Icon: Bot },
  { key: 'rocket', label: 'Cohete', Icon: Rocket },
  { key: 'ghost', label: 'Duende / Espíritu', Icon: Ghost },
  { key: 'car', label: 'Automóvil', Icon: Car },
  { key: 'plane', label: 'Avión', Icon: Plane },
  { key: 'star', label: 'Estrella', Icon: Star },
  { key: 'gem', label: 'Gema', Icon: Gem },
  { key: 'crown', label: 'Corona', Icon: Crown },
  { key: 'palette', label: 'Paleta de Arte', Icon: Palette },
  { key: 'layers', label: 'Capas / Modelado', Icon: Layers },
  { key: 'sparkles', label: 'Brillo / Magia', Icon: Sparkles },
];

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  LAB_MODEL_ICONS.map((opt) => [opt.key, opt.Icon])
);

export const getLabModelIcon = (key?: string): LucideIcon => {
  if (key && ICON_MAP[key]) return ICON_MAP[key];
  return Box;
};
