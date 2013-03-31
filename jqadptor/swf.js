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
 * 操作flash对象的方法，包括创建flash对象、获取flash对象以及判断flash插件的版本号
 * @namespace baidu.swf
 */
baidu.swf = baidu.swf || {};

/**
 * 判断浏览器类型和特性的属性
 * @namespace baidu.browser
 */
baidu.browser = baidu.browser || {};


//IE 8下，以documentMode为准
//在百度模板中，可能会有$，防止冲突，将$1 写成 \x241
/**
 * 判断是否为ie浏览器
 * @name baidu.browser.ie
 * @field
 * @grammar baidu.browser.ie
 * @returns {Number} IE版本号
 */
baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;

/**
 * 操作数组的方法
 * @namespace baidu.array
 */

baidu.array = baidu.array || {};


/**
 * 移除数组中的项
 * @name baidu.array.remove
 * @function
 * @grammar baidu.array.remove(source, match)
 * @param {Array} source 需要移除项的数组
 * @param {Any} match 要移除的项
 * @meta standard
 * @see baidu.array.removeAt
 *             
 * @returns {Array} 移除后的数组
 */
baidu.array.remove = function (source, match) {
    var len = source.length;
        
    while (len--) {
        if (len in source && source[len] === match) {
            source.splice(len, 1);
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
 * 判断目标参数是否为function或Function实例
 * @name baidu.lang.isFunction
 * @function
 * @grammar baidu.lang.isFunction(source)
 * @param {Any} source 目标参数
 * @version 1.2
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 * @meta standard
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isFunction = function (source) {
    // chrome下,'function' == typeof /a/ 为true.
    return '[object Function]' == Object.prototype.toString.call(source);
};


/**
 * 将一个变量转换成array
 * @name baidu.lang.toArray
 * @function
 * @grammar baidu.lang.toArray(source)
 * @param {mix} source 需要转换成array的变量
 * @version 1.3
 * @meta standard
 * @returns {array} 转换后的array
 */
baidu.lang.toArray = function (source) {
    if (source === null || source === undefined)
        return [];
    if (baidu.lang.isArray(source))
        return source;

    // The strings and functions also have 'length'
    if (typeof source.length !== 'number' || typeof source === 'string' || baidu.lang.isFunction(source)) {
        return [source];
    }

    //nodeList, IE 下调用 [].slice.call(nodeList) 会报错
    if (source.item) {
        var l = source.length, array = new Array(l);
        while (l--)
            array[l] = source[l];
        return array;
    }

    return [].slice.call(source);
};

/**
 * 获得flash对象的实例
 * @name baidu.swf.getMovie
 * @function
 * @grammar baidu.swf.getMovie(name)
 * @param {string} name flash对象的名称
 * @see baidu.swf.create
 * @meta standard
 * @returns {HTMLElement} flash对象的实例
 */
baidu.swf.getMovie = function (name) {
	//ie9下, Object标签和embed标签嵌套的方式生成flash时,
	//会导致document[name]多返回一个Object元素,而起作用的只有embed标签
	var movie = document[name], ret;
    return baidu.browser.ie == 9 ?
    	movie && movie.length ? 
    		(ret = baidu.array.remove(baidu.lang.toArray(movie),function(item){
    			return item.tagName.toLowerCase() != "embed";
    		})).length == 1 ? ret[0] : ret
    		: movie
    	: movie || window[name];
};

/**
 * 返回一个当前页面的唯一标识字符串。
 * @name baidu.lang.guid
 * @function
 * @grammar baidu.lang.guid()
 * @version 1.1.1
 * @meta standard
 *             
 * @returns {String} 当前页面的唯一标识字符串
 */
baidu.lang.guid = function() {
    return "TANGRAM$" + baidu.$$._counter ++;
};

//不直接使用window，可以提高3倍左右性能
baidu.$$._counter = baidu.$$._counter || 1;


// 20111129	meizz	去除 _counter.toString(36) 这步运算，节约计算量

/**
 * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
 * @class
 * @name 	baidu.lang.Class
 * @grammar baidu.lang.Class(guid)
 * @param 	{string}	guid	对象的唯一标识
 * @meta standard
 * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
 * @meta standard
 * @see baidu.lang.inherits,baidu.lang.Event
 */
baidu.lang.Class = function() {
    this.guid = baidu.lang.guid();

    !this.__decontrolled && (baidu.$$._instances[this.guid] = this);
};

baidu.$$._instances = baidu.$$._instances || {};

/**
 * 释放对象所持有的资源，主要是自定义事件。
 * @name dispose
 * @grammar obj.dispose()
 * TODO: 将_listeners中绑定的事件剔除掉
 */
baidu.lang.Class.prototype.dispose = function(){
    delete baidu.$$._instances[this.guid];

    // this.__listeners && (for (var i in this.__listeners) delete this.__listeners[i]);

    for(var property in this){
        typeof this[property] != "function" && delete this[property];
    }
    this.disposed = true;   // 20100716
};

/**
 * 重载了默认的toString方法，使得返回信息更加准确一些。
 * 20111219 meizz 为支持老版本的className属性，以后统一改成 __type
 * @return {string} 对象的String表示形式
 */
baidu.lang.Class.prototype.toString = function(){
    return "[object " + (this.__type || this._className || "Object") + "]";
};

/**
 * 按唯一标识guid字符串取得实例对象
 *
 * @param   {String}    guid
 * @return  {object}            实例对象
 */
 window["baiduInstance"] = function(guid) {
     return baidu.$$._instances[guid];
 }

//  2011.11.23  meizz   添加 baiduInstance 这个全局方法，可以快速地通过guid得到实例对象
//  2011.11.22  meizz   废除创建类时指定guid的模式，guid只作为只读属性
//  2011.11.22  meizz   废除 baidu.lang._instances 模块，由统一的global机制完成；

/**
 * 判断目标参数是否string类型或String对象
 * @name baidu.lang.isString
 * @function
 * @grammar baidu.lang.isString(source)
 * @param {Any} source 目标参数
 * @shortcut isString
 * @meta standard
 * @see baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};

// 声明快捷方法
baidu.isString = baidu.lang.isString;


/**
 * 自定义的事件对象。
 * @class
 * @name 	baidu.lang.Event
 * @grammar baidu.lang.Event(type[, target])
 * @param 	{string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
 * @param 	{Object} [target]触发事件的对象
 * @meta standard
 * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
 * @meta standard
 * @see baidu.lang.Class
 */
baidu.lang.Event = function (type, target) {
    this.type = type;
    this.returnValue = true;
    this.target = target || null;
    this.currentTarget = null;
};
 
/**
 * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.dispatchEvent(event, options)
 * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
 * @param {Object} 					options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
 * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。例如：<br>
myobj.onMyEvent = function(){}<br>
myobj.addEventListener("onMyEvent", function(){});
 */
baidu.lang.Class.prototype.fire =
baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
    baidu.lang.isString(event) && (event = new baidu.lang.Event(event));

    !this.__listeners && (this.__listeners = {});

    // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
    options = options || {};
    for (var i in options) {
        event[i] = options[i];
    }

    var i, n, me = this, t = me.__listeners, p = event.type;
    event.target = event.target || (event.currentTarget = me);

    // 支持非 on 开头的事件名
    p.indexOf("on") && (p = "on" + p);

    typeof me[p] == "function" && me[p].apply(me, arguments);

    if (typeof t[p] == "object") {
        for (i=0, n=t[p].length; i<n; i++) {
            t[p][i] && t[p][i].apply(me, arguments);
        }
    }
    return event.returnValue;
};

/**
 * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.addEventListener(type, handler[, key])
 * @param   {string}   type         自定义事件的名称
 * @param   {Function} handler      自定义事件被触发时应该调用的回调函数
 * @return  {Function}              将用户注入的监听函数返回，以便移除事件监听，特别适用于匿名函数。
 * @remark  事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
 */
baidu.lang.Class.prototype.on =
baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
    if (typeof handler != "function") {
        return;
    }

    !this.__listeners && (this.__listeners = {});

    var i, t = this.__listeners;

    type.indexOf("on") && (type = "on" + type);

    typeof t[type] != "object" && (t[type] = []);

    // 避免函数重复注册
    for (i = t[type].length - 1; i >= 0; i--) {
        if (t[type][i] === handler) return handler;
    };

    t[type].push(handler);

    // [TODO delete 2013] 2011.12.19 兼容老版本，2013删除此行
    key && typeof key == "string" && (t[type][key] = handler);

    return handler;
};

//  2011.12.19  meizz   很悲剧，第三个参数 key 还需要支持一段时间，以兼容老版本脚本
//  2011.11.24  meizz   事件添加监听方法 addEventListener 移除第三个参数 key，添加返回值 handler
//  2011.11.23  meizz   事件handler的存储对象由json改成array，以保证注册函数的执行顺序
//  2011.11.22  meizz   将 removeEventListener 方法分拆到 baidu.lang.Class.removeEventListener 中，以节约主程序代码

/**
 * 创建一个类，包括创造类的构造器、继承基类Class
 * @name baidu.lang.createClass
 * @function
 * @grammar baidu.lang.createClass(constructor[, options])
 * @param {Function} constructor 类的构造器函数
 * @param {Object} [options] 
                
 * @config {string} [type] 类名
 * @config {Function} [superClass] 父类，默认为baidu.lang.Class
 * @version 1.2
 * @remark
 * 
            使用createClass能方便的创建一个带有继承关系的类。同时会为返回的类对象添加extend方法，使用obj.extend({});可以方便的扩展原型链上的方法和属性
        
 * @see baidu.lang.Class,baidu.lang.inherits
 *             
 * @returns {Object} 一个类对象
 */

baidu.lang.createClass = /**@function*/function(constructor, options) {
    options = options || {};
    var superClass = options.superClass || baidu.lang.Class;

    // 创建新类的真构造器函数
    var fn = function(){
        var me = this;

        // 20101030 某类在添加该属性控制时，guid将不在全局instances里控制
        options.decontrolled && (me.__decontrolled = true);

        // 继承父类的构造器
        superClass.apply(me, arguments);

        // 全局配置
        for (i in fn.options) me[i] = fn.options[i];

        constructor.apply(me, arguments);

        for (var i=0, reg=fn["\x06r"]; reg && i<reg.length; i++) {
            reg[i].apply(me, arguments);
        }
    };

    // [TODO delete 2013] 放置全局配置，这个全局配置可以直接写到类里面
    fn.options = options.options || {};

    var C = function(){},
        cp = constructor.prototype;
    C.prototype = superClass.prototype;

    // 继承父类的原型（prototype)链
    var fp = fn.prototype = new C();

    // 继承传参进来的构造器的 prototype 不会丢
    for (var i in cp) fp[i] = cp[i];

    // 20111122 原className参数改名为type
    var type = options.className || options.type;
    typeof type == "string" && (fp.__type = type);

    // 修正这种继承方式带来的 constructor 混乱的问题
    fp.constructor = cp.constructor;

    // 给类扩展出一个静态方法，以代替 baidu.object.extend()
    fn.extend = function(json){
        for (var i in json) {
            fn.prototype[i] = json[i];
        }
        return fn;  // 这个静态方法也返回类对象本身
    };

    return fn;
};

// 20111221 meizz   修改插件函数的存放地，重新放回类构造器静态属性上


/**
 * Js 调用 Flash方法的代理类.
 * @function
 * @name baidu.swf.Proxy
 * @grammar new baidu.swf.Proxy(id, property, [, loadedHandler])
 * @param {string} id Flash的元素id.object标签id, embed标签name.
 * @param {string} property Flash的方法或者属性名称，用来检测Flash是否初始化好了.
 * @param {Function} loadedHandler 初始化之后的回调函数.
 * @remark Flash对应的DOM元素必须已经存在, 否则抛错. 可以使用baidu.swf.create预先创建Flash对应的DOM元素.
 * @author liyubei@baidu.com (leeight)
 */
baidu.swf.Proxy = function(id, property, loadedHandler) {
    /**
     * 页面上的Flash对象
     * @type {HTMLElement}
     */
    var me = this,
        flash = this._flash = baidu.swf.getMovie(id),
        timer;
    if (! property) {
        return this;
    }
    timer = setInterval(function() {
        try {
            /** @preserveTry */
            if (flash[property]) {
                me._initialized = true;
                clearInterval(timer);
                if (loadedHandler) {
                    loadedHandler();
                }
            }
        } catch (e) {
        }
    }, 100);
};
/**
 * 获取flash对象.
 * @return {HTMLElement} Flash对象.
 */
baidu.swf.Proxy.prototype.getFlash = function() {
    return this._flash;
};
/**
 * 判断Flash是否初始化完成,可以与js进行交互.
 */
baidu.swf.Proxy.prototype.isReady = function() {
    return !! this._initialized;
};
/**
 * 调用Flash中的某个方法
 * @param {string} methodName 方法名.
 * @param {...*} var_args 方法的参数.
 */
baidu.swf.Proxy.prototype.call = function(methodName, var_args) {
    try {
        var flash = this.getFlash(),
            args = Array.prototype.slice.call(arguments);

        args.shift();
        if (flash[methodName]) {
            flash[methodName].apply(flash, args);
        }
    } catch (e) {
    }
};

/**
 * 操作dom的方法
 * @namespace baidu.dom 
 */
baidu.dom = baidu.dom || {};


/**
 * 从文档中获取指定的DOM元素
 * @name baidu.dom.g
 * @function
 * @grammar baidu.dom.g(id)
 * @param {string|HTMLElement} id 元素的id或DOM元素.
 * @shortcut g,T.G
 * @meta standard
 * @see baidu.dom.q
 *
 * @return {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数.
 */
baidu.dom.g = function(id) {
    if (!id) return null; //修改IE下baidu.dom.g(baidu.dom.g('dose_not_exist_id'))报错的bug，by Meizz, dengping
    if ('string' == typeof id || id instanceof String) {
        return document.getElementById(id);
    } else if (id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
        return id;
    }
    return null;
};

// 声明快捷方法
baidu.g = baidu.G = baidu.dom.g;

/**
 * 判断是否为opera浏览器
 * @property opera opera版本号
 * @grammar baidu.browser.opera
 * @meta standard
 * @see baidu.browser.ie,baidu.browser.firefox,baidu.browser.safari,baidu.browser.chrome
 * @returns {Number} opera版本号
 */

/**
 * opera 从10开始不是用opera后面的字符串进行版本的判断
 * 在Browser identification最后添加Version + 数字进行版本标识
 * opera后面的数字保持在9.80不变
 */
baidu.browser.opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined;


/**
 * 在目标元素的指定位置插入HTML代码
 * @name baidu.dom.insertHTML
 * @function
 * @grammar baidu.dom.insertHTML(element, position, html)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} position 插入html的位置信息，取值为beforeBegin,afterBegin,beforeEnd,afterEnd
 * @param {string} html 要插入的html
 * @remark
 * 
 * 对于position参数，大小写不敏感<br>
 * 参数的意思：beforeBegin&lt;span&gt;afterBegin   this is span! beforeEnd&lt;/span&gt; afterEnd <br />
 * 此外，如果使用本函数插入带有script标签的HTML字符串，script标签对应的脚本将不会被执行。
 * 
 * @shortcut insertHTML
 * @meta standard
 *             
 * @returns {HTMLElement} 目标元素
 */
baidu.dom.insertHTML = function (element, position, html) {
    element = baidu.dom.g(element);
    var range,begin;

    //在opera中insertAdjacentHTML方法实现不标准，如果DOMNodeInserted方法被监听则无法一次插入多element
    //by lixiaopeng @ 2011-8-19
    if (element.insertAdjacentHTML && !baidu.browser.opera) {
        element.insertAdjacentHTML(position, html);
    } else {
        // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
        // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
        range = element.ownerDocument.createRange();
        // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
        // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
        position = position.toUpperCase();
        if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
            range.selectNodeContents(element);
            range.collapse(position == 'AFTERBEGIN');
        } else {
            begin = position == 'BEFOREBEGIN';
            range[begin ? 'setStartBefore' : 'setEndAfter'](element);
            range.collapse(begin);
        }
        range.insertNode(range.createContextualFragment(html));
    }
    return element;
};

