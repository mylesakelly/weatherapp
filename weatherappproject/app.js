const express = require("express"); //requiring the express node module
const app = express();
const bodyParser = require("body-parser"); // requiring the body-parser node module to parse our data
const https = require("https"); // requiring the https module
const axios = require('axios'); // requiring the axios module



// middleware to parse the data from the url
app.use(bodyParser.urlencoded({ extended: true }));

// the get method is used to send the html file to the browser when a request is made on the user end
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/page.html");
});


// post method is used to send response with data from apis to the user when a request is made. When the client enters a zip code they will get a response with the temperature.
app.post("/", function (req, res) {
  const cityName = req.body.cityName;
// using axios to make an api call to the geolocation api
  axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${cityName}&appid=69ec69c43a501e7017719e386e5e85e6`)
    .then(response => {
      // Extract the required data from the response
    // storing the response from the api in variables for longitude and latitude
      const latitude = response.data.lat;
      const longitude = response.data.lon;
// the longitude and latitude variables are then stored in the second api url that will give us the weather
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=69ec69c43a501e7017719e386e5e85e6&units=imperial`;
 
//  get method used to grab the data from the second api with the weather
  https.get(url, function (weatherResponse) {

    weatherResponse.on("data", function (data) {
        //storing the data from the api 
      const jsondata = JSON.parse(data);
      const temp = jsondata.main.temp;
      const des = jsondata.weather[0].description;
      const icon = jsondata.weather[0].icon;
    //   image representing the current weather
      const imageurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    //   write method is used to place html elements on the page that grab the variables cityName, temp, and description
      res.write(`<h1>The temp in ${cityName} is ${temp} degrees</h1>`);
      res.write(`<p>The weather description is ${des} </p>`);
    //   write method is used to place the image of the weather on the page
      res.write("<img src=" + imageurl + ">");
    //   response sent to client side
      res.send();
    });
  });
})
// catch any errors that may have occurred
.catch(error => {
    console.error('Error:', error);
    res.status(500).send('Error occurred');
  });
});
// server is running on port localhost:2000
app.listen(2000);
console.log(`server is connected`);
