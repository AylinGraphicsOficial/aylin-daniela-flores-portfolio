<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Media Upload API Engine (Images, GIFs, MP4/WebM Video Clips, 3D Assets)
 */

require_once __DIR__ . '/config.php';

// Allowed MIME types and extensions
$allowedExtensions = [
    // Images & Renders
    'webp' => 'image/webp',
    'png'  => 'image/png',
    'jpg'  => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'svg'  => 'image/svg+xml',
    'ico'  => 'image/x-icon',
    // Animated
    'gif'  => 'image/gif',
    // Video clips
    'mp4'  => 'video/mp4',
    'webm' => 'video/webm',
    'mov'  => 'video/quicktime',
    'ogg'  => 'video/ogg',
    // 3D / Documents
    'glb'  => 'model/gltf-binary',
    'gltf' => 'model/gltf+json',
    'pdf'  => 'application/pdf'
];

$uploadDir = UPLOAD_DIR;
if (!file_exists($uploadDir)) {
    @mkdir($uploadDir, 0777, true);
}

$method = $_SERVER['REQUEST_METHOD'];

// ==================== GET: List uploaded files ====================
if ($method === 'GET') {
    $files = [];
    if (file_exists($uploadDir) && is_dir($uploadDir)) {
        $scanned = scandir($uploadDir);
        foreach ($scanned as $item) {
            if ($item === '.' || $item === '..' || $item === '.htaccess') continue;
            $filePath = $uploadDir . '/' . $item;
            if (is_file($filePath)) {
                $ext = strtolower(pathinfo($item, PATHINFO_EXTENSION));
                $files[] = [
                    'filename' => $item,
                    'url'      => UPLOAD_URL_PATH . '/' . $item,
                    'size'     => filesize($filePath),
                    'type'     => $allowedExtensions[$ext] ?? 'application/octet-stream',
                    'updatedAt'=> date('c', filemtime($filePath))
                ];
            }
        }
    }
    // Sort newest first
    usort($files, function($a, $b) {
        return strcmp($b['updatedAt'], $a['updatedAt']);
    });
    sendJsonResponse(['success' => true, 'files' => $files]);
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
    $fileSize     = $fileInput['size'];
    $ext          = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    // Validate extension
    if (!array_key_exists($ext, $allowedExtensions)) {
        sendJsonResponse([
            'success' => false,
            'error'   => "Formato .$ext no permitido. Formatos aceptados: WebP, PNG, JPG, GIF, MP4, WebM, MOV, GLB, PDF."
        ], 400);
    }

    // Sanitize base name
    $cleanBase = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
    $cleanBase = substr($cleanBase, 0, 40); // limit length
    $uniqueName = 'upload_' . time() . '_' . substr(md5(uniqid()), 0, 6) . '_' . $cleanBase . '.' . $ext;
    $destination = $uploadDir . '/' . $uniqueName;

    if (!move_uploaded_file($tmpName, $destination)) {
        sendJsonResponse([
            'success' => false,
            'error'   => 'No se pudo guardar el archivo en el directorio /uploads/. Verifica los permisos del servidor.'
        ], 500);
    }

    @chmod($destination, 0644);

    $publicUrl = UPLOAD_URL_PATH . '/' . $uniqueName;

    // Optional: Log to database
    $pdo = getDbConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO `media_library` (`filename`, `url`, `fileType`, `fileSize`) VALUES (:fn, :url, :ft, :fs)");
            $stmt->execute([
                ':fn'  => $uniqueName,
                ':url' => $publicUrl,
                ':ft'  => $allowedExtensions[$ext] ?? 'application/octet-stream',
                ':fs'  => $fileSize
            ]);
        } catch (Exception $e) {
            // Ignore DB log error if table is not ready
        }
    }

    sendJsonResponse([
        'success'      => true,
        'message'      => 'Archivo subido con éxito a Hostinger.',
        'url'          => $publicUrl,
        'filename'     => $uniqueName,
        'originalName' => $originalName,
        'fileType'     => $allowedExtensions[$ext] ?? 'image/webp',
        'fileSize'     => $fileSize
    ]);
}
