function openVote() {
    $.get(apiPath + "/polls", {accessToken: accessToken}, {withCredentials: true})
        .done(function (data) {
            checkData(data, function (data) {
                checkUserVoted(data[0])
            }, function (errorCode, errorMsg) {
                // $("#alerts").append(alettDanger("Ошибка " + errorCode + ": " + errorMsg));
                alert("Ошибка " + errorCode + ": " + errorMsg);
            })
        })
        .fail(function () {
            $("#alerts").append(alettDanger("Ошибка на сервере"));

            alert("Ошибка на сервере")
        })
        .always(function () {
            // $("#add_admin_btn").removeAttr("disabled");

        })
}

var pollData;

function checkUserVoted(dataPoll){
    $.get(apiPath + "/polls/" + dataPoll.id + "/isCurrentUserVoted", {accessToken: accessToken}, {withCredentials: true})
            .done(function (data) {
                checkData(data, function (data) {
                    showFieldsVote(dataPoll, !data)
                }, function (errorCode, errorMsg) {
                    // $("#alerts").append(alettDanger("Ошибка " + errorCode + ": " + errorMsg));
                    alert("Ошибка " + errorCode + ": " + errorMsg);
                })
            })
            .fail(function () {
                $("#alerts").append(alettDanger("Ошибка на сервере"));

                alert("Ошибка на сервере")
            })
            .always(function () {
                // $("#add_admin_btn").removeAttr("disabled");

            })
}



function showFieldsVote(data, showPreview = true) {
    pollData = data;
    let res = showPreview ? "<span>Голосование</span>" : "<span>Вы успешно оценили эти товары</span>";

    if (showPreview) {
        res += addLimitDescription();
    }

    data.items.forEach(function (item) {

        let key;
        if (showPreview) {
            key = "photosPreview";
        } else {
            key = "photos";
        }
        let itemString = addVotingNav(item[key], item.id);
        res += itemString;
    });


    res += addButtonStart() + addButtonFinish();

    $("#voting").html(res);


    data.items.forEach(function (item) {
        $('#voting-slider-' + item.id).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            asNavFor: '#voting-slider-nav-' + item.id
        });

        $('#voting-slider-nav-' + item.id).slick({
            slidesToShow: item.photosPreview.length,
            slidesToScroll: 1,
            asNavFor: '#voting-slider-' + item.id,
            dots: false,
            arrows: false,
            focusOnSelect: true,
            responsive: [
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        });


        $("input[name='voting-radio-" + item.id + "']").change(function (e) {

            votingResult[item.id] = parseInt($(this).val());

            let count1 = 0;
            let count5 = 0;

            for (let key in votingResult) {

                let itemValue = votingResult[key];
                if (itemValue == 1) {
                    count1++
                } else if (itemValue == 5) {
                    count5++
                }
            }

            if (count1 > 1) {
                alert("Вы не можете ставить больше одной 1");
                $(this).each(function () {
                    $(this).removeAttr('checked');
                });

                votingResult[item.id] = 0;
            }

            if (count5 > 3) {
                alert("Вы не можете ставить больше трех 5");
                $(this).each(function () {
                    $(this).removeAttr('checked');
                });

                votingResult[item.id] = 0;
            }

            // alert($(this).val());

            /*if ($(this).val() == 'history') {
                $year.css({display: 'none'});
                $datespan.fadeIn('fast');
            } else {
                $datespan.css({display: 'none'});
                $year.fadeIn('fast');
            }*/

        });
    });

    $('.voting-radio').hide();
    $('#stop_voting').hide();

    if (!showPreview) {
        $('#start_voting').hide();
    }

    $('#start_voting').click(function () {
                     if(!accessToken){
                        alert("Голосовать могут только зарегистрированные эксперты. Пожалуйста, авторизируйтесь на сайте для голосования.");
                        return;

                    }

        $("html, body").animate({scrollTop: 0}, "slow");
        $('#start_voting').hide();
        $('#stop_voting').show();

        $('.voting-radio').show();

        data.items.forEach(function (item) {
            votingResult[item.id] = 0;
        });

        return false;
    });

    $('#stop_voting').click(function () {
        if (checkVotesFinished()) {
            // $.magnificPopup.instance.close();

            setVoteResult(votingResult);

            // magnificPopup
        }
    });

}

