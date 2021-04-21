// 定义layer
var layer = layui.layer;
var form = layui.form;

$(function () {
    // 调用初始化文章列表函数
    initArtcateList();

    // 给添加按钮绑定点击事件
    var indexadd = null;
    $('.btnAdd').on('click',function () {
        layui.use('layer', function(){
            var layer = layui.layer;
            
            indexadd = layer.open({
                title: '添加文章分类'
                // layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                ,type: 1
                // 设置弹出层的宽高
                ,area: ['500px', '250px']
                // 设置弹出层的内容区，使用选择器传入script脚本文件编写的html结构
                ,content: $('#dialog-add').html()
            }); 
        }); 
    })

    // 给add表单添加submit事件，因为form表单是通过添加按钮的点击事件生成的，所以此处不能将submit事件直接绑定到form表单身上，而是要通过事件委托来完成监听submit事件
    $('body').on('submit','.dialog-form',function (e) {
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                if(res.status) {
                    return layer.msg('添加文章分类失败！')
                }
                layer.msg('添加文章分类成功！');
                // 重新渲染文章分类列表
                initArtcateList();
                // 添加成功后自动关闭添加页面
                layer.close(indexadd);
            }
        })
    })

    // 给form表单里的编辑按钮添加点击事件，同理也需要使用事件代理的方式绑定点击事件
    var indexedit = null;
    $('tbody').on('click','.btn-edit',function () {
        // 弹出弹出层
        layui.use('layer', function(){
            var layer = layui.layer;
            
            indexedit = layer.open({
                title: '添加文章分类'
                // layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                ,type: 1
                // 设置弹出层的宽高
                ,area: ['500px', '250px']
                // 设置弹出层的内容区，使用选择器传入script脚本文件编写的html结构
                ,content: $('#dialog-edit').html()
            }); 
        }); 

        // 发起ajax请求，显示对应行数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + $(this).attr('data-id'),
            success: (res) => {
                if(res.status) {
                    return layer.msg('获取文章分类失败！')
                }
                // 填充表单信息
                form.val('form-edit', res.data);
            }
        })
    })

    // 给编辑的确认按钮绑定点击事件
    $('body').on('submit','.dialog-edit',function (e) {
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                if(res.status) {
                    return layer.msg('修改文章分类失败！')
                }
                layer.msg('修改文章分类成功！');
                // 重新渲染文章分类列表
                initArtcateList();
                // 添加成功后自动关闭添加页面
                layer.close(indexedit);
            }
        })
    })

    // 给删除按钮绑定点击事件
    $('tbody').on('click','.btn-del',function () {
        // 发起ajax请求，删除对应行数据
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + $(this).attr('data-id'),
            success: (res) => {
                if(res.status) {
                    return layer.msg('删除文章分类失败！')
                }
                layer.msg('删除文章分类成功！')
                // 重新渲染分类列表
                initArtcateList();
            }
        })
    })

    // 初始化文章分类列表
    function initArtcateList() {
        // 发起ajax请求，获取文章列表
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // 将获取到的数据渲染到模板引擎
                let htmlStr = template('tpl-table',res);
                // 将渲染得到的模板引擎字符串添加到tbody
                $('tbody').html(htmlStr);
            }
        })
    }


})