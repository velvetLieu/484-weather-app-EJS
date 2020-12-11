@ -14,6 +14,7 @@ const axios = require('axios');


let ejs = require('ejs');
const { response } = require('express');
app.set('view engine', 'ejs');

app.use(express.static("public"));
@ -25,9 +26,56 @@ app.get('/', function (req, res) {


app.get('/zipcode', function (req, res) {
  res.render(__dirname + "/views/zipcode");
  res.render(__dirname + "/views/index");
});

app.get('/city',function (req, res) {
  res.render(__dirname + "/views/index");
});

app.post('/city', function(req,res){
  var cityName = req.body.City;
  var url1 = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid=b0de12ed03277da2744c6b4d4a8e3c8f";


  const getCity = async function(url1){
    const response = await axios.get(url1);
    data = response.data;
    const response2 = await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely,hourly&appid=b0de12ed03277da2744c6b4d4a8e3c8f&units=imperial");
    daily = response2.data;
    const response3 = await axios.get("http://api.openweathermap.org/data/2.5/air_pollution?lat="+data.coord.lat+"&lon="+data.coord.lon+"&appid=b0de12ed03277da2744c6b4d4a8e3c8f");
    airQuality = response3.data;

    let today = daily.current;
    let fiveDay = daily.daily;
    let airQualityIndex = airQuality.list[0].main.aqi;
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
      Description: description,
      longitude: data.coord.lon,
      latitude: data.coord.lat,
      date: new Date(),
      airQualityIndex:airQualityIndex,
      Today: today,
      //Array
      Daily: fiveDay
    })

  }
  getCity(url1);
});


app.post('/zipcode', function (req, res) {
