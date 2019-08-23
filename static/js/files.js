const files = {};

files.check = selector => {
    selector = document.querySelector(selector);

    if (!selector) {
        return false;
    }

    const file = selector.files[0];

    return file;
};

files.getUploadUrl = (methodName) => {
    return api.call(methodName, null, 'GET');
};

files.uploadFile = (uploadUrl, file) => {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();

        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader('x-filename', file.name.replace(/[а-я]/gi, 'x'));
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                const uploadUrlParsed = new URL(uploadUrl);
                const filePath = xhr.getResponseHeader('x-uploaded-as-full-path');
                const fileUrl = `${uploadUrlParsed.origin}/bonusclass/${filePath}`;

                resolve(fileUrl);
            }
        };
        xhr.send(file);
    });
};

files.uplaodPhoto = (uploadUrl, file) => {
    const data = new FormData();

    data.append('uploaded_file', file);

    return api.call(uploadUrl.substr(1), data, 'POST', {
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false
    });
};

files.upload = (selector, isPhoto) => {
    return new Promise((resolve, reject) => {
        const file = files.check(selector);
        const methodName = isPhoto ? 'files/photos/upload' : 'files/upload';

        if (!file) {
            return reject();
        }

        files.getUploadUrl(methodName)
            .then(response => {
                if (isPhoto) {
                    return files.uplaodPhoto(response, file)
                } else {
                    return files.uploadFile(response, file)
                }
            })
            .then(resolve)
    });
};