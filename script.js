const apiKey = '1f99afbdb1843e6017aadf2960ce6450'; 

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  if (city) {
    const weatherData = await fetchWeather(city);
    const forecastData = await fetchWeeklyWeather(city);
    displayWeather(weatherData);
    displayWeeklyWeather(forecastData);
  }
}

async function fetchWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  return {
    city: data.name,
    temperature: data.main.temp,
    pressure: data.main.pressure,
    precipitation: data.rain ? data.rain['1h'] : 0,
    wind: data.wind.speed
  };
}

async function fetchWeeklyWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  return data.list.map(item => ({
    date: item.dt_txt,
    temperature: item.main.temp
  }));
}

function displayWeather(weather) {
  const todayWeather = document.getElementById('todayWeather');
  const weatherDetails = document.getElementById('weatherDetails');
  
  todayWeather.innerHTML = `
    <h2>${weather.city}</h2>
    <h1>${weather.temperature}°C</h1>
  `;
  
  weatherDetails.innerHTML = `
    <p>Температура: ${weather.temperature}°C</p>
    <p>Давление: ${weather.pressure} ртутного столба</p>
    <p>Осадки: ${weather.precipitation} мм</p>
    <p>Ветер: ${weather.wind} м/с</p>
  `;
}

function displayWeeklyWeather(forecast) {
  const weeklyWeather = document.getElementById('weeklyWeather');
  weeklyWeather.innerHTML = forecast.map(day => `
    <div class="day">
      <p>${day.date}</p>
      <p>${day.temperature}°C</p>
    </div>
  `).join('');
}
