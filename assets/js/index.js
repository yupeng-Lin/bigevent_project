// 主页的js文件
// $(function() {}) 等价于 document.onready(){} 事件，
// 即当页面的 DOM 元素加载完成后就自动执行该函数
$(function() {
    // 调用获取用户信息的函数
    getUserInfo();
    
    // 给退出按钮绑定点击事件，退出登陆
    $('#btnLogout').on('click', function() {
        // 在 layui 中调用 layer 模块
        layui.use('layer', function(){
            var layer = layui.layer;
            
            // 使用弹出layer的提示对话框
            layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
                // 点击确定按钮触发此函数
                // 1.1 删除 localStorage 内的token 字符串
                localStorage.removeItem('token');
                // 1.2 跳转到login.html页面
                location.href = '/login.html';

                // 询问框的默认关闭事件
                layer.close(index);
            })
        })
        
    })

    // 给头部的个人中心和侧边栏的个人中心通过事件冒泡绑定响应样式
    $('.layui-header .layui-nav .layui-nav-child').on('click',function(e) {
        // 获取到当前的点击元素的索引
        const index = $(e.target).parent().index();
        // 让对应的侧边栏元素添加layui-this类名
        $('.layui-side .user_list dd').eq(index).addClass('layui-this').siblings().removeClass('layui-this');
    })

    $('.layui-side .user_list').on('click',function(e) {
        // 获取到当前的点击元素的索引
        const index = $(e.target).parent().index();
        // 让对应的侧边栏元素添加layui-this类名
        $('.layui-header .layui-nav .layui-nav-child dd').eq(index).addClass('layui-this').siblings().removeClass('layui-this');
    })
        
})

// 定义获取用户信息的函数
function getUserInfo() {
    // 发起获取用户基本信息的请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: (res) => {
            // 判断用户的登陆状态
            if(res.status !== 0) {
                // 通过 layui 弹出提示消息
                return layui.use('layer', function(){
                    var layer = layui.layer;
                    
                    layer.msg('获取用户信息失败！');
                  });
            }
            // 获取用户信息成功，调用渲染用户用户名和头像的函数
            renderAvatarAndUsername(res.data);
        }
    })
}

// 定义渲染用户头像和用户名的函数
function renderAvatarAndUsername(user) {
    // 1.渲染用户名
    // 1.1 判断用户是否有nickname，有就渲染，无就显示username
    let name = user.nickname || user.username;
    $('#welcome-user').html(`${name}  欢迎您！`)
    // 2.渲染用户头像
    // 判断用户是否有自定义头像，有就显示，无就渲染文本头像
    if(user.user_pic !== null) {
        // 2.1 用户的自定义头像属性不为空，渲染用户自定义头像
        // 2.1.1 设置用户自定义头像的src属性并显示
        $('.user-avatar').attr('src',user.user_pic).show();
        // 2.1.2 隐藏文本头像
        $('.text-avatar').hide();
        return
    }
    // 2.2 用户自定义属性为空，渲染文本头像
    // 2.2.1 提取name属性的第一个字符作为文本头像并大写显示
    let first = name.slice(0,1).toUpperCase();
    // 2.2.2 将大写的首字母渲染到文本头像内,并显示文本头像
    $('.text-avatar').html(first).show();
    // 2.2.3 隐藏用户自定义头像
    $('.user-avatar').hide();
}