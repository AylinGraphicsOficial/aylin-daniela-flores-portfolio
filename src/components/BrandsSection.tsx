import React from 'react';
import { Language } from '../types';
import { LogoLoop, LogoItem } from './LogoLoop';
import { Building2, Sparkles } from 'lucide-react';

interface BrandsSectionProps {
  lang: Language;
}

const brandLogos: LogoItem[] = [
  {
    src: '/images/brands/cattleya.webp',
    alt: 'Cattleya',
    title: 'Cattleya',
  },
  {
    src: '/images/brands/funta.webp',
    alt: 'Funta',
    title: 'Funta',
  },
  {
    src: '/images/brands/holy-nation.webp',
    alt: 'Holy Nation',
    title: 'Holy Nation',
  },
  {
    src: '/images/brands/illusion-games.svg',
    alt: 'Illusion Games',
    title: 'Illusion Games',
  },
  {
    src: '/images/brands/kadosh-kids.svg',
    alt: 'Kadosh Kids',
    title: 'Kadosh Kids',
  },
  {
    src: '/images/brands/loroco-games.svg',
    alt: 'Loroco Games',
    title: 'Loroco Games',
  },
  {
    src: '/images/brands/los-rebusca.svg',
    alt: 'Los Rebusca',
    title: 'Los Rebusca',
  },
  {
    src: '/images/brands/printastic.png',
    alt: 'Printastic',
    title: 'Printastic',
  },
  {
    src: '/images/brands/uez-y-asociado.webp',
    alt: 'Uez y Asociados',
    title: 'Uez y Asociados',
  },
];

export const BrandsSection: React.FC<BrandsSectionProps> = ({ lang }) => {
  const isEs = lang === 'es';

  return (
    <section
      id="brands"
      className="py-12 md:py-18 px-4 md:px-8 max-w-7xl mx-auto relative border-t border-white/10"
      aria-label={isEs ? 'Marcas y alianzas' : 'Brands and partnerships'}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[250px] bg-[#76FF03]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center text-center mb-8 space-y-3">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Building2 className="w-3.5 h-3.5 text-[#76FF03]" />
          <span className="text-xs font-bold tracking-[0.25em] text-[#76FF03] uppercase font-mono">
            {isEs ? 'MARCAS Y ALIANZAS' : 'BRANDS & PARTNERSHIPS'}
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-300 max-w-2xl font-medium tracking-wide">
          {isEs
            ? 'Empresas, organizaciones más con las que he colaborado a lo largo de mi trayectoria.'
            : 'Companies, organizations and partners I have collaborated with throughout my career.'}
        </p>
      </div>

      {/* Interactive LogoLoop Container */}
      <div className="relative w-full rounded-2xl bg-black/40 border border-white/5 p-6 md:p-8 backdrop-blur-md overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <LogoLoop
          logos={brandLogos}
          speed={45}
          direction="left"
          logoHeight={52}
          gap={64}
          hoverSpeed={0}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="#081008"
          ariaLabel={isEs ? 'Carrusel de marcas colaboradoras' : 'Partner brands carousel'}
        />
      </div>
    </section>
  );
};

export default BrandsSection;
