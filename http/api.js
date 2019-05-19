'use strict';

const AWS = require('aws-sdk/index');
const SETTINGS_TABLE = 'settings_table';
const TWEETS_TABLE = 'promesometro-tweets';

let dynamoDb = new AWS.DynamoDB.DocumentClient();

// Default
const DEFAULT_SETTINGS_JSON =
    {
        "promises": [
            {
                "id": 1,
                "hashtag": "eco1",
                "text": "Promesa 1",
                "sector_id": 1
            },
            {
                "id": 2,
                "hashtag": "eco2",
                "text": "Promesa 2",
                "sector_id": 1
            },
            {
                "id": 3,
                "hashtag": "eco3",
                "text": "Promesa 3",
                "sector_id": 1
            },
            {
                "id": 4,
                "hashtag": "seg1",
                "text": "Promesa 4",
                "sector_id": 2
            },
            {
                "id": 5,
                "hashtag": "seg2",
                "text": "Promesa 5",
                "sector_id": 2
            },
            {
                "id": 6,
                "hashtag": "seg3",
                "text": "Promesa 6",
                "sector_id": 2
            },
            {
                "id": 7,
                "hashtag": "cor1",
                "text": "Promesa 7",
                "sector_id": 3
            },
            {
                "id": 8,
                "hashtag": "cor2",
                "text": "Promesa 8",
                "sector_id": 3
            },
            {
                "id": 9,
                "hashtag": "cor3",
                "text": "Promesa 9",
                "sector_id": 3
            },
            {
                "id": 10,
                "hashtag": "sal1",
                "text": "Promesa 10",
                "sector_id": 4
            },
            {
                "id": 11,
                "hashtag": "sal2",
                "text": "Promesa 11",
                "sector_id": 4
            },
            {
                "id": 12,
                "hashtag": "sal3",
                "text": "Promesa 12",
                "sector_id": 4
            },
            {
                "id": 13,
                "hashtag": "edu1",
                "text": "Promesa 13",
                "sector_id": 5
            },
            {
                "id": 14,
                "hashtag": "edu2",
                "text": "Promesa 14",
                "sector_id": 5
            },
            {
                "id": 15,
                "hashtag": "edu3",
                "text": "Promesa 15",
                "sector_id": 5
            },
            {
                "id": 16,
                "hashtag": "otr1",
                "text": "Promesa 16",
                "sector_id": 6
            },
            {
                "id": 17,
                "hashtag": "otr2",
                "text": "Promesa 17",
                "sector_id": 6
            },
            {
                "id": 18,
                "hashtag": "otr3",
                "text": "Promesa 18",
                "sector_id": 6
            }
        ],
        "sectors": [
            {
                "id": 1,
                "name": "Economía",
                "description": "Promesas ",
                "hashtags_list": ["eco1", "eco2", "eco3"]
            },
            {
                "id": 2,
                "name": "Seguridad",
                "description": "Promesas ",
                "hashtags_list": ["seg1", "seg2", "seg3"]
            },
            {
                "id": 3,
                "name": "Anti Corrupción",
                "description": "Promesas ",
                "hashtags_list": ["cor1", "cor2", "cor3"]
            },
            {
                "id": 4,
                "name": "Salud",
                "description": "Promesas ",
                "hashtags_list": ["sal1", "sal2", "sal3"]
            },
            {
                "id": 5,
                "name": "Educación",
                "description": "Promesas ",
                "hashtags_list": ["edu1", "edu2", "edu3"]
            },
            {
                "id": 6,
                "name": "Otros",
                "description": "Promesas ",
                "hashtags_list": ["otr1", "otr2", "otr3"]
            }
        ],
        "candidate": {
            "name": "Posible presidente",
            "photo_url": "https://via.placeholder.com/150?text=face",
            "user_id": "user",
            "oficial_ids": [
                "89030065",
                "130315077"
            ],
            "info": "orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        }
    };

let settings_json;

// Helpers


// Settings
const getSettings = () => {
    const params = {
        TableName: SETTINGS_TABLE,
        ProjectionExpression: 'id,properties'
    };

    return (!settings_json) ?
        dynamoDb.scan(params).promise()
            .then(scanResult => {
                return (scanResult.Count === 0) ? DEFAULT_SETTINGS_JSON : scanResult.Items[0].properties;
            })
        : new Promise(function (resolve, reject) {
            resolve(settings_json);
        })
};

const getSectorInformation = sectorId => {
    return getSettings()
        .then(result => {
            console.log('sector information', result.sectors);
            return result.sectors.find(sector => sector.id == sectorId)
        })
};

const getPromiseInformation = promiseHashtag => {
    return getSettings()
        .then(result => {
            return result.promises.find(promise => promise.hashtag == promiseHashtag)
        })
};


// Tweets
const getTweets = () => {
    const params = {
        TableName: TWEETS_TABLE,
    };

    return dynamoDb.scan(params).promise()
        .then(scanResult => {
            console.log("Tweets", scanResult)
            return scanResult.Items;
        })
};

const getPromiseTweets = promiseHashtag => {
    return Promise.all([getPromiseInformation(promiseHashtag), getTweets()]).then(function (values) {
        const promiseInformation = values[0];
        const tweets = values[1];
        const promiseTweets = tweets.filter(tweet => tweet.promise_id == promiseHashtag);
        const topPositive = tweets.find(tweet => tweet.sentiment_score == Math.max.apply(Math, promiseTweets.map(function (tweet) {
            return tweet.sentiment_score;
        })))
        const topNegative = tweets.find(tweet => tweet.sentiment_score == Math.min.apply(Math, promiseTweets.map(function (tweet) {
            return tweet.sentiment_score;
        })))

        const sentimentScore = promiseTweets.reduce((total, next) => total + next.sentiment_score, 0) / promiseTweets.length;

        console.log(promiseInformation, tweets, promiseTweets);

        return Object.assign({}, promiseInformation, {tweets: promiseTweets}, {
                top_positive: topPositive, top_negative: topNegative, sentiment_score: sentimentScore
            }
        );
    });
};

// ####################
// LAMBDAS
// ####################

module.exports.retrieveSettings = async (event, context, callback) => {
    return getSettings()
        .then(scanResult => {
            console.log(scanResult);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    data: scanResult
                })
            });
        })
        .catch(err => {
            console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
            return callback(err);
        });
};


