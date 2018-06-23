//获取加入购物车请求链接
var fs = require('fs');
var goodsInfo = JSON.parse(fs.read(fs.workingDirectory+'/config/goodsInfo.json'));
var user = JSON.parse(fs.read(fs.workingDirectory+'/config/user.json'));
var index = 0;


function setCookies(){
    var jsonList = user.cookies;
    jsonList.forEach(function(cook){  
        cook.expires = (new Date()).getTime() + (1000 * 60 * 60 );
        phantom.addCookie(cook);
    });
    phantom.cookiesEnabled = true;
}

setTimeout(function () {
        phantom.exit();
    }, 12000);

var  page = require('webpage').create(); 
page.settings.loadImages = false;
page.settings.resourceTimeout = 8000;

page.onAlert = function(test){
    console.log(test);
}
page.onResourceRequested = function(requestData,networkRequest){
	var fdStart = requestData.url.indexOf("https://cart.mi.com/cart/add/");
	if(fdStart == 0){
		console.log(requestData.url);
		networkRequest.abort();
		phantom.exit();
	}

}

function start(goodsUrl,selectList){

    setCookies();
    buyGoods(goodsUrl,selectList);
}

function buyGoods(goodsUrl,selectList){
	var s= new Date().getTime();
    page.open(goodsUrl,function (status) { 
        setTimeout(function(){
             page.injectJs("./zepto.min.js",function(){
             });
			//选择版本颜色保障服务等	
			for (var i = 0;i<selectList.length;i++){
				setTimeout(function(){
					page.evaluate(function(i,j){
						if(i==0){
							$("ul.step-one>li").eq(j).click();
						}
						if(i==1){
							$("ul.step-list.clearfix:not(.step-one)>li").eq(j).click();
						}
					},selectList[index].index,selectList[index].value);
					index++;
				},1000*i);
			}
            //提交购物车
            setTimeout(function(){
                setCookies();
                page.evaluate(function(){
                	$("#J_buyBtnBox>li>a").click();
                }); 
            },1000*selectList.length) ;
			//退出
			setTimeout(function(){
               phantom.exit();
            },1000*(selectList.length+1)) ;
        },1000);
		
    });
}
start(goodsInfo.url,goodsInfo.params_index);




