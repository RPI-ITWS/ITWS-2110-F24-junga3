const weatherApiKey = '48e1df00aa077093c853dac5d5afd127';
const calendarificApiKey = 'w1ViWNCAEYBftNIFc4N5f3iVRFOwo3e6';
const city = 'Troy';
const state = 'NY';
const country = 'US';
const units = 'imperial';

const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=${units}&appid=${weatherApiKey}`;
const eventsApiUrl = `https://api.calendarific.com/v2/holidays?&api_key=${calendarificApiKey}&country=US&year=2024`;

document.getElementById('fetchDataButton').addEventListener('click', () => {
   fetchWeatherData();
   fetchEventsData();
});

function fetchWeatherData() {
   fetch(weatherApiUrl)
      .then(response => response.json())
      .then(data => {
         document.getElementById('weatherData').innerHTML =
            `<p>Temperature: ${data.main.temp}°F</p><p>Description: ${data.weather[0].description}</p>`;
         // Send data to PHP script to store in MySQL
         fetch('', { // Leave URL empty to send request to same file
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
         });
      })
      .catch(error => console.error('Error fetching weather data:', error));
}

function fetchEventsData() {
   fetch(eventsApiUrl)
      .then(response => response.json())
      .then(data => {
         const eventsList = document.getElementById('eventsList');
         eventsList.innerHTML = '';
         data.response.holidays.forEach(event => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${event.name}</strong><br>Date: ${event.date.iso}`;
            eventsList.appendChild(li);
         });
         // Send data to PHP script to store in MySQL
         fetch('', { // Leave URL empty to send request to same file
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
         });
      })
      .catch(error => console.error('Error fetching events data:', error));
}

document.getElementById('weatherForm').addEventListener('submit', function(e) {
   e.preventDefault();
   const temp = document.getElementById('temp').value;
   const description = document.getElementById('description').value;

   const updatedWeather = { main: { temp }, weather: [{ description }] };

   fetch('', { // Leave URL empty to send request to same file
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedWeather),
   })
   .then(response => response.text())
   .then(data => alert(data))
   .catch(error => console.error('Error updating weather data:', error));
});