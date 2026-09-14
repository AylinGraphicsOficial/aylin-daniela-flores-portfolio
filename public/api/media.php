<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Protected Media Server & Storage Maintenance API
 *
 * Sirve los archivos de /uploads/* desde el almacenamiento protegido
 * (fuera de public_html) cuando la copia pública ya no existe, y expone
 * acciones de mantenimiento para migrar, reparar y diagnosticar medios.
 *
 *   GET /api/media.php?f=<filename>          -> sirve el archivo
 *   GET /api/media.php?action=status&key=... -> estado del almacenamiento
 *   GET /api/media.php?action=migrate&key=.. -> respalda medios existentes
 *   GET /api/media.php?action=repair&key=... -> restaura copias públicas
 *   GET /api/media.php?action=doctor&key=... -> diagnostico de medios rotos
 */

require_once __DIR__ . '/config.php';

$action = isset($_GET['action']) ? (string)$_GET['action'] : '';

if ($action === '') {
    serveMediaFile(isset($_GET['f']) ? (string)$_GET['f'] : '');
    exit();
}

// ==================== ACCIONES DE MANTENIMIENTO ====================
$providedKey = isset($_GET['key']) ? (string)$_GET['key'] : '';
if (!hash_equals(MEDIA_ADMIN_KEY, $providedKey)) {
    sendJsonResponse(['success' => false, 'error' => 'Clave de mantenimiento inválida.'], 403);
}

if ($action === 'status') {
    ensureMediaDirectories();
    $secureCount = countMediaFiles(SECURE_UPLOAD_DIR);
    $publicCount = countMediaFiles(LEGACY_PUBLIC_UPLOAD_DIR);
    sendJsonResponse([
        'success'          => true,
        'protectedDir'     => SECURE_UPLOAD_DIR,
        'publicDir'        => LEGACY_PUBLIC_UPLOAD_DIR,
        'protectedWritable'=> is_dir(SECURE_UPLOAD_DIR) && is_writable(SECURE_UPLOAD_DIR),
        'publicWritable'   => is_dir(LEGACY_PUBLIC_UPLOAD_DIR) && is_writable(LEGACY_PUBLIC_UPLOAD_DIR),
        'protectedFiles'   => $secureCount,
        'publicFiles'      => $publicCount,
        'mode'             => SECURE_UPLOAD_DIR !== LEGACY_PUBLIC_UPLOAD_DIR ? 'protected' : 'legacy',
        'backupHealthy'    => SECURE_UPLOAD_DIR !== LEGACY_PUBLIC_UPLOAD_DIR && is_dir(SECURE_UPLOAD_DIR) && is_writable(SECURE_UPLOAD_DIR),
        'uploadsUrlPrefix' => UPLOAD_URL_PATH
    ]);
}

if ($action === 'migrate') {
    ensureMediaDirectories();
    $report = migrateLegacyUploads();
    sendJsonResponse([
        'success' => true,
        'message' => 'Respaldo de medios completado.',
        'report'  => $report
    ]);
}

if ($action === 'repair') {
    ensureMediaDirectories();
    $report = restorePublicUploads();
    sendJsonResponse([
        'success' => true,
        'message' => 'Restauración de copias públicas completada.',
        'report'  => $report
    ]);
}

if ($action === 'doctor') {
    ensureMediaDirectories();
    sendJsonResponse([
        'success' => true,
        'report'  => diagnoseMediaIntegrity()
    ]);
}

sendJsonResponse(['success' => false, 'error' => 'Acción desconocida.'], 400);

// ==================== FUNCIONES ====================

/**
 * Sirve un archivo de medios con soporte de HEAD y Range.
 */
