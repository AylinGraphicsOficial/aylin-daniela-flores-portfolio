import React, { useState, useEffect } from 'react';
import { Language, DiplomadoItem } from '../types';
import { LogoLoop } from './LogoLoop';
import { Award, GraduationCap } from 'lucide-react';
import {
  getStoredDiplomados,
  subscribeToPortfolioChanges,
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

  const visibleDiplomados = diplomados.filter((d) => d.visible !== false);

  if (visibleDiplomados.length === 0) return null;

  return (
    <section
      id="diplomados"
      className="w-full py-12 md:py-16 relative border-t border-white/10 overflow-hidden"
      aria-label={isEs ? 'Diplomados y certificaciones' : 'Diplomas and certifications'}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[220px] bg-[#76FF03]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col items-center text-center mb-8 space-y-2.5">
        {/* Badge */}
        <div className="section-tag-pill">
          <Award className="badge-icon" />
          <span>
            {isEs ? 'DIPLOMADOS & CERTIFICACIONES' : 'DIPLOMAS & CERTIFICATIONS'}
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-xs md:text-sm text-gray-300 max-w-xl font-medium tracking-wide">
          {isEs
            ? 'Formación continua, especializaciones y diplomados profesionales.'
            : 'Continuous learning, specialized courses, and certified diplomas.'}
        </p>
      </div>

      {/* Infinite LogoLoop Track with Diploma Cards & Synchronized Labels */}
      <div className="w-full py-8 md:py-12 bg-white/[0.015] border-y border-white/10 backdrop-blur-sm overflow-hidden relative">
        <LogoLoop
          logos={visibleDiplomados}
          speed={24}
          direction="right"
          logoHeight={285}
          gap={50}
          hoverSpeed={0}
          scaleOnHover={false}
          fadeOut={true}
          className="logoloop--full-color"
          ariaLabel={isEs ? 'Carrusel de diplomados y certificaciones' : 'Diplomas and certifications carousel'}
          renderItem={(item: DiplomadoItem, key) => (
            <div
              key={key}
              className="flex flex-col items-center group cursor-pointer select-none transition-transform duration-300 hover:scale-[1.03]"
            >
              {/* Diploma Certificate Card */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/80 p-2 shadow-2xl transition-all duration-300 group-hover:border-[#76FF03]/80 group-hover:shadow-[0_0_30px_rgba(118,255,3,0.35)]">
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-[180px] md:h-[210px] w-auto max-w-[320px] md:max-w-[400px] object-contain rounded-xl block pointer-events-none"
                  loading="lazy"
                  draggable={false}
                />
              </div>

              {/* Synchronized Attached Label Badge: Diploma Name + Awarded Degree / Institution */}
              <div className="mt-3 w-full max-w-[300px] md:max-w-[380px] px-3.5 py-2 rounded-xl bg-black/90 backdrop-blur-md border border-white/10 text-center shadow-xl transition-all duration-300 group-hover:border-[#76FF03]/50 group-hover:bg-[#071207]/95">
                <p className="text-white text-xs md:text-sm font-bold tracking-tight truncate group-hover:text-[#76FF03] transition-colors leading-snug" title={item.title}>
                  {item.title}
                </p>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-[10px] md:text-[11px] font-mono text-emerald-400 font-semibold truncate">
                  <GraduationCap className="w-3.5 h-3.5 text-[#76FF03] shrink-0" />
                  <span className="truncate">
                    {item.degree || 'Certificado Oficial'}
                    {item.institution ? ` • ${item.institution}` : ''}
                    {item.year ? ` (${item.year})` : ''}
                  </span>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default DiplomadosSection;
