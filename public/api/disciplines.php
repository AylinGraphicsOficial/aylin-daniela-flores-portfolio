<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Disciplines & Sliders REST API Endpoint
 */

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

if (!$pdo) {
    sendJsonResponse(['error' => 'Base de datos temporalmente no disponible'], 500);
}

$method = $_SERVER['REQUEST_METHOD'];

// ==================== GET: List all disciplines with slides ====================
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM `disciplines` ORDER BY `display_order` ASC, `number` ASC");
    $rows = $stmt->fetchAll();

    $disciplines = array_map(function($row) {
        return [
            'id'             => $row['id'],
            'number'         => $row['number'],
            'verticalTextEs' => $row['verticalTextEs'] ?? '',
            'verticalTextEn' => $row['verticalTextEn'] ?? '',
            'titleEs'        => $row['titleEs'],
            'titleEn'        => $row['titleEn'],
            'subtitleEs'     => $row['subtitleEs'] ?? '',
            'subtitleEn'     => $row['subtitleEn'] ?? '',
            'descEs'         => $row['descEs'] ?? '',
            'descEn'         => $row['descEn'] ?? '',
            'image'          => $row['image'],
            'slides'         => json_decode($row['slides'] ?? '[]', true) ?: [],
            'targetProjectId'=> $row['targetProjectId'] ?? '',
            'visible'        => (bool)$row['visible'],
            'display_order'  => (int)$row['display_order'],
            'updatedAt'      => $row['updatedAt']
        ];
    }, $rows);

    sendJsonResponse($disciplines);
}

// ==================== POST: Update / Save Disciplines ====================
if ($method === 'POST' || $method === 'PUT') {
    $payload = getJsonPayload();

    if (isset($payload['disciplines']) && is_array($payload['disciplines'])) {
        $disciplinesList = $payload['disciplines'];
    } elseif (isset($payload['id'])) {
        $disciplinesList = [$payload];
    } else {
        sendJsonResponse(['error' => 'Datos inválidos'], 400);
    }

    $upsertSql = "INSERT INTO `disciplines` (
        `id`, `number`, `verticalTextEs`, `verticalTextEn`, `titleEs`, `titleEn`,
        `subtitleEs`, `subtitleEn`, `descEs`, `descEn`, `image`, `slides`,
        `targetProjectId`, `visible`, `display_order`, `updatedAt`
    ) VALUES (
        :id, :number, :verticalTextEs, :verticalTextEn, :titleEs, :titleEn,
        :subtitleEs, :subtitleEn, :descEs, :descEn, :image, :slides,
        :targetProjectId, :visible, :display_order, :updatedAt
    ) ON DUPLICATE KEY UPDATE
        `number` = VALUES(`number`),
        `verticalTextEs` = VALUES(`verticalTextEs`),
        `verticalTextEn` = VALUES(`verticalTextEn`),
        `titleEs` = VALUES(`titleEs`),
        `titleEn` = VALUES(`titleEn`),
        `subtitleEs` = VALUES(`subtitleEs`),
        `subtitleEn` = VALUES(`subtitleEn`),
        `descEs` = VALUES(`descEs`),
        `descEn` = VALUES(`descEn`),
        `image` = VALUES(`image`),
        `slides` = VALUES(`slides`),
        `targetProjectId` = VALUES(`targetProjectId`),
        `visible` = VALUES(`visible`),
        `display_order` = VALUES(`display_order`),
        `updatedAt` = VALUES(`updatedAt`)
    ";

    $stmtUpsert = $pdo->prepare($upsertSql);

    foreach ($disciplinesList as $index => $item) {
        $slidesJson = is_array($item['slides'] ?? null)
            ? json_encode($item['slides'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            : (is_string($item['slides'] ?? null) ? $item['slides'] : '[]');

        $stmtUpsert->execute([
            ':id'             => $item['id'],
            ':number'         => $item['number'] ?? '0' . ($index + 1),
            ':verticalTextEs' => $item['verticalTextEs'] ?? '',
            ':verticalTextEn' => $item['verticalTextEn'] ?? '',
            ':titleEs'        => $item['titleEs'] ?? '',
            ':titleEn'        => $item['titleEn'] ?? '',
            ':subtitleEs'     => $item['subtitleEs'] ?? '',
            ':subtitleEn'     => $item['subtitleEn'] ?? '',
            ':descEs'         => $item['descEs'] ?? '',
            ':descEn'         => $item['descEn'] ?? '',
            ':image'          => $item['image'] ?? '/images/orbit-stand.webp',
            ':slides'         => $slidesJson,
            ':targetProjectId'=> $item['targetProjectId'] ?? '',
            ':visible'        => isset($item['visible']) && !$item['visible'] ? 0 : 1,
            ':display_order'  => isset($item['display_order']) ? (int)$item['display_order'] : $index + 1,
            ':updatedAt'      => date('c')
        ]);
    }

    sendJsonResponse([
        'success' => true,
        'message' => 'Disciplinas y sliders sincronizados exitosamente con Hostinger MySQL.'
    ]);
}
