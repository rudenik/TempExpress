var path = require("path");
var db = require("../models");
module.exports = function(app){
app.get("/getTemps", function(req, res){
    db.TempPoint.find({})
    .sort({datePosted: -1})
    .then(function(results){
        res.json(results);
    })
    .catch(function(err){
        console.log(err);
        res.json(err);
    });
});

app.get("/getLatestTemps", function(req, res){
    db.TempPoint.find({})
    .sort({datePosted: -1})
    .limit(1)
    .then(function(results){
        res.json(results);
    })
    .catch(function(err){
        console.log(err);
        res.json(err);
    });
});
app.get("/getLastSixHours", function(req, res){
    db.TempPoint.find({
        "datePosted":
        {$gt:new Date(Date.now()- 6 * 60 * 60 * 1000)}
    })
    .sort({datePosted: -1})
    .then(function(results){
        res.json(results);
    })
    .catch(function(err){
        res.json(err);
    })
})

app.post("/postTemp", function(req, res){
    console.log("Temperature: ", req.body.Temperature);
    // console.log(req.body);
    db.TempPoint.create({"temperature":req.body.Temperature}).then(function(dbTempPoint){
        console.log(Date.now());
        res.json(dbTempPoint);
    });
});
}