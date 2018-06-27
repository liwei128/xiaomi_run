//获取加入购物车请求链接
var fs = require('fs');
var goodsInfo = JSON.parse(fs.read(fs.workingDirectory+'/config/goodsInfo.json'));
var user = JSON.parse(fs.read(fs.workingDirectory+'/config/user.json'));


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

function start(){
    setCookies();
    buyGoods();
}

function buyGoods(){
    page.open(goodsInfo.url,function (status) { 
        setTimeout(function(){
             page.injectJs("./zepto.min.js",function(){
             });
			//选版本颜色
             if(goodsInfo.version){
            	 page.evaluate(function(version){
 					$("ul.step-one>li[data-value = '"+version+"']").click();
            	 },goodsInfo.version);
             }
             if(goodsInfo.color){
 				page.evaluate(function(color){
 					$("ul.step-list.clearfix:not(.step-one)>li[data-value = '"+color+"']").click();
 				},goodsInfo.color);
             } 
            //提交购物车
	         setTimeout(function(){
	        	 setCookies();
	             page.evaluate(function(){
	             	$("#J_buyBtnBox>li>a").click();
	             }); 
	         },500);
			//退出
			setTimeout(function(){
               phantom.exit();
            },1500) ;
        },1500);
		
    });
}
start();




