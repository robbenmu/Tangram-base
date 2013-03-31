// Copyright (c) 2009, Baidu Inc. All rights reserved.
// 
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http:// tangram.baidu.com/license.html
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
 /**
 * @namespace T Tangram七巧板
 * @name T
 * @version 1.5.2.2
*/

/**
 * 声明baidu包
 * @author: allstar, erik, meizz, berg
 */
var T,
    baidu = T = baidu || {version: "1.5.2.2"}; 

//提出guid，防止在与老版本Tangram混用时
//在下一行错误的修改window[undefined]
baidu.guid = "$BAIDU$";

//Tangram可能被放在闭包中
//一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
baidu.$$ = window[baidu.guid] = window[baidu.guid] || {global:{}};

/**
 * 操作url的方法
 * @namespace baidu.url
 */
baidu.url = baidu.url || {};


/**
 * 对字符串进行%#&+=以及和\s匹配的所有字符进行url转义
 * @name baidu.url.escapeSymbol
 * @function
 * @grammar baidu.url.escapeSymbol(source)
 * @param {string} source 需要转义的字符串.
 * @return {string} 转义之后的字符串.
 * @remark
 * 用于get请求转义。在服务器只接受gbk，并且页面是gbk编码时，可以经过本转义后直接发get请求。
 *
 * @return {string} 转义后的字符串
 */
baidu.url.escapeSymbol = function(source) {
    
    //TODO: 之前使用\s来匹配任意空白符
    //发现在ie下无法匹配中文全角空格和纵向指标符\v，所以改\s为\f\r\n\t\v以及中文全角空格和英文空格
    //但是由于ie本身不支持纵向指标符\v,故去掉对其的匹配，保证各浏览器下效果一致
    return String(source).replace(/[#%&+=\/\\\ \　\f\r\n\t]/g, function(all) {
        return '%' + (0x100 + all.charCodeAt()).toString(16).substring(1).toUpperCase();
    });
};

/**
 * 操作字符串的方法
 * @namespace baidu.string
 */
baidu.string = baidu.string || {};


/**
 * 将目标字符串中可能会影响正则表达式构造的字符串进行转义。
 * @name baidu.string.escapeReg
 * @function
 * @grammar baidu.string.escapeReg(source)
 * @param {string} source 目标字符串
 * @remark
 * 给以下字符前加上“\”进行转义：.*+?^=!:${}()|[]/\
 * @meta standard
 *             
 * @returns {string} 转义后的字符串
 */
baidu.string.escapeReg = function (source) {
    return String(source)
            .replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241');
};


/**
 * 根据参数名从目标URL中获取参数值
 * @name baidu.url.getQueryValue
 * @function
 * @grammar baidu.url.getQueryValue(url, key)
 * @param {string} url 目标URL
 * @param {string} key 要获取的参数名
 * @meta standard
 * @see baidu.url.jsonToQuery
 *             
 * @returns {string|null} - 获取的参数值，其中URI编码后的字符不会被解码，获取不到时返回null
 */
baidu.url.getQueryValue = function (url, key) {
    var reg = new RegExp(
                        "(^|&|\\?|#)" 
                        + baidu.string.escapeReg(key) 
                        + "=([^&#]*)(&|\x24|#)", 
                    "");
    var match = url.match(reg);
    if (match) {
        return match[2];
    }
    
    return null;
};

/**
 * 操作原生对象的方法
 * @namespace baidu.object
 */
baidu.object = baidu.object || {};


/**
 * 遍历Object中所有元素，1.1.1增加
 * @name baidu.object.each
 * @function
 * @grammar baidu.object.each(source, iterator)
 * @param {Object} source 需要遍历的Object
 * @param {Function} iterator 对每个Object元素进行调用的函数，function (item, key)
 * @version 1.1.1
 *             
 * @returns {Object} 遍历的Object
 */
baidu.object.each = function (source, iterator) {
    var returnValue, key, item; 
    if ('function' == typeof iterator) {
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                item = source[key];
                returnValue = iterator.call(source, item, key);
        
                if (returnValue === false) {
                    break;
                }
            }
        }
    }
    return source;
};

/**
 * 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
 * @namespace baidu.lang
 */
baidu.lang = baidu.lang || {};


/**
 * 判断目标参数是否Array对象
 * @name baidu.lang.isArray
 * @function
 * @grammar baidu.lang.isArray(source)
 * @param {Any} source 目标参数
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};


/**
 * 将json对象解析成query字符串
 * @name baidu.url.jsonToQuery
 * @function
 * @grammar baidu.url.jsonToQuery(json[, replacer])
 * @param {Object} json 需要解析的json对象
 * @param {Function=} replacer_opt 对值进行特殊处理的函数，function (value, key)
 * @see baidu.url.queryToJson,baidu.url.getQueryValue
 *             
 * @return {string} - 解析结果字符串，其中值将被URI编码，{a:'&1 '} ==> "a=%261%20"。
 */
baidu.url.jsonToQuery = function (json, replacer_opt) {
    var result = [], 
        itemLen,
        replacer = replacer_opt || function (value) {
          return baidu.url.escapeSymbol(value);
        };
        
    baidu.object.each(json, function(item, key){
        // 这里只考虑item为数组、字符串、数字类型，不考虑嵌套的object
        if (baidu.lang.isArray(item)) {
            itemLen = item.length;
            // value的值需要encodeURIComponent转义吗？
            // FIXED 优化了escapeSymbol函数
            while (itemLen--) {
                result.push(key + '=' + replacer(item[itemLen], key));
            }
        } else {
            result.push(key + '=' + replacer(item, key));
        }
    });
    
    return result.join('&');
};

/**
 * 解析目标URL中的参数成json对象
 * @name baidu.url.queryToJson
 * @function
 * @grammar baidu.url.queryToJson(url)
 * @param {string} url 目标URL
 * @see baidu.url.jsonToQuery
 *             
 * @returns {Object} - 解析为结果对象，其中URI编码后的字符不会被解码，'a=%20' ==> {a:'%20'}。
 */
baidu.url.queryToJson = function (url) {
    var query   = url.substr(url.lastIndexOf('?') + 1),
        params  = query.split('&'),
        len     = params.length,
        result  = {},
        i       = 0,
        key, value, item, param;
    
    for (; i < len; i++) {
        if(!params[i]){
            continue;
        }
        param   = params[i].split('=');
        key     = param[0];
        value   = param[1];
        
        item = result[key];
        if ('undefined' == typeof item) {
            result[key] = value;
        } else if (baidu.lang.isArray(item)) {
            item.push(value);
        } else { // 这里只可能是string了
            result[key] = [item, value];
        }
    }
    
    return result;
};
