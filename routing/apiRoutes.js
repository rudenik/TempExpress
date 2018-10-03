var path = require("path");
var db = require("../models");
module.exports = function(app){
app.get("/getTemps", function(req, res){
    db.TempPoint.find({})
    .sort({datePosted: 'descending'})
    .then(function(results){
        res.json(results);
    })
    .catch(function(err){
        console.log(err);
        res.json(err);
    });
});

app.post("/postTemp", function(req, res){
    console.log("Temperature: ", req.body.Temperature);
    // console.log(req.body);
    db.TempPoint.create({"temperature":req.body.Temperature}).then(function(dbTempPoint){
        console.log(Date.now());
        res.json(dbTempPoint);
    });
});
}