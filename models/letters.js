var mongoose = require("mongoose");
mongoose.connect("mongodb://tarek:tarek@ds255588.mlab.com:55588/puzzlegame");
var Schema = mongoose.Schema;

var newLetters = new Schema({
    letters: {type: Array, required: true}
    // letter1: {type: String, required: true},
    // letter2: {type: String, required: true},
    // letter3: {type: String, required: true},
    // letter4: {type: String, required: true},
    // letter5: {type: String, required: true},
    // letter6: {type: String, required: true},
    // letter7: {type: String, required: true},
    // letter8: {type: String, required: true},
    // letter9: {type: String, required: true},
    // letter10: {type: String, required: true},
    // letter11: {type: String, required: true},
    // letter12: {type: String, required: true},
    // letter13: {type: String, required: true},
    // letter14: {type: String, required: true},
    // letter15: {type: String, required: true},
    // letter16: {type: String, required: true},
    // letter17: {type: String, required: true},
    // letter18: {type: String, required: true},
    // letter19: {type: String, required: true},
    // letter20: {type: String, required: true},
    // letter21: {type: String, required: true},
    // letter22: {type: String, required: true},
    // letter23: {type: String, required: true},
    // letter24: {type: String, required: true},
    // letter25: {type: String, required: true},
    // letter26: {type: String, required: true},
    // letter27: {type: String, required: true},
    // letter28: {type: String, required: true}
});

var Letters = module.exports = mongoose.model("letters", newLetters, "letters");