baidu.insertHTML = baidu.dom.insertHTML;

/**
 * 浏览器支持的flash插件版本
 * @property version 浏览器支持的flash插件版本
 * @grammar baidu.swf.version
 * @return {String} 版本号
 * @meta standard
 */
baidu.swf.version = (function () {
    var n = navigator;
    if (n.plugins && n.mimeTypes.length) {
        var plugin = n.plugins["Shockwave Flash"];
        if (plugin && plugin.description) {
            return plugin.description
                    .replace(/([a-zA-Z]|\s)+/, "")
                    .replace(/(\s)+r/, ".") + ".0";
        }
    } else if (window.ActiveXObject && !window.opera) {
        for (var i = 12; i >= 2; i--) {
            try {
                var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
                if (c) {
                    var version = c.GetVariable("$version");
                    return version.replace(/WIN/g,'').replace(/,/g,'.');
                }
            } catch(e) {}
        }
    }
})();

/**
 * 操作字符串的方法
 * @namespace baidu.string
 */
baidu.string = baidu.string || {};


/**
 * 对目标字符串进行html编码
 * @name baidu.string.encodeHTML
 * @function
 * @grammar baidu.string.encodeHTML(source)
 * @param {string} source 目标字符串
 * @remark
 * 编码字符有5个：&<>"'
 * @shortcut encodeHTML
 * @meta standard
 * @see baidu.string.decodeHTML
 *             
 * @returns {string} html编码后的字符串
 */
