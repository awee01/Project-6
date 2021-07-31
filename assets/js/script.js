var cityInputEl = document.querySelector("#search-city-input");
var FormEl = document.querySelector(".form-group");
var currentCityName = document.querySelector("#current-city-name");
var searchBtn = document.querySelector("#search-city-button");
var citieshistory = [];
var apiKey = "135fd6bfa610d560677626ceda102a58"

loadData();

//saving cities to local storage 
function saveCity() {
  var citysearchInput = $("#search-city-input").val().trim().toUpperCase();

  //prevents duplicates
  if (citieshistory.includes(citysearchInput)) {
  }
  //prevents recording blank input
  else if (citysearchInput == "") {

  } else {
    citieshistory.push(citysearchInput);
    $("#cities-list").append("<li>" + citysearchInput + "</li>");

    localStorage.setItem("citieshistorysavedstorage", JSON.stringify(citieshistory));

  }
}

// Load local storage when refreshing page

function loadData() {

  citieshistory = JSON.parse(localStorage.getItem("citieshistorysavedstorage"));

  for (i = 0; i < citieshistory.length; i++) {

    $("#cities-list").append("<li>" + (citieshistory[i]) + "</li>");

  }
}


//Clear Search History Function
$("#clear-history").click(function () {
  citieshistory = [];
  $("#cities-list").remove();
  localStorage.clear();
});


//on submitting the search city form
var formSubmitHandler = function (event) {
  event.preventDefault();
  var cityInput = cityInputEl.value.trim();
  getCoordinates(cityInput);

};

//fetch to get the coordinates of the city
var getCoordinates = function (city) {
  var coordinates = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(coordinates).then(function (response) {

    if (response.ok) {

      response.json().then(function (data) {
        var longitude = data.coord["lon"];
        var latitude = data.coord["lat"];
        getCityForecast(city, longitude, latitude);
        currentCityName.textContent = `${city} (${moment().format("M/D/YYYY")})`.toUpperCase();;
        saveCity();

      });

    }
  });
};

// uses coordinates of the city to fetch current weather and 5 day forecast details

var getCityForecast = function (city, longitude, latitude) {
  var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`;
  fetch(oneCallApi).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {

        currentForecast(data);
        fiveDayForecast(data);

      });
    }
  })
}

// current weather function
var currentForecast = function (forecast) {


  var weatherIcon = document.querySelector("#current-icon");
  var currentIcon = forecast.current.weather[0].icon;
  weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${currentIcon}.png`);
  


  var currenttemp = document.querySelector("#current-temp");
  currenttemp.textContent = "Temperature: " + forecast.current["temp"] + "°C";

  var currentwind = document.querySelector("#current-wind");
  currentwind.textContent = "Wind: " + forecast.current["wind_speed"] + " M/S (metres/second)";

  var currenthumidity = document.querySelector("#current-humidity");
  currenthumidity.textContent = "Humidity: " + forecast.current["humidity"] + " % ";

  var currentUV = document.querySelector("#current-UV");
  currentUV.textContent = forecast.current["uvi"];
  var UVcolor = forecast.current["uvi"];

  // UV Colors

  if (UVcolor < 2) {
    $("#current-UV").addClass("bg-success p-2 rounded text-light");
    $("#current-UV").removeClass("bg-warning bg-danger");
  }
  if (UVcolor >= 2 && UVcolor <= 5) {
    $("#current-UV").addClass("bg-warning p-2 rounded text-light");
    $("#current-UV").removeClass("bg-success bg-danger");
  }
  if (UVcolor >= 5) {
    $("#current-UV").addClass("bg-danger p-2 rounded text-light");
    $("#current-UV").removeClass("bg-success bg-warning");

  }

}

// Five day Forecast function
var fiveDayForecast = function (forecast) {

  for (var i = 1; i < 6; i++) {

  }
}

searchBtn.addEventListener("click", formSubmitHandler);
FormEl.addEventListener("submit", formSubmitHandler);
