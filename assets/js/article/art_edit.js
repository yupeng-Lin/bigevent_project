var layer = layui.layer;

$(function () {
    var id = getId()
    
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

    // 调用初始化页面函数
    initHtml();

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
    $('.form-edit').on('submit',function (e) {
        e.preventDefault();
        // 1.使用FormData格式化获取到的表单数据，将jQuery对象转为DOM对象后传入
        let fd = new FormData($(this)[0]);
        // 2.向fd添加state属性
        fd.append('state',state);
        // 向fd中添加Id属性
        fd.append('Id',id);
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
                url: '/my/article/edit',
                data: fd,
                // 如果向服务器提交的是formdata格式的数据，必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: (res) => {
                    if(res.status){
                        return layer.msg('文章编辑失败！')
                    }
                    layer.msg('文章编辑成功！')
                    // 跳转到文章列表页面
                    location.href = '/article/art_list.html';

                }
            })
        })        
    })
    
    // 定义获取上个页面id的函数
    function getId() {
        // 定义一个全局空对象，获取从上个页面传递的文章的id
        var id = null;
        // 返回url中"?"符后的字串 ('?modFlag=business&role=1')
        var url = location.search;

        // 因为只传递一个参数，可以简化
        // var theRequest = {};  //定义一个空对象，用于接收传递来的参数对象
        // if ( url.indexOf( "?" ) != -1 ) {  //如果url中含有?
        //     var str = url.substr( 1 ); //substr()方法返回从参数值开始到结束的字符串；  
        //     var strs = str.split( "&" );  
        //     for ( var i = 0; i < strs.length; i++ ) {  
        //         theRequest[ strs[ i ].split( "=" )[ 0 ] ] = ( strs[ i ].split( "=" )[ 1 ] );  
        //     }  
        //     // console.log( theRequest ); //此时的theRequest就是我们需要的参数对象；  
        // }
        if(url.indexOf('?') != -1) {
            // 如果有?，则代表有传递参数id
            var str = url.substr(1); //('id=14')
            id = str.split('=')[1];  //('14')
        }

        return id
    }

    // 定义初始化页面函数
    function initHtml() {
        // 调用初始化下拉框函数
        initCate();

        // 根据传递的文章id，发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: (res) => {
                if(res.status) {
                    return layer.msg('获取文章信息失败！')
                }
                // 1.初始化文章标题
                $('.form-edit [name="title"]').val(res.data.title);
                // 2.更改文章分类的当前显示
                layui.use('form', function(){
                    var form = layui.form;

                    // 当前的select的id 
                    $('#select').val(res.data.cate_id);

                    // 一定要刷新select选择框渲染，不能使用默认全部刷新
                    // 因为动态插入的表单元素，form 模块的自动化渲染是会对其失效的
                    form.render('select');
                });
                
                // 3.初始化文章内容
                $('.form-edit [name="content"]').val(res.data.content)

                // 4.初始化文章封面
                // 待解决
            }
        })
    }

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