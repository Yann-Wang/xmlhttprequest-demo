function fileUpload(options) {
    var opts = options || {};
    var func = function() {};
    this.fileInput = opts.fileInput || null;
    this.url = opts.url || '';
    this.fileList = [];
    this.onFilter = opts.onFilter || function(f) {return f;};        //选择文件组的过滤方法
    this.onSelect = opts.onSelect || func;            //文件选择后
    this.onProgress = opts.onProgress || func;        //文件上传进度
    this.onSuccess = opts.onSuccess || func;        //文件上传成功时
    this.onFailure = opts.onFailure || func;        //文件上传失败时;
    this.onComplete = opts.onComplete || func;        //文件全部上传完毕时
    this.init();
}
fileUpload.prototype = {
    dealFiles: function(e) {     //获取要上传的文件数组（用户选择文件后执行）
        var files = e.target.files || e.dataTransfer.files;
        this.fileList = this.onFilter(files);
        for(var i = 0, file; file = this.fileList[i]; i++){   //增加唯一索引值
            file.index = i;
        }
        this.onSelect(this.fileList);
        return this;
    },
    removeFile: function(fileDelete) {     //删除某一个文件
        var arrFile = [];
        for(var i = 0, file; file = this.fileList[i]; i++){
            if (file != fileDelete) {
                arrFile.push(file);
            }
        }
        this.fileList = arrFile;
        return this;
    },
    removeAll: function() {     //清空文件队列
        this.fileList = [];
        return this;
    },
    uploadFile: function() {     //上传文件
        var me = this;
        for(var i = 0, file; file = this.fileList[i]; i++){
            (function(file) {
                var formData = new FormData();
                var xhr = new XMLHttpRequest();
                if (xhr.upload) {
                    xhr.upload.addEventListener("progress", function(e) {   // 上传中
                        me.onProgress(file, e.loaded, e.total);
                    }, false);
                    xhr.onreadystatechange = function(e) {      // 文件上传成功或是失败
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                me.onSuccess(file, xhr.responseText);
                                me.removeFile(file);
                                if (!me.fileList.length) {
                                    me.onComplete();   //上传全部完毕。执行回调
                                }
                            } else {
                                me.onFailure(file, xhr.responseText);
                            }
                        }
                    };
                    // 开始上传
                    formData.append('file', file);
                    xhr.open("POST", me.url, true);
                    xhr.send(formData);
                }
            })(file);
        }
    },
    init: function() {
        var me = this;
        //文件选择控件选择
        if (me.fileInput) {
            me.fileInput.addEventListener("change", function(e) { me.dealFiles(e); }, false);
        }
    }
};