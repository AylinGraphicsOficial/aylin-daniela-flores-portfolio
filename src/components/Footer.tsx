import React, { useState, useEffect } from 'react';
import { ArrowUp, Lock } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';
import { getStoredSocials, subscribeToPortfolioChanges } from '../utils/portfolioStorage';
import { SocialLink } from '../types';
import { SocialIcon } from './SocialIcon';

interface FooterProps {
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(getStoredSocials);

  useEffect(() => {
    const updateSocials = () => {
      setSocialLinks(getStoredSocials());
    };
    return subscribeToPortfolioChanges(updateSocials);
  }, []);

  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleSocials = socialLinks.filter((link) => link.visible !== false);

  return (
    <footer className="w-full py-16 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative z-20 flex flex-col justify-between items-center gap-8">
      {/* Top row */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.webp"
            alt="Aylin Flores Logo"
            width={40}
            height={40}
            loading="lazy"
            className="w-10 h-10 object-contain"
          />
          <div className="flex flex-col items-start">
            <div className="text-xl font-black tracking-tight text-white uppercase font-sans">
              AYLIN FLORES
            </div>
            <span className="text-xs text-gray-400 font-mono mt-0.5">
              Diseñadora Gráfica y Modeladora 3D
            </span>
          </div>
        </div>

        {/* Social Links with Logo and Label */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
          {visibleSocials.map((link) => (
            <a
              key={link.id || link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              onClick={playClickSound}
              onMouseEnter={playHoverSound}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#76FF03]/10 border border-white/10 hover:border-[#76FF03]/40 text-xs font-mono font-bold text-gray-300 hover:text-[#76FF03] transition-all duration-300 shadow-sm"
              title={`Visitar ${link.label}`}
            >
              <SocialIcon
                preset={link.iconPreset || link.label.toLowerCase()}
                logoUrl={link.logoUrl}
                className="w-4 h-4 text-gray-400 group-hover:text-[#76FF03] group-hover:scale-110 transition-all"
              />
              <span>{link.label}</span>
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

      {/* Bottom row with Discreet Admin Login Lock Button */}
      <div className="w-full pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 font-mono gap-4">
        <span>
          © {new Date().getFullYear()} AYLIN DANIELA FLORES. ALL RIGHTS RESERVED.
        </span>

        <div className="flex items-center gap-4">

          {/* Discreet Admin Login Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onOpenAdminLogin) onOpenAdminLogin();
            }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-[#76FF03] hover:bg-white/5 transition-all opacity-40 hover:opacity-100 cursor-pointer"
            title="Acceso Administrativo / Dashboard"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
