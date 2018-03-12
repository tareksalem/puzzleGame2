const passport = require("passport");
const LocalStrategy = require("passport-local");
const Admin = require("../models/admins");
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    Admin.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use("local.signUp", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function (req, email, password, done) {
    Admin.findOne({"email": email}, function (err, user) {
        return done(err, user);
    });
}));

passport.use("local.login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function (req, email, password, done) {
    Admin.findOne({"email": email}, function (err, user) {
        return done(err, user);
    });
}));