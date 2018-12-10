const mongoose = require('mongoose');
const Promise = require('bluebird');
const log = require('debug')('fc-express-mongo:datasource:connector');
const utils = require('./utils');


/**
 * Initialize the datasource with the configurable settings and return
 * @param {object} app
 * @param {object} settings
 * @param {function} callback callback
 */
module.exports.initialize = (app, settings, callback) => {
    callback = callback || utils.createPromiseCallback();
    if(!mongoose){
        return Promise.reject('Mongo Library not found');
    }
    app.connector = new MongoConnector(settings);
    if (callback) {
        app.connector.connect(callback);
    }
    return callback.promise;
};




/**
 * Connector constructor
 * @param {object} datasource settings
 * @constructor
 */
let MongoConnector = function(settings) {
    this.dbName = settings.dbName || 'fcApp';
    this.apiVersion = settings.apiVersion;
    this.debug = settings.debug || true;
    this.host = settings.host || 'localhost';
    this.port = settings.port || 27017;
    this.username = settings.username || '';
    this.password = settings.password || '';
     if (this.debug) {
        log('Settings: %j', settings);
    }
};

/**
 * Connect to MongoDb client
 * @callback callback
 */
MongoConnector.prototype.connect =   function(callback) {
        callback = callback || utils.createPromiseCallback();
        let url = `mongodb://${this.host}:${this.port}/${this.dbName}`;
        if (this.username && this.password) {
            url = `mongodb://${this.username}:${this.password}@${this.host}:${this.port}/${this.dbName}`;
        }
        console.log(url);
        mongoose.connect(url, { useNewUrlParser: true }, callback);
};