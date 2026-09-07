import { Project, ExperienceItem, SkillCategory, StatItem, Testimonial } from '../types';

export const projectsData: Project[] = [
  {
    id: 'demo-modelado-3d',
    title: 'Retro Mini Classic 3D Render',
    category: '3D MODELING',
    disciplineId: 'modelado-3d',
    year: '2026',
    client: 'Studio Kinetic Demo',
    shortDesc: 'Modelado hard-surface de alta fidelidad, shaders procedurales de pintura automotriz e iluminación fotográfica en estudio.',
    fullDesc: 'Proyecto de prueba representativo para la sección de Modelado 3D. Explora curvatura topológica, materiales dieléctricos, iluminación HDR y renderizado cinematográfico en Blender y Octane.',
    image: '/images/retro-mini.jpg',
    galleryImages: [
      '/images/retro-mini.jpg',
      '/images/orbit-stand.webp'
    ],
    tags: ['3D Modeling', 'Blender', 'Octane', 'Substance 3D', 'Automotive'],
    modelType: 'car',
    featured: true,
    visibleInCatalog: true,
    bentoSpan: 'md:col-span-6 md:row-span-1',
    deliverables: ['High-poly 3D Asset', 'PBR 4K Texture Maps', '360 Turntable Video', 'Print Resolution 8K Renders'],
    metrics: [
      { label: 'Muestras de Render', value: '4,096 SPP' },
      { label: 'Polígonos Sub-D', value: '280K Tris' },
      { label: 'Shaders PBR', value: '18 Materiales' }
    ],
    colorPalette: ['#050B05', '#76FF03', '#1A301A', '#A3E635']
  },
  {
    id: 'demo-branding',
    title: 'Identidad Visual & Sistema de Marca',
    category: 'BRANDING',
    disciplineId: 'branding',
    year: '2026',
    client: 'Studio Kinetic Demo',
    shortDesc: 'Diseño integral de identidad corporativa, logotipo responsivo, manual de marca, tipografía y piezas comerciales.',
    fullDesc: 'Proyecto de prueba representativo para la sección de Branding. Demuestra la creación de universos de marca coherentes, arquitectura visual, paletas cromáticas y aplicaciones gráficas tanto digitales como para impresión.',
    image: '/images/orbit-stand-diana.webp',
    galleryImages: [
      '/images/orbit-stand-diana.webp',
      '/images/brands/holy-nation.webp'
    ],
    logo: '/images/brands/holy-nation.webp',
    tags: ['Branding', 'Identidad Visual', 'Logotipos', 'Tipografía', 'Manual de Marca'],
    modelType: 'poly',
    featured: true,
    visibleInCatalog: true,
    bentoSpan: 'md:col-span-6 md:row-span-1',
    deliverables: ['Manual de Identidad', 'Kit Vectorial SVG/AI', 'Tipografía de Marca', 'Artes Pre-Prensa'],
    metrics: [
      { label: 'Fidelidad Cromática', value: '100% Pantones' },
      { label: 'Módulos de Marca', value: '30+ Activos' }
    ],
    colorPalette: ['#050B05', '#38B000', '#76FF03', '#FFFFFF']
  },
  {
    id: 'demo-edicion-video',
    title: 'Kinetic Motion Typography & Reel Audiovisual',
    category: 'MOTION',
    disciplineId: 'edicion-video',
    year: '2026',
    client: 'Studio Kinetic Demo',
    shortDesc: 'Edición audiovisual dinámica, animación tipográfica con distorsión cromática, ritmo sonoro y postproducción de video.',
    fullDesc: 'Proyecto de prueba representativo para la sección de Edición de Video. Catalogada exclusivamente para video y su miniatura representativa, integrando After Effects, Premiere Pro, ritmo visual y corrección de color profesional.',
    image: '/images/hero-hands.jpg',
    galleryImages: [], // Regla estricta: NO galería de imágenes en Edición de Video
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['Edición de Video', 'After Effects', 'Motion Graphics', 'Sound Sync', 'Color Grading'],
    modelType: 'poly',
    featured: false,
    visibleInCatalog: true,
    bentoSpan: 'md:col-span-6 md:row-span-1',
    deliverables: ['Video Master 4K 60FPS', 'Formatos para Redes 9:16', 'Diseño de Sonido'],
    metrics: [
      { label: 'Framerate', value: '60 FPS' },
      { label: 'Capas de Composición', value: '32 Layers' }
    ],
    colorPalette: ['#38B000', '#76FF03', '#050B05', '#FFFFFF']
  },
  {
    id: 'demo-social-media',
    title: 'Estrategia de Contenido & Feed Visual Digital',
    category: 'DIGITAL ART',
    disciplineId: 'social-media',
    year: '2026',
    client: 'Studio Kinetic Demo',
    shortDesc: 'Diseño de contenido estratégico para redes sociales, carruseles de alto valor, creatividades promocionales y feed estético.',
    fullDesc: 'Proyecto de prueba representativo para la sección de Social Media Designer. Creación de piezas gráficas optimizadas para retención y engagement en plataformas digitales con dirección de arte distintiva.',
    image: '/images/orbit-tablet.webp',
    galleryImages: [
      '/images/orbit-tablet.webp'
    ],
    tags: ['Social Media', 'Contenido Digital', 'Creatividades', 'Engagement', 'Instagram'],
    modelType: 'poly',
    featured: false,
    visibleInCatalog: true,
    bentoSpan: 'md:col-span-6 md:row-span-1',
    deliverables: ['Carruseles de Alto Valor', 'Plantillas Editables', 'Feed Cohesivo', 'Stories Dinámicas'],
    metrics: [
      { label: 'Formato Adaptado', value: '4:5 / 9:16 / 1:1' },
      { label: 'Estrategia', value: 'Alto Engagement' }
    ],
    colorPalette: ['#76FF03', '#050B05', '#38B000', '#FFFFFF']
  }
];

