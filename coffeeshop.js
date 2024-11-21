'use strict'

const { DynamoDBClient, ScanCommand, GetItemCommand, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb")
const { getSuccessResponse, getErrorResponse } = require("./lib/helper")

exports.getAllItems = async (event) => {

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION,
    })

    const results = await client.send(new ScanCommand({
        TableName: process.env.DYNAMODB_MENU_TABLE,
    }))

    return getSuccessResponse(results.Items.map((item) => {
        return {
            menu_id: item.menu_id.S,
            name: item.name.S,
            description: item.description.S,
            price: item.price.N,
        }
    }))

}

module.exports.createMenuItem = async (event) => {

    const payload = JSON.parse(event.body)

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
        return getSuccessResponse(JSON.stringify(data))
    } catch (error) {
        return getErrorResponse(error)
    }
}

module.exports.getMenuItem = async (event) => {

    const requestParams = event.pathParameters

    if (!requestParams.menu_id) {
        return getErrorResponse("Please specify a menu_id", 400)
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
            return getErrorResponse("Item not found", 400)
        } else {
            return getSuccessResponse(JSON.stringify({
                menu_id: Item.menu_id.S,
                name: Item.name.S,
                description: Item.description.S,
                price: Item.price.N,
            }))
        }
    } catch (error) {
        return getErrorResponse(error)
    }
}

module.exports.deleteMenuItem = async (event) => {
    const requestParams = event.pathParameters

    if (!requestParams.menu_id) {
        return getErrorResponse("Please specify a menu_id", 400)
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
        return getSuccessResponse({
            message: "Item was successfully deleted",
        })
    } catch (error) {
        return getErrorResponse("There was an error deleting this item")
    }

}