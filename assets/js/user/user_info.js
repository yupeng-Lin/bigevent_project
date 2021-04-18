
// 导入layer对象
var layer = layui.layer;
// 导入 layui 的 form 对象
var form = layui.form;

$(function() {
    // 定义表单的验证规则
    form.verify({
        // 定义昵称的验证规则
        nickname: function(val) {
            if(val.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间'
            }
        }
    })

    // 调用初始化函数
    initUserInfo();

    // 给重置按钮绑定点击事件，实现重置功能
    $('.btnReset').on('click',(e) => {
        // 禁用默认提交行为
        e.preventDefault();
        // 重新调用初始化函数
        initUserInfo();
    })

    // 给表单绑定提交事件，更新用户的信息
    $(".layui-form").on('submit',(e) => {
        e.preventDefault();
        // 发送ajax的post请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 调用表单的serialize()函数，快速获取表单信息
            data: {
                id: $('[name="id"]').val(),
                nickname: $('[name="nickname"]').val(),
                email: $('[name="email"]').val(),
            },
            success: (res) => {
                if(status) {
                    // 请求失败
                    return layer.msg('更新用户信息失败！')
                }
                // 请求发送成功后，重新调用父页面的获取用户信息的函数
                window.parent.getUserInfo();
                layer.msg('更新用户信息成功！');
            }
        })

    })

})

// 初始化用户信息
function initUserInfo() {
    // 发起ajax请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: (res) => {
            // 判断请求是否成功
            if(res.status) {
                // 请求发送失败
                return layer.msg('获取用户信息失败！');
            }
            // // 请求发送成功，调用渲染函数
            // renderUserInfo(res.data);

            // 使用 layui 的 form.val('filter',object)方法给表单快速赋值或取值
            // 其中filter的值等于对应表单的lay-filter属性值，object为要填入表单的数据对象
            // object不存在时则为取值
            form.val('user-form',res.data);
            
        }
    })
}

// // 渲染用户信息
// function renderUserInfo(user) {
//     // 1. 获取用户名并渲染
//     const username = user.username;
//     $('[name="username"]').val(username);
//     // 2. 获取用户昵称，有则渲染
//     const nickname = user.nickname || '';
//     $('[name="nickname"]').val(nickname);
//     // 3. 获取用户邮箱，有则渲染
//     const email = user.email || '';
//     $('[name="email"]').val(email);
// }