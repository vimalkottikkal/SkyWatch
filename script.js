const searchButton = document.querySelector(".search_btn")
const cityInput = document.querySelector(".city_input")
const API_KEY = "6d250527c2045535a077ca81b153c18a";
const currentWeatherDiv = document.querySelector(".current_weather")
const weatherCardsDiv = document.querySelector(".weather_cards")


const createWeatherCard = (cityName, weatherItem, index) => {
    if(index===0){
        return `<div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humdidity: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>`;
    }else{
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humdidity: ${weatherItem.main.humidity}%</h4>
                </li>`;

    }   
}


const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`

    fetch(WEATHER_API).then(response => response.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast =>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate)
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) =>{
            if(index===0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
            }     
        });
        
    }).catch(()=>{
        alert("Error occured while fetching weather forecast")
    })
}

const getCityCoordinates = () =>{
    const cityName = cityInput.value.trim();
    if(cityName === "") return; 
    const GeoCoding_API = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
    
    fetch(GeoCoding_API).then(response => response.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
            const{lat, lon, name} = data[0];
        getWeatherDetails(name, lat, lon)
    }).catch(()=>{
        alert("Error occured while fetching coordinates")
    });
}
searchButton.addEventListener("click", getCityCoordinates);