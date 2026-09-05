import React, { useState, useEffect } from 'react';
import { Send, Check, ArrowLeft, Globe, Volume2, VolumeX, Mail, Sparkles, Clock, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { translations } from '../data/portfolioData';
import { playClickSound, playSuccessSound, toggleAudio, play8BitArcadeSound } from '../utils/audio';
import { SpecularButton } from './SpecularButton';
import { saveContactMessage } from '../utils/portfolioStorage';

interface ProjectContactPageProps {
  lang: Language;
  onLanguageToggle: () => void;
  onNavigateHome: () => void;
}

export const ProjectContactPage: React.FC<ProjectContactPageProps> = ({
  lang,
  onLanguageToggle,
  onNavigateHome,
}) => {
  const t = translations[lang];

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formService, setFormService] = useState('3D Modeling & Visualization');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
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

  const handleSoundToggle = () => {
    const nextState = toggleAudio();
    setSoundOn(nextState);
    if (nextState) play8BitArcadeSound();
  };

  const handleCopyEmail = () => {
    playClickSound();
    navigator.clipboard.writeText('Floresaylin2@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;

    setIsSubmitting(true);
    playClickSound();

    try {
      await saveContactMessage({
        name: formName.trim(),
        email: formEmail.trim(),
        service: formService,
        message: formMessage.trim(),
      });

      playSuccessSound();
      setIsSent(true);

      try {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#76FF03', '#38B000', '#A3E635', '#FFFFFF'],
        });
      } catch {
        // Safe fallback
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B05] text-white flex flex-col relative overflow-hidden font-sans selection:bg-[#76FF03] selection:text-black">
      {/* Background Ambience Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#76FF03]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#38B000]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#76FF03]/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Cyber Grid Subtle Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, #76FF03 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />

      {/* Top Header Bar */}
      <header className="relative z-20 border-b border-white/10 bg-[#050B05]/80 backdrop-blur-md px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <SpecularButton
            onClick={() => {
              playClickSound();
              onNavigateHome();
            }}
            variant="glass"
            size="sm"
            radius={10}
            className="flex items-center gap-2 text-xs font-mono text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 text-[#76FF03]" />
            <span>{lang === 'es' ? 'VOLVER AL PORTAFOLIO' : 'BACK TO PORTFOLIO'}</span>
          </SpecularButton>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <SpecularButton
              onClick={handleSoundToggle}
              variant="glass"
              size="icon"
              radius={10}
              className={`h-[36px] w-[36px] p-0 flex items-center justify-center ${soundOn ? 'border-[#76FF03] text-[#76FF03]' : 'text-gray-400'}`}
              title="Toggle tactile sound"
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
              className="h-[36px] px-3 flex items-center gap-1.5 text-xs font-mono text-gray-200"
            >
              <Globe className="w-3.5 h-3.5 text-[#76FF03]" />
              <span className="font-bold">{lang.toUpperCase()}</span>
            </SpecularButton>
          </div>
        </div>
      </header>

      {/* Main Form Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 md:py-16 relative z-10">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          
          {/* Centered Logo & Branding Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-[#76FF03]/25 blur-2xl rounded-full scale-125 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
              <img
                src="/logo.webp"
                alt="Aylin Daniela Flores"
                width={88}
                height={88}
                className="w-20 h-20 md:w-24 md:h-24 mx-auto object-contain relative z-10 transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76FF03]/10 border border-[#76FF03]/30 text-[#76FF03] text-[11px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#76FF03] animate-ping" />
                <span>{lang === 'es' ? 'INICIAR PROYECTO & CONTACTO' : 'START PROJECT & INQUIRY'}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                {lang === 'es' ? 'Creemos Algo Extraordinario' : 'Let\'s Create Something Extraordinary'}
              </h1>
              <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
                {lang === 'es'
                  ? 'Cuéntame sobre tu proyecto, objetivos y necesidades de diseño. Tu mensaje llegará directamente a mi bandeja de entrada.'
                  : 'Tell me about your project, goals and design needs. Your inquiry will arrive directly into my inbox.'}
              </p>
            </div>
          </div>

          {/* Form Card (Styled like Screenshot 1) */}
          <div className="glass-panel p-6 sm:p-8 md:p-10 rounded-3xl border border-white/15 bg-[#081008]/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative">
            {isSent ? (
              <div className="py-12 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#76FF03]/20 border border-[#76FF03] mx-auto flex items-center justify-center text-[#76FF03] shadow-[0_0_30px_#76FF03]">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                    {lang === 'es' ? '¡Mensaje Enviado con Éxito!' : 'Inquiry Successfully Sent!'}
                  </h3>
                  <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                    {lang === 'es'
                      ? `Gracias por escribir, ${formName}. He recibido tu solicitud en mi bandeja de entrada y te responderé en menos de 24 horas.`
                      : `Thank you, ${formName}. I've received your request in my inbox and will get back to you within 24 hours.`}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <SpecularButton
                    onClick={() => {
                      playClickSound();
                      setIsSent(false);
                      setFormMessage('');
                    }}
                    variant="glass"
                    size="md"
                    radius={12}
                    className="text-xs font-mono font-bold text-gray-200"
                  >
                    {lang === 'es' ? 'ENVIAR OTRO MENSAJE' : 'SEND ANOTHER INQUIRY'}
                  </SpecularButton>
                  <SpecularButton
                    onClick={() => {
                      playClickSound();
                      onNavigateHome();
                    }}
                    variant="solid-lime"
                    size="md"
                    radius={12}
                    className="text-xs font-bold"
                  >
                    {lang === 'es' ? 'VOLVER AL INICIO' : 'RETURN TO HOME'}
                  </SpecularButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono font-bold text-gray-300 block tracking-wider uppercase">
                      NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'es' ? 'Tu Nombre Completo' : 'Your Full Name'}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs md:text-sm placeholder-gray-500 focus:outline-none focus:border-[#76FF03] focus:ring-1 focus:ring-[#76FF03] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-mono font-bold text-gray-300 block tracking-wider uppercase">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu.correo@empresa.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs md:text-sm placeholder-gray-500 focus:outline-none focus:border-[#76FF03] focus:ring-1 focus:ring-[#76FF03] transition-all"
                    />
                  </div>
                </div>

                {/* Service of Interest Dropdown */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold text-gray-300 block tracking-wider uppercase">
                    {lang === 'es' ? 'Servicio de Interés' : 'Service of Interest'}
                  </label>
                  <div className="relative">
                    <select
                      value={formService}
                      onChange={(e) => setFormService(e.target.value)}
                      className="w-full px-4 py-3.5 bg-[#0A140A] border border-white/15 rounded-xl text-white text-xs md:text-sm focus:outline-none focus:border-[#76FF03] focus:ring-1 focus:ring-[#76FF03] transition-all cursor-pointer appearance-none pr-10 font-medium"
                    >
                      <option value="3D Modeling & Visualization">3D Modeling & Visualization</option>
                      <option value="Brand Identity & Design System">Brand Identity & Design System</option>
                      <option value="Motion Graphics & Video Sequence">Motion Graphics & Video Sequence</option>
                      <option value="Real-time 3D WebGL Assets">Real-time 3D WebGL Assets</option>
                      <option value="Digital Art & Key Visuals">Digital Art & Key Visuals</option>
                      <option value="Full Creative Direction & Consultation">Full Creative Direction & Consultation</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Project Message */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold text-gray-300 block tracking-wider uppercase">
                    PROJECT MESSAGE *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={
                      lang === 'es'
                        ? 'Cuéntame sobre los objetivos de tu proyecto, plazos y entregables...'
                        : 'Tell me about your project goals, timelines and deliverables...'
                    }
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs md:text-sm placeholder-gray-500 focus:outline-none focus:border-[#76FF03] focus:ring-1 focus:ring-[#76FF03] transition-all resize-y min-h-[120px]"
                  />
                </div>

                {/* Submit Button */}
                <SpecularButton
                  type="submit"
                  disabled={isSubmitting}
                  variant="solid-lime"
                  size="lg"
                  radius={14}
                  className="w-full font-black text-sm md:text-base tracking-wider shadow-[0_0_25px_rgba(118,255,3,0.35)] hover:shadow-[0_0_35px_rgba(118,255,3,0.6)]"
                >
                  <Send className="w-4 h-4 text-[#050B05]" />
                  <span>{isSubmitting ? (lang === 'es' ? 'ENVIANDO...' : 'SENDING...') : (lang === 'es' ? 'ENVIAR MENSAJE' : 'SEND MESSAGE')}</span>
                </SpecularButton>
              </form>
            )}
          </div>

          {/* Direct Contact Bar below Form */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="w-4 h-4 text-[#76FF03]" />
              <span>Floresaylin2@gmail.com</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="ml-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-[#76FF03]/20 hover:text-[#76FF03] text-[10px] text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? <Check className="w-3 h-3 text-[#76FF03]" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? 'COPIADO' : 'COPIAR'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-3.5 h-3.5 text-[#76FF03]" />
              <span>El Salvador (UTC-6): <strong className="text-white font-mono">{currentTime || '02:30:00 PM'}</strong></span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
