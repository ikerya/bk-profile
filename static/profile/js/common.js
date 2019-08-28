function encodeQuery(formdata, numericPrefix, argSeparator, encType) {
    var encodeFunc = encodeURIComponent;

    var value
    var key
    var tmp = []

    var _httpBuildQueryHelper = function(key, val, argSeparator) {
        var k
        var tmp = []
        if (val === true) {
            val = '1'
        } else if (val === false) {
            val = '0'
        }
        if (val !== null) {
            if (typeof val === 'object') {
                for (k in val) {
                    if (val[k] !== null) {
                        tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
                    }
                }
                return tmp.join(argSeparator)
            } else if (typeof val !== 'function') {
                return encodeFunc(key) + '=' + encodeFunc(val)
            } else {
                throw new Error('There was an error processing for http_build_query().')
            }
        } else {
            return ''
        }
    }

    if (!argSeparator) {
        argSeparator = '&'
    }
    for (key in formdata) {
        value = formdata[key]
        if (numericPrefix && !isNaN(key)) {
            key = String(numericPrefix) + key
        }
        var query = _httpBuildQueryHelper(key, value, argSeparator)
        if (query !== '') {
            tmp.push(query)
        }
    }

    return tmp.join(argSeparator)
}

function decodeQuery(url) {
    var queryString = (url || "").match(/\?.+/);

    if (!queryString) return {};

    var queryString = queryString[0].substr(1);
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function wait(s, ...rest) {
	return new Promise(resolve =>
		setTimeout(() =>
			resolve(rest.length > 1 ?
				rest:
				rest[0]
			)
		, s * 1000)
	);
}

const user = new User(accessToken);

$(document).ready(() => {
	user.get()
		.then(userInfo => {
            profile.setUserInfo(userInfo);
            profile.setPhotos(); 
            profile.renderGalleryPhotos();
            profile.renderUserInfo();
			profile.initUploadPhotoButton();
		});
});