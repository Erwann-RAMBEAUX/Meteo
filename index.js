const select = document.getElementById("city-select");
const ville_text = document.querySelector("body > main > div:nth-child(2) > div > div.text-block > h1");
const last_update = document.querySelector("#last-update-date")
const meteo_actuelle = document.querySelector("body > main > div:nth-child(2) > div > img")
const temperature_actuelle = document.querySelector("#current-temp")
const sunrise = document.querySelector("#current-sunrise")
const sunset = document.querySelector("#current-sunset")
const weather_hourly = document.querySelector("#hourly-weather")
const weather_daily = document.querySelector("#daily-weather")
const refresh_button = document.querySelector("#refresh")
const search = document.querySelector("#submit-manual-search")
const manual_search = document.querySelector("#manual-search")

const login_button  = document.querySelector("body > header > div > div > div.text-end > button")
const login_page = document.getElementById("login-modal")
const croix_login = document.querySelector("#login-modal > div > div > form > div.modal-header > button")
const close_login = document.querySelector("#login-modal > div > div > form > div.modal-footer > button.btn.btn-secondary")
function videOption(select) {
    select.children = []
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }
}
videOption(select)

function ajoutOption(select) {
    for (const element in LOCATIONS) {
        const option = document.createElement("option");
        option.value = element;
        option.innerText = LOCATIONS[element].city;
        select.appendChild(option);
    }
}
ajoutOption(select)

function videDiv(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function majHourlyWeather(json) {
    videDiv(weather_hourly);
    for (let j = 0; j < 24; j++) {
        const div = document.createElement("div");
        div.className = "hour-block";

        const span = document.createElement("span");
        span.className = "time";
        span.innerHTML = j+":00";
        div.appendChild(span);

        const small = document.createElement("small");
        small.className = "date";
        const date = json.hourly.time[j].split("-");
        small.innerHTML = date[2].split("T")[0] + "/" + date[1] + "/" + date[0];
        div.appendChild(small);

        const img = document.createElement("img");
        img.src = getImageFromWMOCode(json.hourly.weathercode[j]);
        img.alt = "Weather Icon";
        div.appendChild(img);

        const span2 = document.createElement("span");
        span2.innerHTML = "Temp: ";

        const span3 = document.createElement("span");
        span3.className = "hour-temp";
        span3.innerHTML = Math.round(json.hourly.temperature_2m[j])+"°C";
        span2.appendChild(span3);

        div.appendChild(span2);
        weather_hourly.appendChild(div);
    }    
}

function majDailyWeather(json) {
    videDiv(weather_daily);
    for (let j= 0 ; j < 7 ; j++){
        const div = document.createElement("div");
        div.className = "day-block";

        const span = document.createElement("span");
        span.className = "day";
        span.innerHTML = json.daily.time[j].split("-")[2].split("T")[0] + "/" + json.daily.time[j].split("-")[1] + "/" + json.daily.time[j].split("-")[0];
        div.appendChild(span);

        const img = document.createElement("img");
        img.src = getImageFromWMOCode(json.daily.weathercode[j]);
        img.alt = "Weather Icon";
        div.appendChild(img);

        const span2 = document.createElement("span");
        span2.innerHTML = "Min Temp: ";

        const span3 = document.createElement("span");
        span3.className = "day-value day-min";
        span3.innerHTML = Math.round(json.daily.temperature_2m_min[j])+"°C";
        span2.appendChild(span3);
        div.appendChild(span2);

        const span4 = document.createElement("span");
        span4.innerHTML = "Max Temp: ";

        const span5 = document.createElement("span");
        span5.className = "day-value day-max";
        span5.innerHTML = Math.round(json.daily.temperature_2m_max[j])+"°C";
        span4.appendChild(span5);
        div.appendChild(span4);

        const span6 = document.createElement("span");
        span6.innerHTML = "Sunrise: ";

        const span7 = document.createElement("span");
        span7.className = "day-value day-sunrise";
        span7.innerHTML = json.daily.sunrise[j].split("T")[1];
        span6.appendChild(span7);
        div.appendChild(span6);

        const span8 = document.createElement("span");
        span8.innerHTML = "Sunset: ";

        const span9 = document.createElement("span");
        span9.className = "day-value day-sunset";
        span9.innerHTML = json.daily.sunset[j].split("T")[1];
        span8.appendChild(span9);
        div.appendChild(span8);
        weather_daily.appendChild(div);
    }
}
function maj(json, ville){
    // Texte de la ville
    ville_text.innerText = ville
    // Date et heure
    let update = json.current_weather.time.split("-")
    last_update.innerText = update[2].split("T")[1] + " " + update[2].split("T")[0] + "/" + update[1] + "/" + update[0]
    // Image de la meteo
    meteo_actuelle.src = getImageFromWMOCode(json.current_weather.weathercode)
    // Temperature actuelle
    temperature_actuelle.innerText = Math.round(json.current_weather.temperature)+"°C"
    // Heure du lever du soleil
    sunrise.innerText = json.daily.sunrise[0].split("T")[1]
    // Heure du coucher du soleil
    sunset.innerText = json.daily.sunset[0].split("T")[1]

    //Affichage Hourly Weather
    majHourlyWeather(json)

    //Affichage Daily Weather
    majDailyWeather(json)
}


function ouverture(){
    const latitude = LOCATIONS[select.value].latitude
    const longitude = LOCATIONS[select.value].longitude
    const ville =  LOCATIONS[select.value].city
    fetch('https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&timezone=Europe%2FBerlin')
    .then ((rep) => rep.json())
    .then ((json) => {console.log(json)
        maj(json, ville)})
    .catch ((error) => console.log(error))
}

ouverture()


function appelApi(latitude, longitude, ville){
    fetch('https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&timezone=Europe%2FBerlin')
    .then ((rep) => rep.json())
    .then ((json) => maj(json, ville))
    .catch ((error) => console.log(error))
}

function appelApi2(ville){
    fetch("https://geocoding-api.open-meteo.com/v1/search?name="+ville+"&count=1&format=json")
    .then ((rep) => rep.json())
    .then((json) => {
        json = json.results[0]
        select.value = json.name
        appelApi(json.latitude, json.longitude, json.name)
    })
    .catch ((error) => console.log(error))
}

select.addEventListener("change", () => {
    if (select.value != "") {
        manual_search.value = "";
        const latitude = LOCATIONS[select.value].latitude
        const longitude = LOCATIONS[select.value].longitude
        const ville =  LOCATIONS[select.value].city
        appelApi(latitude, longitude, ville)
    }
})

refresh_button.addEventListener("click", ()=>{
    if (select.value != "") {
        const latitude = LOCATIONS[select.value].latitude
        const longitude = LOCATIONS[select.value].longitude
        const ville =  LOCATIONS[select.value].city
        appelApi(latitude, longitude, ville)
    }
    else if(manual_search.value != ""){
        appelApi2(manual_search.value) 
    }
})

search.addEventListener("click", function(event) {
    event.preventDefault();
    if (manual_search.value != ""){
        appelApi2(manual_search.value)
    }
})

login_button.addEventListener("click", () => {
    login_page.style.display = "block"
})

close_login.addEventListener("click", () => {
    login_page.style.display = "none"
})
croix_login.addEventListener("click", () => {
    login_page.style.display = "none"
})

document.addEventListener("click", function(event) {
    let out_form = document.querySelector('#login-modal');
    let targetElement = event.target; // Élément qui a été cliqué
    if (targetElement == out_form) {
      login_page.style.display = "none";
    }
  })





