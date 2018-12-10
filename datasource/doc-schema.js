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
 * @param app
 * @param key
 * @param callback
 * @return {*}
 */
docSchema.statics.findOrCreateKey = function(app, key, callback){
    callback = callback || utils.createPromiseCallback();
    this.aggregate().facet({
        key: [{$match:{key: key}}],
        count: [{$count: "total"}]
    })
        .then((result) => {
            result = result[0];
            result.key = result.key.length && result.key[0] ? result.key[0] : null;
            result.count = result.count.length && result.count[0].total ? result.count[0].total : 0;
            if(!result.key){
                return utils.createNewCache(app, this, key, result.count);
            }
            else {
                let isValid = utils.validateTtl(result.key);
                if(isValid){
                    return utils.refreshTTL(this, result.key.key);
                }
                else {
                    return utils.updateCacheWithTtl(this, result.key.key);
                }
            }
        })
        .then((doc) => {
            callback(null, doc);
        })
        .catch((error) => {
            console.log(error);
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