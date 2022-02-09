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


// [].forEach.call(document.querySelectorAll('[data-src]'), function (el) {
//     (function (el) {
//         el.addEventListener('click', function () {
//             el.src = 'img/loading.gif';

//             lrz(el.dataset.src)
//                 .then(function (rst) {
//                     el.src = rst.base64;


//                     return rst;
//                 });
//         });

//         fireEvent(el, 'click');
//     })(el);
// });


document.querySelector('input').addEventListener('change', function () {
    var that = this;
    // document.querySelector(".item").innerHTML = ""; // 清除預覽
                    
    if (that.files.length > 0) {
        for (var i = 0; i < that.files.length; i++) { 
            lrz(that.files[i], {
                width: 800,
            }).then(
                function (rst) {
                    var img = new Image(),
                        div = document.createElement('div'),
                        deleteItem = document.createElement('div'),
                        p = document.createElement('p'),
                        sourceSize = toFixed2(that.files[0].size / 1024),
                        resultSize = toFixed2(rst.fileLen / 1024),
                        scale = parseInt(100 - (resultSize / sourceSize * 100));
                        
                    img_load(rst,img)

                    deleteItem.className = "js-cancel"
                    div.className = 'col-sm-6 cancel';
                    deleteItem.onclick = function () {                          //绑定点击事件
                        this.parentNode.parentNode.removeChild(div)
                    };
                    div.appendChild(deleteItem);
                    div.appendChild(img);
                    // div.appendChild(p);
                    // p.style.fontSize = 13 + 'px';
                    // p.innerHTML      = '源文件：<span class="text-danger">' +
                    //     sourceSize + 'KB' +
                    //     '</span> <br />' +
                    //     '压缩后传输大小：<span class="text-success">' +
                    //     resultSize + 'KB (省' + scale + '%)' +
                    //     '</span> ';
                    
                    img.onload = function () {
                        document.querySelector('.item').appendChild(div);
                    };
                    img.src = rst.base64;
        
                    return rst;
                }
            );
        }
    }
});


document.querySelector('.UA').innerHTML      = 'UA: ' + navigator.userAgent;

function toFixed2 (num) {
    return parseFloat(+num.toFixed(2));
}

function img_load(rst, img) {
    
    const file = rst.origin
    EXIF.getData(file, function () {
        // var exifData = EXIF.pretty(this);
        const exifOrientation = EXIF.getTag(this, 'Orientation');
        // const width = image.width;
        // const height = image.height;

        // const canvas = document.createElement("canvas")
        // const ctx = canvas.getContext('2d');

        let newImage = img
        
        switch(exifOrientation){
            case 1:
                console.log('旋轉90°');
                rotateAngle = 90;
                newImage.style.transform = 'rotate('+rotateAngle+'deg)'
                break;
            case 6:
                console.log('不旋轉');
                rotateAngle = 0;
                break;
            case 8:
                console.log('8');
                rotateAngle = -90;
                break;
            case undefined:
                console.log('undefined  不旋轉');
                newImage = img;
                break;
        }
        return newImage;
        // img.onload = function () {
        //     let rotateAngle = 0;
        //     document.querySelector('.item').appendChild(div);
        //     if (exifOrientation == 1 || exifOrientation == 6 || exifOrientation == 8) {
        //         switch(exifOrientation){
        //             case 1:
        //                 rotateAngle = 90;
        //                 break;
        //             case 6:
        //                 rotateAngle = 0;
        //                 break;
        //             case 8:
        //                 rotateAngle = -90;
        //                 break;
        //         }
        //     } else {
        //         return
        //     }
        //     const el = document.querySelectorAll('img');
        //     el.forEach((e) => {
        //         e.style.transform = 'rotate('+rotateAngle+'deg)'
        //     })
        // };
    });
    // if (file && file.name) {
    // }
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
function rotateAndCompress(image, Orientation) {
    console.log("hi rotateAndCompress");
    console.log(Orientation);
    let imgWidthOrigin = image.width
    let imgHeightOrigin = image.height
    // 壓縮圖片
    let ratio = imgWidthOrigin / imgHeightOrigin
    // 假設壓縮後的圖片的寬度為500px
    let canvasWidth = 500
    let canvasHeight = Math.ceil(500 / ratio)
    // 旋轉並壓縮
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    if (Orientation && Orientation !== 1) {
        switch (Orientation) {
            case 6:
             canvas.width = canvasHeight
             canvas.height = canvasWidth
             ctx.rotate(90 * Math.PI / 180)
             ctx.drawImage(image, 0, -canvasHeight, canvasWidth, canvasHeight)
             break
            case 3:
             ctx.rotate(Math.PI)
             ctx.drawImage(image, -canvasWidth, -canvasHeight, canvasWidth,canvasHeight)
             break
            case 8:
            // 旋轉-90度相當於旋轉了270度
             canvas.width = canvasHeight
             canvas.height = canvasWidth
             ctx.rotate(270 * Math.PI / 180)
             ctx.drawImage(image, -canvasWidth, 0, canvasWidth, canvasHeight)
             break
        }
    } else {
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
    }
}


function rotateImage(image) {
    EXIF.getData(image, function() {
        console.log(image);
        var exifData = EXIF.pretty(this);
        if (exifData) {
            console.log(exifData);
        } else {
            alert("No EXIF data found in image '" + file.name + "'.");
        }
    });
}
 function displayImage(file) {
    var options = {
      maxWidth: resultNode.width(),
      canvas: true,
      pixelRatio: window.devicePixelRatio,
      downsamplingRatio: 0.5,
      orientation: true,
      imageSmoothingEnabled: imageSmoothingNode.is(':checked'),
      meta: true
    }
    if (!loadImage(file, updateResults, options)) {
      removeMetaData()
      resultNode
        .children()
        .replaceWith(
          $(
            '<span>' +
              'Your browser does not support the URL or FileReader API.' +
              '</span>'
          )
        )
    }
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
