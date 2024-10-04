const weatherApiKey = '48e1df00aa077093c853dac5d5afd127';
const calendarificApiKey = 'w1ViWNCAEYBftNIFc4N5f3iVRFOwo3e6';
const city = 'Troy';
const state = 'NY';
const country = 'US';
const units = 'imperial';
const currentYear = new Date().getFullYear();

const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=${units}&appid=${weatherApiKey}`;
const eventsApiUrl = `https://calendarific.com/api/v2/holidays?&api_key=${calendarificApiKey}&country=${country}&year=${currentYear}&location=us-ny`;

function fetchApiData() {
    Promise.all([
        fetch(weatherApiUrl).then(response => response.json()),
        fetch(eventsApiUrl).then(response => response.json())
    ])
    .then(([weatherData, eventsData]) => {
        displayApiData(weatherData, eventsData);
    })
    .catch(error => {
        console.error('Error fetching API data:', error);
        document.getElementById('apiData').innerHTML = `<p>Error fetching API data: ${error.message}</p>`;
    });
}

function displayApiData(weatherData, eventsData) {
    const apiDataElement = document.getElementById('apiData');
    apiDataElement.innerHTML = `
        <h2>Weather in ${city}, ${state}</h2>
        <ul class="data-list">
            <li>Temperature: ${weatherData.main.temp}°F</li>
            <li>Feels like: ${weatherData.main.feels_like}°F</li>
            <li>Humidity: ${weatherData.main.humidity}%</li>
            <li>Wind speed: ${weatherData.wind.speed} mph</li>
            <li>Description: ${weatherData.weather[0].description}</li>
        </ul>
        <h2>Upcoming Events</h2>
        <ul class="events-list">
            ${eventsData.response.holidays.slice(0, 5).map(event => `
                <li>
                    <span class="event-name">${event.name}</span>
                    <span class="event-date">${event.date.iso}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

document.getElementById('storeDataBtn').addEventListener('click', function() {
    Promise.all([
        fetch(weatherApiUrl).then(response => response.json()),
        fetch(eventsApiUrl).then(response => response.json())
    ])
    .then(([weatherData, eventsData]) => {
        const data = {
            weather: weatherData,
            events: eventsData
        };
        
        fetch('store_data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Data stored successfully:', result);
            fetchDatabaseData();
        })
        .catch(error => {
            console.error('Error storing data:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching API data:', error);
    });
});

function fetchDatabaseData() {
    fetch('fetch_data.php')
    .then(response => response.json())
    .then(data => {
        displayDatabaseData(data);
    })
    .catch(error => {
        console.error('Error fetching database data:', error);
    });
}

function displayDatabaseData(data) {
    const databaseDataElement = document.getElementById('databaseData');
    const weatherData = JSON.parse(data.weather.json_data);
    const eventsData = JSON.parse(data.events.json_data);

    databaseDataElement.innerHTML = `
        <h2>Stored Weather Data</h2>
        <ul class="data-list">
            <li>Temperature: ${weatherData.main.temp}°F</li>
            <li>Description: ${weatherData.weather[0].description}</li>
        </ul>
        <h2>Stored Event Data</h2>
        <ul class="events-list">
            ${eventsData.response.holidays.slice(0, 1).map(event => `
                <li>
                    <span class="event-name">${event.name}</span>
                    <span class="event-date">${event.date.iso}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

document.getElementById('updateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const updatedData = {
        weather: {
            main: {
                temp: formData.get('temperature')
            },
            weather: [
                {
                    description: formData.get('description')
                }
            ]
        },
        events: {
            response: {
                holidays: [
                    {
                        name: formData.get('eventName'),
                        date: {
                            iso: formData.get('eventDate')
                        }
                    }
                ]
            }
        }
    };

    fetch('update_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Data updated successfully:', result);
        fetchDatabaseData();
    })
    .catch(error => {
        console.error('Error updating data:', error);
    });
});

// Initial data fetch
fetchApiData();
fetchDatabaseData();