var express = require("express");
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var db = require("./models");
const scout = require("@scout_apm/scout-apm");

const TemperatureCheck = require("./TemperatureCheck")


async function start() {
    // Trigger the download and installation of the core-agent
    await scout.install({
      allowShutdown: true, // allow shutting down spawned scout-agent processes from this program
      monitor: true, // enable monitoring
      name: "TempExpress",
      key: process.env.SCOUT_KEY,
    });
}
var PORT = process.env.PORT || 8080;
var app = express();
var path = require('path');
// process.env.TZ = 'UTC-4'
require('dotenv').config();

// app.use(logger("combined"));
app.use(logger("common"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use(express.static("public"));
app.use(scout.expressMiddleware());

require("./routing/apiRoutes")(app);
require("./routing/htmlRoute")(app);

// TemperatureCheck.getLocalWeather();
const scheduler = require("./scheduler")

var MONGODB_URI = process.env.MONGODB_URI

mongoose.Promise = Promise;
// mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useNewUrlParser', true );

const mongoOptions = {
    useNewUrlParser: true,
    family: 4,
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PW
}



mongoose.connect(MONGODB_URI, mongoOptions ).then(
    ()=>{
        app.listen(PORT,function(){
            start();
            console.log("Get yourself connected, the writings on port " + PORT);
            scheduler.start()
            
        })
    }
) ;
