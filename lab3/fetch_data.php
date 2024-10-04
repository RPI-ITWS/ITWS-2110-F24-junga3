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

$result = $mysqli->query("SELECT api_name, json_data FROM api_data WHERE api_name IN ('weather', 'events') ORDER BY timestamp DESC LIMIT 2");

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[$row['api_name']] = $row;
}

$mysqli->close();

echo json_encode($data);