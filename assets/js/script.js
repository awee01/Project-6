




// API  key
const apiKey = "135fd6bfa610d560677626ceda102a58";

// Declare array to keep history of cities
var citieshistory = [];

// pressing enter is the same as clicking the search button
$(document).on("keydown", e => {
    if (e.key == "Enter") {
        $("#search-city-button").click();
        event.preventDefault();
    }
});


// adding a new city to the form
$("#search-city-button").on("click", function () {

    var citysearchInput = $("#search-city-input").val().trim().toUpperCase();

    //prevents duplicates
    if (citieshistory.includes(citysearchInput)){
        
    }
    //prevents recording blank input
    else if (citysearchInput == "") {
    
    } else {

    citieshistory.push(citysearchInput);

    $('#cities-list').append('<li>' + citysearchInput + '</li>');
       
    }
      localStorage.setItem("citieshistorysavedstorage",JSON.stringify(citieshistory));

})


// Clear Search History Function
$("#clear-history").click(function() {
    localStorage.clear();
    citieshistory = [];
    $("#cities-list").remove();
    location.reload();
  });


// Load local storage when refreshing page

function loadData() {

var savedcityhistory = JSON.parse(localStorage.getItem("citieshistorysavedstorage"));

console.log(savedcityhistory)

for (i=0; i<savedcityhistory.length; i++) {

  $('#cities-list').append('<li>' + savedcityhistory[i] + '</li>');

}

}

loadData();









function fetchweatherAPI() {

  fetch("http://api.openweathermap.org/data/2.5/forecast?q=Toronto&units=metric&appid=135fd6bfa610d560677626ceda102a58")

  .then(response => response.json())


  .then(data => console.log(data));



}




















   