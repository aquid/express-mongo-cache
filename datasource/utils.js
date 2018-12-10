const log = require('debug')('fc-express-mongo:datasource:utils');
const uid = require('uuid/v1');
let Promise = require('bluebird');
let DEFAULT_TTL = 900; //TODO: Take this from a config object or ENV variable

/**
 * Export all the utility functions that are needed
 * to avoid duplication
 */
exports.createNewCache = createNewCache;
exports.updateCacheWithTtl = updateCacheWithTtl;
exports.createPromiseCallback = createPromiseCallback;
exports.validateTtl = validateTtl;


/**
 * This function updates the ttl value for a given key.
 * If the key has expired ttl it will update the key
 * and then send the response
 *
 *
 * @param model - the model on which the call will be made
 * @param key - key that needs to be updated
 * @return {Promise<any | void>}
 */
function updateCacheWithTtl(model, key){
    log('Cache Expired');
    let random = uid();
    return model.updateOne({key: key}, {data: random, create: DEFAULT_TTL, date: new Date() })
        .then((response) => {
            log('Cache Hit');
            return model.findOne({key: key});
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}


/**
 *THis function creates a new cache with the given key
 * and a random data string
 *
 * @param model - the model on which the call will be made
 * @param key - key that needs to be created
 * @return {Promise<T | never | void>}
 */
function createNewCache(model,key) {
    log('Cache miss');
    let random = uid();
    return model.create({key: key, data:random})
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}


/**
 * This function is to add support of promises in a callback style function.
 * It helps us to support API'S with both callback and promises.
 *
 * @return {Promise<any | void>}
 */
function createPromiseCallback() {
    let cb = null;
    let promise = new Promise(function (resolve, reject) {
        cb = function (err, data) {
            if (err) return reject(err);
            return resolve(data);
        };
    });
    cb.promise = promise;
    return cb;
}

/**
 * Validate the ttl with the current time.
 * @param doc
 * @return {boolean}
 */
function validateTtl(doc) {
    if(!doc){
        return false;
    }
    let now = Date.now();
    let created = doc.date.getTime();
    let elapsedSeconds = (now - created) / 1000;
    let secondsToLive = doc.ttl;
    return elapsedSeconds < secondsToLive;
}

