'use strict'

const {DynamoDBClient, PutItemCommand, ScanCommand} = require("@aws-sdk/client-dynamodb")

exports.getAllItems = async (event) => {
    
    const client = new DynamoDBClient({
        region: process.env.AWS_REGION,
    })

    const results = await client.send(new ScanCommand({
        TableName: process.env.DYNAMODB_MENU_TABLE,
    }))

    return {
        statusCode: 200,
        body: JSON.stringify(results.Items.map((item) => {
            return {
                menu_id: item.menu_id.S,
                name: item.name.S,
                description: item.description.S,
                price: item.price.N,
            }
        })),
        headers: {
            "Content-Type": "application/json",
        }
    }
}

module.exports.createMenuItem = async (event) => {

    const payload = JSON.parse(event.body)
    console.log(payload)

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION,
    });

    const params = {
        TableName: process.env.DYNAMODB_MENU_TABLE,
        Item: {
            "menu_id": { S: payload.name },
            "name": { S: payload.name },
            "description": { S: payload.description },
            "price": { N: payload.price },
        }
    };

    try {
        const data = await client.send(new PutItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: JSON.stringify(data),
            }),
        };
    } catch (error) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                error: error,
            }),
        };
    }
}
