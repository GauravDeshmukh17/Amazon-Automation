const { resolve } = require("path");
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
        let loginClickPromise=waitAndClick('span[id="nav-link-accountList-nav-line-1"]');
        return loginClickPromise;
    })
    .then(function(){
        console.log("Login clicked");
    })

    function waitAndClick(selector){
        let myPromise=new Promise(function(resolve,reject){
            let waitForSelectorPromise=cTab.waitForSelector(selector);
            waitForSelectorPromise
                .then(function(){
                    let clickPromise=cTab.click(selector,{delay:50});
                })
                .then(function(){
                    resolve();
                })
                .catch(function(err){
                    reject(err);
                })
        })

        return myPromise;
    }
