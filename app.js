const apiKey = "16f00dd6edca31d9934c7fd9cdfba77c";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";

const form = document.querySelector(".inputForm");

form.addEventListener("submit", handleSubmit);

const select = document.querySelector(".cities");

select.addEventListener("change", (e) => {
  e.preventDefault();
  document.querySelector(".inputCity").value = e.target.value;
});

function suggestTyping() {
  getAllCities().then((cities) =>
    document
      .querySelector(".inputCity")
      .addEventListener("input", (event) => handleTyping(event, cities))
  );
}

function handleTyping(e, cities) {
  e.preventDefault();
  const cityPrefix = document.querySelector(".inputCity").value;
  const selectedCities = cities
    .filter((city) => city.toLowerCase().includes(cityPrefix.toLowerCase()))
    .slice(0, 5);
  const selector = document.querySelector(".cities");
  select.innerHTML = '';
  selectedCities.forEach((city) => {
    const option = document.createElement("option");
    option.text = city;
    option.value = city;
    selector.appendChild(option);
  });

}

function handleSubmit(e) {
  e.preventDefault();
  const city = document.querySelector(".inputCity").value;
  fetchWeatherData(city);
}

async function fetchWeatherData(city) {
  const apiResponse = await fetch(
    `${baseUrl}q=${city}&units=metric&APPID=${apiKey}`
  );
  const weatherData = apiResponse.json();
  weatherData.then((data) => {
    //console.log(data)
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".country").textContent = `, ${data.sys.country}`;
    document.querySelector(".temprature").textContent = `${convertToFarenheit(
      data.main.temp
    )}°F`;
    document.querySelector(".sky").textContent = data.weather[0].main;
    document.querySelector(".min-max").textContent = `${convertToFarenheit(
      data.main.temp_min
    )}°F / ${convertToFarenheit(data.main.temp_max)}°F`;
  });
}

function convertToFarenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

function getAllCities() {
  return fetch("https://countriesnow.space/api/v0.1/countries")
    .then((res) => res.json())
    .then((res) => res.data)
    .then((data) =>
      data
        .map((obj) => obj.cities)
        .reduce((cities, array) => cities.concat(array), [])
    );
}

document.addEventListener("DOMContentLoaded", function () {
  fetchWeatherData("Khulna");
  suggestTyping();
});