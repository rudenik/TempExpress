'use strict';

const HistoricalTemp = require('./models/HistoricalTemp');
const request = require('request')


const CheckTemp = function(){
    return{
        getLocalWeather: function(){
            const apiKey = process.env.OPENWEATHERKEY
            var options = {
                url: `https://api.openweathermap.org/data/2.5/weather?q=Toronto,CA&appid=${apiKey}&units=metric`, 
                method: "GET",
            }
            request(options, function(err, resp, body){
                if(err){
                    console.log(err)
                }else{
                    // console.log(JSON.stringify(JSON.parse(body), null, 2))
                    var report = JSON.parse(body)
                    console.log(`High: ${report.main.temp_max}, Low: ${report.main.temp_min}`)
                    var datePosted = Date.now();
                    HistoricalTemp.create({
                        datePosted: datePosted,
                        temperatureHigh: report.main.temp_max,
                        temperatureLow: report.main.temp_min
                    })
                    .catch(function(err){
                        console.log(err);
                    })

                }
            })

        }
    }
}
module.exports = CheckTemp();