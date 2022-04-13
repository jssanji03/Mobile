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


document.querySelectorAll('input').forEach((item) => {
    const newNodeBottom = document.createElement("div");
    const hr = document.createElement("hr");
    newNodeBottom.classList.add("row","item","mt-3")
    item.parentNode.appendChild(newNodeBottom)
    item.parentNode.appendChild(hr)
    item.addEventListener('change', function () {
    var that = this;
    // document.querySelector(".item").innerHTML = ""; // 清除預覽
    if (that.files.length > 0) {
        for (var i = 0; i < that.files.length; i++) { 
            lrz(that.files[i], {
                width: 640,
            }).then(
                function (rst) {
                    console.log(rst);
                    var img = new Image(),
                        div = document.createElement('div'),
                        deleteItem = document.createElement('div');
                        // p = document.createElement('p'),
                        // sourceSize = toFixed2(that.files[0].size / 1024),
                        // resultSize = toFixed2(rst.fileLen / 1024),
                        // scale = parseInt(100 - (resultSize / sourceSize * 100));
                        deleteItem.className = "js-cancel"
                        div.className = 'col-sm-6 cancel';
                        deleteItem.onclick = function () {                          //绑定点击事件
                            this.parentNode.parentNode.removeChild(div)
                        };
                        div.appendChild(deleteItem);
                        div.appendChild(img);
                        
                        

                    img.onload = function () {
                        newNodeBottom.appendChild(div);
                        // document.querySelector('.item').appendChild(div);
                        // var parentDOM = document.querySelector(".item");
                        const nameID = newNodeBottom.getElementsByTagName("img")
                        img_load(rst,img)
                        for (let i = 0; i < nameID.length; i++){
                            nameID[i].setAttribute("name", `image.${i}`);
                        }
                    };
                    img.src = rst.base64;
                    
                    
                    return rst;
                }
            );
        }
    }
});
})
// document.querySelector('input').addEventListener('change', function () {
//     var that = this;
//     // document.querySelector(".item").innerHTML = ""; // 清除預覽
//     if (that.files.length > 0) {
//         for (var i = 0; i < that.files.length; i++) { 
//             lrz(that.files[i], {
//                 width: 800,
//             }).then(
//                 function (rst) {
//                     var img = new Image(),
//                         div = document.createElement('div'),
//                         deleteItem = document.createElement('div');
//                         // p = document.createElement('p'),
//                         // sourceSize = toFixed2(that.files[0].size / 1024),
//                         // resultSize = toFixed2(rst.fileLen / 1024),
//                         // scale = parseInt(100 - (resultSize / sourceSize * 100));
                        

                    
                    
//                     deleteItem.className = "js-cancel"
//                     div.className = 'col-sm-6 cancel';
//                     deleteItem.onclick = function () {                          //绑定点击事件
//                         this.parentNode.parentNode.removeChild(div)
//                     };
//                     div.appendChild(deleteItem);
//                     div.appendChild(img);
//                     // div.appendChild(p);
//                     // p.style.fontSize = 13 + 'px';
//                     // p.innerHTML      = '源文件：<span class="text-danger">' +
//                     //     sourceSize + 'KB' +
//                     //     '</span> <br />' +
//                     //     '压缩后传输大小：<span class="text-success">' +
//                     //     resultSize + 'KB (省' + scale + '%)' +
//                     //     '</span> ';
                   
//                     // if (isiOS == true) {
//                     //     img_load(rst,img)
//                     // }
                    

//                     img.onload = function () {
//                         document.querySelector('.item').appendChild(div);
//                         var parentDOM = document.querySelector(".item");
//                         const nameID = parentDOM.getElementsByTagName("img")
//                         img_load(rst,img)
//                         for (let i = 0; i < nameID.length; i++){
//                             nameID[i].setAttribute("name", `image.${i}`);
//                         }
//                     };
//                     img.src = rst.base64;
                    
                    
//                     return rst;
//                 }
//             );
//         }
//     }
// });


document.querySelector('.UA').innerHTML = 'UA: ' + navigator.userAgent;


function toFixed2 (num) {
    return parseFloat(+num.toFixed(2));
}

function img_load(rst, img) {
    const file = rst.origin
    if (file) {
        EXIF.getData(file, function () {
            const exifOrientation = EXIF.getTag(this, 'Orientation');
            let newImage = img;
            const ua = navigator.userAgent;
            const mobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua);
            if (/iPad|iPhone|iPod/i.test(ua)) {
                    console.log(("iphone"));
                    if (exifOrientation == 6 || exifOrientation == 8 || exifOrientation == 3 || exifOrientation == undefined ) {
                        switch(exifOrientation){
                            case 3:
                                console.log('3 旋轉180°');
                                rotateAngle = 180;
                                newImage.style.transform = 'rotate('+rotateAngle+'deg)'
                                break;
                            case 6:
                                console.log('6 向左旋轉90°');
                                rotateAngle = -90;
                                newImage.style.transform = 'rotate('+rotateAngle+'deg)'
                                break;
                            case 8:
                                console.log('8 向右旋轉90');
                                rotateAngle = 90;
                                newImage.style.transform = 'rotate('+rotateAngle+'deg)'
                                break;
                            case undefined:
                                console.log('undefined  不旋轉');
                                newImage = img;
                                break;
                        }
                    } 
                } else {
                    console.log("desktop Andriod");
                    return
                }
            return newImage;
        });
    }
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


