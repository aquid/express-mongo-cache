## Prerequisites

You must have already installed [Node.js](https://nodejs.org/) and  [MongoDB](https://www.mongodb.com/)

Install Express application generator:
```
$ npm install express-generator -g
```

## Express Mongo Cache Sandbox

This is a simple application using express.js and mongo used as a simple cache system. This library for using mongo is [Mongoose](https://mongoosejs.com/). This library provides you with some greate features which makes a lot of our work easier.


### Setup the config

There is a ds-config.js file which has all the database configuration. Please update this file with your config values

```$xslt
{
    dbName: 'YOUR DB NAME', // test
    host: 'host', // localhost
    port: port, // 27017
    ...
}
```


### Run the application

```
$ cd express-mongo-cache
$ npm install
$ npm start 

```



## REST APIs

 - `GET - /docs/`  Get All the key that are present in the cache and are not expired.
 - `GET - /docs/:key` Get all the data for a give key passed in the url.
 - `POST - /docs/`  Create ot update a key with new data
 - `DLETE - /docs/:key` Delete cache for a given key
 - `DLETE - /docs/` Delete all the keys and their data