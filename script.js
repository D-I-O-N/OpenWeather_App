const apiKey = '1f99afbdb1843e6017aadf2960ce6450';

function toggleTheme() {
  const body = document.body;
  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
  } else {
    body.classList.add('transition');
    setTimeout(() => {
      body.classList.add('dark-mode');
      body.classList.remove('transition');
    }, 50);
  }
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
    date: date,
    time: time,
    city: data.name,
    temperature: data.main.temp,
    pressure: data.main.pressure,
    precipitation: data.rain ? data.rain['1h'] : 0,
    wind: data.wind.speed,
    description: data.weather[0].description
  };
}

async function fetchWeeklyWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();

  const dailyData = data.list.reduce((acc, curr) => {
    const date = new Date(curr.dt_txt);
    const day = date.toLocaleDateString("ru-RU", { weekday: 'short' });
    const dayDate = date.toLocaleDateString("ru-RU", { day: 'numeric', month: 'short' });
    if (!acc[day]) {
      acc[day] = {
        temps: [],
        description: curr.weather[0].description,
        date: dayDate
      };
    }
    acc[day].temps.push(curr.main.temp);
    return acc;
  }, {});

  return Object.keys(dailyData).map((day, index) => ({
    day: index === 0 ? 'Сегодня' : index === 1 ? 'Завтра' : day,
    maxTemp: Math.max(...dailyData[day].temps),
    description: dailyData[day].description,
    date: dailyData[day].date
  })).slice(0, 7);
}

function displayWeather(weather) {
  const todayWeather = document.getElementById('todayWeather');
  const weatherDetails = document.getElementById('weatherDetails');
  
  todayWeather.innerHTML = `
            <div class="today-img">
              <div>
                <h1 id="today-temp">${Math.round(weather.temperature)}°</h1>
                <h1 id="today">Сегодня</h1>
              </div>
            <img style="margin-top: 30px;" id="today-sun" src="./img/sun.svg" height="95" width="95" />
          </div>
  <p id="today-time">Время: ${weather.time}</p>
    <p id="today-city">Город: ${weather.city}</p>
  `;
  
  weatherDetails.innerHTML = `
        <table>
          <tr>
            <td><span class="icon-cell"><img src="./img/temp.svg" alt="Temperature"></span></td>
            <td>Температура:</td>
            <td>${Math.round(weather.temperature)}° - ощущается как ${Math.round(weather.temperature)-3}°</td>
          </tr>
          <tr>
            <td><span class="icon-cell"><img src="./img/pressure.svg" alt="Pressure"></span></td>
            <td>Давление:</td>
            <td>${weather.pressure} мм ртутного столба - нормальное</td>
          </tr>
          <tr>
            <td><span class="icon-cell"><img src="./img/Group.svg" alt="Precipitation"></span></td>
            <td>Осадки:</td>
            <td>${weather.precipitation} мм</td>
          </tr>
          <tr>
            <td><span class="icon-cell"><img src="./img/wind.svg" alt="Wind"></span></td>
            <td>Ветер:</td>
            <td>${weather.wind} м/с юго-запад - легкий ветер</td>
          </tr>
        </table>
  `;
}

function displayWeeklyWeather(forecast) {
  const weeklyWeather = document.getElementById('weeklyWeather');
  weeklyWeather.innerHTML = forecast.map(day => `
      <div class="day">
        <p id="day-name">${day.day}</p>
        <p id="day-about">${day.date}</p>
        <img src="./img/rain-sun.png" />
        <p id="day-temp">${Math.round(day.maxTemp)}°</p>
        <p id="day-about">${Math.round(day.maxTemp)-3}°</p>
        <p id="day-about">${day.description}</p>
      </div>
  `).join('');
}
