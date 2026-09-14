<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Backend Configuration & Database Connection
 */

// Error reporting settings
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// Set UTF-8 encoding
mb_internal_encoding('UTF-8');

// Global CORS & JSON Headers
function sendCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Token, X-Updated-At");
    header("Access-Control-Max-Age: 86400");
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

sendCorsHeaders();

// Database credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'u888615463_2026_portfolio');
define('DB_USER', 'u888615463_2026_admin');
define('DB_PASS', 'Aylin2026.');
define('DB_CHARSET', 'utf8mb4');

// Base URLs and Paths
define('UPLOAD_DIR', __DIR__ . '/../uploads');
define('UPLOAD_URL_PATH', '/uploads');

// ---------------------------------------------------------------------------
// ALMACENAMIENTO DE MEDIOS RESILIENTE
// ---------------------------------------------------------------------------
// El despliegue en Hostinger recrea `public_html` (clon Git + FTP) y elimina
// todo archivo que no esté versionado en el repositorio. Por eso los archivos
// subidos desde el Dashboard NUNCA deben vivir solo dentro de public_html.
// Se guardan en un directorio protegido FUERA del web root y se sirven con
// `api/media.php` (el .htaccess redirige /uploads/* faltantes a ese endpoint).
define('LEGACY_PUBLIC_UPLOAD_DIR', __DIR__ . '/../uploads');
define('LEGACY_REPO_UPLOAD_DIR', __DIR__ . '/../public/uploads');
define('MEDIA_ADMIN_KEY', 'kinetic-media-2026');

/**
 * Normaliza una ruta absoluta para comparaciones (formato POSIX, sin barra final).
 */
function normalizeFsPath($path) {
    $path = str_replace('\\', '/', rtrim((string)$path, '/\\'));
    return $path;
}

/**
 * Document root normalizado (o cadena vacía si no se puede determinar).
 */
function getDocumentRootPath() {
    static $docRoot = null;
    if ($docRoot !== null) {
        return $docRoot;
    }
    $candidates = [];
    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $candidates[] = $_SERVER['DOCUMENT_ROOT'];
    }
    if (defined('LEGACY_PUBLIC_UPLOAD_DIR')) {
        $candidates[] = dirname(normalizeFsPath(LEGACY_PUBLIC_UPLOAD_DIR));
    }
    // El web root real suele ser el directorio padre de /api.
    $real = realpath(dirname(__DIR__));
    if ($real !== false) {
        $candidates[] = $real;
    }
    $docRoot = '';
    foreach ($candidates as $candidate) {
        $normalized = normalizeFsPath($candidate);
        if ($normalized !== '' && is_dir($normalized)) {
            $docRoot = $normalized;
            break;
        }
    }
    return $docRoot;
}

/**
 * Directorio protegido de medios (fuera de public_html cuando es posible).
 * Si ninguna ruta externa es utilizable, devuelve el directorio clásico.
 */
function resolveSecureUploadDir() {
    static $resolved = null;
    if ($resolved !== null) {
        return $resolved;
    }

    $docRoot = getDocumentRootPath();
    $candidates = [
        dirname(__DIR__, 2) . '/uploads_storage',
        dirname(__DIR__, 3) . '/uploads_storage',
    ];

    foreach ($candidates as $candidate) {
        $normalized = normalizeFsPath($candidate);
        // Descartar rutas dentro del web root: se borrarían en cada despliegue.
        if ($docRoot !== '' && strpos($normalized . '/', $docRoot . '/') === 0) {
            continue;
        }
        if (is_dir($candidate) && is_writable($candidate)) {
            $resolved = $candidate;
            return $resolved;
        }
        $parent = dirname($candidate);
        if (is_dir($parent) && is_writable($parent)) {
            $resolved = $candidate;
            return $resolved;
        }
    }

    $resolved = LEGACY_PUBLIC_UPLOAD_DIR;
    return $resolved;
}

define('SECURE_UPLOAD_DIR', resolveSecureUploadDir());

/**
 * Crea (si hace falta) los directorios de medios y devuelve los que existen.
 */
function ensureMediaDirectories() {
    $dirs = [SECURE_UPLOAD_DIR, LEGACY_PUBLIC_UPLOAD_DIR];
    foreach ($dirs as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
    }
    return getMediaSourceDirs();
}

