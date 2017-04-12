//前台调用
var $ = function(args){ //利用$()每次调用都新创建一个Base对象，这样就不会造成不同元素节点之间的覆盖和干扰了
  return new Base(args);
}


//基础库
function Base(args){
  //创建一个数组，用来保存获取的节点和节点数组
  this.elements = []; //elements不能放在外面，不然就会公有化

  if(typeof args == 'string'){  //如果传递的是字符串
    if(args.indexOf(' ') != -1){  //css模拟
      var elements = args.split(' ');   //把节点拆开，分别保存到数组里去
      var childElements = [];   //存放临时节点对象的数组，解决被覆盖的问题
      var node = [];            //用来存放父节点用的
      for(var i=0; i<elements.length; i++){
        if (node.length == 0) {
          node.push(document);    //如果默认没有父节点，就把document放入，设为父节点
        }
        switch (elements[i].charAt(0)) {
          case '#':
            childElements = [];     //清理掉临时节点，以便父节点失效，子节点有效
            childElements.push(this.getId(elements[i].substring(1)));
            node = childElements;   //保存父节点，因为childElements要清理，所以需要创建node数组
            break;

          case '.':
            childElements = [];
            for (var j = 0; j < node.length; j++) {
              var temps = this.getClass(elements[i].substring(1), node[j]);
              for (var k = 0; k < temps.length; k++) {
                childElements.push(temps[k]);
              }
            }
            node = childElements;
            break;

          default:
            childElements = [];
            for (var j = 0; j < node.length; j++) {
              var temps = this.getTagName(elements[i], node[j]);
              for (var k = 0; k < temps.length; k++) {
                childElements.push(temps[k]);
              }
            }
            node = childElements;
        }
      }
      this.elements = childElements;
    } else {  //find模拟
      switch (args.charAt(0)) {   //获取字符串首字符，判断类型
        case '#':   //如果首字符是＃
          this.elements.push(this.getId(args.substring(1)));  //那么是按照id获取元素，id名是args.substring(1)
          break;

        case '.':   //如果首字符是.
          this.elements = this.getClass(args.substring(1));  //那么是按照class获取元素，class名是args.substring(1)
          break;

        default:   //其他的，也就是只写了tagName
          this.elements = this.getTagName(args);  //其他的
      }
    }
  } else if (typeof args == 'object') {   //如果传递的是对象
    if(args != undefined){ //_this是一个对象，undefined也是一个对象，区别于typeof返回的字符串'undefined'
        this.elements[0] = args; //如果有_this对象传过来，那么直接赋值给elements数值第一个元素
    }
  } else if (typeof args == 'function') {  //如果传递的是一个函数，表示是DOM加载
      this.ready(args);
  }
};

//addDOMLoaded
Base.prototype.ready = function (fn) {
  addDOMLoaded(fn);
};

//获取节点元素的三种方法：by id，by name（表单元素），by tagname
//通过ID获取节点
Base.prototype.getId = function(id){
  return document.getElementById(id);
};


//通过tagName获取元素节点数组
Base.prototype.getTagName = function(tag, parentNode){
  var node = null;
  var temps = [];
  if(parentNode != undefined){  //如果传参2个，也就是限定了区域的话
    node = parentNode; //区域就是父节点的区域
  } else {
    node = document;  //没有限定区域的话，就是整个document文档
  }
  var tags = node.getElementsByTagName(tag);  //先获取节点数组
  for(var i=0; i<tags.length; i++){ //循环把节点数组放到Base的节点数组里
    temps.push(tags[i]);
  }
  return temps;
}


//获取class节点数组（如果直接用document.getElementsByClassName()的话，有些浏览器可能会有问题，所以我们自己写一个方法）
Base.prototype.getClass = function (className, parentNode) {  //限定了区域的class，限定的区域就是父节点
  var node = null;
  var temps = [];
  if(parentNode != undefined){  //如果传参2个，也就是限定了区域的话
    node = parentNode; //区域就是父节点的区域
  } else {
    node = document;  //没有限定区域的话，就是整个document文档
  }

  var all = node.getElementsByTagName('*'); //先获取所有的节点
  for(var i=0; i<all.length; i++){  //把所有包含了与需要获取的节点同class名的节点放到elements数组里
    if ((new RegExp('(\\s|^)'+className+'(\\s|$)')).test(all[i].className)) {
      temps.push(all[i]);
    }
  }
  return temps;
};

