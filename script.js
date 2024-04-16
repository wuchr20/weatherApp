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