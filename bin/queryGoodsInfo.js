//获取商品详情
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


function queryGoodsInfo(goodsUrl){
	var s= new Date().getTime();
    page.open(goodsUrl,function (status) { 
        setTimeout(function(){
	        page.injectJs("./zepto.min.js",function(){
	        });
	        var goodsInfo = page.evaluate(function(){
	        	var version = [];
		        var color = [];
		        var name = $("h1.pro-title.J_proName").html();
		        $("ul.step-one>li").each(function(){
		        	version[version.length] = $(this).attr('data-value')+" "+$(this).attr('data-price');
		        });
		        $("ul.step-list.clearfix:not(.step-one)>li").each(function(){
		        	color[color.length] = $(this).attr('data-value');
		        });
		        var goodsInfo = {
		        	"version":version,
		        	"color":color,
		        	"name":name
		        };
		        return goodsInfo;
	        });
	        goodsInfo.url=goodsUrl;
	        console.log(JSON.stringify(goodsInfo));
	        phantom.exit();
        },1000);
		
    });
}
queryGoodsInfo(url);