function serveMediaFile($rawName) {
    $name = basename(rawurldecode($rawName));
    if (!isSafeMediaFileName($name)) {
        sendMediaNotFound();
    }

    $path = findMediaFile($name);
    if ($path === null) {
        sendMediaNotFound();
    }

    $ext      = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $mimeMap  = mediaMimeMap();
    $mimeType = $mimeMap[$ext] ?? 'application/octet-stream';
    $size     = filesize($path);
    $mtime    = filemtime($path);

    header('Content-Type: ' . $mimeType);
    header('X-Content-Type-Options: nosniff');
    header('Accept-Ranges: bytes');
    header('Cache-Control: public, max-age=31536000, immutable');
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $mtime) . ' GMT');
    header('ETag: "' . md5($name . '-' . $size . '-' . $mtime) . '"');
    if ($ext === 'svg') {
        header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'");
    }

    $start = 0;
    $end   = $size > 0 ? $size - 1 : 0;

    if (!empty($_SERVER['HTTP_RANGE']) && preg_match('/bytes=(\d*)-(\d*)/i', $_SERVER['HTTP_RANGE'], $m)) {
        $rangeStart = $m[1] === '' ? null : (int)$m[1];
        $rangeEnd   = $m[2] === '' ? null : (int)$m[2];
        if ($rangeStart === null && $rangeEnd !== null) {
            // Sufijo: últimos N bytes
            $start = max(0, $size - $rangeEnd);
            $end   = $size - 1;
        } else {
            $start = $rangeStart ?? 0;
            $end   = $rangeEnd !== null ? min($rangeEnd, $size - 1) : $size - 1;
        }
        if ($size === 0 || $start > $end || $start >= $size) {
            header('Content-Range: bytes */' . $size);
            http_response_code(416);
            exit();
        }
        http_response_code(206);
        header('Content-Range: bytes ' . $start . '-' . $end . '/' . $size);
    }

    header('Content-Length: ' . ($end - $start + 1));

    if (strtoupper($_SERVER['REQUEST_METHOD']) === 'HEAD') {
        exit();
    }

    while (ob_get_level() > 0) {
        @ob_end_clean();
    }

    $handle = @fopen($path, 'rb');
    if ($handle === false) {
        http_response_code(500);
        exit();
    }

    fseek($handle, $start);
    $remaining = $end - $start + 1;
    while ($remaining > 0 && !feof($handle)) {
        $chunkSize = (int)min(262144, $remaining);
        $buffer = fread($handle, $chunkSize);
        if ($buffer === false || $buffer === '') {
            break;
        }
        echo $buffer;
        $remaining -= strlen($buffer);
        @flush();
    }
    fclose($handle);
    exit();
}

