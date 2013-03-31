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

baidu.page = baidu.page || {};


/**
 * 获取页面高度
 * @name baidu.page.getHeight
 * @function
 * @grammar baidu.page.getHeight()
 * @see baidu.page.getWidth
 *             
 * @returns {number} 页面高度
 */
baidu.page.getHeight = function () {
    var doc = document,
        body = doc.body,
        html = doc.documentElement,
        client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;

    return Math.max(html.scrollHeight, body.scrollHeight, client.clientHeight);
};

/**
 * 获取纵向滚动量
 * @name baidu.page.getScrollTop
 * @function
 * @grammar baidu.page.getScrollTop()
 * @see baidu.page.getScrollLeft
 * @meta standard
 * @returns {number} 纵向滚动量
 */
baidu.page.getScrollTop = function () {
    var d = document;
    return window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop;
};

/**
 * 获取横向滚动量
 * @name baidu.page.getScrollLeft
 * @function
 * @grammar baidu.page.getScrollLeft()
 * @see baidu.page.getScrollTop
 *             
 * @returns {number} 横向滚动量
 */
/**
 * 获取横向滚动量
 * 
 * @return {number} 横向滚动量
 */
baidu.page.getScrollLeft = function () {
    var d = document;
    return window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft;
};

/**
 * 取得当前页面里的目前鼠标所在的坐标（x y）
 *
 * @return  {JSON}  当前鼠标的坐标值({x, y})
 */
(function(){

     baidu.page.getMousePosition = function(){
     return {
            x : baidu.page.getScrollLeft() + xy.x,
            y : baidu.page.getScrollTop() + xy.y
        };
    };

    var xy = {x:0, y:0};
    // 监听当前网页的 mousemove 事件以获得鼠标的实时坐标
    $(document).bind('mousemove', function(e){
        xy.x = e.clientX;
        xy.y = e.clientY;
    });
})();



/**
 * 获取页面视觉区域高度
 * @name baidu.page.getViewHeight
 * @function
 * @grammar baidu.page.getViewHeight()
 * @see baidu.page.getViewWidth
 * @meta standard
 * @returns {number} 页面视觉区域高度
 */
baidu.page.getViewHeight = function () {
    var doc = document,
        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

    return client.clientHeight;
};

/**
 * 获取页面视觉区域宽度
 * @name baidu.page.getViewWidth
 * @function
 * @grammar baidu.page.getViewWidth()
 * @see baidu.page.getViewHeight
 *             
 * @returns {number} 页面视觉区域宽度
 */
baidu.page.getViewWidth = function () {
    var doc = document,
        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

    return client.clientWidth;
};

/**
 * 获取页面宽度
 * @name baidu.page.getWidth
 * @function
 * @grammar baidu.page.getWidth()
 * @see baidu.page.getHeight
 * @meta standard
 * @returns {number} 页面宽度
 */
baidu.page.getWidth = function () {
    var doc = document,
        body = doc.body,
        html = doc.documentElement,
        client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;

    return Math.max(html.scrollWidth, body.scrollWidth, client.clientWidth);
};

baidu.page.load = {};

//默认编码设置为UTF8
baidu.page.load.charset = 'UTF8';

/**
 * 动态在页面上加载一个外部css文件
 * @name baidu.page.loadCssFile
 * @function
 * @grammar baidu.page.loadCssFile(path)
 * @param {string} path css文件路径
 * @see baidu.page.loadJsFile
 */

baidu.page.loadCssFile = function (path) {
    var element = document.createElement("link");
    
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", path);

    document.getElementsByTagName("head")[0].appendChild(element);        
};

/**
 * 动态在页面上加载一个外部js文件
 * @name baidu.page.loadJsFile
 * @function
 * @grammar baidu.page.loadJsFile(path)
 * @param {string} path js文件路径
 * @see baidu.page.loadCssFile
 */
baidu.page.loadJsFile = function (path) {
    var element = document.createElement('script');

    element.setAttribute('type', 'text/javascript');
    element.setAttribute('src', path);
    element.setAttribute('defer', 'defer');

    document.getElementsByTagName("head")[0].appendChild(element);    
};
