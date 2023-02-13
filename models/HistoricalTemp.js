var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var HistoricalTempSchema = new Schema ({
    datePosted:{
        type: Date,
        // default: Date.now()
    },
    temperatureHigh: {
        type: Number,
        required: true,
    },
    temperatureLow: {
        type: Number,
        required: true,
    }    
});
var HistoricalTemp = mongoose.model("HistoricalTemp", HistoricalTempSchema, "historicalTemp");

module.exports = HistoricalTemp;