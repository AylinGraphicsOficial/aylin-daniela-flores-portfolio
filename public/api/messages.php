<?php
/**
 * Aylin Daniela Flores - Studio Kinetic Portfolio
 * Contact Messages & Inbox REST API
 */

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

if (!$pdo) {
    sendJsonResponse(['error' => 'Base de datos temporalmente no disponible'], 500);
}

// Ensure table exists
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `contact_messages` (
            `id` VARCHAR(100) NOT NULL PRIMARY KEY,
            `name` VARCHAR(255) NOT NULL,
            `email` VARCHAR(255) NOT NULL,
            `service` VARCHAR(255) DEFAULT '',
            `message` LONGTEXT NOT NULL,
            `isRead` TINYINT(1) NOT NULL DEFAULT 0,
            `createdAt` VARCHAR(50) NOT NULL,
            `updatedAt` VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
} catch (Exception $e) {}

$method = $_SERVER['REQUEST_METHOD'];

// ==================== GET: List messages ====================
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM `contact_messages` ORDER BY `createdAt` DESC");
        $rows = $stmt->fetchAll();

        $messages = array_map(function($r) {
            return [
                'id'        => $r['id'],
                'name'      => $r['name'],
                'email'     => $r['email'],
                'service'   => $r['service'] ?? '',
                'message'   => $r['message'],
                'isRead'    => (bool)$r['isRead'],
                'createdAt' => $r['createdAt'],
                'updatedAt' => $r['updatedAt'] ?? null,
            ];
        }, $rows);

        sendJsonResponse($messages);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Error al obtener los mensajes: ' . $e->getMessage()], 500);
    }
}

// ==================== POST: Create new message ====================
if ($method === 'POST') {
    $payload = getJsonPayload();

    $name    = trim($payload['name'] ?? '');
    $email   = trim($payload['email'] ?? '');
    $service = trim($payload['service'] ?? '');
    $message = trim($payload['message'] ?? '');

    if (empty($name) || empty($email) || empty($message)) {
        sendJsonResponse(['error' => 'Nombre, correo y mensaje son campos obligatorios.'], 400);
    }

    $id = !empty($payload['id']) ? $payload['id'] : 'msg-' . time() . '-' . rand(1000, 9999);
    $now = date('c');

    try {
        $stmt = $pdo->prepare("
            INSERT INTO `contact_messages` (`id`, `name`, `email`, `service`, `message`, `isRead`, `createdAt`, `updatedAt`)
            VALUES (:id, :name, :email, :service, :message, 0, :createdAt, :updatedAt)
        ");
        $stmt->execute([
            ':id'        => $id,
            ':name'      => $name,
            ':email'     => $email,
            ':service'   => $service,
            ':message'   => $message,
            ':createdAt' => $now,
            ':updatedAt' => $now,
        ]);

        sendJsonResponse([
            'success' => true,
            'message' => '¡Mensaje recibido con éxito! Nos pondremos en contacto pronto.',
            'data'    => [
                'id'        => $id,
                'name'      => $name,
                'email'     => $email,
                'service'   => $service,
                'message'   => $message,
                'isRead'    => false,
                'createdAt' => $now,
            ]
        ], 201);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Error al guardar el mensaje: ' . $e->getMessage()], 500);
    }
}

// ==================== PUT: Mark as read / unread ====================
if ($method === 'PUT') {
    $payload = getJsonPayload();
    $id = $payload['id'] ?? ($_GET['id'] ?? '');

    if (empty($id)) {
        sendJsonResponse(['error' => 'ID de mensaje requerido'], 400);
    }

    $isRead = isset($payload['isRead']) ? ($payload['isRead'] ? 1 : 0) : 1;
    $now = date('c');

    try {
        $stmt = $pdo->prepare("
            UPDATE `contact_messages` 
            SET `isRead` = :isRead, `updatedAt` = :now 
            WHERE `id` = :id
        ");
        $stmt->execute([
            ':isRead' => $isRead,
            ':now'    => $now,
            ':id'     => $id,
        ]);

        sendJsonResponse([
            'success' => true,
            'message' => 'Estado de mensaje actualizado.',
            'isRead'  => (bool)$isRead,
        ]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Error al actualizar mensaje: ' . $e->getMessage()], 500);
    }
}

// ==================== DELETE: Remove message ====================
if ($method === 'DELETE') {
    $payload = getJsonPayload();
    $id = $_GET['id'] ?? ($payload['id'] ?? '');

    if (empty($id)) {
        sendJsonResponse(['error' => 'ID de mensaje requerido'], 400);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM `contact_messages` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);

        sendJsonResponse([
            'success' => true,
            'message' => 'Mensaje eliminado exitosamente.',
            'id'      => $id,
        ]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Error al eliminar mensaje: ' . $e->getMessage()], 500);
    }
}

sendJsonResponse(['error' => 'Método no permitido'], 405);
