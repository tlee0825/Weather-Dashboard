const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const history = document.getElementById("history");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const UVIndex = document.getElementById("UV-index");
const currentPicEl = document.getElementById("current-pic");
const searchBtn = document.getElementById("search-button");
const clearBtn = document.getElementById("clear-history");

let city = $("#city-input").val();
const APIKey = "&appid=65c10c5579f42681f3f589f30c251f3f"

let searchHistory = JSON.parse(localStorage.getItem("search")) || [];


let date = new Date();
    console.log(date);

$("#search-button").on("click", function () {
    let city = $("#city-input").val();
    const APIKey = "&appid=65c10c5579f42681f3f589f30c251f3f"
    const queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + APIKey;
    console.log(city);

    $('#forecast-section').removeClass('hide');
    $('#forecast-section').addClass('show');

    searchHistory.push(city);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        renderSearchHistory();

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {

        console.log(response)
        let tempF = (response.main.temp - 273.15) * 1.80 + 32;

        getCurrentConditions(response);
        getCurrentForecast(response);

    })
});


function makeList() {
    let listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
}

function getCurrentConditions(response) {
    const currentDate = new Date(response.dt * 1000);
    console.log(currentDate);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    cityName.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";

    let tempF = (response.main.temp - 273.15) * 1.80 + 32;
    tempF = Math.floor(tempF);
    temperature.innerHTML = "Temp: " + tempF

    humidity.innerHTML = "Humidity: " + response.main.humidity + "%";

    windSpeed.innerHTML = "Wind Speed: " + response.wind.speed + " mph";

    let weatherPic = response.weather[0].icon;
    currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
    currentPicEl.setAttribute("alt", response.weather[0].description);
}


function getCurrentForecast(response) {
    let city = $("#city-input").val();
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + APIKey,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        const forecastEls = document.querySelectorAll(".forecast");


        for (i = 0; i < forecastEls.length; i++) {
            forecastEls[i].innerHTML = "";
            const forecastIndex = i*8 + 4;
            const forecastDate = new Date(response.list[forecastIndex].dt * 1000);
            let forecastDay = forecastDate.getDate();
            const forecastMonth = forecastDate.getMonth() + 1;
            const forecastYear = forecastDate.getFullYear();
            const forecastDateEl = document.createElement("p");

            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
            forecastEls[i].append(forecastDateEl);

            const forecastWeatherEl = document.createElement("img");

            forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.list[forecastIndex].weather[0].icon + "@2x.png");
            forecastWeatherEl.setAttribute("alt", response.list[forecastIndex].weather[0].description);
            forecastEls[i].append(forecastWeatherEl);

            const forecastTempEl = document.createElement("p");

            forecastTempEl.innerHTML = "Temp: " + k2f(response.list[forecastIndex].main.temp) + " &#176F";
            forecastEls[i].append(forecastTempEl);

            const forecastHumidityEl = document.createElement("p");

            forecastHumidityEl.innerHTML = "Humidity: " + response.list[forecastIndex].main.humidity + "%";
            forecastEls[i].append(forecastHumidityEl);

            const windWeatherEl = document.createElement("p");

            windWeatherEl.innerHTML = "Wind: " + (response.list[0].wind.speed) + " mph";
            forecastEls[i].append(windWeatherEl);
        }
    })
};

function renderSearchHistory() {
    history.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function () {
            getCurrentForecast(historyItem.value);
        })
        history.append(historyItem);
    }
}

renderSearchHistory();
    if (searchHistory.length > 0) {
        getCurrentForecast(searchHistory[searchHistory.length ]);
    }

function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

clearBtn.addEventListener("click",function() {
    searchHistory = [];
    renderSearchHistory();
})