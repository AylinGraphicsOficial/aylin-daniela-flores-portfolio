import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';
import { Discipline } from '../../types';
import {
  saveDiscipline,
  toggleDisciplineSlideVisibility,
  addDisciplineSlide,
  deleteDisciplineSlide,
} from '../../utils/portfolioStorage';
import { playClickSound } from '../../utils/audio';

interface DisciplineSliderEditorProps {
  disciplines: Discipline[];
  darkMode?: boolean;
}

export const DisciplineSliderEditor: React.FC<DisciplineSliderEditorProps> = ({
  disciplines,
  darkMode = true,
}) => {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>(
    disciplines[0]?.id || 'modelado-3d'
  );
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'slides' | 'texts'>('slides');

  const selectedDiscipline =
    disciplines.find((d) => d.id === selectedDisciplineId) || disciplines[0];

  const handleToggleSlide = (slideId: string) => {
    playClickSound();
    toggleDisciplineSlideVisibility(selectedDiscipline.id, slideId);
  };

  const handleDeleteSlide = (slideId: string) => {
    playClickSound();
    deleteDisciplineSlide(selectedDiscipline.id, slideId);
  };

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSlideUrl.trim()) {
      playClickSound();
      addDisciplineSlide(
        selectedDiscipline.id,
        newSlideUrl.trim(),
        newSlideTitle.trim() || 'Nueva Diapositiva'
      );
      setNewSlideUrl('');
      setNewSlideTitle('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addDisciplineSlide(
          selectedDiscipline.id,
          reader.result as string,
          file.name
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextUpdate = (field: keyof Discipline, value: any) => {
    const updated = { ...selectedDiscipline, [field]: value };
    saveDiscipline(updated);
  };

  const bgCard = darkMode
    ? 'bg-[#1E293B] border-slate-700/50 text-slate-100 shadow-sm'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const bgInput = darkMode
    ? 'bg-[#0F172A] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-8">
      {/* Specialty Selector Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {disciplines.map((d) => {
          const isSelected = d.id === selectedDisciplineId;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                playClickSound();
                setSelectedDisciplineId(d.id);
              }}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                  : `${bgCard} hover:border-slate-500 font-semibold`
              }`}
            >
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-black/20 font-bold">
                {d.number}
              </span>
              <span className="text-xs tracking-wide uppercase">{d.titleEs}</span>
              <span className="text-[11px] opacity-80 font-mono">
                ({d.slides?.filter((s) => s.visible).length || 0}/{d.slides?.length || 0})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Specialty Editor Panel */}
      {selectedDiscipline && (
        <div className={`p-6 sm:p-8 rounded-2xl border ${bgCard} space-y-8`}>
          {/* Header of Active Specialty */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/50">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
                  {selectedDiscipline.number}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {selectedDiscipline.titleEs}
                </h3>
              </div>
              <p className={`text-xs ${textMuted} font-mono mt-1`}>
                Gestiona las diapositivas del slider y los textos visibles en la portada.
              </p>
            </div>

            {/* Sub-tabs: Slides vs Texts */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('slides')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'slides'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🖼️ Slider de Renders ({selectedDiscipline.slides?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('texts')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'texts'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✏️ Textos & Descripciones
              </button>
            </div>
          </div>

          {/* Tab 1: Slides Manager */}
          {activeTab === 'slides' && (
            <div className="space-y-8">
              {/* Add new slide row */}
              <div className="p-5 rounded-xl border border-slate-700/60 bg-slate-900/40 space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Añadir Nueva Diapositiva al Slider</span>
                </span>

                <form onSubmit={handleAddSlide} className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={newSlideTitle}
                    onChange={(e) => setNewSlideTitle(e.target.value)}
                    placeholder="Título de la diapositiva (ej. Vista Lateral)"
                    className={`w-full sm:w-1/3 px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs`}
                  />
                  <input
                    type="text"
                    value={newSlideUrl}
                    onChange={(e) => setNewSlideUrl(e.target.value)}
                    placeholder="URL de la imagen o ruta (/images/...)"
                    className={`flex-1 w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap border border-slate-700">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors cursor-pointer shadow-sm"
                    >
                      Añadir Slide
                    </button>
                  </div>
                </form>
              </div>

              {/* Slides Grid */}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider block mb-4">
                  Diapositivas en el Slider:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {(selectedDiscipline.slides || []).map((slide, idx) => (
                    <div
                      key={slide.id}
                      className={`relative rounded-xl overflow-hidden border transition-all p-3 flex flex-col justify-between ${
                        slide.visible
                          ? 'border-emerald-500/50 bg-slate-800/40 shadow-sm'
                          : 'border-slate-700/50 bg-slate-900/60 opacity-50'
                      }`}
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-900 mb-3 border border-slate-700/60">
                        <img
                          src={slide.image}
                          alt={slide.title || 'Slide'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] font-mono text-white font-bold">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Info & Controls */}
                      <div className="space-y-3">
                        <span className="text-xs font-semibold block truncate">
                          {slide.title || `Diapositiva ${idx + 1}`}
                        </span>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                          <button
                            type="button"
                            onClick={() => handleToggleSlide(slide.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                              slide.visible
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {slide.visible ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Oculto</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar Diapositiva"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Texts Manager */}
          {activeTab === 'texts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Título en Español
                  </label>
                  <input
                    type="text"
                    value={selectedDiscipline.titleEs || ''}
                    onChange={(e) => handleTextUpdate('titleEs', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-sm font-bold`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Título en Inglés
                  </label>
                  <input
                    type="text"
                    value={selectedDiscipline.titleEn || ''}
                    onChange={(e) => handleTextUpdate('titleEn', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-sm font-bold`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Subtítulo en Español
                  </label>
                  <input
                    type="text"
                    value={selectedDiscipline.subtitleEs || ''}
                    onChange={(e) => handleTextUpdate('subtitleEs', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Subtítulo en Inglés
                  </label>
                  <input
                    type="text"
                    value={selectedDiscipline.subtitleEn || ''}
                    onChange={(e) => handleTextUpdate('subtitleEn', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Etiqueta Vertical (Español)
                  </label>
                  <input
                    type="text"
                    value={selectedDiscipline.verticalTextEs || ''}
                    onChange={(e) => handleTextUpdate('verticalTextEs', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Etiqueta Vertical (Inglés)
                  </label>
                  <input
                    type="text"
                    value={selectedDiscipline.verticalTextEn || ''}
                    onChange={(e) => handleTextUpdate('verticalTextEn', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Descripción en Español
                </label>
                <textarea
                  rows={3}
                  value={selectedDiscipline.descEs || ''}
                  onChange={(e) => handleTextUpdate('descEs', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs leading-relaxed`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Descripción en Inglés
                </label>
                <textarea
                  rows={3}
                  value={selectedDiscipline.descEn || ''}
                  onChange={(e) => handleTextUpdate('descEn', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs leading-relaxed`}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
