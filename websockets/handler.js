'use strict';

require('aws-sdk/clients/apigatewaymanagementapi');

const AWS = require('aws-sdk');
const WSCONNECTIONS_TABLE = 'websocketConnections';
const WS_ENDPOINT = "kdx5uu8x2k.execute-api.us-east-2.amazonaws.com/dev";
let dynamo = new AWS.DynamoDB.DocumentClient();

const successfullResponse = {
    statusCode: 200,
    body: 'everything is alright'
};

const dynamodbMapper = (dynamodbObject) => {
    let mappedObject = {};
    Object.keys(dynamodbObject).forEach((key, i) => {
        mappedObject[key] = dynamodbObject[key].S || dynamodbObject[key].N || 
        	dynamodbObject[key].B || dynamodbObject[key].BOOL || dynamodbObject[key].SS || 
        		dynamodbObject[key].NS || dynamodbObject[key].BS
    })
    return mappedObject;
}

module.exports.connectionHandler = (event, context, callback) => {

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
            return isWs ? updateConnections(event, connectionId.connectionId) : 
                send(event, connectionId.connectionId);
        });
    });
}

const getConnectionIds = () => {
    const params = {
        TableName: WSCONNECTIONS_TABLE,
        ProjectionExpression: 'connectionId'
    };

    return dynamo.scan(params).promise();
}

const send = (event, connectionId) => {
    const endpoint = event.requestContext.domainName + "/" + event.requestContext.stage;
    
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: endpoint
    });

    const params = {
        ConnectionId: connectionId,
        Data: "postData"
    };

    return apigwManagementApi.postToConnection(params).promise();
};

const updateConnections = (event, connectionId) => {

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: WS_ENDPOINT
    });

    console.log('existing dynamodb records', JSON.stringify(event.Records));

    let dynamodbRecords = [];
    if (event.Records.length) {
        dynamodbRecords = event.Records.map(record => {
            return dynamodbMapper(record.dynamodb.NewImage)
        })
    }

    const params = {
        ConnectionId: connectionId,
        Data: JSON.stringify(dynamodbRecords)
    };

    console.log('incoming dynamodb records', JSON.stringify(dynamodbRecords));
    return apigwManagementApi.postToConnection(params).promise();
};

const addConnection = connectionId => {
    const params = {
        TableName: WSCONNECTIONS_TABLE,
        Item: {
            connectionId: connectionId
        }
    };

    return dynamo.put(params).promise();
};

const deleteConnection = connectionId => {
    const params = {
        TableName: WSCONNECTIONS_TABLE,
        Key: {
            connectionId: connectionId
        }
    };

    return dynamo.delete(params).promise();
};

// Trigger events
module.exports.updateTableHandler = (event, context, callback) => {
    sendMessageToAllConnected(event, true).then(() => {
        callback(null, successfullResponse)
    }).catch(err => {
        callback(null, JSON.stringify(err));
    });
};