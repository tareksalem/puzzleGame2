const mongoose = require("mongoose");
mongoose.connect("mongodb://tarek:tarek@ds255588.mlab.com:55588/puzzlegame");
const bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;
var adminSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
});
adminSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

adminSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

var Admin = module.exports = mongoose.model("admin", adminSchema, "admin");
