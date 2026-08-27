import React from 'react';
import { Language } from '../types';
import { LogoLoop, LogoItem } from './LogoLoop';
import { Award } from 'lucide-react';

interface DiplomadosSectionProps {
  lang: Language;
}

const diplomadosLogos: LogoItem[] = [
  {
    src: '/images/diplomados/diplomado-after-effects-2023.webp',
    alt: 'Diplomado Adobe After Effects (2023)',
    title: 'Diplomado Adobe After Effects (2023)',
  },
  {
    src: '/images/diplomados/diplomado-creacion-contenido-2025.webp',
    alt: 'Taller de Creación de Contenido (2025)',
    title: 'Taller de Creación de Contenido (2025)',
  },
  {
    src: '/images/diplomados/diplomado-diseno-grafico-publicitario-2021.webp',
    alt: 'Diseño Gráfico Publicitario (2021)',
    title: 'Diseño Gráfico Publicitario (2021)',
  },
  {
    src: '/images/diplomados/diplomado-branding-disenadores-2023.webp',
    alt: 'Webinar Branding para Diseñadores (2023)',
    title: 'Webinar Branding para Diseñadores (2023)',
  },
  {
    src: '/images/diplomados/diplomado-diseno-narrativo-videojuegos.webp',
    alt: 'Introducción al Diseño Narrativo para Videojuegos',
    title: 'Introducción al Diseño Narrativo para Videojuegos',
  },
  {
    src: '/images/diplomados/diplomado-diseno-personajes-animacion-2022.webp',
    alt: 'Diseño de Personajes para Animación y Videojuegos (2022)',
    title: 'Diseño de Personajes para Animación y Videojuegos (2022)',
  },
];

export const DiplomadosSection: React.FC<DiplomadosSectionProps> = ({ lang }) => {
  const isEs = lang === 'es';

  return (
    <section
      id="diplomados"
      className="w-full py-10 md:py-14 relative border-t border-white/10 overflow-hidden"
      aria-label={isEs ? 'Diplomados y certificaciones' : 'Diplomas and certifications'}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[200px] bg-[#76FF03]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col items-center text-center mb-6 space-y-2.5">
        {/* Badge */}
        <div className="section-tag-pill">
          <Award className="badge-icon" />
          <span>
            {isEs ? 'DIPLOMADOS & CERTIFICACIONES' : 'DIPLOMAS & CERTIFICATIONS'}
          </span>
        </div>

        {/* Small Subtitle */}
        <p className="text-xs md:text-sm text-gray-300 max-w-xl font-medium tracking-wide">
          {isEs
            ? 'Formación continua, especializaciones y diplomados profesionales.'
            : 'Continuous learning, specialized courses, and certified diplomas.'}
        </p>
      </div>

      {/* Infinite LogoLoop Track in Full Color (Large, sharp & readable diplomas) */}
      <div className="w-full py-10 md:py-16 bg-white/[0.015] border-y border-white/10 backdrop-blur-sm overflow-hidden relative">
        <LogoLoop
          logos={diplomadosLogos}
          speed={26}
          direction="right"
          logoHeight={165}
          gap={70}
          hoverSpeed={0}
          scaleOnHover={true}
          fadeOut={true}
          className="logoloop--full-color"
          ariaLabel={isEs ? 'Carrusel de diplomados y certificaciones' : 'Diplomas and certifications carousel'}
        />
      </div>
    </section>
  );
};

export default DiplomadosSection;
