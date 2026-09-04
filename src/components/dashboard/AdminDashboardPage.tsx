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
  Server,
  Copy,
  CheckCheck,
  Video,
  User,
  Briefcase,
  Award,
  Compass,
  FileText,
  Loader2,
  Save,
  Globe,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { Project, Discipline, ExperienceItem } from '../../types';
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
  checkDatabaseStatus,
  syncFromRemoteServer,
  DatabaseStatusInfo,
  getStoredAbout,
  saveStoredAbout,
  AboutSectionData,
  getStoredExperience,
  saveStoredExperience,
  getStoredDiplomados,
  saveStoredDiplomados,
  DiplomadoItem,
  getStoredLab3D,
  saveStoredLab3D,
  Lab3DData,
  Lab3DModelItem,
  uploadMediaFile,
} from '../../utils/portfolioStorage';
import { playClickSound, play8BitArcadeSound } from '../../utils/audio';
import { ProjectEditModal } from './ProjectEditModal';
import { DisciplineSliderEditor } from './DisciplineSliderEditor';

interface AdminDashboardPageProps {
  onNavigateHome: () => void;
  onLogout: () => void;
}

interface UploadedMediaItem {
  filename: string;
  url: string;
  size: number;
  type: string;
  updatedAt: string;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateHome,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'projects'
    | 'disciplines'
    | 'featured'
    | 'about'
    | 'experience'
    | 'diplomados'
    | 'lab3d'
    | 'media'
    | 'backup'
  >('overview');

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Sections states
  const [aboutData, setAboutData] = useState<AboutSectionData>(getStoredAbout);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(getStoredExperience);
  const [diplomados, setDiplomados] = useState<DiplomadoItem[]>(getStoredDiplomados);
  const [lab3dData, setLab3dData] = useState<Lab3DData>(getStoredLab3D);

  // New Diplomado Form State
  const [newDipTitle, setNewDipTitle] = useState('');
  const [newDipSrc, setNewDipSrc] = useState('');
  const [newDipYear, setNewDipYear] = useState('2025');
  const [isUploadingDip, setIsUploadingDip] = useState(false);

  // 3D Model Form State
  const [newModelName, setNewModelName] = useState('');
  const [newModelUrl, setNewModelUrl] = useState('');
  const [newModelStats, setNewModelStats] = useState('');
  const [isUploadingModel, setIsUploadingModel] = useState(false);

  // New Experience Form State
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  // Uploading Profile Photo
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // DB Sync Status
  const [dbStatus, setDbStatus] = useState<DatabaseStatusInfo | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMediaItem[]>([]);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // JSON backup state
  const [jsonInput, setJsonInput] = useState('');
  const [backupSuccessMsg, setBackupSuccessMsg] = useState<string | null>(null);

  // Sync data from storage & check remote DB status
  useEffect(() => {
    const loadData = () => {
      setProjects(getStoredProjects());
      setDisciplines(getStoredDisciplines());
      setAboutData(getStoredAbout());
      setExperiences(getStoredExperience());
      setDiplomados(getStoredDiplomados());
      setLab3dData(getStoredLab3D());
    };
    loadData();

    checkDatabaseStatus().then(setDbStatus);

    const unsubscribe = subscribeToPortfolioChanges(loadData);
    return () => unsubscribe();
  }, []);

