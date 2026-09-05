import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Globe, Menu, X, Sparkles, Mail, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/portfolioData';
import { playClickSound, toggleAudio, play8BitArcadeSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';
import { GooeyNav } from './GooeyNav';

interface TopNavBarProps {
  lang: Language;
  onLanguageToggle: () => void;
  onOpenProjectPlanner: () => void;
  currentView?: 'home' | 'projects' | 'project-detail' | 'discipline-detail' | 'contact' | 'admin';
  onNavigateHome?: () => void;
  onNavigateToProjects?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  lang,
  onLanguageToggle,
  onOpenProjectPlanner,
  currentView = 'home',
  onNavigateHome,
  onNavigateToProjects,
}) => {
  const t = translations[lang];
  const [isScrolled, setIsScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const nextState = toggleAudio();
    setSoundOn(nextState);
    if (nextState) play8BitArcadeSound();
  };

  const navLinks = [
    { href: '#work', label: t.nav.work },
    { href: '#viewer3d', label: t.nav.viewer3d },
    { href: '#experience', label: t.nav.experience },
    { href: '#about', label: t.nav.about },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050B05]/92 backdrop-blur-md border-b border-white/10 shadow-2xl py-3'
          : 'bg-transparent py-4 md:py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            play8BitArcadeSound();
            if (onNavigateHome) onNavigateHome();
            else window.location.hash = '';
          }}
          className="group flex items-center space-x-2.5 font-black text-lg md:text-xl tracking-tighter text-white cursor-pointer"
        >
          <img src="/logo.webp" alt="Aylin Flores Logo" width={36} height={36} className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
          <div className="flex flex-col justify-center">
            <span className="leading-tight font-black text-white group-hover:text-[#76FF03] transition-colors text-base md:text-lg">
              Aylin Flores
            </span>
            <span className="text-[10px] font-mono text-gray-300 tracking-wider font-semibold uppercase">
              Diseñadora Gráfica
            </span>
          </div>
        </a>

        {/* Desktop 8-Bit Pixel Arcade Navigation (Only on Home Page) */}
        {currentView === 'home' && (
          <div className="hidden lg:flex items-center">
            <GooeyNav
              items={navLinks}
              particleCount={22}
              particleDistances={[80, 15]}
              animationTime={500}
              timeVariance={200}
            />
          </div>
        )}

        {/* Right Action Tools: Sound, Language, Contactar, CTA with Uniform Gap Spacing */}
        <div className="hidden sm:flex items-center gap-2.5 sm:gap-3 pl-2">
          {/* Sound FX Toggle */}
          <SpecularButton
            onClick={handleSoundToggle}
            variant="glass"
            size="icon"
            radius={10}
            className={`h-[38px] w-[38px] min-h-[38px] max-h-[38px] p-0 flex items-center justify-center ${soundOn ? 'border-[#76FF03] text-[#76FF03]' : 'text-gray-400'}`}
            title={soundOn ? 'Sound effects enabled' : 'Enable tactile audio'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#76FF03]" /> : <VolumeX className="w-4 h-4" />}
          </SpecularButton>

          {/* Language Switcher */}
          <SpecularButton
            onClick={() => {
              playClickSound();
              onLanguageToggle();
            }}
            variant="glass"
            size="sm"
            radius={10}
            className="h-[38px] min-h-[38px] max-h-[38px] px-3 flex items-center space-x-1.5 text-xs font-mono text-gray-200"
            title="Toggle English / Español"
          >
            <Globe className="w-3.5 h-3.5 text-[#76FF03]" />
            <span className="font-bold">{lang.toUpperCase()}</span>
          </SpecularButton>

          {currentView === 'contact' ? (
            /* Return to Portfolio button when already on contact page */
            <SpecularButton
              onClick={() => {
                playClickSound();
                if (onNavigateHome) onNavigateHome();
                else window.location.hash = '';
              }}
              variant="solid-lime"
              size="sm"
              radius={10}
              className="h-[38px] min-h-[38px] max-h-[38px] px-4 flex items-center space-x-1.5 text-xs font-bold tracking-wider whitespace-nowrap shadow-[0_0_15px_rgba(118,255,3,0.3)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'VOLVER AL PORTAFOLIO' : 'BACK TO PORTFOLIO'}</span>
            </SpecularButton>
          ) : (
            <>
              {/* Direct Contact Button */}
              <SpecularButton
                onClick={() => {
                  playClickSound();
                  onOpenProjectPlanner();
                }}
                variant="glass"
                size="sm"
                radius={10}
                className="h-[38px] min-h-[38px] max-h-[38px] px-3.5 flex items-center space-x-1.5 text-xs font-mono font-bold text-gray-200 border-white/10 hover:border-[#76FF03]/40"
                title="Página de contacto"
              >
                <Mail className="w-3.5 h-3.5 text-[#76FF03]" />
                <span>{lang === 'es' ? 'CONTACTAR' : 'CONTACT'}</span>
              </SpecularButton>

              {/* Main CTA */}
              <SpecularButton
                onClick={() => {
                  playClickSound();
                  onOpenProjectPlanner();
                }}
                variant="solid-lime"
                size="sm"
                radius={10}
                className="h-[38px] min-h-[38px] max-h-[38px] px-4 flex items-center space-x-1.5 text-xs font-bold tracking-wider whitespace-nowrap shadow-[0_0_15px_rgba(118,255,3,0.3)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.nav.startProject}</span>
              </SpecularButton>
            </>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="flex sm:hidden items-center space-x-2">
          {currentView === 'contact' && (
            <SpecularButton
              onClick={() => {
                playClickSound();
                if (onNavigateHome) onNavigateHome();
                else window.location.hash = '';
              }}
              variant="glass"
              size="sm"
              radius={10}
              className="text-xs font-mono text-[#76FF03] flex items-center gap-1 px-2.5 py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold">{lang === 'es' ? 'Inicio' : 'Home'}</span>
            </SpecularButton>
          )}
          {/* Mobile Sound Toggle on secondary pages */}
          {currentView !== 'home' && (
            <SpecularButton
              onClick={handleSoundToggle}
              variant="glass"
              size="icon"
              radius={10}
              className="h-8 w-8 p-0 flex items-center justify-center text-[#76FF03]"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </SpecularButton>
          )}

          <SpecularButton
            onClick={() => {
              playClickSound();
              onLanguageToggle();
            }}
            variant="glass"
            size="sm"
            radius={10}
            className="text-xs font-mono text-[#76FF03]"
          >
            {lang.toUpperCase()}
          </SpecularButton>

          {currentView === 'home' && (
            <SpecularButton
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              variant="glass"
              size="icon"
              radius={10}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </SpecularButton>
          )}
        </div>
      </div>

      {/* Mobile Drawer (Only on Home Page) */}
      {currentView === 'home' && mobileMenuOpen && (
        <div className="sm:hidden bg-[#050B05]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-8 space-y-6 animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(false);
                }}
                className="text-base font-bold text-gray-200 hover:text-[#76FF03] py-1 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <SpecularButton
              onClick={() => {
                handleSoundToggle();
              }}
              variant="glass"
              size="md"
              radius={10}
              className="w-full text-xs text-gray-300"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#76FF03]" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundOn ? 'Tactile Audio: On' : 'Tactile Audio: Off'}</span>
            </SpecularButton>

            <SpecularButton
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(false);
                onOpenProjectPlanner();
              }}
              variant="glass"
              size="md"
              radius={10}
              className="w-full text-xs font-bold text-gray-200 border-white/10"
            >
              <Mail className="w-4 h-4 text-[#76FF03]" />
              <span>{lang === 'es' ? 'CONTACTAR' : 'CONTACT'}</span>
            </SpecularButton>

            <SpecularButton
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(false);
                onOpenProjectPlanner();
              }}
              variant="solid-lime"
              size="md"
              radius={10}
              className="w-full text-xs font-black tracking-wider"
            >
              {t.nav.startProject}
            </SpecularButton>
          </div>
        </div>
      )}
    </header>
  );
};