module.exports.submitSettings = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);

    if (!requestBody) {
        callback(new Exception("Empty body in the request"));
    }

    const settingsInfo = {
        TableName: SETTINGS_TABLE,
        Item: {id: "1", properties: requestBody},
    };

    console.log(event, context);

    return dynamoDb.put(settingsInfo).promise()
        .then(response => {
            console.log(response)
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Sucessfully updated settings`,
                    data: response
                })
            });
        })
        .catch(err => {
            console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
            return callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: `Unable to update settings`,
                    error: err
                })
            });

        });
};


module.exports.retrieveSectorInfo = async (event, context, callback) => {
    console.log('SectorInfo', event, context);

    if (!event.pathParameters) {
        callback(new Exception("No parameters in the request"));
        return
    }

    return getSectorInformation(event.pathParameters.id)
        .then(data => {
            console.log(data);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    data: data
                })
            });
        })
        .catch(err => {
            console.log('Error:', JSON.stringify(err, null, 2));
            return callback(err);
        });
};


// ----------------------------------------------------------------------------

module.exports.retrievePromiseTweets = async (event, context, callback) => {
    console.log('retrievePromiseTweets', event, context);

    if (!event.pathParameters) {
        callback(new Exception("No parameters in the request"));
        return
    }

    return getPromiseTweets(event.pathParameters.id)
        .then(data => {
            console.log(data);
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    data: data
                })
            });
        })
        .catch(err => {
            console.log('Error:', JSON.stringify(err, null, 2));
            return callback(err);
        });
};