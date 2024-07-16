# Image Hosting Service

> [!IMPORTANT]\
> THIS SHOULD NOT BE USED IN A PRODUCTION ENVIORNMENT! THIS WAS MADE AS A FUN PROJECT!

# How to use

## 1.1 Installation

```bash
git clone https://github.com/galaxine-senpai/image-hosting # Clone the repo
cd image-hosting # Move into the directory
npm i # Install packages
```

## 1.2 Starting the server

```bash
node src/index
```

## 2 Using the service

You can run a simple curl command to upload an image and it will return the image name in the response!

```bash
curl -X POST "http://localhost:3000/api/image/upload" -H "auth-key: key1" -F "image=@C:\\Users\\xxxx\\Pictures\\dealerrizz.png" # Yes this was an image used during testing
```

Response should look like this:

```json
{"code":{"title":"Success","message":"The request has succeeded."},"id":"lrrg.png"}
```

Now take that "id" and go to the following url:

```
http://localhost:3000/api/image/get/lrrg.png # replace that ID with the one provided to you
```

And thats all you need to do in order to use this!