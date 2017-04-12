$(function () {
  //个人中心和下拉菜单
  $('#header .member').hover(function(){  //hover(over, out) 传递两个函数
    $(this).css('background','url(./images/arrow2.png) no-repeat 55px center');   //鼠标移入时图标变化
    $('#header .memberUl').show().animate({   //鼠标移入时渐变显示个人中心的下拉菜单
      t : 30,
      step : 10,
      mul : {
        o : 100,
        h : 120
      }
    });
  }, function(){
    $(this).css('background','url(./images/arrow.png) no-repeat 55px center');   //鼠标移出时图标变化
    $('#header .memberUl').animate({   //鼠标移出时渐变隐藏个人中心的下拉菜单
      t : 30,
      step : 10,
      mul : {
        o : 0,
        h : 0
      },
      fn : function () {
        $('#header .memberUl').hide();
      }
    });
  });

  //遮罩画布
  var screen = $('#screen');

  //登录框
  var login = $('#login');
  login.center(350,250).resize(function(){  //设置登录框显示位置居中，页面缩放时执行的方法
    if(login.css('display')=='block'){
      screen.lock();    //改变浏览器大小时锁屏区域也跟着改变大小
    }
  });
  $('#header .login').click(function(){   //点击登录按钮时显示登录框
    login.center(350,250).show();
    screen.lock().animate({  //点击之后弹出登录框且锁屏，锁屏是透明度渐变
      attr : 'o',
      target : 30,
      t : 30,
      step : 10
    });
  });
  $('#login .close').click(function(){   //点击关闭按钮时隐藏登录框
    login.hide();
    //先执行透明度渐变动画，动画完毕后再执行关闭unlock
    screen.animate({  //点击之后关闭登录框且关闭锁屏功能，关闭锁屏时透明度渐变，且恢复为0，下次锁屏时可以继续实现透明度渐变功能
      attr : 'o',
      target : 0,
      t : 30,
      step : 10,
      fn : function () {
        screen.unlock();
      }
    });
  });

  //注册框
  var reg = $('#reg');
  reg.center(600,550).resize(function(){
    if(reg.css('display')=='block'){
      screen.lock();
    }
  });
  $('#header .reg').click(function(){
    reg.center(600,550).show();
    screen.lock().animate({
      attr : 'o',
      target : 30,
      t : 30,
      step : 10
    });
  });
  $('#reg .close').click(function(){
    reg.hide();
    screen.animate({
      attr : 'o',
      target : 0,
      t : 30,
      step : 10,
      fn : function () {
        screen.unlock();
      }
    });
  });


  //拖拽登录框
  login.drag($('#login h2').first());
  //拖拽注册框
  reg.drag($('#reg h2').first());

  //百度分享菜单初始化位置
  $('#share').css('top', getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(), 'height')))/2 + 'px');
  //百度分享菜单随着滚动条滚动而缓冲运动从而居中
  $(window).bind('scroll', function () {
    setTimeout(function () {
      $('#share').animate({
        attr : 'y',
        target : getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(), 'height')))/2
      });
    }, 100);
  });

  //百度分享菜单伸缩效果
  $('#share').hover(function () {
    $(this).animate({
      attr : 'x',
      target : 0
    });
  }, function () {
    $(this).animate({
      attr : 'x',
      target : -211
    });
  })

  //滑动导航
  $('#nav .about li').hover(function(){   //鼠标移入移出事件默认为最上面一层
    var target = $(this).first().offsetLeft;  //得到鼠标放上去的那个li距离父元素的x坐标
    $('#nav .navBg').animate({
      attr : 'x',
      target : target+20,
      t : 20,
      step : 10,
      fn : function () {
        $('#nav .white').animate({
          attr : 'x',
          target : -target
        });
      }
    });
  }, function () {
    $('#nav .navBg').animate({
      attr : 'x',
      target : 20,
      t : 20,
      step : 10,
      fn : function () {
        $('#nav .white').animate({
          attr : 'x',
          target : 0
        });
      }
    });
  });

  //左侧菜单
  $('#sidebar h2').toggle(function () {
    $(this).next().animate({
      mul : {
        h : 0,
        o : 0
      }
    });
  }, function () {
    $(this).next().animate({
      mul : {
        h : 150,
        o : 100
      }
    });
  });


  //注册表单验证
  //初始化表单操作
  $('form').eq(1).first().reset();

  //用户名验证
  $('form').eq(1).form('user').bind('focus', function () {  //光标移入，显示提示输入用户名信息
    $('#reg .infoUser').show();
    $('#reg .errorUser').hide();
    $('#reg .succUser').hide();
  }).bind('blur', function () {     //光标移出
    if(trim($(this).value()) == ''){    //如果没有输入用户名，就隐藏提示信息
      $('#reg .infoUser').hide();
      $('#reg .errorUser').hide();
      $('#reg .succUser').hide();
    } else if (!checkUser()) {   //如果输入错误信息，提示错误
      $('#reg .infoUser').hide();
      $('#reg .errorUser').show();
      $('#reg .succUser').hide();
    } else {      //如果输入正确信息，提示可用
      $('#reg .infoUser').hide();
      $('#reg .errorUser').hide();
      $('#reg .succUser').show();
    }
  });

  //用户名检测函数
  function checkUser() {
    var flag = true;
    if(!/[\w]{2,20}/.test(trim($('form').eq(1).form('user').value()))) {  //如果用户名格式不对，立刻返回false
      $('#reg .errorUser').html('输入不合法，请重新输入');
      return false;
    }else {   //如果用户名格式正确，通过ajax检测用户名是否可用
      //显示用户名检测中
      $('#reg .loading').show();
      $('#reg .infoUser').hide();
      ajax({
        method : 'post',
        url : 'isUser.php',
        data : $('form').eq(1).serialize(),
        success : function(text){
          if (text == 1) {
            $('#reg .errorUser').html('用户名已被占用');
            flag = false; //如果重复了，不可用，返回false
          }else {
            flag = true;  //如果没有重复，可用，返回true
          }
          $('#reg .loading').hide();
        },
        async : false   //此处用同步，为了避免异步会先返回flag再判断用户名是否重复的问题
      });
    }
    return flag;
  }

  //密码验证
  $('form').eq(1).form('pass').bind('focus',function () {  //光标移入，显示提示输入密码信息
    $('#reg .infoPass').show();
    $('#reg .errorPass').hide();
    $('#reg .succPass').hide();
  }).bind('blur', function () {     //光标移出
    if(trim($(this).value()) == ''){    //如果没有输入密码，就隐藏提示信息
      $('#reg .infoPass').hide();
    } else {        //如果输入了密码，判断密码是否合法
        if(checkPass()){    //如果密码合法，就显示可用
          $('#reg .infoPass').hide();
          $('#reg .errorPass').hide();
          $('#reg .succPass').show();
        } else {    //如果密码合法，就显示提示错误信息
          $('#reg .infoPass').hide();
          $('#reg .errorPass').show();
          $('#reg .succPass').hide();
        }
    }
  });

  //密码强度验证
  $('form').eq(1).form('pass').bind('keyup', function () {
    checkPass();
  });

  //密码检测函数
  function checkPass() {
    var value = trim($('form').eq(1).form('pass').value());    //输入的密码字符串
    var valueLength = value.length;       //输入的密码字符串的长度
    var codeLength = 0;                   //记录输入的字符的类型

    //第一个必须条件的验证：6～20位之间
    if(valueLength >= 6 && valueLength <= 20){
      $('#reg .infoPass .q1').html('●').css('color', 'green');
    } else {
      $('#reg .infoPass .q1').html('○').css('color', '#666');
    }

    //第二个必须条件的验证：大小写字母或数字或非空字符，任意一个即可满足
    if (valueLength > 0 && !/\s/.test(value)) {
      $('#reg .infoPass .q2').html('●').css('color', 'green');
    } else {
      $('#reg .infoPass .q2').html('○').css('color', '#666');
    }

    //第三个必须条件的验证：大写字母、小写字母、数字、非空字符，任意2种以上即可满足
    if(/[\d]/.test(value)){
      codeLength++;
    }
    if(/[a-z]/.test(value)){
      codeLength++;
    }
    if(/[A-Z]/.test(value)){
      codeLength++;
    }
    if(/[^\w]/.test(value)){
      codeLength++;
    }

    if(codeLength >= 2){
      $('#reg .infoPass .q3').html('●').css('color', 'green');
    } else {
      $('#reg .infoPass .q3').html('○').css('color', '#666');
    }

    //安全级别
    //高：大于等于10个字符，并且包含至少3种不同类型的字符
    //中：大于等于8个字符，并且包含至少2种不同类型的字符
    //低：大于等于1个字符
    //无：没有字符
    //判断的时候务必从高到低判断，防止高级别无法执行到
    if (valueLength >= 10 && codeLength >= 3) {
      $('#reg .infoPass .s1').css('color', 'green');
      $('#reg .infoPass .s2').css('color', 'green');
      $('#reg .infoPass .s3').css('color', 'green');
      $('#reg .infoPass .s4').html('高').css('color', 'green');
    } else if (valueLength >= 8 && codeLength >= 2) {
      $('#reg .infoPass .s1').css('color', '#f60');
      $('#reg .infoPass .s2').css('color', '#f60');
      $('#reg .infoPass .s3').css('color', '#ccc');
      $('#reg .infoPass .s4').html('中').css('color', '#f60');
    } else if (valueLength >= 1) {
      $('#reg .infoPass .s1').css('color', 'maroon');
      $('#reg .infoPass .s2').css('color', '#ccc');
      $('#reg .infoPass .s3').css('color', '#ccc');
      $('#reg .infoPass .s4').html('低').css('color', 'maroon');
    } else {
      $('#reg .infoPass .s1').css('color', '#ccc');
      $('#reg .infoPass .s2').css('color', '#ccc');
      $('#reg .infoPass .s3').css('color', '#ccc');
      $('#reg .infoPass .s4').html('');
    }

    //如果满足密码合法性的3个条件，就返回true，表示密码合法
    if(valueLength >= 6 && valueLength <= 20 && !/\s/.test(value) && codeLength >= 2) {
      return true;
    }else {
      return false;
    }
  }

  //密码确认
  $('form').eq(1).form('notpass').bind('focus',function () {  //光标移入，显示提示输入密码信息
    $('#reg .infoNotpass').show();
    $('#reg .errorNotpass').hide();
    $('#reg .succNotpass').hide();
  }).bind('blur', function () {
    if(trim($(this).value()) == ''){    //如果没有输入密码，就隐藏提示信息
      $('#reg .infoNotpass').hide();
    } else if (checkNotpass()) {
      $('#reg .infoNotpass').hide();
      $('#reg .errorNotpass').hide();
      $('#reg .succNotpass').show();
    } else {
      $('#reg .infoNotpass').hide();
      $('#reg .errorNotpass').show();
      $('#reg .succNotpass').hide();
    }
  });

  //密码确认检测函数
  function checkNotpass() {
    if(trim($('form').eq(1).form('notpass').value()) == trim($('form').eq(1).form('pass').value())) return true;
  }

  //提问验证
  $('form').eq(1).form('ques').bind('change', function () {
    if (checkQues()) $('#reg .errorQues').hide();

  });

  //提问检测函数
  function checkQues() {
    if ($('form').eq(1).form('ques').value() != 0) return true;
  }

  //回答验证
  $('form').eq(1).form('answer').bind('focus',function () {  //光标移入，显示提示输入密码信息
    $('#reg .infoAns').show();
    $('#reg .errorAns').hide();
    $('#reg .succAns').hide();
  }).bind('blur', function () {
    if(trim($(this).value()) == ''){    //如果没有输入密码，就隐藏提示信息
      $('#reg .infoAns').hide();
    } else if (checkAns()) {
      $('#reg .infoAns').hide();
      $('#reg .errorAns').hide();
      $('#reg .succAns').show();
    } else {
      $('#reg .infoAns').hide();
      $('#reg .errorAns').show();
      $('#reg .succAns').hide();
    }
  });

  //回答检测函数
  function checkAns() {
    if(trim($('form').eq(1).form('answer').value()).length >= 2 && trim($('form').eq(1).form('answer').value()).length <= 32) {
      return true;
    }
  }

  //电子邮件验证
  //邮件名：a-zA-Z0-9_-.
  //域名：a-zA-Z0-9_-
  //域名后缀：a-zA-Z
  //后缀主要种类：.com .net .cn .asia .mobi .com.cn .net.cn
  //所以正则为：/^[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-]+(\.[a-zA-Z]{2,4}){1,2}$/
  $('form').eq(1).form('email').bind('focus',function () {
    //电子邮件补全界面
    if ($(this).value().indexOf('@') == -1) {
      $('#reg .allEmail').show();
    }

    //光标移入，显示提示输入密码信息
    $('#reg .infoEmail').show();
    $('#reg .errorEmail').hide();
    $('#reg .succEmail').hide();
  }).bind('blur', function () {
    //电子邮件补全界面
    $('#reg .allEmail').hide();

    if(trim($(this).value()) == ''){
      //如果没有输入密码，就隐藏提示信息
      $('#reg .infoEmail').hide();
    } else if (checkEmail()) {
      $('#reg .infoEmail').hide();
      $('#reg .errorEmail').hide();
      $('#reg .succEmail').show();
    } else {
      $('#reg .infoEmail').hide();
      $('#reg .errorEmail').show();
      $('#reg .succEmail').hide();
    }
  });

  //电子邮件检测函数
  function checkEmail() {
    if(/^[\w\-\.]+@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test(trim($('form').eq(1).form('email').value()))) return true;
  }

  //电子邮件补全系统鼠标移入移出效果
  $('#reg .allEmail li').hover(function () {
    $(this).css('background', '#e5edf2');
    $(this).css('color', '#369');
  }, function () {
    $(this).css('background', 'none');
    $(this).css('color', '#666');
  });

  //电子邮件补全系统键入
  $('form').eq(1).form('email').bind('keyup', function (event) {
    if ($(this).value().indexOf('@') == -1) {   //没有输入@的情况下，自动补全
      $('#reg .allEmail').show();
      $('#reg .allEmail span').html($(this).value());
    } else {                                    //输入@的情况下，取消自动补全，隐藏域名列表
      $('#reg .allEmail').hide();
    }

    $('#reg .allEmail li').css('background', 'none');                   //不被选中的css样式不变
    $('#reg .allEmail li').css('color', '#666');

    if (event.keyCode == 40) {  //光标向下键
      if (this.index == undefined || this.index >= $('#reg .allEmail li').length()-1) { //如果计数器不存在或超出了界面，初始化计数器
        this.index = 0;   //计数器，计算下移的个数
      } else {
        this.index++;     //往下移了一个，计数器＋1
      }
      $('#reg .allEmail li').eq(this.index).css('background', '#e5edf2'); //被选择的那个eq(this.index)改变css样式
      $('#reg .allEmail li').eq(this.index).css('color', '#369');
    }

    if (event.keyCode == 38) {  //光标向上键
      if (this.index == undefined || this.index <= 0) {  //如果计数器不存在或超出了界面，初始化计数器
        this.index = $('#reg .allEmail li').length()-1;   //计数器，计算上移的个数
      } else {
        this.index--;     //往上移了一个，计数器－1
      }
      $('#reg .allEmail li').eq(this.index).css('background', '#e5edf2'); //被选择的那个eq(this.index)改变css样式
      $('#reg .allEmail li').eq(this.index).css('color', '#369');
    }

    if (event.keyCode == 13) {  //回车键
      $(this).value($('#reg .allEmail li').eq(this.index).text());  //把选定的那个li的文本赋值给email即可，注意this指向的对象
      $('#reg .allEmail').hide();   //使用回车键选定了之后，隐藏补全界面
      this.index = undefined;   //选定了之后，初始化index
    }
  });

  //电子邮件补全系统点击鼠标获取域名
  $('#reg .allEmail li').bind('mousedown',function () {
    $('form').eq(1).form('email').value($(this).text());    //需要获取的是纯文本
  });

  //年月日
  var year = $('form').eq(1).form('year');
  var month = $('form').eq(1).form('month');
  var date = $('form').eq(1).form('date');
  var date30 = [4, 6, 9, 11];   //每月有30天的月份
  var date31 = [1, 3, 5, 7, 8, 10, 12];   //每月有31天的月份


  //注入年
  for(var i = 1950; i <= 2017; i++){  //我们默认从1950年开始
    year.first().add(new Option(i, i), undefined);
  }

  //注入月
  for(var i = 1; i <= 12; i++){
    month.first().add(new Option(i, i), undefined);
  }

  //改变年份注入日
  year.bind('change', selectDate);
  //改变月份注入日
  month.bind('change', selectDate);
  //改变日期显示合法（只有年月都选择了才能选择日期）
  date.bind('change', function () {
    if(checkBirth()) $('#reg .errorBirth').hide();

  });

  //年月日检测函数
  function checkBirth() {
    if (year.value() != 0 && month.value() != 0 && date.value() != 0) return true;
  }

  //注入日的函数
  function selectDate() {
    if (year.value()!=0 && month.value()!=0) {
      //清理之前的注入
      date.first().options.length = 1;

      //不确定的日
      var curDate = 0;

      //注入日
      if (inArray(date31, parseInt(month.value()))) {
        curDate = 31;
      }else if (inArray(date30, parseInt(month.value()))) {
        curDate = 30;
      }else {
        if ((parseInt(year.value()) %4 == 0 && parseInt(year.value()) %100 != 0) || (parseInt(year.value()) %400 == 0)){
          curDate = 29;
        }else {
          curDate = 28;
        }
      }
      for (var i = 1; i <= curDate; i++) {
        date.first().add(new Option(i, i), undefined);
      }

    }else {
      //如果年份或月份清零，清理之前的注入
      date.first().options.length = 1;
    }
  }

  //备注
  $('form').eq(1).form('ps').bind('keyup', checkPS).bind('paste', function () {
    setTimeout(checkPS, 30);  //粘贴事件会在内容粘贴到文本框之前触发，因此设置延迟30ms触发
  });

  //清尾
  $('#reg .ps .clear').click(function () {
    $('form').eq(1).form('ps').value($('form').eq(1).form('ps').value().substring(0,200));
    checkPS();
  });

  //备注输入字数检测函数
  function checkPS() {
    var num = 200 - $('form').eq(1).form('ps').value().length;
    if (num >= 0) {
      $('#reg .ps').eq(0).show();
      $('#reg .ps .num').eq(0).html(num);
      $('#reg .ps').eq(1).hide();
      return true;
    }else {
      $('#reg .ps').eq(0).hide();
      $('#reg .ps .num').eq(1).html(Math.abs(num)).css('color', 'red');
      $('#reg .ps').eq(1).show();
      return false;
    }
  }

  //注册提交
  $('form').eq(1).form('sub').click(function () {
    var flag = true;

    if (!checkUser()) {
      $('#reg .errorUser').show();
      flag = false;
    }

    if (!checkPass()) {
      $('#reg .errorPass').show();
      flag = false;
    }

    if (!checkNotpass()) {
      $('#reg .errorNotpass').show();
      flag = false;
    }

    if (!checkQues()) {
      $('#reg .errorQues').show();
      flag = false;
    }

    if (!checkAns()) {
      $('#reg .errorAns').show();
      flag = false;
    }

    if (!checkEmail()) {
      $('#reg .errorEmail').show();
      flag = false;
    }

    if (!checkBirth()) {
      $('#reg .errorBirth').show();
      flag = false;
    }

    if (!checkPS()) {
      flag = false;
    }

    //提交
    if (flag) {
      //$('form').eq(1).first().submit();   //提交的是整个表单，所以是对form执行submit方法；
      //传统的提交表单的方法，我们采用ajax提交，这个方法就不用了

      var _this = this;
      //提交之后，显示loading提交注册中
      $('#loading').show().center(200,40);
      $('#loading p').html('正在提交注册中...');
      //提交之后，禁用注册按钮，且显示灰色图标，防止重复提交
      _this.disabled = true;
      $(_this).css('backgroundPosition', 'right');

      //通过ajax提交
      ajax({  //既然可以回调传参，就直接把所有要传递的参数写到对象里，传参时传递一个对象即可
        method : 'post',		//发送请求
        url : 'add.php',	//路径url
        data : $('form').eq(1).serialize(),		//需要发送的序列化的表单
        success : function(text){	//回调传参函数
          if (text == 1) {  //提交成功之后，隐藏提交注册中，显示注册成功
            $('#loading').hide();
            $('#success').show().center(200,40);
            $('#success p').html('注册成功，请登录！');

            setTimeout(function () {  //设置1.5s之后，自动隐藏注册成功、注册弹窗、蒙板，且初始化注册弹窗
              $('#success').hide();
              reg.hide();
              $('#reg .succ').hide();
              $('form').eq(1).first().reset();
              _this.disabled = false;
              $(_this).css('backgroundPosition', 'left');
              screen.animate({
                attr : 'o',
                target : 0,
                fn : function () {
                  screen.unlock();
                }
              });
            }, 1500);
          }
        },
        async : true		//同步或异步方式
      });
    }
  });


  //登录表单验证
  $('form').eq(0).form('sub').click(function () {
    //如果用户名和密码合法，利用ajax发送数据，验证数据库是否已经存在这个用户
    if(/[\w]{2,20}/.test(trim($('form').eq(0).form('user').value())) && $('form').eq(0).form('pass').value().length >= 6) {
      var _this = this;
      //登录请求提交之后，显示loading登录中
      $('#loading').show().center(200,40);
      $('#loading p').html('正在尝试登录...');
      //提交之后，禁用登录按钮，且显示灰色图标，防止重复提交
      _this.disabled = true;
      $(_this).css('backgroundPosition', 'right');
      //ajax发送登录请求
      ajax({
        method : 'post',
        url : 'isLogin.php',
        data : $('form').eq(0).serialize(),
        //回调传参函数
        success : function(text){
          $('#loading').hide();
          if (text == 1) {  //用户名或密码不正确，登录失败
            $('#login .info').html('登录失败：用户名或密码不正确！请重新输入！');
          }else {   //登录成功
            $('#login .info').html('');
            $('#success').show().center(200,40);
            $('#success p').html('登录成功，请稍候...');
            //设置当前登录的用户的cookie
            setCookie('user',trim($('form').eq(0).form('user').value()));

            setTimeout(function () {  //设置1.5s之后，自动隐藏登录成功、登录弹窗、蒙板，且初始化登录弹窗
              $('#success').hide();
              login.hide();
              $('form').eq(0).first().reset();
              screen.animate({
                attr : 'o',
                target : 0,
                fn : function () {
                  screen.unlock();
                }
              });
              //登录成功之后，隐藏右上角注册和登录按钮，显示当前用户名
              $('#header .reg').hide();
              $('#header .login').hide();
              $('#header .info').show().html(getCookie('user') + '，您好！');
            }, 1500);
          }
          _this.disabled = false;
          $(_this).css('backgroundPosition', 'left');
        },
        async : true
      });
    }else{  //如果用户名和密码不合法，登录失败
      $('#login .info').html('登录失败：用户名或密码不合法！请重新输入！');
    }
  });


  //轮播器
  //轮播器初始化，显示第一张图片，隐藏其他图片，第一张图片的按钮被选中颜色变深，左下角显示第一张图片的说明文本
  //透明度渐变切换
  $('#banner img').opacity(0);
  $('#banner img').eq(0).opacity(100);
  $('#banner ul li').eq(0).css('color', '#333');
  $('#banner strong').html($('#banner img').eq(0).attr('alt'));

  //轮播器计数器，记录播放第几张图片
  var bannerIndex = 1;

  //轮播器类型
  var bannerType = 1;   //1表示透明度切换，2表示上下滚动切换

  //自动轮播器
  var bannerTimer = setInterval(bannerFn, 2000);

  //手动轮播器
  $('#banner ul li').hover(function () {  //鼠标移动到按钮上时
    clearInterval(bannerTimer);   //如果手动轮播，先清理掉自动轮播器，停止自动轮播功能
    if ($(this).css('color') != 'rgb(51, 51, 51)' && $(this).css('color') != '#333') {
      //如果鼠标放到的按钮不是当前图片的按钮，那么就切换到鼠标放到的按钮对应的图片，避免重复加载
      banner(this, bannerIndex==0 ? $('#banner li').length()-1 : bannerIndex-1);
    }
  }, function () {  //鼠标离开按钮时
    bannerIndex = $(this).index()+1;  //播放下一张图片，索引＋1
    bannerTimer = setInterval(bannerFn, 1000);  //启动自动播放器
  });

  //轮播器图片切换效果显示函数
  function banner(obj, prev) {  //obj传递的是需要轮播的那个节点对象本身
    $('#banner ul li').css('color', '#999');
    $(obj).css('color', '#333');
    $('#banner strong').html($('#banner img').eq($(obj).index()).attr('alt'));

    if (bannerType == 1) {
      //透明度渐变切换图片
      $('#banner img').eq(prev).animate({  //当前对象的前一个对象透明度渐变为0，z层次变为1
        attr : 'o',
        target : 0,
        t : 50,
        step : 10
      }).css('zIndex', 1);

      $('#banner img').eq($(obj).index()).animate({   //当前对象透明度渐变为100%，z层次变为2
        attr : 'o',
        target : 100,
        t : 50,
        step : 10
      }).css('zIndex', 2);  //播放的图片z-index设置为2
    } else if (bannerType == 2) {

      $('#banner img').eq(prev).animate({  //当前对象的前一个对象透明度渐变为0，z层次变为1
        attr : 'y',
        target : 150,
        t : 50,
        step : 10
      }).css('zIndex', 1).opacity(100);

      $('#banner img').eq($(obj).index()).animate({   //当前对象透明度渐变为100%，z层次变为2
        attr : 'y',
        target : 0,
        t : 50,
        step : 10
      }).css('top', '-150px').css('zIndex', 2).opacity(100);  //播放的图片z-index设置为2

    }
  }

  //轮播器图片轮播函数
  function bannerFn() {
    if (bannerIndex >= $('#banner li').length()) bannerIndex = 0;  //当轮播器计数器超过图片的总数量时，初始化bannerIndex=0
    banner($('#banner ul li').eq(bannerIndex).first(), bannerIndex==0 ? $('#banner li').length()-1 : bannerIndex-1);
            //传参：当前对象本身，和当前对象的前一个对象的索引
    bannerIndex++;
  }

  //延迟加载图片
  //当图片进入到可见区域的时候，将图片的xsrc的地址替换到src即可
  var waitLoad = $('.waitLoad');
  waitLoad.opacity(0);  //设置图片透明度为0，隐藏占位的图片
  $(window).bind('scroll', _waitLoad);    //滚动条事件触发延迟加载图片
  $(window).bind('resize', _waitLoad);    //浏览器窗口改变大小事件触发延迟加载图片

  //延迟加载图片函数
  function _waitLoad() {
    setTimeout(function () {  //延迟100ms触发，防止抖动
      for (var i = 0; i < waitLoad.length(); i++) {
        var _this = waitLoad.ge(i);  //获取原来的元素节点对象本身

        if (getInner().height + getScroll().top >= offsetTop(_this)) {
          //当图片进入到可见区域的时候，即屏幕页面可视区域的最低点的位置大于等于图片元素到最外层顶点元素的距离时
          $(_this).attr('src', $(_this).attr('xsrc')).animate({   //base对象调用attr方法，将xsrc地址替换到src中去，透明度渐变替换图片
            attr : 'o',
            target : 100
          });
        }
      }
    },100);
  }

  //图片预加载
  //图片预加载弹窗
  var photoBig = $('#photoBig');
  photoBig.center(620,511).resize(function(){   //改变浏览器窗口大小，依然有效
    if(photoBig.css('display')=='block'){
      screen.lock();
    }
  });
  //点击小图片之后，弹出大图片弹窗，并且锁屏，在后台预加载大图片，然后渐变显示大图片
  $('#photo dl dt img').click(function(){
    photoBig.center(620,511).show();   //弹出大图片弹窗
    screen.lock().animate({   //锁屏
      attr : 'o',
      target : 30,
      t : 30,
      step : 10
    });
    //预加载当前图片
    var tempImg = new Image();  //创建一个临时区域的图片对象，用于保存加载的图片
    //图片加载成功之后才显示图片
    $(tempImg).bind('load', function () {   //onload事件表示图片已经加载成功，onerror事件表示图片加载失败
      $('#photoBig .big img').attr('src', tempImg.src).animate({  //把loading图标改成加载完毕的大图片，渐变显示
        attr : 'o',
        target : 100
      }).css('width','600px').css('height','450px').css('top',0).opacity(0);  //重新设置图片的宽高和位置
    });
    //图片对象的src属性可以在后台加载这张图片到本地缓存
    //注意！此处IE浏览器必须把src这个属性放在onload事件的下面才有效
    tempImg.src = $(this).attr('bigsrc');   //获取需要加载的大图片的地址，通过src属性加载到临时图片对象里

    //预加载当前图片的前、后图片
    var children = this.parentNode.parentNode;   //得到dl，通过dl来获取索引值（img和dl索引值是相同的）
    prevNextImg(children);
  });

  //图片鼠标悬浮，显示和隐藏上下图片切换按钮<和>
  $('#photoBig .big .left').hover(function () {
    $('#photoBig .big .sl').animate({
      attr : 'o',
      target : 50
    });
  }, function () {
    $('#photoBig .big .sl').animate({
      attr : 'o',
      target : 0
    });
  });

  $('#photoBig .big .right').hover(function () {
    $('#photoBig .big .sr').animate({
      attr : 'o',
      target : 50
    });
  }, function () {
    $('#photoBig .big .sr').animate({
      attr : 'o',
      target : 0
    });
  });

  //切换到上一张图片
  $('#photoBig .big .left').click(function () {
    //预加载上一张图片时，先显示loading
    $('#photoBig .big img').attr('src', 'images/loading.gif').css('width','32px').css('height','32px').css('top','190px');
    var currentImg = new Image();    //创建一个临时对象，用于保存加载的图片
    //图片加载成功之后才显示图片
    $(currentImg).bind('load', function () {
      $('#photoBig .big img').attr('src', currentImg.src).animate({
        attr : 'o',
        target : 100
      }).opacity(0).css('width','600px').css('height','450px').css('top',0);
    });
    currentImg.src = $(this).attr('src');  //点击切换按钮，通过src属性把上一张图片加载到临时图片对象里
    //获取上一张图片的父节点
    var children = $('#photo dl dt img').ge(prevIndex($('#photoBig .big img').attr('index'), $('#photo').first())).parentNode.parentNode;
    //预加载上一张的再上一张图片，这样就可以实现点击之后不断切换到上一张图片的功能了
    prevNextImg(children);
  });

  //切换到下一张图片
  $('#photoBig .big .right').click(function () {
    //预加载下一张图片时，先显示loading
    $('#photoBig .big img').attr('src', 'images/loading.gif').css('width','32px').css('height','32px').css('top','190px');
    var currentImg = new Image();    //创建一个临时对象，用于保存加载的图片
    //图片加载成功之后才显示图片
    $(currentImg).bind('load', function () {
      $('#photoBig .big img').attr('src', currentImg.src).animate({  //点击切换按钮，把下一张图片的src赋值给.big的img，渐变显示图片
        attr : 'o',
        target : 100
      }).opacity(0).css('width','600px').css('height','450px').css('top',0);
    });
    currentImg.src = $(this).attr('src');  //点击切换按钮，通过src属性把下一张图片加载到临时图片对象里
    //获取下一张图片的父节点
    var children = $('#photo dl dt img').ge(nextIndex($('#photoBig .big img').attr('index'), $('#photo').first())).parentNode.parentNode;
    //预加载下一张的再下一张图片，这样就可以实现点击之后不断切换到下一张图片的功能了
    prevNextImg(children);
  });


  //预加载当前图片的前、后图片，并通过自定义属性保存当前图片和前、后图片的索引值的方法
  function prevNextImg(children) {  //传参是当前图片对象的父节点
    var prev = prevIndex($(children).index(), children.parentNode);   //获取前一张图片的索引值
    var next = nextIndex($(children).index(), children.parentNode);   //获取后一张图片的索引值
    //利用临时的图片对象的src属性预加载图片
    var prevImg = new Image();
    var nextImg = new Image();
    prevImg.src = $('#photo dl dt img').eq(prev).attr('bigsrc');
    nextImg.src = $('#photo dl dt img').eq(next).attr('bigsrc');
    //把前、后图片的src保存到.big的.left和.right的自定义属性src里面，以便切换前、后图片方法调用
    $('#photoBig .big .left').attr('src', prevImg.src);
    $('#photoBig .big .right').attr('src', nextImg.src);
    //把当前图片的索引值保存到.big的img的自定义属性index里面，以便切换前、后图片方法调用
    $('#photoBig .big img').attr('index', $(children).index());
    //右下角显示当前图片是全部图片的第几张
    $('#photoBig .big .index').html(parseInt($(children).index())+1 + '/' + $('#photo dl dt img').length());
  }

  //点击关闭按钮隐藏大图片弹窗，并取消锁屏，初始化img为loading，并设置css样式
  $('#photoBig .close').click(function(){
    photoBig.hide();  //隐藏大图片弹窗
    screen.animate({   //取消锁屏
      attr : 'o',
      target : 0,
      t : 30,
      step : 10,
      fn : function () {
        screen.unlock();
      }
    });
    //初始化img为loading
    $('#photoBig .big img').attr('src', 'images/loading.gif').css('width','32px').css('height','32px').css('top','190px');
  });
  //拖拽图片弹窗
  photoBig.drag($('#photoBig h2').first());

  //发表博文弹窗
  $('#blog').center(580,320).resize(function(){
    if($('#blog').css('display')=='block'){
      screen.lock();
    }
  });
  $('#header .member a').eq(0).click(function(){
    $('#blog').center(580,320).show();
    screen.lock().animate({
      attr : 'o',
      target : 30,
      t : 30,
      step : 10
    });
  });
  $('#blog .close').click(function(){
    $('#blog').hide();
    screen.animate({
      attr : 'o',
      target : 0,
      t : 30,
      step : 10,
      fn : function () {
        screen.unlock();
      }
    });
  });

  //拖拽发表博文弹窗
  $('#blog').drag($('#blog h2').first());

  //发表博文的表单验证
  $('form').eq(2).form('sub').click(function () {
    if (trim($('form').eq(2).form('title').value()).length <= 0 || trim($('form').eq(2).form('content').value()).length <= 0) {
      $('#blog .info').html('发表失败：标题或内容不得为空！');
    }else {

      var _this = this;
      //提交之后，显示loading提交注册中
      $('#loading').show().center(200,40);
      $('#loading p').html('正在发表博文...');
      //提交之后，禁用注册按钮，且显示灰色图标，防止重复提交
      _this.disabled = true;
      $(_this).css('backgroundPosition', 'right');

      //通过ajax提交
      ajax({  //既然可以回调传参，就直接把所有要传递的参数写到对象里，传参时传递一个对象即可
        method : 'post',		//发送请求
        url : 'addBlog.php',	//路径url
        data : $('form').eq(2).serialize(),		//需要发送的序列化的表单
        success : function(text){	//回调传参函数
          $('#loading').hide();

          if (text == 1) {
            $('#blog .info').html('');
            $('#success').show().center(200,40);
            $('#success p').html('发表成功，请稍候...');

            setTimeout(function () {  //设置1.5s之后，自动隐藏登录成功、登录弹窗、蒙板，且初始化登录弹窗
              $('#success').hide();
              $('#blog').hide();
              $('form').eq(2).first().reset();
              screen.animate({
                attr : 'o',
                target : 0,
                fn : function () {
                  screen.unlock();

                  //发表新的博文后，更新博文列表，在最上面一条显示新发表的博文
                  $('#index').html('<span class="loading"></span>');
                  $('#index .loading').show();
                  //通过ajax获取博文数据
                  ajax({
                    method : 'post',
                    url : 'getBlog.php',
                    data : {},
                    success : function(text){
                      $('#index .loading').hide();
                      var json = JSON.parse(text);  //json是一个数组，每个数组元素是一个对象，对应一条博文，每个对象存放了title、content、date属性
                      var html = '';    //通过给index添加html的方法添加博文列表（此处也可以用添加元素节点的方法）
                      for (var i = 0; i < json.length; i++) {
                        html += '<div class="content"><h2><em>'+ json[i].date +'</em>'+ json[i].title +'</h2><p>'+ json[i].content +'</p></div>';
                      }
                      $('#index').html(html);
                      //渐变显示博文列表
                      for (var i = 0; i < json.length; i++) {
                        $('#index .content').eq(i).animate({
                          attr : 'o',
                          target : 100
                        });
                      }
                    },
                    async : true
                  });
                }
              });
              _this.disabled = false;
              $(_this).css('backgroundPosition', 'left');
            }, 1500);
          }
        },
        async : true
      });
    }
  });


  //获取已发表的博文列表
  //博文加载中
  $('#index').html('<span class="loading"></span>');
  $('#index .loading').show();
  //通过ajax获取博文数据
  ajax({
    method : 'post',
    url : 'getBlog.php',
    data : {},
    success : function(text){
      $('#index .loading').hide();
      var json = JSON.parse(text);  //json是一个数组，每个数组元素是一个对象，对应一条博文，每个对象存放了title、content、date属性
      var html = '';    //通过给index添加html的方法添加博文列表（此处也可以用添加元素节点的方法）
      for (var i = 0; i < json.length; i++) {
        html += '<div class="content"><h2><em>'+ json[i].date +'</em>'+ json[i].title +'</h2><p>'+ json[i].content +'</p></div>';
      }
      $('#index').html(html);
      //渐变显示博文列表
      for (var i = 0; i < json.length; i++) {
        $('#index .content').eq(i).animate({
          attr : 'o',
          target : 100
        });
      }
    },
    async : true
  });


  //更换皮肤弹窗
  $('#skin').center(650,360).resize(function(){
    if($('#skin').css('display')=='block'){
      screen.lock();
    }
  });
  $('#header .member a').eq(1).click(function(){
    $('#skin').center(650,360).show();
    screen.lock().animate({
      attr : 'o',
      target : 30,
      t : 30,
      step : 10
    });
    //点击换肤之后，通过ajax从数据库加载皮肤背景的小图片
    $('#skin .skinBg').html('<span class="loading"></span>');
    ajax({
      method : 'post',
      url : 'getSkin.php',
      data : {
        'type' : 'all'  //在getSkin.php接收，判断如果type==all，获取所有图片的值
      },
      success : function(text){
        var json = JSON.parse(text);
        var html = '';
        for (var i = 0; i < json.length; i++) {
          //通过给换肤弹窗添加html的方法从数据库添加小图片
          html += '<dl><dt><img src="../images/'+ json[i].smallBg +'" bigBg="'+ json[i].bigBg +'" bgColor="'+ json[i].bgColor +'" alt=""/></dt><dd>'+ json[i].bgText +'</dd></dl>';
        }
        $('#skin .skinBg').html(html).opacity(0).animate({
          attr : 'o',
          target : 100
        });
        //点击小图片之后，页面背景图换成大图片
        $('#skin dl dt img').click(function () {
          $('body').css('background', $(this).attr('bgColor')+ ' ' +'url(../images/'+ $(this).attr('bigBg') +') repeat-x');
          //当选定之后，发送数据到数据库，将选定的bgFlag=1，作为默认皮肤，实现永久换肤
          ajax({
            method : 'get',
            url : 'getSkin.php',
            data : {
              'type' : 'set',   //在getSkin.php接收，判断如果type==set，把点击的图片的bgFlag赋值为1，原来为1的赋值为0，则以后默认显示选定的背景图
              'bigBg' : $(this).attr('bigBg')
            },
            success : function(text){
              $('#success').show().center(200,40);
              $('#success p').html('皮肤更换成功...');
              setTimeout(function () {
                $('#success').hide();
              }, 1500);
            },
            async : true
          });
        });
      },
      async : true
    });
  });
  $('#skin .close').click(function(){
    $('#skin').hide();
    screen.animate({
      attr : 'o',
      target : 0,
      t : 30,
      step : 10,
      fn : function () {
        screen.unlock();
      }
    });
  });

  //拖拽更换皮肤弹窗
  $('#skin').drag($('#skin h2').first());

  //默认显示背景样式
  //服务器中bgFlag=1的图片就是默认显示的背景图片
  ajax({
    method : 'get',
    url : 'getSkin.php',
    data : {
      'type' : 'main'   //在getSkin.php接收，判断如果type==main，获取默认显示的背景图片的值
    },
    success : function(text){
      var json = JSON.parse(text);
      $('body').css('background', json.bgColor + ' ' +'url(../images/'+ json.bigBg +') repeat-x');
    },
    async : true
  });

});
