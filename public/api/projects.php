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

// Auto-migration: ensure logo column exists
try {
    $pdo->exec("ALTER TABLE `projects` ADD COLUMN `logo` VARCHAR(500) DEFAULT '' AFTER `galleryImages`");
} catch (Exception $e) {
    // Column already exists or table not ready
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
        $row['galleryImages'] = json_decode($row['galleryImages'] ?? '[]', true) ?: [];
        $row['logo'] = $row['logo'] ?? '';
        $row['tags'] = json_decode($row['tags'] ?? '[]', true) ?: [];
        $row['metrics'] = json_decode($row['metrics'] ?? '[]', true) ?: [];
        sendJsonResponse($row);
    }

    $stmt = $pdo->query("SELECT * FROM `projects` ORDER BY `display_order` ASC, `createdAt` DESC");
    $rows = $stmt->fetchAll();

    $projects = array_map(function($row) {
        return [
            'id'            => $row['id'],
            'title'         => $row['title'],
            'category'      => $row['category'],
            'year'          => $row['year'],
            'client'        => $row['client'],
            'shortDesc'     => $row['shortDesc'],
            'fullDesc'      => $row['fullDesc'],
            'image'         => $row['image'],
            'galleryImages' => json_decode($row['galleryImages'] ?? '[]', true) ?: [],
            'logo'          => $row['logo'] ?? '',
            'videoUrl'      => $row['videoUrl'] ?? '',
            'videoClip'     => $row['videoClip'] ?? '',
            'gifUrl'        => $row['gifUrl'] ?? '',
            'tags'          => json_decode($row['tags'] ?? '[]', true) ?: [],
            'featured'      => (bool)$row['featured'],
            'metrics'       => json_decode($row['metrics'] ?? '[]', true) ?: [],
            'display_order' => (int)$row['display_order'],
            'createdAt'     => $row['createdAt'],
            'updatedAt'     => $row['updatedAt']
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
        `image`, `galleryImages`, `logo`, `videoUrl`, `videoClip`, `gifUrl`, `tags`,
        `featured`, `metrics`, `display_order`, `createdAt`, `updatedAt`
    ) VALUES (
        :id, :title, :category, :year, :client, :shortDesc, :fullDesc,
        :image, :galleryImages, :logo, :videoUrl, :videoClip, :gifUrl, :tags,
        :featured, :metrics, :display_order, :createdAt, :updatedAt
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
        `videoUrl` = VALUES(`videoUrl`),
        `videoClip` = VALUES(`videoClip`),
        `gifUrl` = VALUES(`gifUrl`),
        `tags` = VALUES(`tags`),
        `featured` = VALUES(`featured`),
        `metrics` = VALUES(`metrics`),
        `display_order` = VALUES(`display_order`),
        `updatedAt` = VALUES(`updatedAt`)
    ";

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
        $videoUrl = $item['videoUrl'] ?? '';
        $videoClip = $item['videoClip'] ?? '';
        $gifUrl = $item['gifUrl'] ?? '';

        $tags = is_array($item['tags'] ?? null)
            ? json_encode($item['tags'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            : (is_string($item['tags'] ?? null) ? $item['tags'] : '[]');

        $featured = !empty($item['featured']) ? 1 : 0;

        $metrics = is_array($item['metrics'] ?? null)
            ? json_encode($item['metrics'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            : (is_string($item['metrics'] ?? null) ? $item['metrics'] : '[]');

        $displayOrder = isset($item['display_order']) ? (int)$item['display_order'] : $index;
        $createdAt = $item['createdAt'] ?? date('c');
        $updatedAt = date('c');

        $stmtUpsert->execute([
            ':id'            => $projId,
            ':title'         => $title,
            ':category'      => $category,
            ':year'          => $year,
            ':client'        => $client,
            ':shortDesc'     => $shortDesc,
            ':fullDesc'      => $fullDesc,
            ':image'         => $image,
            ':galleryImages' => $galleryImages,
            ':logo'          => $logo,
            ':videoUrl'      => $videoUrl,
            ':videoClip'     => $videoClip,
            ':gifUrl'        => $gifUrl,
            ':tags'          => $tags,
            ':featured'      => $featured,
            ':metrics'       => $metrics,
            ':display_order' => $displayOrder,
            ':createdAt'     => $createdAt,
            ':updatedAt'     => $updatedAt
        ]);
    }

    sendJsonResponse([
        'success' => true,
        'message' => 'Proyecto(s) guardado(s) exitosamente en Hostinger MySQL.',
        'savedCount' => count($projectsList)
    ]);
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