export const experienceData: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Directora del Área de Diseño Gráfico',
    company: 'Imprenta Bifronte',
    location: 'El Salvador',
    period: '2024',
    isCurrent: false,
    description: 'Dirección, gestión y ejecución integral del área de diseño gráfico, responsable del desarrollo completo de las piezas visuales y producción publicitaria.',
    responsibilities: [
      'Creación de artes para camisetas, tazas personalizadas, banners, banderas, anuncios y materiales publicitarios adaptados a distintos formatos y soportes.',
      'Preparación y optimización de archivos finales en formatos y perfiles de color (CMYK) para impresión, garantizando fidelidad cromática y compatibilidad técnica.',
      'Realización de retoques, ajustes de color, correcciones visuales y optimización de diseño para asegurar resultados de alta calidad.',
      'Coordinación directa con el área de producción, supervisando la correcta aplicación de diseños, estándares visuales y calidad final de los productos.'
    ],
    toolsUsed: ['Adobe Illustrator', 'Adobe Photoshop', 'Pre-prensa / CMYK', 'Diseño Publicitario', 'Merchandising']
  },
  {
    id: 'exp-2',
    role: 'Diseñadora Gráfica & Modeladora 3D Freelance',
    company: 'Proyectos Independientes',
    location: 'Sonsonate, El Salvador (Remoto / Global)',
    period: '2020 - 2026',
    isCurrent: true,
    description: 'Desarrollo de proyectos de diseño gráfico y comunicación visual: branding, logotipos, material publicitario, piezas para redes sociales, modelado 3D y edición de video.',
    responsibilities: [
      'Desarrollo de identidades visuales integrales, diseño de logotipos, material corporativo y branding para marcas comerciales.',
      'Diseño de material publicitario físico y digital (folletos, flyers, menús digitales y físicos) y piezas de alto impacto para redes sociales.',
      'Modelado 3D de producto y piezas conceptuales, junto con edición de video comercial y promocional.',
      'Gestión integral de proyectos desde la conceptualización hasta la entrega final, asegurando calidad visual, coherencia gráfica y satisfacción del cliente.'
    ],
    toolsUsed: ['Blender', 'ZBrush', 'Adobe Illustrator', 'Adobe Photoshop', 'After Effects', 'CapCut', 'DaVinci Resolve']
  },
  {
    id: 'exp-3',
    role: 'Atención al Cliente y Gestión Comercial',
    company: 'Lácteos Adriana',
    location: 'El Salvador',
    period: '2018 - 2024',
    isCurrent: false,
    description: 'Responsable de atención directa, asesoría personalizada, manejo integral de ventas y control de calidad operativa y comercial.',
    responsibilities: [
      'Manejo integral del proceso de ventas, desde la orientación y asesoría personalizada hasta el cierre exitoso y fidelización del cliente.',
      'Resolución de situaciones complejas, gestión de reclamos y seguimiento postventa manteniendo altos estándares de servicio.',
      'Participación activa en toma de decisiones comerciales, selección y compra de insumos, materiales y productos necesarios para el negocio.',
      'Organización de pedidos, comunicación efectiva con clientes y control riguroso de calidad en la entrega final.'
    ],
    toolsUsed: ['Gestión Comercial', 'Atención al Cliente', 'Resolución de Conflictos', 'Control de Calidad', 'Microsoft Excel']
  }
];

