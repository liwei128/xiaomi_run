//获取首页所有商品链接
var fs = require('fs');
var url = "https://www.mi.com/index.html";

setTimeout(function () {
        phantom.exit();
    }, 12000);

var  page = require('webpage').create(); 
page.settings.loadImages = false;
page.settings.resourceTimeout = 8000;

page.onAlert = function(test){
    console.log(test);
}


function queryGoodsList(){
    page.open(url,function (status) { 
		page.injectJs("./zepto.min.js",function(){
		});
		var goodsList = page.evaluate(function(){
			var goodsList = [];
			$(".site-category-list>li").each(function(){
				$(this).find("div.children>ul").each(function(){
					$(this).find("li").each(function(){
						goodsList[goodsList.length] = $(this).find("a").attr("href");
					});
				});
			});
			return goodsList;
		});
		console.log(JSON.stringify(goodsList));
		phantom.exit();
    });
}
queryGoodsList();