//设置css选择器子节点
Base.prototype.find = function (str) {
  var childElements = [];   //子节点数组
  for(var i=0; i<this.elements.length; i++){
    switch (str.charAt(0)) {   //获取字符串首字符，判断类型
      case '#':   //因为id有唯一性，这样获取没什么意义，但还是做一下，防止有人会这样调用
        childElements.push(this.getId(str.substring(1)));
        break;

      case '.':   //className
        var temps = this.getClass(str.substring(1), this.elements[i]);
        for(var j=0; j<temps.length; j++){
          childElements.push(temps[j]);
        }
        break;

      default:    //tagName
        var temps = this.getTagName(str, this.elements[i]);
        for(var j=0; j<temps.length; j++){
          childElements.push(temps[j]);
        }
    }
  }
  this.elements = childElements;
  return this;
};


//获取某一个节点，并返回这个节点对象
Base.prototype.ge = function (num) {
  return this.elements[num];
};

//获取首节点，并返回这个节点对象
Base.prototype.first = function () {
  return this.elements[0];
};

//获取尾节点，并返回这个节点对象
Base.prototype.last = function () {
  return this.elements[this.elements.length - 1];
};

//获取某组节点的数量
Base.prototype.length = function () {
  return this.elements.length;
};

//获取或设置某一节点的属性
Base.prototype.attr = function (attr, value) {
  for(var i=0; i<this.elements.length; i++){
    if (arguments.length == 1) {  //获取属性
      return this.elements[i].getAttribute(attr);
    }else if (arguments.length == 2){ //设置属性
      this.elements[i].setAttribute(attr, value);
    }
  }
  return this;
};

//获取某一个节点在整个节点数组中的索引值
Base.prototype.index = function () {
  var children = this.elements[0].parentNode.children;
  for (var i = 0; i < children.length; i++) {
    if (this.elements[0] == children[i]) return i;
  }
};

//获取某一个节点，并且返回Base对象
Base.prototype.eq = function (num) {
  var element = this.elements[num];
  this.elements = [];
  this.elements[0]=element;
  return this;
};

//获取当前节点同级的下一个元素节点
Base.prototype.next = function () {
  for(var i=0; i<this.elements.length; i++){
    this.elements[i] = this.elements[i].nextSibling;
    if(this.elements[i] == null) throw new Error('找不到下一个同级元素节点！');
    if(this.elements[i].nodeType == 3) this.next();
  }
  return this;
};

//获取当前节点同级的上一个元素节点
Base.prototype.prev = function () {
  for(var i=0; i<this.elements.length; i++){
    this.elements[i] = this.elements[i].previousSibling;
    if(this.elements[i] == null) throw new Error('找不到上一个同级元素节点！');
    if(this.elements[i].nodeType == 3) this.prev();
  }
  return this;
};


//在Base对象的原型添加需要的各种方法
//设置css
Base.prototype.css = function (attr, value) { //css是获取和改变样式表的方法
  for(var i=0; i<this.elements.length; i++){
        //获取css属性值，需要用获取计算后的css方法才能获取外部加载的样式表的属性值
    if(arguments.length==1){  //只传一个参数，也就是样式表属性名的话，获取原有的css属性值
      return getStyle(this.elements[i],attr);
    }

    //传参2个，设置css
    this.elements[i].style[attr] = value; //此处传进来的是字符串，因此需要把它改成非字符串格式，用数组即可
  }
  return this;
};


//添加clss设置css样式
Base.prototype.addClass = function (className) {
  for(var i=0; i<this.elements.length; i++){
    if(!hasClass(this.elements[i],className)){  //如果没有这个class的话，再添加，避免重复添加
      this.elements[i].className += ' '+className;  //加一个空格，保证多个class名不会连接在一起
    }
  }
  return this;
};


//移除class删除css样式
Base.prototype.removeClass = function (className) {
  for(var i=0; i<this.elements.length; i++){
    if(hasClass(this.elements[i],className)){  //有这个class的话，再删除
      this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),' ');  //把class替换成空格即可
    }
  }
  return this;
};


//添加link或style中的css规则（会破坏整个css的结构，用得很少）（是在源代码的css中没有写的）
Base.prototype.addRule = function (num, selectorText, cssText, position) {
  //传参：num是第几个link或style，selectorText是选择器（添加css的节点），cssText是添加的css样式，position是添加规则的位置
  var sheet = document.styleSheets[num];  //获取link或style
  insertRule(sheet,selectorText,cssText,position);
  return this;
}


