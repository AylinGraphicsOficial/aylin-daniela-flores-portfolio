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
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLuelUNvB0s29U6Uku7DycUTPiOmYcBUQerJmAAMs3miyC3tX1s57f9KfRNnOgv5PFI8R78531NUvr_jd6jGGme97HR50ewzFufxUgKR3GWIUJrHXLHx9Cokmr75hduUp4NJ-8TJ2DzKQPFhJBHy-sdeEEzJIPCkxBncVdS15cNI3vlAGa1sz_VvlFOuY_9u-QDdJmY1h9R1ulwiN0Jn8n7I7nGhlqZKq0uyEHWvDdNXgqMZg9EDMJhwDWs',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida/AP1WRLuelUNvB0s29U6Uku7DycUTPiOmYcBUQerJmAAMs3miyC3tX1s57f9KfRNnOgv5PFI8R78531NUvr_jd6jGGme97HR50ewzFufxUgKR3GWIUJrHXLHx9Cokmr75hduUp4NJ-8TJ2DzKQPFhJBHy-sdeEEzJIPCkxBncVdS15cNI3vlAGa1sz_VvlFOuY_9u-QDdJmY1h9R1ulwiN0Jn8n7I7nGhlqZKq0uyEHWvDdNXgqMZg9EDMJhwDWs',
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
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLsYcVyHRuT6OeFxHxRfNMHceGT-VD8VVa5gOodzQYkO0ElzN1TTEIZj1hFgNMXqKsuRCCTwVt-gmKgpHwGU1wF49unMKF-ztGc1gu-iT4akzgUS1cBvRndCZQAg8Sjyg1mK1D4Nmp4BIyoLtkgzMrMp_ncGeTfBz1PS0SQNU9zosVp46Gc4NO02BqSfTLRuJnRvMKk2rwcNJllOxGUvn7qKa2teBmwIOspgg3K7WQlQpU-z1t5E0sVfkhs',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida/AP1WRLsYcVyHRuT6OeFxHxRfNMHceGT-VD8VVa5gOodzQYkO0ElzN1TTEIZj1hFgNMXqKsuRCCTwVt-gmKgpHwGU1wF49unMKF-ztGc1gu-iT4akzgUS1cBvRndCZQAg8Sjyg1mK1D4Nmp4BIyoLtkgzMrMp_ncGeTfBz1PS0SQNU9zosVp46Gc4NO02BqSfTLRuJnRvMKk2rwcNJllOxGUvn7qKa2teBmwIOspgg3K7WQlQpU-z1t5E0sVfkhs',
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
  }
];

export const experienceData: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Senior Graphic Designer & 3D Lead',
    company: 'Studio Kinetic & Apex Media',
    location: 'San Salvador, El Salvador (Hybrid / Global)',
    period: '2020 - PRESENT',
    isCurrent: true,
    description: 'Directing creative visual direction, brand strategy, and complex 3D product visualizations for national and international brands.',
    responsibilities: [
      'Spearheading 3D asset pipeline development for automotive, luxury packaging, and digital fintech clients.',
      'Mentoring junior designers in 3D topography, UV mapping, PBR rendering, and brand guidelines construction.',
      'Collaborating with global engineering teams to optimize 3D WebGL assets for real-time web experiences.',
      'Achieving 99% client milestone satisfaction across 40+ delivered corporate identity and 3D visualization projects.'
    ],
    toolsUsed: ['Blender', 'Cinema 4D', 'Substance 3D', 'Illustrator', 'Photoshop', 'After Effects', 'Figma']
  },
  {
    id: 'exp-2',
    role: '3D Modeler & Visual Illustrator',
    company: 'Vanguard Creative Agency',
    location: 'San Salvador, El Salvador',
    period: '2018 - 2020',
    isCurrent: false,
    description: 'Specialized in photorealistic 3D modeling for advertising campaigns and bespoke digital illustration.',
    responsibilities: [
      'Developed high-fidelity 3D modeling assets, textures, and lighting setups for commercial print and television spots.',
      'Created custom vector illustration sets and typography lockups for lifestyle and consumer packaged goods.',
      'Designed interactive trade show kiosk visual graphics and digital signage.'
    ],
    toolsUsed: ['Maya', 'ZBrush', 'Adobe CC Suite', 'Cinema 4D', 'Octane Render']
  },
  {
    id: 'exp-3',
    role: 'Junior Graphic & Brand Designer',
    company: 'Pixel Nova Studio',
    location: 'El Salvador',
    period: '2016 - 2018',
    isCurrent: false,
    description: 'Assisted senior directors in layout composition, editorial design, photo retouching, and vector identity guidelines.',
    responsibilities: [
      'Executed high-precision photo color correction, retouching, and masking for fashion and retail catalogs.',
      'Designed print-ready collateral including brochures, stationery kits, packaging, and billboard assets.',
      'Managed brand asset repositories and generated vector iconography sets.'
    ],
    toolsUsed: ['Illustrator', 'Photoshop', 'InDesign', 'CorelDraw', 'Lightroom']
  }
];

