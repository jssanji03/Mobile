window.onerror = function (errMsg, scriptURI, lineNumber, columnNumber, errorObj) {
    setTimeout(function () {
        var rst = {
            "错误信息：": errMsg,
            "出错文件：": scriptURI,
            "出错行号：": lineNumber,
            "出错列号：": columnNumber,
            "错误详情：": errorObj
        };

        alert('出错了，下一步将显示错误信息');
        alert(JSON.stringify(rst, null, 10));
    });
};


[].forEach.call(document.querySelectorAll('[data-src]'), function (el) {
    (function (el) {
        el.addEventListener('click', function () {
            el.src = 'img/loading.gif';

            lrz(el.dataset.src)
                .then(function (rst) {
                    el.src = rst.base64;


                    return rst;
                });
        });

        fireEvent(el, 'click');
    })(el);
});


document.querySelector('input').addEventListener('change', function () {
    var that = this;
    // document.querySelector(".item").innerHTML = ""; // 清除預覽
    if (that.files.length > 0) {
        for (var i = 0; i < that.files.length; i++) { 
            lrz(that.files[i], {
                width: 800
            }).then(
                function (rst) {
                    var img = new Image(),
                        div = document.createElement('div'),
                        deleteItem = document.createElement('div'),
                        p = document.createElement('p'),
                        sourceSize = toFixed2(that.files[0].size / 1024),
                        resultSize = toFixed2(rst.fileLen / 1024),
                        scale = parseInt(100 - (resultSize / sourceSize * 100));
        
                    p.style.fontSize = 13 + 'px';
                    deleteItem.className = "js-cancel"
                    p.innerHTML      = '源文件：<span class="text-danger">' +
                        sourceSize + 'KB' +
                        '</span> <br />' +
                        '压缩后传输大小：<span class="text-success">' +
                        resultSize + 'KB (省' + scale + '%)' +
                        '</span> ';
        
                    div.className = 'col-sm-6 cancel';
                    deleteItem.onclick = function () {                          //绑定点击事件
                        this.parentNode.parentNode.removeChild(div)
                    };
                    div.appendChild(deleteItem);
                    div.appendChild(img);
                    div.appendChild(p);
                    const newImages = rotateImage(img)
        
                    newImages.onload = function () {
                        document.querySelector('.item').appendChild(div);
                    };
                    newImages.src = rst.base64;
                    img.onload = function () {
                        document.querySelector('.item').appendChild(div);
                    };
                    img.src = rst.base64;
                //    $(".item").on('click','.js-cancel', function (e) { 
                //         console.log(e);
                //     })
                    /*            /!* ==================================================== *!/
                     // 原生ajax上传代码，所以看起来特别多 ╮(╯_╰)╭，但绝对能用
                     // 其他框架，例如ajax处理formData略有不同，请自行google，baidu。
                     var xhr = new XMLHttpRequest();
                     xhr.open('POST', '/upload');
        
                     xhr.onload = function () {
                     if (xhr.status === 200) {
                     // 上传成功
                     } else {
                     // 处理其他情况
                     }
                     };
        
                     xhr.onerror = function () {
                     // 处理错误
                     };
        
                     // issues #45 提到似乎有兼容性问题,关于progress
                     xhr.upload.onprogress = function (e) {
                     // 上传进度
                     var percentComplete = ((e.loaded / e.total) || 0) * 100;
                     };
        
                     // 添加参数和触发上传
                     rst.formData.append('a', '我是参数');
                     xhr.send(rst.formData);
                     /!* ==================================================== *!/*/
        
                    return rst;
                });
        }
    }
});


document.querySelector('.UA').innerHTML      = 'UA: ' + navigator.userAgent;

function toFixed2 (num) {
    return parseFloat(+num.toFixed(2));
}

/**
 * 替换字符串 !{}
 * @param obj
 * @returns {String}
 * @example
 * '我是!{str}'.render({str: '测试'});
 */
