var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var TempSchema = new Schema ({
    datePosted:{
        type: Date,
        default: Date.now()
    },
    temperature: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        require: false,
    }
    
});
var TempPoint = mongoose.model("TempPoint", TempSchema);

module.exports = TempPoint;