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

// Ensure table exists
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
            `createdAt` VARCHAR(50) NOT NULL,
            `updatedAt` VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
} catch (Exception $e) {}

$method = $_SERVER['REQUEST_METHOD'];

// ==================== GET: List comments ====================
if ($method === 'GET') {
    try {
        $showAll = isset($_GET['all']) && $_GET['all'] == '1';
        $sql = $showAll 
            ? "SELECT * FROM `comments` ORDER BY `createdAt` DESC"
            : "SELECT * FROM `comments` WHERE `status` = 'approved' ORDER BY `createdAt` DESC";
            
        $stmt = $pdo->query($sql);
        $rows = $stmt->fetchAll();

        $comments = array_map(function($r) {
            return [
                'id'        => $r['id'],
                'name'      => $r['name'],
                'email'     => $r['email'] ?? '',
                'company'   => $r['company'] ?? '',
                'rating'    => (int)($r['rating'] ?? 5),
                'comment'   => $r['comment'],
                'status'    => $r['status'] ?? 'approved',
                'createdAt' => $r['createdAt'],
                'updatedAt' => $r['updatedAt'] ?? null,
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

    try {
        $stmt = $pdo->prepare("
            INSERT INTO `comments` (`id`, `name`, `email`, `company`, `rating`, `comment`, `status`, `createdAt`, `updatedAt`)
            VALUES (:id, :name, :email, :company, :rating, :comment, :status, :createdAt, :updatedAt)
        ");
        $stmt->execute([
            ':id'        => $id,
            ':name'      => $name,
            ':email'     => $email,
            ':company'   => $company,
            ':rating'    => $rating,
            ':comment'   => $comment,
            ':status'    => $status,
            ':createdAt' => $now,
            ':updatedAt' => $now,
        ]);

        sendJsonResponse([
            'success' => true,
            'message' => '¡Gracias por tu comentario! Ha sido registrado exitosamente.',
            'data'    => [
                'id'        => $id,
                'name'      => $name,
                'email'     => $email,
                'company'   => $company,
                'rating'    => $rating,
                'comment'   => $comment,
                'status'    => $status,
                'createdAt' => $now,
            ]
        ], 201);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Error al registrar el comentario: ' . $e->getMessage()], 500);
    }
}

// ==================== PUT: Update status / approval ====================
if ($method === 'PUT') {
    $payload = getJsonPayload();
    $id = $payload['id'] ?? ($_GET['id'] ?? '');

    if (empty($id)) {
        sendJsonResponse(['error' => 'ID de comentario requerido'], 400);
    }

    $status = $payload['status'] ?? 'approved';
    $now = date('c');

    try {
        $stmt = $pdo->prepare("
            UPDATE `comments` 
            SET `status` = :status, `updatedAt` = :now 
            WHERE `id` = :id
        ");
        $stmt->execute([
            ':status' => $status,
            ':now'    => $now,
            ':id'     => $id,
        ]);

        sendJsonResponse([
            'success' => true,
            'message' => 'Estado del comentario actualizado.',
            'status'  => $status,
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
