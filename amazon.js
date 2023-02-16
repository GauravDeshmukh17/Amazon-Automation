const puppeteer=require("puppeteer");
const {email,password}=require("./secrets");

let cTab;

let browserOpenPromise=puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args:["--start-maximized"]
});

browserOpenPromise
    .then(function(browser){
        let newTabPromise=browser.newPage();
        return newTabPromise;
    })
    .then(function(newTab){
        cTab=newTab;
        let visitAmazonPagePromise=cTab.goto("https://www.amazon.com");
        return visitAmazonPagePromise;
    })
    .then(function(){
        console.log("Amazon page visited");
    })
