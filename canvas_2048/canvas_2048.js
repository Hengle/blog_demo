window.onload = function(){
    var restart = document.getElementById("restart");
    restart.addEventListener("click",function(){
        _init(4);
        draw_2048();
    });
    var colors = ["60,60,180","180,60,60","60,180,60","30,90,240"];
    var list ;
    var can = document.getElementById("canvas");
    can.width = 400;
    can.height = 400;
    var ctx = can.getContext("2d");
    var bgPath = new Path2D();
    /* 绘制2048背景路径 */
    bgPath.moveTo(0,0);
    bgPath.lineTo(400,0);
    bgPath.lineTo(400,400);
    bgPath.lineTo(0,400);
    bgPath.lineTo(0,0);
    bgPath.moveTo(0,100);
    bgPath.lineTo(400,100);
    bgPath.moveTo(400,200);
    bgPath.lineTo(0,200);
    bgPath.moveTo(0,300);
    bgPath.lineTo(400,300);
    bgPath.moveTo(300,0);
    bgPath.lineTo(300,400);
    bgPath.moveTo(200,400);
    bgPath.lineTo(200,0);
    bgPath.moveTo(100,0);
    bgPath.lineTo(100,400);
    _init(4);
    draw_2048();
    /* 监听按键触发事件 */
    window.onkeydown=function(e){
        console.log(e.keyCode);
        switch(e.keyCode){
            case 65: // A
            case 37:
                action("left");
                break;
            case 87: // W
            case 38:
                action("up");
                break;
            case 68: // D
            case 39:
                action("right");
                break;
            case 83: // S
            case 40:
                action("down");
                break;
            default: break;
        }
    };

    /*
     *2048模型对象
     *num：方块显示数字，（2的幂次方，2,4,8,16,...,2048）
     *index: 方块位置索引（1-16）
     */
    function _2048(num,index){
        var _this = this;
        (function(){
            _this.pos = {};
            init();
        })();
        function init(){
            _this.row = Math.ceil(index / 4);
            _this.col = (index % 4 == 0) ? 4 : index % 4;
            _this.pos.y = (_this.row - 1) * 100 + 2;
            _this.pos.x = (_this.col - 1) * 100 + 2;
            _this.num = num;
            _this.pow = Math.log(num) / Math.log(2);//取以2为底的对数
            _this.wei = Math.ceil(Math.log(num) / Math.log(10));//数的位数
            _this.px = Math.floor(80 / _this.wei);
        }
        _this.draw = function(){
            var can_2048 = document.createElement("canvas");
            var ctx_2048 = can_2048.getContext("2d");
            can_2048.width = 96;
            can_2048.height = 96;
            ctx_2048.rect(0 , 0 , 96 , 96);
            ctx_2048.fillStyle = "rgb(" + colors[ _this.pow % colors.length] + ")";
            ctx_2048.fill();
            ctx_2048.font = "normal " + _this.px + "px sans-serif";
            ctx_2048.textAlign = "center";
            ctx_2048.textBaseline = "middle";
            ctx_2048.fillStyle = "#ffffff";
            ctx_2048.fillText(_this.num , 48 , 48);
            ctx.drawImage(can_2048 , _this.pos.x , _this.pos.y);
        }
    }

    /*
     *初始化函数
     *num ：初始化2048方块个数（1-16）
     */
    function _init(num){
        list = [];
        while(array_length(list) < num){
            var rnd = Math.ceil(Math.random()*16);
            if( list[rnd] == undefined ){
                list[rnd] = Math.pow(2 , Math.ceil(Math.random()*2));
            }else{
                continue;
            }
        }
        console.log(list);
    }

    /*
     *随机出现一个新方块
     */
    function _new(){
        var rnd = Math.ceil(Math.random()*16);
        if(array_length(list) < 16){
            while(list[rnd] != undefined ){
                rnd = Math.ceil(Math.random()*16);
            }
            list[rnd] = Math.pow(2 , Math.ceil(Math.random()*2));
        }else{
            console.log("full");
        }
    }

    /*
     *2048操作函数
     *direction：移动方向
     */

    function action(direction){
        switch(direction){
            case "left":
                for(var i = 1 ; i <= 13 ; i += 4){
                    var first = i ;
                    for(var j=i + 1 ; j <= i + 3 ; j++){
                        if(list[j] == undefined){
                            continue;
                        }
                        var cur = j;
                        while(list[cur -= 1] == undefined && cur >= first){
                            list[cur] = list[cur + 1];
                            removeBy(list , cur + 1);
                        }
                        cur++;
                        if(cur > first && list[cur] == list[cur - 1]){
                            list[cur - 1] += list[cur];
                            removeBy(list , cur);
                            first = cur;
                        }
                    }
                }
                break;
            case "right":
                for(var i = 1 ; i <= 13 ; i += 4){
                    var first = i + 3;
                    for(var j=i + 2 ; j >= i ; j--){
                        if(list[j] == undefined){
                            continue;
                        }
                        var cur = j;
                        while(list[cur += 1] == undefined && cur <= first){
                            list[cur] = list[cur - 1];
                            removeBy(list , cur - 1);
                        }
                        cur--;
                        if(cur < first && list[cur] == list[cur + 1]){
                            list[cur + 1] += list[cur];
                            removeBy(list , cur);
                            first = cur;
                        }
                    }
                }
                break;
            case "up":
                for(var i = 1 ; i <= 4 ; i++){
                    var first = i;
                    for(var j = i + 4 ; j <= i + 12 ; j += 4){
                        if(list[j] == undefined){
                            continue;
                        }
                        var cur = j;
                        while(list[cur -= 4] == undefined && cur >= first){
                            list[cur] = list[cur + 4];
                            removeBy(list , cur + 4);
                        }
                        cur += 4;
                        if(cur > first && list[cur] == list[cur - 4]){
                            list[cur - 4] += list[cur];
                            removeBy(list , cur);
                            first = cur;
                        }
                    }
                }
                break;
            case "down":
                for(var i = 1 ; i <= 4 ; i++){
                    var first = i + 12;
                    for(var j = i + 8 ; j >= i ; j -= 4){
                        if(list[j] == undefined){
                            continue;
                        }
                        var cur = j;
                        while(list[cur += 4] == undefined && cur <= first){
                            list[cur] = list[cur - 4];
                            removeBy(list , cur - 4);
                        }
                        cur -= 4;
                        if(cur < first && list[cur] == list[cur + 4]){
                            list[cur + 4] += list[cur];
                            removeBy(list , cur);
                            first = cur;
                        }
                    }
                }
                break;
            default:
                break;
        }
        _new();
        draw_2048();
    }

    /*
     *2048绘制函数
     *根据list数组包含的信息绘制相应方块
     *list数组的索引即方块位置（1-16），内容即数字
     */

    function draw_2048(){
        ctx.clearRect(0,0,400,400);
        ctx.fillStyle = "#efefef";
        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 4;
        ctx.fill(bgPath);
        ctx.stroke(bgPath);
        for(var i in list){
            if(list[i] != undefined){
                var item = new _2048(list[i] , i);
                item.draw();
            }
        }
    }

    /*
     *return：数组实际长度（即不包括undefined或空元素）
     *arr：数组
     */

    function array_length(arr){
        var length = 0;
        for(var i in arr){
            if(arr[i] != undefined){
                length++;
            }
        }
        return length;
    }

    /* 为数组添加根据下标删除相应元素，并且不改变索引！ */
    function removeBy(arr,index){
        arr.splice(index,1,undefined);
    }
};
