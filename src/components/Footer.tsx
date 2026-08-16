import React from 'react';
import { ArrowUp } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { label: 'INSTAGRAM', href: 'https://instagram.com' },
    { label: 'BEHANCE', href: 'https://behance.net' },
    { label: 'LINKEDIN', href: 'https://linkedin.com' },
    { label: 'DRIBBBLE', href: 'https://dribbble.com' },
    { label: 'ARTSTATION', href: 'https://artstation.com' },
  ];

  return (
    <footer className="w-full py-16 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative z-20 flex flex-col justify-between items-center gap-8">
      {/* Top row */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-3">
          <img src="/logo.webp" alt="Aylin Flores Logo" width={40} height={40} loading="lazy" className="w-10 h-10 object-contain" />
          <div className="flex flex-col items-start">
            <div className="text-xl font-black tracking-tight text-white uppercase font-sans">
              AYLIN FLORES
            </div>
            <span className="text-xs text-gray-400 font-mono mt-0.5">
              Diseñadora Gráfica y Modeladora 3D
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              onClick={playClickSound}
              className="text-xs font-mono font-bold text-gray-400 hover:text-[#76FF03] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#76FF03] hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Back to top */}
        <SpecularButton
          onClick={scrollToTop}
          variant="glass"
          size="icon"
          radius={12}
          className="text-white hover:text-[#76FF03]"
          title="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </SpecularButton>
      </div>

      {/* Bottom row */}
      <div className="w-full pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 font-mono gap-4">
        <span>
          © {new Date().getFullYear()} AYLIN DANIELA FLORES. ALL RIGHTS RESERVED.
        </span>
        <span className="flex items-center space-x-1.5">
          <span>DESIGNED & ENGINEERED WITH KINETIC RIGOR</span>
        </span>
      </div>
    </footer>
  );
};
