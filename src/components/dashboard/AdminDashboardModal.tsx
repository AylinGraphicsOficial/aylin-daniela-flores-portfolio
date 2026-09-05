import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Layers,
  FolderKanban,
  Star,
  Image as ImageIcon,
  Database,
  Search,
  Sun,
  Moon,
  LogOut,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Box,
  Palette,
  Film,
  Share2,
} from 'lucide-react';
import { Project, Discipline } from '../../types';
import {
  getStoredProjects,
  getStoredDisciplines,
  saveProject,
  deleteProject,
  toggleProjectFeatured,
  subscribeToPortfolioChanges,
  exportPortfolioJSON,
  importPortfolioJSON,
  resetPortfolioToDefaults,
} from '../../utils/portfolioStorage';
import { playClickSound, play8BitArcadeSound } from '../../utils/audio';
import { SpecularButton } from '../SpecularButton';
import { ProjectEditModal } from './ProjectEditModal';
import { DisciplineSliderEditor } from './DisciplineSliderEditor';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'disciplines' | 'projects' | 'featured' | 'media' | 'backup'
  >('overview');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // JSON backup state
  const [jsonInput, setJsonInput] = useState('');
  const [backupSuccessMsg, setBackupSuccessMsg] = useState<string | null>(null);

  // Sync projects and disciplines
  useEffect(() => {
    const loadData = () => {
      setProjects(getStoredProjects());
      setDisciplines(getStoredDisciplines());
    };
    loadData();
    const unsubscribe = subscribeToPortfolioChanges(loadData);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleCreateNewProject = () => {
    playClickSound();
    setEditingProject(null);
    setIsEditModalOpen(true);
  };

  const handleEditProject = (proj: Project) => {
    playClickSound();
    setEditingProject(proj);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el proyecto "${title}"?`)) {
      playClickSound();
      deleteProject(id);
    }
  };

  const handleToggleFeatured = (id: string) => {
    playClickSound();
    toggleProjectFeatured(id);
  };

  const handleExportJSON = () => {
    playClickSound();
    const dataStr = exportPortfolioJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aylin-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setBackupSuccessMsg('¡Copia de seguridad exportada con éxito en tu computadora!');
  };

  const handleImportJSON = () => {
    playClickSound();
    if (!jsonInput.trim()) return;
    const success = importPortfolioJSON(jsonInput);
    if (success) {
      play8BitArcadeSound();
      setBackupSuccessMsg('¡Datos importados y aplicados exitosamente!');
      setJsonInput('');
    } else {
      alert('Error: el formato JSON proporcionado no es válido.');
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        '¿Deseas restaurar todos los proyectos y sliders a los valores predeterminados de fábrica?'
      )
    ) {
      playClickSound();
      resetPortfolioToDefaults();
      setBackupSuccessMsg('¡Base de datos restablecida a los valores de fábrica!');
    }
  };

  // Filtered projects list
  const filteredProjects = projects.filter((p) => {
    const matchesCat =
      categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredProjects = projects.filter((p) => p.featured);
  const totalSlides = disciplines.reduce(
    (acc, d) => acc + (d.slides?.length || 0),
    0
  );

  // Theme Variables
  const bgMain = darkMode ? 'bg-[#050B05] text-white' : 'bg-[#F0F4F2] text-gray-900';
  const bgSidebar = darkMode ? 'bg-[#081408] border-white/10' : 'bg-[#00965E] border-transparent text-white';
  const bgCard = darkMode ? 'bg-[#0B1A0B] border-white/10 text-white' : 'bg-white border-gray-100 text-gray-900 shadow-sm';
  const bgTopBar = darkMode ? 'bg-[#081408]/90 border-white/10' : 'bg-white/90 border-gray-200 shadow-sm';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div
        className={`relative w-full max-w-[1550px] h-[95vh] rounded-3xl overflow-hidden border flex flex-col md:flex-row shadow-2xl ${bgMain} ${
          darkMode ? 'border-white/15' : 'border-gray-300'
        }`}
      >
        {/* ==================== LEFT SIDEBAR ==================== */}
        <aside
          className={`w-full md:w-64 lg:w-72 flex-shrink-0 flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r ${bgSidebar}`}
        >
          {/* Top Brand Logo */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#76FF03] flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(118,255,3,0.5)]">
                A
              </div>
              <div>
                <span className="font-black text-lg tracking-tight uppercase block leading-none">
                  AYLIN STUDIO
                </span>
                <span className="text-[10px] font-mono opacity-80 uppercase tracking-wider">
                  Admin Dashboard
                </span>
              </div>
            </div>

            {/* Navigation Menu (Curved active pill like Mediline screenshot) */}
            <nav className="space-y-1.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('overview');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? darkMode
                      ? 'bg-[#76FF03] text-black font-black shadow-[0_0_15px_rgba(118,255,3,0.3)]'
                      : 'bg-white text-[#007A4D] font-black shadow-md'
                    : 'opacity-80 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Resumen General</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('disciplines');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'disciplines'
                    ? darkMode
                      ? 'bg-[#76FF03] text-black font-black shadow-[0_0_15px_rgba(118,255,3,0.3)]'
                      : 'bg-white text-[#007A4D] font-black shadow-md'
                    : 'opacity-80 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Especialidades & Sliders</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('projects');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'projects'
                    ? darkMode
                      ? 'bg-[#76FF03] text-black font-black shadow-[0_0_15px_rgba(118,255,3,0.3)]'
                      : 'bg-white text-[#007A4D] font-black shadow-md'
                    : 'opacity-80 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span>Gestor de Proyectos</span>
                <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20">
                  {projects.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('featured');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'featured'
                    ? darkMode
                      ? 'bg-[#76FF03] text-black font-black shadow-[0_0_15px_rgba(118,255,3,0.3)]'
                      : 'bg-white text-[#007A4D] font-black shadow-md'
                    : 'opacity-80 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Proyectos Destacados</span>
                <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20">
                  {featuredProjects.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('media');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'media'
                    ? darkMode
                      ? 'bg-[#76FF03] text-black font-black shadow-[0_0_15px_rgba(118,255,3,0.3)]'
                      : 'bg-white text-[#007A4D] font-black shadow-md'
                    : 'opacity-80 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Medios & Renders</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('backup');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'backup'
                    ? darkMode
                      ? 'bg-[#76FF03] text-black font-black shadow-[0_0_15px_rgba(118,255,3,0.3)]'
                      : 'bg-white text-[#007A4D] font-black shadow-md'
                    : 'opacity-80 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Respaldo & Backup JSON</span>
              </button>
            </nav>
          </div>

          {/* Bottom Profile & Exit */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-black/15">
              <div className="w-9 h-9 rounded-full bg-[#76FF03]/20 border border-[#76FF03]/40 flex items-center justify-center text-[#76FF03] font-black">
                AF
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold block truncate">Aylin Flores</span>
                <span className="text-[10px] opacity-75 block font-mono truncate">
                  Master Designer
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar Header */}
          <header
            className={`px-6 py-4 flex items-center justify-between border-b backdrop-blur-md ${bgTopBar}`}
          >
            {/* Search Input */}
            <div className="relative w-72 sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar proyectos, clientes, tags..."
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none transition-all ${
                  darkMode
                    ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#76FF03]'
                    : 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Right Tools: Dark/Light Mode + Close Window */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle (Dark vs Light) */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setDarkMode(!darkMode);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  darkMode
                    ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:text-black'
                }`}
                title="Cambiar Modo Claro / Oscuro"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                <span className="hidden sm:inline">
                  {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                </span>
              </button>

              {/* View Website */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#76FF03]" />
                <span>Ver Portafolio</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                title="Cerrar Dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Scrollable Dashboard Body */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
            {/* ================= TAB 1: RESUMEN GENERAL (MEDILINE LAYOUT) ================= */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Row 1: Top Metrics Cards with Green Circle Icons (Like Mediline Screenshot) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {/* Card 1: Total Projects */}
                  <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Proyectos</span>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FolderKanban className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black">{projects.length}</span>
                      <span className="text-[10px] text-emerald-400 block font-mono mt-0.5">En catálogo</span>
                    </div>
                  </div>

                  {/* Card 2: Featured */}
                  <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Destacados</span>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Star className="w-4 h-4 fill-emerald-400" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black">{featuredProjects.length}</span>
                      <span className="text-[10px] text-emerald-400 block font-mono mt-0.5">En portada</span>
                    </div>
                  </div>

                  {/* Card 3: Disciplines */}
                  <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Especialidades</span>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black">{disciplines.length}</span>
                      <span className="text-[10px] text-emerald-400 block font-mono mt-0.5">Pilares clave</span>
                    </div>
                  </div>

                  {/* Card 4: Slides */}
                  <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Slides Renders</span>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black">{totalSlides}</span>
                      <span className="text-[10px] text-emerald-400 block font-mono mt-0.5">En sliders</span>
                    </div>
                  </div>

                  {/* Card 5: 3D Models */}
                  <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono uppercase ${textMuted}`}>3D & CGI</span>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Box className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black">
                        {projects.filter((p) => p.category === '3D MODELING').length}
                      </span>
                      <span className="text-[10px] text-emerald-400 block font-mono mt-0.5">Hard-surface</span>
                    </div>
                  </div>

                  {/* Card 6: Total Reach */}
                  <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Rendimiento</span>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black">99.8%</span>
                      <span className="text-[10px] text-emerald-400 block font-mono mt-0.5">Estabilidad</span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Middle Section with Category Distribution Bar Chart & Slider Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Category Breakdown Custom Bar Chart (Matching Mediline Screenshot) */}
                  <div className={`lg:col-span-8 p-6 sm:p-8 rounded-3xl border ${bgCard} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-black uppercase italic tracking-tight">
                          Distribución de Proyectos por Disciplina
                        </h4>
                        <p className={`text-xs ${textMuted}`}>
                          Balance de producción artística y técnica en el portafolio
                        </p>
                      </div>
                      <span className="text-xs font-mono text-[#76FF03] font-bold bg-[#76FF03]/10 px-3 py-1 rounded-full">
                        Actualizado en Vivo
                      </span>
                    </div>

                    {/* Chart Bars */}
                    <div className="space-y-4 pt-2">
                      {[
                        { name: 'Modelado 3D & Stands', cat: '3D MODELING', color: 'bg-[#76FF03]', count: projects.filter((p) => p.category === '3D MODELING').length },
                        { name: 'Branding & Identidad', cat: 'BRANDING', color: 'bg-emerald-400', count: projects.filter((p) => p.category === 'BRANDING').length },
                        { name: 'Digital Art & Retratos', cat: 'DIGITAL ART', color: 'bg-amber-400', count: projects.filter((p) => p.category === 'DIGITAL ART').length },
                        { name: 'Motion & Edición Video', cat: 'MOTION', color: 'bg-cyan-400', count: projects.filter((p) => p.category === 'MOTION').length },
                      ].map((item) => {
                        const percent = projects.length > 0 ? (item.count / projects.length) * 100 : 0;
                        return (
                          <div key={item.cat} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono font-bold">
                              <span>{item.name}</span>
                              <span>{item.count} proyectos ({Math.round(percent)}%)</span>
                            </div>
                            <div className="w-full h-3.5 rounded-full bg-black/20 overflow-hidden p-0.5">
                              <div
                                className={`h-full rounded-full ${item.color} transition-all duration-700`}
                                style={{ width: `${Math.max(percent, 8)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Widget: Active Specialty Showcase (Mediline Profile card style) */}
                  <div className={`lg:col-span-4 p-6 sm:p-8 rounded-3xl border ${bgCard} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold uppercase text-[#76FF03]">
                        PORTADA ACTIVA
                      </span>
                      <span className="text-xs font-mono text-gray-400">4 Sliders</span>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 my-2">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#76FF03] p-1 bg-black/40 shadow-[0_0_20px_rgba(118,255,3,0.3)]">
                        <img
                          src={disciplines[0]?.image || '/images/orbit-stand.webp'}
                          alt="Specialty"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div>
                        <h4 className="text-base font-black italic uppercase">
                          {disciplines[0]?.titleEs || 'Modelado 3D'}
                        </h4>
                        <span className="text-xs text-gray-400 font-mono block mt-0.5">
                          {disciplines[0]?.subtitleEs || 'Visualización Comercial'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('disciplines')}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#76FF03] hover:text-black text-xs font-bold uppercase transition-all flex items-center justify-center gap-2"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Configurar Sliders</span>
                    </button>
                  </div>
                </div>

                {/* Row 3: Quick Action & Recent Projects Table */}
                <div className={`p-6 sm:p-8 rounded-3xl border ${bgCard} space-y-6`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-black uppercase italic tracking-tight">
                        Producciones Recientes
                      </h4>
                      <p className={`text-xs ${textMuted}`}>
                        Últimos proyectos gestionados en la base de datos
                      </p>
                    </div>

                    <SpecularButton
                      onClick={handleCreateNewProject}
                      variant="solid-lime"
                      size="sm"
                      radius={12}
                      className="text-xs font-black tracking-wider uppercase px-4 py-2.5 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nuevo Proyecto</span>
                    </SpecularButton>
                  </div>

                  {/* Quick Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 font-mono">
                          <th className="pb-3 font-bold">PROYECTO</th>
                          <th className="pb-3 font-bold">CLIENTE</th>
                          <th className="pb-3 font-bold">CATEGORÍA</th>
                          <th className="pb-3 font-bold">AÑO</th>
                          <th className="pb-3 font-bold text-center">DESTACADO</th>
                          <th className="pb-3 font-bold text-right">ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {projects.slice(0, 5).map((p) => (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-10 h-8 rounded-lg object-cover bg-black/40 border border-white/10"
                              />
                              <span className="font-bold truncate max-w-xs">{p.title}</span>
                            </td>
                            <td className="py-3 text-gray-400">{p.client}</td>
                            <td className="py-3 font-mono text-[#76FF03]">{p.category}</td>
                            <td className="py-3 font-mono text-gray-400">{p.year}</td>
                            <td className="py-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleFeatured(p.id)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  p.featured ? 'text-[#76FF03]' : 'text-gray-500'
                                }`}
                              >
                                <Star className={`w-4 h-4 ${p.featured ? 'fill-[#76FF03]' : ''}`} />
                              </button>
                            </td>
                            <td className="py-3 text-right space-x-2">
                              <button
                                type="button"
                                onClick={() => handleEditProject(p)}
                                className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white"
                                title="Editar"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(p.id, p.title)}
                                className="p-1.5 hover:bg-red-500/10 rounded text-red-400"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: ESPECIALIDADES & SLIDERS ================= */}
            {activeTab === 'disciplines' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">
                    Gestor de Especialidades & Sliders
                  </h3>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Configura las 4 especialidades principales (Modelado 3D, Branding, Edición de Video, Social Media) y sus sliders de imágenes interactivos.
                  </p>
                </div>

                <DisciplineSliderEditor disciplines={disciplines} projects={projects} darkMode={darkMode} />
              </div>
            )}

            {/* ================= TAB 3: GESTOR DE PROYECTOS ================= */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">
                      Catálogo Completo de Proyectos ({filteredProjects.length})
                    </h3>
                    <p className={`text-xs ${textMuted} mt-1`}>
                      Crea, edita, sube imágenes, videos y organiza las producciones de tu portafolio.
                    </p>
                  </div>

                  <SpecularButton
                    onClick={handleCreateNewProject}
                    variant="solid-lime"
                    size="md"
                    radius={12}
                    className="text-xs font-black tracking-wider uppercase px-5 py-3 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Crear Nuevo Proyecto</span>
                  </SpecularButton>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['ALL', '3D MODELING', 'BRANDING', 'DIGITAL ART', 'MOTION'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        categoryFilter === cat
                          ? 'bg-[#76FF03] text-black shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-gray-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className={`rounded-2xl border ${bgCard} overflow-hidden p-4 flex flex-col justify-between hover:border-[#76FF03]/60 transition-all`}
                    >
                      <div>
                        {/* Image Preview */}
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-3">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-contain p-2"
                          />
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(proj.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 backdrop-blur-md text-[#76FF03]"
                            title={proj.featured ? 'Destacado' : 'Hacer destacado'}
                          >
                            <Star className={`w-3.5 h-3.5 ${proj.featured ? 'fill-[#76FF03]' : ''}`} />
                          </button>
                        </div>

                        <span className="text-[10px] font-mono text-[#76FF03] font-bold uppercase block mb-1">
                          {proj.category} • {proj.year}
                        </span>
                        <h4 className="text-base font-black italic uppercase tracking-tight line-clamp-1 mb-1">
                          {proj.title}
                        </h4>
                        <span className="text-xs text-gray-400 block line-clamp-1 font-mono mb-2">
                          {proj.client}
                        </span>
                        <p className={`text-xs ${textMuted} line-clamp-2 leading-relaxed mb-4`}>
                          {proj.shortDesc}
                        </p>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => handleEditProject(proj)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#76FF03] hover:text-black text-xs font-bold transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 4: DESTACADOS ================= */}
            {activeTab === 'featured' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">
                    Proyectos Destacados en Portada ({featuredProjects.length})
                  </h3>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Los proyectos marcados con estrella ⭐ aparecen con prioridad en la portada.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {featuredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className={`rounded-2xl border ${bgCard} overflow-hidden p-4 flex flex-col justify-between border-[#76FF03]/40 shadow-lg`}
                    >
                      <div>
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-3">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-contain p-2"
                          />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#76FF03] text-black font-black text-[10px] uppercase">
                            ⭐ Destacado
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-[#76FF03] font-bold uppercase block mb-1">
                          {proj.category}
                        </span>
                        <h4 className="text-base font-black italic uppercase tracking-tight line-clamp-1 mb-1">
                          {proj.title}
                        </h4>
                        <span className="text-xs text-gray-400 block font-mono mb-2">
                          {proj.client}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(proj.id)}
                          className="text-xs text-red-400 hover:underline font-mono"
                        >
                          Quitar de Destacados
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditProject(proj)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#76FF03] hover:text-black text-xs font-bold transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 5: MEDIOS & CLIPS ================= */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">
                    Gestor Multimedia & Formatos
                  </h3>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Resumen de archivos multimedia, clips y enlaces de video vinculados a los proyectos.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {projects.map((p) => (
                    <div key={p.id} className={`p-4 rounded-2xl border ${bgCard} space-y-3`}>
                      <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/40 border border-white/10">
                        <img src={p.image} alt={p.title} className="w-full h-full object-contain p-2" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs truncate">{p.title}</h5>
                        <span className="text-[10px] text-gray-400 font-mono block">
                          {p.videoUrl ? '🎬 Con Video Enlazado' : '🖼️ Solo Imagen'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 6: RESPALDO JSON ================= */}
            {activeTab === 'backup' && (
              <div className="max-w-4xl space-y-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">
                    Respaldo & Transferencia de Datos (JSON)
                  </h3>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Exporta una copia de seguridad de todos tus proyectos y configuraciones o importa datos previamente guardados.
                  </p>
                </div>

                {backupSuccessMsg && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{backupSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Export Box */}
                  <div className={`p-6 rounded-3xl border ${bgCard} space-y-4`}>
                    <div className="flex items-center gap-3">
                      <Download className="w-6 h-6 text-[#76FF03]" />
                      <h4 className="text-base font-bold">Exportar Base de Datos</h4>
                    </div>
                    <p className={`text-xs ${textMuted} leading-relaxed`}>
                      Descarga un archivo JSON con todos los proyectos, textos de especialidades y diapositivas de los sliders para guardarlo en tu computadora.
                    </p>
                    <SpecularButton
                      onClick={handleExportJSON}
                      variant="solid-lime"
                      size="md"
                      radius={12}
                      className="text-xs font-black tracking-wider uppercase px-5 py-3 w-full flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Copia JSON</span>
                    </SpecularButton>
                  </div>

                  {/* Reset Defaults Box */}
                  <div className={`p-6 rounded-3xl border ${bgCard} space-y-4`}>
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-6 h-6 text-amber-400" />
                      <h4 className="text-base font-bold">Restaurar Valores de Fábrica</h4>
                    </div>
                    <p className={`text-xs ${textMuted} leading-relaxed`}>
                      Si deseas reiniciar la base de datos a su estado original inicial, haz clic a continuación.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="w-full py-3 px-4 rounded-xl border border-amber-500/30 hover:bg-amber-500/10 text-amber-400 text-xs font-bold uppercase transition-colors"
                    >
                      Restaurar Todo por Defecto
                    </button>
                  </div>
                </div>

                {/* Import Box */}
                <div className={`p-6 rounded-3xl border ${bgCard} space-y-4`}>
                  <div className="flex items-center gap-3">
                    <Upload className="w-6 h-6 text-cyan-400" />
                    <h4 className="text-base font-bold">Importar Archivo o Texto JSON</h4>
                  </div>
                  <p className={`text-xs ${textMuted}`}>
                    Pega el contenido JSON de una copia de seguridad para restaurarla en tu navegador:
                  </p>
                  <textarea
                    rows={5}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{"projects": [...], "disciplines": [...]}'
                    className={`w-full p-4 rounded-2xl border text-xs font-mono outline-none ${
                      darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                  <SpecularButton
                    onClick={handleImportJSON}
                    variant="glass"
                    size="md"
                    radius={12}
                    className="text-xs font-bold tracking-wider uppercase px-5 py-3"
                  >
                    Importar y Aplicar Datos
                  </SpecularButton>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Project Edit Modal */}
      <ProjectEditModal
        isOpen={isEditModalOpen}
        project={editingProject}
        onClose={() => setIsEditModalOpen(false)}
        onSave={async (proj) => {
          await saveProject(proj);
        }}
        darkMode={darkMode}
      />
    </div>
  );
};
