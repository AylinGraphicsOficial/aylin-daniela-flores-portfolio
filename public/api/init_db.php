<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Database Initialization & Migration Script
 */

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

if (!$pdo) {
    sendJsonResponse([
        'success' => false,
        'error'   => 'No se pudo conectar a la base de datos MySQL en Hostinger.',
        'details' => 'Verifica que la base de datos ' . DB_NAME . ' exista y las credenciales sean correctas.'
    ], 500);
}

try {
    // 1. Create Projects Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `projects` (
            `id` VARCHAR(100) NOT NULL PRIMARY KEY,
            `title` VARCHAR(255) NOT NULL,
            `category` VARCHAR(100) NOT NULL DEFAULT '3D MODELING',
            `year` VARCHAR(20) NOT NULL DEFAULT '2026',
            `client` VARCHAR(255) NOT NULL DEFAULT '',
            `shortDesc` TEXT,
            `fullDesc` LONGTEXT,
            `image` VARCHAR(500) NOT NULL,
            `galleryImages` LONGTEXT,
            `videoUrl` VARCHAR(500) DEFAULT '',
            `videoClip` VARCHAR(500) DEFAULT '',
            `gifUrl` VARCHAR(500) DEFAULT '',
            `tags` LONGTEXT,
            `featured` TINYINT(1) NOT NULL DEFAULT 0,
            `metrics` LONGTEXT,
            `display_order` INT NOT NULL DEFAULT 0,
            `createdAt` VARCHAR(50) DEFAULT NULL,
            `updatedAt` VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 2. Create Disciplines Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `disciplines` (
            `id` VARCHAR(100) NOT NULL PRIMARY KEY,
            `number` VARCHAR(10) NOT NULL,
            `verticalTextEs` VARCHAR(255) DEFAULT '',
            `verticalTextEn` VARCHAR(255) DEFAULT '',
            `titleEs` VARCHAR(255) NOT NULL,
            `titleEn` VARCHAR(255) NOT NULL,
            `subtitleEs` VARCHAR(255) DEFAULT '',
            `subtitleEn` VARCHAR(255) DEFAULT '',
            `descEs` TEXT,
            `descEn` TEXT,
            `image` VARCHAR(500) NOT NULL,
            `slides` LONGTEXT,
            `targetProjectId` VARCHAR(100) DEFAULT '',
            `visible` TINYINT(1) NOT NULL DEFAULT 1,
            `display_order` INT NOT NULL DEFAULT 0,
            `updatedAt` VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 3. Create Media Library Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `media_library` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `filename` VARCHAR(255) NOT NULL,
            `url` VARCHAR(500) NOT NULL,
            `fileType` VARCHAR(50) NOT NULL,
            `fileSize` INT NOT NULL DEFAULT 0,
            `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 4. Create Site Sections Table (About, Experience, Diplomados, 3D Lab, Profile)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `site_sections` (
            `section_key` VARCHAR(50) NOT NULL PRIMARY KEY,
            `data` LONGTEXT NOT NULL,
            `updatedAt` VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Ensure uploads directory exists and is writable
    if (!file_exists(UPLOAD_DIR)) {
        @mkdir(UPLOAD_DIR, 0777, true);
    }

    // 5. Seed initial projects if empty
    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM `projects`");
    $projectCount = (int)$stmt->fetchColumn();

    if ($projectCount === 0) {
        $initialProjects = [
            [
                'id' => 'retro-mini-render',
                'title' => 'Retro Mini Classic 3D Render',
                'category' => '3D MODELING',
                'year' => '2023',
                'client' => 'Apex Auto Studio',
                'shortDesc' => 'Modelado hard-surface de alta fidelidad, shaders procedurales de pintura automotriz e iluminación fotográfica en estudio.',
                'fullDesc' => 'Exploración completa de visualización automotriz combinando modelado poligonal de precisión para el vehículo clásico y renderizado con Octane Render.',
                'image' => '/images/retro-mini.jpg',
                'galleryImages' => json_encode(['/images/retro-mini.jpg', '/images/orbit-stand.webp']),
                'videoUrl' => '',
                'videoClip' => '',
                'gifUrl' => '',
                'tags' => json_encode(['3D Modeling', 'Blender', 'Octane Render', 'Automotive']),
                'featured' => 1,
                'metrics' => json_encode([
                    ['label' => 'Render Samples', 'value' => '4,096 SPP'],
                    ['label' => 'Polígonos Sub-D', 'value' => '1.2M Poly']
                ]),
                'display_order' => 1,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'kinetic-touch-hands',
                'title' => 'Kinetic Touch & Fluid Synergy',
                'category' => 'DIGITAL ART',
                'year' => '2024',
                'client' => 'Studio Kinetic Labs',
                'shortDesc' => 'Composición de arte digital conceptual integrando interacción táctil y fluidos cian luminosos.',
                'fullDesc' => 'Pieza conceptual de arte digital que explora el punto de contacto entre la materia física y los fluidos energéticos.',
                'image' => '/images/hero-hands.jpg',
                'galleryImages' => json_encode(['/images/hero-hands.jpg']),
                'videoUrl' => '',
                'videoClip' => '',
                'gifUrl' => '',
                'tags' => json_encode(['Digital Art', 'Photoshop', 'Fluid Simulation', 'Concept']),
                'featured' => 1,
                'metrics' => json_encode([
                    ['label' => 'Resolución', 'value' => '8K UHD'],
                    ['label' => 'Profundidad', 'value' => '32-bit Float']
                ]),
                'display_order' => 2,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'corporate-identity-system',
                'title' => 'Nexus Fintech Corporate Identity System',
                'category' => 'BRANDING',
                'year' => '2024',
                'client' => 'Nexus Global Finance',
                'shortDesc' => 'Diseño integral de identidad de marca, sistema tipográfico dinámico y manual de normas corporativas.',
                'fullDesc' => 'Construcción completa de la identidad para una plataforma de servicios financieros de última generación.',
                'image' => 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1400&q=85',
                'galleryImages' => json_encode(['https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1400&q=85']),
                'videoUrl' => '',
                'videoClip' => '',
                'gifUrl' => '',
                'tags' => json_encode(['Branding', 'Typography', 'Visual Identity', 'Illustrator']),
                'featured' => 1,
                'metrics' => json_encode([
                    ['label' => 'Touchpoints', 'value' => '45+ Assets'],
                    ['label' => 'Guía de Marca', 'value' => '80 Páginas']
                ]),
                'display_order' => 3,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'orbit-stand-exhibition',
                'title' => 'Kinetic 3D Stand Exhibition',
                'category' => '3D MODELING',
                'year' => '2024',
                'client' => 'Orbit Brand Expo',
                'shortDesc' => 'Diseño de stand comercial arquitectónico para ferias internacionales con iluminación LED integrada.',
                'fullDesc' => 'Desarrollo de espacio de exhibición interactivo en 3D optimizado para flujo de asistentes y presentación de productos.',
                'image' => '/images/orbit-stand.webp',
                'galleryImages' => json_encode(['/images/orbit-stand.webp', '/images/orbit-stand-diana.webp']),
                'videoUrl' => '',
                'videoClip' => '',
                'gifUrl' => '',
                'tags' => json_encode(['3D Modeling', 'Architecture', 'Exhibition Stand', 'Lighting']),
                'featured' => 1,
                'metrics' => json_encode([
                    ['label' => 'Área Stand', 'value' => '72 m²'],
                    ['label' => 'Iluminación', 'value' => 'Fotometría IES']
                ]),
                'display_order' => 4,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'diana-brand-experience',
                'title' => 'Diana Interactive Brand Stand',
                'category' => 'BRANDING',
                'year' => '2024',
                'client' => 'Diana Consumer Brands',
                'shortDesc' => 'Experiencia de marca física y digital con stands temáticos y visual merchandising.',
                'fullDesc' => 'Ecosistema de marca en 3D para activación de producto en puntos de venta y convenciones de retail.',
                'image' => '/images/orbit-stand-diana.webp',
                'galleryImages' => json_encode(['/images/orbit-stand-diana.webp']),
                'videoUrl' => '',
                'videoClip' => '',
                'gifUrl' => '',
                'tags' => json_encode(['Branding', 'Point of Sale', '3D Stand', 'Merchandising']),
                'featured' => 1,
                'metrics' => json_encode([
                    ['label' => 'Impacto', 'value' => '15K Visitantes'],
                    ['label' => 'Materiales', 'value' => 'PBR Shaders']
                ]),
                'display_order' => 5,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'lumina-beverage-packaging',
                'title' => 'Lumina Craft Botanical Beverage 3D',
                'category' => '3D MODELING',
                'year' => '2023',
                'client' => 'Lumina Botanical Co.',
                'shortDesc' => 'Modelado de botellas de vidrio, condensación procedural y simulación de líquidos.',
                'fullDesc' => 'Renderizado fotorrealista para campaña de lanzamiento de bebidas botánicas artesanales con etiquetas metálicas.',
                'image' => 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=85',
                'galleryImages' => json_encode(['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=85']),
                'videoUrl' => '',
                'videoClip' => '',
                'gifUrl' => '',
                'tags' => json_encode(['3D Modeling', 'Packaging', 'Liquid Simulation', 'Octane']),
                'featured' => 1,
                'metrics' => json_encode([
                    ['label' => 'Gotas de Agua', 'value' => 'Partículas Geo'],
                    ['label' => 'Vidrio Caustics', 'value' => 'Spectral Path']
                ]),
                'display_order' => 6,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'digital-product-ui-3d',
                'title' => 'Next-Gen Digital Tablet & UI 3D',
                'category' => 'DIGITAL ART',
                'year' => '2024',
                'client' => 'Orbit Interactive',
                'shortDesc' => 'Visualización de dispositivo tablet interactivo con interfaz de usuario holográfica en tiempo real.',
                'fullDesc' => 'Diseño y renderizado 3D de hardware futurista mostrando visualización de datos y panel de control de audio.',
                'image' => '/images/orbit-tablet.webp',
                'galleryImages' => json_encode(['/images/orbit-tablet.webp']),
                'videoUrl' => '',
                'videoClip' => '',
                'gifUrl' => '',
                'tags' => json_encode(['Digital Art', 'UI Design', 'Hard Surface', 'Cyber']),
                'featured' => 0,
                'metrics' => json_encode([
                    ['label' => 'Pantalla OLED', 'value' => 'Emissive 4K'],
                    ['label' => 'Texturas', 'value' => 'Substance 3D']
                ]),
                'display_order' => 7,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'orbit-carrito-render',
                'title' => '3D Stand & Carrito Retail Visual',
                'category' => '3D MODELING',
                'year' => '2024',
                'client' => 'Street Craft Gourmet',
                'shortDesc' => 'Carrito móvil comercial para plazas y eventos con detalles en madera y metal mate.',
                'fullDesc' => 'Render de alta definición para previsualización de fabricación de mueble comercial móvil.',
                'image' => '/images/orbit-carrito.png',
                'galleryImages' => json_encode(['/images/orbit-carrito.png']),
                'videoUrl' => '',
                'videoClip' => '',
                'gifUrl' => '',
                'tags' => json_encode(['3D Modeling', 'Retail Design', 'Commercial Unit']),
                'featured' => 0,
                'metrics' => json_encode([
                    ['label' => 'Dimensiones', 'value' => '2.40 × 1.10 m'],
                    ['label' => 'Render Engine', 'value' => 'Cycles GPU']
                ]),
                'display_order' => 8,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => 'cyber-kinetic-intro',
                'title' => 'Aura Kinetic Motion Typography',
                'category' => 'MOTION',
                'year' => '2024',
                'client' => 'Kinetic Motion Festival',
                'shortDesc' => 'Animación tipográfica experimental con distorsión cromática y ritmo sonoro de alta energía.',
                'fullDesc' => 'Secuencia de apertura de festival audiovisual combinando After Effects, tracking 3D y diseño de sonido.',
                'image' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=85',
                'galleryImages' => json_encode(['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=85']),
                'videoUrl' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'videoClip' => '',
                'gifUrl' => '',
                'tags' => json_encode(['Motion Graphics', 'After Effects', 'Kinetic Type', 'Sound Design']),
                'featured' => 1,
                'metrics' => json_encode([
                    ['label' => 'Framerate', 'value' => '60 FPS'],
                    ['label' => 'Compositing', 'value' => '32 Layers']
                ]),
                'display_order' => 9,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ]
        ];

        $insertSql = "INSERT INTO `projects` (
            `id`, `title`, `category`, `year`, `client`, `shortDesc`, `fullDesc`,
            `image`, `galleryImages`, `videoUrl`, `videoClip`, `gifUrl`, `tags`,
            `featured`, `metrics`, `display_order`, `createdAt`, `updatedAt`
        ) VALUES (
            :id, :title, :category, :year, :client, :shortDesc, :fullDesc,
            :image, :galleryImages, :videoUrl, :videoClip, :gifUrl, :tags,
            :featured, :metrics, :display_order, :createdAt, :updatedAt
        )";

        $stmtInsert = $pdo->prepare($insertSql);
        foreach ($initialProjects as $proj) {
            $stmtInsert->execute($proj);
        }
    }

    // 6. Seed initial disciplines if empty
    $stmtDisc = $pdo->query("SELECT COUNT(*) as cnt FROM `disciplines`");
    $discCount = (int)$stmtDisc->fetchColumn();

    if ($discCount === 0) {
        $initialDisciplines = [
            [
                'id' => 'modelado-3d',
                'number' => '01',
                'verticalTextEs' => 'MODELADO 3D & RENDERIZADO CGI',
                'verticalTextEn' => '3D MODELING & CGI RENDERING',
                'titleEs' => 'MODELADO 3D',
                'titleEn' => '3D MODELING',
                'subtitleEs' => 'DISEÑO & VISUALIZACIÓN COMERCIAL',
                'subtitleEn' => 'COMMERCIAL DESIGN & 3D VISUALIZATION',
                'descEs' => 'Creación de geometría 3D de alta fidelidad, modelado hard-surface, stands comerciales para exposiciones, texturizado PBR e iluminación fotográfica con Blender y Octane Render.',
                'descEn' => 'High-fidelity 3D geometry creation, hard-surface modeling, commercial exhibition stands, PBR texturing, and photorealistic studio lighting with Blender and Octane Render.',
                'image' => '/images/orbit-stand.webp',
                'slides' => json_encode([
                    ['id' => 's3d-1', 'image' => '/images/orbit-stand.webp', 'title' => 'Orbit 3D Stand', 'visible' => true],
                    ['id' => 's3d-2', 'image' => '/images/retro-mini.jpg', 'title' => 'Retro Mini Classic', 'visible' => true],
                    ['id' => 's3d-3', 'image' => '/images/orbit-carrito.png', 'title' => 'Street Craft Gourmet 3D', 'visible' => true]
                ]),
                'targetProjectId' => 'orbit-stand-exhibition',
                'visible' => 1,
                'display_order' => 1,
                'updatedAt' => date('c')
            ],
            [
                'id' => 'branding',
                'number' => '02',
                'verticalTextEs' => 'IDENTIDAD VISUAL & SISTEMAS DE MARCA',
                'verticalTextEn' => 'VISUAL IDENTITY & BRAND SYSTEMS',
                'titleEs' => 'BRANDING',
                'titleEn' => 'BRANDING',
                'subtitleEs' => 'DISEÑO DE IDENTIDAD & DIRECCIÓN DE ARTE',
                'subtitleEn' => 'IDENTITY DESIGN & ART DIRECTION',
                'descEs' => 'Desarrollo integral de identidades corporativas, logotipos memorables, manuales de marca, empaques y universos visuales distintivos que posicionan marcas con autoridad en su industria.',
                'descEn' => 'Comprehensive corporate brand identities, memorable logos, brand style guidelines, packaging, and distinctive visual ecosystems crafted to position brands ahead.',
                'image' => '/images/orbit-stand-diana.webp',
                'slides' => json_encode([
                    ['id' => 'sbr-1', 'image' => '/images/orbit-stand-diana.webp', 'title' => 'Diana Brand Experience 3D', 'visible' => true],
                    ['id' => 'sbr-2', 'image' => '/images/brands/holy-nation.webp', 'title' => 'Holy Nation Identity', 'visible' => true],
                    ['id' => 'sbr-3', 'image' => '/images/brands/cattleya.webp', 'title' => 'Cattleya Floral Studio', 'visible' => true]
                ]),
                'targetProjectId' => 'diana-brand-experience',
                'visible' => 1,
                'display_order' => 2,
                'updatedAt' => date('c')
            ],
            [
                'id' => 'edicion-video',
                'number' => '03',
                'verticalTextEs' => 'MOTION GRAPHICS & POST-PRODUCCIÓN',
                'verticalTextEn' => 'MOTION GRAPHICS & POST-PRODUCTION',
                'titleEs' => 'EDICIÓN DE VIDEO',
                'titleEn' => 'VIDEO EDITING',
                'subtitleEs' => 'MONTAJE CINEMATOGRÁFICO & RITMO VISUAL',
                'subtitleEn' => 'CINEMATIC EDITING & VISUAL PACING',
                'descEs' => 'Edición audiovisual dinámica, corrección de color profesional, animación tipográfica y motion graphics con After Effects y Premiere Pro para spots publicitarios y campañas de alto impacto.',
                'descEn' => 'Dynamic audiovisual editing, professional color grading, kinetic typography, and motion graphics with After Effects and Premiere Pro for commercials and high-converting campaigns.',
                'image' => '/images/diplomados/diplomado-after-effects-2023.webp',
                'slides' => json_encode([
                    ['id' => 'svid-1', 'image' => '/images/diplomados/diplomado-after-effects-2023.webp', 'title' => 'After Effects Master Suite', 'visible' => true],
                    ['id' => 'svid-2', 'image' => '/images/hero-hands.jpg', 'title' => 'Kinetic Motion Typography', 'visible' => true]
                ]),
                'targetProjectId' => 'cyber-kinetic-intro',
                'visible' => 1,
                'display_order' => 3,
                'updatedAt' => date('c')
            ],
            [
                'id' => 'social-media',
                'number' => '04',
                'verticalTextEs' => 'ESTRATEGIA VISUAL & CONTENIDO DIGITAL',
                'verticalTextEn' => 'VISUAL STRATEGY & DIGITAL CONTENT',
                'titleEs' => 'SOCIAL MEDIA DESIGNER',
                'titleEn' => 'SOCIAL MEDIA DESIGNER',
                'subtitleEs' => 'CONTENIDO DE ALTO ENGAGEMENT & DISEÑO DIGITAL',
                'subtitleEn' => 'HIGH-ENGAGEMENT CONTENT & DIGITAL DESIGN',
                'descEs' => 'Diseño estratégico de piezas gráficas para redes sociales, carruseles de alto valor, creatividades publicitarias y feeds optimizados para maximizar la retención, interacción y conversiones.',
                'descEn' => 'Strategic social media graphic design, high-value educational carousels, ad creatives, and optimized feeds designed to maximize audience retention, engagement, and conversion.',
                'image' => '/images/diplomados/diplomado 2-Taller-de-creacion-de-contenido-2025.webp',
                'slides' => json_encode([
                    ['id' => 'ssm-1', 'image' => '/images/diplomados/diplomado 2-Taller-de-creacion-de-contenido-2025.webp', 'title' => 'Content Creation Masterclass 2025', 'visible' => true],
                    ['id' => 'ssm-2', 'image' => '/images/orbit-tablet.webp', 'title' => 'Interactive Tablet & Digital Feed', 'visible' => true]
                ]),
                'targetProjectId' => 'digital-product-ui-3d',
                'visible' => 1,
                'display_order' => 4,
                'updatedAt' => date('c')
            ]
        ];

        $insertDiscSql = "INSERT INTO `disciplines` (
            `id`, `number`, `verticalTextEs`, `verticalTextEn`, `titleEs`, `titleEn`,
            `subtitleEs`, `subtitleEn`, `descEs`, `descEn`, `image`, `slides`,
            `targetProjectId`, `visible`, `display_order`, `updatedAt`
        ) VALUES (
            :id, :number, :verticalTextEs, :verticalTextEn, :titleEs, :titleEn,
            :subtitleEs, :subtitleEn, :descEs, :descEn, :image, :slides,
            :targetProjectId, :visible, :display_order, :updatedAt
        )";

        $stmtInsertDisc = $pdo->prepare($insertDiscSql);
        foreach ($initialDisciplines as $disc) {
            $stmtInsertDisc->execute($disc);
        }
    }

    // 7. Seed site_sections (About, Experience, Diplomados, Lab 3D) if empty
    $stmtSec = $pdo->query("SELECT COUNT(*) as cnt FROM `site_sections`");
    $secCount = (int)$stmtSec->fetchColumn();

    if ($secCount === 0) {
        $initialSections = [
            'about' => [
                'name' => 'Aylin Daniela Flores',
                'title' => 'Diseñadora Gráfica & Modeladora 3D',
                'location' => 'Sonsonate, El Salvador',
                'bioEs' => 'Licenciada en Artes Plásticas (Opción Diseño Gráfico) graduada de la Universidad de El Salvador. Cuento con más de 6 años de experiencia profesional en identidad visual, modelado 3D, branding, preprensa técnica y edición audiovisual.',
                'bioEn' => 'Bachelor of Fine Arts (Graphic Design Major) from Universidad de El Salvador with 6+ years of professional expertise in visual identity, 3D CGI modeling, commercial branding, prepress, and video editing.',
                'photo' => '/images/fotografia-aylin.png',
                'cvUrl' => '',
                'whatsapp' => '+503 7000 0000',
                'email' => 'aylinflores.diseno@gmail.com',
                'instagram' => 'https://instagram.com/',
                'behance' => 'https://behance.net/',
                'linkedin' => 'https://linkedin.com/'
            ],
            'experience' => [
                [
                    'id' => 'exp-1',
                    'role' => 'Directora del Área de Diseño Gráfico',
                    'company' => 'Imprenta Bifronte',
                    'location' => 'El Salvador',
                    'period' => '2024',
                    'isCurrent' => false,
                    'description' => 'Dirección, gestión y ejecución integral del área de diseño gráfico, responsable del desarrollo completo de piezas visuales y producción publicitaria.',
                    'toolsUsed' => ['Adobe Illustrator', 'Adobe Photoshop', 'Pre-prensa / CMYK', 'Diseño Publicitario']
                ],
                [
                    'id' => 'exp-2',
                    'role' => 'Diseñadora Gráfica & Modeladora 3D Freelance',
                    'company' => 'Proyectos Independientes',
                    'location' => 'Sonsonate, El Salvador (Remoto / Global)',
                    'period' => '2020 - 2026',
                    'isCurrent' => true,
                    'description' => 'Desarrollo de proyectos de diseño gráfico y comunicación visual: branding, logotipos, material publicitario, modelado 3D y edición de video.',
                    'toolsUsed' => ['Blender', 'ZBrush', 'Adobe Illustrator', 'Adobe Photoshop', 'After Effects', 'CapCut']
                ],
                [
                    'id' => 'exp-3',
                    'role' => 'Atención al Cliente y Gestión Comercial',
                    'company' => 'Lácteos Adriana',
                    'location' => 'El Salvador',
                    'period' => '2018 - 2024',
                    'isCurrent' => false,
                    'description' => 'Manejo integral del proceso de ventas, orientación personalizada, control riguroso de calidad operativa y servicio al cliente.',
                    'toolsUsed' => ['Gestión Comercial', 'Atención al Cliente', 'Control de Calidad', 'Microsoft Excel']
                ]
            ],
            'diplomados' => [
                [
                    'id' => 'dip-1',
                    'title' => 'Diplomado Adobe After Effects (2023)',
                    'src' => '/images/diplomados/diplomado-after-effects-2023.webp',
                    'year' => '2023',
                    'visible' => true
                ],
                [
                    'id' => 'dip-2',
                    'title' => 'Taller de Creación de Contenido (2025)',
                    'src' => '/images/diplomados/diplomado-creacion-contenido-2025.webp',
                    'year' => '2025',
                    'visible' => true
                ],
                [
                    'id' => 'dip-3',
                    'title' => 'Diseño Gráfico Publicitario (2021)',
                    'src' => '/images/diplomados/diplomado-diseno-grafico-publicitario-2021.webp',
                    'year' => '2021',
                    'visible' => true
                ],
                [
                    'id' => 'dip-4',
                    'title' => 'Webinar Branding para Diseñadores (2023)',
                    'src' => '/images/diplomados/diplomado-branding-disenadores-2023.webp',
                    'year' => '2023',
                    'visible' => true
                ],
                [
                    'id' => 'dip-5',
                    'title' => 'Introducción al Diseño Narrativo para Videojuegos',
                    'src' => '/images/diplomados/diplomado-diseno-narrativo-videojuegos.webp',
                    'year' => '2023',
                    'visible' => true
                ],
                [
                    'id' => 'dip-6',
                    'title' => 'Diseño de Personajes para Animación y Videojuegos (2022)',
                    'src' => '/images/diplomados/diplomado-diseno-personajes-animacion-2022.webp',
                    'year' => '2022',
                    'visible' => true
                ]
            ],
            'lab3d' => [
                'titleEs' => 'LABORATORIO 3D INTERACTIVO',
                'titleEn' => 'INTERACTIVE 3D LAB',
                'subtitleEs' => 'Rota, inspecciona la geometría e interactúa con modelos tridimensionales en tiempo real en tu navegador.',
                'subtitleEn' => 'Rotate, inspect geometry, and explore real-time materials in the browser.',
                'defaultModelId' => 'torre-castillo',
                'lightingColor' => '#76FF03',
                'autoRotate' => true,
                'models' => [
                    [
                        'id' => 'torre-castillo',
                        'name' => 'Torre Castillo 3D',
                        'url' => '/models/torre-castillo.glb',
                        'type' => 'glb',
                        'stats' => 'Modelado GLB • Geometría & Texturas PBR',
                        'visible' => true
                    ],
                    [
                        'id' => 'retro-car',
                        'name' => 'Retro Mini 3D',
                        'url' => '',
                        'type' => 'procedural',
                        'proceduralKey' => 'retroCar',
                        'stats' => '24 Vertices • 28 Structural Edges • 4-Wheel Axle Grid',
                        'visible' => true
                    ],
                    [
                        'id' => 'cyber-hand',
                        'name' => 'Tactile Hand',
                        'url' => '',
                        'type' => 'procedural',
                        'proceduralKey' => 'cyberHand',
                        'stats' => '36 Articulated Joints • 42 Phalange Nodes',
                        'visible' => true
                    ],
                    [
                        'id' => 'brand-poly',
                        'name' => 'Polyhedron',
                        'url' => '',
                        'type' => 'procedural',
                        'proceduralKey' => 'brandPoly',
                        'stats' => '12 Facets • 30 Kinetic Edges • Icosahedral Symmetry',
                        'visible' => true
                    ],
                    [
                        'id' => 'hyper-cube',
                        'name' => 'Tesseract 4D',
                        'url' => '',
                        'type' => 'procedural',
                        'proceduralKey' => 'hyperCube',
                        'stats' => '16 Vertices • 32 Isometric Hyper-Edges',
                        'visible' => true
                    ]
                ]
            ]
        ];

        $stmtSecInsert = $pdo->prepare("INSERT INTO `site_sections` (`section_key`, `data`, `updatedAt`) VALUES (:k, :d, :now)");
        foreach ($initialSections as $k => $d) {
            $stmtSecInsert->execute([
                ':k' => $k,
                ':d' => json_encode($d, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                ':now' => date('c')
            ]);
        }
    }

    // Refresh counts
    $finalProjects = (int)$pdo->query("SELECT COUNT(*) FROM `projects`")->fetchColumn();
    $finalDisciplines = (int)$pdo->query("SELECT COUNT(*) FROM `disciplines`")->fetchColumn();
    $finalSections = (int)$pdo->query("SELECT COUNT(*) FROM `site_sections`")->fetchColumn();

    sendJsonResponse([
        'success'         => true,
        'message'         => 'Base de datos MySQL en Hostinger inicializada con éxito.',
        'database'        => DB_NAME,
        'user'            => DB_USER,
        'totalProjects'   => $finalProjects,
        'totalDisciplines'=> $finalDisciplines,
        'totalSections'   => $finalSections,
        'uploadsReady'    => is_writable(UPLOAD_DIR)
    ]);

} catch (PDOException $e) {
    sendJsonResponse([
        'success' => false,
        'error'   => 'Error al crear tablas en MySQL: ' . $e->getMessage()
    ], 500);
}
