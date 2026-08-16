import React from 'react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';
import { playClickSound } from '../utils/audio';

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
        <div className="flex flex-col items-center md:items-start">
          <div className="text-2xl font-black tracking-tighter text-white uppercase font-mono">
            STUDIO_KINETIC
          </div>
          <span className="text-xs text-gray-400 font-mono mt-1">
            Visual Communication & 3D Visualization Studio
          </span>
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
              className="text-xs font-mono font-bold text-gray-400 hover:text-[#00E5FF] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#00E5FF] hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="p-3 rounded-xl bg-white/5 hover:bg-[#00E5FF] hover:text-[#0A0F14] text-white border border-white/10 transition-all duration-300 shadow-md group"
          title="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
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
