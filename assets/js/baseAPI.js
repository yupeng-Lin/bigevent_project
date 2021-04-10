// jQuery的内置方法ajaxPrefilter
// 每次发起$.get(),$.post()或$.ajax()请求前都会调用此函数
$.ajaxPrefilter(function(options) {
    // options是发送请求的配置对象
    // 拼接根地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})