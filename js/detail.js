// 渲染detail页面数据
(function(document) {
    // 从url上获取上一个页面传过来的信息，用于发送给后台拉取数据
    var sentData = window.location.search.split("?name=")[1],
        doc = document;
    // 拉取数据
    window.onload = function() {
        getDetail(sentData);
        // 此时获取电话号码用于之后拨号
        var tel = doc.getElementById("offNumber").innerHTML;
    };
        // 获取所需元素
    var ele = {
            // 复制按钮
            oCopyBtn: doc.getElementById("copy"),
            // 呼叫按钮
            oCall: doc.getElementById("call"),
            // 信息栏
            aDetailInfos: doc.querySelectorAll(".detail-info p"),
            // 信息栏总右边详情信息
            aInfos: doc.querySelectorAll(".detail-info p span:nth-child(2)"),
            // 办公室
            oOffAdd: doc.getElementById("offAdd"),
            // QQ
            oQqNumber: doc.getElementById("qqNumber"),
            // 办公室号码
            oOffNumber: doc.getElementById("offNumber"),
            // “已复制到粘贴板”提示信息
            oPrompt: doc.getElementsByClassName("prompt")[0],
            // 恢复初始颜色
            clearColor: function(obj,attr) {
                for(var i=0,len=obj.length;i<len;i++) {
                    obj[i].style.cssText="backgroundColor:attr;color:#000";
                }
            },
            // 选中要复制区域的特定信息，element表示要复制文本的元素的id
            selectInfo: function(element) {
                // 只有id才能生效
                var text = document.getElementById(element);
                /*===============自动选中要复制的文本==================*/ 
                if (document.body.createTextRange) {
                    var range = document.body.createTextRange();
                    range.moveToElementText(text);
                    range.select();
                } else if (window.getSelection) {
                    var selection = window.getSelection();
                    var range = document.createRange();
                    range.selectNodeContents(text);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    alert("none");
                }
                /*======================================*/ 
                // 复制文本
                document.execCommand("Copy");
                // 提示“已复制到粘贴板”
                ele.oPrompt.style.opacity = "1";
                // 2s中后提示信息消失
                setTimeout(function() {
                    ele.oPrompt.style.opacity = "0";
                },5000)
            }
        }; 

    // 点击复制按钮
    ele.oCopyBtn.onclick = function() {
        alert("请选择你需要复制的信息栏");
    }
    // 选择要复制的信息栏
    for(var j=0,len=ele.aDetailInfos.length;j<len;j++) {
        (function(j) {
            ele.aDetailInfos[j].onclick = function() {
                switch(j) {
                    case 0:
                        ele.selectInfo("offAdd");
                        break;
                    case 1:
                        ele.selectInfo("qqNumber");
                        break;
                    case 2:
                        ele.selectInfo("offNumber");
                        break;
                }
            }
        })(j);
    }
    //点击空白恢复信息栏颜色
    document.addEventListener("click",function() {
        ele.clearColor(ele.aDetailInfos,"#fff");
    })
    // 拨号实现
    ele.oCall.onclick = function() {
        phone(ele.offNumber);
    }
    // 拨号函数
    function phone(tel) {
        this.location.href="tel://"+tel;
    }
    //获取个人信息的函数
    function getDetail(thisID) {
        $.ajax({
            type:"POST",
            url:"./MyController",
            dataType:"json",
            contentType:"application/x-www-form-urlencoded;charset=utf-8",
            data:{
                gid: thisID,
                action: "getDetail"
            },
            error:function () {
                alert("信息获取失败，请重新操作一遍或刷新页面");
            },
            success:function (data) {
                $("#poSition").html(data.poSition)
                $("#teachersName").html(data.teachersName)
                $("#offAdd").html(data.offAdd)
                $("#qqNumber").html(data.qqNumber)
                $("#offNumber").html(data.offNumber) 
            }
        });
    }
})(document);
