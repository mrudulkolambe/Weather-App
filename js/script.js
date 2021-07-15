//Get Your API KEY from https://openweathermap.org/api/

let apiKey = ``;
function sidebarToggle1() {
  let page1 = document.getElementById('page1');
  let page2 = document.getElementById('page2');
  page1.style.display = "none";
  page2.style.display = "block";
};
function sidebarToggle2() {
  page1.style.display = 'block';
  page2.style.display = 'none';
}
function getLocation() {
  if (navigator.geolocation) {
    let position = navigator.geolocation.getCurrentPosition(showPostion);

  } else {
    alert("Turn On Location Services!")
  }
}
function showPostion(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  getWeather(latitude, longitude);
};


function getWeather(latitude, longitude) {
  getCity(latitude, longitude);
  let exclude = `minutely,alerts`;
  let URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=${exclude}&appid=${apiKey}`;
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `${URL}`);
  xhr.onload = function() {
    if (xhr.status == 200) {
      let json = JSON.parse(this.responseText);
      //console.log(json);

      // FETCH CURRENT DATA
      let Date_Day = window.moment(json.daily[0].dt * 1000).format("Do MMM ddd");
      document.getElementById('Date_Day').innerHTML = Date_Day;
      let tempDiv = `
      <p>
      ${json.current.temp}&#176;C
      </p>
      <div class="feelsLike">
      <p>
      Feels Like ${json.current.feels_like}&#176;C
      </p>
      </div>
      `;
      document.getElementById('temperature').innerHTML = tempDiv;
      //HOURLY FORECAST SECTION
      let nowTemp = document.getElementById('hourlyContainer').innerHTML = `<div class="hourlyItem">
      <div class="hourDiv">
      Now
      </div>
      <div class="hourlyChild now">
      <div class="hourlyTempDiv">
      <p>
      ${json.current.temp}&#176;C
      </p>
      </div>
      </div>
      </div>`;

      for (var i = 0; i <= 12; i++) {
        let newDt = window.moment(json.hourly[i].dt * 1000).format("hh a");
        let temp = json.hourly[i].temp;
        document.getElementById('hourlyContainer').innerHTML += `<div class="hourlyItem">
        <div class="hourDiv">
        ${newDt}
        </div>
        <div class="hourlyChild">
        <div class="hourlyTempDiv">
        <p>
        ${temp}&#176;C
        </p>
        </div>
        </div>
        </div>`
      }
      //DAILY FORECAST SECTION
      for (var i = 0; i < json.daily.length; i++) {
        let forecastItems = `<div class="forecast-items">
        <div class="forecast-items-child" id="${i}" onclick="toggleExtra(this.id)">
        <div class="forecast-child2">
        <div class="forecast-icons">
        <i class="fas fa-angle-down"></i>
        </div>
        <div class="days">
        ${window.moment(json.daily[i].dt * 1000).format("dddd, Do MMMM")}
        </div>
        </div>
        <div class="forecast-info">
        ${json.daily[i].temp.day}&#176;C
        </div>
        </div>
        <div class="extraInfo" style="display: none;" id="extraInfo${i}">
        <div>
        <div class="minTemp">
        Min : ${json.daily[i].temp.min}&#176;C &nbsp;
        </div>
        <div class="maxTemp">
        Max : ${json.daily[i].temp.max}&#176;C &nbsp;
        </div>
        </div>
        <div>
        <div class="weatherExtra">
        Weather : ${json.daily[i].weather[0].description} &nbsp;
        </div>
        <div class="humidity">
        Humidity : ${json.daily[i].humidity}%
        </div>
        </div>
        <div>
        <div class="lowerCase">
        Wind Speed : ${json.daily[i].wind_speed}m/s &nbsp;
        </div>
        <div>
        UV Index : ${json.daily[i].uvi}
        </div>
        </div>
        </div>
        </div>`;
        document.getElementById('weather-forecast-container').innerHTML += forecastItems;
      }

    } else {
      console.log(xhr.status + "getWeather");
    }
  };
  xhr.send();
};
function getCity(latitude, longitude) {
  let URL1 = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
  let city = new XMLHttpRequest();
  city.open('GET', `${URL1}`);
  city.onload = function() {
    if (city.status == 200) {
      let json1 = JSON.parse(this.responseText);
      let geoCity = json1[0].local_names.ascii;
      let geoCountry = json1[0].country;
      document.getElementById('city').innerHTML = `${geoCity}, &nbsp;`;
      document.getElementById('country').innerHTML = geoCountry;
    } else {
      console.log(city.status + "getCity");
    }
  }
  city.send();
};

function toggleExtra(index) {
  let extraInfo = `extraInfo${index}`
  let extraInfo$ = document.getElementById(`${extraInfo}`);
  if (extraInfo$.style.display === "none") {
    extraInfo$.style.display = "flex";
  } else {
    extraInfo$.style.display = "none";
  }
};


function getCoords() {
  document.getElementById('weather-forecast-container').innerHTML = '';
  page1.style.display = "block";
  page2.style.display = "none";
  let cityQuery = document.getElementById('cityQuery').value;
  let URL2 = `http://api.openweathermap.org/geo/1.0/direct?q=${cityQuery}&limit=1&appid=${apiKey}`;
  let latlog = new XMLHttpRequest();
  latlog.open('GET', `${URL2}`);
  latlog.onload = function() {
    if (latlog.status == 200) {
      let json2 = JSON.parse(this.responseText);
      let latitude = json2[0].lat;
      let longitude = json2[0].lon;
      getWeather(latitude, longitude);
    } else {
      console.log(latlog.status + "getCoords");
    }
  }
  latlog.send();
};

function kelvinToCelsius(tempK) {
  let celsiusTemp = tempK - 273.15;
  return `${celsiusTemp.toFixed(2)}&#176;C`;
};
