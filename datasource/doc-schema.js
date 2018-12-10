const mongoose = require('mongoose');
const utils = require('./utils');
const Schema = mongoose.Schema;
const debug = require('debug')('fc-express-mongo:datasource:schema');

/**
 * Schema of the document with key and other values
 */
let docSchema = new Schema({
    key: {type: String, lowercase: true, required: true, maxlength: 10, minlength: 3, unique: true},
    data:  String,
    ttl: { type: Number, default: 900 }, //TODO: access this from config variable ot ENV
    date: { type: Date, default: Date.now },
});


/**
 * This function is finds or create a given key.
 * It also checks for valid TTL and if the ttl
 * is expired it updates the key first and then
 * send the response
 *
 * @param key
 * @param callback
 * @return {*}
 */
docSchema.statics.findOrCreateKey = function(key, callback){
    callback = callback || utils.createPromiseCallback();
    this.findOne({key: key})
        .then((result) => {
            if(!result){
                return utils.createNewCache(this, key);
            }
            else {
                let isValid = utils.validateTtl(result);
                if(isValid){
                    debug('Cache Hit');
                    return Promise.resolve(result);
                }
                else {
                    return utils.updateCacheWithTtl(this, result.key);
                }
            }
        })
        .then((doc) => {
            callback(null, doc);
        })
        .catch((error) => {
            callback(error);
        });
    return callback.promise;
};

/**
 * This function returns all the keys present
 * in the cache except those whose TTL is not
 * expired.
 *
 * @param callback
 * @return {*}
 */
docSchema.statics.findAllKey = function(callback){
    callback = callback || utils.createPromiseCallback();
    this.find({}, 'key ttl date')
        .then((results) => {
            results = results.filter( (doc) => {
                return utils.validateTtl(doc); // TODO: Update the old keys with new TTL and send them in the response
            });
            callback(null, results);
        })
        .catch((error) => {
            callback(error);
        });
    return callback.promise;
};

/**
 * Model defined for the given Schema
 * @type {Model}
 */
let DocModel = mongoose.model('Document', docSchema);


module.exports  = DocModel;