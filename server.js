var express = require("express");
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var db = require("./models");

var PORT = 8080;
var app = express();
var path = require('path');
// process.env.TZ = 'UTC-4'
require('dotenv').config();

// app.use(logger("combined"));
app.use(logger("common"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static("public"));

require("./routing/apiRoutes")(app);
require("./routing/htmlRoute")(app);


var MONGODB_URI = "mongodb://localhost/tempExpress";
mongoose.Promise = Promise;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(
    ()=>{
        app.listen(PORT,function(){
            console.log("Get yourself connected, the writings on port " + PORT);
        })
    }
) ;

