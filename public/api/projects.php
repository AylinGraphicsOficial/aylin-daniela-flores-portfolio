<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Projects REST API Endpoint
 */

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

// Fallback helper if DB is not available
if (!$pdo) {
    sendJsonResponse([
        'success' => false,
        'error'   => 'Base de datos temporalmente no disponible'
    ], 500);
}

// Auto-migration: ensure all modern columns exist with isolated try-catch blocks
$migrations = [
    "ALTER TABLE `projects` ADD COLUMN `logo` VARCHAR(500) DEFAULT '' AFTER `galleryImages`",
    "ALTER TABLE `projects` ADD COLUMN `sliderImage` VARCHAR(500) DEFAULT '' AFTER `logo`",
    "ALTER TABLE `projects` ADD COLUMN `sliderTitle` VARCHAR(255) DEFAULT '' AFTER `sliderImage`",
    "ALTER TABLE `projects` ADD COLUMN `sliderOrder` INT DEFAULT 0 AFTER `sliderTitle`",
    "ALTER TABLE `projects` ADD COLUMN `externalLink` VARCHAR(1000) DEFAULT '' AFTER `sliderOrder`",
    "ALTER TABLE `projects` ADD COLUMN `externalLinkText` VARCHAR(255) DEFAULT '' AFTER `externalLink`",
    "ALTER TABLE `projects` ADD COLUMN `disciplineId` VARCHAR(100) DEFAULT '' AFTER `externalLinkText`",
    "ALTER TABLE `projects` ADD COLUMN `videoUrl` VARCHAR(1000) DEFAULT '' AFTER `disciplineId`",
    "ALTER TABLE `projects` ADD COLUMN `videoClip` VARCHAR(1000) DEFAULT '' AFTER `videoUrl`",
    "ALTER TABLE `projects` ADD COLUMN `gifUrl` VARCHAR(1000) DEFAULT '' AFTER `videoClip`",
    "ALTER TABLE `projects` ADD COLUMN `visibleInCatalog` TINYINT(1) NOT NULL DEFAULT 1 AFTER `featured`"
];
foreach ($migrations as $migrationSql) {
    try {
        $pdo->exec($migrationSql);
    } catch (Exception $e) {
        // Column already exists or already migrated
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id     = $_GET['id'] ?? '';

// ==================== GET: List all projects or single project ====================
if ($method === 'GET') {
    if (!empty($id)) {
        $stmt = $pdo->prepare("SELECT * FROM `projects` WHERE `id` = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            sendJsonResponse(['error' => 'Proyecto no encontrado'], 404);
        }
        $row['featured'] = (bool)$row['featured'];
        $row['visibleInCatalog'] = !isset($row['visibleInCatalog']) || (bool)$row['visibleInCatalog'];
        $row['galleryImages'] = json_decode($row['galleryImages'] ?? '[]', true) ?: [];
        $row['logo'] = $row['logo'] ?? '';
        $row['sliderImage'] = $row['sliderImage'] ?? '';
        $row['sliderTitle'] = $row['sliderTitle'] ?? '';
        $row['sliderOrder'] = isset($row['sliderOrder']) ? (int)$row['sliderOrder'] : 0;
        $row['externalLink'] = $row['externalLink'] ?? '';
        $row['externalLinkText'] = $row['externalLinkText'] ?? '';
        $row['disciplineId'] = $row['disciplineId'] ?? '';
        $row['tags'] = json_decode($row['tags'] ?? '[]', true) ?: [];
        $row['metrics'] = json_decode($row['metrics'] ?? '[]', true) ?: [];
        sendJsonResponse($row);
    }

    $stmt = $pdo->query("SELECT * FROM `projects` ORDER BY `display_order` ASC, `createdAt` DESC");
    $rows = $stmt->fetchAll();

    $projects = array_map(function($row) {
        return [
            'id'               => $row['id'],
            'title'            => $row['title'],
            'category'         => $row['category'],
            'year'             => $row['year'],
            'client'           => $row['client'],
            'shortDesc'        => $row['shortDesc'],
            'fullDesc'         => $row['fullDesc'],
            'image'            => $row['image'],
            'galleryImages'    => json_decode($row['galleryImages'] ?? '[]', true) ?: [],
            'logo'             => $row['logo'] ?? '',
            'sliderImage'      => $row['sliderImage'] ?? '',
            'sliderTitle'      => $row['sliderTitle'] ?? '',
            'sliderOrder'      => isset($row['sliderOrder']) ? (int)$row['sliderOrder'] : 0,
            'externalLink'     => $row['externalLink'] ?? '',
            'externalLinkText' => $row['externalLinkText'] ?? '',
            'disciplineId'     => $row['disciplineId'] ?? '',
            'videoUrl'         => $row['videoUrl'] ?? '',
            'videoClip'        => $row['videoClip'] ?? '',
            'gifUrl'           => $row['gifUrl'] ?? '',
            'tags'             => json_decode($row['tags'] ?? '[]', true) ?: [],
            'featured'         => (bool)$row['featured'],
            'visibleInCatalog' => !isset($row['visibleInCatalog']) || (bool)$row['visibleInCatalog'],
            'metrics'          => json_decode($row['metrics'] ?? '[]', true) ?: [],
            'display_order'    => (int)$row['display_order'],
            'createdAt'        => $row['createdAt'],
            'updatedAt'        => $row['updatedAt']
        ];
    }, $rows);

    sendJsonResponse($projects);
}

// ==================== POST: Create, Update, Toggle, Delete ====================
if ($method === 'POST' || $method === 'PUT') {
    $payload = getJsonPayload();

    // Action: Toggle Featured
    if ($action === 'toggle_featured' && !empty($id)) {
        $stmt = $pdo->prepare("UPDATE `projects` SET `featured` = NOT `featured`, `updatedAt` = :now WHERE `id` = :id");
        $stmt->execute([':id' => $id, ':now' => date('c')]);
        
        $checkStmt = $pdo->prepare("SELECT `featured` FROM `projects` WHERE `id` = :id LIMIT 1");
        $checkStmt->execute([':id' => $id]);
        $newVal = (bool)$checkStmt->fetchColumn();

        sendJsonResponse([
            'success' => true,
            'id' => $id,
            'featured' => $newVal
        ]);
    }

    // Action: Delete (via POST)
    if ($action === 'delete' && !empty($id)) {
        $stmt = $pdo->prepare("DELETE FROM `projects` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);
        sendJsonResponse(['success' => true, 'id' => $id]);
    }

    // Action: Save single project or array of projects
    if (isset($payload['projects']) && is_array($payload['projects'])) {
        // Bulk save
        $projectsList = $payload['projects'];
    } elseif (isset($payload['id']) || isset($payload['title'])) {
        $projectsList = [$payload];
    } else {
        sendJsonResponse(['error' => 'Datos inválidos'], 400);
    }

    $upsertSql = "INSERT INTO `projects` (
        `id`, `title`, `category`, `year`, `client`, `shortDesc`, `fullDesc`,
        `image`, `galleryImages`, `logo`, `sliderImage`, `sliderTitle`, `sliderOrder`,
        `externalLink`, `externalLinkText`, `disciplineId`,
        `videoUrl`, `videoClip`, `gifUrl`, `tags`,
        `featured`, `visibleInCatalog`, `metrics`, `display_order`, `createdAt`, `updatedAt`
    ) VALUES (
        :id, :title, :category, :year, :client, :shortDesc, :fullDesc,
        :image, :galleryImages, :logo, :sliderImage, :sliderTitle, :sliderOrder,
        :externalLink, :externalLinkText, :disciplineId,
        :videoUrl, :videoClip, :gifUrl, :tags,
        :featured, :visibleInCatalog, :metrics, :display_order, :createdAt, :updatedAt
    ) ON DUPLICATE KEY UPDATE
        `title` = VALUES(`title`),
        `category` = VALUES(`category`),
        `year` = VALUES(`year`),
        `client` = VALUES(`client`),
        `shortDesc` = VALUES(`shortDesc`),
        `fullDesc` = VALUES(`fullDesc`),
        `image` = VALUES(`image`),
        `galleryImages` = VALUES(`galleryImages`),
        `logo` = VALUES(`logo`),
        `sliderImage` = VALUES(`sliderImage`),
        `sliderTitle` = VALUES(`sliderTitle`),
        `sliderOrder` = VALUES(`sliderOrder`),
        `externalLink` = VALUES(`externalLink`),
        `externalLinkText` = VALUES(`externalLinkText`),
        `disciplineId` = VALUES(`disciplineId`),
        `videoUrl` = VALUES(`videoUrl`),
        `videoClip` = VALUES(`videoClip`),
        `gifUrl` = VALUES(`gifUrl`),
        `tags` = VALUES(`tags`),
        `featured` = VALUES(`featured`),
        `visibleInCatalog` = VALUES(`visibleInCatalog`),
        `metrics` = VALUES(`metrics`),
        `display_order` = VALUES(`display_order`),
        `updatedAt` = VALUES(`updatedAt`)
    ";

    try {
        $stmtUpsert = $pdo->prepare($upsertSql);

        foreach ($projectsList as $index => $item) {
            $projId = !empty($item['id']) ? $item['id'] : 'proj-' . time() . '-' . $index;
            $title = $item['title'] ?? 'Nuevo Proyecto';
            $category = $item['category'] ?? '3D MODELING';
            $year = $item['year'] ?? date('Y');
            $client = $item['client'] ?? '';
            $shortDesc = $item['shortDesc'] ?? '';
            $fullDesc = $item['fullDesc'] ?? '';
            $image = $item['image'] ?? '/images/orbit-stand.webp';
            
            $galleryImages = is_array($item['galleryImages'] ?? null) 
                ? json_encode($item['galleryImages'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) 
                : (is_string($item['galleryImages'] ?? null) ? $item['galleryImages'] : '[]');

            $logo = $item['logo'] ?? '';
            $sliderImage = $item['sliderImage'] ?? '';
            $sliderTitle = $item['sliderTitle'] ?? '';
            $sliderOrder = isset($item['sliderOrder']) ? (int)$item['sliderOrder'] : 0;
            $externalLink = $item['externalLink'] ?? '';
            $externalLinkText = $item['externalLinkText'] ?? '';
            $disciplineId = $item['disciplineId'] ?? '';

            $videoUrl = $item['videoUrl'] ?? '';
            $videoClip = $item['videoClip'] ?? '';
            $gifUrl = $item['gifUrl'] ?? '';

            $tags = is_array($item['tags'] ?? null)
                ? json_encode($item['tags'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
                : (is_string($item['tags'] ?? null) ? $item['tags'] : '[]');

            $featured = !empty($item['featured']) ? 1 : 0;
            $visibleInCatalog = isset($item['visibleInCatalog']) && !$item['visibleInCatalog'] ? 0 : 1;

            $metrics = is_array($item['metrics'] ?? null)
                ? json_encode($item['metrics'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
                : (is_string($item['metrics'] ?? null) ? $item['metrics'] : '[]');

            $displayOrder = isset($item['display_order']) ? (int)$item['display_order'] : $index;
            $createdAt = $item['createdAt'] ?? date('c');
            $updatedAt = date('c');

            $stmtUpsert->execute([
                ':id'               => $projId,
                ':title'            => $title,
                ':category'         => $category,
                ':year'             => $year,
                ':client'           => $client,
                ':shortDesc'        => $shortDesc,
                ':fullDesc'         => $fullDesc,
                ':image'            => $image,
                ':galleryImages'    => $galleryImages,
                ':logo'             => $logo,
                ':sliderImage'      => $sliderImage,
                ':sliderTitle'      => $sliderTitle,
                ':sliderOrder'      => $sliderOrder,
                ':externalLink'     => $externalLink,
                ':externalLinkText' => $externalLinkText,
                ':disciplineId'     => $disciplineId,
                ':videoUrl'         => $videoUrl,
                ':videoClip'        => $videoClip,
                ':gifUrl'           => $gifUrl,
                ':tags'             => $tags,
                ':featured'         => $featured,
                ':visibleInCatalog' => $visibleInCatalog,
                ':metrics'          => $metrics,
                ':display_order'    => $displayOrder,
                ':createdAt'        => $createdAt,
                ':updatedAt'        => $updatedAt
            ]);
        }

        sendJsonResponse([
            'success' => true,
            'message' => 'Proyecto(s) guardado(s) exitosamente en Hostinger MySQL.',
            'savedCount' => count($projectsList)
        ]);
    } catch (Exception $e) {
        sendJsonResponse([
            'success' => false,
            'error'   => 'Error al guardar proyecto en Hostinger MySQL: ' . $e->getMessage()
        ], 500);
    }
}

// ==================== DELETE ====================
if ($method === 'DELETE') {
    if (empty($id)) {
        sendJsonResponse(['error' => 'ID no proporcionado'], 400);
    }
    $stmt = $pdo->prepare("DELETE FROM `projects` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);
    sendJsonResponse(['success' => true, 'id' => $id]);
}
