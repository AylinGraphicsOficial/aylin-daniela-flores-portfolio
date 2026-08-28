import React, { useState, useEffect } from 'react';
import {
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
  ArrowLeft,
  Sliders,
  Check,
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
import { ProjectEditModal } from './ProjectEditModal';
import { DisciplineSliderEditor } from './DisciplineSliderEditor';

interface AdminDashboardPageProps {
  onNavigateHome: () => void;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateHome,
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

  // Sync data from storage
  useEffect(() => {
    const loadData = () => {
      setProjects(getStoredProjects());
      setDisciplines(getStoredDisciplines());
    };
    loadData();
    const unsubscribe = subscribeToPortfolioChanges(loadData);
    return () => unsubscribe();
  }, []);

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
    setBackupSuccessMsg('¡Copia de seguridad exportada con éxito en formato JSON!');
  };

  const handleImportJSON = () => {
    playClickSound();
    if (!jsonInput.trim()) return;
    const success = importPortfolioJSON(jsonInput);
    if (success) {
      play8BitArcadeSound();
      setBackupSuccessMsg('¡Datos importados y aplicados exitosamente al portafolio!');
      setJsonInput('');
    } else {
      alert('Error: el formato JSON no es válido.');
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        '¿Deseas restaurar todos los proyectos y sliders a los valores originales de fábrica?'
      )
    ) {
      playClickSound();
      resetPortfolioToDefaults();
      setBackupSuccessMsg('¡Base de datos restablecida a los valores de fábrica!');
    }
  };

  // Filtered projects
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

  // Professional Theme Variables (Mediline Palette)
  const bgApp = darkMode ? 'bg-[#0F172A] text-slate-100' : 'bg-[#F8FAFC] text-slate-900';
  const bgSidebar = darkMode ? 'bg-[#1E293B] border-slate-800 text-slate-200' : 'bg-[#00965E] border-transparent text-white';
  const bgCard = darkMode ? 'bg-[#1E293B] border-slate-700/50 text-slate-100 shadow-sm' : 'bg-white border-slate-200 text-slate-900 shadow-sm';
  const bgTopBar = darkMode ? 'bg-[#1E293B]/95 border-slate-800' : 'bg-white/95 border-slate-200 shadow-sm';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-500';
  const bgInput = darkMode ? 'bg-[#0F172A] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500' : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600';

  return (
    <div className={`min-h-screen ${bgApp} flex flex-col md:flex-row font-sans transition-colors duration-200`}>
      {/* ==================== SIDEBAR ==================== */}
      <aside
        className={`w-full md:w-64 lg:w-72 flex-shrink-0 flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r ${bgSidebar}`}
      >
        {/* Brand & Menu */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              A
            </div>
            <div>
              <span className="font-bold text-base tracking-tight uppercase block leading-none">
                AYLIN STUDIO
              </span>
              <span className="text-[11px] font-mono opacity-80 uppercase tracking-wider mt-0.5 block">
                Dashboard Pro
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('overview');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'disciplines'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Gestor de Proyectos</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20 font-bold">
                {projects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('featured');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'featured'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Proyectos Destacados</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20 font-bold">
                {featuredProjects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('media');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'media'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'backup'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Respaldo & Backup JSON</span>
            </button>
          </nav>
        </div>

        {/* Profile & Logout */}
        <div className="pt-6 border-t border-slate-700/60 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-black/15">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
              AF
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold block truncate">Aylin Flores</span>
              <span className="text-[10px] opacity-75 block font-mono truncate">
                Administradora
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header
          className={`sticky top-0 z-20 px-6 sm:px-8 py-4 flex items-center justify-between border-b backdrop-blur-md ${bgTopBar}`}
        >
          {/* Search Box */}
          <div className="relative w-64 sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar producciones, clientes, tags..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none transition-all ${bgInput}`}
            />
          </div>

          {/* Right Header Tools */}
          <div className="flex items-center gap-3">
            {/* Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setDarkMode(!darkMode);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-black'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span className="hidden sm:inline">
                {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </button>

            {/* Back to Live Portfolio Website */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onNavigateHome();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Portafolio</span>
            </button>
          </div>
        </header>

        {/* Dashboard Viewport */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 space-y-8 max-w-[1600px] w-full mx-auto">
          {/* ================= TAB 1: RESUMEN GENERAL ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Row 1: Stat Cards (Mediline Style) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Total Projects */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Total Proyectos</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">{projects.length}</span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">En catálogo</span>
                  </div>
                </div>

                {/* Featured */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Destacados</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Star className="w-4 h-4 fill-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">{featuredProjects.length}</span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">En portada</span>
                  </div>
                </div>

                {/* Disciplines */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Especialidades</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">{disciplines.length}</span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">Categorías</span>
                  </div>
                </div>

                {/* Slides */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Diapositivas</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">{totalSlides}</span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">En sliders</span>
                  </div>
                </div>

                {/* 3D CGI */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Modelado 3D</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Box className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">
                      {projects.filter((p) => p.category === '3D MODELING').length}
                    </span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">Hard-surface</span>
                  </div>
                </div>

                {/* Performance */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>Rendimiento</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">99.8%</span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">Estabilidad</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Distribution Bar Chart & Specialty Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Distribution Bar Chart */}
                <div className={`lg:col-span-8 p-6 sm:p-8 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold tracking-tight">
                        Distribución de Proyectos por Disciplina
                      </h3>
                      <p className={`text-xs ${textMuted} mt-0.5`}>
                        Balance de producciones 3D, branding, arte digital y motion
                      </p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                      Sincronizado en Vivo
                    </span>
                  </div>

                  <div className="space-y-4 pt-2">
                    {[
                      { name: 'Modelado 3D & Stands', cat: '3D MODELING', color: 'bg-emerald-500', count: projects.filter((p) => p.category === '3D MODELING').length },
                      { name: 'Branding & Identidad', cat: 'BRANDING', color: 'bg-teal-500', count: projects.filter((p) => p.category === 'BRANDING').length },
                      { name: 'Digital Art & Retratos', cat: 'DIGITAL ART', color: 'bg-amber-500', count: projects.filter((p) => p.category === 'DIGITAL ART').length },
                      { name: 'Motion & Edición Video', cat: 'MOTION', color: 'bg-sky-500', count: projects.filter((p) => p.category === 'MOTION').length },
                    ].map((item) => {
                      const percent = projects.length > 0 ? (item.count / projects.length) * 100 : 0;
                      return (
                        <div key={item.cat} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono font-medium">
                            <span>{item.name}</span>
                            <span>{item.count} proyectos ({Math.round(percent)}%)</span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.color} transition-all duration-700`}
                              style={{ width: `${Math.max(percent, 6)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Specialty Showcase Card */}
                <div className={`lg:col-span-4 p-6 sm:p-8 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                      ESPECIALIDAD PRINCIPAL
                    </span>
                    <span className="text-xs font-mono text-slate-400">4 Sliders Activos</span>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-4 my-2">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-md">
                      <img
                        src={disciplines[0]?.image || '/images/orbit-stand.webp'}
                        alt="Specialty"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold">
                        {disciplines[0]?.titleEs || 'Modelado 3D'}
                      </h4>
                      <span className="text-xs text-slate-400 font-mono block mt-0.5">
                        {disciplines[0]?.subtitleEs || 'Visualización Comercial'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('disciplines')}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Configurar Sliders</span>
                  </button>
                </div>
              </div>

              {/* Row 3: Quick Projects Table */}
              <div className={`p-6 sm:p-8 rounded-2xl border ${bgCard} space-y-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold tracking-tight">
                      Producciones Recientes
                    </h3>
                    <p className={`text-xs ${textMuted}`}>
                      Últimos proyectos gestionados en la base de datos
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateNewProject}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Proyecto</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700/60 text-slate-400 font-mono">
                        <th className="pb-3 font-semibold">PROYECTO</th>
                        <th className="pb-3 font-semibold">CLIENTE</th>
                        <th className="pb-3 font-semibold">CATEGORÍA</th>
                        <th className="pb-3 font-semibold">AÑO</th>
                        <th className="pb-3 font-semibold text-center">DESTACADO</th>
                        <th className="pb-3 font-semibold text-right">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {projects.slice(0, 6).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-10 h-8 rounded-lg object-cover bg-slate-900 border border-slate-700"
                            />
                            <span className="font-semibold truncate max-w-xs">{p.title}</span>
                          </td>
                          <td className="py-3 text-slate-400">{p.client}</td>
                          <td className="py-3 font-mono text-emerald-400 font-medium">{p.category}</td>
                          <td className="py-3 font-mono text-slate-400">{p.year}</td>
                          <td className="py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(p.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                p.featured ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-400' : ''}`} />
                            </button>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleEditProject(p)}
                              className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(p.id, p.title)}
                              className="p-1.5 hover:bg-rose-500/10 rounded text-rose-400 cursor-pointer"
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
                <h2 className="text-xl font-bold tracking-tight">
                  Gestor de Especialidades & Sliders de Imágenes
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Configura las diapositivas de los sliders en portada y modifica los textos de las 4 especialidades.
                </p>
              </div>

              <DisciplineSliderEditor disciplines={disciplines} darkMode={darkMode} />
            </div>
          )}

          {/* ================= TAB 3: GESTOR DE PROYECTOS ================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Catálogo Completo de Proyectos ({filteredProjects.length})
                  </h2>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Administra tus producciones, imágenes, videos y métricas técnicas.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCreateNewProject}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Crear Nuevo Proyecto</span>
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['ALL', '3D MODELING', 'BRANDING', 'DIGITAL ART', 'MOTION'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400'
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
                    className={`rounded-2xl border ${bgCard} overflow-hidden p-4 flex flex-col justify-between hover:border-slate-600 transition-all`}
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 mb-3">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-contain p-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(proj.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-amber-400 cursor-pointer"
                          title={proj.featured ? 'Destacado' : 'Marcar como destacado'}
                        >
                          <Star className={`w-3.5 h-3.5 ${proj.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase block mb-1">
                        {proj.category} • {proj.year}
                      </span>
                      <h4 className="text-sm font-bold tracking-tight line-clamp-1 mb-1">
                        {proj.title}
                      </h4>
                      <span className="text-xs text-slate-400 block line-clamp-1 font-mono mb-2">
                        {proj.client}
                      </span>
                      <p className={`text-xs ${textMuted} line-clamp-2 leading-relaxed mb-4`}>
                        {proj.shortDesc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <button
                        type="button"
                        onClick={() => handleEditProject(proj)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
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
                <h2 className="text-xl font-bold tracking-tight">
                  Proyectos Destacados en Portada ({featuredProjects.length})
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Los proyectos con estrella aparecen con prioridad en la página principal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {featuredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className={`rounded-2xl border ${bgCard} overflow-hidden p-4 flex flex-col justify-between border-emerald-500/40 shadow-sm`}
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 mb-3">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-contain p-2"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-[10px] uppercase">
                          ⭐ Destacado
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase block mb-1">
                        {proj.category}
                      </span>
                      <h4 className="text-sm font-bold tracking-tight line-clamp-1 mb-1">
                        {proj.title}
                      </h4>
                      <span className="text-xs text-slate-400 block font-mono mb-2">
                        {proj.client}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(proj.id)}
                        className="text-xs text-rose-400 hover:underline font-mono cursor-pointer"
                      >
                        Quitar de Portada
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEditProject(proj)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-medium transition-colors cursor-pointer"
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
                <h2 className="text-xl font-bold tracking-tight">
                  Inventario Multimedia & Archivos
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Lista de recursos visuales y enlaces de video vinculados a los proyectos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {projects.map((p) => (
                  <div key={p.id} className={`p-4 rounded-2xl border ${bgCard} space-y-3`}>
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60">
                      <img src={p.image} alt={p.title} className="w-full h-full object-contain p-2" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs truncate">{p.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {p.videoUrl ? '🎬 Video Enlazado' : '🖼️ Render Gráfico'}
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
                <h2 className="text-xl font-bold tracking-tight">
                  Respaldo & Transferencia de Datos (JSON)
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Exporta una copia de seguridad o importa datos para transferirlos entre navegadores o dispositivos.
                </p>
              </div>

              {backupSuccessMsg && (
                <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{backupSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${bgCard} space-y-4`}>
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold">Exportar Base de Datos</h3>
                  </div>
                  <p className={`text-xs ${textMuted} leading-relaxed`}>
                    Descarga un archivo JSON con todos los proyectos, especialidades y diapositivas para guardarlo de forma segura.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Backup JSON</span>
                  </button>
                </div>

                <div className={`p-6 rounded-2xl border ${bgCard} space-y-4`}>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold">Restaurar Valores por Defecto</h3>
                  </div>
                  <p className={`text-xs ${textMuted} leading-relaxed`}>
                    Reinicia todos los contenidos del portafolio al estado predeterminado de fábrica.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="w-full py-2.5 px-4 rounded-xl border border-amber-500/30 hover:bg-amber-500/10 text-amber-400 text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Restaurar Todo por Defecto
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${bgCard} space-y-4`}>
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-bold">Importar Archivo o Texto JSON</h3>
                </div>
                <p className={`text-xs ${textMuted}`}>
                  Pega el contenido JSON de una copia de seguridad para restaurarla en este navegador:
                </p>
                <textarea
                  rows={5}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"projects": [...], "disciplines": [...]}'
                  className={`w-full p-4 rounded-xl border text-xs font-mono outline-none ${bgInput}`}
                />
                <button
                  type="button"
                  onClick={handleImportJSON}
                  className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Importar y Aplicar Datos
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Project Edit Modal */}
      <ProjectEditModal
        isOpen={isEditModalOpen}
        project={editingProject}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(proj) => saveProject(proj)}
        darkMode={darkMode}
      />
    </div>
  );
};
