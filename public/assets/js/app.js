// var tempsMR = [];
// import { Chart } from "chart.js";
// const { Chart } =  import('chart.js/dist/chart.js');
var tempsLR = [];
var hpcTemps = [];
var dataLabels = [];
var histLows = [];
var histHighs = [];


getLatestTemperature();

getTemperatures().then(function () {
    drawChart();
});

function getTemperatures(){

    let activeLocations = $("#location").children(".active");
    let location = activeLocations.length > 1 || activeLocations.length == 0  ? "all" : activeLocations.attr('id');
    console.log(location);
    let timeFrame = $("#timeFrame").children('.active').attr('id');
    console.log(timeFrame)
    if (!timeFrame) { timeFrame = "sixHours"};
    
    return ($.get({
        url:"/getTemps", 
        data:{
            location: location,
            duration: timeFrame
        }
        
    }).then((res)=>{
        console.log(res);
        // tempsMR = [];
        tempsLR = [];
        hpcTemps = [];
        dataLabels = [];
            // for (var i = 0; i < res.length; i +=30) {
            for (var i = 0; i < res.length; i ++) {
                if(res[i].location == "HPCloset"){
                    hpcTemps.push(res[i].temperature)
                }else if(res[i].location == "Living Room"){
                    tempsLR.push(res[i].temperature)
                }
            }
            //specify the interval for which data points get displayed. This one is for labels
            for (var i = 0; i < res.length; i += 30) {
            // for (var i = 0; i < res.length; i ++) {
                dataLabels.push(moment(res[i].datePosted).format("LT"))
            }
            // console.log(dataLabels.length);
            // console.log(hpcTemps.length);

    }))
}

function getLatestTemperature() {
    return ($.get("/getLatestTemps").then(function (res) {
        $("#cTemp").text(res[0].temperature)
        var lastReported = moment(res[0].datePosted).format("MMM Do YY, h:mm:ss a")
        $("#lReported").text(lastReported)
        $("#reportedLocation").text(res[0].location)
    }))
}

function getLastSixHours(location) {
    return (
        $.get("/getLastSixHours", {
            params: location
        }).then(function (res) {
            // tempsMR = [];
            tempsLR = [];
            hpcTemps = [];
            dataLabels = [];
            for (var i = 0; i < res.length; i +=30) {
                if(res[i].location == "HPCloset"){
                    hpcTemps.push(res[i].temperature)
                }else if(res[i].location == "Living Room"){
                    tempsLR.push(res[i].temperature)
                }
            }
            //specify the interval for which data points get displayed. This one is for labels
            for (var i = 0; i < res.length; i += 30) {
                
                dataLabels.push(moment(res[i].datePosted).format("LT"))
            }
        })
    )
}


function drawChart() {
    const ctx = document.getElementById('myChart');
    let data = {
        labels: dataLabels,
        datasets: [
            {
                "label": "Living Room Temp",
                "data": tempsLR,//.reverse(), 
                "fill": true, "borderColor": "rgb(192, 75, 75)", "lineTension": 0.1
            },
            {
                "label":"Harry Potter Closet",
                "data":hpcTemps,
                "fill":true, "borderColor": "rgb(75, 192, 192)", "lineTension": 0.1
            }
        ]
    }

    let myChart = new Chart(ctx, {
        type: 'line',
        data: data, 
    })

}

// $("#getTemps").on("click", ()=>{
//     console.log("get Temps")
//     getTemperatures().then(()=>{
//         drawChart();
//     })
// })


$("#sixHours").on("click", function () {
    $("#timeFrame").find(".active").removeClass("active")
    $("#sixHours").hasClass("active") ? $("#sixHours").removeClass("active") : $("#sixHours").addClass("active");
    getTemperatures().then(()=>{
        drawChart();
    });
})
$("#lastHour").on("click", function () {
    $("#timeFrame").find(".active").removeClass("active")
    $("#lastHour").hasClass("active") ? $("#lastHour").removeClass("active") : $("#lastHour").addClass("active");
    getTemperatures().then(()=>{
        drawChart();
    });
})
$("#twentyFourHours").on("click", function () {
    $("#timeFrame").find(".active").removeClass("active")
    $("#twentyFourHours").hasClass("active") ? $("#twentyFourHours").removeClass("active") : $("#twentyFourHours").addClass("active");
    getTemperatures().then(()=>{
        drawChart();
    });
})
$("#fiveDays").on("click", function () {
    $("#timeFrame").find(".active").removeClass("active")
    $("#fiveDays").hasClass("active") ? $("#fiveDays").removeClass("active") : $("#fiveDays").addClass("active");
    getTemperatures().then(()=>{
        drawChart();
    });
})
$("#refreshLatest").on("click", function(){
    getLatestTemperature();
})
$("#LRoom").on("click", ()=>{
    $("#LRoom").hasClass("active") ? $("#LRoom").removeClass("active"):$("#LRoom").addClass("active");
})
$("#MRoom").on("click", ()=>{
    $("#MRoom").hasClass("active") ? $("#MRoom").removeClass("active"):$("#MRoom").addClass("active");
})
$("#reset").on("click", ()=>{
    $("#location").find(".active").removeClass("active");
})