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
  const date = new Date(data.dt * 1000);
  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return {
    time: time,
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

  const dailyData = data.list.reduce((acc, curr) => {
    const date = new Date(curr.dt_txt);
    const day = date.toLocaleDateString("ru-RU", { weekday: 'short' });
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(curr.main.temp);
    return acc;
  }, {});

  return Object.keys(dailyData).map((day, index) => ({
    day: index === 0 ? 'Сегодня' : index === 1 ? 'Завтра' : day,
    maxTemp: Math.max(...dailyData[day])
  })).slice(0, 7); // Ограничение прогноза до 7 дней
}

function displayWeather(weather) {
  const todayWeather = document.getElementById('todayWeather');
  const weatherDetails = document.getElementById('weatherDetails');
  
  todayWeather.innerHTML = `
  <h1 style="margin-top: 20px;
  font-family: Montserrat;
  font-size: 450%;
  font-weight: 500;
  text-align: left;
  width: 160px;">${Math.round(weather.temperature)}°</h1>
  <h2>Время: ${weather.time}</h2>
    <h2>Город: ${weather.city}</h2>
    
  `;
  
  weatherDetails.innerHTML = `
    <p>Температура ${Math.round(weather.temperature)}°</p>
    <p>Давление ${weather.pressure} ртутного столба</p>
    <p>Осадки ${weather.precipitation} мм</p>
    <p>Ветер ${weather.wind} м/с</p>
  `;
}

function displayWeeklyWeather(forecast) {
  const weeklyWeather = document.getElementById('weeklyWeather');
  weeklyWeather.innerHTML = forecast.map(day => `
    <div class="day">
      <p>${day.day}</p>
      <p>${Math.round(day.maxTemp)}°C</p>
    </div>
  `).join('');
}
