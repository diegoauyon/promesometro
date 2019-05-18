'use strict';

require('aws-sdk/clients/apigatewaymanagementapi');
const AWS = require('aws-sdk');

const CHATCONNECTION_TABLE = 'chatIdTable';

const WS_ENDPOINT = "kdx5uu8x2k.execute-api.us-east-2.amazonaws.com/dev";

let dynamo = new AWS.DynamoDB.DocumentClient();

const successfullResponse = {
    statusCode: 200,
    body: 'everything is alright'
};

module.exports.connectionHandler = (event, context, callback) => {
    console.log(event);

    if (event.requestContext.eventType === 'CONNECT') {
        // Handle connection
        addConnection(event.requestContext.connectionId)
            .then(() => {
                callback(null, successfullResponse);
            })
            .catch(err => {
                console.log(err);
                callback(null, JSON.stringify(err));
            });
    } else if (event.requestContext.eventType === 'DISCONNECT') {
        // Handle disconnection
        deleteConnection(event.requestContext.connectionId)
            .then(() => {
                callback(null, successfullResponse);
            })
            .catch(err => {
                console.log(err);
                callback(null, {
                    statusCode: 500,
                    body: 'Failed to connect: ' + JSON.stringify(err)
                });
            });
    }
};

// THIS ONE DOESNT DO ANYHTING
module.exports.defaultHandler = (event, context, callback) => {
    console.log('defaultHandler was called');
    console.log(event);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify({event, context, callback})
    });
};

module.exports.sendMessageHandler = (event, context, callback) => {
    sendMessageToAllConnected(event).then(() => {
        callback(null, successfullResponse)
    }).catch(err => {
        callback(null, JSON.stringify(err));
    });
}

const sendMessageToAllConnected = (event, isWs) => {
    return getConnectionIds().then(connectionData => {
        if (!connectionData.Items) return;
        return connectionData.Items.map(connectionId => {
            console.log('send msgs to all connected', connectionData)
            return isWs ? updateConnections(event, connectionId.connectionId) : 
                send(event, connectionId.connectionId);
        });
    });
}

const getConnectionIds = () => {
    const params = {
        TableName: CHATCONNECTION_TABLE,
        ProjectionExpression: 'connectionId'
    };

    return dynamo.scan(params).promise();
}

const send = (event, connectionId) => {
    const endpoint = event.requestContext.domainName + "/" + event.requestContext.stage;
    console.log("Endpoint is ----> ", endpoint);
    
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: endpoint
    });

    const params = {
        ConnectionId: connectionId,
        Data: "postData"
    };

    console.log('send event');
    return apigwManagementApi.postToConnection(params).promise();
};

const updateConnections = (event, connectionId) => {

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: WS_ENDPOINT
    });

    console.log('CONNECTION ID IS ---> ', connectionId)

    const params = {
        ConnectionId: connectionId,
        Data: "dynamo new record"
    };

    console.log('update connections');
    return apigwManagementApi.postToConnection(params).promise();
};

const addConnection = connectionId => {
    const params = {
        TableName: CHATCONNECTION_TABLE,
        Item: {
            connectionId: connectionId
        }
    };

    return dynamo.put(params).promise();
};

const deleteConnection = connectionId => {
    const params = {
        TableName: CHATCONNECTION_TABLE,
        Key: {
            connectionId: connectionId
        }
    };

    return dynamo.delete(params).promise();
};

// Trigger events
module.exports.updateTableHandler = (event, context, callback) => {
    console.log('updateTableHandler context is - ', context);
    console.log('updateTableHandler event is - ', event);

    sendMessageToAllConnected(event, true).then(() => {
        callback(null, successfullResponse)
    }).catch(err => {
        callback(null, JSON.stringify(err));
    });

};

module.exports.broadcastConnections = (event, context, callback) => {
    console.log('broadcastConnections context is - ', context);
    console.log('broadcastConnections event is - ', event);
    
};