String.prototype.render = function (obj) {
    var str = this, reg;

    Object.keys(obj).forEach(function (v) {
        reg = new RegExp('\\!\\{' + v + '\\}', 'g');
        str = str.replace(reg, obj[v]);
    });

    return str;
};

/**
 * 触发事件 - 只是为了兼容演示demo而已
 * @param element
 * @param event
 * @returns {boolean}
 */
function fireEvent (element, event) {
    var evt;

    if (document.createEventObject) {
        // IE浏览器支持fireEvent方法
        evt = document.createEventObject();
        return element.fireEvent('on' + event, evt)
    }
    else {
        // 其他标准浏览器使用dispatchEvent方法
        evt = document.createEvent('HTMLEvents');
        // initEvent接受3个参数：
        // 事件类型，是否冒泡，是否阻止浏览器的默认行为
        evt.initEvent(event, true, true);
        return !element.dispatchEvent(evt);
    }
}

/**
 * 旋轉圖片
 * @param image         HTMLImageElement
 * @returns newImage    HTMLImageElement
 */
function rotateImage(image) {
    console.log('rotateImage');

    var width = image.width;
    var height = image.height;

    var canvas = document.createElement("canvas")
    var ctx = canvas.getContext('2d');

    var newImage = new Image();

    //旋轉圖片操作
    EXIF.getData(image, function () {
        console.log("hi");
            var orientation = EXIF.getTag(this,'Orientation');
            // orientation = 6;//測試資料
            console.log('orientation:'+orientation);
            switch (orientation){
                //正常狀態
                case 1:
                    console.log('旋轉0°');
                    // canvas.height = height;
                    // canvas.width = width;
                    newImage = image;
                    break;
                //旋轉90度
                case 6:
                    console.log('旋轉90°');
                    canvas.height = width;
                    canvas.width = height;
                    ctx.rotate(Math.PI/2);
                    ctx.translate(0,-height);

                    ctx.drawImage(image,0,0)
                    imageDate = canvas.toDataURL('Image/jpeg',1)
                    newImage.src = imageDate;
                    break;
                //旋轉180°
                case 3:
                    console.log('旋轉180°');
                    canvas.height = height;
                    canvas.width = width;
                    ctx.rotate(Math.PI);
                    ctx.translate(-width,-height);

                    ctx.drawImage(image,0,0)
                    imageDate = canvas.toDataURL('Image/jpeg',1)
                    newImage.src = imageDate;
                    break;
                //旋轉270°
                case 8:
                    console.log('旋轉270°');
                    canvas.height = width;
                    canvas.width = height;
                    ctx.rotate(-Math.PI/2);
                    ctx.translate(-height,0);

                    ctx.drawImage(image,0,0)
                    imageDate = canvas.toDataURL('Image/jpeg',1)
                    newImage.src = imageDate;
                    break;
                //undefined時不旋轉
                case undefined:
                    console.log('undefined  不旋轉');
                    newImage = image;
                    break;
            }
        }
    );
    return newImage;
}

/**
 *
 * 　　　┏┓　　　┏┓
 * 　　┏┛┻━━━┛┻┓
 * 　　┃　　　　　　　┃
 * 　　┃　　　━　　　┃
 * 　　┃　┳┛　┗┳　┃
 * 　　┃　　　　　　　┃
 * 　　┃　　　┻　　　┃
 * 　　┃　　　　　　　┃
 * 　　┗━┓　　　┏━┛Code is far away from bug with the animal protecting
 * 　　　　┃　　　┃    神兽保佑,代码无bug
 * 　　　　┃　　　┃
 * 　　　　┃　　　┗━━━┓
 * 　　　　┃　　　　　 ┣┓
 * 　　　　┃　　　　 ┏┛
 * 　　　　┗┓┓┏━┳┓┏┛
 * 　　　　　┃┫┫　┃┫┫
 * 　　　　　┗┻┛　┗┻┛
 *
 */
