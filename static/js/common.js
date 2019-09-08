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

$(document).ready(function () {
    $("form").submit(function () {
        $.ajax({
            type: "POST",
            url: '/wp-admin/admin-ajax.php?action=submit_form',
            data: $(this).serialize()
        }).done(function (response) {
            $.magnificPopup.open({
                items: {
                    src: '#popup-success',
                    type: 'inline'
                }
            });
        });
        return false;
    });

    $('.main-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        prevArrow: '<a class="prev"><i class="fa fa-angle-left" aria-hidden="true"></i></a>',
        nextArrow: '<a class="next"><i class="fa fa-angle-right" aria-hidden="true"></i></a>',
    });

    $('.sandwich').click(function () {
        $(this).toggleClass('active');
        $('.menu').slideToggle();
    });

    $('.menu a').magnificPopup({
        type: 'inline',
        // fixedContentPos: false,
        callbacks: {
            open: function () {
                openVote();
            },

            close: function () {
            }
        }


    });
});