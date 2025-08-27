const apiKey = "649a6bd899c50dea1d0d2393cb3202b7"; // <== SHU YERGA O'Z API KEY'ingizNI QO'YING
const input = document.querySelector("input");
const weatherMain = document.querySelector(".weather-main img");
const locationInfo = document.querySelector(".location-info");
const forecastRow = document.querySelector(".forecast-row");
const highlightContainers = document.querySelectorAll(".highlight");

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeatherData(input.value);
  }
});

function getWeatherData(city) {

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        
      if (data.cod === 200) {
        updateWeatherUI(data);
      } else {
        alert("City not found!");
      }
    });
}

function updateWeatherUI(data) {
  const city = data.name;
  const country = data.sys.country;
  const temp = data.main.temp.toFixed(1);
  const description = data.weather[0].description;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const visibility = data.visibility / 1000;
  const icon = data.weather[0].icon;

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  document.querySelector("h2").textContent = `${city}, ${country}`;
  document.querySelector(".location-info p").textContent = `${temp}°C`;
  document.querySelector(".location-info span").textContent = `Monday, ${hours}:${minutes} PM`;
  document.querySelector("h1").textContent = description.charAt(0).toUpperCase() + description.slice(1);
  weatherMain.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // Update highlights
  highlightContainers[0].innerHTML = `
    <p>UV Index – 0 (Low)</p>
    <p>Wind Speed – ${windSpeed} Km/h</p>
    <p>Sunrise – ${convertUnixTime(data.sys.sunrise)}</p>
    <p>Sunset – ${convertUnixTime(data.sys.sunset)}</p>
  `;
  highlightContainers[1].innerHTML = `
    <p>Humidity – ${humidity}%</p>
    <p>Visibility – ${visibility} km</p>
    <p>Air Quality – 90</p>
  `;

  // Dummy forecast data for example
  updateForecast(temp);
}

function convertUnixTime(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateForecast(baseTemp) {
  forecastRow.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const hour = (9 + i) % 24;
    const temp = (parseFloat(baseTemp) + i).toFixed(1);
    forecastRow.innerHTML += `
      <div class="forecast">
        <p>${hour}:00</p>
        <img src="https://img.icons8.com/ios/50/snow.png" />
        <p>${temp}°C</p>
      </div>
    `;
  }
}
