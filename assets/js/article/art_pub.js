var layer = layui.layer;
$(function () {
    // 调用初始化分类下拉框函数
    initCate();
    // 初始化富文本编辑器
    initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image')
  
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
  
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面按钮绑定事件
    $('.btnselect').on('click',() => {
        $('#file').click();
    })

    // 更换新的裁剪图片
    $('#file').on('change',(e) => {
        let file = e.target.files[0];
        // 根据选择的文件，创建一个对应的url地址
        let url = URL.createObjectURL(file);
        // 重新渲染$image
        $image.cropper('destroy')
        .attr('src',url)
        .cropper(options)
    })

    //定义初始化状态默认为 已发布
    var state = '已发布';  

    // 监听存为草稿的点击事件，将state更改为 草稿
    $('#btnSave').on('click',function () {
        state = '草稿'
    })

    // 监听表单的提交事件
    $('.form-pub').on('submit',function (e) {
        e.preventDefault();
        // 1.使用FormData格式化获取到的表单数据，将jQuery对象转为DOM对象后传入
        let fd = new FormData($(this)[0]);
        // 2.向fd添加state属性
        fd.append('state',state);
        // 3.把裁剪后的图片转换为blob二进制
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 4.把得到的blob事件对象添加到fd中
            fd.append('cover_img',blob);
            // 5.发起ajax请求，将数据传到服务端，一定要在此处执行，否则获取不到添加的blob
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 如果向服务器提交的是formdata格式的数据，必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: (res) => {
                    if(res.status){
                        return layer.msg('文章发布失败！')
                    }
                    layer.msg('文章发布成功！')
                    // 跳转到文章列表页面
                    location.href = '/article/art_list.html';
                    // 同步左侧列表
                    // $('#art-list', parent.document)从iframe子页面中获取元素
                    $('#art-list', parent.document).addClass('layui-this').siblings().removeClass('layui-this')

                }
            })
        })        
    })

    // 初始化分类下拉框函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if(res.status){
                    return layer.msg('获取分类列表失败！')
                }
                let htmlStr = template('tpl-select',res);
                $('.select').html(htmlStr);
                layui.use('form', function(){
                    var form = layui.form;
                    // 调用form.render()
                    form.render();
                });
                
            }
        })
    }
})