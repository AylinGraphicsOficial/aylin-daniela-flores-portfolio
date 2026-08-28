import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { LogoLoop, LogoItem } from './LogoLoop';
import { Award } from 'lucide-react';
import {
  getStoredDiplomados,
  subscribeToPortfolioChanges,
  DiplomadoItem,
} from '../utils/portfolioStorage';

interface DiplomadosSectionProps {
  lang: Language;
}

export const DiplomadosSection: React.FC<DiplomadosSectionProps> = ({ lang }) => {
  const isEs = lang === 'es';
  const [diplomados, setDiplomados] = useState<DiplomadoItem[]>(getStoredDiplomados);

  useEffect(() => {
    const handleUpdate = () => {
      setDiplomados(getStoredDiplomados());
    };
    handleUpdate();
    const unsubscribe = subscribeToPortfolioChanges(handleUpdate);
    return () => unsubscribe();
  }, []);

  const visibleLogos: LogoItem[] = diplomados
    .filter((d) => d.visible !== false)
    .map((d) => ({
      src: d.src,
      alt: d.title,
      title: d.title,
    }));

  if (visibleLogos.length === 0) return null;

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
          logos={visibleLogos}
          speed={26}
          direction="right"
          logoHeight={215}
          gap={80}
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
