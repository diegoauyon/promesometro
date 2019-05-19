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