export const skillCategoriesData: SkillCategory[] = [
  {
    id: '3d-modeling',
    name: '3D Modeling & Visualization',
    icon: 'view_in_ar',
    description: 'High-poly sculpting, parametric surface modeling, procedural texturing, and photorealistic PBR rendering.',
    skills: [
      { name: 'Hard-Surface Modeling', level: 96, experience: '6+ yrs', isHighlight: true },
      { name: 'Blender & Cinema 4D', level: 95, experience: '6 yrs', isHighlight: true },
      { name: 'Substance 3D Painter & Texturing', level: 90, experience: '5 yrs' },
      { name: 'Lighting, HDR & Octane/Redshift', level: 92, experience: '5 yrs', isHighlight: true },
      { name: 'ZBrush Digital Sculpting', level: 85, experience: '4 yrs' },
      { name: 'Real-time WebGL/GLTF Optimization', level: 88, experience: '3 yrs' }
    ]
  },
  {
    id: 'branding',
    name: 'Branding & Corporate Identity',
    icon: 'branding_watermark',
    description: 'Transforming brand visions into recognizable, timeless identity systems, typographic rules, and complete style guides.',
    skills: [
      { name: 'Logo Design & Vector Architecture', level: 98, experience: '6+ yrs', isHighlight: true },
      { name: 'Brand Strategy & Manual Guidelines', level: 94, experience: '6 yrs', isHighlight: true },
      { name: 'Typography & Layout Systems', level: 95, experience: '6+ yrs' },
      { name: 'Design Systems & Figma Componentry', level: 90, experience: '4 yrs' },
      { name: 'Stationery & Packaging Dielines', level: 92, experience: '5 yrs' }
    ]
  },
  {
    id: 'illustration',
    name: 'Digital Art & Vector Illustration',
    icon: 'draw',
    description: 'Custom key visuals, conceptual digital paintings, surreal 3D compositions, and crisp vector iconography.',
    skills: [
      { name: 'Adobe Illustrator Mastery', level: 98, experience: '6+ yrs', isHighlight: true },
      { name: 'Photoshop Digital Painting & Compositing', level: 95, experience: '6+ yrs', isHighlight: true },
      { name: 'Concept Art & Moodboards', level: 90, experience: '5 yrs' },
      { name: 'Isometric & Technical Drawing', level: 88, experience: '4 yrs' }
    ]
  },
  {
    id: 'motion',
    name: 'Motion Graphics & Video',
    icon: 'movie_edit',
    description: 'Dynamic kinetic typography, 3D broadcast animation, promo loops, and post-production video editing.',
    skills: [
      { name: 'After Effects & Motion Design', level: 90, experience: '5 yrs', isHighlight: true },
      { name: 'Kinetic Typography Sync', level: 92, experience: '5 yrs' },
      { name: 'Premiere Pro Video Editing', level: 88, experience: '5 yrs' },
      { name: 'Sound FX & Pacing Timing', level: 85, experience: '4 yrs' }
    ]
  }
];

export const statsData: StatItem[] = [
  {
    value: 6,
    suffix: '+',
    label: 'Years of Mastery',
    description: 'Delivering world-class graphic design & 3D visualizations.'
  },
  {
    value: 120,
    suffix: '+',
    label: '3D Projects Rendered',
    description: 'Automotive, packaging, consumer electronics, and surreal art.'
  },
  {
    value: 45,
    suffix: '+',
    label: 'Brand Identities',
    description: 'Full corporate guidelines, logo systems, and visual kits.'
  },
  {
    value: 99,
    suffix: '.4%',
    label: 'Client Satisfaction',
    description: 'Long-term agency partnerships and international clients.'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    quote: "Aylin's 3D work blew our executive team away. The level of realistic materials and meticulous attention to lighting on our flagship product was second to none.",
    author: 'Carlos Morales',
    role: 'Creative Director',
    company: 'Apex Auto Studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    projectRef: 'Retro Mini Classic 3D Render'
  },
  {
    id: 'test-2',
    quote: "She delivered an entire corporate identity overhaul in record time without compromising an ounce of quality. Her fluid kinetic style defined our new market presence.",
    author: 'Elena Vance',
    role: 'Head of Marketing',
    company: 'Nexus Global Financial',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    projectRef: 'Nexus Fintech Corporate Identity System'
  },
  {
    id: 'test-3',
    quote: "Working with Aylin is effortless. She understands brand storytelling and transforms complex briefs into striking 3D visual reality. Highly recommended!",
    author: 'Marcus Chen',
    role: 'Founder & CEO',
    company: 'Lumina Brews',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    projectRef: 'Lumina Craft Botanical Beverage'
  }
];