//移除link或style中的css规则（会破坏整个css的结构，用得很少），按照规则条数删除，不按选择器了
Base.prototype.removeRule = function (num,index) {  //num是第几个link或style，index是要删除第几条规则
  var sheet = document.styleSheets[num];  //获取link或style
  deleteRule(sheet,index);
  return this;
};


//设置获取表单字段元素节点
Base.prototype.form = function (name) {   //name是需要获取的表单字段的name
  for(var i=0; i<this.elements.length; i++){
    this.elements[i] = this.elements[i][name];
  }
  return this;
};
//设置获取表单字段内容
Base.prototype.value = function (str) {  //改变元素节点的值
  for(var i=0; i<this.elements.length; i++){
    if(arguments.length==0){  //如果没有传参的话，获取原有的内容
      return this.elements[i].value;  //获取节点内容，此处没有返回对象本身，无法连缀，但是一般获取内容的话，后面不需要连缀
    }
    //传参，设置节点内容
    this.elements[i].value = str;
  }
  return this;
};


//设置innerHTML（包括所有的内容）
Base.prototype.html = function (str) {  //改变元素节点的值
  for(var i=0; i<this.elements.length; i++){
    if(arguments.length==0){  //如果没有传参的话，获取原有的内容
      return this.elements[i].innerHTML;  //获取节点内容，此处没有返回对象本身，无法连缀，但是一般获取内容的话，后面不需要连缀
    }
    //传参，设置节点内容
    this.elements[i].innerHTML = str;
  }
  return this;
};

//设置innerText（不包括HTML内容）
Base.prototype.text = function (str) {  //改变元素节点的纯文本
  for(var i=0; i<this.elements.length; i++){
    if(arguments.length == 0){  //如果没有传参的话，获取原有的纯文本
      return getInnerText(this.elements[i]);  //获取节点的纯文本，此处没有返回对象本身，无法连缀，但是一般获取纯文本的话，后面不需要连缀
    }
    //传参，设置节点的纯文本
    setInnerText(this.elements[i], str);
  }
  return this;
};


//设置某一个节点的透明度
Base.prototype.opacity = function (num) {
  for(var i=0; i<this.elements.length; i++){
    this.elements[i].style.opacity = num/100;
    this.elements[i].style.filter = 'alpha(opacity='+ num +')';
  }
  return this;
};


//设置事件发生器
Base.prototype.bind = function (event, fn) {  //传参，事件对象，事件处理函数
  for(var i=0; i<this.elements.length; i++){
    addEvent(this.elements[i], event, fn);
  }
  return this;
};


//设置鼠标移入移出方法
Base.prototype.hover = function (over, out) { //第一个参数是鼠标移入触发事件处理函数，第二个参数是鼠标移出触发事件处理函数
  for(var i=0; i<this.elements.length; i++){
    addEvent(this.elements[i], 'mouseover', over);
    addEvent(this.elements[i], 'mouseout', out);
  }
  return this;
};


//设置点击切换效果方法
Base.prototype.toggle = function () {   //需要传不定额的参数，所以函数定义时不定义参数
  for(var i=0; i<this.elements.length; i++){
    (function (element, args) {   //自我执行，闭包
      var count = 0;  //计数器，计算执行了第几个函数，每个对象都会定义一个计数器单独计数
      addEvent(element, 'click', function () {
        args[count++ % args.length].call(this);  //先运行，再执行++；再除以函数个数取余数，得到应该执行第几个函数
      });
    })(this.elements[i],arguments);   //传参，闭包接收参数，即element=this.elements[i], args=arguments
  }
  return this;
};




//设置显示show()
Base.prototype.show = function () {
  for(var i=0; i<this.elements.length; i++){
    this.elements[i].style.display = 'block';
  }
  return this;
};


//设置隐藏hide()
Base.prototype.hide = function () {
  for(var i=0; i<this.elements.length; i++){
    this.elements[i].style.display = 'none';
  }
  return this;
};


//设置区块居中
Base.prototype.center = function (width, height) {
  var left = (getInner().width - width)/2 + getScroll().left;
  var top = (getInner().height - height)/2 + getScroll().top;
  for(var i=0; i<this.elements.length; i++){
    this.elements[i].style.top = top + 'px';
    this.elements[i].style.left = left + 'px';
  }
  return this;
};


