$(document).ready(function () {
    var btnToggle = $(".btn-toggle");
    $(btnToggle).on("click", function () {
        var btnData = $(this).data("toggle");
        $(".container-options > div").not(".container-save").hide();
        $(btnData).toggle(400);
    });
//    function to add a new word box

    $(function () {
        var addBtn = $(".add-box-word");
        var content = `
        <div class="word-box col-lg-3 col-md-4 col-sm-6">
                                <div class="form-group">
                                    <div class="col-lg-12 col-md-12 col-sm1-12 col-xs-12">
                                    <p class="btn btn-danger clearfix">-</p>
</div>
                                    <input class="form-control" type="text" name="words"/>
                                </div>
                            </div>
        `
        $(addBtn).on("click", function () {
            $(".container-word-inputs").append(content);
            $(".word-box .btn-danger").on("click", function () {
                $(this).parents(".word-box").remove();
            });
        });
        $(".word-box .btn-danger").on("click", function () {
            $(this).parents(".word-box").remove();
        });
    });

    $(function () {
        var addBtn = $(".add-box-letter");
        var content = `
            <div class="letter-box col-lg-2 col-md-2 col-sm-2 col-xs-4">
                                                <div class="form-group">
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <p class="remove-btn" title="حذف">-</p>
                                                    </div>
                                                    <label> اكتب الحرف</label>
                                                    <input class="form-control" name="letters" type="text"/>
                                                </div>
                                            </div>                                                
        `
        $(addBtn).on("click", function () {
            $(".container-letters-inputs").append(content);
            $(".letter-box .remove-btn").on("click", function () {
                $(this).parents(".letter-box").remove();
            });
        });
        $(".letter-box .remove-btn").on("click", function () {
            $(this).parents(".letter-box").remove();
        });
    });
//    for submitting adding admin form
    $("#add-admin-form").on("submit", function (e) {
        e.preventDefault();
        var data = {
            username: $("#add-admin-form input[name=username]").val(),
            email: $("#add-admin-form input[name=email]").val(),
            password: $("#add-admin-form input[name=password]").val()
        };
        $.ajax({
            type: "POST",
            url: "/cpanel/admin/addadmin",
            data: data,
            success: function (data) {
                if (data.error) {
                    $(".container-add-admin .alert-error").text(data.error).addClass("alert-danger");
                }
                if (data.success) {
                    $(".container-add-admin .alert-error").text(data.success).removeClass("alert alert-danger").addClass("alert alert-success");
                }

            },
            error: function (err) {
                console.log(err);
            }
        });
    });
//    function for removing the letters
    $(".remove-letter-btn").on("click", function () {
        var data = {letter: $(this).data("val")};
        // var containerOptions = $(".container-options");
        // $(containerOptions).html("");
        $.ajax({
            type: "POST",
            url: "/cpanel/admin/removeLetter",
            data: data
        });
    });
//    function to delete the words
    $(".word-box .btn-remove-word").on("click", function () {
        var data = {word: $(this).data("val")};
        $.ajax({
            type: "POST",
            url: "/cpanel/admin/removeword",
            data: data
        });
    });
    $(".btn-upload-file").on("click", function () {
        $(".input-upload-file").click();
        $(".file-value").text($(".input-upload-file").val());
    });
});
