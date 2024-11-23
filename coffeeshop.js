'use strict'

const { DynamoDBClient, ScanCommand, GetItemCommand, PutItemCommand, DeleteItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb")
const { getSuccessResponse, getErrorResponse } = require("./lib/helper")

const getItemQuery = (item_id) => {
    return {
        TableName: process.env.DYNAMODB_MENU_TABLE,
        Key: {
            menu_id: { N: item_id }
        }
    }
}

exports.getAllItems = async (event) => {

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION,
    })

    const results = await client.send(new ScanCommand({
        TableName: process.env.DYNAMODB_MENU_TABLE,
    }))

    return getSuccessResponse(results.Items.map((item) => {
        return {
            menu_id: item.menu_id.N,
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
            "menu_id": { N: payload.menu_id },
            "name": { S: payload.name },
            "description": { S: payload.description },
            "price": { N: payload.price },
        },
    };

    try {
        await client.send(new PutItemCommand(params));
        const { Item } = await client.send(new GetItemCommand(getItemQuery(payload.menu_id)))
        return getSuccessResponse({
            menu_id: Item.menu_id.N,
            name: Item.name.S,
            description: Item.description.S,
            price: Item.price.N,
        })
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

    try {
        const { Item } = await client.send(new GetItemCommand(getItemQuery(requestParams.menu_id)))
        if (!Item) {
            return getErrorResponse("Item not found", 404)
        } else {
            return getSuccessResponse({
                menu_id: Item.menu_id.N,
                name: Item.name.S,
                description: Item.description.S,
                price: Item.price.N,
            })
        }
    } catch (error) {
        return getErrorResponse(error)
    }
}

module.exports.updateMenuItem = async (event) => {
    const requestParams = event.pathParameters
    const payload = JSON.parse(event.body)

    if (!requestParams.menu_id) {
        return getErrorResponse("Please specify a menu_id", 400)
    }

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION,
    })

    const query = {
        ...getItemQuery(requestParams.menu_id),
        UpdateExpression: "SET #name = :name, #price = :price, #description = :description",
        ExpressionAttributeNames: {
            "#name": "name",
            "#price": "price",
            "#description": "description",
        },
        ExpressionAttributeValues: {
            ":name": { S: payload.name },
            ":price": { N: payload.price },
            ":description": { S: payload.description },
        },
        ReturnValues: "ALL_NEW",
    }

    try {
        const result = await client.send(new UpdateItemCommand(query))
        const item = result.Attributes
        return getSuccessResponse({
            menu_id: item.menu_id.N,
            name: item.name.S,
            description: item.description.S,
            price: item.price.N,
        })
    } catch (error) {
        return getErrorResponse("There was an error updating this item: " + error)
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

    try {
        const result = await client.send(new DeleteItemCommand(getItemQuery(requestParams.menu_id)))
        return getSuccessResponse({
            message: "Item was successfully deleted",
        })
    } catch (error) {
        return getErrorResponse("There was an error deleting this item")
    }
}