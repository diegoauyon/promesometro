'use strict';

const AWS = require('aws-sdk');
const bufferFrom = require('buffer-from')
const cleanDeep = require('clean-deep')
const ddb = new AWS.DynamoDB.DocumentClient();


module.exports.preprocess = (event, context, callback) => {
    const tweets = [];
    event.Records.forEach((record) => {
        const payload = JSON.parse(bufferFrom(record.kinesis.data, 'base64').toString('utf8'));

        payload.day = new Date(payload.day).toISOString();
        console.log(`promise_id: ${payload.promise_id}`);
        console.log(`sentiment_score:${payload.sentiment_score}`);

        tweets.push(createPutRequestObject(payload));

    });
    // prepare write
    const params = {
        RequestItems: {},
    };

    params.RequestItems[process.env.PROMESOMETRO_TWEETS_TABLE] = tweets;

    if (isEmptyObject(params.RequestItems)) return;

    ddb.batchWrite(params, (err, data) => {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Success', JSON.stringify(data, null, 2));
        }
    });

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

function createPutRequestObject(payload) {
    return {
        PutRequest: {
            Item: cleanDeep(payload),
        },
    };
}

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}