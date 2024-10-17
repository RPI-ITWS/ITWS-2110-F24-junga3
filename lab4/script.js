const weatherApiKey = '48e1df00aa077093c853dac5d5afd127';
const calendarApiKey = 'w1ViWNCAEYBftNIFc4N5f3iVRFOwo3e6';

const updateInfoButton = document.getElementById('updateInfo');
const temperatureInput = document.getElementById('temperature');
const windSpeedInput = document.getElementById('windSpeed');
const humidityInput = document.getElementById('humidity');
const weatherDescriptionInput = document.getElementById('weatherDescription');
const pressureInput = document.getElementById('pressure');
const holidaysInputs = [
    document.getElementById('holiday1'),
    document.getElementById('holiday2'),
    document.getElementById('holiday3'),
    document.getElementById('holiday4'),
    document.getElementById('holiday5')
];

const displayTemperature = document.getElementById('displayTemperature');
const displayWindSpeed = document.getElementById('displayWindSpeed');
const displayHumidity = document.getElementById('displayHumidity');
const displayWeatherDescription = document.getElementById('displayWeatherDescription');
const displayPressure = document.getElementById('displayPressure');
const holidaysListDisplay = document.getElementById('holidaysListDisplay');

async function fetchWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Troy,NY,US&appid=${weatherApiKey}&units=imperial`);
        const data = await response.json();
        displayTemperature.textContent = `Temperature: ${data.main.temp} °F`;
        displayWindSpeed.textContent = `Wind Speed: ${data.wind.speed} mph`;
        displayHumidity.textContent = `Humidity: ${data.main.humidity} %`;
        displayWeatherDescription.textContent = `Description: ${data.weather[0].description}`;
        displayPressure.textContent = `Pressure: ${data.main.pressure} hPa`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function fetchHolidays() {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const response = await fetch(`https://calendarific.com/api/v2/holidays?api_key=${calendarApiKey}&country=US&year=2024`);
        const data = await response.json();
        if (data.response && data.response.holidays) {
            const upcomingHolidays = data.response.holidays.filter(holiday => holiday.date.iso >= currentDate).slice(0, 5);
            holidaysListDisplay.innerHTML = '';
            upcomingHolidays.forEach(holiday => {
                const li = document.createElement('li');
                li.textContent = `${holiday.name} - ${holiday.date.iso}`;
                holidaysListDisplay.appendChild(li);
            });
        } else {
            console.error('No holidays data found');
        }
    } catch (error) {
        console.error('Error fetching holiday data:', error);
    }
}

// Initial fetches
fetchWeather();
fetchHolidays();

// Event listener for updating the displayed information
updateInfoButton.addEventListener('click', () => {
    displayTemperature.textContent = `Temperature: ${temperatureInput.value}`;
    displayWindSpeed.textContent = `Wind Speed: ${windSpeedInput.value}`;
    displayHumidity.textContent = `Humidity: ${humidityInput.value}`;
    displayWeatherDescription.textContent = `Description: ${weatherDescriptionInput.value}`;
    displayPressure.textContent = `Pressure: ${pressureInput.value}`;
    
    holidaysListDisplay.innerHTML = '';
    holidaysInputs.forEach((input, index) => {
        if (input.value) {
            const li = document.createElement('li');
            li.textContent = input.value;
            holidaysListDisplay.appendChild(li);
        }
    });
});
