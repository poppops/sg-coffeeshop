'use strict'

const { DynamoDBClient, ScanCommand, GetItemCommand, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb")

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
            "menu_id": { S: payload.name.replace(" ", "_") },
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

module.exports.getMenuItem = async (event) => {

    const requestParams = event.pathParameters

    if (!requestParams.menu_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Please specify a menu_id"
            })
        }
    }

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION,
    })

    const query = {
        TableName: process.env.DYNAMODB_MENU_TABLE,
        Key: {
            menu_id: { S: requestParams.menu_id }
        }
    }

    try {
        const { Item } = await client.send(new GetItemCommand(query))
        if (!Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: "Item not found"
                })
            }
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    menu_id: Item.menu_id.S,
                    name: Item.name.S,
                    description: Item.description.S,
                    price: Item.price.N,
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error
            })
        }
    }
}

module.exports.deleteMenuItem = async (event) => {
    const requestParams = event.pathParameters

    if (!requestParams.menu_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Please specify a menu_id"
            })
        }
    }

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION,
    })

    const query = {
        TableName: process.env.DYNAMODB_MENU_TABLE,
        Key: {
            menu_id: { S: requestParams.menu_id }
        }
    }

    try {
        const result = await client.send(new DeleteItemCommand(query))

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Item was successfully deleted"
            })
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "There was an error deleting this item: " + error
            })
        }
    }

}