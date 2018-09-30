var express = require("express");
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var db = require("./models");
var PORT = 8080;
var app = express();


app.use(logger("combined"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
require("./routing/apiRoutes")(app);

var MONGODB_URI = "mongodb://localhost/tempExpress";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.listen(PORT,function(){
    console.log("Get yourself connected, the writings on port " + PORT);
})