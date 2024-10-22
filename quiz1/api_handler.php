<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$db = new mysqli('localhost', 'root', '', 'api_data_db');
if ($db->connect_errno) die('Database connection failed');

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'insert':
        $id = ($data['type'] === 'weather') ? 11 : 10;
        $stmt = $db->prepare("INSERT INTO api_data (ID, String) VALUES (?, ?) ON DUPLICATE KEY UPDATE String = ?");
        $jsonString = json_encode($data['data']);
        $stmt->bind_param('iss', $id, $jsonString, $jsonString);
        echo ($stmt->execute()) ? json_encode(['status' => 'success']) : json_encode(['status' => 'failed']);
        break;

    case 'select_weather':
        $result = $db->query('SELECT * FROM `api_data` WHERE ID = 11');
        echo ($result && $data = $result->fetch_assoc()) ? json_encode($data) : json_encode(['error' => 'No data found']);
        break;

    case 'select_events':
        $result = $db->query('SELECT * FROM `api_data` WHERE ID = 10');
        echo ($result && $data = $result->fetch_assoc()) ? json_encode($data) : json_encode(['error' => 'No data found']);
        break;

    case 'update_weather':
        if (isset($data['temperature'])) {
            $stmt = $db->prepare("UPDATE api_data SET String = JSON_SET(String, '$.main.temp', ?) WHERE ID = 11");
            echo ($stmt && $stmt->bind_param('d', $data['temperature']) && $stmt->execute()) ? 
                json_encode(['status' => 'success']) : json_encode(['status' => 'failed']);
        } else {
            echo json_encode(['status' => 'no temperature']);
        }
        break;

    case 'update_events':
        if (isset($data['eventName'])) {
            $stmt = $db->prepare("UPDATE api_data SET String = JSON_SET(String, '$[0].name', ?) WHERE ID = 10");
            echo ($stmt && $stmt->bind_param('s', $data['eventName']) && $stmt->execute()) ? 
                json_encode(['status' => 'success']) : json_encode(['status' => 'failed']);
        } else {
            echo json_encode(['status' => 'no event name']);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
}
?>