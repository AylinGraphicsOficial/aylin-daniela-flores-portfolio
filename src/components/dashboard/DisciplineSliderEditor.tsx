import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Sparkles,
  Sliders,
  Film,
} from 'lucide-react';
import { Discipline, DisciplineSlide } from '../../types';
import {
  saveDiscipline,
  toggleDisciplineSlideVisibility,
  addDisciplineSlide,
  deleteDisciplineSlide,
} from '../../utils/portfolioStorage';
import { playClickSound } from '../../utils/audio';
import { SpecularButton } from '../SpecularButton';

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
    ? 'bg-[#081208] border-white/10 text-white'
    : 'bg-white border-gray-200 text-gray-900';
  const bgInput = darkMode
    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#76FF03]'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

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
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#76FF03] text-[#050B05] border-[#76FF03] font-black shadow-[0_0_20px_rgba(118,255,3,0.3)]'
                  : `${bgCard} hover:border-[#76FF03]/40 font-bold`
              }`}
            >
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-black/15">
                {d.number}
              </span>
              <span className="text-xs tracking-wider uppercase">{d.titleEs}</span>
              <span className="text-[11px] opacity-75 font-mono">
                ({d.slides?.filter((s) => s.visible).length || 0}/{d.slides?.length || 0})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Specialty Editor Panel */}
      {selectedDiscipline && (
        <div className={`p-6 sm:p-8 rounded-3xl border ${bgCard} shadow-xl space-y-8`}>
          {/* Header of Active Specialty */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black italic text-[#76FF03]">
                  {selectedDiscipline.number}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">
                  {selectedDiscipline.titleEs}
                </h3>
              </div>
              <p className={`text-xs ${textMuted} font-mono mt-1`}>
                Gestiona las diapositivas del slider y los textos visibles en la portada.
              </p>
            </div>

            {/* Sub-tabs: Slides vs Texts */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/20 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('slides')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'slides'
                    ? 'bg-[#76FF03] text-black font-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🖼️ Slider de Renders ({selectedDiscipline.slides?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('texts')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'texts'
                    ? 'bg-[#76FF03] text-black font-black'
                    : 'text-gray-400 hover:text-white'
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
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#76FF03] flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Añadir Nueva Diapositiva al Slider</span>
                  </span>
                </div>

                <form onSubmit={handleAddSlide} className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={newSlideTitle}
                    onChange={(e) => setNewSlideTitle(e.target.value)}
                    placeholder="Título de la diapositiva (ej. Vista Frontal)"
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
                    <label className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-[#76FF03] hover:text-black transition-colors cursor-pointer text-xs font-bold font-mono flex items-center gap-1.5 whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <SpecularButton
                      type="submit"
                      variant="solid-lime"
                      size="sm"
                      radius={10}
                      className="text-xs font-bold tracking-wider px-4 py-2.5 uppercase whitespace-nowrap"
                    >
                      Añadir Slide
                    </SpecularButton>
                  </div>
                </form>
              </div>

              {/* Slides Grid */}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider block mb-4">
                  Diapositivas Actuales en el Slider:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {(selectedDiscipline.slides || []).map((slide, idx) => (
                    <div
                      key={slide.id}
                      className={`relative rounded-2xl overflow-hidden border transition-all p-3 flex flex-col justify-between ${
                        slide.visible
                          ? 'border-[#76FF03]/60 bg-white/5 shadow-lg'
                          : 'border-white/10 bg-black/40 opacity-60'
                      }`}
                    >
                      {/* Slide Image Preview */}
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/50 mb-3 border border-white/10">
                        <img
                          src={slide.image}
                          alt={slide.title || 'Slide'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white font-bold">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Slide Info & Controls */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold tracking-wide block truncate">
                          {slide.title || `Diapositiva ${idx + 1}`}
                        </span>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => handleToggleSlide(slide.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                              slide.visible
                                ? 'bg-[#76FF03]/20 text-[#76FF03]'
                                : 'bg-white/10 text-gray-400'
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
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
                  <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5">
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
                  <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5">
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
                  <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5">
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
                  <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5">
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
                  <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5">
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
                  <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5">
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
                <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5">
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
                <label className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5">
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