//锁屏功能
Base.prototype.lock = function () {
  for(var i=0; i<this.elements.length; i++){
      fixedScroll.top = getScroll().top;
      fixedScroll.left = getScroll().top;
      this.elements[i].style.width = getInner().width + getScroll().left + 'px';
      this.elements[i].style.height = getInner().height + getScroll().top + 'px';
      this.elements[i].style.display = 'block';
      //锁屏时禁用滚动条
      parseFloat(sys.firefox)<4 ? document.body.style.overflow = 'hidden' : document.documentElement.style.overflow = 'hidden';
      //阻止点击鼠标选定文本的默认行为，防止锁屏时浏览器可以通过点击鼠标往下拉动滚动条
      //W3C
      addEvent(this.elements[i], 'mousedown', predef);
      addEvent(this.elements[i], 'mouseup', predef);
      //IE
      addEvent(this.elements[i], 'selectstart', predef);
      //滚动条固定
      addEvent(window, 'scroll', fixedScroll);
  }
  return this;
};


//关闭锁屏功能
Base.prototype.unlock = function () {
  for(var i=0; i<this.elements.length; i++){
      this.elements[i].style.display = 'none';
      //关闭锁屏时恢复滚动条默认状态
      parseFloat(sys.firefox)<4 ? document.body.style.overflow = 'auto' : document.documentElement.style.overflow = 'auto';
      //取消阻止点击鼠标选定文本的默认行为
      //W3C
      removeEvent(this.elements[i], 'mousedown', predef);
      removeEvent(this.elements[i], 'mouseup', predef);
      //IE
      removeEvent(this.elements[i], 'selectstart', predef);
      //取消滚动条固定
      removeEvent(window, 'scroll', fixedScroll);
  }
  return this;
};


//触发点击事件
Base.prototype.click = function (fn) {  //click点击事件，传参是一个匿名函数
  for(var i=0; i<this.elements.length; i++){
    this.elements[i].onclick = fn;
  }
  return this;
};


//触发浏览器窗口缩放事件
Base.prototype.resize = function (fn) {   //传递的是一个事件处理函数
  for(var i=0; i<this.elements.length; i++){
    var element = this.elements[i];

    addEvent(window, 'resize', function(){
      fn();   //先执行事件处理函数
      //把弹窗拖放到右下角，然后缩放页面时，弹窗还能全部显示出来
      if(element.offsetLeft > getInner().width + getScroll().left - element.offsetWidth){
        element.style.left = getInner().width + getScroll().left - element.offsetWidth + 'px';
        if (element.offsetLeft <= 0 + getScroll().left) {  //如果已经到达页面左端
          element.style.left = 0 + getScroll().left + 'px';
        }
      }
      if(element.offsetTop > getInner().height + getScroll().top - element.offsetHeight){
        element.style.top = getInner().height + getScroll().top - element.offsetHeight + 'px';
        if (element.offsetTop <= 0 + getScroll().top) {  //如果已经到达页面顶端
          element.style.top = 0 + getScroll().top + 'px';
        }
      }
    });
  }
  return this;
};


