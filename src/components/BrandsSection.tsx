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
      className="w-full py-12 md:py-16 relative border-t border-white/10 overflow-hidden"
      aria-label={isEs ? 'Marcas y alianzas' : 'Brands and partnerships'}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[250px] bg-[#76FF03]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col items-center text-center mb-8 space-y-3">
        {/* Badge */}
        <div className="section-tag-pill">
          <Building2 className="badge-icon" />
          <span>
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

      {/* Interactive Full-Width 100% LogoLoop Track */}
      <div className="w-full py-6 md:py-8 bg-white/[0.015] border-y border-white/10 backdrop-blur-sm overflow-hidden relative">
        <LogoLoop
          logos={brandLogos}
          speed={45}
          direction="left"
          logoHeight={56}
          gap={72}
          hoverSpeed={0}
          scaleOnHover={true}
          fadeOut={true}
          ariaLabel={isEs ? 'Carrusel de marcas colaboradoras' : 'Partner brands carousel'}
        />
      </div>
    </section>
  );
};

export default BrandsSection;
