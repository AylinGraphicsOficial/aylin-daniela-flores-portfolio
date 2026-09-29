<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Metrics, Analytics & Activity Logging REST API
 *
 * Persistencia en MySQL Hostinger:
 * - Registro ultraligero de visitas a la página (País, Día, Dispositivo, Referrer)
 * - Registro de clics y actividad (Proyectos, Botones, Redes, 3D Lab, CV)
 * - Estadísticas agregadas para el Dashboard de Administración
 */

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

if (!$pdo) {
    sendJsonResponse(['success' => false, 'error' => 'Base de datos temporalmente no disponible'], 500);
}

// Asegurar tablas de analíticas
ensureAnalyticsTables($pdo);

$action = isset($_GET['action']) ? strtolower(trim($_GET['action'])) : 'stats';
$method = $_SERVER['REQUEST_METHOD'];

// ==================== ENDPOINT: Track Visit ====================
if ($action === 'track_visit' && ($method === 'POST' || $method === 'GET')) {
    $payload = getJsonPayload() ?: [];
    
    $visitorId = sanitizeStr($payload['visitorId'] ?? ($_GET['visitorId'] ?? ''));
    if (empty($visitorId)) {
        $ip = getClientIp();
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $visitorId = hash('sha256', $ip . '_' . $ua);
    }
    
    $pageUrl   = sanitizeStr($payload['pageUrl'] ?? ($_GET['pageUrl'] ?? '/'));
    $pageTitle = sanitizeStr($payload['pageTitle'] ?? ($_GET['pageTitle'] ?? 'Aylin Daniela Flores | Portafolio'));
    $referrer  = sanitizeStr($payload['referrer'] ?? ($_GET['referrer'] ?? ''));
    
    // País
    $clientCountry = sanitizeStr($payload['countryCode'] ?? '');
    $clientCountryName = sanitizeStr($payload['countryName'] ?? '');
    $geo = resolveCountry($clientCountry, $clientCountryName);
    
    // Dispositivo y Navegador
    $deviceInfo = parseUserAgent();
    $deviceType = !empty($payload['deviceType']) ? sanitizeStr($payload['deviceType']) : $deviceInfo['deviceType'];
    $browser    = !empty($payload['browser']) ? sanitizeStr($payload['browser']) : $deviceInfo['browser'];
    $os         = !empty($payload['os']) ? sanitizeStr($payload['os']) : $deviceInfo['os'];
    
    $ipHash = hash('sha256', getClientIp() . date('Y-m-d'));
    
    // Throttling: si el mismo visitor_id ya visitó la misma página en los últimos 2 minutos, no inflar métricas
    $stmtCheck = $pdo->prepare("
        SELECT `id` FROM `site_visits`
        WHERE `visitor_id` = :vid AND `page_url` = :purl AND `created_at` >= (NOW() - INTERVAL 2 MINUTE)
        LIMIT 1
    ");
    $stmtCheck->execute([':vid' => $visitorId, ':purl' => $pageUrl]);
    
    if (!$stmtCheck->fetch()) {
        $stmtInsert = $pdo->prepare("
            INSERT INTO `site_visits` 
            (`visitor_id`, `page_url`, `page_title`, `referrer`, `country_code`, `country_name`, `city`, `device_type`, `browser`, `os`, `ip_hash`)
            VALUES (:vid, :purl, :ptitle, :ref, :ccode, :cname, :city, :dtype, :browser, :os, :iphash)
        ");
        $stmtInsert->execute([
            ':vid'     => $visitorId,
            ':purl'    => substr($pageUrl, 0, 255),
            ':ptitle'  => substr($pageTitle, 0, 255),
            ':ref'     => substr($referrer, 0, 255),
            ':ccode'   => $geo['code'],
            ':cname'   => $geo['name'],
            ':city'    => sanitizeStr($payload['city'] ?? ''),
            ':dtype'   => $deviceType,
            ':browser' => $browser,
            ':os'      => $os,
            ':iphash'  => $ipHash
        ]);
    }
    
    sendJsonResponse(['success' => true, 'country' => $geo]);
}

// ==================== ENDPOINT: Track Event / Click ====================
if (($action === 'track_click' || $action === 'track_event') && ($method === 'POST' || $method === 'GET')) {
    $payload = getJsonPayload() ?: [];
    
    $visitorId   = sanitizeStr($payload['visitorId'] ?? ($_GET['visitorId'] ?? 'anon'));
    $eventType   = sanitizeStr($payload['eventType'] ?? ($_GET['eventType'] ?? 'click'));
    $eventName   = sanitizeStr($payload['eventName'] ?? ($_GET['eventName'] ?? 'Element Click'));
    $eventTarget = sanitizeStr($payload['eventTarget'] ?? ($_GET['eventTarget'] ?? ''));
    $pageUrl     = sanitizeStr($payload['pageUrl'] ?? ($_GET['pageUrl'] ?? '/'));
    
    $clientCountry = sanitizeStr($payload['countryCode'] ?? '');
    $clientCountryName = sanitizeStr($payload['countryName'] ?? '');
    $geo = resolveCountry($clientCountry, $clientCountryName);
    
    $stmtInsert = $pdo->prepare("
        INSERT INTO `site_events`
        (`visitor_id`, `event_type`, `event_name`, `event_target`, `page_url`, `country_code`, `country_name`)
        VALUES (:vid, :etype, :ename, :etarget, :purl, :ccode, :cname)
    ");
    $stmtInsert->execute([
        ':vid'     => substr($visitorId, 0, 64),
        ':etype'   => substr($eventType, 0, 50),
        ':ename'   => substr($eventName, 0, 255),
        ':etarget' => substr($eventTarget, 0, 255),
        ':purl'    => substr($pageUrl, 0, 255),
        ':ccode'   => $geo['code'],
        ':cname'   => $geo['name']
    ]);
    
    sendJsonResponse(['success' => true]);
}

// ==================== ENDPOINT: Stats Summary for Dashboard ====================
if ($action === 'stats' && $method === 'GET') {
    $range = isset($_GET['range']) ? strtolower($_GET['range']) : '30d';
    
    $daysInterval = 30;
    if ($range === '7d')  $daysInterval = 7;
    if ($range === '14d') $daysInterval = 14;
    if ($range === '90d') $daysInterval = 90;
    if ($range === 'all') $daysInterval = 3650;
    
    // Si la tabla de visitas está vacía, sembrar actividad inicial de muestra para que el dashboard no aparezca en blanco
    seedSampleDataIfEmpty($pdo);
    
    // 1. Totales generales
    $totalVisits = (int)$pdo->query("SELECT COUNT(*) FROM `site_visits`")->fetchColumn();
    $uniqueVisitors = (int)$pdo->query("SELECT COUNT(DISTINCT `visitor_id`) FROM `site_visits`")->fetchColumn();
    $totalClicks = (int)$pdo->query("SELECT COUNT(*) FROM `site_events`")->fetchColumn();
    
    $visitsToday = (int)$pdo->query("SELECT COUNT(*) FROM `site_visits` WHERE DATE(`created_at`) = CURDATE()")->fetchColumn();
    $visitsThisWeek = (int)$pdo->query("SELECT COUNT(*) FROM `site_visits` WHERE `created_at` >= (NOW() - INTERVAL 7 DAY)")->fetchColumn();
    $visitsThisMonth = (int)$pdo->query("SELECT COUNT(*) FROM `site_visits` WHERE `created_at` >= (NOW() - INTERVAL 30 DAY)")->fetchColumn();
    
    // 2. Visitas y clics por día en el rango
    $stmtDays = $pdo->prepare("
        SELECT 
            DATE(`created_at`) as `dt`,
            COUNT(*) as `visits`,
            COUNT(DISTINCT `visitor_id`) as `uniqueVisitors`
        FROM `site_visits`
        WHERE `created_at` >= (NOW() - INTERVAL :days DAY)
        GROUP BY DATE(`created_at`)
        ORDER BY `dt` ASC
    ");
    $stmtDays->bindValue(':days', $daysInterval, PDO::PARAM_INT);
    $stmtDays->execute();
    $daysRaw = $stmtDays->fetchAll();
    
    // Clics por día
    $stmtClicksByDay = $pdo->prepare("
        SELECT 
            DATE(`created_at`) as `dt`,
            COUNT(*) as `clicks`
        FROM `site_events`
        WHERE `created_at` >= (NOW() - INTERVAL :days DAY)
        GROUP BY DATE(`created_at`)
        ORDER BY `dt` ASC
    ");
    $stmtClicksByDay->bindValue(':days', $daysInterval, PDO::PARAM_INT);
    $stmtClicksByDay->execute();
    $clicksByDayRaw = $stmtClicksByDay->fetchAll();
    
    $clicksMap = [];
    foreach ($clicksByDayRaw as $cRow) {
        $clicksMap[$cRow['dt']] = (int)$cRow['clicks'];
    }
    
    $byDays = [];
    foreach ($daysRaw as $dRow) {
        $d = $dRow['dt'];
        $byDays[] = [
            'date'           => $d,
            'visits'         => (int)$dRow['visits'],
            'uniqueVisitors' => (int)$dRow['uniqueVisitors'],
            'clicks'         => $clicksMap[$d] ?? 0
        ];
    }
    
    // 3. Distribución por País
    $stmtCountries = $pdo->prepare("
        SELECT 
            `country_code` as `countryCode`,
            `country_name` as `countryName`,
            COUNT(*) as `visits`
        FROM `site_visits`
        WHERE `created_at` >= (NOW() - INTERVAL :days DAY)
        GROUP BY `country_code`, `country_name`
        ORDER BY `visits` DESC
        LIMIT 20
    ");
    $stmtCountries->bindValue(':days', $daysInterval, PDO::PARAM_INT);
    $stmtCountries->execute();
    $countriesRaw = $stmtCountries->fetchAll();
    
    $countryVisitsSum = 0;
    foreach ($countriesRaw as $c) {
        $countryVisitsSum += (int)$c['visits'];
    }
    if ($countryVisitsSum === 0) $countryVisitsSum = max(1, $totalVisits);
    
    $byCountry = [];
    foreach ($countriesRaw as $c) {
        $v = (int)$c['visits'];
        $byCountry[] = [
            'countryCode' => strtoupper($c['countryCode']),
            'countryName' => $c['countryName'],
            'visits'      => $v,
            'percentage'  => round(($v / $countryVisitsSum) * 100, 1)
        ];
    }
    
    // 4. Conteo de Clics y Elementos Más Populares
    $stmtTopClicks = $pdo->prepare("
        SELECT 
            `event_name` as `eventName`,
            `event_type` as `eventType`,
            COUNT(*) as `count`
        FROM `site_events`
        WHERE `created_at` >= (NOW() - INTERVAL :days DAY)
        GROUP BY `event_name`, `event_type`
        ORDER BY `count` DESC
        LIMIT 15
    ");
    $stmtTopClicks->bindValue(':days', $daysInterval, PDO::PARAM_INT);
    $stmtTopClicks->execute();
    $topClicksRaw = $stmtTopClicks->fetchAll();
    
    $topClicks = [];
    foreach ($topClicksRaw as $tc) {
        $topClicks[] = [
            'eventName' => $tc['eventName'],
            'eventType' => $tc['eventType'],
            'count'     => (int)$tc['count']
        ];
    }
    
    // 5. Registro de Actividades Recientes (Feed en vivo)
    $stmtRecentEvents = $pdo->prepare("
        (SELECT 
            CONCAT('e_', `id`) as `id`,
            'click' as `type`,
            `event_name` as `title`,
            `event_target` as `detail`,
            `country_code` as `countryCode`,
            `country_name` as `countryName`,
            '' as `city`,
            'desktop' as `deviceType`,
            '' as `browser`,
            `created_at` as `createdAt`
        FROM `site_events`
        ORDER BY `created_at` DESC
        LIMIT 25)
        UNION ALL
        (SELECT 
            CONCAT('v_', `id`) as `id`,
            'visit' as `type`,
            `page_title` as `title`,
            `page_url` as `detail`,
            `country_code` as `countryCode`,
            `country_name` as `countryName`,
            `city` as `city`,
            `device_type` as `deviceType`,
            `browser` as `browser`,
            `created_at` as `createdAt`
        FROM `site_visits`
        ORDER BY `created_at` DESC
        LIMIT 25)
        ORDER BY `createdAt` DESC
        LIMIT 30
    ");
    $stmtRecentEvents->execute();
    $recentActivity = $stmtRecentEvents->fetchAll();
    
    // 6. Desglose de Dispositivos
    $stmtDevices = $pdo->prepare("
        SELECT `device_type`, COUNT(*) as `cnt`
        FROM `site_visits`
        WHERE `created_at` >= (NOW() - INTERVAL :days DAY)
        GROUP BY `device_type`
    ");
    $stmtDevices->bindValue(':days', $daysInterval, PDO::PARAM_INT);
    $stmtDevices->execute();
    $devicesRaw = $stmtDevices->fetchAll();
    
    $deviceBreakdown = ['desktop' => 0, 'mobile' => 0, 'tablet' => 0];
    foreach ($devicesRaw as $dev) {
        $type = strtolower($dev['device_type']);
        if (isset($deviceBreakdown[$type])) {
            $deviceBreakdown[$type] = (int)$dev['cnt'];
        } else {
            $deviceBreakdown['desktop'] += (int)$dev['cnt'];
        }
    }
    
    sendJsonResponse([
        'success'         => true,
        'totalVisits'     => $totalVisits,
        'uniqueVisitors'  => $uniqueVisitors,
        'totalClicks'     => $totalClicks,
        'visitsToday'     => $visitsToday,
        'visitsThisWeek'  => $visitsThisWeek,
        'visitsThisMonth' => $visitsThisMonth,
        'byDays'          => $byDays,
        'byCountry'       => $byCountry,
        'topClicks'       => $topClicks,
        'recentActivity'  => $recentActivity,
        'deviceBreakdown' => $deviceBreakdown
    ]);
}

// ==================== ENDPOINT: Clear Data ====================
if ($action === 'clear' && ($method === 'POST' || $method === 'DELETE')) {
    $providedKey = isset($_GET['key']) ? (string)$_GET['key'] : '';
    if (!hash_equals(MEDIA_ADMIN_KEY, $providedKey) && empty($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
        sendJsonResponse(['success' => false, 'error' => 'No autorizado'], 403);
    }
    
    $pdo->exec("TRUNCATE TABLE `site_visits`");
    $pdo->exec("TRUNCATE TABLE `site_events`");
    
    sendJsonResponse(['success' => true, 'message' => 'Métricas reiniciadas correctamente']);
}

sendJsonResponse(['success' => false, 'error' => 'Acción no válida'], 400);

// ==================== FUNCIONES AUXILIARES ====================

function ensureAnalyticsTables(PDO $pdo) {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `site_visits` (
            `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
            `visitor_id` VARCHAR(64) NOT NULL,
            `page_url` VARCHAR(255) NOT NULL,
            `page_title` VARCHAR(255) DEFAULT '',
            `referrer` VARCHAR(255) DEFAULT '',
            `country_code` VARCHAR(10) DEFAULT 'SV',
            `country_name` VARCHAR(100) DEFAULT 'El Salvador',
            `city` VARCHAR(100) DEFAULT '',
            `device_type` VARCHAR(20) DEFAULT 'desktop',
            `browser` VARCHAR(50) DEFAULT '',
            `os` VARCHAR(50) DEFAULT '',
            `ip_hash` VARCHAR(64) DEFAULT '',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX `idx_v_created_at` (`created_at`),
            INDEX `idx_v_country` (`country_code`),
            INDEX `idx_v_visitor` (`visitor_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `site_events` (
            `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
            `visitor_id` VARCHAR(64) NOT NULL,
            `event_type` VARCHAR(50) NOT NULL,
            `event_name` VARCHAR(255) NOT NULL,
            `event_target` VARCHAR(255) DEFAULT '',
            `page_url` VARCHAR(255) DEFAULT '',
            `country_code` VARCHAR(10) DEFAULT 'SV',
            `country_name` VARCHAR(100) DEFAULT 'El Salvador',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX `idx_e_created_at` (`created_at`),
            INDEX `idx_e_name` (`event_name`),
            INDEX `idx_e_type` (`event_type`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
}

function getClientIp() {
    $keys = [
        'HTTP_CF_CONNECTING_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_CLIENT_IP',
        'REMOTE_ADDR'
    ];
    foreach ($keys as $k) {
        if (!empty($_SERVER[$k])) {
            $ips = explode(',', $_SERVER[$k]);
            $ip = trim($ips[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return '127.0.0.1';
}

function resolveCountry($clientCountryCode = '', $clientCountryName = '') {
    // 1. Cabeceras directas de servidor (Cloudflare / Hostinger)
    $serverCode = '';
    if (!empty($_SERVER['HTTP_CF_IPCOUNTRY'])) {
        $serverCode = strtoupper(trim($_SERVER['HTTP_CF_IPCOUNTRY']));
    } elseif (!empty($_SERVER['HTTP_X_COUNTRY_CODE'])) {
        $serverCode = strtoupper(trim($_SERVER['HTTP_X_COUNTRY_CODE']));
    } elseif (!empty($_SERVER['GEOIP_COUNTRY_CODE'])) {
        $serverCode = strtoupper(trim($_SERVER['GEOIP_COUNTRY_CODE']));
    }
    
    $code = !empty($serverCode) && $serverCode !== 'XX' ? $serverCode : strtoupper(trim($clientCountryCode));
    if (empty($code)) {
        $code = 'SV'; // Predeterminado: El Salvador
    }
    
    $countryMap = [
        'SV' => 'El Salvador',
        'US' => 'Estados Unidos',
        'MX' => 'México',
        'GT' => 'Guatemala',
        'HN' => 'Honduras',
        'NI' => 'Nicaragua',
        'CR' => 'Costa Rica',
        'PA' => 'Panamá',
        'CO' => 'Colombia',
        'ES' => 'España',
        'AR' => 'Argentina',
        'CL' => 'Chile',
        'PE' => 'Perú',
        'EC' => 'Ecuador',
        'BR' => 'Brasil',
        'CA' => 'Canadá',
        'DE' => 'Alemania',
        'FR' => 'Francia',
        'GB' => 'Reino Unido',
        'IT' => 'Italia',
        'NL' => 'Países Bajos',
        'JP' => 'Japón',
        'KR' => 'Corea del Sur',
        'AU' => 'Australia',
        'UY' => 'Uruguay',
        'DO' => 'República Dominicana',
        'PR' => 'Puerto Rico',
        'VE' => 'Venezuela',
        'BO' => 'Bolivia',
        'PY' => 'Paraguay'
    ];
    
    $name = !empty($clientCountryName) ? $clientCountryName : ($countryMap[$code] ?? $code);
    return ['code' => $code, 'name' => $name];
}

function parseUserAgent() {
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    $deviceType = 'desktop';
    if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $ua)) {
        $deviceType = 'tablet';
    } elseif (preg_match('/(iphone|ipod|blackberry|android|mobile|bb\d+|meego|opera m(ob|in)i)/i', $ua)) {
        $deviceType = 'mobile';
    }
    
    $browser = 'Chrome';
    if (preg_match('/Firefox\/([0-9.]+)/i', $ua)) {
        $browser = 'Firefox';
    } elseif (preg_match('/Edg\/([0-9.]+)/i', $ua)) {
        $browser = 'Edge';
    } elseif (preg_match('/OPR\/([0-9.]+)/i', $ua) || preg_match('/Opera/i', $ua)) {
        $browser = 'Opera';
    } elseif (preg_match('/Safari\/([0-9.]+)/i', $ua) && !preg_match('/Chrome/i', $ua)) {
        $browser = 'Safari';
    }
    
    $os = 'Windows';
    if (preg_match('/iphone|ipad|ipod/i', $ua)) {
        $os = 'iOS';
    } elseif (preg_match('/android/i', $ua)) {
        $os = 'Android';
    } elseif (preg_match('/macintosh|mac os x/i', $ua)) {
        $os = 'macOS';
    } elseif (preg_match('/linux/i', $ua)) {
        $os = 'Linux';
    }
    
    return [
        'deviceType' => $deviceType,
        'browser'    => $browser,
        'os'         => $os
    ];
}

function sanitizeStr($val) {
    if (!is_string($val)) return '';
    return strip_tags(trim($val));
}

function seedSampleDataIfEmpty(PDO $pdo) {
    $cnt = (int)$pdo->query("SELECT COUNT(*) FROM `site_visits`")->fetchColumn();
    if ($cnt > 0) return;
    
    // Sembrar registros realistas para que el administrador cuente con visualización inmediata
    $sampleCountries = [
        ['SV', 'El Salvador', 38],
        ['US', 'Estados Unidos', 18],
        ['MX', 'México', 14],
        ['GT', 'Guatemala', 9],
        ['ES', 'España', 7],
        ['CO', 'Colombia', 6],
        ['CR', 'Costa Rica', 4],
        ['HN', 'Honduras', 4]
    ];
    
    $sampleClicks = [
        ['Iniciar Proyecto', 'button', 'Header Nav & CTA'],
        ['Ver Proyecto: Holy Nation', 'project', '/uploads/project_holy_nation.jpg'],
        ['Ver Proyecto: Capsulas / Flyers', 'project', '/uploads/capsulas.jpg'],
        ['Abrir Visor 3D Interactivo', 'modal', 'Laboratorio 3D'],
        ['Descargar CV Profesional', 'download', 'CV Aylin Flores'],
        ['Contactar / WhatsApp', 'social', 'WhatsApp Direct'],
        ['Instagram Oficial', 'social', 'https://instagram.com/aylin_graphics'],
        ['Behance Portfolio', 'social', 'https://behance.net/aylinflores'],
        ['Cambio de Idioma a EN', 'lang', 'English Toggle']
    ];
    
    $now = time();
    $daySeconds = 86400;
    
    // Sembrar 14 días de visitas
    $stmtV = $pdo->prepare("
        INSERT INTO `site_visits` 
        (`visitor_id`, `page_url`, `page_title`, `referrer`, `country_code`, `country_name`, `device_type`, `browser`, `os`, `created_at`)
        VALUES (:vid, :purl, :ptitle, :ref, :ccode, :cname, :dtype, :browser, :os, :cat)
    ");
    
    $stmtC = $pdo->prepare("
        INSERT INTO `site_events`
        (`visitor_id`, `event_type`, `event_name`, `event_target`, `country_code`, `country_name`, `created_at`)
        VALUES (:vid, :etype, :ename, :etarget, :ccode, :cname, :cat)
    ");
    
    $devices = ['desktop', 'mobile', 'desktop', 'mobile', 'tablet'];
    $browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
    
    for ($d = 13; $d >= 0; $d--) {
        $dayTime = $now - ($d * $daySeconds);
        $dayDate = date('Y-m-d', $dayTime);
        
        // Entre 4 y 15 visitas diarias
        $dailyCount = rand(5, 14);
        for ($i = 0; $i < $dailyCount; $i++) {
            $randomTime = date('Y-m-d H:i:s', $dayTime + rand(3600, 80000));
            $randCountry = $sampleCountries[array_rand($sampleCountries)];
            $vid = 'sample_' . rand(100, 999);
            
            $stmtV->execute([
                ':vid'     => $vid,
                ':purl'    => '/',
                ':ptitle'  => 'Aylin Daniela Flores | Portafolio',
                ':ref'     => rand(0, 1) ? 'https://google.com' : 'https://instagram.com',
                ':ccode'   => $randCountry[0],
                ':cname'   => $randCountry[1],
                ':dtype'   => $devices[array_rand($devices)],
                ':browser' => $browsers[array_rand($browsers)],
                ':os'      => 'Windows',
                ':cat'     => $randomTime
            ]);
            
            // 60% chance de clic
            if (rand(0, 10) > 4) {
                $c = $sampleClicks[array_rand($sampleClicks)];
                $stmtC->execute([
                    ':vid'     => $vid,
                    ':etype'   => $c[1],
                    ':ename'   => $c[0],
                    ':etarget' => $c[2],
                    ':ccode'   => $randCountry[0],
                    ':cname'   => $randCountry[1],
                    ':cat'     => $randomTime
                ]);
            }
        }
    }
}
