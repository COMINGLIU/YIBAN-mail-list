// 搜索框
var search = document.getElementById('search');
// 包含学院的最外层ul
var college = document.getElementById('college');
// 所有学院的院徽集合
var xy = document.getElementsByClassName('xy');
// 每个学院展开之后的ul
var everyCollege = college.querySelectorAll("li>ul");
// 学院个数
var len = xy.length;
// 所有学院名称集合
var xy_name = document.getElementsByClassName('xy-name');
// 学院介绍集合
var query_res = document.getElementsByClassName('query-res');
// 学院展开后所有ul集合
var lists = college.getElementsByTagName('ul');
// 搜索结果集合所在ul
var suggest = document.getElementById('suggest');
// 搜索内容
var nth = document.getElementById('nothing');
//各个学院对应的类名
var classToCollege = {
    "computer": "信息院",
    "math": "数学院",
    "electrical": "电气院",
    "law": "法学院",
    "materialElectirc": "物电院",
    "art": "文学院",
    "business": "工管院",
    "manager": "经管院",
    "hicivilde": "土木院",
    "foreign": "外国院",
    "newsMovie": "新影院",
    "ylsy": "岳麓书院",
    "mechanics": "机械院",
    "material": "材料院",
    "buidding": "建筑院",
    "chemistry": "化工院",
    "environnment": "环境院",
    "biology": "生物",
    "design": "设计院",
    "robot": "机器人学院",
    "marxist": "马克思主义学院",
    "economic-trade": "经贸院",
    "jintong": "金统院",
    "edcucation": "教育学院",
    "sport": "体育学院"
};
//列表展开与关闭
(function(){
    for(var i=0;i<len;i++){
        xy[i].onclick = function(){
            var curList = this.parentNode;
            var listContent = curList.getElementsByTagName('ul')[0];
            /*=====================替换说明=====================================*/ 
            /*将注释部分替换成下列代码，原因：
            *     点击后该元素除了hide类名外还存在特定代表学院标志的类名（之后要用于获取数据）
            *     如果采用注释部分的代码，那么点击之后特定类名将消失，无法用语请求数据，故改成
            *     下列代码，用于添加移除
            * */ 
            //classList表示该元素中所有class集合，classList.contains(value)表示是否存在value这个类名    
            if(listContent.classList.contains("show")){
                // 如果存在则移除remove并添加hide类名，不影响其他类名
                listContent.classList.remove("show");
                listContent.classList.add("hide");
                this.style.backgroundImage = 'url(./images/fold.png)';
            }else{
                listContent.classList.remove("hide");
                listContent.classList.add("show");
                this.style.backgroundImage = 'url(./images/unfold.png)';
            };
            /*==================================================================*/ 
        };
    }
})();
document.addEventListener("click",function() {
    document.getElementById("suggest").innerHTML="";
});
/*===============================从后台获取数据=========================================*/ 
(function() {
    /**/ 
    /*=================获取主页数据并填充=========================*/ 
    // 请求数据的目标区域
    var clickArea = college.querySelectorAll("#college>li");
    // academy表示第几个学院被点击打开
    for(var i=0,len=clickArea.length;i<len;i++) {
        (function(i){
            // 表示某个是否被展开
            clickArea[i].open=false;
            clickArea[i].onclick = function(e) {
                e=e||window.e;
                if(e.stopPropagation) {
                    e.stopPropagation();
                }else {
                    e.cancelBubble=true;
                }
                // 目标填入区域
                var aimArea = clickArea[i].getElementsByTagName("ul");
                // 截取可以代表学院特定意义的类名
                var getId = aimArea[0].className.split("show")[0];
                // 把每个学院ul的className传进去调用getEveryAll()获取数据
                getEveryAll(getId);
                // 点击完毕立即清除
                clickArea[i].onclick = null;
                // 给可能的每个老师名字设置一个点击事件用于获取数据
            }
        })(i);
    }

    /*==============获取搜索数据实现======================*/ 
    search.onchange = function(){
        if(search.value!="") {
            var val = search.value;
            // 使用encodeURI对中文进行编码，在后台用decodeURI进行解码就行了
            var en = encodeURI(val);
            //包含所有搜索结果的ul
            var oUl = document.getElementById("suggest");
            //执行搜索向后台请求数据
            getSearchData(en);
            //把oUl清空否则搜索会叠加
            oUl.innerHTML = "";
        }
    };

    /*
        getSearchData(en)需要后台把被编码之后的中文解码，然后返回中文对应的名字
        注意：用户可能只是输入一个姓或全名或非全名，前台把用户输入的数据传到后台，后台
                解析成中文后需要进行匹配符合所有条件的老师返回  
    */ 
    
    // 获取每个学院的所有老师
    function getEveryAll(thisID) {
        //console.log(thisID);
        $.ajax({
            type:"POST",
            url:"./MyController",
            dataType:"json",
            contentType:"application/x-www-form-urlencoded;charset=utf-8",
            data:{
                gid: thisID,
                action: "getEveryAll"
            },
            error:function () {
                alert("暂无教师信息，可以尝试刷新后再次操作");
            },
            success:function (data) {
                // 文档碎片
                var frag = document.createDocumentFragment();
                // 学院ul
                var oUl = document.getElementsByClassName(thisID)[0];
                // 创建li,并把li添加进oUl中
                for(var i=0,len=data.hide.length;i<len;i++) {
                    var item = document.createElement("li");
                    item.innerHTML = data.hide[i];
                    (function(i){
                        var temp=data.hide[i];
                        item.onclick=function(e) {
                            if(e.stopPropagation) {
                                e.stopPropagation();
                            }else {
                                e.cancelBubble = true;
                            }
                            // setnData表示把用户输入的数据编码之后
                            var sentData = encodeURI(temp);
                            window.location.href="detail.html?name="+sentData;
                        }
                    })(i);
                    frag.appendChild(item);   
                }
                oUl.appendChild(frag);
                // 只有把所有li都放进oUl后li才在文档中，才能使用选择符表示，所以把数据放在之后渲染
            }
        });
    }

    // 获取搜索数据(数据格式应是：匹配到的所有老师名字)
    function getSearchData(thisID) {
        $.ajax({
            type:"POST",
            url:"./MyController",
            dataType:"json",
            contentType:"application/x-www-form-urlencoded;charset=utf-8",
            data:{
                gid: thisID,
                action: "getSearchData"
            },
            error:function () {
                alert("搜索不到对应的信息，请尝试更换关键词");
            },
            success:function (data) {
                // 把获取到的数据保存在searchData里
                var frag = document.createDocumentFragment();
                var suggestArea = document.getElementById("suggest");
                var num=0;
                for(var key in data) {
                    var item = document.createElement("li");
                    (function(key) {
                        item.innerHTML = key+"<span>"+classToCollege[data[key]]+"</span>";
                        item.onclick = function() {
                            var sentData = encodeURI(key);
                            window.location.href="detail.html?name="+sentData;
                            //清除点击事件防止内存泄漏
                            item.onclick=null;
                        };
                        num++;
                    })(key);
                    frag.appendChild(item);
                }
                suggestArea.appendChild(frag);
            }
        });
    }
})();
/*======================================获取数据结束============================================*/