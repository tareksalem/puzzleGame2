const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const handlebars = require("express-handlebars");
const hbs = require("hbs");

const mongodb = require("mongodb");
const multer = require("multer");
const mongoose = require("mongoose");
mongoose.connect("mongodb://tarek:tarek@ds255588.mlab.com:55588/puzzlegame");
const port = process.env.PORT || 3000;
const app = express();
const index = require("./routes/index");
const admin = require("./routes/admin/admin");
require("./config/admin");
//view engine
app.engine("hbs", handlebars({defaultLayout: "layout", extname: ".hbs"}));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

//body parser setting
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//session
app.use(session({
    secret: "max",
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge: 10*24*60*60*1000}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
//use file upload package

//static folders setting
app.use(express.static(path.join(__dirname, "public")));
//flash messages setting
app.use(flash());


//medillwar function
app.use(function (req, res, next) {
    res.locals.message = require("express-messages")(req, res);
    next();
    
});
app.use("/", index);
app.use("/cpanel/admin", admin);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("not found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {title: "error"});
});


//listen for the port

app.listen(port);