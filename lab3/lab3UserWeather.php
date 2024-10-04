<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$db = new mysqli('localhost', 'root', '', 'api_data_db');

if ($db->connect_errno) {
    die(json_encode(['error' => 'Database connection failed: ' . $db->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['temperature'])) {
    $newTemperature = $data['temperature'];

    $stmt = $db->prepare("UPDATE Apple SET String = JSON_SET(String, '$.main.temp', ?) WHERE ID = 11");
    if ($stmt) {
        $stmt->bind_param('d', $newTemperature);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Temperature updated successfully']);
        } 
        else {
            echo json_encode(['error' => 'Update failed: ' . $stmt->error]);
        }
    } 
    else {
        echo json_encode(['error' => 'Prepare failed: ' . $db->error]);
    }
} 
else {
    echo json_encode(['error' => 'No temperature provided']);
}
?>