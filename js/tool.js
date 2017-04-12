//浏览器检测
(function(){
  window.sys = {};  //创建一个对象，保存浏览器信息，以便外部可以访问
  var ua = navigator.userAgent.toLowerCase(); //获取浏览器信息字符串，并转换成小写
  var s = [];   //浏览器信息数组，保存浏览器名称＋版本

  (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :   //IE
  (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :    //firefox
  (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :    //chrome
  (s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] :   //opera
  (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;    //safari

  if (/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
})();


//DOM加载
function addDOMLoaded(fn) {
  var timer = null;
  var isReady = false;  //用于判断是否已经执行了setInterval
  function doReady() {
    if(timer) clearInterval(timer); //清理计数器
    if (isReady) return;  //setInterval执行了一次之后，再调用doReady，直接退出，这样就不会无限循环setInterval了
    isReady = true;
    fn();
  }

  //非主流浏览器
  if ((sys.opera && sys.opera<9) || (sys.firefox && sys.firefox<3) || (sys.webkit && sys.webkit<525)) {
    //两种方法，无论采用哪种方法，基本上用不到了，用哪一种都可以
    /*
    //这种方法，目前在主流浏览器判断的都是complete，类似于onload，即图片加载后才加载
    //用于非主流浏览器的向下兼容即可
    timer = setInterval(function () {
      if (/loaded|complete/.test(document.readyState)) {  //loaded是部分加载，有可能只是DOM加载完毕；complete是完全加载，类似于onload
        doReady();
      }
    },1);
    */
    //另一种方法，判断document的内置方法能不能使用,可以在图片加载之前就执行，但也不是很保险
    timer = setInterval(function () {
      if (document && document.getElementById && document.getElementsByTagName && document.body){
        doReady();
      }
    },1);
  }else if (document.addEventListener) {  //W3C
    addEvent(document, 'DOMContentLoaded', function(){
      fn();
      removeEvent(document, 'DOMContentLoaded', arguments.callee);  //删除事件，arguments.callee可以得到匿名函数
    });
  } else if (sys.ie && sys.ie<9) {  //IE678
    var timer =  null;
    timer = setInterval(function(){
      try {
        document.documentElement.doScroll('left');
        doReady();
      } catch (e) {};
    },1);
  }
}


//跨浏览器获取窗口大小
function getInner(){
  if(typeof window.innerWidth !='undefined'){ //非IE
    return {
      width : window.innerWidth,
      height : window.innerHeight
    }
  } else {  //IE
    return {
      width : document.documentElement.clientWidth,
      height : document.documentElement.clientHeight
    }
  }
}


//跨浏览器获取滚动条位置
function getScroll(){
  return{
    top : document.documentElement.scrollTop || document.body.scrollTop,
    left : document.documentElement.scrollLeft || document.body.scrollLeft
  }
}


//跨浏览器获取style
function getStyle(element, attr){
  var value;
  if(typeof window.getComputedStyle != 'undefined'){  //W3C
    value = window.getComputedStyle(element, null) [attr];
  } else if (typeof element.currentStyle != 'undefined') { //IE
    value = element.currentStyle[attr];
  }
  return value;
}


//判断class是否存在
function hasClass(element, className){
  return element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
}


//跨浏览器添加link或style中的css规则
function insertRule(sheet,selectorText,cssText,position){
  if(typeof sheet.insertRule != 'undefined'){   //W3C
    sheet.insertRule(selectorText + '{' + cssText + '}',position);
  } else if (typeof sheet.addRule != 'undefined') {   //IE
    sheet.addRule(selectorText,cssText,position);
  }
}


//跨浏览器移除link或style中的css规则
function deleteRule(sheet,index){
  if(typeof sheet.deleteRule != 'undefined'){   //W3C
    sheet.deleteRule(index);
  } else if (typeof sheet.removeRule != 'undefined') {   //IE
    sheet.removeRule(index);
  }
}


//跨浏览器添加事件绑定
function addEvent(obj, type, fn){   //对象，事件类型，事件处理函数
  if(typeof obj.addEventListener !='undefined'){  //W3C
    obj.addEventListener(type, fn, false);
  } else{     //IE，attachEvent现代事件绑定函数问题太多，所以用传统事件绑定来封装模拟现代事件绑定
    //创建一个存放事件的哈希表（散列表）
    if(!obj.events) obj.events = {};  //一切皆为对象，在obj里存放哈希表，那么在其他函数里也可以接收到，可以用于删除事件函数
    //第一次执行时执行
    if(!obj.events[type]) {
      obj.events[type]= [];    //创建一个存放事件处理函数的数组，先按照事件类型来划分，然后每个类型再按照传递的顺序存储每个函数
      //把第一次的事件处理函数先储存到第一个位置上
      if (obj['on'+type]) obj.events[type][0] = fn;
    } else {
      //同一个注册函数进行屏蔽，不添加到计数器中
      if(addEvent.equal(obj.events[type], fn)) return false;
    }
    //从第二次开始，用事件计数器来存储
    obj.events[type][addEvent.ID++] = fn;   //++放在变量后面表示先存储再累加，如果放在前面则表示先累加再存储
    //执行事件处理函数
    obj['on'+type] = addEvent.exec;
  }
}
//为每个事件分配一个计数器，实现累加，并且清晰地指出是专门给addEvent函数用的，js一切皆为对象，所以addEvent.ID语法正确，实际上是个全局变量
addEvent.ID = 1;

//执行事件处理函数
addEvent.exec = function(event){
  var e = event || addEvent.fixEvent(window.event);
  var es = this.events[e.type];
  for(var i in es){
    es[i].call(this, e);   //对象冒充传递this和event
  }
}

//屏蔽同一个注册函数
addEvent.equal = function(es, fn){
  for(var i in es){
    if(es[i] == fn) return true;
  }
  return false;
}


//把IE常用的Event对象配对到W3C中去
addEvent.fixEvent = function(event){
  event.preventDefault = addEvent.fixEvent.preventDefault;
  event.stopPropagation = addEvent.fixEvent.stopPropagation;
  event.target = event.srcElement;
  return event;
}

//IE阻止默认行为
addEvent.fixEvent.preventDefault = function(){
  this.returnValue = false;
}

//IE取消冒泡
addEvent.fixEvent.stopPropagation = function(){
  this.cancelBubble = true;
}


//跨浏览器删除事件
function removeEvent(obj, type, fn){
  if(typeof obj.removeEventListener !='undefined'){  //W3C
    obj.removeEventListener(type, fn, false);
  } else {     //IE，detachEvent现代事件删除函数问题太多，所以用传统事件删除来封装模拟现代事件删除
    if(obj.events){
      for (var i in obj.events[type]){
        if(obj.events[type][i] == fn){
          delete obj.events[type][i];
        }
      }
    }
  }
}


//删除左右空格
function trim(str){
  return str.replace(/(^\s*)|(\s*$)/g, '');
}


//跨浏览器获取innerText
function getInnerText(element) {
  return (typeof element.textContent == 'string' ? element.textContent : element.innerText);
}
//跨浏览器设置innerText
function setInnerText(element, text) {
  if(typeof element.textContent == 'string'){
    element.textContent = text;
  } else {
    element.innerText = text;
  }
}


//判断某个值value是否存在于某个数组array中
function inArray(array, value) {
  for (var i in array) {
    if(array[i] === value) return true;
  }
  return false;
}

//获取某一个元素到最外层顶点元素的位置
function offsetTop(element) {
  var top = element.offsetTop;
  var parent = element.offsetParent;
  while(parent != null){
    top += parent.offsetTop;
    parent = parent.offsetParent;
  }
  return top;
}


//阻止默认行为
function predef(e) {
  e.preventDefault();
}


//获取某个节点的上一个节点的索引值
function prevIndex(current, parent) { //current是当前节点的索引值，parent是当前节点的父节点
  var length = parent.children.length;  //所有同级节点的数量
  if(current == 0) return length - 1;   //如果当前节点是第一个，那么就返回最后一个节点即可
  return parseInt(current) - 1;
}


//获取某个节点的下一个节点的索引值
function nextIndex(current, parent) { //current是当前节点的索引值，parent是当前节点的父节点
  var length = parent.children.length;  //所有同级节点的数量
  if(current == length - 1) return 0;   //如果当前节点是最后一个，那么就返回第一个节点即可
  return parseInt(current) + 1;
}


//滚动条固定
function fixedScroll() {
  setTimeout(function () {  //执行一次就可，防止执行多次导致抖动
    window.scrollTo(fixedScroll.left, fixedScroll.top);
  }, 50);
}


//创建Cookie
function setCookie(name, value, expires, path, domain, secure) {
  var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
  if (expires instanceof Date) {
    cookieText += ';expires=' + expires;
  }
  if (path) {
    cookieText += ';expires=' + expires;
  }
  if (domain) {
    cookieText += ';domain=' + domain;
  }
  if (secure) {
    cookieText += ';secure';
  }
  document.cookie = cookieText;
}

//获取Cookie
function getCookie(name) {
	var cookieName = encodeURIComponent(name) + '=';
	var cookieStart = document.cookie.indexOf(cookieName);
	var cookieValue = null;

	if (cookieStart > -1) {
		var cookieEnd = document.cookie.indexOf(';', cookieStart);
		if (cookieEnd == -1) {
			cookieEnd = document.cookie.length;
		}
		cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
	}
	return cookieValue;
}

//删除Cookie
function unsetCookie(name) {
  document.cookie = name + "=;expires=" + new Date(0);
}
