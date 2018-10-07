var temps = [];
var dataLabels = [];
function getLatestTemperature() {
   return( $.get("/getLatestTemps").then(function (res) {
        console.log(res);
        console.log(res[0]);
        $("#cTemp").text(res[0].temperature)
        var lastReported = moment(res[0].datePosted).format("MMM Do YY, h:mm:ss a")
        // console.log(temps);
        $("#lReported").text(lastReported)
        
    }))
}
function getLastSixHours(){
    return(
        $.get("/getLastSixHours").then(function(res){
        for(ele in res){
         temps.push(res[ele].temperature);
        }
        for(var i=0; i < res.length ; i+=60){
            dataLabels.push(moment(res[ele].dateCreated).format("LT"))
        }
        })
    )
}


function drawChart() {
    var ctx = $("#myChart");
    
    var myChart = new Chart(ctx, { 
        "type": "line",
        "data": { "labels": dataLabels,
                    //["January", "February", "March", "April", "May", "June", "July"], 
        "datasets": [{ "label": "Baby Room Temperature",
                     "data": temps, 
                    "fill": false, "borderColor": "rgb(75, 192, 192)", "lineTension": 0.1 }] }, 
        "options": {} });
}
getLatestTemperature();
getLastSixHours().then(function (){
    drawChart();
});
