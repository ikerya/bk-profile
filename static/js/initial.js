$(function () {
    if (!(accessToken === "")) {
        $("#me").show();
        $("#login_btn").hide();
    } else {
        $("#me").hide();
        $("#login_btn").show();
        $("#logout_btn").hide();

    }

    $.get(serverAddress + "/shops/", {accessToken: accessToken}, {withCredentials: true})
        .done(function (data) {
            checkData(data, function (data) {
                showFields(data)
            }, function (errorCode, errorMsg) {
                $("#alerts").append(alettDanger("Ошибка " + errorCode + ": " + errorMsg));
            })
        })
        .fail(function () {
            $("#alerts").append(alettDanger("Ошибка на сервере"));
        })
        .always(function () {
            // $("#add_admin_btn").removeAttr("disabled");

        })
});


function showFields(data) {

    for (let i = 1; i <= 9; i++) {
        let o1 = getShopByPosition(i, data);

        if (o1) {
            let shopName = o1.name;

            let selector = $("#shop" + i);

            selector.html("<span>" + shopName + "</span>\n" +
                "    <div>\n" +
                "    <span>" + shopName + "</span>\n" +
                "    </div>")

            if (o1.photoMain) {
                selector.css('background-image', 'url(' + o1.photoMain + ')');
            }

        }

    }





}

function getShopByPosition(position, data) {
    for (let i = 0; i < data.length; i++) {
        let o = data[i];
        if (o.mainPosition == position) {
            return o;
        }
    }
}