baidu.string.encodeHTML = function (source) {
    return String(source)
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
};

baidu.encodeHTML = baidu.string.encodeHTML;

/**
 * 创建flash对象的html字符串
 * @name baidu.swf.createHTML
 * @function
 * @grammar baidu.swf.createHTML(options)
 * 
 * @param {Object} 	options 					创建flash的选项参数
 * @param {string} 	options.id 					要创建的flash的标识
 * @param {string} 	options.url 				flash文件的url
 * @param {String} 	options.errorMessage 		未安装flash player或flash player版本号过低时的提示
 * @param {string} 	options.ver 				最低需要的flash player版本号
 * @param {string} 	options.width 				flash的宽度
 * @param {string} 	options.height 				flash的高度
 * @param {string} 	options.align 				flash的对齐方式，允许值：middle/left/right/top/bottom
 * @param {string} 	options.base 				设置用于解析swf文件中的所有相对路径语句的基本目录或URL
 * @param {string} 	options.bgcolor 			swf文件的背景色
 * @param {string} 	options.salign 				设置缩放的swf文件在由width和height设置定义的区域内的位置。允许值：l/r/t/b/tl/tr/bl/br
 * @param {boolean} options.menu 				是否显示右键菜单，允许值：true/false
 * @param {boolean} options.loop 				播放到最后一帧时是否重新播放，允许值： true/false
 * @param {boolean} options.play 				flash是否在浏览器加载时就开始播放。允许值：true/false
 * @param {string} 	options.quality 			设置flash播放的画质，允许值：low/medium/high/autolow/autohigh/best
 * @param {string} 	options.scale 				设置flash内容如何缩放来适应设置的宽高。允许值：showall/noborder/exactfit
 * @param {string} 	options.wmode 				设置flash的显示模式。允许值：window/opaque/transparent
 * @param {string} 	options.allowscriptaccess 	设置flash与页面的通信权限。允许值：always/never/sameDomain
 * @param {string} 	options.allownetworking 	设置swf文件中允许使用的网络API。允许值：all/internal/none
 * @param {boolean} options.allowfullscreen 	是否允许flash全屏。允许值：true/false
 * @param {boolean} options.seamlesstabbing 	允许设置执行无缝跳格，从而使用户能跳出flash应用程序。该参数只能在安装Flash7及更高版本的Windows中使用。允许值：true/false
 * @param {boolean} options.devicefont 			设置静态文本对象是否以设备字体呈现。允许值：true/false
 * @param {boolean} options.swliveconnect 		第一次加载flash时浏览器是否应启动Java。允许值：true/false
 * @param {Object} 	options.vars 				要传递给flash的参数，支持JSON或string类型。
 * 
 * @see baidu.swf.create
 * @meta standard
 * @returns {string} flash对象的html字符串
 */
