import React, { useState, useEffect } from 'react';
import { Clock, Send, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { translations } from '../data/portfolioData';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';

interface ContactSectionProps {
  lang: Language;
  onOpenProjectPlanner: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  onOpenProjectPlanner,
}) => {
  const t = translations[lang];

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formService, setFormService] = useState('3D Modeling & Visualization');
  const [formMessage, setFormMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Live El Salvador Time Clock (UTC-6)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/El_Salvador',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    playClickSound();
    navigator.clipboard.writeText('Floresaylin2@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessSound();
    setIsSent(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#76FF03', '#38B000', '#A3E635']
      });
    } catch {
      // Ignored
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#76FF03]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Info & Time Clock */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="section-tag-pill mb-3">
              <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-ping" />
              <span>GET IN TOUCH</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none mb-4">
              {t.contact.title}
            </h2>
            <p className="text-base text-gray-300 leading-relaxed max-w-md">
              {t.contact.subtitle}
            </p>
          </div>

          {/* Quick Copy Email Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-[#76FF03] uppercase font-bold">
                {t.contact.directEmail}
              </span>
              <SpecularButton
                onClick={handleCopyEmail}
                variant="glass"
                size="sm"
                radius={8}
                className="text-xs font-mono text-gray-200"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#76FF03]" />
                    <span className="text-[#76FF03] font-bold">COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </SpecularButton>
            </div>
            <p className="text-lg md:text-xl font-bold font-mono text-white select-all">
              Floresaylin2@gmail.com
            </p>
          </div>

          {/* Live El Salvador Clock */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-gray-400 block">
                {t.contact.localTime}
              </span>
              <span className="text-2xl font-black font-mono text-white tracking-wider">
                {currentTime || '02:30:00 PM'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#38B000]/20 border border-[#76FF03]/50 flex items-center justify-center text-[#76FF03]">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Start Project Banner */}
          <div className="glass-panel p-6 rounded-2xl border border-[#76FF03]/30 bg-gradient-to-br from-[#38B000]/20 to-transparent flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Looking for a tailored quote?</h4>
              <p className="text-xs text-gray-300">Use the step-by-step interactive project calculator.</p>
            </div>
            <SpecularButton
              onClick={() => {
                playClickSound();
                onOpenProjectPlanner();
              }}
              variant="solid-lime"
              size="sm"
              radius={12}
              className="text-xs font-bold whitespace-nowrap"
            >
              LAUNCH ESTIMATOR
            </SpecularButton>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7 glass-panel p-6 md:p-10 rounded-2xl border border-white/10 relative">
          {isSent ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#76FF03]/20 border border-[#76FF03] mx-auto flex items-center justify-center text-[#76FF03] shadow-[0_0_20px_#76FF03]">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase">
                Message Received!
              </h3>
              <p className="text-sm text-gray-300 max-w-md mx-auto">
                Thank you, {formName || 'friend'}. I have received your message and will respond within 24 hours.
              </p>
              <SpecularButton
                onClick={() => setIsSent(false)}
                variant="glass"
                size="md"
                radius={12}
                className="mt-4 text-xs font-mono font-bold"
              >
                SEND ANOTHER MESSAGE
              </SpecularButton>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-gray-300 block">
                    NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.contact.namePlaceholder}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#76FF03] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-gray-300 block">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t.contact.emailPlaceholder}
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#76FF03] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gray-300 block">
                  {t.contact.serviceInterest}
                </label>
                <select
                  value={formService}
                  onChange={(e) => setFormService(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#081008] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#76FF03] transition-colors cursor-pointer"
                >
                  <option value="3D Modeling & Visualization">3D Modeling & Visualization</option>
                  <option value="Branding & Corporate Identity">Branding & Corporate Identity</option>
                  <option value="Motion Graphics & Video">Motion Graphics & Video</option>
                  <option value="Digital Illustration & Art">Digital Illustration & Art</option>
                  <option value="Full Creative Direction">Full Creative Direction & Consultation</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gray-300 block">
                  PROJECT MESSAGE *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={t.contact.messagePlaceholder}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#76FF03] transition-colors"
                />
              </div>

              <SpecularButton
                type="submit"
                variant="solid-lime"
                size="lg"
                radius={12}
                className="w-full font-black text-xs md:text-sm tracking-wider"
              >
                <Send className="w-4 h-4 text-[#050B05]" />
                <span>{t.contact.sendBtn}</span>
              </SpecularButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
