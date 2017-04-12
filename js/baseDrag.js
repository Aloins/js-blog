$().extend('drag', function(){
  var tags = arguments;
  for(var i=0; i<this.elements.length; i++){
    addEvent(this.elements[i], 'mousedown', function(e){   //1.点击鼠标，还没有释放
      if(trim(this.innerHTML).length == 0) e.preventDefault();  //如果弹窗是空区域，才阻止默认行为
      var _this = this;
      //clientX是点击位置距离页面左端的距离，offsetLeft是弹窗左边框距离页面左端的距离
      var diffX = e.clientX - _this.offsetLeft;    //得到点击的位置距离弹窗的边框的距离
      var diffY = e.clientY - _this.offsetTop;

      //自定义拖拽区域
      var flag = false;
      for(var i=0; i<tags.length; i++){
        if(e.target == tags[i]){
          flag = true;    //只要有一个是true，就立刻跳出循环，返回
          break;
        }
      }

      if(flag){   //点击规定的区域时才能触发事件，拖拽弹窗
        addEvent(document, 'mousemove', move);  //2.在点击的物体被选择时，进行move移动
        addEvent(document, 'mouseup', up);    //3.释放鼠标，停止移动
      } else {    //否则就移除这两个事件
        removeEvent(document, 'mousemove', move);
        removeEvent(document, 'mouseup', up);
      }

      //限制拖拽区域
      function move(e){
        var left = e.clientX - diffX; //得到移动时弹窗边框距离页面左边和上边的实际距离，即起始点不是弹窗左上角，而是点击的位置
        var top = e.clientY - diffY;
        //限制左右拖拽范围
        if(left<0){ //left<0 表示已经拖拽出页面左边可视区域，那么此时就强制令left＝0
          left = 0;
        }else if (left <= getScroll().left) {
          left = getScroll().left;
        }
        else if (left > getInner().width + getScroll().left - _this.offsetWidth) { //当left大于页面宽度减去弹窗宽度时，表明超出右边可视区域
          left = getInner().width + getScroll().left - _this.offsetWidth;  //强制令left最大为页面宽度减去弹窗宽度
        }
        //限制上下拖拽范围
        if(top<0){ //top<0 表示已经拖拽出页面上边可视区域，那么此时就强制令top＝0
          top = 0;
        }else if (top <= getScroll().top) {
          top = getScroll().top;
        }
        else if (top > getInner().height + getScroll().top - _this.offsetHeight) { //当top大于页面高度减去弹窗高度时，表明超出下边可视区域
          top = getInner().height + getScroll().top - _this.offsetHeight;   //强制令top最大为页面高度减去弹窗高度
        }
        _this.style.left = left + 'px';   //通过css定位弹窗的位置
        _this.style.top = top + 'px';

        if(typeof _this.setCapture != 'undefined') {
          _this.setCapture();   //IE的方法，点下鼠标后移出可视区域外，事件仍然可以触发
        }
      }

      //删除事件
      function up(){
        removeEvent(document, 'mousemove', move);
        removeEvent(document, 'mouseup', up);
        if(typeof _this.releaseCapture != 'undefined'){
          _this.releaseCapture();   //IE的方法，释放鼠标时在可视区域外，事件仍然可以触发
        }
      }

    });
  }
  return this;
});
