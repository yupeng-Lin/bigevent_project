// 导入layer
const layer = layui.layer;

$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传照片按钮绑定点击事件
    $('.upload').on('click',() => {
        // 1. 模拟点击上传文件的input表单
        $('#chooseImg').click();
    })

    // 为文件选择框绑定change事件，获取上传的文件，并重新初始化裁剪区域
    $('#chooseImg').on('change',function(e) {
        // 1. 获取上传的文件列表
        const filesList = e.target.files;
        // 2. 判断是否上传文件
        if(filesList.length <= 0) {
            return layer.msg('请选择要上传的文件！')
        }
        // 3. 获得文件
        let file = filesList[0];
        // 4. 获得文件的url地址
        let fileUrl = URL.createObjectURL(file);
        console.log(fileUrl);
        // 5. 重新初始化裁剪区域
        $image.cropper('destroy').attr('src',fileUrl).cropper(options);
    })

    // 为上传按钮绑定点击事件
    $('.btnSub').on('click',function() {
        console.log(1);
        // 1.拿到裁剪过后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2.调用接口，上传头像
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL
            },
            success: function(res) {
                if(res.status) {
                    return layer.msg('头像上传失败！')
                }
                layer.msg('头像上传成功！');
                // 调用父页面的getUserInfo()方法，重新渲染用户头像
                parent.getUserInfo();
            }
        })
    })

})