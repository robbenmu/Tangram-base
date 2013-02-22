baidu.lang = {};
baidu.lang.isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};