const weatherApiKey = '48e1df00aa077093c853dac5d5afd127';
const emojiApiKey = '977cc4442c3bcbe474957666195f1b084a96383d';
const calendarificApiKey = 'w1ViWNCAEYBftNIFc4N5f3iVRFOwo3e6';


const city = 'Troy';
const state = 'NY';
const country = 'US';
const units = 'imperial';
const currentYear = new Date().getFullYear();

const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=${units}&appid=${weatherApiKey}`;

fetch(weatherApiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Weather API error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const weatherData = document.getElementById('weatherData');
        weatherData.innerHTML = `
            <li><strong>Temperature:</strong> ${data.main.temp}°F</li>
            <li><strong>Feels Like:</strong> ${data.main.feels_like}°F</li>
            <li><strong>Weather:</strong> ${data.weather[0].description}</li>
            <li><strong>Humidity:</strong> ${data.main.humidity}%</li>
            <li><strong>Wind Speed:</strong> ${data.wind.speed} m/s</li>
        `;
        const emojiKeyword = getEmojiKeyword(data.weather[0].description);
        fetchEmoji(emojiKeyword);
    })
    .catch(error => {
        const weatherData = document.getElementById('weatherData');
        weatherData.innerHTML = `<li>Error: ${error.message}</li>`;
        console.error('Error fetching the weather data:', error);
    });

function getEmojiKeyword(weatherDescription) {
    const description = weatherDescription.toLowerCase();
    if (description.includes('clear')) return 'sun';
    if (description.includes('cloud')) return 'cloud';
    if (description.includes('rain')) return 'rain';
    if (description.includes('snow')) return 'snow';
    if (description.includes('thunderstorm')) return 'thunder';
    if (description.includes('mist') || description.includes('fog')) return 'fog';
    return 'weather';
}

function fetchEmoji(keyword) {
    const emojiApiUrl = `https://emoji-api.com/emojis?search=${encodeURIComponent(keyword)}&access_key=${emojiApiKey}`;

    fetch(emojiApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Emoji API error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(emojis => {
            const weatherEmoji = document.getElementById('weatherEmoji');
            weatherEmoji.textContent = emojis[0].character;
        });
    }
function fetchEvents() {
    const eventsApiUrl = `https://calendarific.com/api/v2/holidays?&api_key=${calendarificApiKey}&country=${country}&year=${currentYear}&location=us-ny`;

    fetch(eventsApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Calendarific API error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const eventsData = document.getElementById('eventsData');
            const holidays = data.response.holidays;

            const today = new Date();
            const upcomingHolidays = holidays.filter(holiday => {
                const holidayDate = new Date(holiday.date.iso);
                return holidayDate >= today;
            }).sort((a, b) => new Date(a.date.iso) - new Date(b.date.iso));
            const nextEvents = upcomingHolidays.slice(0, 5);
            if (nextEvents.length === 0) {
                eventsData.innerHTML = `<li>No upcoming events found.</li>`;
                return;
            }

            eventsData.innerHTML = nextEvents.map(event => `
                <li>
                    <span class="event-name">${event.name}</span> - 
                    <span class="event-date">${event.date.iso}</span>
                </li>
            `).join('');
        })
        .catch(error => {
            const eventsData = document.getElementById('eventsData');
            eventsData.innerHTML = `<li>Error: ${error.message}</li>`;
            console.error('Error fetching the events data:', error);
        });
}
fetchEvents();