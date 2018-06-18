var fs = require('fs');
var goodsInfo = JSON.parse(fs.read(fs.workingDirectory+'/config/goodsInfo.json'));
var user = JSON.parse(fs.read(fs.workingDirectory+'/config/user.json'));
var index = 0;
var buyUrl = []; 


var settings = {
  operation: "GET",
  encoding: "utf-8",
  headers: {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
  }
}; 

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
		buyUrl[buyUrl.length] = requestData.url;
		//networkRequest.abort();
	}

}

function start(goodsUrl,selectList){

    setCookies();
    buyGoods(goodsUrl,selectList);
}

function buyGoods(goodsUrl,selectList){
	var s= new Date().getTime();
    page.open(goodsUrl,settings,function (status) { 
        setTimeout(function(){
             page.injectJs("./zepto.min.js",function(){
             });
			//选择版本颜色保障服务等	
			for (var i = 0;i<selectList.length;i++){
				setTimeout(function(){
					page.evaluate(function(i,j){
						$(".list-wrap#J_list >div").eq(i).children("ul").children("li").eq(j).click(); 
					},selectList[index].index,selectList[index].value);
					index++;
				},800*i);
			}
            //提交购物车
            setTimeout(function(){
                setCookies();
                page.evaluate(function(){
                	$("#J_buyBtnBox>li>a").click();
                }); 
            },800*selectList.length) ;
			//退出
			setTimeout(function(){
				console.log(JSON.stringify(buyUrl));
               phantom.exit();
            },800*(selectList.length+1)) ;
        },1000);
		
    });
}
start(goodsInfo.url,goodsInfo.params_index);




