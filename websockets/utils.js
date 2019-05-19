export const dynamodbMapper = (dynamodbObject) => {

    let mappedObject = {};

    Object.keys(dynamodbObject).forEach((key, i) => {
        mappedObject[key] = dynamodbObject[key].S || dynamodbObject[key].N || 
        	dynamodbObject[key].B || dynamodbObject[key].BOOL || dynamodbObject[key].SS || 
        		dynamodbObject[key].NS || dynamodbObject[key].BS
    })

    return mappedObject;
}