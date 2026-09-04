import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  FolderKanban,
  Search,
  X,
  Sparkles,
  Check,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { Discipline, Project } from '../../types';
import {
  saveDiscipline,
  toggleDisciplineSlideVisibility,
  addDisciplineSlide,
  deleteDisciplineSlide,
  reorderDisciplineSlide,
  updateDisciplineSlide,
  uploadMediaFile,
  getProjectsForDiscipline,
  toggleProjectInDiscipline,
  saveProject,
} from '../../utils/portfolioStorage';
import { playClickSound } from '../../utils/audio';

interface DisciplineSliderEditorProps {
  disciplines: Discipline[];
  projects?: Project[];
  darkMode?: boolean;
}

export const DisciplineSliderEditor: React.FC<DisciplineSliderEditorProps> = ({
  disciplines,
  projects = [],
  darkMode = true,
}) => {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>(
    disciplines[0]?.id || 'modelado-3d'
  );
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'slides' | 'texts' | 'projects'>('slides');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Project Picker Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState<string>('ALL');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const selectedDiscipline =
    disciplines.find((d) => d.id === selectedDisciplineId) || disciplines[0];

  const assignedProjects = getProjectsForDiscipline(selectedDiscipline.id, projects, disciplines);

  const isProjectAssigned = (proj: Project): boolean => {
    if (proj.disciplineId && proj.disciplineId === selectedDiscipline.id) return true;
    if (selectedDiscipline.projectIds && selectedDiscipline.projectIds.includes(proj.id)) return true;
    if (!proj.disciplineId) {
      if (selectedDiscipline.id === 'modelado-3d' && proj.category === '3D MODELING') return true;
      if (selectedDiscipline.id === 'branding' && proj.category === 'BRANDING') return true;
      if (selectedDiscipline.id === 'edicion-video' && (proj.category === 'MOTION' || proj.category === 'DIGITAL ART')) return true;
      if (selectedDiscipline.id === 'social-media' && (proj.category === 'BRANDING' || proj.category === 'DIGITAL ART')) return true;
    }
    return false;
  };

  const handleToggleProjectAssignment = async (proj: Project) => {
    playClickSound();
    const currentAssigned = isProjectAssigned(proj);
    const newDisciplineId = currentAssigned ? '' : selectedDiscipline.id;
    await saveProject({
      ...proj,
      disciplineId: newDisciplineId,
    });
    await toggleProjectInDiscipline(selectedDiscipline.id, proj.id);
    showNotification(
      currentAssigned
        ? `"${proj.title}" desasignado de ${selectedDiscipline.titleEs}.`
        : `"${proj.title}" asignado a ${selectedDiscipline.titleEs} con éxito.`
    );
  };

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleToggleSlide = (slideId: string) => {
    playClickSound();
    toggleDisciplineSlideVisibility(selectedDiscipline.id, slideId);
  };

  const handleDeleteSlide = (slideId: string) => {
    playClickSound();
    deleteDisciplineSlide(selectedDiscipline.id, slideId);
  };

  const handleMoveSlide = (slideId: string, direction: 'up' | 'down') => {
    playClickSound();
    reorderDisciplineSlide(selectedDiscipline.id, slideId, direction);
  };

  const handleSlideTitleChange = (slideId: string, title: string) => {
    updateDisciplineSlide(selectedDiscipline.id, slideId, { title });
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
      showNotification('¡Diapositiva añadida al slider con éxito!');
    }
  };

  const handleAddFromProject = (imageUrl: string, suggestedTitle: string) => {
    playClickSound();
    addDisciplineSlide(selectedDiscipline.id, imageUrl, suggestedTitle);
    showNotification(`¡Añadida "${suggestedTitle}" al slider de ${selectedDiscipline.titleEs}!`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const result = await uploadMediaFile(file);
    setIsUploading(false);

    if (result.success && result.url) {
      addDisciplineSlide(
        selectedDiscipline.id,
        result.url,
        file.name.replace(/\.[^/.]+$/, '')
      );
      showNotification('¡Imagen subida a Hostinger y añadida al slider!');
    } else {
      setUploadError(result.error || 'Error al subir la imagen.');
    }
  };

  const handleTextUpdate = (field: keyof Discipline, value: any) => {
    const updated = { ...selectedDiscipline, [field]: value };
    saveDiscipline(updated);
  };

  // Filter projects for modal picker
  const filteredProjects = projects.filter((p) => {
    const matchCat = pickerCategory === 'ALL' || p.category === pickerCategory;
    const matchSearch =
      !pickerSearch.trim() ||
      p.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      p.client.toLowerCase().includes(pickerSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const bgCard = darkMode
    ? 'bg-[#1E293B] border-slate-700/50 text-slate-100 shadow-sm'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const bgInput = darkMode
    ? 'bg-[#0F172A] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl animate-fade-in border border-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span>{notificationMsg}</span>
        </div>
      )}

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

            {/* Sub-tabs: Slides vs Texts vs Projects */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('slides')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'slides'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🖼️ Slider ({selectedDiscipline.slides?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('texts')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'texts'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✏️ Textos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📂 Trabajos Asignados ({assignedProjects.length})
              </button>
            </div>
          </div>

          {/* Upload error banner */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
              ⚠️ {uploadError}
            </div>
          )}

          {/* Tab 1: Slides Manager */}
          {activeTab === 'slides' && (
            <div className="space-y-8">
              {/* Quick Actions Row */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 rounded-xl border border-slate-700/60 bg-slate-900/40">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Añadir Diapositivas al Slider</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Puedes elegir directamente de los proyectos ya subidos (con sus renders 1..6) o subir un archivo nuevo.
                  </p>
                </div>

                {/* Primary Button: Choose from uploaded projects */}
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setIsPickerOpen(true);
                  }}
                  className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
                >
                  <FolderKanban className="w-4 h-4" />
                  <span>Elegir de Proyectos Ya Subidos ({projects.length})</span>
                </button>
              </div>

              {/* Add manual slide row (URL or direct upload) */}
              <div className="p-5 rounded-xl border border-slate-700/60 bg-slate-900/30 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  O ingresar URL / Subir imagen manualmente:
                </span>

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
                    placeholder="URL de la imagen (/images/... o /uploads/...)"
                    className={`flex-1 w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap border border-slate-700">
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{isUploading ? 'Subiendo...' : 'Subir Imagen'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors cursor-pointer"
                    >
                      Añadir
                    </button>
                  </div>
                </form>
              </div>

              {/* Slides Grid with Reordering & Inline Renaming */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Diapositivas en el Slider ({selectedDiscipline.slides?.length || 0}):
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Usa las flechas [↑] [↓] para cambiar el orden de las diapositivas
                  </span>
                </div>

                {(!selectedDiscipline.slides || selectedDiscipline.slides.length === 0) ? (
                  <div className="p-10 text-center rounded-xl border border-slate-800 bg-slate-900/30 text-slate-500 text-xs font-mono">
                    No hay diapositivas en este slider. Haz clic en "Elegir de Proyectos Ya Subidos" para añadir renders.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {selectedDiscipline.slides.map((slide, idx) => (
                      <div
                        key={slide.id}
                        className={`relative rounded-xl overflow-hidden border transition-all p-3.5 flex flex-col justify-between ${
                          slide.visible
                            ? 'border-emerald-500/50 bg-slate-800/40 shadow-sm'
                            : 'border-slate-700/50 bg-slate-900/60 opacity-60'
                        }`}
                      >
                        {/* Top: Image Preview & Order Badge */}
                        <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-900 mb-3 border border-slate-700/60 group">
                          <img
                            src={slide.image}
                            alt={slide.title || 'Slide'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 backdrop-blur-md text-[11px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                            #{idx + 1}
                          </div>
                        </div>

                        {/* Title Input & Controls */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-mono text-slate-400 block mb-1">
                              Título del Slide:
                            </label>
                            <input
                              type="text"
                              defaultValue={slide.title || ''}
                              onBlur={(e) => handleSlideTitleChange(slide.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSlideTitleChange(slide.id, e.currentTarget.value);
                                  e.currentTarget.blur();
                                }
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-lg border ${bgInput} text-xs font-semibold outline-none`}
                              placeholder={`Slide #${idx + 1}`}
                            />
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                            {/* Reorder Arrows */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveSlide(slide.id, 'up')}
                                disabled={idx === 0}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white cursor-pointer transition-colors"
                                title="Mover diapositiva hacia arriba"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveSlide(slide.id, 'down')}
                                disabled={idx === selectedDiscipline.slides.length - 1}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white cursor-pointer transition-colors"
                                title="Mover diapositiva hacia abajo"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Visibility & Delete */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleSlide(slide.id)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                                  slide.visible
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                                title={slide.visible ? 'Ocultar diapositiva' : 'Mostrar diapositiva'}
                              >
                                {slide.visible ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Visible</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Oculto</span>
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
                      </div>
                    ))}
                  </div>
                )}
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

          {/* Tab 3: Assigned Projects Manager */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-700/60 bg-slate-900/40">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <FolderKanban className="w-4 h-4" />
                    <span>Trabajos Asignados a {selectedDiscipline.titleEs}</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Los trabajos seleccionados aparecerán en la página exclusiva de esta sección al hacer clic en la portada.
                  </p>
                </div>

                <a
                  href={`#disciplina/${selectedDiscipline.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-bold text-xs transition-all border border-slate-700 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver Página Dedicada en Vivo</span>
                </a>
              </div>

              {/* Projects Grid for Assignment */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  Selecciona qué producciones pertenecen a esta sección ({assignedProjects.length} asignados de {projects.length}):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((proj) => {
                    const assigned = isProjectAssigned(proj);
                    return (
                      <div
                        key={proj.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                          assigned
                            ? 'border-emerald-500/60 bg-emerald-950/20 shadow-md'
                            : 'border-slate-800 bg-slate-900/40 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-16 h-12 object-cover rounded-lg bg-black border border-slate-700 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">
                              {proj.title}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                              {proj.category} • {proj.year}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate block">
                              {proj.client}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleProjectAssignment(proj)}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            assigned
                              ? 'bg-emerald-600 hover:bg-rose-600 text-white shadow-sm'
                              : 'bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-700'
                          }`}
                        >
                          {assigned ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Asignado a {selectedDiscipline.titleEs}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Asignar a esta sección</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: ELEGIR DE PROYECTOS YA SUBIDOS ================= */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0F172A] border border-slate-700 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Elegir Renders de Proyectos Ya Subidos
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Añadiendo a: <span className="text-emerald-400 font-bold">{selectedDiscipline.titleEs}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Filters & Search */}
            <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['ALL', '3D MODELING', 'BRANDING', 'DIGITAL ART', 'MOTION'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setPickerCategory(cat);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      pickerCategory === cat
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat === 'ALL' ? 'TODOS' : cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Buscar por proyecto o cliente..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Modal Body: Projects and their selectable images */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs font-mono">
                  No se encontraron proyectos que coincidan con la búsqueda.
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredProjects.map((proj) => {
                    const allImages = [
                      { url: proj.image, label: 'Portada Principal' },
                      ...(proj.galleryImages || []).map((img, i) => ({
                        url: img,
                        label: `Render Detalle #${i + 1}`,
                      })),
                    ];

                    return (
                      <div
                        key={proj.id}
                        className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors"
                      >
                        {/* Project Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                                {proj.category}
                              </span>
                              <h4 className="text-sm font-bold text-white tracking-wide">
                                {proj.title}
                              </h4>
                            </div>
                            <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                              Cliente: {proj.client || 'Personal'} • {proj.year} • {allImages.length} imágenes disponibles
                            </span>
                          </div>
                        </div>

                        {/* Images Grid for this Project */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {allImages.map((imgItem, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="group relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-2 flex flex-col justify-between hover:border-emerald-500 transition-all shadow-sm"
                            >
                              <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-900 mb-2">
                                <img
                                  src={imgItem.url}
                                  alt={imgItem.label}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-mono text-emerald-300 font-bold">
                                  {imgIdx === 0 ? '★ Cover' : `#${imgIdx}`}
                                </span>
                              </div>

                              <span className="text-[11px] font-semibold text-slate-300 truncate block mb-2">
                                {imgItem.label}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleAddFromProject(
                                    imgItem.url,
                                    `${proj.title} - ${imgItem.label}`
                                  )
                                }
                                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/30"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Añadir al Slider</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#1E293B]">
              <span className="text-xs text-slate-400 font-mono">
                {selectedDiscipline.slides?.length || 0} diapositivas en el slider actualmente
              </span>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar Selector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
