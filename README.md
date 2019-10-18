# Monogram

This project is based on Udacity Chaptor4 serverless framework project.

# Functionality of the application

This app allows you to create / remove / update / fetch items including title, description and images. Each item can optionally update its title, description and image. Each user can only access items that they created.

# Platforms

This app work based on serverless framework.

# items

The application should store items, and each item contains the following fields:
* `userId` (string) - a unique id to distinguish user
* `itemId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `modifiedAt` (string) - date and time when an item was modified at last
* `title` (string) - name of a item (e.g. "my dog")
* `desc` (string) - description of the item
* `ImageUrl` (string) - a URL pointing to an image attached to a item

# Functions

* `Auth` - this function implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetItems` - return all items for a current user. A user id can be extracted from a JWT token that is sent by the frontend

return data looks like this:

```json
{
    "items": [
        {
            "modifiedAt": "2019-10-18T12:14:53.098Z",
            "userId": "example-auth-01",
            "ImageUrl": "https://example.s3.amazonaws.com/example-item-id-1",
            "createdAt": "2019-10-18T12:14:53.098Z",
            "itemId": "example-item-id-1",
            "title": "my dog",
            "desc": "my dog's face..."
        },
        {
            "modifiedAt": "2019-10-18T12:15:24.460Z",
            "userId": "example-auth-01",
            "ImageUrl": "https://example.s3.amazonaws.com/example-item-id-2",
            "createdAt": "2019-10-18T12:15:24.460Z",
            "itemId": "example-item-id-2",
            "title": "my cat",
            "desc": "my cat when looking at me..."
        }
    ]
}
```

* `CreateTodo` - create a new item for a current user. A shape of data send by a client application to this function can be found in the `CreateItemRequest.ts` file

It receives a new item to be created in a format that looks like this:

![Alt text](images/upload_form.PNG?raw=true "upload form")

app shows fail alert when the title is empty (validte with 'serverless-reqvalidator-plugin')

It should return a new item that looks like this:

```json
{
  "item": {
    "userId": "example-auth-01",
    "createdAt": "2019-07-27T20:01:45.424Z",    
    "modifiedAt": "2019-07-29T20:01:45.424Z",
    "title": "my dog2",
    "desc": "my dog desc",
    "ImageUrl": "https://example.s3.amazonaws.com/example-item-id-3"
  }
}
```

* `UpdateTodo` - update title and description of the item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateItemRequest.ts` file

It receives an object that contains two fields that can be updated in a TODO item:

```json
{
  "title": "new cat",
  "desc": "this is a new cat"
}
```

* `DeleteTodo` - delete a item created by a current user. Expects an id of a item to remove.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

all necessary resources are added to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```
This is the example page screenshot of deply result

![Alt text](images/deploy_success.PNG?raw=true "deploy_success")

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This starts a development server with the React application that will interact with the serverless application.

### login page

when access to localhost:3000, default login page shows up.

![Alt text](images/client-login-page.PNG?raw=true "client-login-page")

if click the login button, the page move to auth0 login page

![Alt text](images/client-auth0-page.PNG?raw=true "client-auth0-page")

### main page

After login process user move to main page. On this page, users can see only the posts they posted.

![Alt text](images/client-loginUser-Homepage.PNG?raw=true "client-loginUser-Homepage")

The user can click the blue button to modify the post's content, and the red button to delete the post.

When the blue button is pressed, the user will be redirected to the page below. After entering the changes, the user can press the upload button to complete the edit.

![Alt text](images/update page.PNG?raw=true "update page")




