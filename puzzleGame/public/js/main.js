$(document).ready(function () {
    $(function () {
        var colorButtons = $(".choose-color");
        var colLetter = $(".col-letter");
        $(colorButtons).css("display", "block");
        Array.from(colorButtons).forEach(function (btn) {
            $(btn).css({"background-color": $(btn).data("color")});
        });
        colorButtons.on("click", function () {
            var colorData = $(this).data("color");
            $(document.body).css("background-color", colorData);
            if ($(colLetter).hasClass("click-color")) {
                 $(".click-color").css("background-color", colorData);

            }
        });
        //variables for background color
        var winnArr = [];
        var compoundWord = "";
        $(colLetter).on("click", function () {
            if ($(this).hasClass("had-clicked")) {
                $(this).css("background-color", "red");
            } else {
                if ($(this).hasClass("click-color")) {
                    $(this).css("background-color", "#c5c5c5");
                    var text = new RegExp($(this).text(), "gi");
                    var index = compoundWord.indexOf($(this).text());
                    text = text.exec(compoundWord);
                    compoundWord = compoundWord.replace(text, "");
                    $(this).removeClass("click-color");
                    // var character = $(this).text();
                    // var index = compoundWord.indexOf(character);
                    // Array.from(compoundWord).splice(index, 1);
                } else {
                    $(this).addClass("click-color");
                    compoundWord += $(this).text();
                    // compoundWord += $(this).text();
                    // $(".click-color").css("background-color", $(document.body).css("background-color"));
                    $(this).css("background-color", $(document.body).css("background-color"));
                }
            }
            $(".user-writer").text(compoundWord);
            $.ajax({
                type: "GET",
                url: "/",
                success: function (data) {
                    data.words.forEach(function (word) {
                        if (compoundWord === word) {
                            winnArr.push(compoundWord);
                            $.ajax({
                                type: "GET",
                                url: "/mp3",
                                success: function (succ) {
                                var audio = new Audio(`/uploads/${succ.music}`);
                                audio.play();
                                $(document).on("click", function () {
                                    audio.pause();
                                });
                                },
                                error: function (err) {
                                    console.log(err);
                                }
                            });
                            var container = $(`<div class='cont'><h1>لقد فزت</h1><p>تم الفوز في ${winnArr.length} من ${data.words.length} </p></div>`);
                            $(container).css({
                                "width":"80%",
                                "position": "absolute",
                                "top": "-500px",
                                "height": "300px",
                                "display": "none",
                                "background-color": "white",
                                "right": "10%",
                                "z-index": "100",
                                "text-align": "center",
                                "color": "red"
                            });
                            $(document.body).append(container);
                            $(container).css("display", "block");
                            $(container).animate({"top": "0"}, 1000);
                            $(document).on("click", function () {
                                $(container).animate({"top": "-500"});
                                $(container).css("display", "none");
                            });
                            $(".click-color").addClass("had-clicked").removeClass("click-color").css("background-color", "red");
                            compoundWord = "";

                        }
                    });
                }
            });
        });
    });
});