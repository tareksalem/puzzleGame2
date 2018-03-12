const express = require("express");
const Word = require("../../models/words");
const router = express.Router();
const Letters = require("../../models/letters");
const passport = require("passport");
const Admin = require("../../models/admins");
const multer = require("multer");
const path = require("path");
const Music = require("../../models/music");
router.use("/", isLoggedIn, function (req, res, next) {
    next();
});
router.get("/", function (req, res) {
    Letters.findOne(function (err, letters) {
        if (err) {
            Word.findOne(function (err, words) {
                if (err) {
                    res.render("admin/dashboard", {
                        layout: "admin.hbs",
                        title: "لوحة التحكم",
                        error: req.flash("error"),
                        success: req.flash("success"),
                        user: req.user
                    });
                } else {
                    res.render("admin/dashboard", {
                        layout: "admin.hbs",
                        title: "لوحة التحكم",
                        error: req.flash("error"),
                        success: req.flash("success"),
                        words: words,
                        user: req.user
                    });
                }
            });
        } else {
            Word.findOne(function (err, words) {
                if (err) {
                    res.render("admin/dashboard", {
                        layout: "admin.hbs",
                        title: "لوحة التحكم",
                        error: req.flash("error"),
                        success: req.flash("success"),
                        letters: letters,
                        user: req.user
                    });
                } else {
                    res.render("admin/dashboard", {
                        layout: "admin.hbs",
                        title: "لوحة التحكم",
                        error: req.flash("error"),
                        success: req.flash("success"),
                        words: words,
                        letters: letters,
                        user: req.user
                    });
                }
            });
        }

    });
});
//router for posting data

