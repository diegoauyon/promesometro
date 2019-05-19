const wsUri = "wss://kdx5uu8x2k.execute-api.us-east-2.amazonaws.com/dev";


class WebSocketObject {
    constructor({settings, onOpen, onClose, onMessage, onError}) {
        this.settings = settings
        this.websocket= new WebSocket(wsUri)
        this.websocket.onopen = onOpen
        this.websocket.onclose = onClose
        this.websocket.onmessage = onMessage
        this.websocket.onerror = onError
    }
}

export const instanciateSocket = (options) => {
    return new WebSocketObject(options)
}

/*let websocket;

function init() {
    output = document.getElementById("output");
    testWebSocket();
}

function testWebSocket() {
    websocket = new WebSocket(wsUri);

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
}*/

