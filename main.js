
// value taking 
const userTab= document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer= document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");

const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const error404=document.querySelector(".error404");
// initially variablee

let oldTab=userTab;//this is for checking current tab 
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");//this is for sendin backgroiund color in tab div using cuurenttab css
getfromSessionStorage();//this is forn showing current status or default value

//  ab switch krege function ke liyeshow that dusra tab visble ho

function switchTab(newTab){
    if(newTab!=oldTab){
        // ab  swictch functin clicking option have pss to checking curent status and changing or swaping between tabs 
        oldTab.classList.remove("current-tab");//remoing for old
        oldTab=newTab;//change old to new 
        oldTab.classList.add("current-tab");// adding css in new 

        if(!searchForm.classList.contains("active")){// search wle me chening becz your wla default h
                //now check it kyu ki visible  h ki nhi nhi h to making it visible 
                userInfoContainer.classList.remove("active");//userwla tab hatnma 
                grantAccessContainer.classList.remove("active");// or perfmission wla htna
                searchForm.classList.add("active");//active to staus of search tab function    
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now according to agar koi search krna th to us time sesrch bar hanta pdega or agar userinfo me koj pehle se vale mtlb h umse showing result to uski hatakr naya content 
            getfromSessionStorage();
        }

    }
}
// calling swiching for switch function

userTab.addEventListener("click",()=>{
    // pass kro value 
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    // pass kro value 
    switchTab(searchTab);
});

// ab  location puch rhe rhe thod samjhi iskon abhi 
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// ab coordinate mil gye toi uske sath api call kerne to rsultmho krnege 

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    // now making grnat function invisible 
    grantAccessContainer.classList.remove("active");
//     making loader t0 act
    loadingScreen.classList.add("active");

    // api call kr rha bhaiyuu

    try{
        const respons= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await respons.json();
        // ab data toi agya to uska use bjo krne h to v=window me dynamical value use krke show krege 
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);//using to edit the screen 
    }
    catch(er){
        // loading window show hogi and now hamko 404 wli img add krnin hogib view port me 
        loadingScreen.classList.remove("active");
        // containt be rewmon ke kste h

    }
}

function renderWeatherInfo(weatherInfo){
    // fetch value for html code to update ui of data  
  const cityName=document.querySelector("[data-cityName]");
  const countryIcon=document.querySelector("[data-countryIcon]");
  const dese=document.querySelector("[data-weatherDesc]");
  const weatherIcon=document.querySelector("[data-weatherIcon]");
  const temp=document.querySelector("[data-temp]");
  const windspeed=document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness=document.querySelector("[data-cloudiness]");

  console.log(weatherInfo);// koi jarut nhin h iski bs apne kiye kr rhe 

//now upading valu by fecting value form api

  cityName.innerText=weatherInfo?.name;
  countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;//using url for chnaging value og couuntry in deseare icon
 dese.innerText=weatherInfo?.weather?.[0]?.description;
 weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
 temp.innerText=`${weatherInfo?.main?.temp}°C`;
 humidity.innerText = `${weatherInfo?.main?.humidity}%`;
 cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
 windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        // kuch kr rha ps phor sochna  we can Aadd on more duv heare so that eerror sms can be show
    }
}

function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringfy(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getlocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")return;
    else fetchSearchWeatherInfo(cityName);
 
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
    //   bhaiyuu game yha pass hora to thod seasrch krne or samjhe 
    if(response.ok){
        const data =await response.json();
         // Your code to handle a successful response
         loadingScreen.classList.remove("active");
         error404.classList.remove("active");
         userInfoContainer.classList.add("active");
         renderWeatherInfo(data);

    }
    else{
         // Handle cases where the response is not OK (e.g., 404 or other success status codes)
            // You can check the status code or inspect the response data for more details
            const responseData = await response.json();
            console.error("API Error Response:", responseData);
        
            // Hide or remove UI elements
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            error404.classList.add("active");

        
    }
}
catch(err){
    console.error("An error occurred:", err);
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    error404.classList.add("active");

}
}


