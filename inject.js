function getQR() {
    var qr = document.getElementsByTagName("canvas")[0];
    return {connection: document.getElementsByTagName("canvas")[0] == null, qr: qr ? qr.toDataURL() : ""};
}

/*
 export async function loadAllEarlierMessages(id, done) {
   const found = WAPI.getChat(id);
   while (!found.msgs.msgLoadState.noEarlierMsgs) {
     console.log('Loading...');
     await found.loadEarlierMsgs();
   }
 }
 */

async function getChats(user) {
    var chats = [];
    try {
        for (var chat of window.Store.Chat._models) {
            if (chat.__x_id._serialized == user) {
                if (chat.loadEarlierMsgs && !chat.msgs?.msgLoadState?.noEarlierMsgs) {
                    await chat.loadEarlierMsgs();
                }
                for (var msg of chat.msgs._models) {
                    if (msg.__x_type && msg.__x_type != "gp2") {
                        chats.push({ msg: msg.__x_body, type: (msg.__x_type == "ptt") ? "audio" : msg.__x_type, me: msg.__x_isSentByMe /*, n: msg.__x_isNewMsg, t: msg.__x_t*/ });
                    }
                }
                break;
            }
        }
    } catch (e) {
        console.log(e);
    }
    alert(JSON.stringify({ command: "get_chats", chats: chats, connection: document.getElementsByTagName("canvas")[0] == null }));
    //return { chats: chats, connection: document.getElementsByTagName("canvas")[0] == null};
}

function runGetChats(user) {
    getChats(user)
}

async function fetcher(path) {
    let response = await fetch(path);
    let result = await response.body.getReader().read();
    return btoa(String.fromCharCode.apply(null, result.value));
}

/*function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function getNextProfilePic(lastUser) {
    try {
        for (var chat of window.Store.Chat._models) {
            if (lastUser != "" && chat.__x_id && (chat.__x_id._serialized != lastUser))
                continue;
            if (chat.__x_id._serialized == lastUser) {
                lastUser = "";
                continue;
            }
            var last_msg = (chat.msgs && chat.msgs._models && (chat.msgs._models.length > 0)) ? chat.msgs._models[chat.msgs._models.length - 1] : {};
            if (!last_msg.__x_type || last_msg.__x_type == "gp2" || !chat.__x_contact.__x_profilePicThumb || !chat.__x_contact.__x_profilePicThumb.__x_img)
                continue;
            for (var contact of lastContacts) {
                if (contact["u"] == chat.__x_id._serialized) {
                    let image = await fetcher(chat.__x_contact.__x_profilePicThumb.__x_img);
                    if (image && image != "") {
                        alert(JSON.stringify([{u: chat.__x_id._serialized, p: image || ""}]));
                        return;
                    }
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
}

var lastContacts = [];
var lastChange = (new Date()).toString();
function getContacts(lastUpdate, lastUserPic) {
    var contacts = [];
    var index = 0;
    try {
        if (!window.Store || !window.Store.Chat || !window.Store.Chat._models)
            return { contacts: [], connection: document.getElementsByTagName("canvas")[0] == null, lastChange: lastChange };
        for (var chat of window.Store.Chat._models) {
            if (chat.__x_id._serialized && chat.__x_formattedTitle) {
                var contact = {u: chat.__x_id._serialized, n: chat.__x_formattedTitle, c: chat.__x_unreadCount + "" };
                var last_msg = (chat.msgs && chat.msgs._models && (chat.msgs._models.length > 0)) ? chat.msgs._models[chat.msgs._models.length - 1] : {};
                if (last_msg.__x_type && last_msg.__x_type != "gp2") {
                    if (last_msg.__x_type == "chat")
                        contact["m"] = last_msg.__x_body;
                    else
                        contact["m"] = "[" + ((last_msg.__x_type == "ptt") ? "audio" : last_msg.__x_type) + "]";
                    //try {
                    // if (chat.__x_contact.__x_profilePicThumb.__x_img)
                    // contact["p"] = chat.__x_contact.__x_profilePicThumb.__x_img;
                    // } catch {}
                    contact["t"] = (new Date(last_msg.__x_t * 1000)).toLocaleString();
                    contacts.push(contact);
                    index++;
                    if (index == 20)
                        break;
                }
            }
        }
        if (JSON.stringify(contacts) == JSON.stringify(lastContacts) && lastChange == lastUpdate) {
            contacts = [];
            getNextProfilePic(lastUserPic);
        }
        else if (contacts.length > 0) {
            lastChange = (new Date()).toString();
            lastContacts = contacts;
        }
    } catch (e) {
        console.log(e);
    }
    if ((contacts.length == 0) && (document.body.innerText.indexOf("USE HERE") > 0))
        location.reload();
    return { contacts: contacts || [], connection: document.getElementsByTagName("canvas")[0] == null, lastChange: lastChange };
}*/

