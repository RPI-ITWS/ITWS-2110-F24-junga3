<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'api_data_db';
$user = 'root';
$pass = '';

$mysqli = new mysqli($host, $user, $pass, $db);

if ($mysqli->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $mysqli->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $mysqli->prepare("UPDATE api_data SET json_data = ? WHERE api_name = ? ORDER BY timestamp DESC LIMIT 1");

foreach ($data as $api_name => $json_data) {
    $json_string = json_encode($json_data);
    $stmt->bind_param("ss", $json_string, $api_name);
    $stmt->execute();
}

$stmt->close();
$mysqli->close();

echo json_encode(['success' => true, 'message' => 'Data updated successfully']);