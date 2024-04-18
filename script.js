// Function to fetch weather data from the OpenWeatherMap API
function fetchWeather(city) {
    const apiKey = 'b7f919469931ecb306ac1e5eeeb27e77';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Handle the fetched data
            displayWeather(data);
            fetchCityImages(city);
        })
        .catch(error => {
            console.log('Error fetching weather data:', error);
        });
}

// Function to display weather information on the page
function displayWeather(data) {
    const weatherInfoElement = document.getElementById('weather-info');
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;

    // Convert temperature from Kelvin to Fahrenheit and round to 2 decimal places
    const fahrenheitTemperature = Math.round(((temperature - 273.15) * 9/5 + 32) * 100) / 100;

    // Create HTML content to display weather information
    const weatherHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${fahrenheitTemperature}°F</p>
        <p>Description: ${description}</p>
    `;

    // Set the HTML content in the weather-info element
    weatherInfoElement.innerHTML = weatherHTML;
}

// Function to search weather for the entered city
function searchWeather() {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim(); // Get the city name and remove leading/trailing spaces
    if (city) {
        fetchWeather(city);
        fetchForecast(city);
    } else {
        alert('Please enter a city name.');
    }
}

function fetchCityImages(city) {
    const accessKey = 'Xm3vRHbBWd7esxS05WgO1c_ObCPMKZKyuW-BkokZq1U';
    const apiUrl = `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=${accessKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Handle the fetched data
            displayCityImage(data);
        })
        .catch(error => {
            console.log('Error fetching city images:', error);
        });
}

// Function to display city image as the background
function displayCityImage(data) {
    // Check if there are any results
    if (data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const imageUrl = data.results[randomIndex].urls.regular;
        document.body.style.backgroundImage = `url(${imageUrl})`;
    } else {
        console.log('No images found for the city.');
    }
}




function fetchForecast(city) {
    const apiKey = 'b7f919469931ecb306ac1e5eeeb27e77';
    const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`;

    fetch(apiUrlForecast)
        .then(response => response.json())
        .then(data => {
            // Handle the fetched forecast data
            displayForecast(data);
        })
        .catch(error => {
            console.log('Error fetching forecast data:', error);
        });
}




function displayForecast(forecastData) {
    const forecastBox = document.getElementById('forecast-box');

    // Clear previous forecast data
    forecastBox.innerHTML = '';

    // Extract forecast for the next 5 days
    const forecastMap = new Map(); // Use a Map to store daily forecasts
    const currentDate = new Date();
    const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const timesToDisplay = [4, 12, 20]; // Adjusted times in hours (morning, noon, evening)
    for (const forecast of forecastData.list) {
        const forecastDate = new Date(forecast.dt * 1000);
        const forecastHour = forecastDate.getHours();
        const forecastDateWithoutTime = new Date(forecastDate.getFullYear(), forecastDate.getMonth(), forecastDate.getDate());
        if (forecastDateWithoutTime > currentDateWithoutTime && timesToDisplay.includes(forecastHour)) {
            const dateStr = forecastDate.toLocaleDateString();
            const description = forecast.weather[0].description;
            const tempCelsius = Math.round(((forecast.main.temp_min + forecast.main.temp_max) / 2 - 273.15) * 100) / 100;
            const tempFahrenheit = Math.round((tempCelsius * 9/5) + 32);
            const humidity = forecast.main.humidity;
            const windSpeed = forecast.wind.speed;
            // Check if forecast for this date already exists in the map
            if (!forecastMap.has(dateStr)) {
                // If not, add a new entry
                forecastMap.set(dateStr, { date: dateStr, description, temp: tempFahrenheit, humidity, windSpeed });
            } else {
                // If yes, update the existing entry with average temperature, humidity, and wind speed
                const existingForecast = forecastMap.get(dateStr);
                existingForecast.temp = Math.round(((existingForecast.temp + tempFahrenheit) / 2) * 100) / 100;
                existingForecast.humidity = Math.round(((existingForecast.humidity + humidity) / 2) * 100) / 100;
                existingForecast.windSpeed = Math.round(((existingForecast.windSpeed + windSpeed) / 2) * 100) / 100;
                forecastMap.set(dateStr, existingForecast);
            }
        }
    }

    // Create HTML content to display forecast information
    let forecastHTML = '<h2>Forecast</h2>';
    forecastHTML += '<ul>';
    forecastMap.forEach(forecast => {
        forecastHTML += `
            <li>
                <strong>Date:</strong> ${forecast.date}<br>
                <strong>Description:</strong> ${forecast.description}<br>
                <strong>Average Temp (°F):</strong> ${forecast.temp}<br>
                <strong>Humidity (%):</strong> ${forecast.humidity}<br>
                <strong>Wind Speed (m/s):</strong> ${forecast.windSpeed}<br>
            </li>
        `;
    });
    forecastHTML += '</ul>';

    // Set the HTML content in the forecast box
    forecastBox.innerHTML = forecastHTML;
}


