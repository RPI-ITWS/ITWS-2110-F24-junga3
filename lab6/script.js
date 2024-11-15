const weatherApiKey = '48e1df00aa077093c853dac5d5afd127';
const calendarificApiKey = 'w1ViWNCAEYBftNIFc4N5f3iVRFOwo3e6';
const city = 'Troy';
const state = 'NY';
const country = 'US';
const units = 'imperial';
const currentYear = new Date().getFullYear();

const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=${units}&appid=${weatherApiKey}`;
const today = new Date();
const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const eventsApiUrl = `https://calendarific.com/api/v2/holidays?&api_key=${calendarificApiKey}&country=${country}&year=${currentYear}&location=us-ny&from=${formattedDate}`;

document.getElementById('fetchData').addEventListener('click', () => {
    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            updateWeatherUI(data);
            return fetch("api_handler.php?action=insert", {
                method: "POST",
                body: JSON.stringify({
                    type: 'weather',
                    data: data
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        })
        .then(response => response.json())
        .then(result => console.log('Weather data updated in PHP:', result))
        .catch(error => console.error('Error:', error));
    fetch(eventsApiUrl)
        .then(response => response.json())
        .then(data => {
            const currentDate = new Date();
            const filteredEvents = data.response.holidays
                .filter(event => new Date(event.date.iso) >= currentDate)
                .sort((a, b) => new Date(a.date.iso) - new Date(b.date.iso));

            const eventsList = document.getElementById('eventsList');
            eventsList.innerHTML = '';
            filteredEvents.slice(0, 5).forEach(event => {
                const li = document.createElement('li');
                li.textContent = `${event.name} - ${event.date.iso}`;
                eventsList.appendChild(li);
            });

            return fetch("Lab3.php", {
                method: "POST",
                body: JSON.stringify({
                    type: 'events',
                    data: filteredEvents.slice(0, 5)
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        })
        .then(response => response.json())
        .then(result => console.log('Events data updated in PHP:', result))
        .catch(error => console.error('Error:', error));
});

document.getElementById('updateWeatherForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const newTemperature = document.getElementById('newTemperature').value;
    document.getElementById('temperature').innerText = newTemperature;
    fetch("api_handler.php?action=update_weather", {
        method: "POST",
        body: JSON.stringify({ temperature: newTemperature }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error updating data in PHP:', error));
});

document.getElementById('updateEventForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const newEventName = document.getElementById('newEventName').value;
    fetch("api_handler.php?action=update_events", {
        method: "POST",
        body: JSON.stringify({ eventName: newEventName }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.getElementById('fetchEventsfromSQL').click();
        })
        .catch(error => console.error('Error updating event data in PHP:', error));
});

function updateWeatherUI(data) {
    document.getElementById('cityName').innerText = data.name;
    document.getElementById('temperature').innerText = data.main.temp;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = data.main.humidity;
    document.getElementById('windSpeed').innerText = data.wind.speed;
}

function updateEventsUI(events) {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';
    events.forEach(event => {
        const li = document.createElement('li');
        li.textContent = `${event.name} - ${event.date.iso}`;
        eventsList.appendChild(li);
    });
}