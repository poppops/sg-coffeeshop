<!--
title: 'AWS Simple HTTP Endpoint example in NodeJS'
description: 'This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, Inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# SG Coffee Shop using Serverless Framework Node HTTP API on AWS

This is a simple restful API created for a coffee shop using the Serverless Framework.

The API currently supports requests to;

- Get all menu items
- Create a menu item
- Retrieve a menu item
- Update a menu item
- Delete a menu item

## Usage

This application requires at least Node 20.x

### Deployment

In order to deploy the example, you need to run the following command:

```
serverless deploy
```

After running deploy, you should see output similar to:

```
Deploying "serverless-http-api" to stage "dev" (us-east-1)

✔ Service deployed to stack serverless-http-api-dev (91s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  hello: serverless-http-api-dev-hello (1.6 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [HTTP API (API Gateway V2) event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api).

### Invocation

After successful deployment, you can call the created application via HTTP:

```
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Which should result in response similar to:

```json
[
   {
      "menu_id":"3",
      "name":"Latte",
      "description":"Espresso mixed with steamed milk, typically topped with a small amount of foam. A smooth, creamy coffee...",
      "price":"3"
   },
   {
      "menu_id":"2",
      "name":"Americano",
      "description":"A coffee drink made by diluting a shot of espresso with hot water, giving it a similar strength to drip coffee.",
      "price":"3"
   },
   {
      "menu_id":"1",
      "name":"Espresso",
      "description":"A strong, concentrated coffee made by forcing hot water through finely-ground coffee beans.",
      "price":"2.5"
   }
]
```

### Local development

The easiest way to develop and test your function is to use the `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.
