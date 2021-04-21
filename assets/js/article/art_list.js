$(function () {
    var layer = layui.layer;
    
    // 定义美化时间的函数
    template.defaults.imports.dateFormat = function (date) {
        let dateStr = new Date(date);

        let yy = dateStr.getFullYear();
        let mm = padZero(dateStr.getMonth() + 1);
        let dd = padZero(dateStr.getDate());
        
        let h = padZero(dateStr.getHours());
        let m = padZero(dateStr.getMinutes());
        let s = padZero(dateStr.getSeconds());

        return yy + '-' + mm + '-' + dd + '  ' + h + ':' + m + ':' + s
    }

    // 定义补零函数
    function padZero(num) {
        return num > 9 ? num : '0' + num
    }

    // 定义默认查询参数，注意要放在调用初始化函数之前(变量提升)
    var q = {
        pagenum: 1,  //页码值
        pagesize: 2,  //每页显示多少数据
        cate_id: '',  //文章分类的id
        state: '',  //文章的状态
    }

    // 调用初始化下拉框函数
    initSelect();
    // initSelect();
    // 调用初始化表格函数
    initTable();

    // 定义筛选表单的提交事件
    $('#select-form').on('submit',(e) => {
        e.preventDefault();
        // 获取分类和状态
        let cate = $('#cate-select').val();
        let state = $('#state-select').val();
        // 更改q里面的对应值
        q.cate_id = cate;
        q.state = state;
        // 重新调用初始化表格函数，使用更改后的查询对象发起ajax请求
        initTable();
    })

    // 给删除按钮绑定点击事件，事件委托
    $('tbody').on('click','.btn-del',(e) => {
        // 获取当前页面内删除按钮的个数，即当前页面项目的个数
        let length = $('.btn-del').length;
        // 弹出提示框
        layer.confirm('是否删除当前文章?', {icon: 3, title:'提示'}, function(index){
            // 给确认按钮绑定事件，发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + $(e.target).attr('data-id'),
                success: (res) => {
                    if(res.status) {
                        return layer.msg('文章删除失败！');
                    }
                    layer.msg('文章删除成功！');
                    // 删除最后一页的所有项后，会出现不能自动跳转到上一页的bug
                    // 重新渲染表格前需要进行判断，当前页的项目数是否为1，当前页的页数是否为1
                    if(length <= 1){
                        // 当页面内只剩一个项目时，跳转到下一页，或者停留在第一页
                        q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
                    }
                    // 重新渲染表格
                    initTable();
                }
            })
            
            layer.close(index);
        })
    })

    // 给编辑按钮绑定点击事件
    $('tbody').on('click','.btn-edit',(e) => {
        // 跳转到art_edit.html页面，并传递参数，对应文章的id值
        location.href = '/article/art_edit.html?id=' + $(e.target).attr('data-id');
    })


    // 定义初始化下拉框函数
    function initSelect() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if(res.status) {
                    return layer.msg('文章分类获取失败！')
                }
                // 将数据传入模板字符，生成模板字符串
                let htmlStr = template('tpl-select',res);
                $('#cate-select').html(htmlStr);
                layui.use('form', function(){
                    var form = layui.form;
                    // 因为是ajax异步刷新，layui.js文件无法监听到添加的新下拉框选项
                    // 调用form.render()，重新渲染下拉框
                    form.render();
                });
            }
        })
    }

    // 定义初始化表格函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            // 调用查询参数
            data: q,
            success: (res) => {
                if(res.status) {
                    return layer.msg('文章列表获取失败！');
                }
                // 将数据传入模板字符，生成模板字符串
                let htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr);
                // 调用初始化分页函数，将res返回的total参数传入
                initPage(res.total);
            }
        })
    }

    // 定义初始化分页函数
    function initPage(total) {
        layui.use('laypage', function(){
            var laypage = layui.laypage;
            
            //执行一个laypage实例
            laypage.render({
                elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
                ,count: total //数据总数，从服务端得到
                ,limit: q.pagesize  //每页显示的数据条数
                ,curr: q.pagenum  //当前显示第几页
                ,limits: [2,4,6,8,10]  //设置分页组件limit下拉框的数据
                //选择并指定分页条组件的排列顺序
                ,layout: ['count','limit','prev','page','next','skip']  
                //当分页或limit下拉框发生切换时或者laypage.render被调用时触发的回调函数
                ,jump: function (obj,first) {  
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数
                    // 更改查询对象q的参数
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    //首次不执行
                    if(!first){
                        // console.log('非首次执行');
                        // 调用initTable函数需要在非首次的前提下进行，
                        // 否则会因为laypage.render被调用后触发initTable()
                        // 而initTable()又触发initPage()里面的laypage.render
                        // 从而导致死循环
                        initTable();
                }
                  
            }
            });
          });
    }
})