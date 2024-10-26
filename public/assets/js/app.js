// var tempsMR = [];
// var tempsLR = [];
var hpcTemps = [];
var dataLabels = [];
var histLows = [];
var histHighs = [];

function getLatestTemperature() {
    return ($.get("/getLatestTemps").then(function (res) {
        $("#cTemp").text(res[0].temperature)
        var lastReported = moment(res[0].datePosted).format("MMM Do YY, h:mm:ss a")
        $("#lReported").text(lastReported)
    }))
}

function getLastSixHours() {
    return (
        $.get("/getLastSixHours").then(function (res) {
            // tempsMR = [];
            // tempsLR = [];
            hpcTemps = [];
            dataLabels = [];
            for (var i = 0; i < res.length; i +=30) {
                if(res[i].location == "HPCloset"){
                    hpcTemps.push(res[i].temperature)
                }
                // if(res[i].location == "Marlowe's Room"){
                //     tempsMR.push(res[i].temperature)
                // } else if( res[i].location == "Living Room")
                // {
                //     tempsLR.push(res[i].temperature)
                // }
            }
            //specify the interval for which data points get displayed. This one is for labels
            for (var i = 0; i < res.length; i += 30) {
                
                dataLabels.push(moment(res[i].datePosted).format("LT"))
            }
        })
    )
}
function getLastHour() {
    return (
        $.get("/getLastHour").then(function (res) {
            // temps = [];
            // tempsMR = [];
            // tempsLR = [];
            hpcTemps = [];
            dataLabels = [];
            for (var i = 0; i < res.length; i +=30) {
                if(res[i].location == "HPCloset"){
                    hpcTemps.push(res[i].temperature)
                }
                // if(res[i].location == "Marlowe's Room"){
                //     tempsMR.push(res[i].temperature)
                // } else if( res[i].location == "Living Room")
                // {
                //     tempsLR.push(res[i].temperature)
                // }
            }
            // for (var i = 0; i < res.length; i ++) {
            //     temps.push(res[i].temperature);
            // }
            //specify the interval for which data points get displayed. This one is for labels
            for (var i = 0; i < res.length; i ++) {
                
                dataLabels.push(moment(res[i].datePosted).format("HH:mm"))
            }
        })
    )
}
function getLast24Hours() {
    return (
        $.get("/getLast24Hours").then(function (res) {
            // tempsMR = [];
            // tempsLR = [];
            hpcTemps = [];

            for (var i = 0; i < res.length; i +=30) {
                if(res[i].location == "HPCloset"){
                    hpcTemps.push(res[i].temperature)
                }
                // if(res[i].location == "Marlowe's Room"){
                //     tempsMR.push(res[i].temperature)
                // } else if( res[i].location == "Living Room")
                // {
                //     tempsLR.push(res[i].temperature)
                // }
            }
            // temps = [];
            // dataLabels = [];
            // for (var i = 0; i < res.length; i +=60) {
            //     temps.push(res[i].temperature);
            // }
            for (var i = 0; i < res.length; i +=60) {
                dataLabels.push(moment(res[i].datePosted).format("LT"))
            }
        })
    )
}

function getLastFiveDays() {
    return (
        $.get("/getLastFiveDays").then(function (res) {
            console.log(res.tempResults.length)

            // temps = [];
            // tempsMR = [];
            // tempsLR = [];
            hpcTemps = [];

            dataLabels = [];
            histLows = [];
            histHighs = [];

            // for (var i = 0; i < res.tempResults.length; i +=60) {
            // // for (var i = 0; i < res.tempResults.length; i ++) {
            //     temps.push(res.tempResults[i].temperature);
            // }
            for (var i = 0; i < res.length; i +=30) {
                if(res[i].location == "HPCloset"){
                    hpcTemps.push(res[i].temperature)
                }
                // if(res[i].location == "Marlowe's Room"){
                //     tempsMR.push(res[i].temperature)
                // } else if( res[i].location == "Living Room")
                // {
                //     tempsLR.push(res[i].temperature)
                // }
            }
            for (var i = 0; i < res.tempResults.length; i +=60) {
            // for (var i = 0; i < res.tempResults.length; i ++) {
                dataLabels.push(moment(res.tempResults[i].datePosted).format("llll"))
            }
            // console.log(res.histResults.length)
            // console.log(res.histResults[i])

            for (var i = 0; i < res.histResults.length; i++ ){
                // for(var j=0; j < 6; j++){
                    histLows.push(res.histResults[i].temperatureLow)
                // }
                
            }
            for (var i = 0; i < res.histResults.length; i++ ){
                // for(var j=0; j < 6; j++){
                histHighs.push(res.histResults[i].temperatureHigh)
                // }
            }



        })
        
    )
}


function drawChart() {
    var ctx = $("#myChart");

    var myChart = new Chart(ctx, {
        "type": "line",
        "data": {
            "labels": dataLabels,//.reverse(),
            //["January", "February", "March", "April", "May", "June", "July"], 
            "datasets": [
                
            {
                "label": "Previous temperature Lows",
                "data": histLows,//.reverse(), 
                "fill": false, "borderColor": "rgb(78, 127, 207)", "lineTension": 0.1
            },
            {
                "label": "Previous temperature Highs",
                "data": histHighs,//.reverse(), 
                "fill": false, "borderColor": "rgb(207, 81, 78)", "lineTension": 0.1
            },
            // ,{
            //     "label": "Living Room Temp",
            //     "data": tempsLR,//.reverse(), 
            //     "fill": true, "borderColor": "rgb(75, 192, 192)", "lineTension": 0.1
            // },
            // {
            //     "label": "Marlowe's Room Temp",
            //     "data": tempsMR,//.reverse(), 
            //     "fill": true, "borderColor": "RGB(192, 75, 75)", "lineTension": 0.1
            // }
            {
                "label":"Harry Potter Closet",
                "data":hpcTemps,
                "fill":true, "borderColor": "rgb(75, 192, 192)", "lineTension": 0.1
            }

        ]
        },
        "options": {}
    });
}
getLatestTemperature();

getLastSixHours().then(function () {
    drawChart();
});


$("#sixHours").on("click", function () {
    getLastSixHours().then(function () {
        drawChart();
    })
})
$("#lastHour").on("click", function () {
    getLastHour().then(function () {
        drawChart();
    })
})
$("#twentyFourHours").on("click", function () {
    getLast24Hours().then(function () {
        drawChart();
    })
})
$("#fiveDays").on("click", function () {
    getLastFiveDays().then(function () {
        drawChart();
    })
})
$("#refreshLatest").on("click", function(){
    getLatestTemperature();
})