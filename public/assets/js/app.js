var temps = [];
function getTemperature() {
    $.get("/getTemps").then(function (res) {
        console.log(res);
        console.log(res[0]);
        $("#cTemp").text(res[0].temperature)
        var lastReported = moment(res[0].datePosted).format("MMM Do YY, h:mm:ss a")
        //for(ele in res){
        //  temps.push(res[ele]);
        // }
        temps = res.map;
        console.log(temps);
        $("#lReported").text(lastReported)
    })
}
function drawChart() {
    var ctx = $("#myChart");
    // var myChart = new Chart(ctx, {
    //     type: 'line',
    //     data: [1,2,3,4],
    //     options: {}
    // });
    var myChart = new Chart(ctx, { 
        "type": "line",
        "data": { "labels": 
                    ["January", "February", "March", "April", "May", "June", "July"], 
        "datasets": [{ "label": "My First Dataset",
                     "data": [65, 59, 80, 81, 56, 55, 40], 
                    "fill": false, "borderColor": "rgb(75, 192, 192)", "lineTension": 0.1 }] }, 
        "options": {} });
}

getTemperature();
drawChart();