//设置动画
Base.prototype.animate = function (obj) {  //传递一个对象
  for(var i=0; i<this.elements.length; i++){
    var element = this.elements[i];

    //attr是设置的css，start是起始点，step是移动的步长，alter是目标点的坐标的增量，target是停止位置的目标点,t是执行时间间隔，speed是缓冲速度，type是运动类型
    var attr = obj['attr'] == 'x' ? 'left' : obj['attr']=='y' ? 'top' :  //可选，需要改变的css属性，x代表left，y代表top
               obj['attr'] == 'w' ? 'width' : obj['attr'] == 'h' ? 'height' :   //w代表 width，h代表 height
               obj['attr'] == 'o' ? 'opacity' : obj['attr'] != undefined ? obj['attr'] : 'left';   //o代表 opacity，其他则直接是传参，不传递则默认为left
    var start = obj['start'] != undefined ? obj['start'] :
                attr == 'opacity' ? parseFloat(getStyle(element,attr))*100 :
                parseInt(getStyle(element,attr));  //可选，默认是css设置的初始值
    var t = obj['t'] != undefined ? obj['t'] : 30;  //可选，默认为30毫秒执行一次
    var step = obj['step'] != undefined ? obj['step'] : 10; //可选，默认为每次移动10px
    var alter = obj['alter'];
    var target = obj['target'];   //必选，alter和target至少二选一，alter是目标点的坐标增量，target是目标点的坐标
    var mul = obj['mul'];
    var speed = obj['speed'] != undefined ? obj['speed'] :6;    //可选，默认缓冲速度为6
    var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';  //可选，0表示匀速，1表示缓冲，默认为缓冲

    //如果有目标量，那么默认为目标量；如果有mul，那么就是mul
    if (alter != undefined && target == undefined) {  //如果有增量而没有目标量
      target = alter + start;
    } else if(alter == undefined && target == undefined && mul == undefined){ //如果增量、目标量、mul都没有，报错
      throw new Error('alter增量或target目标量必须传一个！');
    }

    if (start > target) step = -step;   //如果是向左或向上运动，则step为负值

    if (attr == 'opacity') {  //透明度渐变
      element.style.opacity = parseInt(start)/100;  //W3C
      element.style.filter = 'alpha(opacity='+ parseInt(start) +')';  //IE
    } else {  //运动动画
      //element.style[attr] = start + 'px';   //每次都初始化起始位置
    }

    if (mul == undefined) {   //如果传参是单个属性和目标量，那么先创建mul对象，把属性和目标量放进去，再执行循环
      mul = {};
      mul[attr] = target;
    }


    clearInterval(element.timer);    //为每个element都定义一个定时器，这样多个动画就不会共用计时器导致冲突，运行前先清理定时器
    element.timer = setInterval(function () {   //定时器

      /*
        问题1:多个动画执行了多个列队动画，我们要求不管多少个动画，只执行一个列队动画
        问题2:多个动画数值差别太大，导致动画无法执行到目标值，原因是定时器提前清理掉了

        解决1:不管多少个动画，只提供一次列队动画的机会
        解决2:多个动画按最后一个分动画执行完毕后再清理
      */
      //创建一个布尔值，这个值可以纪录多个动画是否全部执行完毕
      var flag = true;  //表示都执行完毕了

      //传参mul，同步运动，循环
      for (var i in mul) {
        attr = i == 'x' ? 'left': i == 'y' ? 'top' : i == 'w' ? 'width' : i == 'h' ? 'height' :
               i == 'o' ? 'opacity' : i != undefined ? i : 'left';   //属性名
        target = mul[i];  //属性值，即目标量

        //缓冲运动
        if (type == 'buffer') {
          step = attr == 'opacity' ? (target - parseFloat(getStyle(element,attr))*100)/speed :
                                     (target - parseInt(getStyle(element,attr)))/speed;
          step = step > 0 ? Math.ceil(step) : Math.floor(step);
        }

        //透明度渐变
        if (attr == 'opacity') {
          if (step == 0) {
            setOpacity();
          }else if (step > 0 && Math.abs(parseFloat(getStyle(element,attr))*100 - target)<=step) {
            setOpacity();
          }else if (step < 0 && (parseFloat(getStyle(element,attr))*100 - target)<= Math.abs(step)) {
            setOpacity();
          }else {
            var temp = parseFloat(getStyle(element, attr)) *100;
            element.style.opacity = parseInt(temp + step)/100;
            element.style.filter = 'alpha(opacity='+ parseInt(temp + step) +')';
          }

          if (parseInt(target) != parseInt(parseFloat(getStyle(element,attr))*100)) flag = false;

        } else {  //匀速运动
          if (step == 0) {
            setTarget();
          }else if (step > 0 && Math.abs(parseInt(getStyle(element,attr)) - target)<=step) {   //向右或向下移动
            setTarget();
          }else if (step < 0 && (parseInt(getStyle(element,attr)) - target) <= Math.abs(step)) {   //向左或向上移动
            setTarget();
          }else {
            //放在else里面，永远不会和停止运动同时执行，就不会出现303同时减到300的问题
            //但是会出现不同时减到300的问题，导致会突兀地回跳一下
            //所以我们采用从296加到300的方法，不需要到303再往回减，这样就不会突兀地回跳了
            element.style[attr] = parseInt(getStyle(element,attr)) + step + 'px';
          }

          if (parseInt(target) != parseInt(getStyle(element,attr))) flag = false;
        }
      }

      if(flag){   //flag为true，全部同步动画都执行完毕后，再清理计时器，执行列队动画
        clearInterval(element.timer);
        if (obj.fn != undefined) obj.fn();   //动画结束后执行传参obj.fn
      }
    },t);   //t是运行的时间间隔

    //设置坐标
    function setTarget() {
      element.style[attr] = target + 'px'
    }

    //设置透明度
    function setOpacity() {
      element.style.opacity = parseInt(target)/100;
      element.style.filter = 'alpha(opacity='+ parseInt(target) +')';
    }
  }
  return this;
};


//插件入口
Base.prototype.extend = function (name, fn) {
  Base.prototype[name] = fn;
};
