<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$db = new mysqli('localhost', 'root', '', 'api_data_db');

if ($db->connect_errno) {
    die(json_encode(['error' => 'Database connection failed: ' . $db->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

if ($data['type'] === 'weather') {
    $stmt = $db->prepare("INSERT INTO api_data (ID, String) VALUES (11, ?) ON DUPLICATE KEY UPDATE String = ?");
    $jsonString = json_encode($data['data']);
    $stmt->bind_param('ss', $jsonString, $jsonString);
} 
elseif ($data['type'] === 'events') {
    $stmt = $db->prepare("INSERT INTO api_data (ID, String) VALUES (10, ?) ON DUPLICATE KEY UPDATE String = ?");
    $jsonString = json_encode($data['data']);
    $stmt->bind_param('ss', $jsonString, $jsonString);
} 
else {
    die(json_encode(['error' => 'Invalid data type received']));
}

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Data updated successfully']);
} 
else {
    echo json_encode(['error' => 'Update failed: ' . $stmt->error]);
}
?>