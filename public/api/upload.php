<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Media Upload API Engine (Images, GIFs, MP4/WebM Video Clips, 3D Assets)
 *
 * Estrategia de persistencia (Hostinger):
 *  - Escritura principal en SECURE_UPLOAD_DIR (fuera de public_html), que
 *    sobrevive a los re-despliegues de Git/FTP.
 *  - Copia espejo en /uploads/ (public_html) para servido estático directo.
 *  - Si el archivo desaparece del servidor público, .htaccess redirige a
 *    api/media.php, que lo sirve desde el respaldo protegido.
 */

require_once __DIR__ . '/config.php';

// ==================== GET: List uploaded files ====================
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    ensureMediaDirectories();

    $filesByIndex = [];
    foreach (getMediaSourceDirs() as $dir) {
        $scanned = @scandir($dir);
        if (!is_array($scanned)) {
            continue;
        }
        foreach ($scanned as $item) {
            if ($item === '.' || $item === '..' || $item === '.htaccess') {
                continue;
            }
            if (!isSafeMediaFileName($item)) {
                continue;
            }
            $filePath = $dir . '/' . $item;
            if (!is_file($filePath)) {
                continue;
            }
            if (isset($filesByIndex[$item])) {
                continue; // Ya indexado desde un directorio de mayor prioridad
            }
            $ext = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            $mimeMap = mediaMimeMap();
            $filesByIndex[$item] = [
                'filename'  => $item,
                'url'       => UPLOAD_URL_PATH . '/' . $item,
                'size'      => filesize($filePath),
                'type'      => $mimeMap[$ext] ?? 'application/octet-stream',
                'updatedAt' => date('c', filemtime($filePath)),
                'backedUp'  => is_file(SECURE_UPLOAD_DIR . '/' . $item),
            ];
        }
    }

    $files = array_values($filesByIndex);
    usort($files, function ($a, $b) {
        return strcmp($b['updatedAt'], $a['updatedAt']);
    });

    sendJsonResponse([
        'success'      => true,
        'files'        => $files,
        'storageMode'  => SECURE_UPLOAD_DIR !== LEGACY_PUBLIC_UPLOAD_DIR ? 'protected' : 'legacy',
        'protectedDir' => SECURE_UPLOAD_DIR
    ]);
}

