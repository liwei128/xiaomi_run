//登录
var fs = require('fs');
var url = "https://account.xiaomi.com/pass/serviceLogin?callback=https%3A%2F%2Forder.mi.com%2Flogin%2Fcallback%3Ffollowup%3Dhttps%253A%252F%252Fwww.mi.com%252Findex.html%26sign%3DMjM0MWU0NjBlOTU1YzY4NGQzOTc3MDk4N2M2MjQ5Y2ZiZTMxNTFlZQ%2C%2C&sid=mi_eshop&_bannerBiz=mistore&_qrsize=180";
var user = JSON.parse(fs.read(fs.workingDirectory+'/config/user.json'));

var page = require('webpage').create();    
 
page.settings.loadImages = false;
page.settings.resourceTimeout = 20000; 
window.setTimeout(function () {
            phantom.exit();
        }, 12000);
page.onAlert = function(test){
    console.log(test);
}



function login(){
    phantom.clearCookies();
    page.open(url,function (status) { 
        if (status == 'success') { 
            page.injectJs("./zepto.min.js",function(){
            });
            page.evaluate(function(userName,password){
                $("input[name='user']").val(userName);
                $("input[name='password']").val(password);
                $("input[type='submit']").click();
            },user.userName,user.password);  
        }
        setTimeout(function(){
            var loginStatus = page.evaluate(function(){
				var error = $("span.error-con").html();
				if(error){
					return false;
				}else{
					return true;
				}
            });  
            if(loginStatus){
				if(isSucess(page.cookies)){
					console.log(JSON.stringify(page.cookies));
				}else{
					console.log("confine");
				}
            }else{
				console.log("pwd");
			}
            phantom.exit();
        }, 3000);
    
    });
    
}
function isSucess(cookies){
	var ok = false;
	for(var index in cookies){
        if(cookies[index].name=='userId'){
			ok =true;
		}
		if(cookies[index].name=='JSESSIONID'){
			return false;
		}
    };
	return ok;
}

login();

    
