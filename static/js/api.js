 var serverAddress = apiPath;

function checkData(data, onComplete, onError) {
    data = eval(data);

    if (data.error) {
        var errCode = data.error.code ? data.error.code : 0;
        var errMsg = data.error.msg ? data.error.msg : "Неизвестная ошибка";
        onError(errCode, errMsg)
    } else {
        onComplete(data)
    }
}


function escapeHtml(unsafe) {
    return unsafe.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function timestampToString(time) {
    var newDate = new Date();
    newDate.setTime(time);
    return newDate.toLocaleString('ru');
}

/*

function alertSuccess(message){
    return "<div class=\"sufee-alert alert with-close alert-success alert-dismissible fade show\">\n" +
        "                                            <span class=\"badge badge-pill badge-success\">Успешно</span>\n" +
        "                                                "+ message + "\n" +
        "                                              <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n" +
        "                                                <span aria-hidden=\"true\">&times;</span>\n" +
        "                                            </button>\n" +
        "                                        </div>\n"  ;
}


function alettDanger(message) {
    return "<div class=\"sufee-alert alert with-close alert-danger alert-dismissible fade show\">\n" +
    "                                            <span class=\"badge badge-pill badge-danger\">Ошибка</span>\n" +
    "                                                "+ message + "\n" +
    "                                              <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n" +
    "                                                <span aria-hidden=\"true\">&times;</span>\n" +
    "                                            </button>\n" +
    "                                        </div>";

}*/
