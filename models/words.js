var mongoose = require("mongoose");
mongoose.connect("mongodb://tarek:tarek@ds255588.mlab.com:55588/puzzlegame");
var Schema = mongoose.Schema;

var wordSchema = new Schema({
    words: {type: Array, required: true}
});
var Word = module.exports = mongoose.model("word", wordSchema, "word");