/**
 * Directorios de búsqueda de medios, en orden de prioridad.
 */
function getMediaSourceDirs() {
    $candidates = [
        SECURE_UPLOAD_DIR,
        LEGACY_PUBLIC_UPLOAD_DIR,
        LEGACY_REPO_UPLOAD_DIR,
    ];
    $dirs = [];
    foreach ($candidates as $candidate) {
        $normalized = normalizeFsPath($candidate);
        if (in_array($normalized, $dirs, true)) {
            continue;
        }
        if (is_dir($normalized)) {
            $dirs[] = $normalized;
        }
    }
    return $dirs;
}

/**
 * Mapa de extensiones permitidas y su MIME type.
 */
function mediaMimeMap() {
    return [
        'webp' => 'image/webp',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon',
        'gif'  => 'image/gif',
        'mp4'  => 'video/mp4',
        'webm' => 'video/webm',
        'mov'  => 'video/quicktime',
        'ogg'  => 'video/ogg',
        'glb'  => 'model/gltf-binary',
        'gltf' => 'model/gltf+json',
        'pdf'  => 'application/pdf',
    ];
}

/**
 * Valida un nombre de archivo de medios (sin rutas, con extensión permitida).
 */
function isSafeMediaFileName($name) {
    if (!is_string($name) || $name === '' || $name === '.' || $name === '..') {
        return false;
    }
    if ($name[0] === '.' || strpos($name, '/') !== false || strpos($name, '\\') !== false) {
        return false;
    }
    if (!preg_match('/^[A-Za-z0-9][A-Za-z0-9._-]*$/', $name)) {
        return false;
    }
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $map = mediaMimeMap();
    return array_key_exists($ext, $map);
}

/**
 * Busca un archivo de medios en todos los directorios conocidos.
 * @return string|null Ruta absoluta encontrada.
 */
function findMediaFile($name) {
    if (!isSafeMediaFileName($name)) {
        return null;
    }
    foreach (getMediaSourceDirs() as $dir) {
        $candidate = $dir . '/' . $name;
        if (is_file($candidate)) {
            return $candidate;
        }
    }
    return null;
}

/**
 * Guarda anti-sobrescritura: evita que un dispositivo con datos obsoletos
 * reemplace registros más recientes ya guardados en MySQL.
 *
 * Se aplica una tolerancia (por defecto 120 s) para absorber pequeñas
 * diferencias de reloj entre dispositivos sin perder ediciones legítimas.
 *
 * @param string|null $incomingUpdatedAt Marca de tiempo enviada por el cliente.
 * @param string|null $existingUpdatedAt Marca de tiempo almacenada en MySQL.
 * @param int         $toleranceSeconds  Margen de tolerancia por desfase de reloj.
 * @return bool true si la escritura entrante es igual o más reciente.
 */
function shouldApplyIncomingWrite($incomingUpdatedAt, $existingUpdatedAt, $toleranceSeconds = 120) {
    if (empty($existingUpdatedAt)) {
        return true; // Fila nueva o sin marca previa
    }
    $existingTs = strtotime((string)$existingUpdatedAt);
    if ($existingTs === false) {
        return true;
    }
    if (empty($incomingUpdatedAt)) {
        return false; // Sin marca entrante no se pisa un registro con historial
    }
    $incomingTs = strtotime((string)$incomingUpdatedAt);
    if ($incomingTs === false) {
        return false;
    }
    return $incomingTs >= ($existingTs - (int)$toleranceSeconds);
}

/**
 * Normaliza la marca de tiempo entrante (ISO o vacía) a un valor almacenable.
 */
function normalizeIncomingTimestamp($incomingUpdatedAt) {
    if (!empty($incomingUpdatedAt)) {
        $ts = strtotime((string)$incomingUpdatedAt);
        if ($ts !== false) {
            return (string)$incomingUpdatedAt;
        }
    }
    return date('c');
}

/**
 * Get PDO Database Connection with error resilience
 * @return PDO|null
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET . " COLLATE " . DB_CHARSET . "_unicode_ci"
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Log connection error silently
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

/**
 * Helper to output JSON response
 */
function sendJsonResponse($data, $statusCode = 200) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit();
}

/**
 * Helper to get JSON payload from request body
 */
function getJsonPayload() {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return $_POST;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $_POST;
}
