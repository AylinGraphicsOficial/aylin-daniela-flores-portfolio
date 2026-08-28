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
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Token");
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
