var cityInputEl = document.querySelector("#search-city-input");
var FormEl = document.querySelector(".form-group");
var currentCityName = document.querySelector("#current-city-name");
var searchBtn = document.querySelector("#search-city-button");
var citieshistory = [];
var apiKey = "135fd6bfa610d560677626ceda102a58"



// a function gets value for input, then that value is used for input into another function and so on
// the path goes: submit a valid city -> getCityCoordinates - > getCityWeather - > get current and 5day weather data


//On submitting the search city form, record input and activate function to get the city coordinates 

var formSubmitHandler = function (event) {
  event.preventDefault();
  var cityInput = cityInputEl.value.trim();
  getCityCoordinates(cityInput);

};

//Fetch API to get the coordinates of the city. Only valid cities accepted and put into save function
var getCityCoordinates = function (city) {
  var coordinates = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(coordinates).then(function (response) {

    if (response.ok) {

      response.json().then(function (data) {
        
        var longitude = data.coord.lon;
        var latitude = data.coord.lat;

        // activates getting city weather function with given coordinates
        getCityWeather(city, longitude, latitude);

        // names city on current weather forecast
        currentCityName.textContent = `${city} (${moment().format("M/D/YYYY")})`.toUpperCase();;

        //save function is only activated if city exists and coordinates are given
        saveCity();

      });
    }
  });
};


//Save function to the city history list and local storage
function saveCity() {
  var citysearchInput = $("#search-city-input").val().trim().toUpperCase();

  //prevents duplicates
  if (citieshistory.includes(citysearchInput)) {
  }
  //prevents recording blank input
  else if (citysearchInput == "") {

  } else {

    //appends button to list for later navigation
    citieshistory.push(citysearchInput);
    $("#cities-list").append(`<button onclick='getHistoricalCity("${citysearchInput}")'>` + citysearchInput + "</button>");

    localStorage.setItem("citieshistorysavedstorage", JSON.stringify(citieshistory));

  }
}

// Load local storage when refreshing page, restores previous city history list

function loadData() {

  

  // avoids null error
  if(localStorage.getItem("citieshistorysavedstorage") !== null) {
    citieshistory = JSON.parse(localStorage.getItem("citieshistorysavedstorage"));
  }

  for (i = 0; i < citieshistory.length; i++) {

    $("#cities-list").append(`<button onclick='getHistoricalCity("${citieshistory[i]}")'>` + (citieshistory[i]) + "</button>");

  }
}

//Clear Search History Function
$("#clear-history").click(function () {
  citieshistory = [];
  $("#cities-list").remove();
  localStorage.clear();
  location.reload();
});


// Uses coordinates of the city to fetch current weather and 5 day forecast details
var getCityWeather = function (city, longitude, latitude) {
  var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`;
  fetch(oneCallApi).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {

        console.log(data);
        currentForecast(data);
        fiveDayForecast(data);

      });
    }
  })
}

// Current Weather function
var currentForecast = function (forecast) {


  var weatherIcon = document.querySelector("#current-icon");
  var currentIcon = forecast.current.weather[0].icon;
  weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${currentIcon}.png`);

  var currentTemp = document.querySelector("#current-temp");
  currentTemp.textContent = forecast.current.temp + "°C";

  var currentwind = document.querySelector("#current-wind");
  currentwind.textContent = forecast.current.wind_speed + " M/S (metres/second)";

  var currenthumidity = document.querySelector("#current-humidity");
  currenthumidity.textContent = forecast.current.humidity + " % ";

  var currentUV = document.querySelector("#current-UV");
  currentUV.textContent = forecast.current.uvi;
  var UVcolor = forecast.current.uvi;

  // UV Colors index

  if (UVcolor < 2) {
    $("#current-UV").addClass("bglow p-2 rounded");
    $("#current-UV").removeClass("bgmoderate bghigh bgveryhigh bgextreme");
  }
  if (UVcolor >= 2 && UVcolor < 5) {
    $("#current-UV").addClass("bgmoderate p-2 rounded");
    $("#current-UV").removeClass("bgmlow bghigh bgveryhigh bgextreme");

  }
  if (UVcolor >= 5 && UVcolor < 8) {
    $("#current-UV").addClass("bghigh p-2 rounded");
    $("#current-UV").removeClass("bgmoderate bglow bgveryhigh bgextreme");
  }

  if (UVcolor >= 8 && UVcolor < 10) {
    $("#current-UV").addClass("bgveryhigh p-2 rounded");
    $("#current-UV").removeClass("bgmoderate bghigh bglow bgextreme");
  }
  if (UVcolor >=10) {
    $("#current-UV").addClass("bgextreme p-2 rounded");
    $("#current-UV").removeClass("bgmoderate bghigh bgveryhigh bglow");

  }
}


// Five Day Forecast function
var fiveDayForecast = function (forecast) {

  for (var i = 1; i < 6; i++) {

        var forecastdates = document.querySelector("#d-" + i);
        forecastdates.textContent = moment().add(i, "days").format("M/D/YYYY");

        var forecastIcon = document.querySelector('#p-' + i);
        var forecastIconCode = forecast.daily[i].weather[0].icon;
        forecastIcon.setAttribute('src', `http://openweathermap.org/img/wn/${forecastIconCode}.png`);
        forecastIcon.setAttribute('alt', forecast.daily[i].weather[0].main);

        var forecastTemp = document.querySelector("#t-" + i);
        forecastTemp.textContent = forecast.daily[i].temp.day + "°C";

        var forecastWind = document.querySelector("#w-" + i);
        forecastWind.textContent = forecast.daily[i].wind_speed + " M/S";

        var forecasthumidity = document.querySelector("#h-" + i);
        forecasthumidity.textContent = forecast.daily[i].humidity + " % ";
  
  }
}

//makes it so clicking the search button or pressing enter submits the forms

searchBtn.addEventListener("click", formSubmitHandler);
FormEl.addEventListener("submit", formSubmitHandler);




//past cities buttons on click function
var getHistoricalCity = function (city) {
    
  getCityCoordinates(city)
}


 

//loads data on page refresh
loadData();