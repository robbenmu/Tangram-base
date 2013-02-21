/*global T:false baidu:false*/
(function(win, doc, undefined) {
    var T = win.T = win.baidu = {
        ver: "0.1"
    };

    var noop = $.noop;

    // ajax
    T.ajax = {};

    var wrapCallback = function(type, callback, errorCallback) {

        callback = $.isFunction(callback) ? callback : noop;

        return function(data, textStatus, jqXHR) {

            var globelHandler = T.ajax[type];

            switch (type) {
            case 'onsuccess':
                callback(jqXHR, data);
                break;
            case 'ontimeout':
                if (textStatus === 'timeout') {
                    callback(data);
                    $.isFunction(globelHandler) && globelHandler(data);
                } else {
                    errorCallback(data);
                }
                break;
            default:
                callback(data);
                $.isFunction(globelHandler) && globelHandler(data);
            }
        };

    };

    var statusMatch = /^on(\d+)$/i; //解析http状态码
    var request = T.ajax.request = function(url, opt_options) {
        var options = opt_options || {},
            data = options.data || "",
            async = !(options.async === false),
            username = options.username || "",
            password = options.password || "",
            type = (options.method || "GET").toUpperCase(),
            headers = options.headers || {},
            timeout = options.timeout || 0,
            cache = options.noCache === undefined ? true : !options.noCache,
            onerror = wrapCallback('onfailure', options.onfailure),
            onsuccess = wrapCallback('onsuccess', options.onsuccess),
            onbeforeSend = wrapCallback('onbeforerequest', options.onbeforerequest),
            onerror = wrapCallback('ontimeout', options.ontimeout, onerror),
            //兼容超时ontimeout处理
            statusCode = {};

        $.each(opt_options, function(key, val) {
            var result = statusMatch.exec(key);

            if (result) {
                statusCode[result[1]] = wrapCallback(result[1], val);
            }
        });

        return $.ajax(url, {
            async: async,
            cache: cache,
            data: data,
            error: onerror,
            success: onsuccess,
            username: username,
            password: password,
            type: type,
            headers: headers,
            beforeSend: onbeforeSend,
            statusCode: statusCode,
            timeout: timeout
        });
    };

    T.ajax.get = function(url, onsuccess) {
        return request(url, {
            'onsuccess': onsuccess
        });
    };

    T.ajax.post = function(url, data, onsuccess) {
        return request(url, {
            'onsuccess': onsuccess,
            'method': 'POST',
            'data': data
        });
    };

    T.ajax.form = function(form, options) {
        options = options || {};

        var el = $(form),
            method = el.attr('method'),
            url = el.attr('action'),
            replacer = options.replacer ||
            function(value, name) {
                return value;
            },
            serializeArray = el.serializeArray(),
            serialize;

        serializeArray = $.map(serializeArray, function(item) {
            return {
                name: item.name,
                value: replacer(item.value, item.name)
            };
        });

        serialize = $.param(serializeArray);
        return request(url, $.extend(options, {
            method: method,
            data: serialize
        }));
    };

    // dom
    T.dom = {};

    var g = T.g = T.dom.g = function(id) {
        if (!id) return null; //修改IE下baidu.dom.g(baidu.dom.g('dose_not_exist_id'))报错的bug，by Meizz, dengping
        if ('string' == typeof id || id instanceof String) {
            return document.getElementById(id);
        } else if (id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
            return id;
        }
        return null;
    }
    
    
    T.query = T.dom.query = $.find;
    
    // ('addClass children contains empty first hasClass' +
//     ' hide insertAfter insertBefore last next prev ready remove removeClass show' +
//     ' toggle toggleClass').replace(/\w+/g, function(match){
//         T[match] = T.dom[match] = function(){
//             console.log(arguments)
//             var args = Array.prototype.slice.call(arguments),
//                 element = $(args[0]),
//                 result = element[match].apply(element, args.splice(1));
//                 
//             return result;
//         }
//     });
    T.dom.contains = function(container, contained){
        container = g(container);
        contained = g(contained);
        return $.contains(container, contained);
    };
    
    ('addClass toggleClass ' +
    'empty hide remove show toggle '+
    'insertAfter insertBefore ' +
    '$first $last $next $prev $children ' +
    '$hasClass ').replace(/(\$)?(\w+)/g, function(match, p1, p2){
        console.log(arguments)
        T[p2] = T.dom[p2] = function(){
            var args = Array.prototype.slice.call(arguments),
                element = $(args[0]);
                result = element[p2].apply(element, args.splice(1));
                console.log(element[p2])
            return p1 ? result : g(element.get(0));
        }
    });
    





})(window, document);
