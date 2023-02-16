const { log } = require("console");
const { link } = require("fs");
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
        let emailTypePromise=waitAndType('input[id="ap_email"]',email);
        return emailTypePromise;
    })
    .then(function(){
        console.log("Email typed");
        let clickContinuePromise=cTab.click('input[id="continue"]');
        return clickContinuePromise;
    })
    .then(function(){
        console.log("Continue clicked for email");
        let passwordTypePromise=waitAndType('input[id="ap_password"]',password);
        return passwordTypePromise;
    })
    .then(function(){
        console.log("Password typed");
        let clickContinuePromise=cTab.click('input[id="signInSubmit"]');
        return clickContinuePromise;
    })
    .then(function(){
        console.log("SignIn clicked");
        let searchForMobilePromise=waitAndType('input[placeholder="Search Amazon"]',"Mobile Phones");
        return searchForMobilePromise;
    })
    .then(function(){
        console.log("Mobile Phones typed");
        let pressEnterPromise=cTab.keyboard.press("Enter");
        return pressEnterPromise;
    })
    .then(function(){
        console.log("Enter pressed");
        let wait3secPromise=cTab.waitForTimeout(3000);
        return wait3secPromise;
    })
    .then(function(){
        console.log("3 Second wait done");
        function getOnePlusLink(){
            let linksArr=[];
            let links=document.querySelectorAll('li[id="p_89/OnePlus"] span .a-link-normal.s-navigation-item',{delay:1000});
            for(let i=0;i<links.length;i++){
                linksArr.push(links[i].getAttribute('href'));
            }

            return linksArr;
        }
        let clickOnePlusPromise=cTab.evaluate(getOnePlusLink);
        return clickOnePlusPromise;
    })
    .then(function(linksArr){
        console.log(linksArr);
        let fullLink="https://www.amazon.com"+linksArr[0];
        let visitLinkPromise=cTab.goto(fullLink);
        return visitLinkPromise;
    })
    .then(function(){
        console.log("OnePlus product visited");
        let wait4SecProimse=cTab.waitForTimeout(4000);
        return wait4SecProimse;
    })
    .then(function(){
        console.log("Wait for 4 second done");
        function getAllPhonesLink(){
            let phonesLinkArr=[];
            let links=document.querySelectorAll('a[class="a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal"]',{delay:100});
            for(let i=0;i<links.length;i++){
                phonesLinkArr.push(links[i].getAttribute('href'));
            }

            return phonesLinkArr;
        }

        let phonesLinkPromise=cTab.evaluate(getAllPhonesLink);
        return phonesLinkPromise;
    })
    .then(function(phonesLinkArr){
        console.log(phonesLinkArr);
        let fullLink="https://www.amazon.com"+phonesLinkArr[0];
        let visitPhonesPromise=cTab.goto(fullLink);
        return visitPhonesPromise;
    })
    .then(function(){
        console.log("First phone clicked");
        let clickFirstPhonePromise=waitAndClick('input[id="add-to-cart-button"]');
        return clickFirstPhonePromise;
    })
    .then(function(){
        console.log("First phone clicked");
    })

    function waitAndClick(selector){
        let myPromise=new Promise(function(resolve,reject){
            let waitForSelectorPromise=cTab.waitForSelector(selector);
            waitForSelectorPromise
                .then(function(){
                    let clickPromise=cTab.click(selector,{delay:50});
                    return clickPromise;
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


function waitAndType(selector,type){
    let myPromise=new Promise(function(resolve,reject){
        let waitForSelectorPromise=cTab.waitForSelector(selector);
        waitForSelectorPromise
            .then(function(){
                let typePromise=cTab.type(selector,type,{delay:100});
                return typePromise;
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