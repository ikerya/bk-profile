$(function () {
    $("#regButton").click(function () {
        removeAlerts();
        startRegistration();
    });

    $(".loader").hide();

    let refId = gup("ref");

    if (!refId || refId === "") {
        $("#regForm").hide();
        $("#disallow").show();
    }
});

function startRegistration() {
    let fName = $("#fname").val();
    let lastName = $("#lname").val();
    let email = $("#userEmail").val();
    let gender = $("#gender").val();

    if (checkName(fName, "Имя") && checkName(lastName, "Фамилия") && validateEmail(email)) {

        $(".loader").show();
        $("#regButton").hide();

        var params = {
            referrer: gup("ref"),
            firstName: fName,
            lastName: lastName,
            email: email,
            gender: gender
        };

        $.get(apiPath + "/auth/reg", params, {withCredentials: true})
            .done(function (data) {
                checkData(data, function (data) {
                    regSuccess();
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

    }


}

function regSuccess() {
    $("#regForm").hide();
    $("#success").show();
}

function alertDagner(s) {
    $("#alerts").append("<div class='alert'>" + s + "</div>");
}

function removeAlerts() {
    $("#alerts").empty();
}


function checkName(name, fieldName) {

    if (name.length == 0) {
        alertDagner("Вы не заполнили поле " + fieldName)
        return false;
    }

    if (name.length < 2 || name.length > 20) {
        alertDagner("Вы некорректно заполнили поле " + fieldName);
        return false;
    }

    return true;
}

function validateEmail(email) {

    if (email.length == 0) {
        alertDagner("Вы не заполнили поле 'Эл. почта'");
        return false;
    }

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}