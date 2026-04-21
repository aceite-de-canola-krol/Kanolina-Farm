<?php
declare(strict_types=1);

$recipient = 'info@aceitedecanola.com';
$whatsappUrl = 'https://wa.me/5491168931604?text=Hola%2C%20quiero%20asesoramiento%20sobre%20Kanolina%20Farm%20para%20toros.';

function clean_header_value(string $value): string
{
    return str_replace(["\r", "\n"], ' ', $value);
}

$rawBody = file_get_contents('php://input') ?: '';
$data = json_decode($rawBody, true);

if (!is_array($data)) {
    $data = [];
}

$timestamp = date('Y-m-d H:i:s');
$page = isset($data['page']) ? clean_header_value((string) $data['page']) : 'No disponible';
$channel = isset($data['channel']) ? clean_header_value((string) $data['channel']) : 'whatsapp';
$product = isset($data['product']) ? clean_header_value((string) $data['product']) : 'Kanolina Farm';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'No disponible';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'No disponible';
$referer = $_SERVER['HTTP_REFERER'] ?? 'No disponible';

$subject = 'Nuevo contacto por WhatsApp - Kanolina Farm';
$message = implode("\n", [
    'Hubo un nuevo click en el boton de WhatsApp de la landing.',
    '',
    'Producto: ' . $product,
    'Canal: ' . $channel,
    'Fecha servidor: ' . $timestamp,
    'Pagina: ' . $page,
    'IP: ' . $ip,
    'Navegador: ' . $userAgent,
    'Referer: ' . $referer,
]);

$headers = [
    'From: Kanolina Farm Landing <no-reply@kanolio.com.ar>',
    'Reply-To: no-reply@kanolio.com.ar',
    'Content-Type: text/plain; charset=UTF-8',
];

@mail($recipient, $subject, $message, implode("\r\n", $headers));

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Location: ' . $whatsappUrl, true, 302);
    exit;
}

http_response_code(204);
