const grantAccessContainer = document.querySelector('.grant-access');
const YourWeatherContainer = document.querySelector('.your-weather-content');
const loadingContainer = document.querySelector('.loading-page');
const searchWeatherContainer = document.querySelector('.search-weather-content');

// Functions for displaying and hiding pages
function makeGrantAccessContainerActive(){
    if(!grantAccessContainer.classList.contains('active')){
        grantAccessContainer.classList.add('active');
    }
    if(YourWeatherContainer.classList.contains('active')){
        YourWeatherContainer.classList.remove('active')
    }
    if(loadingContainer.classList.contains('active')){
        loadingContainer.classList.remove('active')
    }
    if(searchWeatherContainer.classList.contains('active')){
        searchWeatherContainer.classList.remove('active')
    }
}
function makeYourWeatherContainerActive(){
    if(grantAccessContainer.classList.contains('active')){
        grantAccessContainer.classList.remove('active');
    }
    if(!YourWeatherContainer.classList.contains('active')){
        YourWeatherContainer.classList.add('active')
    }
    if(loadingContainer.classList.contains('active')){
        loadingContainer.classList.remove('active')
    }
    if(searchWeatherContainer.classList.contains('active')){
        searchWeatherContainer.classList.remove('active')
    }
}
function makeLoadingContainerActive(){
    if(grantAccessContainer.classList.contains('active')){
        grantAccessContainer.classList.remove('active');
    }
    if(YourWeatherContainer.classList.contains('active')){
        YourWeatherContainer.classList.remove('active')
    }
    if(!loadingContainer.classList.contains('active')){
        loadingContainer.classList.add('active')
    }
    if(searchWeatherContainer.classList.contains('active')){
        searchWeatherContainer.classList.remove('active')
    }
}
function makeSearchWeatherContainerActive(){
    if(grantAccessContainer.classList.contains('active')){
        grantAccessContainer.classList.remove('active');
    }
    if(YourWeatherContainer.classList.contains('active')){
        YourWeatherContainer.classList.remove('active')
    }
    if(loadingContainer.classList.contains('active')){
        loadingContainer.classList.remove('active')
    }
    if(!searchWeatherContainer.classList.contains('active')){
        searchWeatherContainer.classList.add('active')
    }
}

makeLoadingContainerActive();
getfromSessionStorage();

// Fuction for accessing current location
async function getfromSessionStorage() {
    // console.log(sessionStorage);
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates) {
        //If local coordinates are not found
        makeGrantAccessContainerActive();
    }
    else {
        // If local coordinates are found
        const coordinates = await JSON.parse(localCoordinates);
        await fetchData(coordinates.lat, coordinates.long);
        makeYourWeatherContainerActive();
    }

}

// Function for calling OpenWeatherAPI to get weather data
const foundEle = document.querySelector('.found');
const notFoundEle = document.querySelector('.not-found');
async function fetchData(lat, long){
    const API_KEY = 'e2e6984bfc548d77d98f8b7516a3c4c2';
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`);
        const data = await response.json();
        
        // console.log(data);
        setData(data);
    
        if(!foundEle.classList.contains('display')){
            foundEle.classList.add('display')
        }
        if(notFoundEle.classList.contains('display')){
            notFoundEle.classList.remove('display')
        }
    }
    catch(e){
        if(foundEle.classList.contains('display'));{
            foundEle.classList.remove('display')
        }
        if(!notFoundEle.classList.contains('display')){
            notFoundEle.classList.add('display');
        }
    }
}

// Function for setting weather data in html Elements
function setData(data){
    // set city name
    const city = document.querySelector('.city');
    city.innerHTML = data?.name;
    
    // set country flag
    const country = document.querySelector('.country');
    country_code = data?.sys?.country;
    country.setAttribute('src', `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`);
    
    // set weather discription
    const desc = document.querySelector('.weather-desc');
    const icon = document.querySelector('.weather-icon');
    desc.innerHTML = data?.weather[0]?.description;
    icon.setAttribute('src', `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`);
    
    // set temperature
    const temp = document.querySelector('.temperature-value');
    let kelvinTemp = data?.main?.temp;
    temp.innerHTML = (kelvinTemp-273.15).toFixed(2);

    // set windspeed
    const ws = document.querySelector('.windspeed-value');
    ws.innerHTML = data?.wind?.speed;
    
    // set humidity
    const hum = document.querySelector('.humidity-value');
    hum.innerHTML = data?.main?.humidity;

    // set clouds
    const clouds = document.querySelector('.clouds-value');
    clouds.innerHTML = data?.clouds?.all;
}

// Function for accessing used location using Geolocation API
function askPermission(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getcoords, handleErr);
    }
    else{
        console.log('Geolocation not supperted');
    }
    
    async function getcoords(position){
        const userCoordinates = {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }
        
        // console.log(userCoordinates.lat, userCoordinates.long);
        sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
        
        makeLoadingContainerActive();
        await fetchData(userCoordinates.lat, userCoordinates.long);
        makeYourWeatherContainerActive();
    }
    
    function handleErr(err){
        alert(`Could not access location...${err.message}`);
    }
}

// Function for handling tabchanges between yourWeather and searchWeather
function tabChange(){
    makeLoadingContainerActive();

    const radioEle = document.querySelector('.menu input[type = radio]:checked');
    // console.log(radioEle);

    if(radioEle.id === 'search-weather'){
        makeSearchWeatherContainerActive();
    }
    else{
        makeLoadingContainerActive();
        getfromSessionStorage();
    }
}

// Fuction that is invoked upon input is given for cityName
function submitData(){
    const searchInput = document.getElementById('city-name');
    const cityName = searchInput.value;
    searchInput.value = '';
    const errMeassagePara = document.getElementById('err-message');
    
    if(cityName.trim() === ''){
        errMeassagePara.innerHTML = '*Enter valid city name';
    }
    else{
        errMeassagePara.innerHTML = '';
        fetchSearchData(cityName)
        // console.log(cityName);
    }
    
    return false;
}

// Function for fetching weather data of input city
async function fetchSearchData(cityName){
    
    if(!loadingContainer.classList.contains('active')){
        loadingContainer.classList.add('active')
    }
    if(YourWeatherContainer.classList.contains('active')){
        YourWeatherContainer.classList.remove('active')
    }

    const API_KEY = 'e2e6984bfc548d77d98f8b7516a3c4c2';
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        const data = await response.json();
        
        setData(data);
        if(!foundEle.classList.contains('display')){
            foundEle.classList.add('display')
        }
        if(notFoundEle.classList.contains('display')){
            notFoundEle.classList.remove('display')
        }
    }
    catch(e){
        // console.log(`Error Message: ${e.message}`);

        if(foundEle.classList.contains('display'));{
            foundEle.classList.remove('display')
        }
        if(!notFoundEle.classList.contains('display')){
            notFoundEle.classList.add('display');
        }
    }
    if(loadingContainer.classList.contains('active')){
        loadingContainer.classList.remove('active')
    }
    if(!YourWeatherContainer.classList.contains('active')){
        YourWeatherContainer.classList.add('active')
    }
}