baidu.swf.createHTML = function (options) {
    options = options || {};
    var version = baidu.swf.version, 
        needVersion = options['ver'] || '6.0.0', 
        vUnit1, vUnit2, i, k, len, item, tmpOpt = {},
        encodeHTML = baidu.string.encodeHTML;
    
    // 复制options，避免修改原对象
    for (k in options) {
        tmpOpt[k] = options[k];
    }
    options = tmpOpt;
    
    // 浏览器支持的flash插件版本判断
    if (version) {
        version = version.split('.');
        needVersion = needVersion.split('.');
        for (i = 0; i < 3; i++) {
            vUnit1 = parseInt(version[i], 10);
            vUnit2 = parseInt(needVersion[i], 10);
            if (vUnit2 < vUnit1) {
                break;
            } else if (vUnit2 > vUnit1) {
                return ''; // 需要更高的版本号
            }
        }
    } else {
        return ''; // 未安装flash插件
    }
    
    var vars = options['vars'],
        objProperties = ['classid', 'codebase', 'id', 'width', 'height', 'align'];
    
    // 初始化object标签需要的classid、codebase属性值
    options['align'] = options['align'] || 'middle';
    options['classid'] = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
    options['codebase'] = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0';
    options['movie'] = options['url'] || '';
    delete options['vars'];
    delete options['url'];
    
    // 初始化flashvars参数的值
    if ('string' == typeof vars) {
        options['flashvars'] = vars;
    } else {
        var fvars = [];
        for (k in vars) {
            item = vars[k];
            fvars.push(k + "=" + encodeURIComponent(item));
        }
        options['flashvars'] = fvars.join('&');
    }
    
    // 构建IE下支持的object字符串，包括属性和参数列表
    var str = ['<object '];
    for (i = 0, len = objProperties.length; i < len; i++) {
        item = objProperties[i];
        str.push(' ', item, '="', encodeHTML(options[item]), '"');
    }
    str.push('>');
    var params = {
        'wmode'             : 1,
        'scale'             : 1,
        'quality'           : 1,
        'play'              : 1,
        'loop'              : 1,
        'menu'              : 1,
        'salign'            : 1,
        'bgcolor'           : 1,
        'base'              : 1,
        'allowscriptaccess' : 1,
        'allownetworking'   : 1,
        'allowfullscreen'   : 1,
        'seamlesstabbing'   : 1,
        'devicefont'        : 1,
        'swliveconnect'     : 1,
        'flashvars'         : 1,
        'movie'             : 1
    };
    
    for (k in options) {
        item = options[k];
        k = k.toLowerCase();
        if (params[k] && (item || item === false || item === 0)) {
            str.push('<param name="' + k + '" value="' + encodeHTML(item) + '" />');
        }
    }
    
    // 使用embed时，flash地址的属性名是src，并且要指定embed的type和pluginspage属性
    options['src']  = options['movie'];
    options['name'] = options['id'];
    delete options['id'];
    delete options['movie'];
    delete options['classid'];
    delete options['codebase'];
    options['type'] = 'application/x-shockwave-flash';
    options['pluginspage'] = 'http://www.macromedia.com/go/getflashplayer';
    
    
    // 构建embed标签的字符串
    str.push('<embed');
    // 在firefox、opera、safari下，salign属性必须在scale属性之后，否则会失效
    // 经过讨论，决定采用BT方法，把scale属性的值先保存下来，最后输出
    var salign;
    for (k in options) {
        item = options[k];
        if (item || item === false || item === 0) {
            if ((new RegExp("^salign\x24", "i")).test(k)) {
                salign = item;
                continue;
            }
            
            str.push(' ', k, '="', encodeHTML(item), '"');
        }
    }
    
    if (salign) {
        str.push(' salign="', encodeHTML(salign), '"');
    }
    str.push('></embed></object>');
    
    return str.join('');
};


