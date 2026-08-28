import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  Sparkles,
  Star,
  Plus,
  Trash2,
  HelpCircle,
  CheckCircle,
  Video,
  Loader2,
  Layers,
} from 'lucide-react';
import { Project } from '../../types';
import { playClickSound } from '../../utils/audio';
import { uploadMediaFile } from '../../utils/portfolioStorage';

interface ProjectEditModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
  darkMode?: boolean;
}

export const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  isOpen,
  project,
  onClose,
  onSave,
  darkMode = true,
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    id: '',
    title: '',
    category: '3D MODELING',
    year: '2026',
    client: '',
    shortDesc: '',
    fullDesc: '',
    image: '',
    galleryImages: [],
    videoUrl: '',
    videoClip: '',
    gifUrl: '',
    tags: [],
    featured: false,
    metrics: [{ label: 'Render Samples', value: '4,096 SPP' }],
  });

  const [tagInput, setTagInput] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingClip, setIsUploadingClip] = useState(false);
  const [isUploadingGif, setIsUploadingGif] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setUploadError(null);
    setNewGalleryUrl('');
    if (project) {
      setFormData({
        ...project,
        galleryImages: project.galleryImages || [],
        tags: project.tags || [],
        metrics: project.metrics || [{ label: 'Render Samples', value: '4,096 SPP' }],
      });
      setTagInput((project.tags || []).join(', '));
    } else {
      setFormData({
        id: `proj-${Date.now()}`,
        title: '',
        category: '3D MODELING',
        year: '2026',
        client: '',
        shortDesc: '',
        fullDesc: '',
        image: '/images/orbit-stand.webp',
        galleryImages: [],
        videoUrl: '',
        videoClip: '',
        gifUrl: '',
        tags: ['3D Modeling', 'Blender', 'Octane'],
        featured: true,
        metrics: [{ label: 'Render Samples', value: '4,096 SPP' }],
      });
      setTagInput('3D Modeling, Blender, Octane');
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  // Subir imagen Hero directamente a Hostinger
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadError(null);

    const result = await uploadMediaFile(file);
    setIsUploadingImage(false);

    if (result.success && result.url) {
      setFormData((prev) => ({ ...prev, image: result.url }));
    } else {
      setUploadError(result.error || 'Error al subir la imagen.');
    }
  };

  // Subir múltiples imágenes para la galería "Vistas de Detalle & Renders"
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadMediaFile(file);
      if (res.success && res.url) {
        uploadedUrls.push(res.url);
      }
    }

    setIsUploadingGallery(false);

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...uploadedUrls],
      }));
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index),
    }));
  };

  // Subir clip de video MP4/WebM
  const handleVideoClipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingClip(true);
    setUploadError(null);

    const result = await uploadMediaFile(file);
    setIsUploadingClip(false);

    if (result.success && result.url) {
      setFormData((prev) => ({ ...prev, videoClip: result.url }));
    } else {
      setUploadError(result.error || 'Error al subir el clip de video.');
    }
  };

  // Subir GIF animado
  const handleGifUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingGif(true);
    setUploadError(null);

    const result = await uploadMediaFile(file);
    setIsUploadingGif(false);

    if (result.success && result.url) {
      setFormData((prev) => ({ ...prev, gifUrl: result.url }));
    } else {
      setUploadError(result.error || 'Error al subir el GIF animado.');
    }
  };

  const handleAddMetric = () => {
    setFormData((prev) => ({
      ...prev,
      metrics: [...(prev.metrics || []), { label: 'Métrica', value: '100%' }],
    }));
  };

  const handleMetricChange = (
    index: number,
    field: 'label' | 'value',
    val: string
  ) => {
    setFormData((prev) => {
      const updated = [...(prev.metrics || [])];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, metrics: updated };
    });
  };

  const handleMetricRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metrics: (prev.metrics || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const finalProject: Project = {
      id: formData.id || `proj-${Date.now()}`,
      title: formData.title || 'Nuevo Proyecto',
      category: (formData.category as any) || '3D MODELING',
      year: formData.year || '2026',
      client: formData.client || 'Cliente',
      shortDesc: formData.shortDesc || '',
      fullDesc: formData.fullDesc || '',
      image: formData.image || '/images/orbit-stand.webp',
      galleryImages: formData.galleryImages || [],
      videoUrl: formData.videoUrl || '',
      videoClip: formData.videoClip || '',
      gifUrl: formData.gifUrl || '',
      tags: tagsArray.length > 0 ? tagsArray : ['Design', '3D'],
      featured: formData.featured || false,
      metrics: formData.metrics || [],
      updatedAt: new Date().toISOString(),
    };

    playClickSound();
    onSave(finalProject);
    onClose();
  };

  const bgModal = darkMode ? 'bg-[#1E293B] text-slate-100 border-slate-700/60' : 'bg-white text-slate-900 border-slate-200';
  const bgInput = darkMode ? 'bg-[#0F172A] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto ${bgModal} border rounded-2xl p-6 sm:p-8 shadow-2xl my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-700/50">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase block mb-1">
              EDITOR DE PROYECTO (HOSTINGER SYNC)
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {project ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload error banner if any */}
        {uploadError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️ {uploadError}</span>
          </div>
        )}

        {/* Suggestion Banner */}
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-emerald-300 block">
              💡 Formatos & Galería de Detalle:
            </span>
            <p className={textMuted}>
              • <strong>Vistas de Detalle:</strong> Las imágenes agregadas abajo aparecerán en la sección <em>"VISTAS DE DETALLE & RENDER"</em> del estudio de caso.
              <br />• <strong>Soporte Completo:</strong> Sube imágenes WebP/PNG, clips MP4/WebM y GIFs directamente al servidor.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Título del Proyecto *
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej. Retro Mini Classic 3D Render"
                className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-sm font-semibold`}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Categoría *
              </label>
              <select
                value={formData.category || '3D MODELING'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-sm font-bold`}
              >
                <option value="3D MODELING">3D MODELING</option>
                <option value="BRANDING">BRANDING</option>
                <option value="DIGITAL ART">DIGITAL ART</option>
                <option value="MOTION">MOTION / VIDEO</option>
              </select>
            </div>
          </div>

          {/* Row 2: Client, Year & Featured Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Cliente / Estudio *
              </label>
              <input
                type="text"
                required
                value={formData.client || ''}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Ej. Apex Auto Studio"
                className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-sm`}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Año de Realización
              </label>
              <input
                type="text"
                value={formData.year || '2026'}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2026"
                className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-sm font-mono`}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Proyecto Destacado (Portada)
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  formData.featured
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Star className={`w-4 h-4 ${formData.featured ? 'fill-emerald-400' : ''}`} />
                <span>{formData.featured ? '⭐ Destacado en Portada' : 'Normal'}</span>
              </button>
            </div>
          </div>

          {/* Row 3: Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Descripción Corta
              </label>
              <textarea
                rows={3}
                value={formData.shortDesc || ''}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                placeholder="Resumen conciso para tarjetas del catálogo..."
                className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs leading-relaxed`}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Descripción Completa (Caso de Estudio)
              </label>
              <textarea
                rows={3}
                value={formData.fullDesc || ''}
                onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                placeholder="Detalles técnicos, proceso de modelado, iluminación y render..."
                className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs leading-relaxed`}
              />
            </div>
          </div>

          {/* Row 4: Hero Image & Upload */}
          <div className="p-4 rounded-xl border border-slate-700/60 bg-slate-900/40 space-y-4">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Imagen Principal / Render Hero *</span>
              </span>
              {isUploadingImage && (
                <span className="text-emerald-400 text-xs flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subiendo a Hostinger...</span>
                </span>
              )}
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-500" />
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Ruta (/uploads/... o /images/...) o URL https://..."
                  className={`w-full px-3 py-2 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
                />
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white transition-colors cursor-pointer text-xs font-semibold border border-emerald-500/40">
                  {isUploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{isUploadingImage ? 'Subiendo...' : 'Subir Imagen Principal a Hostinger'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Row 4.5: VISTAS DE DETALLE & RENDER (Sub-Galería de Proyecto) */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-slate-900/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Vistas de Detalle & Renders (Sub-Galería del Proyecto) ({(formData.galleryImages || []).length})</span>
              </label>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                {isUploadingGallery ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{isUploadingGallery ? 'Subiendo Renders...' : '+ Subir Renders de Detalle a Hostinger'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isUploadingGallery}
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Add by URL input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="O añade URL directa de imagen (/uploads/... o https://...)"
                className={`flex-1 px-3 py-2 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap border border-slate-700"
              >
                Añadir URL
              </button>
            </div>

            {/* List of Detail Images with Thumbnails */}
            {(formData.galleryImages || []).length === 0 ? (
              <p className="text-[11px] text-slate-500 font-mono italic">
                No hay vistas de detalle añadidas todavía. Sube renders adicionales arriba para que aparezcan en "Vistas de Detalle & Render".
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {(formData.galleryImages || []).map((imgUrl, gIdx) => (
                  <div
                    key={gIdx}
                    className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 group flex flex-col justify-between"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-black/40 flex items-center justify-center">
                      <img src={imgUrl} alt={`Detalle ${gIdx + 1}`} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="p-2 bg-slate-900/90 flex items-center justify-between border-t border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[100px]">
                        #{gIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(gIdx)}
                        className="p-1 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer transition-colors"
                        title="Eliminar render de detalle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 5: Videos & GIFs with Direct Hostinger Uploaders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* YouTube/Vimeo Link */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enlace Video (YouTube/Vimeo)</span>
              </label>
              <input
                type="text"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://youtube.com/..."
                className={`w-full px-3 py-2 rounded-xl border ${bgInput} outline-none text-xs`}
              />
            </div>

            {/* Video Clip MP4/WebM */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Clip (MP4/WebM)</span>
                </label>
                {isUploadingClip && <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />}
              </div>
              <input
                type="text"
                value={formData.videoClip || ''}
                onChange={(e) => setFormData({ ...formData, videoClip: e.target.value })}
                placeholder="/uploads/clip.mp4 o URL"
                className={`w-full px-3 py-2 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
              />
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] border border-slate-700">
                <Upload className="w-3 h-3" />
                <span>{isUploadingClip ? 'Subiendo Clip...' : 'Subir MP4/WebM'}</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  disabled={isUploadingClip}
                  onChange={handleVideoClipUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Animated GIF */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GIF Animado</span>
                </label>
                {isUploadingGif && <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />}
              </div>
              <input
                type="text"
                value={formData.gifUrl || ''}
                onChange={(e) => setFormData({ ...formData, gifUrl: e.target.value })}
                placeholder="/uploads/anim.gif o URL"
                className={`w-full px-3 py-2 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
              />
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] border border-slate-700">
                <Upload className="w-3 h-3" />
                <span>{isUploadingGif ? 'Subiendo GIF...' : 'Subir GIF'}</span>
                <input
                  type="file"
                  accept="image/gif"
                  disabled={isUploadingGif}
                  onChange={handleGifUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Row 6: Tags */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Etiquetas & Herramientas (Separadas por coma)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="3D Modeling, Blender, Octane, Substance 3D"
              className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
            />
          </div>

          {/* Row 7: Metrics Editor */}
          <div className="p-4 rounded-xl border border-slate-700/60 bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">
                Métricas Técnicas ({formData.metrics?.length || 0})
              </label>
              <button
                type="button"
                onClick={handleAddMetric}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Métrica</span>
              </button>
            </div>

            <div className="space-y-2">
              {(formData.metrics || []).map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={m.label}
                    onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                    placeholder="Etiqueta (ej. Polygon Count)"
                    className={`flex-1 px-3 py-1.5 rounded-lg border ${bgInput} text-xs`}
                  />
                  <input
                    type="text"
                    value={m.value}
                    onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                    placeholder="Valor (ej. 280K Tris)"
                    className={`w-36 px-3 py-1.5 rounded-lg border ${bgInput} text-xs font-mono font-bold text-emerald-400`}
                  />
                  <button
                    type="button"
                    onClick={() => handleMetricRemove(idx)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold uppercase transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{project ? 'Guardar Cambios' : 'Crear Proyecto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
