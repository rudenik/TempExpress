var path = require("path");
const axios = require("axios");
var db = require("../models");
const moment = require("moment");
const Push = require('pushover-notifications');




var notifications = false;

function sendNotifcation(temp){
    const push = new Push({ 
        user: process.env['PUSHOVER_USER'],
        token: process.env['PUSHOVER_TOKEN']
    }) 
        var msg = {
            message: `The Temperature is ${temp}`,
            title: `Temperature is too high`, 
            sound: "tugboat",
            device: "Codec"
        }
        push.send(msg, function(err, pushResult){
        if (err){
            throw err;
        }
        console.log(pushResult);
})
}
module.exports = function(app){



app.get("/ip", function(req, res){
    axios.get("https://api.myip.com").then(function(resp){
        // console.log(resp);
        var myResp = {
            "Date":moment().format("LLL"),
            "ip":resp.data.ip
        }
        // console.log(myResp)
        res.send(myResp)
    })
})

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
    .sort({$natural: -1})
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
    .sort({datePosted: 1})
    .then(function(results){
        res.json(results);
    })
    .catch(function(err){
        res.json(err);
    })
})

app.get("/getLast24Hours", function(req, res){
    db.TempPoint.find({
        "datePosted":
        {$gt:new Date(Date.now()- 24 * 60 * 60 * 1000)}
    })
    .sort({datePosted: 1})
    .then(function(results){
        res.json(results);
    })
    .catch(function(err){
        res.json(err);
    })
})
app.get("/getLastFiveDays", function(req, res){
    db.TempPoint.find({
        "datePosted":
        {$gt:new Date(Date.now()- 5 * 24 * 60 * 60 * 1000)}
    })
    .sort({datePosted: 1})
    .then(function(TempResults){
        db.HistoricalTemp.find({
            "datePosted":
            {$gt:new Date(Date.now()- 5 * 24 * 60 * 60 * 1000)}
        })
        .sort({datePosted: 1})
        .then(function(HistResults){
            // console.log(HistResults[1])
            let results = {
                tempResults: TempResults,
                histResults: HistResults
            }
            res.json(results);
        })
        
    })
    .catch(function(err){
        res.json(err);
    })


    // var dateToSearch = new Date("2021-11-11T11:00:00.000Z")
    // var dateToSearch = moment().format('ll')
    // console.log(dateToSearch)
    // db.HistoricalTemp.find({})
    // // .limit(20)
    // // .sort({datePosted: 1})
    // .then(function(results){
    //     console.log(results)
    // })

})

app.post("/postTemp", function(req, res){
    console.log("Temperature: ", req.body.Temperature);
    // console.log(req.body);
    var thresholdTemp = 9.0

    db.TempPoint.create({"temperature":req.body.Temperature, "datePosted":Date.now()}).then(function(dbTempPoint){
        if(req.body.Temperature > thresholdTemp){
            //Determine interval for notification
            //new method for keeping track of notifications
            db.TempPoint.find().sort({"datePosted":-1}).then(results =>{
                if(results[1].temperature < req.body.Temperature){
                    //send that it's too high
                    timePastThreshold = moment();
                    if(notifications){
                        sendNotifcation(req.body.Temperature)
                    }
                }else if(results[1].temperature > req.body.Temperature){
                    //do nothing. 
                    var now = moment()
                    //if difference between now and timePastThrehold > 1 hour, send another notification 
                // }else if(results[1].temperature > req.body.Temperature){
                }
                })
            }
            //check to see if the temp threshold has changed
            
            //send notification if it has
            //set up pushover notification
            console.log(Date.now());
            res.json(dbTempPoint);

        })
        
    
});
}