/**
 * 在页面中创建一个flash对象
 * @name baidu.swf.create
 * @function
 * @grammar baidu.swf.create(options[, container])
 * 
 * @param {Object} 	options 					创建flash的选项参数
 * @param {string} 	options.id 					要创建的flash的标识
 * @param {string} 	options.url 				flash文件的url
 * @param {String} 	options.errorMessage 		未安装flash player或flash player版本号过低时的提示
 * @param {string} 	options.ver 				最低需要的flash player版本号
 * @param {string} 	options.width 				flash的宽度
 * @param {string} 	options.height 				flash的高度
 * @param {string} 	options.align 				flash的对齐方式，允许值：middle/left/right/top/bottom
 * @param {string} 	options.base 				设置用于解析swf文件中的所有相对路径语句的基本目录或URL
 * @param {string} 	options.bgcolor 			swf文件的背景色
 * @param {string} 	options.salign 				设置缩放的swf文件在由width和height设置定义的区域内的位置。允许值：l/r/t/b/tl/tr/bl/br
 * @param {boolean} options.menu 				是否显示右键菜单，允许值：true/false
 * @param {boolean} options.loop 				播放到最后一帧时是否重新播放，允许值： true/false
 * @param {boolean} options.play 				flash是否在浏览器加载时就开始播放。允许值：true/false
 * @param {string} 	options.quality 			设置flash播放的画质，允许值：low/medium/high/autolow/autohigh/best
 * @param {string} 	options.scale 				设置flash内容如何缩放来适应设置的宽高。允许值：showall/noborder/exactfit
 * @param {string} 	options.wmode 				设置flash的显示模式。允许值：window/opaque/transparent
 * @param {string} 	options.allowscriptaccess 	设置flash与页面的通信权限。允许值：always/never/sameDomain
 * @param {string} 	options.allownetworking 	设置swf文件中允许使用的网络API。允许值：all/internal/none
 * @param {boolean} options.allowfullscreen 	是否允许flash全屏。允许值：true/false
 * @param {boolean} options.seamlesstabbing 	允许设置执行无缝跳格，从而使用户能跳出flash应用程序。该参数只能在安装Flash7及更高版本的Windows中使用。允许值：true/false
 * @param {boolean} options.devicefont 			设置静态文本对象是否以设备字体呈现。允许值：true/false
 * @param {boolean} options.swliveconnect 		第一次加载flash时浏览器是否应启动Java。允许值：true/false
 * @param {Object} 	options.vars 				要传递给flash的参数，支持JSON或string类型。
 * 
 * @param {HTMLElement|string} [container] 		flash对象的父容器元素，不传递该参数时在当前代码位置创建flash对象。
 * @meta standard
 * @see baidu.swf.createHTML,baidu.swf.getMovie
 */
baidu.swf.create = function (options, target) {
    options = options || {};
    var html = baidu.swf.createHTML(options) 
               || options['errorMessage'] 
               || '';
                
    if (target && 'string' == typeof target) {
        target = document.getElementById(target);
    }
    baidu.dom.insertHTML( target || document.body ,'beforeEnd',html );
};
