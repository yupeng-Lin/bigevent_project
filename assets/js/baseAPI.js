// jQuery的内置方法ajaxPrefilter
// 每次发起$.get(),$.post()或$.ajax()请求前都会调用此函数
// 统一配置 ajax 对象
$.ajaxPrefilter(function(options) {
    // options是发送请求的配置对象
    // 拼接根地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 判断访问的是否是有权限的接口，有选择性的发送 headers
    // indexOf() 可以用来判断字符串内是否含有指定的子串，
    // 找得到就返回一个实数，找不到则返回 -1
    if(options.url.indexOf('/my' !== -1)) {
        // 访问的是有权限的接口
        // 因为请求的是有权限访问的接口，故需配置headers请求头的Authorization属性，
        // 发送token，用于身份认证，从浏览器的 localStorage 中获取服务端发来的 token 字段
        // 找不到则默认发送空字符串
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 访问的不是有权限的接口，无需配置请求头

    // jQuery的ajax请求有三种回调函数，
        // success(成功执行), error(错误执行), complete(请求完成执行，不管成功与否)
        // 在 complete 回调函数内判断用户的登陆状态，禁止用户未登录访问后台页面
        options.complete = (res) => {
            // complete 回调函数的返回参数中的 responseJSON 属性传递了信息对象
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1.1 清空token字符串
                localStorage.removeItem('token');
                // 1.2 强制跳转回login页面
                location.href = '/login.html';
            }
        }
})