// ==================== POST: Upload single or multiple files ====================
if ($method === 'POST') {
    $fileInput = $_FILES['file'] ?? $_FILES['image'] ?? $_FILES['media'] ?? null;

    if (!$fileInput) {
        sendJsonResponse([
            'success' => false,
            'error'   => 'No se recibió ningún archivo en la petición (campo `file`).'
        ], 400);
    }

    if ($fileInput['error'] !== UPLOAD_ERR_OK) {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE   => 'El archivo excede el tamaño máximo permitido por el servidor.',
            UPLOAD_ERR_FORM_SIZE  => 'El archivo excede el tamaño máximo especificado en el formulario.',
            UPLOAD_ERR_PARTIAL    => 'El archivo solo se subió parcialmente.',
            UPLOAD_ERR_NO_FILE    => 'No se seleccionó ningún archivo.',
            UPLOAD_ERR_NO_TMP_DIR => 'Falta el directorio temporal en el servidor.',
            UPLOAD_ERR_CANT_WRITE => 'Error al escribir el archivo en el disco.',
            UPLOAD_ERR_EXTENSION  => 'Una extensión de PHP detuvo la subida del archivo.'
        ];
        $msg = $errorMessages[$fileInput['error']] ?? 'Error desconocido al subir archivo.';
        sendJsonResponse(['success' => false, 'error' => $msg], 400);
    }

    $originalName = $fileInput['name'];
    $tmpName      = $fileInput['tmp_name'];
    $fileSize     = (int)$fileInput['size'];
    $ext          = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $mimeMap      = mediaMimeMap();

    // Validar extensión permitida
    if (!array_key_exists($ext, $mimeMap)) {
        sendJsonResponse([
            'success' => false,
            'error'   => "Formato .$ext no permitido. Formatos aceptados: WebP, PNG, JPG, GIF, MP4, WebM, MOV, GLB, PDF."
        ], 400);
    }

    // Sanitizar nombre base y generar nombre único
    $cleanBase = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
    $cleanBase = substr((string)$cleanBase, 0, 40);
    $uniqueName = 'upload_' . time() . '_' . substr(md5(uniqid('', true)), 0, 6) . '_' . $cleanBase . '.' . $ext;

    ensureMediaDirectories();

    // Directorio principal (protegido) + espejos públicos
    $primaryDir = SECURE_UPLOAD_DIR;
    if (!is_dir($primaryDir) || !is_writable($primaryDir)) {
        $primaryDir = LEGACY_PUBLIC_UPLOAD_DIR;
    }
    if (!is_dir($primaryDir) || !is_writable($primaryDir)) {
        sendJsonResponse([
            'success' => false,
            'error'   => 'No hay ningún directorio de medios escribible en el servidor.'
        ], 500);
    }

    $destination = $primaryDir . '/' . $uniqueName;
    if (!move_uploaded_file($tmpName, $destination)) {
        sendJsonResponse([
            'success' => false,
            'error'   => 'No se pudo guardar el archivo en el almacenamiento de medios. Verifica los permisos del servidor.'
        ], 500);
    }
    @chmod($destination, 0644);

    // Validación ligera de imágenes rasterizadas (defensa en profundidad)
    if (in_array($ext, ['webp', 'png', 'jpg', 'jpeg', 'gif'], true) && function_exists('getimagesize')) {
        $imageInfo = @getimagesize($destination);
        if ($imageInfo === false) {
            @unlink($destination);
            sendJsonResponse([
                'success' => false,
                'error'   => 'El archivo no es una imagen válida o está dañado.'
            ], 400);
        }
    }

    // Copia espejo en el resto de directorios (servido estático directo)
    $mirrors = [];
    foreach ([SECURE_UPLOAD_DIR, LEGACY_PUBLIC_UPLOAD_DIR] as $dir) {
        $normalized = normalizeFsPath($dir);
        if ($normalized === normalizeFsPath($primaryDir) || !is_dir($normalized)) {
            continue;
        }
        $copyTarget = $normalized . '/' . $uniqueName;
        if (@copy($destination, $copyTarget)) {
            @chmod($copyTarget, 0644);
            $mirrors[] = $copyTarget;
        }
    }

    $publicUrl = UPLOAD_URL_PATH . '/' . $uniqueName;

    // Verificación final: el archivo debe existir físicamente en algún origen servible
    $servedFrom = findMediaFile($uniqueName);
    if ($servedFrom === null) {
        sendJsonResponse([
            'success' => false,
            'error'   => 'El archivo se subió pero no se pudo verificar en el servidor. Inténtalo de nuevo.'
        ], 500);
    }

    // Registro en la biblioteca de medios de MySQL
    $pdo = getDbConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO `media_library` (`filename`, `url`, `fileType`, `fileSize`) VALUES (:fn, :url, :ft, :fs)");
            $stmt->execute([
                ':fn'  => $uniqueName,
                ':url' => $publicUrl,
                ':ft'  => $mimeMap[$ext] ?? 'application/octet-stream',
                ':fs'  => $fileSize
            ]);
        } catch (Exception $e) {
            // Si la tabla no está lista, no se interrumpe la subida
        }
    }

    sendJsonResponse([
        'success'      => true,
        'message'      => 'Archivo subido y respaldado con éxito en Hostinger.',
        'url'          => $publicUrl,
        'filename'     => $uniqueName,
        'originalName' => $originalName,
        'fileType'     => $mimeMap[$ext] ?? 'image/webp',
        'fileSize'     => $fileSize,
        'storage'      => [
            'protected'   => is_file(SECURE_UPLOAD_DIR . '/' . $uniqueName),
            'publicCopy'  => is_file(LEGACY_PUBLIC_UPLOAD_DIR . '/' . $uniqueName),
            'mirrors'     => count($mirrors)
        ],
        'verified'     => true
    ]);
}

sendJsonResponse(['success' => false, 'error' => 'Método no permitido'], 405);