  // Fetch uploaded files when opening the media tab
  useEffect(() => {
    if (activeTab === 'media') {
      fetch('/api/upload.php')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.files)) {
            setUploadedFiles(data.files);
          }
        })
        .catch(() => {});
    }
  }, [activeTab]);

  const showNotification = (msg: string) => {
    play8BitArcadeSound();
    setBackupSuccessMsg(msg);
    setTimeout(() => setBackupSuccessMsg(null), 4000);
  };

  const handleManualSync = async () => {
    playClickSound();
    setIsSyncing(true);
    const success = await syncFromRemoteServer();
    const status = await checkDatabaseStatus();
    setDbStatus(status);
    setIsSyncing(false);
    if (success) {
      showNotification('¡Sincronización con Hostinger MySQL completada con éxito!');
    }
  };

  const handleCopyUrl = (url: string) => {
    playClickSound();
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Projects Handlers
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
    if (
      window.confirm(
        `¿Estás seguro de eliminar el proyecto "${title}"? Se borrará también de Hostinger MySQL.`
      )
    ) {
      playClickSound();
      deleteProject(id);
    }
  };

  const handleToggleFeatured = (id: string) => {
    playClickSound();
    toggleProjectFeatured(id);
  };

  // About Section Handlers
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    await saveStoredAbout(aboutData);
    showNotification('¡Información de Sobre Mí & Perfil guardada en Hostinger MySQL!');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    const res = await uploadMediaFile(file);
    setIsUploadingPhoto(false);
    if (res.success && res.url) {
      setAboutData((prev) => ({ ...prev, photo: res.url }));
    } else {
      alert(res.error || 'Error al subir la fotografía.');
    }
  };

  // Experience Handlers
  const handleSaveExperienceList = async (updatedList: ExperienceItem[]) => {
    setExperiences(updatedList);
    await saveStoredExperience(updatedList);
    showNotification('¡Línea de Experiencia actualizada en Hostinger MySQL!');
  };

  const handleDeleteExperience = (id: string) => {
    if (window.confirm('¿Eliminar esta experiencia laboral?')) {
      const updated = experiences.filter((e) => e.id !== id);
      handleSaveExperienceList(updated);
    }
  };

  const handleSaveSingleExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    const index = experiences.findIndex((x) => x.id === editingExp.id);
    let updated: ExperienceItem[];
    if (index >= 0) {
      updated = [...experiences];
      updated[index] = editingExp;
    } else {
      updated = [{ ...editingExp, id: editingExp.id || `exp-${Date.now()}` }, ...experiences];
    }
    handleSaveExperienceList(updated);
    setIsExpModalOpen(false);
    setEditingExp(null);
  };

  // Diplomados Handlers
  const handleAddDiplomado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDipSrc.trim() || !newDipTitle.trim()) {
      alert('Por favor ingresa un título y una imagen para el diplomado.');
      return;
    }
    const newDip: DiplomadoItem = {
      id: `dip-${Date.now()}`,
      title: newDipTitle.trim(),
      src: newDipSrc.trim(),
      year: newDipYear.trim() || '2025',
      visible: true,
    };
    const updated = [newDip, ...diplomados];
    setDiplomados(updated);
    await saveStoredDiplomados(updated);
    setNewDipTitle('');
    setNewDipSrc('');
    showNotification('¡Diplomado añadido y guardado en Hostinger MySQL!');
  };

  const handleDiplomadoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDip(true);
    const res = await uploadMediaFile(file);
    setIsUploadingDip(false);
    if (res.success && res.url) {
      setNewDipSrc(res.url);
      if (!newDipTitle) {
        setNewDipTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    } else {
      alert(res.error || 'Error al subir imagen del diplomado.');
    }
  };

  const handleToggleDiplomado = async (id: string) => {
    const updated = diplomados.map((d) =>
      d.id === id ? { ...d, visible: !d.visible } : d
    );
    setDiplomados(updated);
    await saveStoredDiplomados(updated);
  };

  const handleDeleteDiplomado = async (id: string) => {
    if (window.confirm('¿Eliminar este diplomado/certificado?')) {
      const updated = diplomados.filter((d) => d.id !== id);
      setDiplomados(updated);
      await saveStoredDiplomados(updated);
    }
  };

  // Lab 3D Handlers
  const handleGlbFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingModel(true);
    const res = await uploadMediaFile(file);
    setIsUploadingModel(false);
    if (res.success && res.url) {
      setNewModelUrl(res.url);
      if (!newModelName) {
        setNewModelName(file.name.replace(/\.[^/.]+$/, ''));
      }
    } else {
      alert(res.error || 'Error al subir el modelo 3D GLB.');
    }
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim() || !newModelUrl.trim()) {
      alert('Ingresa el nombre y la URL/archivo del modelo 3D.');
      return;
    }
    const newModel: Lab3DModelItem = {
      id: `m3d-${Date.now()}`,
      name: newModelName.trim(),
      url: newModelUrl.trim(),
      type: 'glb',
      stats: newModelStats.trim() || 'Modelado 3D GLB • Geometría & Shaders PBR',
      visible: true,
    };
    const updatedModels = [...(lab3dData.models || []), newModel];
    const updatedLabData: Lab3DData = { ...lab3dData, models: updatedModels };
    setLab3dData(updatedLabData);
    await saveStoredLab3D(updatedLabData);
    setNewModelName('');
    setNewModelUrl('');
    setNewModelStats('');
    showNotification('¡Modelo 3D añadido y guardado en Hostinger MySQL!');
  };

  const handleDeleteModel = async (id: string) => {
    if (window.confirm('¿Eliminar este modelo 3D del laboratorio?')) {
      const updatedModels = (lab3dData.models || []).filter((m) => m.id !== id);
      const updatedLabData: Lab3DData = { ...lab3dData, models: updatedModels };
      setLab3dData(updatedLabData);
      await saveStoredLab3D(updatedLabData);
      showNotification('¡Modelo 3D eliminado!');
    }
  };

  const handleSetDefaultModel = async (id: string) => {
    const updatedLabData: Lab3DData = { ...lab3dData, defaultModelId: id };
    setLab3dData(updatedLabData);
    await saveStoredLab3D(updatedLabData);
    showNotification('¡Modelo 3D establecido como predeterminado en el visor!');
  };

  const handleSaveLab3D = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    await saveStoredLab3D(lab3dData);
    showNotification('¡Configuración del Laboratorio 3D guardada en Hostinger MySQL!');
  };

  // Backup Handlers
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
    showNotification('¡Copia de seguridad exportada con éxito en formato JSON!');
  };

  const handleImportJSON = async () => {
    playClickSound();
    if (!jsonInput.trim()) return;
    const success = await importPortfolioJSON(jsonInput);
    if (success) {
      showNotification('¡Datos importados y guardados en Hostinger MySQL exitosamente!');
      setJsonInput('');
    } else {
      alert('Error: el formato JSON no es válido.');
    }
  };

  const handleResetDefaults = async () => {
    if (
      window.confirm(
        '¿Deseas restaurar todos los proyectos, sliders y secciones a los valores originales de fábrica en Hostinger MySQL?'
      )
    ) {
      playClickSound();
      await resetPortfolioToDefaults();
      showNotification('¡Base de datos restablecida a los valores de fábrica!');
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

  // Themes
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
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              A
            </div>
            <div>
              <span className="font-bold text-base tracking-tight uppercase block leading-none">
                AYLIN STUDIO
              </span>
              <span className="text-[11px] font-mono opacity-80 uppercase tracking-wider mt-0.5 block">
                Dashboard Master
              </span>
            </div>
          </div>

          {/* Database Live Status Badge */}
          <div className="p-3 rounded-xl bg-black/20 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                {dbStatus?.connected ? 'Hostinger MySQL' : 'Caché Activa'}
              </span>
            </div>
            <span className="text-[10px] font-mono opacity-75 block truncate">
              BD: u888615463_2026_portfolio
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('overview');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
                setActiveTab('projects');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Proyectos & Galería</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20 font-bold">
                {projects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('disciplines');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'disciplines'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>4 Especialidades & Sliders</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20 font-bold">
                {totalSlides}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('about');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'about'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Sobre Mí & Perfil</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('experience');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'experience'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Experiencia Laboral</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20 font-bold">
                {experiences.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('diplomados');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'diplomados'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Diplomados & Cursos</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20 font-bold">
                {diplomados.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('lab3d');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'lab3d'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Laboratorio 3D</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('featured');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'featured'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Destacados en Portada</span>
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
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'media'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Medios /uploads/</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('backup');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
            {/* Sync Button */}
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-300 text-emerald-700 hover:bg-slate-200'
              }`}
              title="Sincronizar datos con Hostinger MySQL"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </span>
            </button>

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
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
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

        {/* Success notification if any */}
        {backupSuccessMsg && (
          <div className="mx-6 sm:mx-8 mt-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{backupSuccessMsg}</span>
          </div>
        )}

        {/* Dashboard Viewport */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 space-y-8 max-w-[1600px] w-full mx-auto">
          {/* ================= TAB 1: RESUMEN GENERAL ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Row 1: Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Total Projects */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>
                      Total Proyectos
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">{projects.length}</span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">
                      En Hostinger DB
                    </span>
                  </div>
                </div>

                {/* Featured */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>
                      Destacados
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Star className="w-4 h-4 fill-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">
                      {featuredProjects.length}
                    </span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">
                      En portada
                    </span>
                  </div>
                </div>

                {/* Disciplines */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>
                      Especialidades
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">{disciplines.length}</span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">
                      Categorías
                    </span>
                  </div>
                </div>

                {/* Slides */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>
                      Diapositivas
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">{totalSlides}</span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">
                      En sliders
                    </span>
                  </div>
                </div>

                {/* Diplomados */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>
                      Diplomados
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold">{diplomados.length}</span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">
                      Certificaciones
                    </span>
                  </div>
                </div>

                {/* Database Status */}
                <div className={`p-5 rounded-2xl border ${bgCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono uppercase ${textMuted}`}>
                      Estado DB
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Server className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-lg font-bold text-emerald-400 truncate block">
                      MySQL 2026
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono mt-0.5">
                      Sincronizado
                    </span>
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
                        Balance de producciones 3D, branding, arte digital y motion en MySQL
                      </p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                      Sincronizado Global
                    </span>
                  </div>

                  <div className="space-y-4 pt-2">
                    {[
                      {
                        name: 'Modelado 3D & Stands',
                        cat: '3D MODELING',
                        color: 'bg-emerald-500',
                        count: projects.filter((p) => p.category === '3D MODELING').length,
                      },
                      {
                        name: 'Branding & Identidad',
                        cat: 'BRANDING',
                        color: 'bg-teal-500',
                        count: projects.filter((p) => p.category === 'BRANDING').length,
                      },
                      {
                        name: 'Digital Art & Retratos',
                        cat: 'DIGITAL ART',
                        color: 'bg-amber-500',
                        count: projects.filter((p) => p.category === 'DIGITAL ART').length,
                      },
                      {
                        name: 'Motion & Edición Video',
                        cat: 'MOTION',
                        color: 'bg-sky-500',
                        count: projects.filter((p) => p.category === 'MOTION').length,
                      },
                    ].map((item) => {
                      const percent =
                        projects.length > 0 ? (item.count / projects.length) * 100 : 0;
                      return (
                        <div key={item.cat} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono font-medium">
                            <span>{item.name}</span>
                            <span>
                              {item.count} proyectos ({Math.round(percent)}%)
                            </span>
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
                      Producciones Recientes en Hostinger
                    </h3>
                    <p className={`text-xs ${textMuted}`}>
                      Últimos proyectos gestionados y guardados en la base de datos remota
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
                          <td className="py-3 font-mono text-emerald-400 font-medium">
                            {p.category}
                          </td>
                          <td className="py-3 font-mono text-slate-400">{p.year}</td>
                          <td className="py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(p.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                p.featured
                                  ? 'text-amber-400'
                                  : 'text-slate-600 hover:text-slate-400'
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

          {/* ================= TAB 2: CATÁLOGO DE PROYECTOS & VISTAS DE DETALLE ================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Catálogo de Producciones & Vistas de Detalle ({filteredProjects.length})
                  </h2>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Gestiona los proyectos y las galerías de renders de detalle ("VISTAS DE DETALLE & RENDER").
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateNewProject}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Proyecto</span>
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
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
                          <Star
                            className={`w-3.5 h-3.5 ${proj.featured ? 'fill-amber-400' : ''}`}
                          />
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
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            (proj.galleryImages || []).length >= 6
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {(proj.galleryImages || []).length}/6 vistas de detalle
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <button
                        type="button"
                        onClick={() => handleEditProject(proj)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar Proyecto & Galería</span>
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

          {/* ================= TAB 3: ESPECIALIDADES & SLIDERS ================= */}
          {activeTab === 'disciplines' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Editor de Sliders & Especialidades
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Configura las 4 disciplinas de la portada, sus diapositivas y textos en español e inglés.
                </p>
              </div>
              <DisciplineSliderEditor disciplines={disciplines} darkMode={darkMode} />
            </div>
          )}

          {/* ================= TAB 4: SOBRE MÍ & PERFIL PROFESIONAL ================= */}
          {activeTab === 'about' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Sobre Mí & Perfil Profesional
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Edita la biografía, fotografía, redes sociales y datos de presentación personal.
                </p>
              </div>

              <form onSubmit={handleSaveAbout} className={`p-6 sm:p-8 rounded-2xl border ${bgCard} space-y-6`}>
                {/* Photo & Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Photo Preview & Upload */}
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-36 h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 relative group flex items-center justify-center shadow-md">
                      <img
                        src={aboutData.photo || '/images/fotografia-aylin.png'}
                        alt="Foto de Perfil"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors">
                      {isUploadingPhoto ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{isUploadingPhoto ? 'Subiendo...' : 'Subir Nueva Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingPhoto}
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Name, Title, Location */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={aboutData.name || ''}
                        onChange={(e) => setAboutData({ ...aboutData, name: e.target.value })}
                        className={`w-full px-4 py-2 rounded-xl border ${bgInput} text-xs font-semibold`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        Título Profesional
                      </label>
                      <input
                        type="text"
                        value={aboutData.title || ''}
                        onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                        className={`w-full px-4 py-2 rounded-xl border ${bgInput} text-xs`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={aboutData.location || ''}
                        onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
                        className={`w-full px-4 py-2 rounded-xl border ${bgInput} text-xs`}
                      />
                    </div>
                  </div>
                </div>

                {/* Biographies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Biografía Profesional (Español)
                    </label>
                    <textarea
                      rows={5}
                      value={aboutData.bioEs || ''}
                      onChange={(e) => setAboutData({ ...aboutData, bioEs: e.target.value })}
                      className={`w-full p-3 rounded-xl border ${bgInput} text-xs leading-relaxed`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Biografía Profesional (Inglés)
                    </label>
                    <textarea
                      rows={5}
                      value={aboutData.bioEn || ''}
                      onChange={(e) => setAboutData({ ...aboutData, bioEn: e.target.value })}
                      className={`w-full p-3 rounded-xl border ${bgInput} text-xs leading-relaxed`}
                    />
                  </div>
                </div>

                {/* Social Links & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      value={aboutData.whatsapp || ''}
                      onChange={(e) => setAboutData({ ...aboutData, whatsapp: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-mono`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Email de Contacto
                    </label>
                    <input
                      type="text"
                      value={aboutData.email || ''}
                      onChange={(e) => setAboutData({ ...aboutData, email: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-mono`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Enlace a Behance
                    </label>
                    <input
                      type="text"
                      value={aboutData.behance || ''}
                      onChange={(e) => setAboutData({ ...aboutData, behance: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-mono`}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios de Perfil</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TAB 5: EXPERIENCIA LABORAL ================= */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Línea de Tiempo & Trayectoria Profesional ({experiences.length})
                  </h2>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Gestiona los cargos, empresas, periodos y logros de tu trayectoria profesional.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingExp({
                      id: `exp-${Date.now()}`,
                      role: '',
                      company: '',
                      location: 'El Salvador',
                      period: '2026',
                      isCurrent: true,
                      description: '',
                      responsibilities: [],
                      toolsUsed: [],
                    });
                    setIsExpModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Experiencia</span>
                </button>
              </div>

              {/* Experience Cards */}
              <div className="space-y-4">
                {experiences.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-6 rounded-2xl border ${bgCard} flex flex-col md:flex-row items-start justify-between gap-4`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          #{idx + 1}
                        </span>
                        <h4 className="text-base font-bold">{item.role}</h4>
                        {item.isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400">
                            Actual
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-slate-400">
                        {item.company} • {item.period} • {item.location}
                      </p>
                      <p className={`text-xs ${textMuted} leading-relaxed max-w-2xl`}>
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExp(item);
                          setIsExpModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-medium cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(item.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
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

          {/* ================= TAB 6: DIPLOMADOS & CERTIFICACIONES ================= */}
          {activeTab === 'diplomados' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Diplomados & Certificaciones ({diplomados.length})
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Sube y gestiona los certificados que se muestran en el carrusel infinito de la portada.
                </p>
              </div>

              {/* Add Diplomado Form */}
              <form
                onSubmit={handleAddDiplomado}
                className={`p-6 rounded-2xl border ${bgCard} space-y-4`}
              >
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Subir Nuevo Diplomado / Certificado a Hostinger</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    value={newDipTitle}
                    onChange={(e) => setNewDipTitle(e.target.value)}
                    placeholder="Título (ej. Diplomado After Effects 2023)"
                    className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} text-xs font-semibold`}
                  />

                  <input
                    type="text"
                    required
                    value={newDipSrc}
                    onChange={(e) => setNewDipSrc(e.target.value)}
                    placeholder="URL de la imagen (/uploads/...)"
                    className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} text-xs font-mono`}
                  />

                  <div className="flex items-center gap-2">
                    <label className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700">
                      {isUploadingDip ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{isUploadingDip ? 'Subiendo...' : 'Subir Certificado'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingDip}
                        onChange={handleDiplomadoUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase cursor-pointer shadow-sm"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </form>

              {/* Diplomados Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {diplomados.map((dip) => (
                  <div
                    key={dip.id}
                    className={`p-4 rounded-2xl border ${bgCard} space-y-3 flex flex-col justify-between ${
                      dip.visible !== false ? '' : 'opacity-50'
                    }`}
                  >
                    <div className="aspect-[16/11] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 flex items-center justify-center p-2">
                      <img src={dip.src} alt={dip.title} className="w-full h-full object-contain" />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold line-clamp-2">{dip.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block mt-1">
                        {dip.year || '2025'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                      <button
                        type="button"
                        onClick={() => handleToggleDiplomado(dip.id)}
                        className={`flex items-center gap-1 text-xs font-mono cursor-pointer ${
                          dip.visible !== false ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        {dip.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{dip.visible !== false ? 'Visible' : 'Oculto'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteDiplomado(dip.id)}
                        className="p-1 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 7: LABORATORIO 3D ================= */}
          {activeTab === 'lab3d' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Laboratorio 3D Interactivo & Gestión de Modelos GLB
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Sube y administra tus propios archivos 3D (.GLB/.GLTF), rota, mueve y personaliza los modelos disponibles en el visor.
                </p>
              </div>

              {/* Add New 3D Model Form */}
              <form
                onSubmit={handleAddModel}
                className={`p-6 sm:p-8 rounded-2xl border ${bgCard} space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    <span>Subir Nuevo Modelo 3D (.GLB / .GLTF) a Hostinger</span>
                  </span>
                  {isUploadingModel && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Subiendo archivo 3D a Hostinger...</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Nombre del Modelo 3D *
                    </label>
                    <input
                      type="text"
                      required
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      placeholder="Ej. Torre Castillo 3D, Stand Diana 3D"
                      className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} text-xs font-semibold`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Ruta / URL del archivo .GLB *
                    </label>
                    <input
                      type="text"
                      required
                      value={newModelUrl}
                      onChange={(e) => setNewModelUrl(e.target.value)}
                      placeholder="/uploads/modelo.glb o /models/..."
                      className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} text-xs font-mono`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Subir archivo desde PC (.GLB)
                    </label>
                    <label className="w-full py-2.5 px-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-500/40 transition-colors shadow-sm">
                      {isUploadingModel ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{isUploadingModel ? 'Subiendo GLB...' : 'Subir Archivo .GLB'}</span>
                      <input
                        type="file"
                        accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                        disabled={isUploadingModel}
                        onChange={handleGlbFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Estadísticas / Detalles Técnicos (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newModelStats}
                      onChange={(e) => setNewModelStats(e.target.value)}
                      placeholder="Ej. 120k Polígonos • Materiales PBR • Blender 3D"
                      className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} text-xs`}
                    />
                  </div>

                  <div className="self-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Guardar Modelo 3D</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Models Catalog List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-emerald-400">
                    Modelos 3D Disponibles en el Visor ({(lab3dData.models || []).length})
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Predeterminado: {lab3dData.defaultModelId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(lab3dData.models || []).map((model) => {
                    const isDefault = lab3dData.defaultModelId === model.id;
                    const isGlb = model.type === 'glb';

                    return (
                      <div
                        key={model.id}
                        className={`p-5 rounded-2xl border ${bgCard} space-y-3 flex flex-col justify-between ${
                          isDefault ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : ''
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                              {isGlb ? 'ARCHIVO GLB 3D' : 'PROCEDURAL 3D'}
                            </span>
                            {isDefault && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-white">
                                ⭐ Activo
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white tracking-tight">
                            {model.name}
                          </h4>

                          <p className="text-[11px] text-slate-400 font-mono truncate">
                            {model.url ? model.url : 'Geometría generativa WebGL'}
                          </p>

                          <p className="text-[11px] text-slate-300">
                            {model.stats || 'Geometría tridimensional interactiva'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                          <button
                            type="button"
                            onClick={() => handleSetDefaultModel(model.id)}
                            className={`text-xs font-semibold cursor-pointer ${
                              isDefault
                                ? 'text-emerald-400 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {isDefault ? '✓ Por Defecto' : 'Fijar por Defecto'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteModel(model.id)}
                            className="p-1 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                            title="Eliminar Modelo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* General 3D Lab Settings Form */}
              <form onSubmit={handleSaveLab3D} className={`p-6 sm:p-8 rounded-2xl border ${bgCard} space-y-6`}>
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-emerald-400">
                  Títulos, Iluminación & Parámetros Generales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Título (Español)
                    </label>
                    <input
                      type="text"
                      value={lab3dData.titleEs || ''}
                      onChange={(e) => setLab3dData({ ...lab3dData, titleEs: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} text-xs font-bold`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Título (Inglés)
                    </label>
                    <input
                      type="text"
                      value={lab3dData.titleEn || ''}
                      onChange={(e) => setLab3dData({ ...lab3dData, titleEn: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} text-xs font-bold`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Subtítulo (Español)
                    </label>
                    <textarea
                      rows={3}
                      value={lab3dData.subtitleEs || ''}
                      onChange={(e) => setLab3dData({ ...lab3dData, subtitleEs: e.target.value })}
                      className={`w-full p-3 rounded-xl border ${bgInput} text-xs`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Subtítulo (Inglés)
                    </label>
                    <textarea
                      rows={3}
                      value={lab3dData.subtitleEn || ''}
                      onChange={(e) => setLab3dData({ ...lab3dData, subtitleEn: e.target.value })}
                      className={`w-full p-3 rounded-xl border ${bgInput} text-xs`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Color de Iluminación
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={lab3dData.lightingColor || '#76FF03'}
                        onChange={(e) => setLab3dData({ ...lab3dData, lightingColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {lab3dData.lightingColor || '#76FF03'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Auto-Rotación por Defecto
                    </label>
                    <button
                      type="button"
                      onClick={() => setLab3dData({ ...lab3dData, autoRotate: !lab3dData.autoRotate })}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                        lab3dData.autoRotate
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {lab3dData.autoRotate ? 'Activada' : 'Pausada'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Configuración 3D en MySQL</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TAB 8: DESTACADOS ================= */}
          {activeTab === 'featured' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Proyectos Destacados en Portada ({featuredProjects.length})
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Los proyectos con estrella aparecen con prioridad en la página principal y el slider del Hero.
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

          {/* ================= TAB 9: MEDIOS & CLIPS ================= */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Archivos Multimedia en Hostinger (/uploads/)
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Explorador de imágenes WebP/PNG, GIFs animados y clips MP4/WebM alojados en el servidor.
                </p>
              </div>

              {uploadedFiles.length === 0 ? (
                <div className={`p-10 rounded-2xl border ${bgCard} text-center space-y-3`}>
                  <ImageIcon className="w-10 h-10 text-slate-500 mx-auto" />
                  <h4 className="font-bold text-sm">No hay archivos subidos en /uploads/ todavía</h4>
                  <p className={`text-xs ${textMuted} max-w-md mx-auto`}>
                    Al editar un proyecto o diplomado y presionar "Subir a Hostinger", los archivos aparecerán listados aquí.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedFiles.map((file) => {
                    const isVideo =
                      file.type.startsWith('video/') ||
                      file.filename.endsWith('.mp4') ||
                      file.filename.endsWith('.webm');
                    const isGif = file.type.includes('gif') || file.filename.endsWith('.gif');
                    const isCopied = copiedUrl === file.url;

                    return (
                      <div
                        key={file.filename}
                        className={`p-4 rounded-2xl border ${bgCard} space-y-3 flex flex-col justify-between`}
                      >
                        <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 flex items-center justify-center">
                          {isVideo ? (
                            <div className="flex flex-col items-center gap-1 text-emerald-400">
                              <Video className="w-8 h-8" />
                              <span className="text-[10px] font-mono font-bold uppercase">
                                Video Clip
                              </span>
                            </div>
                          ) : (
                            <img
                              src={file.url}
                              alt={file.filename}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="space-y-2">
                          <span className="font-semibold text-xs truncate block font-mono">
                            {file.filename}
                          </span>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>{(file.size / 1024).toFixed(1)} KB</span>
                            <span>{isVideo ? 'MP4/WebM' : isGif ? 'GIF' : 'Imagen'}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(file.url)}
                            className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            {isCopied ? (
                              <CheckCheck className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{isCopied ? '¡URL Copiada!' : 'Copiar URL'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 10: RESPALDO JSON ================= */}
          {activeTab === 'backup' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Respaldo & Transferencia de Datos (JSON + MySQL)
                </h2>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Exporta una copia de seguridad con todos los proyectos, diplomados, experiencia y perfil.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${bgCard} space-y-4`}>
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold">Exportar Base de Datos</h3>
                  </div>
                  <p className={`text-xs ${textMuted} leading-relaxed`}>
                    Descarga un archivo JSON completo con todos los datos para guardarlo de forma segura.
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
                    Reinicia todos los contenidos del portafolio al estado predeterminado de fábrica en Hostinger MySQL.
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
                  Pega el contenido JSON de una copia de seguridad para sincronizarla en Hostinger MySQL:
                </p>
                <textarea
                  rows={5}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"projects": [...], "about": {...}, "experience": [...]}'
                  className={`w-full p-4 rounded-xl border text-xs font-mono outline-none ${bgInput}`}
                />
                <button
                  type="button"
                  onClick={handleImportJSON}
                  className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Importar y Guardar en MySQL
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Experience Edit Modal */}
      {isExpModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`relative w-full max-w-xl p-6 sm:p-8 rounded-2xl border ${bgCard} shadow-2xl space-y-4`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <h3 className="text-lg font-bold">
                {editingExp.role ? 'Editar Experiencia' : 'Nueva Experiencia'}
              </h3>
              <button
                type="button"
                onClick={() => setIsExpModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSingleExperience} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Cargo / Rol *
                </label>
                <input
                  type="text"
                  required
                  value={editingExp.role}
                  onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                  placeholder="Ej. Directora de Diseño Gráfico"
                  className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-semibold`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Empresa / Estudio *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    placeholder="Ej. Imprenta Bifronte"
                    className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Periodo *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.period}
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    placeholder="Ej. 2024 o 2020 - 2026"
                    className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Descripción General
                </label>
                <textarea
                  rows={3}
                  value={editingExp.description}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  placeholder="Resumen del puesto y responsabilidades..."
                  className={`w-full p-3 rounded-xl border ${bgInput} text-xs leading-relaxed`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default AdminDashboardPage;
