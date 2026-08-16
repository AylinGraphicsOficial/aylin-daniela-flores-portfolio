import React, { useState } from 'react';
import { X, Sparkles, Check, Copy, Send, CheckCircle2, Box, Award, Video, Layers, PenTool } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { translations } from '../data/portfolioData';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface ProjectPlannerModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

export const ProjectPlannerModal: React.FC<ProjectPlannerModalProps> = ({
  isOpen,
  lang,
  onClose,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  const [selectedServices, setSelectedServices] = useState<string[]>(['3D Modeling & Visualization']);
  const [selectedTimeline, setSelectedTimeline] = useState<string>('Standard (3-4 Weeks)');
  const [selectedBudget, setSelectedBudget] = useState<string>('$3,000 - $6,000 USD');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableServices = [
    { id: '3d-modeling', label: '3D Modeling & Visualization', icon: Box },
    { id: 'branding', label: 'Brand Identity & Design System', icon: Award },
    { id: 'motion', label: 'Motion Graphics & Video Sequence', icon: Video },
    { id: 'webgl', label: 'Real-time 3D WebGL Assets', icon: Layers },
    { id: 'illustration', label: 'Digital Art & Key Visuals', icon: PenTool },
  ];

  const timelineOptions = [
    { label: 'Fast-Track (1-2 Weeks)', note: 'Priority expedited delivery' },
    { label: 'Standard (3-4 Weeks)', note: 'Recommended production cycle' },
    { label: 'Comprehensive (1-2 Months)', note: 'Multi-stage full overhaul' },
  ];

  const budgetOptions = [
    { label: '$1,500 - $3,000 USD', tier: 'Starter / Single Asset' },
    { label: '$3,000 - $6,000 USD', tier: 'Professional / Multi-Asset' },
    { label: '$6,000 - $12,000+ USD', tier: 'Full Corporate Overhaul' },
  ];

  const toggleService = (label: string) => {
    playClickSound();
    if (selectedServices.includes(label)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== label));
      }
    } else {
      setSelectedServices([...selectedServices, label]);
    }
  };

  const generateBriefText = () => {
    return `==============================
PROJECT INQUIRY BRIEF - STUDIO KINETIC
Client: ${clientName || 'Anonymous'}
Company: ${clientCompany || 'N/A'}
Email: ${clientEmail || 'Not specified'}
------------------------------
SERVICES REQUESTED:
${selectedServices.map(s => `• ${s}`).join('\n')}

ESTIMATED TIMELINE: ${selectedTimeline}
BUDGET RANGE: ${selectedBudget}

PROJECT SCOPE / GOALS:
${projectDescription || 'No description provided yet.'}
==============================`;
  };

  const handleCopyBrief = () => {
    playClickSound();
    navigator.clipboard.writeText(generateBriefText());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessSound();
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#0052FF', '#BDF4FF', '#FFFFFF']
      });
    } catch {
      // Ignored
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl glass-panel-heavy rounded-2xl border border-white/20 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-[#0A0F14]/90 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/20 border border-[#00E5FF] flex items-center justify-center text-[#00E5FF]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-white uppercase tracking-tight">
                {t.planner.title}
              </h2>
              <span className="text-xs font-mono text-gray-400">
                Interactive Project Estimator & Scope Builder
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 md:p-8 space-y-8">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#00E5FF]/20 border-2 border-[#00E5FF] mx-auto flex items-center justify-center text-[#00E5FF] shadow-[0_0_30px_#00E5FF]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase">
                Brief Generated Successfully!
              </h3>
              <p className="text-sm md:text-base text-gray-300 max-w-lg mx-auto">
                Thank you for detailing your project. Your inquiry has been formulated and ready for direct review.
              </p>

              {/* Formatted Code Block of Generated Brief */}
              <div className="max-w-xl mx-auto text-left glass-panel p-4 rounded-xl font-mono text-xs text-gray-300 whitespace-pre-wrap border border-white/10">
                {generateBriefText()}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCopyBrief}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center space-x-2 border border-white/20 transition-all"
                >
                  <Copy className="w-4 h-4 text-[#00E5FF]" />
                  <span>{isCopied ? 'COPIED TO CLIPBOARD!' : 'COPY BRIEF TEXT'}</span>
                </button>

                <a
                  href={`mailto:aylin.flores.design@gmail.com?subject=New%20Project%20Inquiry%20from%20${encodeURIComponent(clientName || 'Client')}&body=${encodeURIComponent(generateBriefText())}`}
                  className="px-6 py-3 bg-[#00E5FF] text-[#0A0F14] font-black text-xs rounded-xl flex items-center space-x-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>OPEN IN EMAIL CLIENT</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Services selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#00E5FF] uppercase font-mono tracking-wider block">
                  {t.planner.step1}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {availableServices.map((srv) => {
                    const Icon = srv.icon;
                    const isSelected = selectedServices.includes(srv.label);
                    return (
                      <button
                        type="button"
                        key={srv.id}
                        onClick={() => toggleService(srv.label)}
                        className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition-all ${
                          isSelected
                            ? 'bg-[#0052FF]/20 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#00E5FF] text-[#0A0F14]' : 'bg-white/10 text-gray-300'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold text-white block">
                            {srv.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Timeline selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#00E5FF] uppercase font-mono tracking-wider block">
                  {t.planner.step2}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {timelineOptions.map((opt) => {
                    const isSelected = selectedTimeline === opt.label;
                    return (
                      <button
                        type="button"
                        key={opt.label}
                        onClick={() => {
                          playClickSound();
                          setSelectedTimeline(opt.label);
                        }}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#0052FF]/20 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-bold text-white block mb-1">
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono block">
                          {opt.note}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Budget Range */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#00E5FF] uppercase font-mono tracking-wider block">
                  {t.planner.step3}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {budgetOptions.map((b) => {
                    const isSelected = selectedBudget === b.label;
                    return (
                      <button
                        type="button"
                        key={b.label}
                        onClick={() => {
                          playClickSound();
                          setSelectedBudget(b.label);
                        }}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#0052FF]/20 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        <span className="text-sm font-black text-white font-mono block mb-1">
                          {b.label}
                        </span>
                        <span className="text-[11px] text-gray-400 block">
                          {b.tier}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Contact & Message */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                <label className="text-xs font-bold text-[#00E5FF] uppercase font-mono tracking-wider block">
                  {t.planner.step4}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Your Email Address *"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Company or Brand Name (Optional)"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Project vision, specific deliverables (e.g. 3D car turntable, complete logo suite), reference links..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
                <span className="text-xs text-gray-400 font-mono">
                  Includes initial moodboard & creative milestone roadmap.
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#00E5FF] hover:bg-[#BDF4FF] text-[#0A0F14] font-black text-xs rounded-xl shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-102 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.planner.generateInquiry}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
