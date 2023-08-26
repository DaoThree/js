



SingleTapDetector = function (element, handler) {
    this.element = element;
    this.handler = handler;

    element.addEventListener('touchstart', this, false);
};

SingleTapDetector.prototype.handleEvent = function (event) {
    switch (event.type) {
        case 'touchstart': this.onTouchStart(event); break;
        case 'touchmove': this.onTouchMove(event); break;
        case 'touchend': this.onTouchEnd(event); break;
    }
};

SingleTapDetector.prototype.onTouchStart = function (event) {
    this.element.addEventListener('touchend', this, false);
    document.body.addEventListener('touchmove', this, false);

    this.startX = this.currentX = event.touches[0].clientX;
    this.startY = this.currentY = event.touches[0].clientY;
    this.startTime = new Date().getTime();
};

SingleTapDetector.prototype.onTouchMove = function (event) {
    this.currentX = event.touches[0].clientX;
    this.currentY = event.touches[0].clientY;
};

SingleTapDetector.prototype.onTouchEnd = function (event) {
    var that = this;

    // Has there been one or more taps in this sequence already?
    if (this.tapTimer) {
        // Reset the timer to catch any additional taps in this sequence
        clearTimeout(this.tapTimer);
        this.tapTimer = setTimeout(function () {
            that.tapTimer = null;
        }, 300);
    } else {
        // Make sure the user didn't move too much
        if (Math.abs(this.currentX - this.startX) < 4 &&
            Math.abs(this.currentY - this.startY) < 4) {
            // Make sure this isn't a long press
            if (new Date().getTime() - this.startTime <= 300) {
                // Make sure this tap wasn't part of a selection event
                if (window.getSelection() + '' == '') {
                    // Make sure this tap is in fact a single tap
                    this.tapTimer = setTimeout(function () {
                        that.tapTimer = null;

                        // This is a single tap
                        that.handler(event);
                    }, 300);
                }
            }
        }
    }
};

let contacts = null;


var showSideFlag = false;

function checkShowSide() {
    callAndroid(showSideFlag);
}

function showOne(showSide) {
    showSideFlag = showSide;
    callAndroid(showSide);

    let app = document.getElementsByClassName("app-wrapper-web")[0];
    if (app) {
        app.style.overflowX = "hidden";
    }


    if (!showSide) {
        let msgPanel = document.querySelector('div[data-testid="conversation-panel-messages"]');
        if (msgPanel != null) {
            setTimeout(function () {
                msgPanel.scrollTo(0, 999999);
                console.log('move to ' + msgPanel.scrollHeight + ' - ' + msgPanel.scrollTop + " - " + msgPanel.offsetHeight);

            }, 500);

        }
    }


    let side = document.getElementById("side");
    if (side) {
        side = side.parentElement;
        if (side) {
            side.style.maxWidth = "100vw";
            side.style.flex = "0 0 100%";
            side.style.display = showSide ? "block" : "none";
            let main = side.nextSibling;
            if (main) {
                main.style.flex = "none";
                main.style.width = "100vw";
                main.style.display = showSide ? "none" : "block";
                if (contacts != document.getElementById("pane-side")) {
                    contacts = document.getElementById("pane-side");

//                    let cellFrame = document.querySelectorAll('div[data-testid="cell-frame-container"]');
                    let cellFrame = document.querySelectorAll('[role="listitem"]');
                    //console.log('cellFrame '+cellFrame.length);
                    if (cellFrame && cellFrame.length > 0) {
                        for (let k = 0; k < cellFrame.length; k++) {
                            cellFrame[k].addEventListener('click', function (event) {
                                let hover = event.srcElement || event.target || side.getElementsByClassName("hover")[0] || side.getElementsByClassName("hoverLocal")[0];
                                console.log('1231231');
                                var e = new MouseEvent('mousedown', { 'bubbles': true, 'cancelable': true });
                                showOne(false);
                                setTimeout(function () {
                                    let down = main.querySelectorAll('[data-icon="down"]')[0];
                                    if (down) {
                                        down.click();
                                    }
                                }, 500);
                            });
                        }

                    }

                }
            }
        }
    }



}

