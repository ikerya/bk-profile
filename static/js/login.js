$(function () {
    $("#regButton").click(function () {
        removeAlerts();
        startLogin();
    });

    $(".loader").hide();
});

function startLogin() {
    let email = $("#email").val();
    let password = $("#password").val();

    if (validateEmail(email) && validatePass(password)) {

        $(".loader").show();
        $("#regButton").hide();

        var params = {
            login: email,
            password: password
        };

        $.get(apiPath + "/auth/login", params, {withCredentials: true})
            .done(function (data) {
                checkData(data, function (data) {
                    regSuccess(data)
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

function regSuccess(data) {
    window.location = "/reg/session/start/" + data.token
}

function alertDagner(s) {
    $("#alerts").append("<div class='alert'>" + s + "</div>");
}

function removeAlerts() {
    $("#alerts").empty();
}

function validatePass(p) {

    if (p.trim().length === 0) {
        alertDagner("Вы не заполнили поле 'Пароль");
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