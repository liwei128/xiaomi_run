//自动生成订单
var fs = require('fs');
var user = JSON.parse(fs.read(fs.workingDirectory+'/config/user.json'));
var url = "https://order.mi.com/buy/checkout";

function setCookies(){
    var jsonList = user.cookies;
    jsonList.forEach(function(cook){  
        cook.expires = (new Date()).getTime() + (1000 * 60 * 60 );
        phantom.addCookie(cook);
    });
    phantom.cookiesEnabled = true;
}

function randomNum(){
	return parseInt(9e4*Math.random()+1e4)+"."+parseInt((new Date).getTime()/1e3);
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
	var fdStart = requestData.url.indexOf("https://order.mi.com/buy/confirm");
	if(fdStart == 0){
		networkRequest.abort();
		console.log("订单提交成功,请在15分钟内完成付款!");
		phantom.exit();
	}
	var cart = requestData.url.indexOf("https://static.mi.com/cart/");
	if(cart == 0){
		networkRequest.abort();
		console.log("购物车为空");
		phantom.exit();
	}

}

function submitOrder(){
	setCookies();
	var rUrl = url+"?r="+randomNum();
    page.open(rUrl,function (status) { 
		page.injectJs("./zepto.min.js",function(){
		});
		page.evaluate(function(){
			$("#J_addressList>div").eq(0).click();
		}); 
		setCookies(); 
		page.evaluate(function(){
			$("#J_checkoutToPay").click();
		}); 
    });
}
submitOrder();




