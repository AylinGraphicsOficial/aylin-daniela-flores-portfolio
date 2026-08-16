import React from 'react';
import { X, Printer, Mail, MapPin, Globe, Award, CheckCircle2, FileText } from 'lucide-react';
import { Language } from '../types';
import { experienceData, skillCategoriesData } from '../data/portfolioData';
import { playClickSound } from '../utils/audio';

interface CVViewerModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

export const CVViewerModal: React.FC<CVViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl glass-panel-heavy rounded-2xl border border-white/20 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Controls Bar */}
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-[#050B05]/90 z-20 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#76FF03]/20 border border-[#76FF03] flex items-center justify-center text-[#76FF03]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-white uppercase tracking-tight">
                Curriculum Vitae / Resume
              </h2>
              <span className="text-xs font-mono text-gray-400">
                Aylin Daniela Flores • Senior Graphic Designer & 3D Modeler
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold font-mono flex items-center space-x-1.5 border border-white/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#76FF03]" />
              <span>PRINT / PDF</span>
            </button>

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
        </div>

        {/* Printable CV Content */}
        <div className="overflow-y-auto p-6 md:p-10 space-y-8 bg-[#081008] text-gray-200">
          {/* Header Card */}
          <div className="border-b border-white/15 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase mb-1">
                AYLIN DANIELA FLORES
              </h1>
              <p className="text-sm font-bold text-[#76FF03] font-mono tracking-wide">
                SENIOR GRAPHIC DESIGNER & 3D MODELER (6+ YEARS)
              </p>
              <p className="text-xs text-gray-400 max-w-xl mt-2 leading-relaxed">
                Specializing in hard-surface 3D modeling, automotive visualization, corporate identity architecture, and digital kinetic experiences based in El Salvador.
              </p>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#76FF03]" />
                <span>San Salvador, El Salvador (UTC-6)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#76FF03]" />
                <span>aylin.flores.design@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-3.5 h-3.5 text-[#76FF03]" />
                <span>studio-kinetic.portfolio</span>
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div>
            <h3 className="text-xs font-bold text-[#76FF03] uppercase font-mono tracking-widest mb-4 flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>PROFESSIONAL EXPERIENCE</span>
            </h3>

            <div className="space-y-6">
              {experienceData.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#76FF03]/40 pl-4 space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-base font-bold text-white">
                      {exp.role} — <span className="text-gray-300 font-normal">{exp.company}</span>
                    </h4>
                    <span className="text-xs font-mono text-[#76FF03]">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 italic font-mono">
                    {exp.location}
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed pt-1">
                    {exp.description}
                  </p>
                  <ul className="space-y-1 pt-1 text-xs text-gray-300">
                    {exp.responsibilities.map((r, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-[#76FF03]">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Core Technical Arsenal */}
          <div>
            <h3 className="text-xs font-bold text-[#76FF03] uppercase font-mono tracking-widest mb-4 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>TECHNICAL PROFICIENCIES</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillCategoriesData.map((cat) => (
                <div key={cat.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h4 className="text-xs font-bold text-white font-mono">
                    {cat.name}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s) => (
                      <span
                        key={s.name}
                        className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-gray-300"
                      >
                        {s.name} ({s.level}%)
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/15">
            <div>
              <h4 className="text-xs font-bold text-[#76FF03] uppercase font-mono tracking-wider mb-2">
                EDUCATION & DEGREES
              </h4>
              <div className="text-xs text-gray-300 space-y-1">
                <p className="font-bold text-white">Bachelor of Graphic Design & Visual Communication</p>
                <p className="text-gray-400">Universidad Dr. José Matías Delgado • El Salvador</p>
                <p className="text-[11px] text-gray-500 font-mono">Graduated with High Honors (Cum Laude)</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#76FF03] uppercase font-mono tracking-wider mb-2">
                LANGUAGES & AVAILABILITY
              </h4>
              <div className="text-xs text-gray-300 space-y-1">
                <p><span className="text-white font-bold">Spanish:</span> Native Proficiency</p>
                <p><span className="text-white font-bold">English:</span> Professional Working Proficiency (C1)</p>
                <p className="text-[11px] text-[#76FF03] font-mono mt-1">Available for Remote Global Contracts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
