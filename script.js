const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click", async () => {

  const city = cityInput.value.trim();

  if (!city) {
    weatherResult.innerHTML = "Please enter a city name";
    return;
  }

  try {

    weatherResult.innerHTML = "Loading...";

    // Get Latitude & Longitude
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
    );

    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      throw new Error("City not found");
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // Fetch Weather Data
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,precipitation_probability`
    );

    const weatherData = await weatherResponse.json();

    // Extract Data
    const temp = weatherData.current_weather.temperature;
    const wind = weatherData.current_weather.windspeed;

    const humidity =
      weatherData.hourly.relativehumidity_2m[0];

    const precipitation =
      weatherData.hourly.precipitation_probability[0];

    // Display Weather
    weatherResult.innerHTML = `
      <h2>${city}</h2>
      <p>🌡 Temperature: ${temp} °C</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>🌬 Wind Speed: ${wind} km/h</p>
      <p>🌧 Precipitation: ${precipitation}%</p>
    `;

  } catch (error) {

    weatherResult.innerHTML = '${error.message}';

  }

});