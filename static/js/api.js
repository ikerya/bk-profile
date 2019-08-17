const api = {};

api.call = function call(methodName, data = {}, method = 'GET', options = {}) {
    const methodQuery = decodeQuery(methodName);
                
    methodQuery.accessToken = accessToken;
    methodName = methodName.replace(/\?.+/, '');
    methodName += `?${encodeQuery(methodQuery)}`;

    options.url = [params.apiDomain, methodName].join("/");
    options.method = method;
    options.data = data;

    return new Promise((resolve, reject) => {
        $.ajax(options)
            .done(response => {
                if (!response.error) {
                    return resolve(response);
                }

                reject(response.error);
            });
    });
};