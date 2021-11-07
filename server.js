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

//this will make api calls using promises
const axios = require('axios');


// installs and requires EJS, and sets the engine to use EJS engines
let ejs = require('ejs');
app.set('view engine', 'ejs');


//instructs server to send static files to browser such as our styles sheet
app.use(express.static("public"));

//landing page
app.get('/', function (req, res) {
  res.render(__dirname + "/views/index", {
    title: "484 Weather App"
  });
});

// once forms post, it will redirect to home page
app.get('/zipcode', function (req, res) {
  res.render(__dirname + "/views/index");
});

// once forms post, it will redirect to home page
app.get('/city', function (req, res) {
  res.render(__dirname + "/views/index");
});

//Backend Start


//City backend
app.post('/city', function(req,res){
  var cityName = req.body.City;
  var url1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=b0de12ed03277da2744c6b4d4a8e3c8f";



  // makes three api calls
  const getCity = async function (url1) {
    //based on city name make an api call to get long and lat
    const response = await axios.get(url1);
    data = response.data;
    //weather data
    const response2 = await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely&appid=b0de12ed03277da2744c6b4d4a8e3c8f&units=imperial");
    daily = response2.data;
    // air quality
    const response3 = await axios.get("http://api.openweathermap.org/data/2.5/air_pollution?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=b0de12ed03277da2744c6b4d4a8e3c8f");
    airQuality = response3.data;

    //begins parsing data prepares for rendering
    let today = daily.current;
    let fiveDay = daily.daily;
    let airQualityIndex = airQuality.list[0].main.aqi;
    var description;



    var hourly = daily.hourly;
    let offset = daily.timezone_offset;
    // checks null alert values
    if(!daily.alerts){
      description = "No Alerts ."
    }
    else{

      description = daily.alerts[0].description
    }

    //renders this code to the main page
    res.render(__dirname + "/views/result", {
      City: data.name,
      Zipcode: null,
      Description: description,
      longitude: data.coord.lon,
      latitude: data.coord.lat,
      date: new Date(),
      airQualityIndex: airQualityIndex,
      Today: today,
      Offset: offset,
      //Array 
      Daily: fiveDay,
      Hourly: hourly
    })

  }

  //calls function
  getCity(url1);
});


//Zipcode backend

app.post('/zipcode', function (req, res) {
  //holds pass through data
  var zipCode = req.body.zipcode;
  var data;
  var daily;

  // // appends 0's to the zipcodes that have leading 00, 
  // // 00501 is the smallest but valid zip code 

  while (zipCode.length < 5) {
    zipCode = "0" + zipCode;
  };

  var url = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",us&appid=b0de12ed03277da2744c6b4d4a8e3c8f"
  // makes three api calls, using async and await this 


  const getWeather = async function (url) {

    const response = await axios.get(url);
    // this data will have the longitude and lattitude to make the next calls that get the data
    data = response.data;
    const response2 = await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely&appid=b0de12ed03277da2744c6b4d4a8e3c8f&units=imperial");
    // this api call will get the weather data
    daily = response2.data;
    const response3 = await axios.get("http://api.openweathermap.org/data/2.5/air_pollution?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=b0de12ed03277da2744c6b4d4a8e3c8f");
    // this api call will get the air quality
    airQuality = response3.data;

    //begins parsing data prepares for rendering
    var hourly = daily.hourly;
    let today = daily.current;
    let offset = daily.timezone_offset;
    let fiveDay = daily.daily;
    let airQualityIndex = airQuality.list[0].main.aqi;
    var description;
    
    // checks null alert values
    if(!daily.alerts){
      description = "No Alerts."
    } else {
      description = daily.alerts[0].description
    }

    //renders this file to the results page
    res.render(__dirname + "/views/result", {
      City: data.name,
      Zipcode: zipCode,
      Description: description,
      longitude: data.coord.lon,
      latitude: data.coord.lat,
      date: new Date(),
      airQualityIndex: airQualityIndex,
      Today: today,
      Offset: offset,
      //Array 
      Daily: fiveDay,
      Hourly: hourly

    })
  }
  getWeather(url);
});

// on start up I instruct the app to listen on localhost:3000 or if hosted online the process.env.port b0de12ed03277da2744c6b4d4a8e3c8f"
app.listen(port, function (req, res) {
  console.log("Server running on localhost:3000");
});

