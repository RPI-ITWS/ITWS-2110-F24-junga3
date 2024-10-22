const openWeatherApiKey = '48e1df00aa077093c853dac5d5afd127';
const calendarificApiKey = 'w1ViWNCAEYBftNIFc4N5f3iVRFOwo3e6';

function fetchConversionRate() {
    fetch('https://api.frankfurter.app/latest?from=USD&to=KRW')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Frankfurter API error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const rate = data.rates.KRW;
            const conversionRateDiv = document.getElementById('conversionRate');
            conversionRateDiv.innerHTML = `1 USD = ${rate} KRW`;
        })
        .catch(error => {
            const conversionRateDiv = document.getElementById('conversionRate');
            conversionRateDiv.innerHTML = `Error: ${error.message}`;
            console.error('Error fetching conversion rate:', error);
        });
}

function fetchWeather(city, countryCode, elementId) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&units=metric&appid=${openWeatherApiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`OpenWeather API error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const weatherDiv = document.getElementById(elementId);
            const temp = data.main.temp;
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherDiv.innerHTML = `
                <img src="${iconUrl}" alt="Weather icon">
                <p>Temperature: ${temp}°C</p>
                <p>Description: ${description}</p>
            `;
        })
        .catch(error => {
            const weatherDiv = document.getElementById(elementId);
            weatherDiv.innerHTML = `Error: ${error.message}`;
            console.error('Error fetching weather data:', error);
        });
}

function fetchHolidays(countryCode, elementId) {
    const currentYear = new Date().getFullYear();
    const holidaysApiUrl = `https://calendarific.com/api/v2/holidays?&api_key=${calendarificApiKey}&country=${countryCode}&year=${currentYear}`;
    
    fetch(holidaysApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Calendarific API error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const holidaysData = document.getElementById(elementId);
            const holidays = data.response.holidays;

            const today = new Date();
            const upcomingHolidays = holidays.filter(holiday => {
                const holidayDate = new Date(holiday.date.iso);
                return holidayDate >= today;
            }).sort((a, b) => new Date(a.date.iso) - new Date(b.date.iso));
            const nextHolidays = upcomingHolidays.slice(0, 5);
            if (nextHolidays.length === 0) {
                holidaysData.innerHTML = `<li>No upcoming holidays found.</li>`;
                return;
            }

            holidaysData.innerHTML = nextHolidays.map(holiday => `
                <li>
                    <span class="holiday-name">${holiday.name}</span> - 
                    <span class="holiday-date">${holiday.date.iso}</span>
                </li>
            `).join('');
        })
        .catch(error => {
            const holidaysData = document.getElementById(elementId);
            holidaysData.innerHTML = `<li>Error: ${error.message}</li>`;
            console.error('Error fetching the holidays data:', error);
        });
}


fetchConversionRate();
fetchWeather('Troy', 'US', 'weatherTroy');
fetchWeather('Seoul', 'KR', 'weatherSeoul');
fetchHolidays('US', 'holidaysUS');
fetchHolidays('KR', 'holidaysKR');
