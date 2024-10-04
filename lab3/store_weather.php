<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather and Events in Troy, NY</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h2>Weather in Troy, New York</h2>
        <div id="weatherData"></div>

        <h3>Upcoming Events in Troy, New York</h3>
        <ul id="eventsList" class="events-list"></ul>

        <button id="fetchDataButton">Fetch and Store Data</button>

        <div id="editWeather">
            <h3>Edit Weather Data</h3>
            <form id="weatherForm">
                <label for="temp">Temperature (°F):</label>
                <input type="number" id="temp" name="temp"><br>
                <label for="description">Description:</label>
                <input type="text" id="description" name="description"><br>
                <button type="submit">Update Weather</button>
            </form>
        </div>

        <!-- Add similar form for events if needed -->
    </div>

    <script src="script.js"></script>
</body>
</html>

<?php
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "lab_database";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to store data
function storeData($tableName, $data) {
    global $conn;
    $data = $conn->real_escape_string($data);
    $sql = "INSERT INTO $tableName (data) VALUES ('$data')";
    if ($conn->query($sql) !== TRUE) {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Function to get data
function getData($tableName) {
    global $conn;
    $sql = "SELECT data FROM $tableName ORDER BY timestamp DESC LIMIT 1";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        return $result->fetch_assoc()['data'];
    } else {
        return json_encode(["error" => "No data found"]);
    }
}

// Function to update data
function updateData($tableName, $data) {
    global $conn;
    $data = $conn->real_escape_string($data);
    $sql = "UPDATE $tableName SET data='$data' ORDER BY timestamp DESC LIMIT 1";
    if ($conn->query($sql) !== TRUE) {
        echo "Error updating record: " . $conn->error;
    }
}

// Handle requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'storeWeather':
                storeData('weather_data', file_get_contents('php://input'));
                break;
            case 'storeEvents':
                storeData('events_data', file_get_contents('php://input'));
                break;
            case 'updateWeather':
                updateData('weather_data', file_get_contents('php://input'));
                break;
            // Add more cases as needed for other actions
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'getWeather':
                echo getData('weather_data');
                break;
            case 'getEvents':
                echo getData('events_data');
                break;
            // Add more cases as needed for other actions
        }
    }
}

$conn->close();
?>