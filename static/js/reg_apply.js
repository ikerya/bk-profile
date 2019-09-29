$(function () {
    $.get(apiPath + "/auth/reg/apply", {regId: regId}, {withCredentials: true})
        .done(function (data) {
            checkData(data, function (data) {
                regSuccess(data);
            }, function (errorCode, errorMsg) {
                alertDagner("Ошибка " + errorCode + ": " + errorMsg);
                $(".loader").hide();
                $("#regButton").show();
            })
        })
        .fail(function () {
            alertDagner("Ошибка на сервере");
            $(".loader").hide();
            $("#regButton").show();
        })
        .always(function () {
            // $("#add_admin_btn").removeAttr("disabled");

        });


    function regSuccess(data) {
        if (data.token) {
            window.location = "/reg/session/start/" + data.token;
        } else {
            alertDagner("Произошла ошибка; попробуйте, пожалуйста, позднее")
        }
    }

    function alertDagner(s) {
        $("#alerts").append("<div class='alert'>" + s + "</div>");
    }

});