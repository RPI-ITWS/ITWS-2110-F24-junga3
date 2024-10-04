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

$stmt = $mysqli->prepare("INSERT INTO api_data (api_name, json_data) VALUES (?, ?)");

foreach ($data as $api_name => $json_data) {
    $json_string = json_encode($json_data);
    $stmt->bind_param("ss", $api_name, $json_string);
    $stmt->execute();
}

$stmt->close();
$mysqli->close();

echo json_encode(['success' => true, 'message' => 'Data stored successfully']);