export const translations = {
  en: {
    nav: {
      work: 'WORK',
      about: 'ABOUT',
      viewer3d: '3D LAB',
      stats: 'STATS',
      experience: 'EXPERIENCE',
      testimonials: 'REVIEWS',
      contact: 'CONTACT',
      startProject: 'START_PROJECT'
    },
    hero: {
      portfolioOf: 'PORTFOLIO OF',
      titleLine1: 'AYLIN',
      titleLine2: 'DANIELA',
      titleLine3: 'FLORES',
      subtitle: 'Graphic Designer & 3D Modeler based in El Salvador. Specializing in branding, 3D visualization, and digital kinetic experiences with 6+ years of professional mastery.',
      badgeAvailable: 'AVAILABLE FOR Q3 / Q4 PROJECTS',
      viewProjects: 'VIEW PROJECTS',
      downloadCv: 'VIEW CV / RESUME',
      startProjectBtn: 'START PROJECT'
    },
    about: {
      basedIn: 'BASED IN',
      location: 'EL SALVADOR',
      titleSub: 'THE',
      titleHighlight: 'CREATIVE',
      titleEnd: 'MIND',
      bio: 'I am a passionate graphic designer with over 6 years of experience in visual communication, branding, and 3D modeling. I thrive on translating abstract concepts into tangible, striking visual solutions that captivate audiences.',
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
      subtitle: 'Over 6 years of visual communication and 3D modeling excellence.'
    },
    stats: {
      title: 'BY THE NUMBERS',
      clientReviews: 'WHAT CLIENTS SAY'
    },
    contact: {
      title: "LET'S CREATE TOGETHER",
      subtitle: 'Have a project in mind or want to collaborate on 3D visualization or brand identity? Send a message or use the interactive project estimator.',
      directEmail: 'Direct Email',
      localTime: 'Local Time (El Salvador - UTC-6)',
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
      viewer3d: 'LAB 3D',
      stats: 'ESTADÍSTICAS',
      experience: 'EXPERIENCIA',
      testimonials: 'TESTIMONIOS',
      contact: 'CONTACTO',
      startProject: 'INICIAR_PROYECTO'
    },
    hero: {
      portfolioOf: 'PORTAFOLIO DE',
      titleLine1: 'AYLIN',
      titleLine2: 'DANIELA',
      titleLine3: 'FLORES',
      subtitle: 'Diseñadora Gráfica & Modeladora 3D radicada en El Salvador. Especializada en branding, visualización 3D y experiencias cinéticas digitales con más de 6 años de maestría profesional.',
      badgeAvailable: 'DISPONIBLE PARA PROYECTOS T3 / T4',
      viewProjects: 'VER PROYECTOS',
      downloadCv: 'VER CV / RESUMEN',
      startProjectBtn: 'INICIAR PROYECTO'
    },
    about: {
      basedIn: 'RADICADA EN',
      location: 'EL SALVADOR',
      titleSub: 'LA',
      titleHighlight: 'MENTE CREATIVA',
      titleEnd: '',
      bio: 'Soy una apasionada diseñadora gráfica con más de 6 años de experiencia en comunicación visual, creación de marcas y modelado 3D. Me apasiona transformar conceptos abstractos en soluciones visuales impactantes y tangibles.',
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
      subtitle: 'Más de 6 años de excelencia en comunicación visual y modelado 3D.'
    },
    stats: {
      title: 'EN NÚMEROS',
      clientReviews: 'LO QUE DICEN LOS CLIENTES'
    },
    contact: {
      title: 'CREEMOS JUNTOS',
      subtitle: '¿Tienes un proyecto en mente o deseas colaborar en visualización 3D o identidad de marca? Envíame un mensaje o utiliza el estimador de proyectos.',
      directEmail: 'Correo Directo',
      localTime: 'Hora Local (El Salvador - UTC-6)',
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