export const skillCategoriesData: SkillCategory[] = [
  {
    id: 'branding-graphic',
    name: 'Branding & Identidad Visual',
    icon: 'branding_watermark',
    description: 'Creación de identidades visuales, logotipos, material corporativo, piezas promocionales y artes finales para impresión.',
    skills: [
      { name: 'Adobe Illustrator', level: 98, experience: '6+ años', isHighlight: true },
      { name: 'Adobe Photoshop', level: 96, experience: '6+ años', isHighlight: true },
      { name: 'Creación de Logotipos & Branding', level: 98, experience: '6+ años', isHighlight: true },
      { name: 'Artes Finales & Pre-prensa (CMYK)', level: 95, experience: '5+ años', isHighlight: true },
      { name: 'Material Publicitario & Banners', level: 94, experience: '5+ años' },
      { name: 'Canva & Diseño Ágil', level: 92, experience: '4+ años' }
    ]
  },
  {
    id: '3d-modeling',
    name: 'Modelado 3D & Esculpido',
    icon: 'view_in_ar',
    description: 'Modelado tridimensional, esculpido digital de geometrías, texturizado e iluminación para visualización de producto.',
    skills: [
      { name: 'Blender 3D Modeling', level: 92, experience: '5+ años', isHighlight: true },
      { name: 'ZBrush Esculpido Digital', level: 88, experience: '4+ años', isHighlight: true },
      { name: 'Iluminación & Renderizado', level: 90, experience: '4+ años' },
      { name: 'Visualización de Producto 3D', level: 91, experience: '4+ años' }
    ]
  },
  {
    id: 'video-motion',
    name: 'Edición de Video & Redes',
    icon: 'movie_edit',
    description: 'Edición de video comercial, motion graphics, animación para redes sociales y postproducción audiovisual.',
    skills: [
      { name: 'Adobe After Effects', level: 90, experience: '5+ años', isHighlight: true },
      { name: 'CapCut Video Editing', level: 94, experience: '4+ años', isHighlight: true },
      { name: 'DaVinci Resolve', level: 86, experience: '3+ años' },
      { name: 'Contenido Dinámico para Redes', level: 95, experience: '5+ años' }
    ]
  },
  {
    id: 'commercial-mgmt',
    name: 'Gestión Comercial & Calidad',
    icon: 'award',
    description: 'Atención personalizada, control de calidad, negociación, organización de pedidos y gestión integral de proyectos.',
    skills: [
      { name: 'Atención al Cliente & Asesoría', level: 98, experience: '6+ años', isHighlight: true },
      { name: 'Control de Calidad en Entregas', level: 96, experience: '6+ años', isHighlight: true },
      { name: 'Gestión de Proyectos & Plazos', level: 95, experience: '6+ años' },
      { name: 'Microsoft Excel & Gestión', level: 88, experience: '5+ años' }
    ]
  }
];

