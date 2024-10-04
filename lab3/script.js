const weatherApiKey = '48e1df00aa077093c853dac5d5afd127';
const calendarificApiKey = 'w1ViWNCAEYBftNIFc4N5f3iVRFOwo3e6';
const city = 'Troy';
const state = 'NY';
const country = 'US';
const units = 'imperial';
const currentYear = new Date().getFullYear();

const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=${units}&appid=${weatherApiKey}`;
const eventsApiUrl = `https://calendarific.com/api/v2/holidays?&api_key=${calendarificApiKey}&country=${country}&year=${currentYear}&location=us-ny`;

document.getElementById('fetchWeatherData').addEventListener('click', () => {
    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cityName').innerText = data.name;
            document.getElementById('temperature').innerText = data.main.temp;
            document.getElementById('description').innerText = data.weather[0].description;
            document.getElementById('humidity').innerText = data.main.humidity;
            document.getElementById('windSpeed').innerText = data.wind.speed;

            return fetch("Lab3.php", {
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
});

document.getElementById('fetchEventsData').addEventListener('click', () => {
    fetch(eventsApiUrl)
        .then(response => response.json())
        .then(data => {
            const eventsList = document.getElementById('eventsList');
            eventsList.innerHTML = '';
            data.response.holidays.slice(0, 5).forEach(event => {
                const li = document.createElement('li');
                li.textContent = `${event.name} - ${event.date.iso}`;
                eventsList.appendChild(li);
            });

            return fetch("Lab3.php", {
                method: "POST",
                body: JSON.stringify({
                    type: 'events',
                    data: data.response.holidays.slice(0, 5)
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

document.getElementById('fetchWeatherfromSQL').addEventListener('click', () => {
    fetch("Lab3Weather.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }
            const weatherData = JSON.parse(data.String);
            document.getElementById('cityName').innerText = weatherData.name;
            document.getElementById('temperature').innerText = weatherData.main.temp;
            document.getElementById('description').innerText = weatherData.weather[0].description;
            document.getElementById('humidity').innerText = weatherData.main.humidity;
            document.getElementById('windSpeed').innerText = weatherData.wind.speed;
        })
        .catch(error => console.error('Error fetching weather data:', error));
});

document.getElementById('fetchEventsfromSQL').addEventListener('click', () => {
    fetch("Lab3Events.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }
            const eventsData = JSON.parse(data.String);
            const eventsList = document.getElementById('eventsList');
            eventsList.innerHTML = '';
            eventsData.forEach(event => {
                const li = document.createElement('li');
                li.textContent = `${event.name} - ${event.date.iso}`;
                eventsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching events data:', error));
});

document.getElementById('updateWeatherForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const newTemperature = document.getElementById('newTemperature').value;
    document.getElementById('temperature').innerText = newTemperature;
    fetch("Lab3UserWeather.php", {
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
    fetch("Lab3UserEvents.php", {
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