// Express server to create a back-end to our web application
const express = require('express');
const app = express();
//Port configuration for Heroku
const port = process.env.PORT || 3000;
//NPM package bodyParser , to convert API call data into JSON object
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));

const axios = require('axios');



let ejs = require('ejs');
app.set('view engine', 'ejs');

app.use(express.static("public"));


app.get('/', function (req, res) {
  res.render(__dirname + "/views/index", {title: "484 Weather App"});
});


app.get('/zipcode', function (req, res) {
  res.render(__dirname + "/views/zipcode");	  res.render(__dirname + "/views/index");
});

app.get('/city',function (req, res) {
  res.render(__dirname + "/views/index");
});



//City backend
app.post('/city', function(req,res){
  var cityName = req.body.City;
  var url1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=b0de12ed03277da2744c6b4d4a8e3c8f";


  const getCity = async function(url1){
    const response = await axios.get(url1);
    data = response.data;
    const response2 = await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely&appid=b0de12ed03277da2744c6b4d4a8e3c8f&units=imperial");
    daily = response2.data;
    const response3 = await axios.get("http://api.openweathermap.org/data/2.5/air_pollution?lat="+data.coord.lat+"&lon="+data.coord.lon+"&appid=b0de12ed03277da2744c6b4d4a8e3c8f");
    airQuality = response3.data;

    let today = daily.current;
    let fiveDay = daily.daily;
    let airQualityIndex = airQuality.list[0].main.aqi;
    var description;



    var hourly = daily.hourly;

    // checks null alert values
    if(!daily.alerts){
      description = "No Alerts."
    }
    else{
      description = daily.alerts[0].description
    }


    res.render(__dirname + "/views/result", {
      City: data.name,
      Description: description,
      longitude: data.coord.lon,
      latitude: data.coord.lat,
      date: new Date(),
      airQualityIndex:airQualityIndex, 
      Today: today,
      //Array 
      Daily: fiveDay,
      Hourly: hourly
    })

  }
  getCity(url1);
});


//Zipcode backend

app.post('/zipcode', function (req, res) {

  var zipCode = req.body.zipcode;
  var data;
  var daily;

  // // appends 0's to the zipcodes that have leading 00, 
  // // 00501 is the smallest but valid zip code 

  while (zipCode.length < 5) {
    zipCode = "0" + zipCode;
  };

  var url = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",us&appid=b0de12ed03277da2744c6b4d4a8e3c8f"
  // makes two api calls, using async and await this 

  
  const getWeather = async function (url) {
   
    const response = await axios.get(url);
    data = response.data;
    const response2 = await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely&appid=b0de12ed03277da2744c6b4d4a8e3c8f&units=imperial");
    daily = response2.data;
    const response3 = await axios.get("http://api.openweathermap.org/data/2.5/air_pollution?lat="+data.coord.lat+"&lon="+data.coord.lon+"&appid=b0de12ed03277da2744c6b4d4a8e3c8f");
    airQuality = response3.data;

    var hourly = daily.hourly;

    let today = daily.current;
    let fiveDay = daily.daily;
    let airQualityIndex = airQuality.list[0].main.aqi;
    var description;
     
    
    // checks null alert values
    if(!daily.alerts){
      description = "No Alerts."
    }
    else{
      description = daily.alerts[0].description
    }


    res.render(__dirname + "/views/result", {
      City: data.name,
      Zipcode: zipCode,
      Description: description,
      longitude: data.coord.lon,
      latitude: data.coord.lat,
      date: new Date(),
      airQualityIndex:airQualityIndex, 
      Today: today,
      //Array 
      Daily: fiveDay,
      Hourly: hourly
      
    })
  }
  getWeather(url);
});

app.listen(port, function (req, res) {
  console.log("Server running on localhost:3000");
});