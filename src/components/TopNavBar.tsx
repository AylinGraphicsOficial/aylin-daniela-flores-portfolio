import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Globe, Menu, X, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/portfolioData';
import { playClickSound, toggleAudio } from '../utils/audio';
import { SpecularButton } from './SpecularButton';

interface TopNavBarProps {
  lang: Language;
  onLanguageToggle: () => void;
  onOpenProjectPlanner: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  lang,
  onLanguageToggle,
  onOpenProjectPlanner,
}) => {
  const t = translations[lang];
  const [isScrolled, setIsScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
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
    if (nextState) playClickSound();
  };

  const navLinks = [
    { href: '#work', label: t.nav.work },
    { href: '#about', label: t.nav.about },
    { href: '#viewer3d', label: t.nav.viewer3d },
    { href: '#experience', label: t.nav.experience },
    { href: '#stats', label: t.nav.stats },
    { href: '#testimonials', label: t.nav.testimonials },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050B05]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-transparent py-5 md:py-6 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={playClickSound}
          className="group flex items-center space-x-2.5 font-black text-lg md:text-xl tracking-tighter text-white"
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

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={playClickSound}
              className="text-xs font-bold tracking-[0.15em] text-gray-300 hover:text-[#76FF03] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#76FF03] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Tools: Sound, Language, CTA */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Sound FX Toggle */}
          <SpecularButton
            onClick={handleSoundToggle}
            variant="glass"
            size="icon"
            radius={10}
            className={soundOn ? 'border-[#76FF03] text-[#76FF03]' : 'text-gray-400'}
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
            className="text-xs font-mono text-gray-200"
            title="Toggle English / Español"
          >
            <Globe className="w-3.5 h-3.5 text-[#76FF03]" />
            <span className="font-bold">{lang.toUpperCase()}</span>
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
            className="text-xs font-bold tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.nav.startProject}</span>
          </SpecularButton>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center space-x-2">
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
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#050B05]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-8 space-y-6 animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map(link => (
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
