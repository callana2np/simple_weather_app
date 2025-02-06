// import function to get country name from country code
import { getCountry } from "./country-mappings.js";

// get OpenWeatherMap API key
const apiKey = config.API_KEY;

// only after DOM loaded
document.addEventListener("DOMContentLoaded", function () {
  var cityName;
  const form = document.getElementById("city_form");
  const results = document.getElementById("results");

  // "Submit" button event handler
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // fetch location from textbox
    cityName = document.getElementById("city_tbox").value;
    console.log(cityName);

    // reset results on new input
    results.innerHTML = "";

    // if user gave empty input, display error
    if (cityName == "") {
      results.innerHTML = "<p><b>Error</b>: Please enter a city name.</p>";
      return;
    }

    // request to OpenWeatherMap API
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial&lang=en`
    )
      // parse data into JS object
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonData) {
        console.log(jsonData);

        // Unicode escape sequence degrees F sign
        const fahrSym = "\u2109";

        // get current time to check if daytime
        const time = new Date().getTime() / 1000;
        const isDay =
          time >= jsonData.sys.sunrise && time <= jsonData.sys.sunset;

        // weather icon and description
        const iconCode = jsonData.weather[0].icon;
        const weatherMain = jsonData.weather[0].main;
        const weatherDesc = jsonData.weather[0].description;
        const icon = document.createElement("img");
        icon.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${iconCode}@2x.png`
        );
        icon.setAttribute("alt", weatherDesc);
        results.appendChild(icon);

        const mainDesc = document.createElement("p");
        mainDesc.innerHTML = `${weatherMain}`;
        results.appendChild(mainDesc);

        // change background color palette depending on weather if daytime
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

        // location
        const cityVal = jsonData.name;
        const countryVal = jsonData.sys.country;

        // convert country code to country name
        const countryName = getCountry(countryVal);
        const location = document.createElement("p");
        location.innerHTML = `<b>Location</b>: ${cityVal}, ${countryName}`;
        results.appendChild(location);

        // temperature
        const tempVal = jsonData.main.temp.toFixed(1);
        const temp = document.createElement("p");
        temp.innerHTML = `<b>Temperature</b>: ${tempVal}${fahrSym}`;
        results.appendChild(temp);

        // feels like
        const feelsLikeVal = jsonData.main.feels_like.toFixed(1);
        const feelsLike = document.createElement("p");
        feelsLike.innerHTML = `<b>Feels like</b>: ${feelsLikeVal}${fahrSym}`;
        results.appendChild(feelsLike);

        // max temp
        var maxTempVal = jsonData.main.temp_max.toFixed(1);
        var maxTemp = document.createElement("p");
        maxTemp.innerHTML = `<b>Max temperature</b>: ${maxTempVal}${fahrSym}`;
        results.appendChild(maxTemp);

        // min temp
        const minTempVal = jsonData.main.temp_min.toFixed(1);
        const minTemp = document.createElement("p");
        minTemp.innerHTML = `<b>Min temperature</b>: ${minTempVal}${fahrSym}`;
        results.appendChild(minTemp);

        // wind speed
        const windSpeedVal = jsonData.wind.speed;
        const windSpeed = document.createElement("p");
        windSpeed.innerHTML = `<b>Wind speed</b>: ${windSpeedVal} mph`;
        results.appendChild(windSpeed);

        // atmospheric pressure on ground level
        const grndLvlVal = jsonData.main.grnd_level;
        const grndLvl = document.createElement("p");
        grndLvl.innerHTML = `<b>Atmospheric pressure on ground level</b>: ${grndLvlVal} hPa`;
        results.appendChild(grndLvl);

        // elevation
        // latitude and longitude
        const lat = jsonData.coord.lat;
        const long = jsonData.coord.lon;

        // request to Elevation API
        fetch(
          `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${long}`
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (elevData) {
            console.log(elevData);

            // convert elevation in m to ft
            const elevM = elevData.elevation;
            // Locale string to add commas for higher elevations
            const elevFt = Math.round(elevM * 3.28084).toLocaleString();

            const elev = document.createElement("p");
            elev.innerHTML = `<b>Elevation</b>: ${elevFt} ft above sea level`;
            results.appendChild(elev);
          })
          // if Elevation API connection unsuccessful
          .catch(function (error) {
            console.log("Error fetching elevation data", error);
            const elev = document.createElement("p");
            elev.innerHTML = `<b>Elevation</b>: Unavailable`;
            results.appendChild(elev);
          });

        // atmospheric pressure on sea level
        const seaLevVal = jsonData.main.pressure;
        const seaLev = document.createElement("p");
        seaLev.innerHTML = `<b>Atmospheric pressure at sea level</b>: ${seaLevVal} hPa`;
        results.appendChild(seaLev);

        // humidity
        const humidityVal = jsonData.main.humidity;
        const humidity = document.createElement("p");
        humidity.innerHTML = `<b>Humidity</b>: ${humidityVal}%`;
        results.appendChild(humidity);

        // sunrise and sunset
        // get timezone for offset
        const offset = jsonData.timezone;

        // convert sunrise and sunset Unix time + offset to milliseconds
        // then call toUTCString() method
        let sunrise = new Date(
          (jsonData.sys.sunrise + offset) * 1000
        ).toUTCString();
        let sunset = new Date(
          (jsonData.sys.sunset + offset) * 1000
        ).toUTCString();

        // convert UTC formats of sunrise and sunset to SDT
        sunrise = utcToSDT(sunrise);
        sunset = utcToSDT(sunset);

        const sunTimes = document.createElement("p");
        sunTimes.innerHTML = `<b>Sunrise</b>: ${sunrise} | <b>Sunset</b>: ${sunset}`;
        results.appendChild(sunTimes);

        // display all results
        results.style.display = "block";
      })
      // if OWP connection unsuccessful
      .catch(function (error) {
        // output error to console
        console.log("Error fetching data", error);

        // display error message
        results.innerHTML =
          "<p><b>Error</b>: Unable to fetch data. Please try again.</p>";
        results.style.display = "block";
      });
  });
});

// convert UTC format to SDT format
function utcToSDT(utcTime) {
  // extract hours and seconds from UTC time
  let time = utcTime.slice(17, 22).split(":");
  const hrs = Number(time[0]);
  const mins = Number(time[1]);

  // build SDT string
  let timeStr = "";

  // starting with hours
  if (hrs > 0 && hrs <= 12) {
    timeStr += hrs;
  } else if (hrs > 12) {
    timeStr += hrs - 12;
  } else if (hrs == 0) {
    timeStr += 12;
  }

  // if the minutes are single digit, then add a zero
  // ex: 7:1 PM -> 7:01 PM
  const minsStr = mins < 10 ? "0" + mins : mins;

  // ending with minutes
  timeStr += ":" + minsStr;
  timeStr += hrs >= 12 ? " PM" : " AM";

  return timeStr;
}
