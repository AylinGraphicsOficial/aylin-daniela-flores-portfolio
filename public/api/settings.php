<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Site Sections & Settings REST API (About, Experience, Diplomados, 3D Lab, Profile)
 *
 * Anti-sobrescritura: cada guardado viaja con la marca de tiempo del cliente
 * (encabezado X-Updated-At). Si el registro en MySQL es más reciente que esa
 * marca, la escritura se omite para no perder cambios hechos desde otro equipo.
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

    $stmt = $pdo->query("SELECT `section_key`, `data`, `updatedAt` FROM `site_sections`");
    $rows = $stmt->fetchAll();

    $settings = [];
    $meta = [];
    foreach ($rows as $r) {
        $decoded = json_decode($r['data'], true);
        $settings[$r['section_key']] = is_array($decoded) ? $decoded : [];
        $meta[$r['section_key']] = $r['updatedAt'];
    }

    // `__meta` expone las marcas de tiempo por sección sin alterar la forma de
    // los datos (las secciones tipo lista deben seguir siendo arreglos).
    $settings['__meta'] = $meta;

    sendJsonResponse($settings);
}

// ==================== POST / PUT: Update Section Data ====================
if ($method === 'POST' || $method === 'PUT') {
    $payload = getJsonPayload();

    if (!is_array($payload)) {
        sendJsonResponse(['error' => 'Datos inválidos'], 400);
    }

    // Marca de tiempo del cliente (encabezado o campo dentro del payload).
    $incomingUpdatedAt = '';
    if (!empty($_SERVER['HTTP_X_UPDATED_AT'])) {
        $incomingUpdatedAt = (string)$_SERVER['HTTP_X_UPDATED_AT'];
    } elseif (!empty($payload['updatedAt'])) {
        $incomingUpdatedAt = (string)$payload['updatedAt'];
    }

    $upsertSql = "
        INSERT INTO `site_sections` (`section_key`, `data`, `updatedAt`)
        VALUES (:k, :d, :now)
        ON DUPLICATE KEY UPDATE `data` = VALUES(`data`), `updatedAt` = VALUES(`updatedAt`)
    ";

    if (!empty($section)) {
        // Guardar una sola sección
        $stmtExisting = $pdo->prepare("SELECT `updatedAt` FROM `site_sections` WHERE `section_key` = :k LIMIT 1");
        $stmtExisting->execute([':k' => $section]);
        $existingUpdatedAt = $stmtExisting->fetchColumn();

        if (!shouldApplyIncomingWrite($incomingUpdatedAt, $existingUpdatedAt ?: null)) {
            sendJsonResponse([
                'success'  => true,
                'skipped'  => true,
                'message'  => "La sección '{$section}' tiene cambios más recientes en el servidor; no se sobrescribió.",
                'serverUpdatedAt' => $existingUpdatedAt
            ]);
        }

        $jsonStr = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $stmt = $pdo->prepare($upsertSql);
        $stmt->execute([
            ':k'   => $section,
            ':d'   => $jsonStr,
            ':now' => normalizeIncomingTimestamp($incomingUpdatedAt)
        ]);

        sendJsonResponse([
            'success' => true,
            'message' => "Sección '{$section}' guardada exitosamente en Hostinger MySQL.",
            'updatedAt' => normalizeIncomingTimestamp($incomingUpdatedAt)
        ]);
    }

    // Guardado masivo de secciones
    $stmtExisting = $pdo->prepare("SELECT `updatedAt` FROM `site_sections` WHERE `section_key` = :k LIMIT 1");
    $stmt = $pdo->prepare($upsertSql);
    $saved = [];
    $skipped = [];

    foreach ($payload as $secKey => $secData) {
        if ($secKey === '__meta' || !is_string($secKey) || $secKey === '') {
            continue;
        }
        $stmtExisting->execute([':k' => $secKey]);
        $existingUpdatedAt = $stmtExisting->fetchColumn();
        if (!shouldApplyIncomingWrite($incomingUpdatedAt, $existingUpdatedAt ?: null)) {
            $skipped[] = $secKey;
            continue;
        }
        $stmt->execute([
            ':k'   => $secKey,
            ':d'   => json_encode($secData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            ':now' => normalizeIncomingTimestamp($incomingUpdatedAt)
        ]);
        $saved[] = $secKey;
    }

    sendJsonResponse([
        'success' => true,
        'message' => $skipped
            ? 'Configuraciones guardadas (algunas secciones se conservaron por ser más recientes en el servidor).'
            : 'Configuraciones de secciones guardadas con éxito en Hostinger MySQL.',
        'saved'   => $saved,
        'skipped' => $skipped
    ]);
}

sendJsonResponse(['error' => 'Método no permitido'], 405);
