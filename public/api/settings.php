<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Site Sections & Settings REST API (About, Experience, Diplomados, 3D Lab, Profile)
 */

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

if (!$pdo) {
    sendJsonResponse(['error' => 'Base de datos temporalmente no disponible'], 500);
}

$method  = $_SERVER['REQUEST_METHOD'];
$section = $_GET['section'] ?? '';

// ==================== GET: Fetch all sections or specific section ====================
if ($method === 'GET') {
    if (!empty($section)) {
        $stmt = $pdo->prepare("SELECT `data` FROM `site_sections` WHERE `section_key` = :k LIMIT 1");
        $stmt->execute([':k' => $section]);
        $raw = $stmt->fetchColumn();
        if (!$raw) {
            sendJsonResponse(['error' => 'Sección no encontrada'], 404);
        }
        sendJsonResponse(json_decode($raw, true) ?: []);
    }

    $stmt = $pdo->query("SELECT `section_key`, `data` FROM `site_sections`");
    $rows = $stmt->fetchAll();

    $settings = [];
    foreach ($rows as $r) {
        $settings[$r['section_key']] = json_decode($r['data'], true) ?: [];
    }

    sendJsonResponse($settings);
}

// ==================== POST / PUT: Update Section Data ====================
if ($method === 'POST' || $method === 'PUT') {
    $payload = getJsonPayload();

    if (!empty($section)) {
        // Save single section
        $jsonStr = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $stmt = $pdo->prepare("
            INSERT INTO `site_sections` (`section_key`, `data`, `updatedAt`)
            VALUES (:k, :d, :now)
            ON DUPLICATE KEY UPDATE `data` = VALUES(`data`), `updatedAt` = VALUES(`updatedAt`)
        ");
        $stmt->execute([
            ':k'   => $section,
            ':d'   => $jsonStr,
            ':now' => date('c')
        ]);

        sendJsonResponse([
            'success' => true,
            'message' => "Sección '{$section}' guardada exitosamente en Hostinger MySQL."
        ]);
    }

    // Bulk save multiple sections
    if (is_array($payload)) {
        $stmt = $pdo->prepare("
            INSERT INTO `site_sections` (`section_key`, `data`, `updatedAt`)
            VALUES (:k, :d, :now)
            ON DUPLICATE KEY UPDATE `data` = VALUES(`data`), `updatedAt` = VALUES(`updatedAt`)
        ");

        foreach ($payload as $secKey => $secData) {
            $stmt->execute([
                ':k'   => $secKey,
                ':d'   => json_encode($secData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                ':now' => date('c')
            ]);
        }

        sendJsonResponse([
            'success' => true,
            'message' => 'Configuraciones de secciones guardadas con éxito en Hostinger MySQL.'
        ]);
    }

    sendJsonResponse(['error' => 'Datos inválidos'], 400);
}
