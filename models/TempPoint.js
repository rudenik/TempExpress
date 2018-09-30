var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TempSchema = new Schema ({
    temperature: {
        type: Float,
        required: true,
    }
});
var TempPoint = mongoose.model("TempPoint", TempSchema);

module.exports = TempPoint;