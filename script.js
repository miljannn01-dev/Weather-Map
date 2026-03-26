const apiKey = "d727d5aa86e7efa7ccb1dcc6af8f20d6";

let map;
let marker;

// Initialize Google Map
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 7.1907, lng: 125.4553 }, // Default: Davao
    zoom: 8,
  });
}

// Fetch weather data
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");

  // Validation
  if (!city) {
    resultDiv.innerHTML = "⚠️ Please enter a city.";
    return;
  }

  resultDiv.innerHTML = "⏳ Loading...";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},PH&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    // Handle API errors properly
    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    const name = data.name;
    const temp = data.main.temp;
    const desc = data.weather[0].description;
    const lat = data.coord.lat;
    const lon = data.coord.lon;

    // Display weather
    resultDiv.innerHTML = `
      <h3>${name}</h3>
      <p>🌡 Temperature: ${temp}°C</p>
      <p>☁️ Weather: ${desc}</p>
    `;

    // Update map
    updateMap(lat, lon);

  } catch (error) {
    resultDiv.innerHTML = `❌ ${error.message}`;
  }
}

// Update Google Map
function updateMap(lat, lon) {
  const location = { lat: lat, lng: lon };

  map.setCenter(location);
  map.setZoom(10);

  // Remove old marker
  if (marker) {
    marker.setMap(null);
  }

  // Add new marker
  marker = new google.maps.Marker({
    position: location,
    map: map,
  });
}