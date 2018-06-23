//获取商品购物页面url
var fs = require('fs');
var system = require('system');
var url = system.args[1];

setTimeout(function () {
        phantom.exit();
    }, 12000);

var  page = require('webpage').create(); 
page.settings.loadImages = false;
page.settings.resourceTimeout = 8000;

page.onAlert = function(test){
    console.log(test);
}


function queryGoodsBuyUrl(){
	var s= new Date().getTime();
    page.open(url,function (status) { 
        setTimeout(function(){
	        page.injectJs("./zepto.min.js",function(){
	        });
	        var goodsBuyUrl = page.evaluate(function(){
		        return $(".btn.btn-small.btn-primary").eq(0).attr("href");
	        });
	        console.log(goodsBuyUrl);
	        phantom.exit();
        },1000);
		
    });
}
queryGoodsBuyUrl();




