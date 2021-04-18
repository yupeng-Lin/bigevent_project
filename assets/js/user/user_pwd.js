// 重置密码页面的js文件
// 导入layui的form对象
const form = layui.form;
// 导入layui的layer对象
const layer = layui.layer;

$(function() {
    // 定义表单的校验规则
    form.verify({
        // 密码的校验规则，6-12位之间，且不能出现空格
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格！'
        ],
        // 定义重新输入密码的验证规则
        comfirm_pwd: function(val) {
            if(val !== $('[name="new-pwd"]').val()) {
                return '密码输入不一致，请重新确认新密码！'
            }
        },
    })

    // 调用表单提交事件
    $('.layui-form').on('submit',(e) => {
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('[name="origin-pwd"]').val(),
                newPwd: $('[name="new-pwd"]').val()
            },
            success: (res) => {
                if(res.status) {
                    return layer.msg('密码重置失败，' + res.message)
                }
                layer.msg('密码重置成功！');
                // 调用DOM元素表达的reset()方法，重置表单元素
                $('.layui-form')[0].reset();
            }
        })
    })
})