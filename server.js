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
  res.render(__dirname + "/views/index");
});


app.get('/zipcode', function (req, res) {
  res.render(__dirname + "/views/zipcode");
});



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
    const response2 = await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely,hourly&appid=b0de12ed03277da2744c6b4d4a8e3c8f&units=imperial");
    daily = response2.data;
    console.log(daily);
    var description;

    // checks null alert values
    if(!daily.alerts){
      description = "Weather Description Not Available"
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
      date: new Date()
    })
  }


  getWeather(url);

});



function logData(data) {
  console.log(data);
}


app.listen(port, function (req, res) {
  console.log("bee boop, weather service initialized");
});