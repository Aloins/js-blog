//封装Ajax
function ajax(obj){	//传递对象，对象有需要的各种参数，避免传递参数冗余
  var xhr = (function(){    //创建XMLHttpRequest对象
    //IE7以下版本不能用XMLHttpRequest，要用ActiveX的MSXML库，兼容
    if(typeof XMLHttpRequest!='undefined'){	//高版本浏览器
      return new XMLHttpRequest();
    } else if(typeof ActiveXObject!='undefined'){		//IE7以下
      var version = [
        'MSXML2.XMLHttp.6.0',
        'MSXML2.XMLHttp.3.0',
        'MSXML2.XMLHttp'
      ];
      for(var i=0; i<version.length; i++){
        try{
          return new ActiveXObject(version[i]);
        } catch(e){
          //跳过
        }
      }
    } else{
      throw new Error('您的系统或浏览器不支持XHR对象！');
    }
  })();

  obj.url = obj.url+'?rand='+Math.random();	//随机数方法消除缓存（可以用其他方法）
  //名值对转换为字符串
  obj.data = (function (data) {
    var arr=[];
    for(var i in data){
      arr.push(encodeURIComponent(i) + '=' +encodeURIComponent(data[i]));	// i 是属性名，data[i]是属性值，编码
    }
    return arr.join('&');	//把数组转换成字符串
  })(obj.data);
  if(obj.method==='get'){	//get请求的url格式
    obj.url += obj.url.indexOf('?')==-1 ?  '?' + obj.data :  '&'+obj.data;   //要判断有没有问号?，没有就加?，有就加&
  }

  if(obj.async===true){	//异步方式
    xhr.onreadystatechange=function(){
      if(xhr.readyState==4){
        callback();		//回调传递参数
      }
    }
  };

  xhr.open(obj.method, obj.url, obj.async);	//open()

  if(obj.method==='post'){		//post请求
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    xhr.send(obj.data);
  } else{
    xhr.send(null);	//非post只要传递null即可
  }

  if(obj.async===false){	//同步方式
    callback();
  }

  function callback(){	//回调传递参数函数
    if(xhr.status==200){
      obj.success(xhr.responseText);	//回调传递参数（因为作用域问题，无法直接返回结果，因此需要回调传参）
    } else{
      alert('获取数据错误！错误代号：'+xhr.status+'，错误信息：'+xhr.statusText);
    }
  };
}
