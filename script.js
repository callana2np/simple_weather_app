/*import { apiKey } from "./config.js";
console.log(apiKey);*/

var apiKey = config.API_KEY;

document.addEventListener("DOMContentLoaded", function () {
  var cityName;
  const form = document.getElementById("city_form");
  const results = document.getElementById("results");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    cityName = document.getElementById("city_tbox").value;
    console.log(cityName);

    results.innerHTML = "";

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial&lang=en`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonData) {
        console.log(jsonData);

        const time = new Date().getTime() / 1000;
        const isDay =
          time >= jsonData.sys.sunrise && time <= jsonData.sys.sunset;

        // weather icon and description
        var iconCode = jsonData.weather[0].icon;
        var weatherMain = jsonData.weather[0].main;
        var weatherDesc = jsonData.weather[0].description;
        var icon = document.createElement("img");
        icon.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${iconCode}@2x.png`
        );
        icon.setAttribute("alt", weatherDesc);
        results.appendChild(icon);

        var mainDesc = document.createElement("p");
        mainDesc.innerHTML = `${weatherMain}`;
        results.appendChild(mainDesc);

        if (isDay) {
          if (weatherMain === "Clear") {
            document.body.style.background =
              "linear-gradient(#f9d423, #ff4350)";
          } else if (weatherMain === "Clouds") {
            document.body.style.background =
              "linear-gradient(#bdc3c7, #2c3e50)";
          } else if (weatherMain === "Rain") {
            document.body.style.background =
              "linear-gradient(#4e54c8, #8f94fb)";
          } else if (weatherMain === "Snow") {
            document.body.style.background =
              "linear-gradient(#d3cce3, #e9e4f0)";
          }
        } else {
          document.body.style.background = "linear-gradient(#2C3E50, #4CA1AF)";
        }
        // city
        var cityVal = jsonData.name;
        var countryVal = jsonData.sys.country;
        var location = document.createElement("p");
        location.innerHTML = `<b>Location</b>: ${cityVal}, ${countryVal}`;
        results.appendChild(location);

        // temperature
        var tempVal = jsonData.main.temp;
        var temp = document.createElement("p");
        temp.innerHTML = `<b>Temperature</b>: ${tempVal} degrees Fahrenheit`;
        results.appendChild(temp);

        // feels like
        var feelsLikeVal = jsonData.main.feels_like;
        var feelsLike = document.createElement("p");
        feelsLike.innerHTML = `<b>Feels like</b>: ${feelsLikeVal} degrees Fahrenheit`;
        results.appendChild(feelsLike);

        // max temp
        var maxTempVal = jsonData.main.temp_max;
        var maxTemp = document.createElement("p");
        maxTemp.innerHTML = `<b>Max temperature</b>: ${maxTempVal} degrees Fahrenheit`;
        results.appendChild(maxTemp);

        // min temp
        var minTempVal = jsonData.main.temp_min;
        var minTemp = document.createElement("p");
        minTemp.innerHTML = `<b>Min temperature</b>: ${minTempVal} degrees Fahrenheit`;
        results.appendChild(minTemp);

        // wind speed
        var windSpeedVal = jsonData.wind.speed;
        var windSpeed = document.createElement("p");
        windSpeed.innerHTML = `<b>Wind speed</b>: ${windSpeedVal} mph`;
        results.appendChild(windSpeed);

        // atmospheric pressure on ground level
        var grndLvlVal = jsonData.main.grnd_level;
        var grndLvl = document.createElement("p");
        grndLvl.innerHTML = `<b>Atmospheric pressure on ground level</b>: ${grndLvlVal} hPa`;
        results.appendChild(grndLvl);

        // Atmospheric pressure on sea level
        var seaLevVal = jsonData.main.pressure;
        var seaLev = document.createElement("p");
        seaLev.innerHTML = `<b>Atmospheric pressure at sea level</b>: ${seaLevVal} hPa`;
        results.appendChild(seaLev);

        // humidity
        var humidityVal = jsonData.main.humidity;
        var humidity = document.createElement("p");
        humidity.innerHTML = `<b>Humidity</b>: ${humidityVal}%`;
        results.appendChild(humidity);

        const sunrise = new Date(
          jsonData.sys.sunrise * 1000
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const sunset = new Date(jsonData.sys.sunset * 1000).toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" }
        );
        const sunTimes = document.createElement("p");
        sunTimes.innerHTML = `<b>Sunrise</b>: ${sunrise} | <b>Sunset</b>: ${sunset}`;
        results.appendChild(sunTimes);

        results.style.display = "block";
      })
      .catch(function (error) {
        console.log("Error fetching data", error);
        results.innerHTML =
          "<p><b>Error</b>: Unable to fetch data. Please try again.</p>";
        results.style.display = "block";
      });
  });
});
