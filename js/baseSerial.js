//表单序列化
$().extend('serialize', function(){
  for(var i=0; i<this.elements.length; i++){
    var form = this.elements[i];
    var parts = {};  //定义一个对象，用来存放序列化的表单字段
    for (var i = 0; i < form.elements.length; i++) {
      var filed = form.elements[i]; //表单包含的所有的表单字段对象
      switch (filed.type) {
        //不发送type是reset、submit、file和button以及字段集，直接返回
        case undefined:
        case 'submit':
        case 'reset':
        case 'file':
        case 'button':
          break;

        //不发送复选框和单选按钮没有被选择的选项
        case 'radio':
        case 'checkbox':
          if(!filed.selected) break;

        //对于<select>，如果有value值，就指定为value作为发送的值；如果没有，就指定text值
        case 'select-one':
        case 'select-multiple':
          for (var j = 0; j < filed.options.length; j++) {
            var option = filed.options[j];
            if (option.selected) {
              var optValue = '';
              if (option.hasAttribute) {  //非IE
                optValue = (option.hasAttribute('value') ? option.value : option.text);
              }else {   //IE
                optValue = (option.attributes('value').specified ? option.value : option.text);
              }
              parts[filed.name] = optValue;
            }
          }
          break;

        //其他的都需要发送
        default:
          parts[filed.name] = filed.value;
      }
    }
    return parts;
  }
  return this;
});
