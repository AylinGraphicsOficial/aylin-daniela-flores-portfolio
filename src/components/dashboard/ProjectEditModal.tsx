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
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  ZoomIn,
  ExternalLink,
  Link as LinkIcon,
  Play,
} from 'lucide-react';
import { Project } from '../../types';
import { playClickSound } from '../../utils/audio';
import { uploadMediaFile } from '../../utils/portfolioStorage';
import { ProjectImageZoomModal } from '../ProjectImageZoomModal';
import { detectMedia } from '../../utils/mediaDetector';

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
    disciplineId: 'modelado-3d',
    externalLink: '',
    externalLinkText: 'VER MÁS DEL TRABAJO',
    year: '2026',
    client: '',
    shortDesc: '',
    fullDesc: '',
    image: '',
    galleryImages: [],
    logo: '',
    videoUrl: '',
    videoClip: '',
    gifUrl: '',
    tags: [],
    featured: false,
    metrics: [{ label: 'Render Samples', value: '4,096 SPP' }],
  });

  const MAX_GALLERY_IMAGES = 6;
  const [tagInput, setTagInput] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingClip, setIsUploadingClip] = useState(false);
  const [isUploadingGif, setIsUploadingGif] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingSliderImage, setIsUploadingSliderImage] = useState(false);
  const [galleryUploadStatus, setGalleryUploadStatus] = useState<string | null>(null);
  const [zoomPreviewOpen, setZoomPreviewOpen] = useState<boolean>(false);
  const [zoomPreviewIndex, setZoomPreviewIndex] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setUploadError(null);
    setNewGalleryUrl('');
    if (project) {
      setFormData({
        ...project,
        visibleInCatalog: project.visibleInCatalog !== false,
        sliderImage: project.sliderImage || '',
        sliderTitle: project.sliderTitle || '',
        sliderOrder: project.sliderOrder ?? 1,
        galleryImages: project.galleryImages || [],
        logo: project.logo || '',
        externalLink: project.externalLink || '',
        externalLinkText: project.externalLinkText || 'VER MÁS DEL TRABAJO',
        disciplineId: project.disciplineId || (
          project.category === '3D MODELING' ? 'modelado-3d' :
          project.category === 'BRANDING' ? 'branding' :
          project.category === 'MOTION' ? 'edicion-video' : 'social-media'
        ),
        tags: project.tags || [],
        metrics: project.metrics || [{ label: 'Render Samples', value: '4,096 SPP' }],
      });
      setTagInput((project.tags || []).join(', '));
    } else {
      setFormData({
        id: `proj-${Date.now()}`,
        title: '',
        category: '3D MODELING',
        disciplineId: 'modelado-3d',
        externalLink: '',
        externalLinkText: 'VER MÁS DEL TRABAJO',
        year: '2026',
        client: '',
        shortDesc: '',
        fullDesc: '',
        image: '/images/orbit-stand.webp',
        galleryImages: [],
        logo: '',
        videoUrl: '',
        videoClip: '',
        gifUrl: '',
        tags: ['3D Modeling', 'Blender', 'Octane'],
        featured: false,
        visibleInCatalog: true,
        sliderImage: '',
        sliderTitle: '',
        sliderOrder: 1,
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

  // Subir logotipo representativo a Hostinger
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setUploadError(null);

    const result = await uploadMediaFile(file);
    setIsUploadingLogo(false);

    if (result.success && result.url) {
      setFormData((prev) => ({ ...prev, logo: result.url }));
    } else {
      setUploadError(result.error || 'Error al subir el logotipo.');
    }
  };

  // Subir múltiples imágenes para la galería "Vistas de Detalle & Renders" (Límite 6)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentCount = (formData.galleryImages || []).length;
    const availableSlots = Math.max(0, MAX_GALLERY_IMAGES - currentCount);

    if (availableSlots <= 0) {
      setUploadError('Límite máximo de 6 renders de detalle alcanzado para este proyecto. Elimina una imagen para poder subir otra.');
      e.target.value = '';
      return;
    }

    const filesArray: File[] = Array.from(files) as File[];
    const filesToUpload: File[] = filesArray.slice(0, availableSlots);

    if (filesArray.length > availableSlots) {
      setUploadError(`Solo se subirán las primeras ${availableSlots} imagen(es) para respetar el límite de 6 imágenes del proyecto.`);
    } else {
      setUploadError(null);
    }

    setIsUploadingGallery(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      setGalleryUploadStatus(`Subiendo render ${i + 1} de ${filesToUpload.length} a Hostinger...`);
      const res = await uploadMediaFile(file);
      if (res.success && res.url) {
        uploadedUrls.push(res.url);
      } else {
        setUploadError(res.error || `Error al subir el render #${i + 1}`);
      }
    }

    setIsUploadingGallery(false);
    setGalleryUploadStatus(null);
    e.target.value = '';

    if (uploadedUrls.length > 0) {
      setFormData((prev) => {
        const combined = [...(prev.galleryImages || []), ...uploadedUrls];
        return {
          ...prev,
          galleryImages: combined.slice(0, MAX_GALLERY_IMAGES),
        };
      });
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const currentCount = (formData.galleryImages || []).length;
    if (currentCount >= MAX_GALLERY_IMAGES) {
      setUploadError('Límite de 6 imágenes alcanzado. No se pueden agregar más renders a este proyecto.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), newGalleryUrl.trim()].slice(0, MAX_GALLERY_IMAGES),
    }));
    setNewGalleryUrl('');
    setUploadError(null);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index),
    }));
    setUploadError(null);
  };

  const handleMoveGalleryImage = (index: number, direction: 'left' | 'right') => {
    const list = [...(formData.galleryImages || [])];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setFormData((prev) => ({
      ...prev,
      galleryImages: list,
    }));
  };

  const handleOpenZoomPreview = (index: number) => {
    setZoomPreviewIndex(index);
    setZoomPreviewOpen(true);
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

  // Subir imagen para Hero Slider (16:9)
  const handleSliderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSliderImage(true);
    setUploadError(null);

    const result = await uploadMediaFile(file);
    setIsUploadingSliderImage(false);

    if (result.success && result.url) {
      setFormData((prev) => ({ ...prev, sliderImage: result.url }));
    } else {
      setUploadError(result.error || 'Error al subir la imagen para el slider.');
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
      disciplineId: formData.disciplineId || (
        formData.category === '3D MODELING' ? 'modelado-3d' :
        formData.category === 'BRANDING' ? 'branding' :
        formData.category === 'MOTION' ? 'edicion-video' : 'social-media'
      ),
      externalLink: formData.externalLink || '',
      externalLinkText: formData.externalLinkText || 'VER MÁS DEL TRABAJO',
      year: formData.year || '2026',
      client: formData.client || 'Cliente',
      shortDesc: formData.shortDesc || '',
      fullDesc: formData.fullDesc || '',
      image: formData.image || '/images/orbit-stand.webp',
      galleryImages: (formData.galleryImages || []).slice(0, MAX_GALLERY_IMAGES),
      logo: formData.logo || '',
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
          {/* Row 1: Title, Category & Discipline/Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
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
                Categoría Principal *
              </label>
              <select
                value={formData.category || '3D MODELING'}
                onChange={(e) => {
                  const cat = e.target.value as any;
                  const defaultDisc = cat === '3D MODELING' ? 'modelado-3d' : cat === 'BRANDING' ? 'branding' : cat === 'MOTION' ? 'edicion-video' : 'social-media';
                  setFormData({ ...formData, category: cat, disciplineId: formData.disciplineId || defaultDisc });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-sm font-bold`}
              >
                <option value="3D MODELING">3D MODELING</option>
                <option value="BRANDING">BRANDING</option>
                <option value="DIGITAL ART">DIGITAL ART</option>
                <option value="MOTION">MOTION / VIDEO</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Sección / Especialidad *
              </label>
              <select
                value={formData.disciplineId || 'modelado-3d'}
                onChange={(e) => setFormData({ ...formData, disciplineId: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-sm font-bold text-emerald-400`}
              >
                <option value="modelado-3d">01 • MODELADO 3D</option>
                <option value="branding">02 • BRANDING</option>
                <option value="edicion-video">03 • EDICIÓN DE VIDEO</option>
                <option value="social-media">04 • SOCIAL MEDIA DESIGNER</option>
              </select>
            </div>
          </div>

          {/* Row: Configuración del Botón "Ver Más del Trabajo" (Enlace Externo) */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wide">
                <ExternalLink className="w-4 h-4" />
                <span>Botón "Ver Más del Trabajo" (Enlace en Vista de Detalle)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Ubicado debajo de "Cotizar Proyecto Similar"
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Enlace Externo (URL donde está alojado el proyecto)
                </label>
                <input
                  type="text"
                  value={formData.externalLink || ''}
                  onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                  placeholder="https://www.behance.net/... o ArtStation, Drive, Demo Web"
                  className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Texto Personalizado del Botón
                </label>
                <input
                  type="text"
                  value={formData.externalLinkText || ''}
                  onChange={(e) => setFormData({ ...formData, externalLinkText: e.target.value })}
                  placeholder="VER MÁS DEL TRABAJO (Por defecto)"
                  className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} outline-none text-xs font-bold`}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Client, Year, Catalog Visibility & Discipline Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                ¿Mostrar en Catálogo de Trabajos?
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    visibleInCatalog: formData.visibleInCatalog === false ? true : false,
                  })
                }
                className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  formData.visibleInCatalog !== false
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-rose-500/20 border-rose-500 text-rose-300'
                }`}
              >
                {formData.visibleInCatalog !== false ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Visible en Catálogo</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Oculto del Catálogo</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Especialidad / Sección
              </label>
              <select
                value={formData.disciplineId || ''}
                onChange={(e) => setFormData({ ...formData, disciplineId: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl border ${bgInput} outline-none text-xs font-semibold`}
              >
                <option value="">Automática (por categoría)</option>
                <option value="modelado-3d">01 MODELADO 3D</option>
                <option value="branding">02 BRANDING</option>
                <option value="edicion-video">03 EDICIÓN DE VIDEO</option>
                <option value="social-media">04 SOCIAL MEDIA</option>
              </select>
            </div>
          </div>

          {/* Configuración Slider Principal (Hero Carousel) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/35 border border-slate-700/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/50">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span>Slider Principal (Hero de la Portada)</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Define si este proyecto rota en el slider superior de la página principal.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto ${
                  formData.featured
                    ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-sm'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${formData.featured ? 'fill-yellow-400' : ''}`} />
                <span>{formData.featured ? '⭐ Activo en Slider Hero' : 'Inactivo en Slider'}</span>
              </button>
            </div>

            {formData.featured && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
                <div className="sm:col-span-3">
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Orden de Rotación (1, 2, 3...)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={formData.sliderOrder ?? 1}
                    onChange={(e) =>
                      setFormData({ ...formData, sliderOrder: parseInt(e.target.value, 10) || 1 })
                    }
                    className={`w-full px-3 py-2 rounded-xl border ${bgInput} outline-none text-xs font-mono font-bold`}
                  />
                </div>

                <div className="sm:col-span-9">
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Título Corto para el Slider (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.sliderTitle || ''}
                    onChange={(e) => setFormData({ ...formData, sliderTitle: e.target.value })}
                    placeholder={formData.title || 'Título por defecto'}
                    className={`w-full px-4 py-2 rounded-xl border ${bgInput} outline-none text-xs`}
                  />
                </div>

                {/* Slider Custom Banner 16:9 */}
                <div className="sm:col-span-12 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-slate-300 block">
                      Banner Panorámico 16:9 para el Slider (Opcional - Si se deja vacío usa la imagen principal)
                    </label>
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer transition-colors">
                      {isUploadingSliderImage ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      <span>{isUploadingSliderImage ? 'Subiendo...' : 'Subir Banner 16:9 a Hostinger'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingSliderImage}
                        onChange={handleSliderImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.sliderImage || ''}
                    onChange={(e) => setFormData({ ...formData, sliderImage: e.target.value })}
                    placeholder="URL del banner 16:9 (/images/... o /uploads/...)"
                    className={`w-full px-4 py-2 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
                  />
                  {formData.sliderImage && (
                    <div className="relative aspect-[21/9] sm:aspect-[16/6] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-700/60 mt-2">
                      <img
                        src={formData.sliderImage}
                        alt="Slider Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-yellow-300 font-bold">
                        Banner Slider Activo
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Row: Logo o Imagen Representativa (A la par del Título) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/25 border border-slate-700/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/50">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                  Logotipo o Imagen Representativa (A la par del Título)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Aparece junto al título principal en la página del proyecto y en el estudio de caso (PNG transparente, SVG o WebP recomendado).
                </span>
              </div>

              <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm self-start sm:self-auto">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingLogo ? 'Subiendo...' : 'Subir Logotipo a Hostinger'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  disabled={isUploadingLogo}
                  onChange={handleLogoFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Input URL direct */}
              <div className="sm:col-span-8">
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Ruta o URL del Logotipo
                </label>
                <input
                  type="text"
                  value={formData.logo || ''}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="Ej. /images/brands/los-rebusca.svg o URL /uploads/..."
                  className={`w-full px-4 py-2 rounded-xl border ${bgInput} outline-none text-xs font-mono`}
                />
              </div>

              {/* Preview Thumbnail Box */}
              <div className="sm:col-span-4 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-black/50 border border-slate-700 flex items-center justify-center p-2 flex-shrink-0 relative overflow-hidden">
                  {formData.logo ? (
                    <img
                      src={formData.logo}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono text-center leading-tight">
                      Sin logo
                    </span>
                  )}
                </div>

                {formData.logo && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logo: '' })}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Quitar logotipo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Quitar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Mini Preview Header */}
            {formData.title && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Vista Previa Título:</span>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-base sm:text-lg font-black uppercase italic tracking-tight text-white">
                    {formData.title}
                  </span>
                  {formData.logo && (
                    <div className="p-1.5 px-2.5 rounded-lg bg-white/5 border border-white/15">
                      <img
                        src={formData.logo}
                        alt="Mini logo"
                        className="h-6 w-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
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
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/retro-mini.jpg';
                    }}
                  />
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

          {/* Row 4.5: VISTAS DE DETALLE & RENDER (Sub-Galería de Proyecto - Límite 6) */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-slate-900/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Vistas de Detalle & Renders (Sub-Galería del Proyecto)</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      (formData.galleryImages || []).length >= MAX_GALLERY_IMAGES
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {(formData.galleryImages || []).length} / {MAX_GALLERY_IMAGES} renders
                  </span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {(formData.galleryImages || []).length >= MAX_GALLERY_IMAGES
                    ? 'Límite de 6 renders alcanzado. Elimina uno si deseas reemplazarlo.'
                    : `Disponibles: ${MAX_GALLERY_IMAGES - (formData.galleryImages || []).length} slot(s) para visualización con zoom en el portafolio.`}
                </p>
              </div>

              {/* Upload Button: + Subir Renders de Detalle a Hostinger (Límite 6) */}
              {(formData.galleryImages || []).length >= MAX_GALLERY_IMAGES ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-700 shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Límite Alcanzado (6/6 Renders)</span>
                </div>
              ) : (
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition-all shadow-md hover:shadow-emerald-600/30">
                  {isUploadingGallery ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isUploadingGallery
                      ? galleryUploadStatus || 'Subiendo Renders...'
                      : `+ Subir Renders de Detalle a Hostinger (${(formData.galleryImages || []).length}/6)`}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={isUploadingGallery}
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Add by URL input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                disabled={(formData.galleryImages || []).length >= MAX_GALLERY_IMAGES}
                placeholder={
                  (formData.galleryImages || []).length >= MAX_GALLERY_IMAGES
                    ? 'Límite de 6 imágenes alcanzado. Elimina una para añadir nueva URL.'
                    : 'O añade URL directa de imagen (/uploads/... o https://...)'
                }
                className={`flex-1 px-3 py-2 rounded-xl border ${bgInput} outline-none text-xs font-mono disabled:opacity-50`}
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                disabled={(formData.galleryImages || []).length >= MAX_GALLERY_IMAGES || !newGalleryUrl.trim()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap border border-slate-700 transition-colors"
              >
                Añadir URL
              </button>
            </div>

            {/* 6-Slots Visual Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
              {/* Existing Uploaded Images */}
              {(formData.galleryImages || []).map((imgUrl, gIdx) => (
                <div
                  key={gIdx}
                  className="relative rounded-xl overflow-hidden bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 group flex flex-col justify-between transition-all shadow-md"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/60 flex items-center justify-center relative">
                    <img
                      src={imgUrl}
                      alt={`Detalle ${gIdx + 1}`}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/retro-mini.jpg';
                      }}
                    />

                    {/* Hover Zoom preview trigger */}
                    <button
                      type="button"
                      onClick={() => handleOpenZoomPreview(gIdx)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#76FF03] font-mono text-[10px] font-bold transition-opacity cursor-pointer gap-1"
                      title="Previsualizar con zoom"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Zoom</span>
                    </button>
                  </div>

                  <div className="p-1.5 bg-slate-900 flex items-center justify-between border-t border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      #{gIdx + 1}/6
                    </span>

                    <div className="flex items-center space-x-1">
                      {/* Move left */}
                      {gIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveGalleryImage(gIdx, 'left')}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Mover a la izquierda"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      )}

                      {/* Move right */}
                      {gIdx < (formData.galleryImages || []).length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveGalleryImage(gIdx, 'right')}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Mover a la derecha"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(gIdx)}
                        className="p-1 text-rose-400 hover:bg-rose-500/20 rounded cursor-pointer transition-colors"
                        title="Eliminar render de detalle"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty Available Slots (up to MAX_GALLERY_IMAGES = 6) */}
              {Array.from({ length: MAX_GALLERY_IMAGES - (formData.galleryImages || []).length }).map((_, emptyIdx) => {
                const slotNumber = (formData.galleryImages || []).length + emptyIdx + 1;
                return (
                  <label
                    key={`empty-${slotNumber}`}
                    className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-700/80 hover:border-emerald-500/60 bg-slate-950/40 hover:bg-emerald-950/20 flex flex-col items-center justify-center p-2 text-center cursor-pointer group transition-all"
                    title={`Slot #${slotNumber} disponible - Clic para subir render`}
                  >
                    <Plus className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:scale-110 transition-all mb-1" />
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-300 font-medium">
                      Slot #{slotNumber}
                    </span>
                    <span className="text-[8px] font-mono text-slate-600 group-hover:text-slate-400">
                      Disponible
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingGallery}
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Row 5: Videos & GIFs with Direct Hostinger Uploaders & Live Previews */}
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
                placeholder="https://youtube.com/... o /shorts/..."
                className={`w-full px-3 py-2 rounded-xl border ${bgInput} outline-none text-xs`}
              />

              {/* YouTube / Vimeo Live Interactive Preview */}
              {(() => {
                if (!formData.videoUrl?.trim()) return null;
                const detected = detectMedia(formData.videoUrl);
                if (detected.isValid && (detected.type === 'youtube' || detected.type === 'vimeo')) {
                  return (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                        <span className="flex items-center gap-1 font-bold">
                          <Play className="w-3 h-3 fill-emerald-400" />
                          Preview {detected.type.toUpperCase()}
                        </span>
                        {detected.videoId && (
                          <span className="text-[10px] text-slate-400 font-mono">ID: {detected.videoId}</span>
                        )}
                      </div>
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-emerald-500/40 bg-black shadow-lg">
                        <iframe
                          src={detected.embedUrl}
                          title="Preview Video"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  );
                }
                if (detected.isValid && detected.type === 'video') {
                  return (
                    <div className="mt-2 space-y-1">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                        Preview Video URL:
                      </span>
                      <video
                        src={detected.originalUrl}
                        controls
                        className="w-full rounded-xl max-h-44 bg-black border border-emerald-500/40 object-contain"
                      />
                    </div>
                  );
                }
                return (
                  <p className="text-[10px] text-amber-400/80 font-mono mt-1">
                    ⚠ Formato no reconocido. Pega un enlace de YouTube, YouTube Shorts o Vimeo.
                  </p>
                );
              })()}
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

              {/* Clip Video Preview */}
              {formData.videoClip?.trim() && (
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                    Preview Clip:
                  </span>
                  <video
                    src={formData.videoClip}
                    controls
                    className="w-full rounded-xl max-h-44 bg-black border border-emerald-500/40 object-contain"
                  />
                </div>
              )}
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

              {/* GIF Preview */}
              {formData.gifUrl?.trim() && (
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                    Preview GIF:
                  </span>
                  <div className="w-full rounded-xl overflow-hidden border border-emerald-500/40 bg-black flex justify-center p-1.5">
                    <img
                      src={formData.gifUrl}
                      alt="GIF Preview"
                      className="max-h-44 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
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

      {/* Zoom Modal for Admin preview */}
      {zoomPreviewOpen && (formData.galleryImages || []).length > 0 && (
        <ProjectImageZoomModal
          isOpen={zoomPreviewOpen}
          images={formData.galleryImages || []}
          initialIndex={zoomPreviewIndex}
          projectTitle={formData.title || 'Proyecto'}
          lang="es"
          onClose={() => setZoomPreviewOpen(false)}
        />
      )}
    </div>
  );
};