router.post("/editletters", function (req, res) {
    // check if the letter inputs submited
    if (req.body.letters) {
        Letters.find(function (err, letter) {
            if (letter.length === 1) {
                letter[0].letters = req.body.letters;
                letter[0].save(function (err) {
                    if (err) {

                        req.flash("error", "لم يتم الحفظ، حدث خطأ ما");
                        return res.redirect("/cpanel/admin");
                    } else {
                        req.flash("success", "تم حفظ التعديلات بنجاح");
                        return res.redirect("/cpanel/admin");
                    }
                });

            } else {
                var newLetters = new Letters();
                for (var i = 0; i < req.body.letters.length; i++) {
                    newLetters.letters.push(req.body.letters[i]);
                }

                newLetters.save(function (err) {
                    if (err) {
                        req.flash("error", "لم يتم الحفظ، حدث خطأ ما");
                        return res.redirect("/cpanel/admin");
                    } else {
                        req.flash("success", "تم حفظ التعديلات بنجاح");
                        return res.redirect("/cpanel/admin");
                    }
                });
            }
        });
    }
});
router.post("/editwords", function (req, res) {
    if (req.body.words) {
        console.log(req.body.words);
        Word.find(function (err, word) {
            if (err) {
                req.flash("error", "لم يتم الحفظ، حدث خطأ ما");
                return res.redirect("/cpanel/admin");
            }
            if (word.length === 1) {
                word[0].words = req.body.words;
                word[0].save(function (error) {
                    if (error) {
                        req.flash("error", "لم يتم الحفظ، حدث خطأ ما");
                        return res.redirect("/cpanel/admin");
                    } else {
                        req.flash("success", "تم حفظ التعديلات بنجاح");
                        return res.redirect("/cpanel/admin");
                    }
                });
            } else {
                var newWords = new Word();
                newWords.words = req.body.words;
                return newWords.save(function (err) {
                    if (err) {
                        req.flash("error", "لم يتم الحفظ، حدث خطأ ما");
                        return res.redirect("/cpanel/admin");
                    } else {
                        req.flash("success", "تم حفظ التعديلات بنجاح");
                        return res.redirect("/cpanel/admin");
                    }
                });
            }
        });
    }
});
//to add a new admin
router.post("/addadmin", function (req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var empty;
    if (username === "") {
        empty = true;
    } else if (email === "") {
        empty = true;
    } else if (password === "") {
        empty = true;
    } else {
        empty = false;
    }
    if (empty === true) {
        res.json({error: "من فضلك أدخل كل الحقول"});
    } else {
        passport.authenticate("local.signUp", function (err, user, info) {
            if (user) {
                res.json({error: "يرجى ادخال ايميل مختلف، الإيميل مسجل بالفعل"});
            }
            if (!user) {
                var newAdmin = new Admin();
                newAdmin.username = username;
                newAdmin.password = newAdmin.encryptPassword(password);
                newAdmin.email = email;
                newAdmin.save(function (err) {
                    if (err) {
                        res.json({error: "لم يتم الحفظ، حدث خطأ ما"});
                    } else {
                        res.json({success: "تمت اضافته بنجاح"});
                    }
                });
            }
        })(req, res, next);
    }
});
var storage = multer.diskStorage({
    destination: "public/uploads",
    filename: function (req, file, cb) {
        cb(null, "successMusic" + path.extname(file.originalname));
    }
});
var upload = multer({
    storage: storage,
    // limits: {fileSize: 1000000},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single("mp3file");
//function to check file type
function checkFileType(file, cb) {
    //allowed file types
    let fileTypes = /mp3|wav|ogg|wma/;
    let extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //check mime type of image
    let mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extname) {
        return cb(null, true);
    } else {
        cb("تحميل ملف mp3 فقط");
    }
}
//router for uploading mp3 file
router.post("/uploadmp3", function (req, res, next) {
    //setting of multer
    upload(req, res, function (err) {

        if (req.file === undefined) {
            req.flash("error", "لم يتم اختيار ملف");
            return res.redirect("/cpanel/admin");
        }
        if (err) {
            req.flash("error", err);
        } else {
            Music.find(function (err, data) {
                if (err) {
                    req.flash("error", "حدث خطأ ما");
                    return res.redirect("/cpanel/admin");
                }
                if (data.length === 1) {
                    data[0].music = req.file.filename;
                    data[0].save(function (err) {
                        if (err) {
                            req.flash("error", "حدث خطأ ما");
                            return res.redirect("/cpanel/admin");
                        }
                        req.flash("success", "تم الحفظ بنجاح");
                        return res.redirect("/cpanel/admin");
                    });
                } else {
                    var newMusic = new Music();
                    newMusic.music = req.file.filename;
                    newMusic.save(function (err) {
                        if (err) {
                            req.flash("error", "حدث خطأ ما");
                            return res.redirect("/cpanel/admin");
                        }
                        req.flash("success", "تم الحفظ بنجاح");
                        return res.redirect("/cpanel/admin");
                    });
                }
            });
        }
    });

});
//router for remove a letter
router.post("/removeLetter", function (req, res, next) {
    var reqLetter = req.body.letter;
    Letters.findOne(function (err, letter) {
        if (err) {
            req.flash("error", "حدث خطأ ما");
            return res.redirect("/cpanel/admin");
        }
        if (letter) {

           var letterIndex = letter.letters.indexOf(reqLetter);
            letter.letters.splice(letterIndex, 1);
            letter.save(function (err) {
                if (err) {
                    console.log(err);
                }
                return res.json({success: "success"});
            });
        }
    });
});
// router for delete the words
router.post("/removeword", function (req, res) {
    var reqWord = req.body.word;
    Word.findOne(function (err, word) {
        if (err) {
            req.flash("error", "حدث خطأ ما");
            return res.redirect("/cpanel/admin");
        }
        if (word) {
            var wordIndex = word.words.indexOf(reqWord);
            word.words.splice(wordIndex, 1);
            word.save(function (err) {
                if (err) {
                    console.log(err);
                }
                return res.end("success");
            });
        }

    });
});
//router for edit user data
router.post("/:id", function (req, res, next) {
    Admin.findOne({"_id": req.params.id}, function (err, user) {
        if (err) {
            req.flash("error", "لم يتم الحفظ، حدث خطأ ما");
            return res.redirect("/cpanel/admin");
        }
        if (user) {
            user.username = req.body.username;
            user.email = req.body.email;
            if (req.body.password !== "") {
                user.password = user.encryptPassword(req.body.password);
            }
            user.save(function (err) {
                if (err) {
                    req.flash("error", "لم يتم الحفظ، حدث خطأ ما");
                    return res.redirect("/cpanel/admin");
                } else {
                    req.flash("success", "تم الحفظ بنجاح");
                    return res.redirect("/cpanel/admin");
                }
            });
        }
    });
});
//router for logout
router.get("/logout", function (req, res, next) {
    req.logout();
    req.session.destroy();
    return res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect("/cpanel/login");
    }
}


module.exports = router;