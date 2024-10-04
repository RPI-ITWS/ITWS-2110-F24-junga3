<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$db = new mysqli('localhost', 'root', '', 'api_data_db');

if ($db->connect_errno) {
    die(json_encode(['error' => 'Database connection failed: ' . $db->connect_error]));
}

$query = 'SELECT * FROM `Apple` WHERE ID = 10';
$result = $db->query($query);

if ($result) {
    $data = $result->fetch_assoc();
    if ($data) {
        echo json_encode($data);
    } else {
        echo json_encode(['error' => 'No data found for ID = 10']);
    }
} 
else {
    echo json_encode(['error' => 'Error retrieving data: ' . $db->error]);
}
?>