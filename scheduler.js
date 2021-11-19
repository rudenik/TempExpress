const CronJob = require('cron').CronJob;
const temperatureCheck = require("./TemperatureCheck")

module.exports = {
    start: function(){
        new CronJob("0 */6 * * *", function(){          console.log("Running Weather Cron")
            temperatureCheck.getLocalWeather();
        }, null, true, '');
    }
}