function sendMsg(user, message) {
    try {
        for (var chat of window.Store.Chat._models)
            if (chat.__x_id && (chat.__x_id._serialized == user))
                return window.Store.SendTextMsgToChat(chat, message);
    } catch (e) {
        console.log(e);
    }
}

function fixBinary(bin) {
    var buf = new ArrayBuffer(bin.length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < bin.length; i++)
        arr[i] = bin.charCodeAt(i);
    return buf;
}

/*function base64ToFile(b64Data, filename) {
    var arr   = b64Data.split(',');
    var mime  = arr[0].match(/:(.*?);/)[1];
    var bstr  = atob(arr[1]);
    var n     = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--)
        u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, {type: mime});
}*/

function sendMedia(user, b64) {
    try {
        for (var chat of window.Store.Chat._models) {
            if (chat.__x_id._serialized == user) {
                var type = b64.split(',')[0].split(';')[0].split(':')[1];
                var binary = fixBinary(atob(b64.split(',')[1]));
                var blob = new Blob([binary], {type: type});
                //var random_name = Math.random().toString(36).substr(2, 5);
                var file = new File([blob], "Click to play", { type: type, lastModified: Date.now() });
                var mc = new window.Store.MediaCollection(chat);
                mc.processAttachments([{file: file}, 1], chat, 1).then(() => {
                    //mc._models[0].mediaPrep._mediaData.type = 'ptt';
                    mc._models[0].sendToChat(chat, { caption: "Sent from Watch Duo for WhatsApp" }); });
                /*var mediaBlob = base64ToFile(b64, Math.random().toString(36).substr(2, 5));
                var mc = new Store.MediaCollection();
                mc.processFiles([mediaBlob], chat, 1).then(() => {
                    mc._models[0].sendToChat(chat, { caption: "Sent by Duo for WhatsApp from my Apple Watch" });
                });*/
                break;
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function getStore() {
    try {
        let two = document.getElementsByClassName("two")[0]
        if (!two || !two.children[3] || two.children[3].childElementCount < 1)
            return;
        window.mR = moduleRaid();
        window.Store = (window.mR.findModule((module) => module.default && module.default.Chat && module.default.Msg)[0] || {}).default;
        window.Store.SendTextMsgToChat = (window.mR.findModule((module) => module && module.sendTextMsgToChat)[0] || {}).sendTextMsgToChat;
        window.Store.MediaCollection = (window.mR.findModule((module) => module.default && module.default.prototype && module.default.prototype.processAttachments !== undefined)[0] || {}).default;
        //window.Store.CryptoLib = (window.mR.findModule((module) => module.decryptE2EMedia ? module : null)[0] || {});
        window.Store.DownloadManager = (window.mR.findModule((module) => module.DownloadManager ? module : null)[0] || {}).default;
    } catch(e) {
        console.log(e);
    }
}

function blobToB64(blob) {
    return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
            resolve(reader.result.substr(reader.result.indexOf(',') + 1));
        };
    });
}

function runGetMedia(user, index) {
    console.log("getMedia called", user, index);
    for (var chat of window.Store.Chat._models) {
        if (chat.__x_id._serialized == user) {
            getMedia(chat.msgs._models[parseInt(index)], user, index);
            break
        }
    }
}

//async function getMedia(msg, user, index) {
//    console.log("getMedia called", msg);
//    let response = await fetch(msg.__x_deprecatedMms3Url);
//    let result = await response.arrayBuffer();
//    let dec = await Store.CryptoLib.decryptE2EMedia(msg.__x_type, result, msg.__x_mediaKey, "image/jpeg");
//    let media = await blobToB64(dec._blob);
//    alert(JSON.stringify({command: "get_media", media: media, type: msg.__x_mimetype ? msg.__x_mimetype.split("/")[1].split(";")[0] : "", user: user, index: index}));
//}

function arrayBufferToBase64(arrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array( arrayBuffer );
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

async function getThumbnail(msg) {
    const dataDownload = { directPath: msg.directPath, encFilehash: msg.encFilehash, filehash: msg.filehash, mediaKey: msg.mediaKey,  type: msg.type, signal: (new AbortController).signal};
    const arraybuffer = await Store.DownloadManager.downloadAndDecrypt(dataDownload);
    const media = arrayBufferToBase64(arraybuffer);
}

async function getMedia(msg, user, index) {
    const dataDownload = { directPath: msg.directPath, encFilehash: msg.encFilehash, filehash: msg.filehash, mediaKey: msg.mediaKey,  type: msg.type, signal: (new AbortController).signal};
    const arraybuffer = await Store.DownloadManager.downloadAndDecrypt(dataDownload);
    const media = arrayBufferToBase64(arraybuffer);
    alert(JSON.stringify({command: "get_media", media: media, type: msg.__x_mimetype ? msg.__x_mimetype.split("/")[1].split(";")[0] : "", user: user, index: index}));
}

async function getRecentMessages(max) {
    let index = 0;
    let ret = [];
    if (!window.Store || !window.Store.Chat || !window.Store.Chat._models)
        return ret;
    for (var chat of window.Store.Chat._models) {
        if (chat.__x_id._serialized && chat.__x_formattedTitle) {
            var last_msg = (chat.msgs && chat.msgs._models && (chat.msgs._models.length > 0)) ? chat.msgs._models[chat.msgs._models.length - 1] : {};
            if (last_msg.__x_type || last_msg.__x_type != "gp2") {
                var contact = {u: chat.__x_id._serialized, n: chat.__x_formattedTitle, c: chat.__x_unreadCount + "",  m: last_msg.__x_body || "", t: last_msg.__x_t ? (new Date(last_msg.__x_t * 1000)).toLocaleString() : ""};
                if (last_msg.__x_type && last_msg.__x_type != "chat")
                    contact["m"] = "[" + ((last_msg.__x_type == "ptt") ? "audio" : last_msg.__x_type) + "]";
//                let p = Store.ProfilePicThumb.get(chat.contact.id);
//                if (p && p.__x_img)
//                    contact["p"] = await fetcher(p.__x_img);
                let p = await Store.ProfilePicThumb.find(chat.contact.id);
                if (p && p.img)
                    contact["p"] = await fetcher(p.img);
                //contact["p"] = p?.img
                ret.push(contact);
                if (++index == max)
                    break;
            }
        }
    }
    return ret;
}

var recentMessages = "";
async function checkMessages() {
    let newMessages = await getRecentMessages(40);
    let newMessagesStr = JSON.stringify(newMessages);
    if (recentMessages != newMessagesStr) {
        alert(JSON.stringify({ command: "get_contacts", contacts: newMessages, connection: document.getElementsByTagName("canvas")[0] == null }));
        //alert(newMessagesStr);
    }
    recentMessages = newMessagesStr;
}

function runCheckMessages() {
    checkMessages();
    if (document.getElementsByTagName("canvas")[0] != null) return -1;
    return document.querySelectorAll('[aria-label*="unread message"]').length;
}

function checkStatus() {
    let e = document.getElementsByClassName('landing-main')[0];
    if (e && e.nextSibling)
        e.parentNode.removeChild(e.nextSibling);
    if (!window.Store || !window.Store.Chat || !window.Store.Chat._models || (window.Store.Chat._models.length <= 0) || window.Store.SendTextMsgToChat == undefined) {
        getStore();
    }
    if (window.Store && window.Store.Chat && window.Store.Chat._models && (window.Store.Chat._models.length > 0) && window.Store.SendTextMsgToChat !== undefined /*&& window.Store.MediaCollection !== undefined*/) {
        return 1;
    }
    return (document.getElementsByTagName("canvas")[0] == null) ? 0 : -1;
    // https://github.com/mukulhase/WebWhatsapp-Wrapper
}

/* moduleRaid v5
 * https://github.com/@pedroslopez/moduleRaid
 */

const moduleRaid = function () {
  moduleRaid.mID  = Math.random().toString(36).substring(7);
  moduleRaid.mObj = {};

  fillModuleArray = function() {
    //webpackChunkbuild
    webpackChunkwhatsapp_web_client.push([
      [moduleRaid.mID], {}, function(e) {
        Object.keys(e.m).forEach(function(mod) {
          moduleRaid.mObj[mod] = e(mod);
        })
      }
    ]);
  }

  fillModuleArray();

  get = function get (id) {
    return moduleRaid.mObj[id]
  }

  findModule = function findModule (query) {
    results = [];
    modules = Object.keys(moduleRaid.mObj);

    modules.forEach(function(mKey) {
      mod = moduleRaid.mObj[mKey];

      if (typeof mod !== 'undefined') {
        if (typeof query === 'string') {
          if (typeof mod.default === 'object') {
            for (key in mod.default) {
              if (key == query) results.push(mod);
            }
          }

          for (key in mod) {
            if (key == query) results.push(mod);
          }
        } else if (typeof query === 'function') {
          if (query(mod)) {
            results.push(mod);
          }
        } else {
          throw new TypeError('findModule can only find via string and function, ' + (typeof query) + ' was passed');
        }
        
      }
    })

    return results;
  }

  return {
    modules: moduleRaid.mObj,
    constructors: moduleRaid.cArr,
    findModule: findModule,
    get: get
  }
}

SingleTapDetector = function(element, handler) {
    this.element = element;
    this.handler = handler;

    element.addEventListener('touchstart', this, false);
};

SingleTapDetector.prototype.handleEvent = function(event) {
    switch (event.type) {
        case 'touchstart': this.onTouchStart(event); break;
        case 'touchmove': this.onTouchMove(event); break;
        case 'touchend': this.onTouchEnd(event); break;
    }
};

SingleTapDetector.prototype.onTouchStart = function(event) {
    this.element.addEventListener('touchend', this, false);
    document.body.addEventListener('touchmove', this, false);

    this.startX = this.currentX = event.touches[0].clientX;
    this.startY = this.currentY = event.touches[0].clientY;
    this.startTime = new Date().getTime();
};

SingleTapDetector.prototype.onTouchMove = function(event) {
    this.currentX = event.touches[0].clientX;
    this.currentY = event.touches[0].clientY;
};

SingleTapDetector.prototype.onTouchEnd = function(event) {
    var that = this;

    // Has there been one or more taps in this sequence already?
    if (this.tapTimer) {
        // Reset the timer to catch any additional taps in this sequence
        clearTimeout(this.tapTimer);
        this.tapTimer = setTimeout(function() {
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
                    this.tapTimer = setTimeout(function() {
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

function showOne(showSide) {
    let app = document.getElementsByClassName("app-wrapper-web")[0];
    if (app) {
        app.style.overflowX = "hidden";
    }
    let side = document.getElementById("side");
    if (side) {
        side = side.parentElement;
        if (side) {
            side.style.width = "100vw";
            side.style.flex = "none";
            side.style.display = showSide ? "block": "none";
            let main = side.nextSibling;
            if (main) {
                main.style.flex = "none";
                main.style.width = "100vw";
                main.style.display = showSide ? "none" : "block";
                if (contacts != document.getElementById("pane-side")) {
                    contacts = document.getElementById("pane-side");
                    //contacts.addEventListener('click', function(event) {
                    new SingleTapDetector(contacts, function(event) {
                        let hover = event.srcElement || event.target || side.getElementsByClassName("hover")[0] || side.getElementsByClassName("hoverLocal")[0];
                        console.log(hover);
                        var e = new MouseEvent('mousedown', { 'bubbles': true, 'cancelable': true });
                        hover.dispatchEvent(e);
                        showOne(false);
                        setTimeout(function() {
                            let header = main.getElementsByTagName("header")[0];
                            if (header && header.innerHTML && header.innerHTML.indexOf("showOne") < 0) {
                                header.innerHTML = "<a href='javascript:showOne(true)'>&lt;&lt;&nbsp;&nbsp;</a>" + header.innerHTML;
                            }
                            let down = main.querySelectorAll('[data-icon="down"]')[0];
                            if (down) {
                                down.click();
                            }
                        }, 800);
                    });
                }
            }
        }
    }
}

setInterval(function() {
    console.log("test");
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
    if (contacts != document.getElementById("pane-side") && window.innerWidth < 700) {
        showOne(true);
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(meta);
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
            let fname = document.querySelector('[data-animate-status-v3-viewer="true"]')?.querySelector('span[dir="auto"]')?.innerText
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
}, 500);
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
