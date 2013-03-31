/*global T:false baidu:false*/

// 目的不是删掉tangram，保留tangram好的部分，将dom、事件等替换为jquery。
// 
// 1.利用jq资源快速开发。
// 
// 2.更好的兼容性及bug处理。
define(function(require, exports, module){

    var win = window,
        doc = document;

    var T = win.T = win.baidu || {};
    
    var baidu = T;

    T.ver = 0.2;

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
    };

    var _g = T.dom._g = function(id) {
        if ($.type(id) === 'string') {
            return document.getElementById(id);
        }
        return id;
    };

    T.query = T.dom.query = $.find;

    T.q = T.Q = T.dom.q = function(className, element, tagName) {
        element = element || doc.body;
        tagName = tagName || '';
        className = $.trim(className) ? ('.' + className) : '';
        var result = $(tagName + className, element);
        return result.length ? result.get() : [];
    };

    /*
        TODO hasClass、toggleClass方法与tangram不兼容不支持class顺序调换
    */
    /*
        TODO show方法与tangram内部处理不一样，会将元素置为block
    */
    /*
        TODO remove\getText 方法不会与tangram一样引起异常，见remove测试用例最后一个case
    */
    ('addClass removeClass toggleClass ' + 
    'empty hide show toggle remove ' + 
    '!hasClass @getText ' + 
    '#setPosition @getPostion ' + 
    '#setAttr @getAttr ' + 
    '#setStyle @getStyle').replace(/(\!)?(@)?(#)?(\w+)/g, function(match, p1, p2, p3, p4) {
        T[p4] = T.dom[p4] = function() {
            var args = Array.prototype.slice.call(arguments),
                element = $(_g(args[0])),
                action = p4,
                result;
            args = args.splice(1);

            if (p1) {
                args = [$.trim(args[0])];
            }

            if (p2 || p3) {
                action = action.replace(/[sg]et/, '').toLocaleLowerCase();
            }

            if (action === 'style') {
                action = 'css';
            }
            result = element[action].apply(element, args);
            return (!p1 && !p2) ? g(element.get(0)) : result;
        };
    });

    T.getStyles = T.dom.getStyles = T.dom.getStyle;
    T.setAttrs = T.dom.setAttrs = T.dom.setAttr;

    T.dom.hasAttr = function (element, name){
        return !!($(_g(element)).attr(name));
    };

    'insertAfter insertBefore'.replace(/\w+/g, function(match) {
        T[match] = T.dom[match] = function(newElement, existElement) {
            newElement = _g(newElement);
            existElement = _g(existElement);
            return $(newElement)[match](existElement).get(0);
        };
    });

    T.insertHTML = T.dom.insertHTML = function(element, position, html) {

        var pos = {
            'beforeBegin': 'before',
            'afterBegin': 'prepend',
            'beforeEnd': 'append',
            'afterEnd': 'after'
        };

        return $(_g(element))[pos[position]](html).get(0);

    };

    'first last @next @prev children'.replace(/(@)?(\w+)/g, function(match, p1, p2) {
        T.dom[p2] = function() {
            var args = Array.prototype.slice.call(arguments),
                element = $(_g(args[0]));
                
            return p1 ? element[p2]().get(0) : (p2 === 'children' ? element.children().get() : element.children()[match]().get(0));
        };
    });

    'getParent getAncestorBy getAncestorByClass getAncestorByTag'.replace(/\w+/g, function(match, p1, p2) {
        T.dom[match] = function() {
            var args = Array.prototype.slice.call(arguments),
                element = $(_g(args[0])),
                result;

            switch (match) {

            case 'getParent':
                result = element.parent();
                break;

            case 'getAncestorBy':
                element.parents().each(function(i, item) {
                    if (args[1](item)) {
                        result = $(item);
                        return false;
                    }
                });
                break;

            default:
                result = element.parents((match === 'getAncestorByClass' ? '.' : '') + args[1]);
            }

            return (result && result.length) ? result.get(0) : null;
        };
    });



    T.dom.contains = function(container, contained) {
        container = g(container);
        contained = g(contained);
        return $.contains(container, contained);
    };

    T.dom.ready = $(document).ready;

    T.dom.opacity = function(element, opacity) {
        return $(element).css('opacity', opacity);
    };

    T.dom.create = function(tagName, opt_attributes) {
        opt_attributes = opt_attributes || {};
        return $('<' + tagName + '/>').attr(opt_attributes).get(0);
    };

    T.dom._styleFixer = {};

    // event
    T.event = {};

    T.event._listeners = {};

    $.each({
        'on': 'bind',
        'un': 'unbind',
        'fire': 'trigger'
    }, function(key, val) {
        T[key] = T.event[key] = function(element, type, listener) {
            type = type.replace('on', '');
            return $(_g(element))[val](type, listener);
        };
    });

    T.event.once = function(element, type, listener){
        element = _g(element);
        function onceListener(event){
            listener.call(element,event);
            baidu.event.un(element, type, onceListener);
        } 

        baidu.event.on(element, type, onceListener);
        return element;
    };


    var eventArg = T.EventArg = T.event.EventArg = T.event.get = function(event){
        var result = $.event.fix(event);
        result._event = event;
        result.stop = function(){
            result.stopPropagation()
            result.preventDefault();
        };
        result._event = event;
        return result;
    };

    /*
        TODO 考虑是否保留getEvent这个函数到其他文件
    */

    T.event.getEvent = function(event) {
        if (window.event) {
            return window.event;
        } else {
            var f = arguments.callee;
            do { //此处参考Qwrap框架 see http://www.qwrap.com/ by dengping
                if (/Event/.test(f.arguments[0])) {
                    return f.arguments[0];
                }
            } while (f = f.caller);
            return null;
        }
    };

    $.each({
        'KeyCode': 'keyCode',
        'PageX': 'pageX',
        'PageY': 'pageY',
        'Target': 'target'
    }, function(key, val){
        T.event['get' + key] = function(event){
            return eventArg(event)[val];
        };
    });

    T.async = {};

    /*
        TODO T.async 方法与jquery不一致，jquery中没有cancel的方法，也很难模拟，待定。。
    */

    T.async.Deferred = $.Deferred;

    /**
     * NOTE jquery的proxy与Tangram bind有些区别,Tangram 执行运行时this，如果不传入则运行时this为函数本身
     */
    T.fn = {};

    T.fn.bind = baidu.fn.bind = function(func, scope) {
        var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : null;
        return function () {
            var fn = baidu.lang.isString(func) ? scope[func] : func,
                args = (xargs) ? xargs.concat([].slice.call(arguments, 0)) : arguments;
            return fn.apply(scope || fn, args);
        };
    };

    T.fn.blank = noop;

    /**
     * form
     */
    T.form = {};

    var escapeSymbol = function(source) {
        return String(source).replace(/[#%&+=\/\\\ \　\f\r\n\t]/g, function(all) {
            return '%' + (0x100 + all.charCodeAt()).toString(16).substring(1).toUpperCase();
        });
    };

    T.form.serialize = function(form, replacer){
        var serialize = $(_g(form)).serializeArray();

        serialize = $.map(serialize, function(n, i){
            var item = [n.name,escapeSymbol(n.value)];

            if($.isFunction(replacer)) {
                item[1] = replacer(item[1], item[0]);
            }

            return item.join('=');
        });
        return serialize;
    };

    T.form.json = function(form, replacer){
        var serialize = $(_g(form)).serializeArray(),
            result = {};

        $.each(serialize, function(n, item){
            var name = item.name,
                value = escapeSymbol(item.value),
                oldValue;

            if(result.hasOwnProperty(name)) {
                if(!$.isArray(result[name])) {
                    oldValue = result[name];
                    result[name] = [];
                    result[name].push(oldValue);
                }
                result[name].push(value);            
            } else {
                result[name] = value;
            }

            if($.isFunction(replacer)) {
                result[name] = replacer(value, name);
            }

        });
        return result;
    };

    T.array = require('./array.js');
    T.each = T.array.each;

    T.browser = require('./browser.js');
    T.ie = T.browser.ie;

    T.cookie = require('./cookie.js');

    T.date = require('./date.js');


    win.baidu = T;
});
