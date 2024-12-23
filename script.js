// get OpenWeatherMap API key
var apiKey = config.API_KEY;

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
        const location = document.createElement("p");
        location.innerHTML = `<b>Location</b>: ${cityVal}, ${countryVal}`;
        results.appendChild(location);

        // temperature
        const tempVal = jsonData.main.temp;
        const temp = document.createElement("p");
        temp.innerHTML = `<b>Temperature</b>: ${tempVal} degrees Fahrenheit`;
        results.appendChild(temp);

        // feels like
        const feelsLikeVal = jsonData.main.feels_like;
        const feelsLike = document.createElement("p");
        feelsLike.innerHTML = `<b>Feels like</b>: ${feelsLikeVal} degrees Fahrenheit`;
        results.appendChild(feelsLike);

        // max temp
        var maxTempVal = jsonData.main.temp_max;
        var maxTemp = document.createElement("p");
        maxTemp.innerHTML = `<b>Max temperature</b>: ${maxTempVal} degrees Fahrenheit`;
        results.appendChild(maxTemp);

        // min temp
        const minTempVal = jsonData.main.temp_min;
        const minTemp = document.createElement("p");
        minTemp.innerHTML = `<b>Min temperature</b>: ${minTempVal} degrees Fahrenheit`;
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

        // display the results
        results.style.display = "block";
      })
      // if unsuccessful
      .catch(function (error) {
        // output error to console
        console.log("Error fetching data", error);

        // display error message on results div
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

  // ending with minutes
  timeStr += ":" + mins;
  timeStr += hrs >= 12 ? " PM" : " AM";

  // return SDT string
  return timeStr;
}
