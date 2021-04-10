$(function() {
    // 1.点击去注册链接跳转到注册页面
    $('#link_reg').on('click', function() {
        $(this).parent().hide().siblings('.reg').show();
        
    })
    // 2.点击去登陆链接跳转到登陆页面
    $('#link_login').on('click', function() {
        $(this).parent().hide().siblings('.login').show();
    })

    // 3.给表单添加验证规则
    // 获取layui表单对象
    var form = layui.form;
    // 添加自定义校验规则
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
          /^[\S]{6,12}$/
          ,'密码必须6到12位，且不能出现空格'
        ],
        // 定义确认密码的校验规则
        repass: function(value) {
            if(value != $('.reg [name=password]').val()) {
                return '两次密码不一致';
            }
        }
      });
    
    // 导入layer对象
    var layer = layui.layer;
    // 4.实现表单的注册提交功能
    // 获取注册表单的提交事件
    $('.reg-form').on('submit', function(e) {
        e.preventDefault();
        // 发起post请求
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-form [name=username]').val(),
                password: $('.reg-form [name=password]').val()
            },
            success: function(res) {
                if(res.status == 0) {
                    // 注册成功，自动跳转到登陆页面，并显示提示框
                    $('#link_login').click();
                }
                // 注册失败，不跳转页面，只显示提示框
                // 调用layer.msg()提示消息
                return layer.msg(res.message);
            }
        })
    })

    // 5.实现登陆功能
    $('.login-form').on('submit', function(e) {
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            type: 'POST',
            url: '/api/login',
            // .serialize()用于快速获取表单数据，数据以键值对的形式返回
            data: $('.login-form').serialize(),
            success: function(res) {
                if(res.status == 0) {
                    // 登陆成功，并存储token字符串，自动跳转到后台页面
                    localStorage.setItem('token',res.token);
                    location.href = '/index.html';
                }
                // 登陆失败，不跳转页面，只显示提示框
                return layer.msg(res.message);
            }
        })
    })
})
