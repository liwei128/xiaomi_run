
var url = "https://www.mi.com/index.html";
var fs = require('fs');
var user = JSON.parse(fs.read(fs.workingDirectory+'/config/user.json'));


var page = require('webpage').create();    
var settings = {
  operation: "GET",
  encoding: "utf-8",
  headers: {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
  }
};  
page.settings.loadImages = false;
page.settings.resourceTimeout = 20000; 
window.setTimeout(function () {
            phantom.exit();
        }, 10000);
page.onAlert = function(test){
    console.log(test);
}

function setCookies(){
    var jsonList = user.cookies;
    jsonList.forEach(function(cook){  
        cook.expires = (new Date()).getTime() + (1000 * 60 * 60 );
        phantom.addCookie(cook);
    });
    phantom.cookiesEnabled = true;
}

function index(){
    setCookies();
    page.open(url,settings,function (status) { 
        setTimeout(function(){
            page.evaluate(function(){
                var user = $("#J_userInfo>span.user").html();
                if(user){
                    alert(true);
                }else{
					alert(false);
				}
            });
            phantom.exit();
        }, 3000);
    
    });
    
}

index();

    
