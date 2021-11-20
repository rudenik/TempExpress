var temps = [];
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
            temps = [];
            dataLabels = [];
            for (var i = 0; i < res.length; i +=30) {
                temps.push(res[i].temperature);
            }
            //specify the interval for which data points get displayed. This one is for labels
            for (var i = 0; i < res.length; i += 30) {
                
                dataLabels.push(moment(res[i].datePosted).format("LT"))
            }
        })
    )
}
function getLast24Hours() {
    return (
        $.get("/getLast24Hours").then(function (res) {
            temps = [];
            dataLabels = [];
            for (var i = 0; i < res.length; i +=60) {
                temps.push(res[i].temperature);
            }
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

            temps = [];
            dataLabels = [];
            histLows = [];
            histHighs = [];

            for (var i = 0; i < res.tempResults.length; i +=60) {
            // for (var i = 0; i < res.tempResults.length; i ++) {
                temps.push(res.tempResults[i].temperature);
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
            }
            ,{
                "label": "Baby Room Temperature",
                "data": temps,//.reverse(), 
                "fill": true, "borderColor": "rgb(75, 192, 192)", "lineTension": 0.1
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