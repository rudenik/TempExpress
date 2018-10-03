var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var TempSchema = new Schema ({
    temperature: {
        type: Number,
        required: true,
    },
    datePosted:{
        type: Date,
        default: Date.now()
    }
});
var TempPoint = mongoose.model("TempPoint", TempSchema);

module.exports = TempPoint;