import { Project, ExperienceItem, SkillCategory, StatItem, Testimonial } from '../types';

export const projectsData: Project[] = [
  {
    id: 'retro-mini-render',
    title: 'Retro Mini Classic 3D Render',
    category: '3D MODELING',
    year: '2023',
    client: 'Apex Auto Studio',
    shortDesc: 'Hard-surface 3D modeling, UV unwrapping, and photorealistic octane rendering of a classic British mini cooper.',
    fullDesc: 'An intensive vehicle hard-surface modeling study exploring precise curvature topology, realistic dielectric materials, custom decals, and high-dynamic-range studio lighting setups. Rendered in multiple cinematic angles with custom camera depths of field.',
    image: '/images/retro-mini.jpg',
    galleryImages: [
      '/images/retro-mini.jpg',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['3D Modeling', 'Blender', 'Octane', 'Substance 3D', 'Automotive'],
    modelType: 'car',
    featured: true,
    bentoSpan: 'md:col-span-8 md:row-span-2',
    deliverables: ['High-poly 3D Asset', 'PBR 4K Texture Maps', '360 Turntable Video', 'Print Resolution 8K Renders'],
    metrics: [
      { label: 'Polygon Count', value: '280K Tris' },
      { label: 'Render Samples', value: '4,096 SPP' },
      { label: 'PBR Shaders', value: '18 Custom Materials' }
    ],
    colorPalette: ['#050B05', '#76FF03', '#1A301A', '#A3E635']
  },
  {
    id: 'kinetic-touch-hands',
    title: 'Kinetic Touch & Fluid Synergy',
    category: 'DIGITAL ART',
    year: '2024',
    client: 'Cyberpunk Digital Biennial',
    shortDesc: 'Surreal 3D human anatomy visual exploring the intersection between human tactile touch and technological fluidity.',
    fullDesc: 'Conceptual 3D visualization representing human connection through ethereal cybernetic textures and ambient light refraction. Modeled using ZBrush sculpting, textured in Substance Painter with iridescent subsurface scattering, and composited in After Effects.',
    image: '/images/hero-hands.jpg',
    galleryImages: [
      '/images/hero-hands.jpg',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Digital Art', 'ZBrush', 'Cinema 4D', 'Redshift', 'Iridescence'],
    modelType: 'hand',
    featured: true,
    bentoSpan: 'md:col-span-4 md:row-span-1',
    deliverables: ['Hero Key Visuals', 'NFT Series Pack', 'Motion Loop Video', 'Wall Art Edition'],
    metrics: [
      { label: 'Exhibition Views', value: '45,000+' },
      { label: 'Sculpt Details', value: '12M Polys (ZBrush)' }
    ],
    colorPalette: ['#050B05', '#38B000', '#76FF03', '#FFFFFF']
  },
  {
    id: 'corporate-identity-system',
    title: 'Nexus Fintech Corporate Identity System',
    category: 'BRANDING',
    year: '2024',
    client: 'Nexus Global Financial',
    shortDesc: 'Comprehensive brand overhaul including logo design, typography systems, 3D brand tokens, and digital guidelines.',
    fullDesc: 'A complete multi-disciplinary identity system for an international financial technology provider. We developed a robust visual grammar based on kinetic vectors, strict typographic contrast, modern responsive logo marks, custom 3D isometric icons, and full design system tokens.',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Branding', 'Identity System', 'Typography', 'Figma', 'Illustrator'],
    modelType: 'poly',
    featured: true,
    bentoSpan: 'md:col-span-12 md:row-span-1',
    deliverables: ['Brand Style Guide (90 pages)', 'Vector Master Kit', '3D Asset Library', 'UI Components & Design System'],
    metrics: [
      { label: 'Brand Recognition', value: '+74% Increase' },
      { label: 'Deploy Time', value: '3 Months' },
      { label: 'Asset Modules', value: '140+ Brand Assets' }
    ],
    colorPalette: ['#050B05', '#38B000', '#76FF03', '#A3E635', '#FFFFFF']
  },
  {
    id: 'lumina-beverage-packaging',
    title: 'Lumina Craft Botanical Beverage 3D',
    category: '3D MODELING',
    year: '2023',
    client: 'Lumina Botanical Brews',
    shortDesc: '3D packaging visualizer, glass condensation shaders, and luxury label foil stamping visualization.',
    fullDesc: 'Photorealistic product mockups and advertising key visuals for a premium sparkling beverage line. Custom fluid droplet simulation and chromatic glass dispersion shaders created to highlight crisp freshness.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['3D Modeling', 'Product Visualization', 'Fluid Dynamics', 'Cinema 4D'],
    modelType: 'cube',
    featured: false,
    bentoSpan: 'md:col-span-6 md:row-span-1',
    deliverables: ['3D Bottle Models', 'Condensation Sim', 'E-commerce 4K Renders', 'Social Media 3D Motion Teasers'],
    metrics: [
      { label: 'Conversion Lift', value: '+38%' },
      { label: 'Formats', value: 'Instagram / Billboard / Web' }
    ],
    colorPalette: ['#76FF03', '#050B05', '#50E310', '#FFFFFF']
  },
  {
    id: 'cyber-kinetic-intro',
    title: 'Aura Kinetic Motion Typography & Title sequence',
    category: 'MOTION',
    year: '2024',
    client: 'Aura Media Studio',
    shortDesc: 'High-octane animated kinetic typography title sequence for audio-visual streaming events.',
    fullDesc: 'Dynamic animation combining 3D particle systems, glitch effects, rhythmic audio synchronization, and bold Montserrat & display type treatments.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Motion Graphics', 'After Effects', 'Sound Sync', 'Kinetic Type'],
    modelType: 'poly',
    featured: false,
    bentoSpan: 'md:col-span-6 md:row-span-1',
    deliverables: ['4K 60fps Broadcast Sequence', 'Social Cutdowns', 'Lottie Web Assets'],
    metrics: [
      { label: 'Video Streams', value: '1.2M+' },
      { label: 'Framerate', value: '60 FPS Uncompressed' }
    ],
    colorPalette: ['#38B000', '#76FF03', '#050B05', '#FFFFFF']
  },
  {
    id: 'orbit-stand-exhibition',
    title: 'Kinetic 3D Stand Exhibition & Architectural Space',
    category: '3D MODELING',
    year: '2024',
    client: 'Orbit Expo & Retail',
    shortDesc: '3D architectural stand design, commercial lighting simulation, and exhibition space modeling.',
    fullDesc: 'A full-scale commercial exhibition stand designed for retail and trade show spaces. Incorporates modern kinetic lighting, modular structural display counters, and photorealistic spatial rendering.',
    image: '/images/orbit-stand.webp',
    galleryImages: [
      '/images/orbit-stand.webp',
      '/images/orbit-stand-diana.webp'
    ],
    tags: ['3D Architecture', 'Blender', 'Exhibition Stand', 'Lighting', 'Commercial'],
    modelType: 'poly',
    featured: true,
    bentoSpan: 'md:col-span-6 md:row-span-1',
    deliverables: ['Spatial 3D Model', 'Rendered Walkthrough Views', 'Construction Floorplan Specifications', 'Branded Graphic Panels'],
    metrics: [
      { label: 'Space Footprint', value: '36 m²' },
      { label: 'Resolution', value: '8K Render Pipeline' }
    ],
    colorPalette: ['#050B05', '#76FF03', '#38B000', '#FFFFFF']
  },
  {
    id: 'diana-brand-experience',
    title: 'Diana Interactive Brand Stand & POP Display',
    category: 'BRANDING',
    year: '2024',
    client: 'Diana Corporativo',
    shortDesc: 'Interactive point of purchase retail stand, corporate color matching, and 3D architectural mockup.',
    fullDesc: 'Commercial branding activation stand designed for maximum customer engagement. Features custom 3D typography, branded product showcases, and high-impact visual communication.',
    image: '/images/orbit-stand-diana.webp',
    galleryImages: [
      '/images/orbit-stand-diana.webp',
      '/images/orbit-stand.webp'
    ],
    tags: ['Branding', 'Retail Design', '3D Modeling', 'POP Display', 'Illustrator'],
    modelType: 'poly',
    featured: false,
    bentoSpan: 'md:col-span-6 md:row-span-1',
    deliverables: ['3D Retail Rendering', 'Vector Graphic Application Kit', 'Manufacturing Ready Specs'],
    metrics: [
      { label: 'Foot Traffic Impact', value: '+45%' },
      { label: 'Color Match Fidelity', value: '100% Pantones' }
    ],
    colorPalette: ['#38B000', '#76FF03', '#050B05', '#FFFFFF']
  },
  {
    id: 'orbit-tablet-visual',
    title: 'Next-Gen Digital Tablet & UI 3D Showcase',
    category: 'DIGITAL ART',
    year: '2024',
    client: 'Nova Interactive Labs',
    shortDesc: 'Digital device modeling, holographic UI projection, and futuristic interface rendering.',
    fullDesc: 'Conceptual 3D product showcase demonstrating modern touch UI screens, reflective glass optics, and dynamic digital dashboards for high-tech applications.',
    image: '/images/orbit-tablet.webp',
    galleryImages: [
      '/images/orbit-tablet.webp'
    ],
    tags: ['Digital Art', 'Product Design', 'UI 3D', 'Blender', 'Sci-Fi'],
    modelType: 'poly',
    featured: false,
    bentoSpan: 'md:col-span-6 md:row-span-1',
    deliverables: ['3D Device Asset', 'Holographic UI Elements', 'Interactive Screen Overlays'],
    metrics: [
      { label: 'Viewport Latency', value: '< 16ms' },
      { label: 'Shader Passes', value: '6 Compositing Passes' }
    ],
    colorPalette: ['#76FF03', '#050B05', '#38B000', '#FFFFFF']
  },
  {
    id: 'orbit-carrito-render',
    title: '3D Stand & Carrito Retail Visual Experience',
    category: '3D MODELING',
    year: '2024',
    client: 'Street Craft Gourmet',
    shortDesc: 'Custom vintage mobile retail cart 3D modeling, weathered textures, and studio product lighting.',
    fullDesc: 'Detailed hard-surface vehicle and mobile cart visualization with weathered metal shaders, decals, and realistic physical materials for brand activations.',
    image: '/images/orbit-carrito.png',
    galleryImages: [
      '/images/orbit-carrito.png'
    ],
    tags: ['3D Modeling', 'Retail', 'Substance 3D', 'Blender', 'Texturing'],
    modelType: 'car',
    featured: false,
    bentoSpan: 'md:col-span-6 md:row-span-1',
    deliverables: ['3D Asset File', '4K PBR Textures', 'Commercial Renders'],
    metrics: [
      { label: 'Texture Resolution', value: '4K Multi-UDIM' },
      { label: 'Realism Rating', value: 'Photorealistic' }
    ],
    colorPalette: ['#050B05', '#76FF03', '#1A301A', '#FFFFFF']
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
      directEmail: 'Floresaylin2@gmail.com',
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
      directEmail: 'Floresaylin2@gmail.com',
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
