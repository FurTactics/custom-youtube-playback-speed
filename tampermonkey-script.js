// ==UserScript==
// @name           YouTube Faster Playback Speed Buttons
// @version        0.9.1
// @license        MIT
// @description    Adds faster playback speed buttons to youtube player control bar with remember choice ability.
// @author         Cihan Tuncer
// @author         FurTactics
// @match          https://www.youtube.com/*
// @grant          unsafeWindow
// @namespace      https://greasyfork.org/users/463229
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Variable to store last URL for a URL change observer
let lastUrl = location.href;

// Try to icrease perfomance of observers with smaller content to look at
const targetNode = document.querySelector('#content') || document.body;

var chnCurrSpeed = "x1";

var btns = [];

var x100 = makeBtn("x1","1x",1);
var x125 = makeBtn("x125","1.25x",1.25);
var x150 = makeBtn("x150","1.50x",1.50);
var x175 = makeBtn("x175","1.75x",1.75);
var x200 = makeBtn("x2","2x",2);

var remBtn = document.createElement("button");

remBtn.className = "ytp-button chn-button";
remBtn.title = "Remember Playback Speed";
remBtn.style.top = "-17px";
remBtn.style.width = "12px";
remBtn.style.height = "12px";
remBtn.style.border = "2px solid white";
remBtn.style.borderRadius = "50%";
remBtn.style.opacity = ".5";
remBtn.style.marginRight = "12px";
remBtn.style.position = "relative";
remBtn.style.background = "transparent";
remBtn.style.padding = "0";

// Create the inner circle
var innerCircle = document.createElement("div");
innerCircle.style.width = "4px";
innerCircle.style.height = "4px";
innerCircle.style.borderRadius = "50%";
innerCircle.style.backgroundColor = "#3ea6ff";
innerCircle.style.position = "absolute";
innerCircle.style.top = "50%";
innerCircle.style.left = "50%";
innerCircle.style.transform = "translate(-50%, -50%)";
innerCircle.style.display = "none";


remBtn.appendChild(innerCircle);


function callbackFunc (controlsMenu) {

    if (typeof controlsMenu !== 'undefined' && controlsMenu !== null) {
        controlsMenu.prepend(x200);
        controlsMenu.prepend(x175);
        controlsMenu.prepend(x150);
        controlsMenu.prepend(x125);
        controlsMenu.prepend(x100);
        controlsMenu.prepend(remBtn);

        var autoSpeed = localStorage.getItem("chnAutoSpeed");
        setStoredSpeed(autoSpeed);

        remBtn.onmouseover = function() { this.style.opacity = 1; }
        remBtn.onmouseleave = function() { this.style.opacity = 0.5; }

        remBtn.onclick = function() {
            var autoSpeed = localStorage.getItem("chnAutoSpeed");

            if (autoSpeed == 1) {
                localStorage.setItem("chnAutoSpeed", 0);
                remBtn.style.borderColor = "";
                innerCircle.style.display = "none";
            } else {
                localStorage.setItem("chnAutoSpeed", 1);
                remBtn.style.borderColor = "#3ea6ff";
                innerCircle.style.display = "block";
            }
        }
    }
}


function setStoredSpeed(autoSpeed) {
    var savedSpeed = localStorage.getItem("chnCurrSpeed") || "x1";

    if (autoSpeed == 1) {
        var savedBtn = document.querySelector("." + savedSpeed);
        savedBtn.click();
        remBtn.style.borderColor = "#3ea6ff";
        innerCircle.style.display = "block";
    }
}


function makeBtn(classname,txt,val){

    txt = txt || "1x";
    val = val || 1;

    var btn = document.createElement("button");
    btn.className = "ytp-button chn-button " + classname;
    btn.style.top = "-13px";
    btn.style.width = "auto";
    btn.style.opacity = ".5";
    btn.style.marginRight = "5px";
    btn.style.position = "relative";
    btn.innerHTML = txt;

    btns.push(btn);

    btn.onmouseover = function() { this.style.opacity=1; }
    btn.onmouseleave = function() { this.style.opacity=.5; }


    btn.onclick = function(){

       chnCurrSpeed = classname;
       localStorage.setItem("chnCurrSpeed", classname);
       setPlayerSpeed(val);
       resetBtns();
       this.style.fontWeight="800"
       this.style.color="#3ea6ff"
    }

    return btn;
}


function resetBtns(){
    var len = btns.length;

    for (var i = 0; i < len; i++) {

        btns[i].style.fontWeight="normal";
        btns[i].style.color="";
    }
}


function waitForTargetElement(callback) {
    const observer = new MutationObserver(() => {
        const videoPlayer = document.querySelector("ytd-player")?.offsetParent;
        const controls = document.querySelector(".ytp-right-controls");
        const controlsAppear = controls?.offsetParent;

        if (videoPlayer && controls && controlsAppear) {

            console.log("[Video Observer] Video and controls found — initialize");
            observer.disconnect();
            callback(controls);
        }
    });

    observer.observe(targetNode, { childList: true, subtree: true });

}


const urlObserver = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        console.log("[URL Observer] URL changed:", currentUrl);
        lastUrl = currentUrl;
        waitForTargetElement(callbackFunc);
    }
});


function setPlayerSpeed(newSpeed) {
    document.getElementsByClassName('html5-main-video')[0].playbackRate = newSpeed;
}


waitForTargetElement(callbackFunc);


urlObserver.observe(targetNode, { childList: true, subtree: true });