function sendMediaNotFound() {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: public, max-age=60');
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Medio no encontrado'], JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Cuenta los archivos de medios válidos en un directorio.
 */
function countMediaFiles($dir) {
    if (!is_dir($dir)) {
        return 0;
    }
    $total = 0;
    $items = @scandir($dir);
    if (!is_array($items)) {
        return 0;
    }
    foreach ($items as $item) {
        if (isSafeMediaFileName($item) && is_file($dir . '/' . $item)) {
            $total++;
        }
    }
    return $total;
}

/**
 * Copia al almacenamiento protegido los medios que solo existen en public_html.
 */
function migrateLegacyUploads() {
    $copied = 0;
    $skipped = 0;
    $failed = 0;
    $bytes = 0;
    $details = [];

    if (!is_dir(SECURE_UPLOAD_DIR) || !is_writable(SECURE_UPLOAD_DIR)) {
        return [
            'copied' => 0,
            'skipped' => 0,
            'failed' => 0,
            'bytes' => 0,
            'details' => [['error' => 'El directorio protegido no es escribible: ' . SECURE_UPLOAD_DIR]]
        ];
    }

    $sources = [LEGACY_PUBLIC_UPLOAD_DIR, LEGACY_REPO_UPLOAD_DIR];
    foreach ($sources as $sourceDir) {
        if (!is_dir($sourceDir) || normalizeFsPath($sourceDir) === normalizeFsPath(SECURE_UPLOAD_DIR)) {
            continue;
        }
        $items = @scandir($sourceDir);
        if (!is_array($items)) {
            continue;
        }
        foreach ($items as $item) {
            if (!isSafeMediaFileName($item)) {
                continue;
            }
            $sourcePath = $sourceDir . '/' . $item;
            if (!is_file($sourcePath)) {
                continue;
            }
            $targetPath = SECURE_UPLOAD_DIR . '/' . $item;
            if (is_file($targetPath) && filesize($targetPath) === filesize($sourcePath)) {
                $skipped++;
                continue;
            }
            if (@copy($sourcePath, $targetPath)) {
                @chmod($targetPath, 0644);
                $copied++;
                $bytes += (int)filesize($sourcePath);
                $details[] = ['file' => $item, 'from' => normalizeFsPath($sourceDir)];
            } else {
                $failed++;
            }
        }
    }

    return [
        'copied'  => $copied,
        'skipped' => $skipped,
        'failed'  => $failed,
        'bytes'   => $bytes,
        'details' => array_slice($details, 0, 50)
    ];
}

/**
 * Restaura en /uploads/ (public_html) las copias que solo viven en el respaldo.
 */
function restorePublicUploads() {
    $restored = 0;
    $already = 0;
    $failed = 0;
    $details = [];

    if (!is_dir(LEGACY_PUBLIC_UPLOAD_DIR)) {
        @mkdir(LEGACY_PUBLIC_UPLOAD_DIR, 0755, true);
    }
    if (!is_dir(LEGACY_PUBLIC_UPLOAD_DIR) || !is_writable(LEGACY_PUBLIC_UPLOAD_DIR)) {
        return [
            'restored' => 0,
            'alreadyPresent' => 0,
            'failed' => 0,
            'details' => [['error' => 'El directorio público no es escribible: ' . LEGACY_PUBLIC_UPLOAD_DIR]]
        ];
    }

    $items = @scandir(SECURE_UPLOAD_DIR);
    if (!is_array($items)) {
        return ['restored' => 0, 'alreadyPresent' => 0, 'failed' => 0, 'details' => []];
    }

    foreach ($items as $item) {
        if (!isSafeMediaFileName($item)) {
            continue;
        }
        $sourcePath = SECURE_UPLOAD_DIR . '/' . $item;
        if (!is_file($sourcePath)) {
            continue;
        }
        $targetPath = LEGACY_PUBLIC_UPLOAD_DIR . '/' . $item;
        if (is_file($targetPath) && filesize($targetPath) === filesize($sourcePath)) {
            $already++;
            continue;
        }
        if (@copy($sourcePath, $targetPath)) {
            @chmod($targetPath, 0644);
            $restored++;
            $details[] = ['file' => $item];
        } else {
            $failed++;
        }
    }

    return [
        'restored'       => $restored,
        'alreadyPresent' => $already,
        'failed'         => $failed,
        'details'        => array_slice($details, 0, 50)
    ];
}

/**
 * Recorre un valor JSON y recolecta rutas referenciadas bajo /uploads/.
 */
function collectUploadReferences($value, $path, &$references) {
    if (is_array($value)) {
        foreach ($value as $key => $item) {
            collectUploadReferences($item, $path . '/' . $key, $references);
        }
        return;
    }
    if (!is_string($value)) {
        return;
    }
    $decoded = json_decode($value, true);
    if (is_array($decoded)) {
        collectUploadReferences($decoded, $path, $references);
        return;
    }
    if (strpos($value, '/uploads/') === 0) {
        $fileName = basename($value);
        if ($fileName !== '' && $fileName !== '.') {
            if (!isset($references[$fileName])) {
                $references[$fileName] = [];
            }
            if (!in_array($path, $references[$fileName], true)) {
                $references[$fileName][] = $path;
            }
        }
    }
}

/**
 * Diagnóstico de integridad: referencias rotas y archivos huérfanos.
 */
function diagnoseMediaIntegrity() {
    $references = [];
    $pdo = getDbConnection();

    if ($pdo) {
        try {
            $rows = $pdo->query("SELECT `id`, `image`, `galleryImages`, `logo`, `sliderImage`, `videoClip`, `gifUrl` FROM `projects`")->fetchAll();
            foreach ($rows as $row) {
                $prefix = 'proyecto:' . $row['id'];
                foreach (['image', 'logo', 'sliderImage', 'videoClip', 'gifUrl'] as $field) {
                    collectUploadReferences($row[$field] ?? '', $prefix . '.' . $field, $references);
                }
                collectUploadReferences($row['galleryImages'] ?? '', $prefix . '.galleryImages', $references);
            }
        } catch (Exception $e) {
            // Se continua con el resto de tablas
        }

        try {
            $rows = $pdo->query("SELECT `section_key`, `data` FROM `site_sections`")->fetchAll();
            foreach ($rows as $row) {
                collectUploadReferences($row['data'] ?? '', 'seccion:' . $row['section_key'], $references);
            }
        } catch (Exception $e) {
        }
    }

    $missing = [];
    $present = 0;
    foreach ($references as $fileName => $paths) {
        if (findMediaFile($fileName) !== null) {
            $present++;
            continue;
        }
        $missing[] = [
            'filename'   => $fileName,
            'url'        => UPLOAD_URL_PATH . '/' . $fileName,
            'referenced' => array_values($paths),
        ];
    }

    // Archivos huérfanos (existen pero ninguna sección los referencia)
    $orphans = [];
    foreach (getMediaSourceDirs() as $dir) {
        $items = @scandir($dir);
        if (!is_array($items)) {
            continue;
        }
        foreach ($items as $item) {
            if (!isSafeMediaFileName($item) || isset($references[$item]) || isset($orphans[$item])) {
                continue;
            }
            $orphans[$item] = [
                'filename' => $item,
                'url'      => UPLOAD_URL_PATH . '/' . $item,
                'size'     => (int)@filesize($dir . '/' . $item),
            ];
        }
    }

    return [
        'referencedFiles' => count($references),
        'presentFiles'    => $present,
        'missingCount'    => count($missing),
        'missing'         => $missing,
        'orphanCount'     => count($orphans),
        'orphans'         => array_slice(array_values($orphans), 0, 100),
        'protectedDir'    => SECURE_UPLOAD_DIR,
        'publicDir'       => LEGACY_PUBLIC_UPLOAD_DIR,
    ];
}