function callAndroid(showSide) {
    console.log('showSide 1' + showSide);
    let userIcon = document.querySelector('header.AmmtE');
    try {
        console.log('showSize 0 ' + userIcon);
        if (userIcon == null) {
            showSide = true;
        }
    } catch (err) {

    }

    console.log('showSide 2' + showSide);
    // Android.setBackIcon(showSide);
        JsInterface.loginSuccess();

}

function backClick() {

    console.log('back click');

}


setInterval(function () {


    if (document.querySelector('header[data-testid="chatlist-header"]')) {
        document.querySelector('header[data-testid="chatlist-header"]').parentElement.style.maxWidth = "100vw";
    }
    if (document.getElementsByClassName("landing-title")[0])
        document.getElementsByClassName("landing-title")[0].innerText = "This is an unofficial app for WhatsApp Web";
    if (document.querySelectorAll('[rel="noopener noreferrer"]')[0])
        document.querySelectorAll('[rel="noopener noreferrer"]')[0].style = "display: none";
    if (document.getElementsByClassName("landing-wrapper")[0])
        document.getElementsByClassName("landing-wrapper")[0].style = "padding: 0px !important; width: 100% !important; min-width: 0px !important; height: 100% !important;";
    if (document.getElementsByClassName("landing-header")[0])
        document.getElementsByClassName("landing-header")[0].style = "display: none";
    //    if (document.getElementsByClassName("landing-window")[0])
    //        document.getElementsByClassName("landing-window")[0].style = "margin-left: 0px !important; margin-right: 0px !important; width: 100% !important; height: 100% !important;";
    //

  var phoneNumberCells = document.querySelector('div[aria-details="link-device-phone-number-code-screen-instructions"]');
      if(phoneNumberCells != null){
          phoneNumberCells.style.overflow = "auto"
          phoneNumberCells.parentNode.style.fontSize = "40%"
          phoneNumberCells.parentNode.style.maxWidth = "60%"
      }

    var div = document.querySelector('div._1Mcu-');
    if (div != null) {
        div.style.minWidth = 0;
    }

    var right = document.querySelector('div[data-testid="drawer-right"]');
    if (right != null) {
        right.style.width = '100vw';
        right.style.maxWidth = '100%';
    }

    var middleMark = document.querySelectorAll('div._2Ts6i._2xAQV');
    if (middleMark != null && middleMark[0] != null) {
        middleMark[0].style.display = 'block';
    }

    var content = document.querySelector('div._1jJ70.two');
    if (content != null) {
        content.style.minWidth = '100vw';
        let div = document.querySelector('div.HP5-u');
        if (div != null) {
            div.style.minWidth = '100vw';
        }
    }

    var popup = document.querySelector('div[data-testid="confirm-popup"]');

    if (popup != null) {
        let parent = popup.parentElement;
        if (parent != null) {
            parent.style.width = '100vw';
        }

        let child = popup.children[0];

        //        if(child != null){
        //              child.children[0].style.marginRight = '50px';
        //              child.children[0].style.marginLeft = '50px';
        //        }

        popup.style.minWidth = '100vw';
        popup.style.alignItems = 'inherit';
        popup.style.flexDirection = 'inherit';

    }
    //发送图片的表情等弹窗
    var actionPop = document.querySelector('div._2sDI2._22C8J');
    if (actionPop != null) {

        actionPop.style.width = '100vw';
        actionPop.style.left = '0px';
        actionPop.style.marginLeft = '0px';
    }



    if (contacts != document.getElementById("pane-side") && window.innerWidth < 700) {
        showOne(true);
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(meta);

        var middle = document.querySelector('div[data-testid="drawer-middle"]');
        if (middle.children != null) {
            let childrens = middle.children[0].children;
            if (childrens != null) {

                middle.style.position = "absolute";
                middle.style.width = "100vw";
            } else {
                middle.style.position = "relative";
                middle.style.width = "100vw";
            }
        } else {
            middle.style.position = "relative";
            middle.style.width = "100vw";
        }


    }

    let contents = document.querySelectorAll('div._7GVCb');
    if (contents != null) {
        for (let i = 0; i < contents.length; i++) {
            contents[i].style.paddingLeft = '10px';
            contents[i].style.paddingRight = '10px';
        }

    }

    var backs = document.querySelectorAll('[data-icon="back"]');
    if (backs != null && backs.length == 2) {
        var back = backs[1];
        back.onclick = function () {
            console.log('click click');
        }
    }



    //这里点击头像
    let selfSettingPanel = document.querySelector('div._2Ts6i._1xFRo');
    if(selfSettingPanel){
        selfSettingPanel.style.width = '100vw';
        selfSettingPanel.style.maxWidth = '100vw';
    }

    let flexPanel = document.querySelector('div._2Ts6i._2xAQV');
    if(flexPanel){
          //这里是控制点击+号弹出的相册或者相机面板
            let functionPanel = document.querySelector('div._2Ts6i._3RGKj._318SY');
            if(functionPanel){
                let span = flexPanel.firstChild;
                if(span){
                    let child = span.firstChild;
                    if(child){
                        functionPanel.style.flex = "0 0 0";
                    }else{
                        functionPanel.style.flex = "0 0 100%";
                        functionPanel.style.maxWidth = "100vw";
                    }
                }
            }
    }


//    let drawLeft = document.querySelector('div[data-testid="drawer-left"]');
//    if (drawLeft) {
//        drawLeft.style.flex = '0 0 100%';
//        drawLeft.style.maxWidth = '100%';
//    }

    let formDiv = document.querySelector('div[data-animate-modal-popup="true"]');
    if (formDiv) {
        formDiv.style.width = '100%';
    }



    if (document.querySelectorAll('[data-icon="back"]').length == 2 && document.getElementById('download_status') == null) {
        const attributeSelector = "src*='blob:https://web.whatsapp.com'";
        let imgStatus = document.querySelector(`img[${attributeSelector}]`);
        let vidStatus = document.querySelector(`video[${attributeSelector}]`);
        if (imgStatus || vidStatus) {
            link = document.createElement('a');
            link.id = "download_status";
            link.style.position = "absolute";
            link.style.top = "100px";
            link.style.zIndex = "999";
            link.style.left = "calc(50% - 62px)";
            let div = document.createElement("div");
            div.appendChild(document.createTextNode("Add to favorites"));
            div.style.backgroundColor = "white";
            link.appendChild(div);
            let fname = document.querySelector('[data-animate-status-v3-viewer="true"]') ?.querySelector('span[dir="auto"]') ?.innerText
            if (!fname) {
                fname = link.href.split('.com/')[1]
            }
            if (vidStatus) {
                vidStatus.removeAttribute('autoplay');
                vidStatus.setAttribute('playsinline', 'playsinline');
                link.href = vidStatus.getAttribute('src') + "?" + fname;
                link.download = fname + ".mp4";
                vidStatus.parentElement.prepend(link);
            } else {
                link.href = imgStatus.getAttribute('src') + "?" + fname;;
                link.download = fname + ".jpeg";
                imgStatus.parentElement.prepend(link);
            }
        }
    }

// let userInfoHeader = document.querySelector('div[data-testid="conversation-info-header"]');
//
//    if (userInfoHeader != null) {
//        let avatar = userInfoHeader.getElementsByTagName('div')[0];
//        if(avatar){
//           avatar.style.marginLeft = '30px';
//           userInfoHeader.style.marginLeft = '0px';
//        }
//
//    }
    setTimeout(function(){

            let main = document.getElementById('main');
              if (!main) return;
              let header = main.getElementsByTagName("header")[0];
              if (header != null) {
                      let avatar = header.getElementsByTagName('div')[0];
                      if(avatar){
                         avatar.style.marginLeft = '30px';
                         header.style.marginLeft = '0px';
                      }

                  }
              header.style.width = '100vw';
              let before = document.querySelector('div._2YnE3');
              let backA = document.querySelector('a.back_class');
              if (header && header.innerHTML && header.innerHTML.indexOf("showOne") < 0) {

                  if (backA == null) {
                      var a = document.createElement('a');
                      a.style.position = 'absolute';
                      a.style.left = '15px';
                      a.href = 'javascript:showOne(true)';
                      a.class = 'back_class';
                      a.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAcFJREFUeF7t2+FNwzAQBWDfBDACbHSZANiADWg3YAPKBLmRYALY4JBRKqVS2lTq2ffOTv43yft8dqWLTanzizrPnzaArQI6F9imQOcFgL8IMvNbSul1Gqh3EdlbDhr0FGDmDyJ6ngdW1b2I7KwQYAGWwufQqvolIo9NA5wLP4X+HsfxoVmAlfC5AtqdAleE/xSRkzXh1kqAWQM8wmc8CACv8BAAnuHdAbzDuwIghHcDQAnvAoAUvjoAWviqAIjhqwGghq8CgBy+OAB6+KIAEcIXA4gSvghApPDmANHCmwJEDG8GwMw7Isrt68VLVc07Obd2go6/N2mIMPMPEd0vvRRyeLMKGIbhN6V0dwbgICIvViNmfR+rClibArAIJgB5VJj5QERPF9YBSAQzgKgIpgAREcwBoiEUAYiEUAwgCkJRgAgIxQHQEaoAICNUA0BFqAqAiFAdAA3BBQAJwQ0ABcEVAAHBHcAbAQLAEwEGwAsBCuBKhHY3Sh7baZfaa13sFV6phLb3Cs+bqkuV0PRe4aWO8vTV6f/AhKrmAxNmZwXMPoxYf6yoeT+4f4Ga4bcKQNktXnvU58/bpoCnPsKzu6+AP+iCh1AExwYgAAAAAElFTkSuQmCC)';
                      a.style.width = '20px';
                      a.style.height = '24px';
                      a.style.backgroundSize = '100% 100%';
                      a.style.backgroundRepeat = 'no-repeat';
                      a.style.margin = '0px 12px 0px 0px';
                      header.appendChild(a);


                  }

              }


    },100)

     let cellFrame = document.querySelectorAll('[role="listitem"]');
//    let cellFrame = document.querySelectorAll('div[data-testid="cell-frame-container"],div[data-testid="message-yourself-row"]');
    if (cellFrame && cellFrame.length > 0) {
        for (let k = 0; k < cellFrame.length; k++) {
            cellFrame[k].addEventListener('click', function (event) {
                let hover = event.srcElement || event.target || side.getElementsByClassName("hover")[0] || side.getElementsByClassName("hoverLocal")[0];
                console.log('1231231');
                var e = new MouseEvent('mousedown', { 'bubbles': true, 'cancelable': true });
                showOne(false);
                setTimeout(function () {
                    let down = main.querySelectorAll('[data-icon="down"]')[0];
                    if (down) {
                        down.click();
                    }
                }, 500);
            });
        }
    }



}, 800);
//sendMedia("972506200332@c.us", "");


function triggerMouseEvent(node, eventType) {
    var clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
}

function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

async function markMessageRead(message) {
    ["mouseover", "mousedown", "mouseup", "click"].map((event) => triggerMouseEvent(message, event));
    await sleep(1000);
}

async function markAllRead() {
    for (const message of document.querySelectorAll('[aria-label*="unread message"]')) {
        await markMessageRead(message);
    }
    await markMessageRead(document.querySelectorAll('[data-icon*="default-user"]')[1]);
}

function addCss(rule) {
    let css = document.createElement('style');
    css.type = 'text/css';
    css.appendChild(document.createTextNode(rule));
    document.getElementsByTagName("head")[0].appendChild(css);
}
