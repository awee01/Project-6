var cityInputEl = document.querySelector("#search-city-input");
var FormEl = document.querySelector(".form-group");
var citieshistory = [];



//on submitting the search city form
var formSubmitHandler = function (event) {
  event.preventDefault();
  var cityInput = cityInputEl.value.trim();
  getCoordinates(cityInput);
  
};

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
    $('#cities-list').append('<li>' + citysearchInput + '</li>');
  }
  localStorage.setItem("citieshistorysavedstorage", JSON.stringify(citieshistory));

}
 

function loadCities(){



  if(localStorage.getItem("citieshistorysavedstorage") !== null) {

  citieshistory = JSON.parse(localStorage.getItem("citieshistorysavedstorage"));
  }
  
  for (i = 0; i <citieshistory.length; i++) {

    $('#cities-list').append('<li>' + (citieshistory[i]) + '</li>');

  }
}


// Clear Search History Function
$("#clear-history").click(function () {
  localStorage.clear();
  $("#cities-list").remove();
});




//fetch to get the coordinates of the city
var getCoordinates = function (city) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=135fd6bfa610d560677626ceda102a58";

  fetch(apiUrl).then(function (response) {

    if (response.ok) {

      response.json().then(function (data) {
        var longitude = data.coord['lon'];
        var latitude = data.coord['lat'];
        console.log(longitude, latitude);

        saveCity();
        
      });



    }
  });
};

loadCities();


FormEl.addEventListener("submit", formSubmitHandler);
