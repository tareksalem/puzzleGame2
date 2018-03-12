const express = require("express");
const router = express.Router();
const Word = require("../models/words");
const Letters = require("../models/letters");
const passport = require("passport");
const Music = require("../models/music");
router.get("/", function (req, res) {
    if (req.xhr === true) {
        Word.findOne(function (err, words) {
            res.json(words);
        });
    } else {
        Letters.findOne(function (err, letters) {
            if (err) {
                return res.render("client/home", {title: "home page", user: req.user});
            } else {
                return res.render("client/home", {title: "home page", letters: letters, user: req.user});
            }
        });
    }
});
//router for getting the mp3 file
router.get("/mp3", function (req, res) {
    if (req.xhr === true) {
        Music.findOne(function (err, music) {
            if (music) {
                res.json(music);
            }
        })
    } else {
        res.redirect("/");
    }
});
router.get("/cpanel", isNotLoggedIn, function (req, res) {
    return res.redirect("/cpanel/login");
});

//router for login
router.get("/cpanel/login", isNotLoggedIn, function (req, res, next) {
    res.render("login", {title: "تسجيل الدخول", error: req.flash("error")});
});

//router for postin the login data
router.post("/cpanel/login", function (req, res, next) {
    if (req.body.email === "" || req.body.password === "") {
        req.flash("error", "يرجى ادخال كافة الحقول");
        console.log("fields");
        return res.redirect("/cpanel/login");
    } else {
        passport.authenticate("local.login", function (err, user) {
            if (err) {
                console.log(err);
                req.flash("error", "خطأ في كلمة المرور أو اسم المستخدم");
                return res.redirect("/cpanel/login");
            }
            if (user) {
                var validPass = user.validPassword(req.body.password);
                if (validPass) {
                    req.logIn(user, function (err) {
                        if (err) {
                            req.flash("error", "خطأ في كلمة المرور أو اسم المستخدم");
                            return res.redirect("/cpanel/login");
                        }
                        req.session.cookie.maxAge = 10*24*60*60*1000;
                        req.session.authenticated = true;
                        req.authenticated = true;
                    });
                    return res.redirect("/cpanel/admin");
                } else {
                    req.flash("error", "خطأ في كلمة المرور أو اسم المستخدم");
                    return res.redirect("/cpanel/login");
                }
            } else {
                console.log("no user");
                req.flash("error", "خطأ في كلمة المرور أو اسم المستخدم");
                return res.redirect("/cpanel/login");
            }
        })(req, res, next);
    }
});

//function to secure routes

function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect("/cpanel/admin");
    }
}
module.exports = router;