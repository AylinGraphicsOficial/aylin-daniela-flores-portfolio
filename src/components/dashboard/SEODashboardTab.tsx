import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  Share2,
  Tag,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
  Smartphone,
  Monitor,
  ExternalLink,
  Code,
  ShieldCheck,
  RefreshCw,
  Plus,
  X,
  FileCode,
} from 'lucide-react';
import { SEOData } from '../../types';
import { getStoredSEO, saveStoredSEO, initialSEOData } from '../../utils/portfolioStorage';
import { playClickSound } from '../../utils/audio';

// Palabras clave recomendadas de alto impacto para diseñadores y 3D en El Salvador
const RECOMMENDED_KEYWORDS = [
  'Aylin Daniela Flores',
  'Diseñadora Gráfica El Salvador',
  'Modelado 3D El Salvador',
  'Branding Sonsonate',
  'Blender 3D Artist',
  'Visualización Arquitectónica 3D',
  'Diseño de Identidad Visual',
  'Animación 3D Publicitaria',
  'Flyers para Redes Sociales',
  'Render de Productos 3D',
  'Diseño Publicitario Centroamérica',
  'Freelance 3D Artist El Salvador',
];

export const SEODashboardTab: React.FC = () => {
  const [seo, setSeo] = useState<SEOData>(getStoredSEO);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [serpDevice, setSerpDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    setSeo(getStoredSEO());
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    playClickSound();
    setIsSaving(true);
    try {
      await saveStoredSEO(seo);
      setFeedback({ text: 'Configuración SEO guardada y sincronizada en Hostinger MySQL', type: 'success' });
    } catch {
      setFeedback({ text: 'Error al persistir la configuración SEO en MySQL', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const currentKeywordsList = seo.keywords
    ? seo.keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  const addKeyword = (kw: string) => {
    const clean = kw.trim();
    if (!clean) return;
    if (currentKeywordsList.some((k) => k.toLowerCase() === clean.toLowerCase())) return;
    const updated = [...currentKeywordsList, clean].join(', ');
    setSeo({ ...seo, keywords: updated });
    setNewKeyword('');
  };

  const removeKeyword = (kwToRemove: string) => {
    const updated = currentKeywordsList
      .filter((k) => k.toLowerCase() !== kwToRemove.toLowerCase())
      .join(', ');
    setSeo({ ...seo, keywords: updated });
  };

  const titleLength = seo.metaTitle?.length || 0;
  const descLength = seo.metaDescription?.length || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76FF03]/10 border border-[#76FF03]/30 text-[#76FF03] text-xs font-semibold uppercase tracking-wider mb-2">
            <Search className="w-3.5 h-3.5" />
            Optimización para Buscadores Web (Google / Bing / RRSS)
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans uppercase">
            SEO &amp; Posicionamiento en Motores de Búsqueda
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Controla cómo visualizan Google, Bing y las redes sociales tu portafolio web. Optimiza títulos, palabras clave, descripciones y microformatos para maximizar las consultas de clientes.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#76FF03] hover:bg-[#86ff20] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#76FF03]/20 transition-all self-start md:self-center"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin text-black" />
          ) : (
            <Save className="w-4 h-4 text-black" />
          )}
          <span>{isSaving ? 'Guardando...' : 'Guardar Configuración SEO'}</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm border ${
            feedback.type === 'success'
              ? 'bg-[#76FF03]/10 border-[#76FF03]/30 text-[#76FF03]'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Previsualización en Google Search (SERP Preview) */}
      <div className="p-6 rounded-2xl bg-[#091209]/80 border border-white/10 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#76FF03]" />
            <h3 className="text-base font-bold text-white uppercase font-sans">
              Google Search SERP Preview (Vista en Buscadores)
            </h3>
          </div>

          <div className="inline-flex items-center rounded-lg bg-black/40 border border-white/10 p-0.5 text-xs">
            <button
              onClick={() => setSerpDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                serpDevice === 'desktop'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Escritorio</span>
            </button>
            <button
              onClick={() => setSerpDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                serpDevice === 'mobile'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Móvil</span>
            </button>
          </div>
        </div>

        {/* Tarjeta SERP Google */}
        <div
          className={`p-4 md:p-5 rounded-xl border border-white/10 bg-[#171717] font-sans text-left transition-all ${
            serpDevice === 'mobile' ? 'max-w-md mx-auto' : 'w-full'
          }`}
        >
          {/* Favicon + Sitio Web */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-[#050B05] border border-white/10 flex items-center justify-center p-0.5 flex-shrink-0">
              <img src="/favicon-32x32.png" alt="Favicon" className="w-4 h-4 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-300 font-medium truncate">Aylin Daniela Flores | Portafolio</p>
              <p className="text-[11px] text-gray-400 truncate">
                {seo.canonicalUrl || 'https://aylinflores.com'}
              </p>
            </div>
          </div>

          {/* Título Google */}
          <h4 className="text-lg md:text-xl text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-snug line-clamp-2">
            {seo.metaTitle || 'Aylin Daniela Flores | Diseñadora Gráfica & Modeladora 3D'}
          </h4>

          {/* Descripción Google Snippet */}
          <p className="text-xs md:text-sm text-[#bdc1c6] mt-1.5 leading-relaxed line-clamp-3">
            {seo.metaDescription ||
              'Portafolio profesional de Aylin Daniela Flores en El Salvador. Especialista en branding, modelado 3D, visualización arquitectónica, animación y diseño publicitario.'}
          </p>

          {/* Rich Snippets / Datos Estructurados */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5 text-[11px] text-[#9aa0a6]">
            <span className="font-semibold text-[#76FF03]">★ Diseñadora Gráfica &amp; 3D</span>
            <span>•</span>
            <span>Sonsonate, El Salvador</span>
            <span>•</span>
            <span>Branding &amp; Blender</span>
          </div>
        </div>
      </div>

      {/* Editor Principal de Metadatos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario SEO */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#091209]/80 border border-white/10 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Tag className="w-5 h-5 text-[#76FF03]" />
            <h3 className="text-base font-bold text-white uppercase font-sans">
              Metadatos Globales de Búsqueda
            </h3>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-semibold text-gray-200 uppercase tracking-wider">
                  Título SEO del Sitio (Meta Title)
                </label>
                <span
                  className={`font-mono text-[11px] ${
                    titleLength >= 50 && titleLength <= 60
                      ? 'text-[#76FF03]'
                      : titleLength > 65
                      ? 'text-amber-400'
                      : 'text-gray-400'
                  }`}
                >
                  {titleLength}/60 caracteres (Recomendado: 50-60)
                </span>
              </div>
              <input
                type="text"
                value={seo.metaTitle}
                onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#76FF03] focus:ring-1 focus:ring-[#76FF03] text-white text-sm transition-all"
                placeholder="Ej. Aylin Daniela Flores | Diseñadora Gráfica & Modeladora 3D"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-semibold text-gray-200 uppercase tracking-wider">
                  Descripción para Buscadores (Meta Description)
                </label>
                <span
                  className={`font-mono text-[11px] ${
                    descLength >= 140 && descLength <= 160
                      ? 'text-[#76FF03]'
                      : descLength > 165
                      ? 'text-amber-400'
                      : 'text-gray-400'
                  }`}
                >
                  {descLength}/160 caracteres (Recomendado: 140-160)
                </span>
              </div>
              <textarea
                rows={3}
                value={seo.metaDescription}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#76FF03] focus:ring-1 focus:ring-[#76FF03] text-white text-sm transition-all resize-none"
                placeholder="Escribe una descripción cautivadora que resuma tus especialidades y motive a hacer clic..."
              />
            </div>

            {/* URL Canónica & Autor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1.5">
                  URL Canónica Principal
                </label>
                <input
                  type="url"
                  value={seo.canonicalUrl}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-[#76FF03] text-white text-sm"
                  placeholder="https://aylinflores.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1.5">
                  Autor / Creador
                </label>
                <input
                  type="text"
                  value={seo.author}
                  onChange={(e) => setSeo({ ...seo, author: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-[#76FF03] text-white text-sm"
                  placeholder="Aylin Daniela Flores"
                />
              </div>
            </div>

            {/* Directiva de Indexación Robots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1.5">
                  Directiva para Rastreadores (Robots)
                </label>
                <select
                  value={seo.robots}
                  onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-[#76FF03] text-white text-sm"
                >
                  <option value="index, follow">index, follow (Recomendado: Indexar y seguir enlaces)</option>
                  <option value="noindex, follow">noindex, follow (No indexar en Google, seguir enlaces)</option>
                  <option value="noindex, nofollow">noindex, nofollow (Ocultar completamente de buscadores)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1.5">
                  Imagen OpenGraph para Redes (URL)
                </label>
                <input
                  type="text"
                  value={seo.ogImage}
                  onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-[#76FF03] text-white text-sm"
                  placeholder="/logo.webp"
                />
              </div>
            </div>

            {/* Analítica Opcional Externa */}
            <div className="pt-2 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-[#76FF03] uppercase tracking-wider">
                Integraciones Externas Opcionales
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Google Analytics ID (ej. G-XXXXXXXXXX)
                  </label>
                  <input
                    type="text"
                    value={seo.googleAnalyticsId || ''}
                    onChange={(e) => setSeo({ ...seo, googleAnalyticsId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-[#76FF03] text-white text-xs font-mono"
                    placeholder="G-..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Google Search Console Token
                  </label>
                  <input
                    type="text"
                    value={seo.googleSiteVerification || ''}
                    onChange={(e) => setSeo({ ...seo, googleSiteVerification: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-[#76FF03] text-white text-xs font-mono"
                    placeholder="google-site-verification=..."
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Gestor y Optimizador de Palabras Clave */}
        <div className="space-y-6">
          {/* Palabras Clave Activas */}
          <div className="p-6 rounded-2xl bg-[#091209]/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#76FF03]" />
                <h3 className="text-base font-bold text-white uppercase font-sans">
                  Palabras Clave Activas
                </h3>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {currentKeywordsList.length} tags
              </span>
            </div>

            {/* Input para agregar keyword manual */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword(newKeyword);
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 focus:border-[#76FF03] text-white text-xs"
                placeholder="Nueva palabra clave..."
              />
              <button
                type="button"
                onClick={() => addKeyword(newKeyword)}
                className="px-3 py-1.5 rounded-lg bg-[#76FF03] hover:bg-[#86ff20] text-black font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>

            {/* Chips de Keywords Activas */}
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {currentKeywordsList.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#76FF03]/10 border border-[#76FF03]/30 text-[#76FF03] text-xs"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Sugerencias de Alto Impacto */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                Sugerencias de Búsqueda Recomendadas:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {RECOMMENDED_KEYWORDS.filter(
                  (rec) => !currentKeywordsList.some((k) => k.toLowerCase() === rec.toLowerCase())
                ).map((rec) => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => addKeyword(rec)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[11px] transition-all"
                  >
                    <Plus className="w-3 h-3 text-[#76FF03]" />
                    <span>{rec}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Checklist de Salud Técnica SEO */}
          <div className="p-6 rounded-2xl bg-[#091209]/80 border border-white/10 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#76FF03]" />
              <h3 className="text-base font-bold text-white uppercase font-sans">
                Salud Técnica de Motores
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#76FF03]" />
                  <span className="text-gray-200">robots.txt</span>
                </div>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#76FF03] hover:underline flex items-center gap-1 text-[11px]"
                >
                  Ver archivo <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#76FF03]" />
                  <span className="text-gray-200">sitemap.xml (Mapa del Sitio)</span>
                </div>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#76FF03] hover:underline flex items-center gap-1 text-[11px]"
                >
                  Ver mapa <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#76FF03]" />
                  <span className="text-gray-200">Schema.org JSON-LD (Rich Snippets)</span>
                </div>
                <span className="text-[#76FF03] font-bold text-[11px]">Activo</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#76FF03]" />
                  <span className="text-gray-200">Local SEO: Sonsonate, El Salvador</span>
                </div>
                <span className="text-[#76FF03] font-bold text-[11px]">Configurado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