export const statsData: StatItem[] = [
  {
    value: 6,
    suffix: '+',
    label: 'Años de Trayectoria',
    description: 'Diseño gráfico publicitario, branding y modelado 3D.'
  },
  {
    value: 100,
    suffix: '%',
    label: 'Fidelidad Cromática',
    description: 'Artes finales optimizados para impresión técnica.'
  },
  {
    value: 50,
    suffix: '+',
    label: 'Marcas & Proyectos',
    description: 'Identidades visuales, logotipos y material corporativo.'
  }
];

export const testimonialsData: Testimonial[] = [];

export const translations = {
  en: {
    nav: {
      work: 'WORK',
      about: 'ABOUT',
      viewer3d: '3D LAB',
      experience: 'EXPERIENCE',
      stats: 'STATS',
      testimonials: 'REVIEWS',
      contact: 'CONTACT',
      startProject: 'START_PROJECT'
    },
    hero: {
      portfolioOf: 'PORTFOLIO OF',
      titleLine1: 'AYLIN',
      titleLine2: 'DANIELA',
      titleLine3: 'FLORES',
      subtitle: 'Graphic Designer | 3D Modeler | Branding | Video Editor based in Sonsonate, El Salvador. Bachelor of Fine Arts (Graphic Design Major) from Universidad de El Salvador with 6+ years of professional expertise.',
      badgeAvailable: 'AVAILABLE FOR NEW PROJECTS',
      viewProjects: 'VIEW PROJECTS',
      downloadCv: 'VIEW CV / RESUME',
      startProjectBtn: 'START PROJECT'
    },
    about: {
      basedIn: 'BASED IN',
      location: 'SONSONATE, EL SALVADOR',
      titleSub: 'THE',
      titleHighlight: 'CREATIVE',
      titleEnd: 'PROFILE',
      bio: 'Graphic designer with solid experience in brand identity creation, advertising design, and social media content. Specialized in logo design, corporate collateral, promotional assets, and prepress print production. Proficient in professional design tools and 3D modeling. Responsible, creative, organized, and focused on visual quality and client satisfaction.',
      skillsTabTitle: 'CORE CAPABILITIES',
      proficiency: 'Proficiency Level'
    },
    viewer3d: {
      title: 'INTERACTIVE 3D LAB',
      subtitle: 'Rotate, inspect geometry, and explore real-time materials in the browser.',
      wireframe: 'Wireframe Mode',
      shaded: 'Solid Shaded',
      lightingTheme: 'Lighting Color',
      rotateHint: 'Drag to rotate • Scroll to zoom'
    },
    work: {
      title: 'SELECTED WORKS',
      all: 'ALL',
      viewAll: 'VIEW ALL PROJECTS',
      caseStudy: 'EXPLORE CASE STUDY',
      filter: 'Filter by category'
    },
    experience: {
      title: 'EXPERIENCE & JOURNEY',
      subtitle: 'Professional background across design direction, freelance brand projects, and commercial quality management.'
    },
    stats: {
      title: 'BY THE NUMBERS',
      clientReviews: 'WHAT CLIENTS SAY'
    },
    contact: {
      title: "LET'S CREATE TOGETHER",
      subtitle: 'Have a project in mind or want to collaborate on brand identity, advertising design, 3D visualization, or video editing? Send a message or use the interactive project estimator.',
      directEmail: 'aylin.graphicsdesign@gmail.com',
      localTime: 'Local Time (Sonsonate, El Salvador - UTC-6)',
      namePlaceholder: 'Your Full Name',
      emailPlaceholder: 'your.email@company.com',
      serviceInterest: 'Service of Interest',
      messagePlaceholder: 'Tell me about your project goals, timeline, and deliverables...',
      sendBtn: 'SEND INQUIRY',
      copied: 'Email copied to clipboard!'
    },
    planner: {
      title: 'START A NEW PROJECT',
      step1: '1. Select Services Needed',
      step2: '2. Target Timeline',
      step3: '3. Estimated Budget Range',
      step4: '4. Project Details',
      generateInquiry: 'GENERATE PROJECT BRIEF',
      deliverablesIncluded: 'Estimated Deliverables'
    }
  },
  es: {
    nav: {
      work: 'PROYECTOS',
      about: 'SOBRE MÍ',
      viewer3d: '3D LAB',
      experience: 'EXPERIENCIA',
      stats: 'MÉTRICAS',
      testimonials: 'RESEÑAS',
      contact: 'CONTACTO',
      startProject: 'INICIAR_PROYECTO'
    },
    hero: {
      portfolioOf: 'PORTAFOLIO DE',
      titleLine1: 'AYLIN',
      titleLine2: 'DANIELA',
      titleLine3: 'FLORES',
      subtitle: 'Diseñadora Gráfica | Modeladora 3D | Branding | Edición de Video radicada en Sonsonate, El Salvador. Licenciada en Artes Plásticas (Opción Diseño Gráfico) por la Universidad de El Salvador.',
      badgeAvailable: 'DISPONIBLE PARA NUEVOS PROYECTOS',
      viewProjects: 'VER PROYECTOS',
      downloadCv: 'VER CV / RESUMEN',
      startProjectBtn: 'INICIAR PROYECTO'
    },
    about: {
      basedIn: 'RADICADA EN',
      location: 'SONSONATE, EL SALVADOR',
      titleSub: 'EL',
      titleHighlight: 'PERFIL',
      titleEnd: 'PROFESIONAL',
      bio: 'Diseñadora gráfica con experiencia en creación de identidades visuales, diseño publicitario y contenido para redes sociales. Especializada en logotipos, material corporativo, piezas promocionales y artes finales para impresión. Manejo de herramientas de diseño profesional y conocimientos en modelado 3D. Responsable, creativa, organizada y orientada a la calidad visual y satisfacción del cliente.',
      skillsTabTitle: 'CAPACIDADES CLAVE',
      proficiency: 'Nivel de Dominio'
    },
    viewer3d: {
      title: 'LABORATORIO 3D INTERACTIVO',
      subtitle: 'Gira, inspecciona la geometría y explora materiales en tiempo real en el navegador.',
      wireframe: 'Modo Wireframe',
      shaded: 'Sólido Sombreado',
      lightingTheme: 'Color de Iluminación',
      rotateHint: 'Arrastra para rotar • Scroll para zoom'
    },
    work: {
      title: 'PROYECTOS DESTACADOS',
      all: 'TODOS',
      viewAll: 'VER TODOS LOS PROYECTOS',
      caseStudy: 'EXPLORAR CASO DE ESTUDIO',
      filter: 'Filtrar por categoría'
    },
    experience: {
      title: 'EXPERIENCIA Y TRAYECTORIA',
      subtitle: 'Trayectoria profesional en dirección de diseño, proyectos independientes y gestión de calidad.'
    },
    stats: {
      title: 'EN NÚMEROS',
      clientReviews: 'LO QUE DICEN LOS CLIENTES'
    },
    contact: {
      title: 'CREEMOS JUNTOS',
      subtitle: '¿Tienes un proyecto en mente o deseas colaborar en identidad visual, diseño publicitario, modelado 3D o edición de video? Envíame un mensaje o utiliza el estimador de proyectos.',
      directEmail: 'aylin.graphicsdesign@gmail.com',
      localTime: 'Hora Local (Sonsonate, El Salvador - UTC-6)',
      namePlaceholder: 'Tu Nombre Completo',
      emailPlaceholder: 'tu.correo@empresa.com',
      serviceInterest: 'Servicio de Interés',
      messagePlaceholder: 'Cuéntame sobre los objetivos de tu proyecto, plazos y entregables...',
      sendBtn: 'ENVIAR MENSAJE',
      copied: '¡Correo copiado al portapapeles!'
    },
    planner: {
      title: 'INICIAR UN NUEVO PROYECTO',
      step1: '1. Selecciona los Servicios',
      step2: '2. Tiempo Estimado',
      step3: '3. Rango de Presupuesto',
      step4: '4. Detalles del Proyecto',
      generateInquiry: 'GENERAR BRIEF DEL PROYECTO',
      deliverablesIncluded: 'Entregables Estimados'
    }
  }
};