var votingResult = {};


function setVoteResult(data) {
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(data){
            showFieldsVote(pollData, false);
        },
        error: function(){
//            showFieldsVote(pollData, false);
            alert("Произошла ошибка; голос не засчитан.")
        },
        processData: false,
        type: 'POST',
        url: apiPath + "/polls/"+ pollData.id + "/setVote?accessToken=" + accessToken
    });
}

function checkVotesFinished() {
    let count1 = 0;
    let count5 = 0;

    for (let key in votingResult) {

        let itemValue = votingResult[key];
        if (itemValue == 0) {
            alert("Вы еще не поставили оценку некоторым товарам");
            return false;
        }

        if (itemValue == 1) {
            count1++;
        } else if (itemValue == 5) {
            count5++;
        }
    }

    if (count1 > 1) {
        alert("Вы не можете ставить больше одной 1");
        return false;
    }

    if (count5 > 3) {
        alert("Вы не можете ставить больше трех 5");
        return false;
    }

    return true;
}

function addVotingNav(pollItem, itemId) {
    let slider = `<div class="voting-slider" id="voting-slider-${itemId}">`;
    let nav = `<div class="voting-slider-nav" id="voting-slider-nav-${itemId}">`;


    pollItem.forEach(function (photo) {
        slider += `<div class="voting-slider-item" style="background-image: url(${photo.photoOrig})"></div>`;
        nav += ` <div class="voting-slider-nav-item" style="background-image: url(${photo.photoSmall})"></div>`;
    });


    slider += '</div>';
    nav += '</div>';

    return slider + nav + addVotes(itemId);
}

function addVotes(itemId) {
    return `<div class="voting-radio" id="voting-radio-${itemId}">\n` +
        `        <input type="radio" id="radio1-${itemId}" name="voting-radio-${itemId}" value="5">\n` +
        `        <label for="radio1-${itemId}">\n` +
        `          <span></span>\n` +
        `          <p>5 - супер, беру, не глядя на цену</p>\n` +
        `        </label>\n` +
        `        <input type="radio" id="radio2-${itemId}" name="voting-radio-${itemId}" value="4">\n` +
        `        <label for="radio2-${itemId}">\n` +
        `          <span></span>\n` +
        `          <p>4 - очень, очень нравится</p>\n` +
        `        </label>\n` +
        `        <input type="radio" id="radio3-${itemId}" name="voting-radio-${itemId}" value="3">\n` +
        `        <label for="radio3-${itemId}">\n` +
        `          <span></span>\n` +
        `          <p>3 - хорошо, если разумная цена</p>\n` +
        `        </label>\n` +
        `        <input type="radio" id="radio4-${itemId}" name="voting-radio-${itemId}" value="2">\n` +
        `        <label for="radio4-${itemId}">\n` +
        `          <span></span>\n` +
        `          <p>2 - за полцены можно взять</p>\n` +
        `        </label>\n` +
        `        <input type="radio" id="radio5-${itemId}" name="voting-radio-${itemId}" value="1">\n` +
        `        <label for="radio5-${itemId}">\n` +
        `          <span></span>\n` +
        `          <p>1 - даром не надо</p>\n` +
        `        </label>\n` +
        `      </div>`
}

function addButtonStart() {
    return '<center>\n' +
        '        <a   id="start_voting">Начать голосвание</a>\n' +
        '      </center>'
}

function addButtonFinish() {
    return '<center>\n' +
        '        <a id="stop_voting">Завершить голосование</a>\n' +
        '      </center>'
}

function addLimitDescription() {
    return '      <p>В одном голосовании нельзя поставить больше трех "5" и больше одной "1", ' +
        'поэтому прежде чем проголосовать посмотрите  все представленные модели, и после этого начните оценивать представленные модели.</p><br/><br/>\n'
}