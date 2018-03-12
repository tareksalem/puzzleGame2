var mongoose = require("mongoose");
mongoose.connect("mongodb://tarek:tarek@ds255588.mlab.com:55588/puzzlegame");
var Schema = mongoose.Schema;

var musicSchema = new Schema({
    music: {type: String}
});
var Music = module.exports = mongoose.model("music", musicSchema, "music");