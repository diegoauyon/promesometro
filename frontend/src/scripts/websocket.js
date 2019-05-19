var wsUri = "wss://kdx5uu8x2k.execute-api.us-east-2.amazonaws.com/dev";
var output;

import { dashboard } from '../scripts/dashboard'

let websocket;

function init() {
    output = document.getElementById("output");
    testWebSocket();
}

function testWebSocket() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) {
        onOpen(evt)
    };
    websocket.onclose = function (evt) {
        onClose(evt)
    };
    websocket.onmessage = function (evt) {
        onMessage(evt)
    };
    websocket.onerror = function (evt) {
        onError(evt)
    };
}

function onOpen(evt) {
}

function onClose(evt) {
}

function onMessage(evt) {
    dashboard.updateEducationScore(evt.data);
}

function onError(evt) {
    
}

function doSend(message) {
    websocket.send(message);
}

function writeToScreen(message) {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    //output.appendChild(pre);
}

window.addEventListener("load", init, false);
