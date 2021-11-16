var temps = [];
var dataLabels = [];
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


function drawChart() {
    var ctx = $("#myChart");

    var myChart = new Chart(ctx, {
        "type": "line",
        "data": {
            "labels": dataLabels,//.reverse(),
            //["January", "February", "March", "April", "May", "June", "July"], 
            "datasets": [{
                "label": "Baby Room Temperature",
                "data": temps,//.reverse(), 
                "fill": true, "borderColor": "rgb(75, 192, 192)", "lineTension": 0.1
            }]
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