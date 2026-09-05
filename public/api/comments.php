<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Comments & Feedback REST API
 */

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

if (!$pdo) {
    sendJsonResponse(['error' => 'Base de datos temporalmente no disponible'], 500);
}

// Ensure table exists & auto-migrations
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `comments` (
            `id` VARCHAR(100) NOT NULL PRIMARY KEY,
            `name` VARCHAR(255) NOT NULL,
            `email` VARCHAR(255) DEFAULT '',
            `company` VARCHAR(255) DEFAULT '',
            `rating` INT NOT NULL DEFAULT 5,
            `comment` LONGTEXT NOT NULL,
            `status` VARCHAR(20) NOT NULL DEFAULT 'approved',
            `featured` TINYINT(1) NOT NULL DEFAULT 1,
            `displayOrder` INT NOT NULL DEFAULT 0,
            `createdAt` VARCHAR(50) NOT NULL,
            `updatedAt` VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
} catch (Exception $e) {}

try {
    $pdo->exec("ALTER TABLE `comments` ADD COLUMN `featured` TINYINT(1) NOT NULL DEFAULT 1 AFTER `status`");
} catch (Exception $e) {}

try {
    $pdo->exec("ALTER TABLE `comments` ADD COLUMN `displayOrder` INT NOT NULL DEFAULT 0 AFTER `featured`");
} catch (Exception $e) {}

$method = $_SERVER['REQUEST_METHOD'];

// ==================== GET: List comments ====================
if ($method === 'GET') {
    try {
        $showAll = isset($_GET['all']) && $_GET['all'] == '1';
        $sql = $showAll 
            ? "SELECT * FROM `comments` ORDER BY `displayOrder` ASC, `createdAt` DESC"
            : "SELECT * FROM `comments` WHERE `status` = 'approved' ORDER BY `displayOrder` ASC, `createdAt` DESC";
            
        $stmt = $pdo->query($sql);
        $rows = $stmt->fetchAll();

        $comments = array_map(function($r) {
            return [
                'id'           => $r['id'],
                'name'         => $r['name'],
                'email'        => $r['email'] ?? '',
                'company'      => $r['company'] ?? '',
                'rating'       => (int)($r['rating'] ?? 5),
                'comment'      => $r['comment'],
                'status'       => $r['status'] ?? 'approved',
                'featured'     => !isset($r['featured']) || (bool)$r['featured'],
                'displayOrder' => (int)($r['displayOrder'] ?? 0),
                'createdAt'    => $r['createdAt'],
                'updatedAt'    => $r['updatedAt'] ?? null,
            ];
        }, $rows);

        sendJsonResponse($comments);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Error al obtener comentarios: ' . $e->getMessage()], 500);
    }
}

// ==================== POST: Create new comment ====================
if ($method === 'POST') {
    $payload = getJsonPayload();

    $name    = trim($payload['name'] ?? '');
    $email   = trim($payload['email'] ?? '');
    $company = trim($payload['company'] ?? '');
    $rating  = max(1, min(5, (int)($payload['rating'] ?? 5)));
    $comment = trim($payload['comment'] ?? '');

    if (empty($name) || empty($comment)) {
        sendJsonResponse(['error' => 'Nombre y comentario son campos obligatorios.'], 400);
    }

    $id = !empty($payload['id']) ? $payload['id'] : 'cmt-' . time() . '-' . rand(1000, 9999);
    $now = date('c');
    $status = !empty($payload['status']) ? $payload['status'] : 'approved';
    $featured = isset($payload['featured']) ? ($payload['featured'] ? 1 : 0) : 1;
    $displayOrder = (int)($payload['displayOrder'] ?? 0);

    try {
        $stmt = $pdo->prepare("
            INSERT INTO `comments` (`id`, `name`, `email`, `company`, `rating`, `comment`, `status`, `featured`, `displayOrder`, `createdAt`, `updatedAt`)
            VALUES (:id, :name, :email, :company, :rating, :comment, :status, :featured, :displayOrder, :createdAt, :updatedAt)
        ");
        $stmt->execute([
            ':id'           => $id,
            ':name'         => $name,
            ':email'        => $email,
            ':company'      => $company,
            ':rating'       => $rating,
            ':comment'      => $comment,
            ':status'       => $status,
            ':featured'     => $featured,
            ':displayOrder' => $displayOrder,
            ':createdAt'    => $now,
            ':updatedAt'    => $now,
        ]);

        sendJsonResponse([
            'success' => true,
            'message' => '¡Gracias por tu comentario! Ha sido registrado exitosamente.',
            'data'    => [
                'id'           => $id,
                'name'         => $name,
                'email'        => $email,
                'company'      => $company,
                'rating'       => $rating,
                'comment'      => $comment,
                'status'       => $status,
                'featured'     => (bool)$featured,
                'displayOrder' => $displayOrder,
                'createdAt'    => $now,
            ]
        ], 201);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Error al registrar el comentario: ' . $e->getMessage()], 500);
    }
}

// ==================== PUT: Update status / featured / edit comment ====================
if ($method === 'PUT') {
    $payload = getJsonPayload();
    $id = $payload['id'] ?? ($_GET['id'] ?? '');

    if (empty($id)) {
        sendJsonResponse(['error' => 'ID de comentario requerido'], 400);
    }

    $now = date('c');
    $fields = [];
    $params = [':id' => $id, ':now' => $now];

    if (isset($payload['status'])) {
        $fields[] = "`status` = :status";
        $params[':status'] = $payload['status'];
    }
    if (isset($payload['featured'])) {
        $fields[] = "`featured` = :featured";
        $params[':featured'] = $payload['featured'] ? 1 : 0;
    }
    if (isset($payload['name'])) {
        $fields[] = "`name` = :name";
        $params[':name'] = trim($payload['name']);
    }
    if (isset($payload['company'])) {
        $fields[] = "`company` = :company";
        $params[':company'] = trim($payload['company']);
    }
    if (isset($payload['rating'])) {
        $fields[] = "`rating` = :rating";
        $params[':rating'] = max(1, min(5, (int)$payload['rating']));
    }
    if (isset($payload['comment'])) {
        $fields[] = "`comment` = :comment";
        $params[':comment'] = trim($payload['comment']);
    }
    if (isset($payload['displayOrder'])) {
        $fields[] = "`displayOrder` = :displayOrder";
        $params[':displayOrder'] = (int)$payload['displayOrder'];
    }

    $fields[] = "`updatedAt` = :now";

    try {
        $sql = "UPDATE `comments` SET " . implode(", ", $fields) . " WHERE `id` = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        sendJsonResponse([
            'success' => true,
            'message' => 'Comentario actualizado con éxito en Hostinger MySQL.',
            'id'      => $id,
        ]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Error al actualizar comentario: ' . $e->getMessage()], 500);
    }
}

// ==================== DELETE: Remove comment ====================
if ($method === 'DELETE') {
    $payload = getJsonPayload();
    $id = $_GET['id'] ?? ($payload['id'] ?? '');

    if (empty($id)) {
        sendJsonResponse(['error' => 'ID de comentario requerido'], 400);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM `comments` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);

        sendJsonResponse([
            'success' => true,
            'message' => 'Comentario eliminado con éxito.',
            'id'      => $id,
        ]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Error al eliminar comentario: ' . $e->getMessage()], 500);
    }
}

sendJsonResponse(['error' => 'Método no permitido'], 405);
