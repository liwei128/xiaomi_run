var fs = require('fs');
var user = JSON.parse(fs.read(fs.workingDirectory+'/config/user.json'));
var url = "https://static.mi.com/cart/";

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


function submitOrder(){
	setCookies();
    page.open(url,function (status) { 
        setTimeout(function(){
             page.injectJs("./zepto.min.js",function(){
             });
			//提交购物车
			setCookies();
			var isEmpty = page.evaluate(function(i,j){
				if($("#J_cartEmpty").hasClass("hide")){
					$("#J_goCheckout").click();
					return false;
				};
				return true;
				 
			});
			if(isEmpty){
				console.log("购物车为空");
				phantom.exit();
			}else{
				//提交订单
				setTimeout(function(){
					page.evaluate(function(){
						$("#J_addressList>div").eq(0).click();
					}); 
					setCookies(); 
					page.evaluate(function(){
						$("#J_checkoutToPay").click();
					}); 
				},3000);
				//退出
				setTimeout(function(){
					console.log("已提交订单");
				   phantom.exit();
				},3500) ;
			}
            
        },1000);
		
    });
}
submitOrder();




