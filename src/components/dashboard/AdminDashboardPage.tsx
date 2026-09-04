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
  CheckCircle,
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
  Share2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  GraduationCap,
  Link as LinkIcon,
} from 'lucide-react';
import { Project, Discipline, ExperienceItem, SocialLink, DiplomadoItem } from '../../types';
import {
  getStoredProjects,
  getStoredDisciplines,
  saveProject,
  saveAllProjects,
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
  getStoredLab3D,
  saveStoredLab3D,
  Lab3DData,
  Lab3DModelItem,
  uploadMediaFile,
  getStoredSocials,
  saveStoredSocials,
} from '../../utils/portfolioStorage';
import { playClickSound, play8BitArcadeSound } from '../../utils/audio';
import { ProjectEditModal } from './ProjectEditModal';
import { DisciplineSliderEditor } from './DisciplineSliderEditor';
import { SocialIcon } from '../SocialIcon';

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
    | 'socials'
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

  // Socials State
  const [socials, setSocials] = useState<SocialLink[]>(getStoredSocials);
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialPreset, setNewSocialPreset] = useState<SocialLink['iconPreset']>('instagram');
  const [newSocialLogoUrl, setNewSocialLogoUrl] = useState('');
  const [isUploadingSocialLogo, setIsUploadingSocialLogo] = useState(false);
  const [uploadingLogoId, setUploadingLogoId] = useState<string | null>(null);
  const [isSavingSocials, setIsSavingSocials] = useState(false);

  // New Diplomado Form State
  const [newDipTitle, setNewDipTitle] = useState('');
  const [newDipDegree, setNewDipDegree] = useState('');
  const [newDipInstitution, setNewDipInstitution] = useState('');
  const [newDipSrc, setNewDipSrc] = useState('');
  const [newDipYear, setNewDipYear] = useState('2025');
  const [isUploadingDip, setIsUploadingDip] = useState(false);
  const [editingDip, setEditingDip] = useState<DiplomadoItem | null>(null);
  const [isDipModalOpen, setIsDipModalOpen] = useState(false);

  // 3D Model Form State
  const [newModelName, setNewModelName] = useState('');
  const [newModelUrl, setNewModelUrl] = useState('');
  const [newModelStats, setNewModelStats] = useState('');
  const [isUploadingModel, setIsUploadingModel] = useState(false);

  // New Experience Form State & Drag-and-Drop
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [draggedExpIndex, setDraggedExpIndex] = useState<number | null>(null);
  const [dragOverExpIndex, setDragOverExpIndex] = useState<number | null>(null);

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
      setSocials(getStoredSocials());
    };
    loadData();

    // Sincronización proactiva con Hostinger MySQL al abrir el dashboard
    syncFromRemoteServer().then(() => {
      loadData();
    });

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

  // ==================== HERO SLIDER HANDLERS ====================
  const [isSavingSlider, setIsSavingSlider] = useState(false);
  const [uploadingSliderProjId, setUploadingSliderProjId] = useState<string | null>(null);

  const handleMoveFeaturedProject = async (projectId: string, direction: 'up' | 'down') => {
    playClickSound();
    const sorted = [...featuredProjects].sort(
      (a, b) => (a.sliderOrder ?? 999) - (b.sliderOrder ?? 999)
    );
    const index = sorted.findIndex((p) => p.id === projectId);
    if (index < 0) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    // Swap items
    const [moved] = sorted.splice(index, 1);
    sorted.splice(targetIndex, 0, moved);

    // Reassign sliderOrder
    const updatedMap = new Map<string, number>();
    sorted.forEach((p, idx) => {
      updatedMap.set(p.id, idx + 1);
    });

    const updatedProjects = projects.map((p) => {
      if (updatedMap.has(p.id)) {
        return { ...p, sliderOrder: updatedMap.get(p.id) };
      }
      return p;
    });

    setProjects(updatedProjects);
    await saveAllProjects(updatedProjects);
    showNotification('¡Orden de transición del slider del Hero actualizado!');
  };

  const handleSetProjectSliderImage = async (projectId: string, imageUrl: string) => {
    playClickSound();
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, sliderImage: imageUrl } : p
    );
    setProjects(updated);
    await saveAllProjects(updated);
    showNotification('¡Imagen visible en el slider actualizada!');
  };

  const handleSetProjectSliderTitle = async (projectId: string, title: string) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, sliderTitle: title } : p
    );
    setProjects(updated);
    await saveAllProjects(updated);
  };

  const handleAddProjectToHeroSlider = async (projectId: string) => {
    playClickSound();
    const nextOrder = featuredProjects.length + 1;
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, featured: true, sliderOrder: nextOrder } : p
    );
    setProjects(updated);
    await saveAllProjects(updated);
    showNotification('¡Proyecto añadido al slider del Hero!');
  };

  const handleRemoveProjectFromHeroSlider = async (projectId: string) => {
    playClickSound();
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, featured: false, sliderOrder: 0 } : p
    );
    setProjects(updated);
    await saveAllProjects(updated);
    showNotification('¡Proyecto retirado del slider!');
  };

  const handleUploadSliderCustomImage = async (projectId: string, file: File) => {
    setUploadingSliderProjId(projectId);
    const res = await uploadMediaFile(file);
    setUploadingSliderProjId(null);
    if (res.success && res.url) {
      handleSetProjectSliderImage(projectId, res.url);
    } else {
      alert(res.error || 'Error al subir la imagen.');
    }
  };

  const handleSaveAllHeroSlider = async () => {
    setIsSavingSlider(true);
    playClickSound();
    await saveAllProjects(projects);
    setIsSavingSlider(false);
    showNotification('¡Configuración del slider del Hero guardada en Hostinger MySQL!');
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

  // Experience Drag & Drop Handlers
  const handleExpDragStart = (e: React.DragEvent, index: number) => {
    setDraggedExpIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleExpDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverExpIndex !== index) {
      setDragOverExpIndex(index);
    }
  };

  const handleExpDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedExpIndex === null || draggedExpIndex === dropIndex) {
      setDraggedExpIndex(null);
      setDragOverExpIndex(null);
      return;
    }

    const updated = [...experiences];
    const [movedItem] = updated.splice(draggedExpIndex, 1);
    updated.splice(dropIndex, 0, movedItem);

    setDraggedExpIndex(null);
    setDragOverExpIndex(null);
    handleSaveExperienceList(updated);
  };

  const handleExpDragEnd = () => {
    setDraggedExpIndex(null);
    setDragOverExpIndex(null);
  };

  const handleMoveExperience = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    playClickSound();
    const updated = [...experiences];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    handleSaveExperienceList(updated);
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
      degree: newDipDegree.trim() || 'Certificado Oficial',
      institution: newDipInstitution.trim() || '',
      src: newDipSrc.trim(),
      year: newDipYear.trim() || '2025',
      visible: true,
    };
    const updated = [newDip, ...diplomados];
    setDiplomados(updated);
    await saveStoredDiplomados(updated);
    setNewDipTitle('');
    setNewDipDegree('');
    setNewDipInstitution('');
    setNewDipSrc('');
    showNotification('¡Diplomado añadido y guardado en Hostinger MySQL!');
  };

  const handleSaveEditingDiplomado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDip) return;
    const index = diplomados.findIndex((d) => d.id === editingDip.id);
    let updated: DiplomadoItem[];
    if (index >= 0) {
      updated = [...diplomados];
      updated[index] = editingDip;
    } else {
      updated = [editingDip, ...diplomados];
    }
    setDiplomados(updated);
    await saveStoredDiplomados(updated);
    setIsDipModalOpen(false);
    setEditingDip(null);
    showNotification('¡Diplomado actualizado y guardado en Hostinger MySQL!');
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

  // Socials Handlers
  const handleNewSocialLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingSocialLogo(true);
    const res = await uploadMediaFile(file);
    setIsUploadingSocialLogo(false);
    if (res.success && res.url) {
      setNewSocialLogoUrl(res.url);
      showNotification('¡Logotipo subido exitosamente a Hostinger!');
    } else {
      alert(res.error || 'Error al subir el logotipo.');
    }
  };

  const handleItemSocialLogoUpload = async (id: string, file: File) => {
    setUploadingLogoId(id);
    const res = await uploadMediaFile(file);
    setUploadingLogoId(null);
    if (res.success && res.url) {
      const updated = socials.map((s) => (s.id === id ? { ...s, logoUrl: res.url } : s));
      setSocials(updated);
      await saveStoredSocials(updated);
      showNotification('¡Logotipo actualizado y guardado en Hostinger!');
    } else {
      alert(res.error || 'Error al subir el logotipo.');
    }
  };

  const handleRemoveItemLogo = async (id: string) => {
    const updated = socials.map((s) => (s.id === id ? { ...s, logoUrl: '' } : s));
    setSocials(updated);
    await saveStoredSocials(updated);
    showNotification('¡Logotipo removido (usando icono vectorial)!');
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialLabel.trim() || !newSocialUrl.trim()) {
      alert('Por favor ingresa un nombre y una URL válida para la red social.');
      return;
    }
    const newId = `soc-${Date.now()}`;
    const newLink: SocialLink = {
      id: newId,
      label: newSocialLabel.trim(),
      href: newSocialUrl.trim(),
      logoUrl: newSocialLogoUrl.trim() || undefined,
      iconPreset: newSocialPreset || 'globe',
      visible: true,
      order: socials.length + 1,
    };
    const updated = [...socials, newLink];
    setSocials(updated);
    await saveStoredSocials(updated);
    setNewSocialLabel('');
    setNewSocialUrl('');
    setNewSocialLogoUrl('');
    showNotification('¡Red social agregada y sincronizada en Hostinger MySQL!');
  };

  const handleUpdateSocialField = (id: string, field: keyof SocialLink, value: any) => {
    setSocials((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleToggleSocialVisibility = async (id: string) => {
    const updated = socials.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    setSocials(updated);
    await saveStoredSocials(updated);
    showNotification('¡Visibilidad de red social actualizada!');
  };

  const handleMoveSocial = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socials.length) return;
    const reordered = [...socials];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    const withOrder = reordered.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSocials(withOrder);
    await saveStoredSocials(withOrder);
    showNotification('¡Orden de redes sociales actualizado!');
  };

  const handleDeleteSocial = async (id: string, label: string) => {
    if (window.confirm(`¿Deseas eliminar "${label}" de las redes sociales?`)) {
      const updated = socials.filter((s) => s.id !== id);
      setSocials(updated);
      await saveStoredSocials(updated);
      showNotification('¡Red social eliminada!');
    }
  };

  const handleSaveAllSocials = async () => {
    setIsSavingSocials(true);
    playClickSound();
    await saveStoredSocials(socials);
    setIsSavingSocials(false);
    showNotification('¡Todas las redes sociales guardadas en Hostinger MySQL!');
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
                setActiveTab('socials');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'socials'
                  ? darkMode
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white text-[#007A4D] font-bold shadow-sm'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Redes Sociales & Logos</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20 font-bold">
                {socials.length}
              </span>
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
              <DisciplineSliderEditor
                disciplines={disciplines}
                projects={projects}
                darkMode={darkMode}
              />
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

              {/* Experience Cards with Native Drag & Drop */}
              <div className="space-y-4">
                {experiences.map((item, idx) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleExpDragStart(e, idx)}
                    onDragOver={(e) => handleExpDragOver(e, idx)}
                    onDragLeave={() => setDragOverExpIndex(null)}
                    onDrop={(e) => handleExpDrop(e, idx)}
                    onDragEnd={handleExpDragEnd}
                    className={`p-5 rounded-2xl border transition-all duration-200 ${bgCard} flex flex-col md:flex-row items-start justify-between gap-4 ${
                      draggedExpIndex === idx ? 'opacity-40 scale-[0.98] border-dashed border-emerald-500' : ''
                    } ${
                      dragOverExpIndex === idx && draggedExpIndex !== idx ? 'border-emerald-400 bg-emerald-500/10 ring-2 ring-emerald-500/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 w-full">
                      {/* Drag Handle & Reorder buttons */}
                      <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                        <div
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 cursor-grab active:cursor-grabbing transition-colors"
                          title="Arrastra este módulo para cambiar su posición en el portafolio"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleMoveExperience(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-emerald-400 disabled:opacity-20 disabled:hover:text-slate-400 rounded cursor-pointer disabled:cursor-not-allowed transition-colors"
                            title="Subir módulo"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveExperience(idx, 'down')}
                            disabled={idx === experiences.length - 1}
                            className="p-1 text-slate-400 hover:text-emerald-400 disabled:opacity-20 disabled:hover:text-slate-400 rounded cursor-pointer disabled:cursor-not-allowed transition-colors"
                            title="Bajar módulo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            #{idx + 1}
                          </span>
                          <h4 className="text-base font-bold text-white truncate">{item.role}</h4>
                          {item.isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Actual
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-mono text-slate-400">
                          <span className="text-emerald-400 font-semibold">{item.company}</span>
                          {item.period ? ` • ${item.period}` : ''}
                          {item.location ? ` • ${item.location}` : ''}
                        </p>

                        {item.description && (
                          <p className={`text-xs ${textMuted} leading-relaxed max-w-2xl`}>
                            {item.description}
                          </p>
                        )}

                        {item.responsibilities && item.responsibilities.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[10px] font-mono uppercase text-emerald-400/80 font-bold block mb-1">
                              Responsabilidades ({item.responsibilities.length}):
                            </span>
                            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                              {item.responsibilities.slice(0, 3).map((r, rI) => (
                                <li key={rI} className="truncate">{r}</li>
                              ))}
                              {item.responsibilities.length > 3 && (
                                <li className="text-[10px] text-slate-500 list-none">+{item.responsibilities.length - 3} más...</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {item.toolsUsed && item.toolsUsed.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            {item.toolsUsed.map((tool, tI) => (
                              <span
                                key={tI}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/90 text-slate-300 border border-slate-700/60"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExp(item);
                          setIsExpModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(item.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                        title="Eliminar experiencia"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Nombre del Diplomado / Curso *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDipTitle}
                      onChange={(e) => setNewDipTitle(e.target.value)}
                      placeholder="Ej. Diplomado Adobe After Effects"
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${bgInput} text-xs font-semibold`}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Título que se Otorga *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDipDegree}
                      onChange={(e) => setNewDipDegree(e.target.value)}
                      placeholder="Ej. Especialista en Motion Graphics"
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${bgInput} text-xs font-semibold text-emerald-400`}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Institución / Entidad Emisora
                    </label>
                    <input
                      type="text"
                      value={newDipInstitution}
                      onChange={(e) => setNewDipInstitution(e.target.value)}
                      placeholder="Ej. CETEC-ES / Domestika"
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${bgInput} text-xs`}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Año
                    </label>
                    <input
                      type="text"
                      value={newDipYear}
                      onChange={(e) => setNewDipYear(e.target.value)}
                      placeholder="Ej. 2023 o 2025"
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${bgInput} text-xs font-mono`}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      required
                      value={newDipSrc}
                      onChange={(e) => setNewDipSrc(e.target.value)}
                      placeholder="URL de la imagen del diploma (/uploads/... o /images/...)"
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${bgInput} text-xs font-mono`}
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700 transition-colors">
                      {isUploadingDip ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
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
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Diplomado</span>
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

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white line-clamp-1" title={dip.title}>
                        {dip.title}
                      </h4>
                      <p className="text-[11px] font-mono text-emerald-400 font-semibold truncate" title={dip.degree}>
                        {dip.degree || 'Certificado Oficial'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {dip.institution ? `${dip.institution} • ` : ''}{dip.year || '2025'}
                      </p>
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

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDip(dip);
                            setIsDipModalOpen(true);
                          }}
                          className="p-1.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded cursor-pointer transition-colors"
                          title="Editar diplomado"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDiplomado(dip.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

          {/* ================= TAB: REDES SOCIALES & LOGOS ================= */}
          {activeTab === 'socials' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight flex items-center gap-2.5">
                    <Share2 className="w-5 h-5 text-emerald-400" />
                    <span>Redes Sociales & Enlaces con Logo ({socials.length})</span>
                  </h2>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Administra tus perfiles sociales y plataformas con su logotipo oficial o icono vectorial. Aparecen en el pie de página del portafolio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAllSocials}
                  disabled={isSavingSocials}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30 self-start sm:self-auto transition-all"
                >
                  {isSavingSocials ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Guardar Todo en MySQL</span>
                </button>
              </div>

              {/* Card 1: Formulario para añadir nueva red social */}
              <form
                onSubmit={handleAddSocial}
                className={`p-6 sm:p-8 rounded-2xl border ${bgCard} space-y-6 shadow-sm`}
              >
                <div className="flex items-center gap-2 pb-3 border-b border-slate-700/50">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Añadir Nueva Red Social o Plataforma
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Nombre / Etiqueta */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Nombre / Etiqueta <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newSocialLabel}
                      onChange={(e) => setNewSocialLabel(e.target.value)}
                      placeholder="Ej. Instagram, ArtStation, YouTube, Vimeo..."
                      className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} text-xs font-medium`}
                      required
                    />
                  </div>

                  {/* URL del Enlace */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      URL del Perfil <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="url"
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      placeholder="https://..."
                      className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} text-xs font-mono`}
                      required
                    />
                  </div>

                  {/* Preset Vectorial */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Icono Vectorial Predeterminado
                    </label>
                    <select
                      value={newSocialPreset}
                      onChange={(e) => setNewSocialPreset(e.target.value as any)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${bgInput} text-xs cursor-pointer`}
                    >
                      <option value="instagram">Instagram</option>
                      <option value="behance">Behance</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="dribbble">Dribbble</option>
                      <option value="artstation">ArtStation</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="twitter">X / Twitter</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="github">GitHub</option>
                      <option value="globe">Sitio Web / Enlace Global</option>
                    </select>
                  </div>
                </div>

                {/* Subir Logo Personalizado Opcional */}
                <div className="p-4 rounded-xl bg-black/20 border border-slate-700/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        Logotipo Personalizado (Opcional)
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Puedes subir un logo en SVG, PNG o WebP a Hostinger, o dejarlo vacío para usar el icono vectorial.
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {newSocialLogoUrl && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                          <img
                            src={newSocialLogoUrl}
                            alt="Logo preview"
                            className="w-5 h-5 object-contain"
                          />
                          <span className="truncate max-w-[120px]">Logo cargado</span>
                          <button
                            type="button"
                            onClick={() => setNewSocialLogoUrl('')}
                            className="text-rose-400 hover:text-rose-300 ml-1 cursor-pointer"
                            title="Quitar logo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isUploadingSocialLogo ? 'Subiendo...' : 'Subir Logotipo Imagen/SVG'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          disabled={isUploadingSocialLogo}
                          onChange={handleNewSocialLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Vista previa y botón agregar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono">Vista Previa:</span>
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-[#76FF03]/30 text-xs font-mono font-bold text-[#76FF03]">
                      <SocialIcon
                        preset={newSocialPreset}
                        logoUrl={newSocialLogoUrl || undefined}
                        className="w-4 h-4 text-[#76FF03]"
                      />
                      <span>{newSocialLabel || 'NOMBRE_RED'}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all self-end sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Red Social</span>
                  </button>
                </div>
              </form>

              {/* Card 2: Lista de Redes Sociales Actuales */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Redes Sociales Activas en el Portafolio ({socials.length})
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Usa las flechas para ordenar cómo aparecen en el pie de página
                  </span>
                </div>

                {socials.length === 0 ? (
                  <div className={`p-8 text-center rounded-2xl border ${bgCard} space-y-2`}>
                    <Share2 className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">No hay redes sociales configuradas</p>
                    <p className="text-xs text-slate-500">Agrega perfiles arriba para que aparezcan en el sitio.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {socials.map((social, index) => {
                      const isUploadingThis = uploadingLogoId === social.id;
                      return (
                        <div
                          key={social.id || index}
                          className={`p-4 sm:p-5 rounded-2xl border ${bgCard} flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                            social.visible === false ? 'opacity-50' : ''
                          }`}
                        >
                          {/* Columna Izquierda: Icono / Logo y datos principales */}
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            {/* Visual Avatar / Icon Box */}
                            <div className="w-12 h-12 rounded-xl bg-black/40 border border-slate-700/80 flex items-center justify-center flex-shrink-0 p-2 relative group">
                              <SocialIcon
                                preset={social.iconPreset || social.label.toLowerCase()}
                                logoUrl={social.logoUrl}
                                className="w-6 h-6 text-emerald-400 object-contain"
                              />
                              {social.logoUrl && (
                                <span
                                  className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"
                                  title="Logotipo personalizado activo"
                                />
                              )}
                            </div>

                            {/* Inputs de Edición Rápida */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-w-0">
                              <div>
                                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                                  Nombre / Etiqueta
                                </label>
                                <input
                                  type="text"
                                  value={social.label}
                                  onChange={(e) =>
                                    handleUpdateSocialField(social.id, 'label', e.target.value)
                                  }
                                  className={`w-full px-3 py-1.5 rounded-lg border ${bgInput} text-xs font-semibold`}
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                                  Enlace URL
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={social.href}
                                    onChange={(e) =>
                                      handleUpdateSocialField(social.id, 'href', e.target.value)
                                    }
                                    className={`w-full px-3 py-1.5 rounded-lg border ${bgInput} text-xs font-mono truncate`}
                                  />
                                  <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                                    title="Probar enlace"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Columna Centro: Configuración de Logo / Preset */}
                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-700/50">
                            {/* Selector de Preset */}
                            <div className="w-32">
                              <select
                                value={social.iconPreset || 'globe'}
                                onChange={(e) =>
                                  handleUpdateSocialField(social.id, 'iconPreset', e.target.value)
                                }
                                className={`w-full px-2.5 py-1.5 rounded-lg border ${bgInput} text-[11px] cursor-pointer`}
                                title="Icono vectorial de respaldo"
                              >
                                <option value="instagram">Instagram</option>
                                <option value="behance">Behance</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="dribbble">Dribbble</option>
                                <option value="artstation">ArtStation</option>
                                <option value="youtube">YouTube</option>
                                <option value="tiktok">TikTok</option>
                                <option value="twitter">X / Twitter</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="github">GitHub</option>
                                <option value="globe">Sitio Web</option>
                              </select>
                            </div>

                            {/* Subir o Quitar Logo */}
                            {social.logoUrl ? (
                              <div className="flex items-center gap-1">
                                <label className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-emerald-400 text-[11px] font-semibold cursor-pointer transition-colors">
                                  <span>{isUploadingThis ? 'Subiendo...' : 'Cambiar Logo'}</span>
                                  <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                    disabled={isUploadingThis}
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleItemSocialLogoUpload(social.id, f);
                                    }}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItemLogo(social.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer"
                                  title="Quitar logotipo personalizado y usar icono vectorial"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white text-[11px] font-medium cursor-pointer transition-colors">
                                <Upload className="w-3 h-3 text-emerald-400" />
                                <span>{isUploadingThis ? 'Subiendo...' : 'Subir Logo'}</span>
                                <input
                                  type="file"
                                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                  disabled={isUploadingThis}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleItemSocialLogoUpload(social.id, f);
                                  }}
                                  className="hidden"
                                />
                              </label>
                            )}

                            {/* Columna Derecha: Controles de orden, visibilidad y eliminación */}
                            <div className="flex items-center gap-1 ml-auto lg:ml-0">
                              {/* Reorder Up */}
                              <button
                                type="button"
                                onClick={() => handleMoveSocial(index, 'up')}
                                disabled={index === 0}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white cursor-pointer"
                                title="Subir posición"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>

                              {/* Reorder Down */}
                              <button
                                type="button"
                                onClick={() => handleMoveSocial(index, 'down')}
                                disabled={index === socials.length - 1}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white cursor-pointer"
                                title="Bajar posición"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Visibility */}
                              <button
                                type="button"
                                onClick={() => handleToggleSocialVisibility(social.id)}
                                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                  social.visible !== false
                                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                                }`}
                                title={social.visible !== false ? 'Visible en el sitio' : 'Oculto en el sitio'}
                              >
                                {social.visible !== false ? (
                                  <Eye className="w-3.5 h-3.5" />
                                ) : (
                                  <EyeOff className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteSocial(social.id, social.label)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer transition-colors"
                                title="Eliminar red social"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 8: SLIDER DEL HERO & DESTACADOS ================= */}
          {activeTab === 'featured' && (() => {
            const sortedHeroProjects = [...featuredProjects].sort(
              (a, b) => (a.sliderOrder ?? 999) - (b.sliderOrder ?? 999)
            );
            const nonFeaturedProjects = projects.filter((p) => !p.featured);

            return (
              <div className="space-y-8">
                {/* Header & Master Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-700/60 bg-slate-900/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        Control del Slider del Hero & Proyectos Destacados
                      </h2>
                    </div>
                    <p className={`text-xs ${textMuted} mt-1 max-w-2xl`}>
                      Configura con precisión qué proyectos se proyectan en el slider superior de la portada, el orden de transición (#1, #2, #3...), qué imagen o render específico mostrar y títulos personalizados.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveAllHeroSlider}
                    disabled={isSavingSlider}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-500/25 cursor-pointer whitespace-nowrap"
                  >
                    {isSavingSlider ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span>{isSavingSlider ? 'Guardando...' : 'Guardar Slider en Hostinger MySQL'}</span>
                  </button>
                </div>

                {/* Section 1: Active Slides in the Hero Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Diapositivas Activas en el Slider del Hero ({sortedHeroProjects.length}):</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Usa [↑] [↓] para alterar la secuencia de aparición en la portada
                    </span>
                  </div>

                  {sortedHeroProjects.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
                      <Star className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-sm font-semibold text-slate-300">No hay proyectos destacados en el slider</p>
                      <p className="text-xs text-slate-500">Selecciona proyectos de la lista inferior para agregarlos al slider principal.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {sortedHeroProjects.map((proj, idx) => {
                        const activeSliderImg = (proj.sliderImage && proj.sliderImage.trim() !== '') ? proj.sliderImage : proj.image;
                        const activeSliderTitle = (proj.sliderTitle && proj.sliderTitle.trim() !== '') ? proj.sliderTitle : proj.title;
                        const availableRenders = [
                          { url: proj.image, label: 'Portada Principal' },
                          ...(proj.galleryImages || []).map((img, i) => ({
                            url: img,
                            label: `Render Detalle #${i + 1}`,
                          })),
                        ];

                        return (
                          <div
                            key={proj.id}
                            className={`rounded-2xl border ${bgCard} p-5 space-y-4 border-emerald-500/40 shadow-md relative group`}
                          >
                            {/* Slide Header: Order Badge & Reorder Controls */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                              <div className="flex items-center gap-2.5">
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-black">
                                  #{idx + 1} EN SLIDER
                                </span>
                                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                                  {proj.category}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleMoveFeaturedProject(proj.id, 'up')}
                                  disabled={idx === 0}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 hover:text-white transition-colors cursor-pointer"
                                  title="Avanzar en el orden del slider"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveFeaturedProject(proj.id, 'down')}
                                  disabled={idx === sortedHeroProjects.length - 1}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 hover:text-white transition-colors cursor-pointer"
                                  title="Retroceder en el orden del slider"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProjectFromHeroSlider(proj.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer ml-1"
                                  title="Quitar de Proyectos Destacados del Slider"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Active Preview Box */}
                            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 flex items-center justify-center">
                              <img
                                src={activeSliderImg}
                                alt={activeSliderTitle}
                                className="w-full h-full object-contain p-2"
                              />
                              <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                                <span className="text-xs font-bold text-white truncate max-w-[70%]">
                                  {activeSliderTitle}
                                </span>
                                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                                  Vista en Slider
                                </span>
                              </div>
                            </div>

                            {/* Custom Slider Title Input */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-slate-400 block font-semibold">
                                Título que se mostrará en el Slider (Opcional):
                              </label>
                              <input
                                type="text"
                                defaultValue={proj.sliderTitle || ''}
                                placeholder={proj.title}
                                onBlur={(e) => handleSetProjectSliderTitle(proj.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSetProjectSliderTitle(proj.id, e.currentTarget.value);
                                    e.currentTarget.blur();
                                  }
                                }}
                                className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-semibold outline-none`}
                              />
                            </div>

                            {/* Selectable Renders for this Project */}
                            <div className="space-y-2 pt-2 border-t border-slate-700/50">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-slate-300">
                                  Elige qué imagen proyectar en el slider:
                                </span>
                                <label className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-1">
                                  <Upload className="w-3 h-3" />
                                  <span>{uploadingSliderProjId === proj.id ? 'Subiendo...' : '+ Subir otra'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingSliderProjId === proj.id}
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleUploadSliderCustomImage(proj.id, f);
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>

                              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                {availableRenders.map((renderItem, rIdx) => {
                                  const isSelected = activeSliderImg === renderItem.url;
                                  return (
                                    <button
                                      key={rIdx}
                                      type="button"
                                      onClick={() => handleSetProjectSliderImage(proj.id, renderItem.url)}
                                      className={`relative aspect-square rounded-lg overflow-hidden border p-1 transition-all cursor-pointer ${
                                        isSelected
                                          ? 'border-[#76FF03] ring-2 ring-[#76FF03]/40 bg-emerald-950/40 shadow-sm'
                                          : 'border-slate-700 bg-slate-900/80 hover:border-slate-500 opacity-70 hover:opacity-100'
                                      }`}
                                      title={renderItem.label}
                                    >
                                      <img
                                        src={renderItem.url}
                                        alt={renderItem.label}
                                        className="w-full h-full object-contain"
                                      />
                                      <span className="absolute bottom-0.5 inset-x-0 text-[8px] font-mono text-center bg-black/85 text-slate-200 truncate px-0.5">
                                        {rIdx === 0 ? 'Cover' : `#${rIdx}`}
                                      </span>
                                      {isSelected && (
                                        <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#76FF03]" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Bottom Row Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                              <button
                                type="button"
                                onClick={() => handleRemoveProjectFromHeroSlider(proj.id)}
                                className="text-xs text-rose-400 hover:text-rose-300 font-mono cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Quitar de Portada</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleEditProject(proj)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Editar Caso de Estudio</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Section 2: Uploaded Projects available to add to the Slider */}
                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        <FolderKanban className="w-4 h-4 text-emerald-400" />
                        <span>Proyectos Ya Subidos Disponibles ({nonFeaturedProjects.length})</span>
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Haz clic en "+ Añadir al Slider" para destacar cualquier proyecto en la portada.
                      </p>
                    </div>
                  </div>

                  {nonFeaturedProjects.length === 0 ? (
                    <div className="p-8 text-center rounded-xl border border-slate-800 bg-slate-900/20 text-xs font-mono text-slate-500">
                      Todos los proyectos están actualmente destacados en el slider del Hero.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {nonFeaturedProjects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
                        >
                          <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                            <img
                              src={proj.image}
                              alt={proj.title}
                              className="w-full h-full object-contain p-2"
                            />
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-slate-300 font-semibold uppercase">
                              {proj.category}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-white truncate mb-0.5">
                              {proj.title}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-mono block truncate">
                              {proj.client || 'Personal'} • {proj.year}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddProjectToHeroSlider(proj.id)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Añadir al Slider</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

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
                  placeholder="Ej. Directora del Área de Diseño Gráfico"
                  className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-semibold`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Empresa / Estudio / Organización *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    placeholder="Ej. Imprenta Bifronte"
                    className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-semibold`}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={editingExp.location || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    placeholder="Ej. Sonsonate, El Salvador (Remoto / Global)"
                    className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs`}
                  />
                </div>

                <div className="pt-4 sm:pt-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 hover:border-emerald-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={!!editingExp.isCurrent}
                      onChange={(e) => setEditingExp({ ...editingExp, isCurrent: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
                    />
                    <span className="text-xs font-medium text-slate-200">
                      ¿Es tu puesto / trabajo actual?
                    </span>
                  </label>
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
                  placeholder="Resumen de las actividades y contribuciones en este puesto..."
                  className={`w-full p-3 rounded-xl border ${bgInput} text-xs leading-relaxed`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Responsabilidades y Logros Clave (Una por línea)
                </label>
                <textarea
                  rows={4}
                  value={(editingExp.responsibilities || []).join('\n')}
                  onChange={(e) =>
                    setEditingExp({
                      ...editingExp,
                      responsibilities: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0),
                    })
                  }
                  placeholder="• Dirección, gestión y ejecución integral del área gráfica&#10;• Planificación de metodologías de aprendizaje y contenido&#10;• Supervisión de procesos de preprensa técnica y branding"
                  className={`w-full p-3 rounded-xl border ${bgInput} text-xs leading-relaxed font-sans`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Herramientas / Software Utilizado (Separadas por comas)
                </label>
                <input
                  type="text"
                  value={(editingExp.toolsUsed || []).join(', ')}
                  onChange={(e) =>
                    setEditingExp({
                      ...editingExp,
                      toolsUsed: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0),
                    })
                  }
                  placeholder="Adobe Illustrator, Adobe Photoshop, Blender, ZBrush, After Effects..."
                  className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-mono`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase transition-colors shadow-sm"
                >
                  Guardar Experiencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diplomado Edit Modal */}
      {isDipModalOpen && editingDip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`relative w-full max-w-lg p-6 sm:p-8 rounded-2xl border ${bgCard} shadow-2xl space-y-4`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <h3 className="text-lg font-bold">Editar Diplomado / Certificación</h3>
              <button
                type="button"
                onClick={() => {
                  setIsDipModalOpen(false);
                  setEditingDip(null);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditingDiplomado} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Nombre del Diplomado / Curso *
                </label>
                <input
                  type="text"
                  required
                  value={editingDip.title}
                  onChange={(e) => setEditingDip({ ...editingDip, title: e.target.value })}
                  placeholder="Ej. Diplomado Adobe After Effects"
                  className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-semibold`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Título que se Otorga *
                </label>
                <input
                  type="text"
                  required
                  value={editingDip.degree || ''}
                  onChange={(e) => setEditingDip({ ...editingDip, degree: e.target.value })}
                  placeholder="Ej. Especialidad en Motion Graphics & Animación"
                  className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-semibold text-emerald-400`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Institución Emisora
                  </label>
                  <input
                    type="text"
                    value={editingDip.institution || ''}
                    onChange={(e) => setEditingDip({ ...editingDip, institution: e.target.value })}
                    placeholder="Ej. CETEC-ES / Domestika"
                    className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Año
                  </label>
                  <input
                    type="text"
                    value={editingDip.year || ''}
                    onChange={(e) => setEditingDip({ ...editingDip, year: e.target.value })}
                    placeholder="Ej. 2023 o 2025"
                    className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  URL de Imagen del Certificado *
                </label>
                <input
                  type="text"
                  required
                  value={editingDip.src}
                  onChange={(e) => setEditingDip({ ...editingDip, src: e.target.value })}
                  placeholder="/uploads/... o /images/..."
                  className={`w-full px-3 py-2 rounded-xl border ${bgInput} text-xs font-mono`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsDipModalOpen(false);
                    setEditingDip(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase shadow-sm"
                >
                  Guardar Cambios
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
