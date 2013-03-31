/**
 * 判断平台类型和特性的属性
 * @namespace baidu.platform
 * @author jz
 */
baidu.platform = baidu.platform || {};


/**
 * 判断是否为android平台
 * @property android 是否为android平台
 * @grammar baidu.platform.android
 * @meta standard
 * @see baidu.platform.x11,baidu.platform.windows,baidu.platform.macintosh,baidu.platform.iphone,baidu.platform.ipad
 * @return {Boolean} 布尔值
 * @author jz
 */
baidu.platform.isAndroid = /android/i.test(navigator.userAgent);


/**
 * 判断是否为ipad平台
 * @property ipad 是否为ipad平台
 * @grammar baidu.platform.ipad
 * @meta standard
 * @see baidu.platform.x11,baidu.platform.windows,baidu.platform.macintosh,baidu.platform.iphone,baidu.platform.android
 * @return {Boolean} 布尔值 
 * @author jz
 */
baidu.platform.isIpad = /ipad/i.test(navigator.userAgent);


/**
 * 判断是否为iphone平台
 * @property iphone 是否为iphone平台
 * @grammar baidu.platform.iphone
 * @meta standard
 * @see baidu.platform.x11,baidu.platform.windows,baidu.platform.macintosh,baidu.platform.ipad,baidu.platform.android
 * @return {Boolean} 布尔值
 * @author jz
 */
baidu.platform.isIphone = /iphone/i.test(navigator.userAgent);


/**
 * 判断是否为macintosh平台
 * @property macintosh 是否为macintosh平台
 * @grammar baidu.platform.macintosh
 * @meta standard
 * @see baidu.platform.x11,baidu.platform.windows,baidu.platform.iphone,baidu.platform.ipad,baidu.platform.android
 * @return {Boolean} 布尔值 
 * @author jz
 */
baidu.platform.isMacintosh = /macintosh/i.test(navigator.userAgent);


/**
 * 判断是否为windows平台
 * @property windows 是否为windows平台
 * @grammar baidu.platform.windows
 * @meta standard
 * @see baidu.platform.x11,baidu.platform.macintosh,baidu.platform.iphone,baidu.platform.ipad,baidu.platform.android
 * @return {Boolean} 布尔值 
 * @author jz
 */
baidu.platform.isWindows = /windows/i.test(navigator.userAgent);


/**
 * 判断是否为x11平台
 * @property x11 是否为x11平台
 * @grammar baidu.platform.x11
 * @meta standard
 * @see baidu.platform.windows,baidu.platform.macintosh,baidu.platform.iphone,baidu.platform.ipad,baidu.platform.android
 * @return {Boolean} 布尔值 
 * @author jz
 */
baidu.platform.isX11 = /x11/i.test(navigator.userAgent);