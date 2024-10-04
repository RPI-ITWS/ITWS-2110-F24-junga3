<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$db = new mysqli('localhost', 'root', '', 'api_data_db');

if ($db->connect_errno) {
    die(json_encode(['error' => 'Database connection failed: ' . $db->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['eventName'])) {
    $newEventName = $data['eventName'];

    $stmt = $db->prepare("UPDATE api_data SET String = JSON_SET(String, '$[0].name', ?) WHERE ID = 10");
    if ($stmt) {
        $stmt->bind_param('s', $newEventName);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Event name updated successfully']);
        } else {
            echo json_encode(['error' => 'Update failed: ' . $stmt->error]);
        }
    } else {
        echo json_encode(['error' => 'Prepare failed: ' . $db->error]);
    }
} 
else {
    echo json_encode(['error' => 'No event name provided']);
}
?>