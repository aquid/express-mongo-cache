const log = require('debug')('fc-express-mongo:datasource:utils');
const uid = require('uuid/v1');
let Promise = require('bluebird');
let DEFAULT_TTL = 900;


exports.createNewCache = createNewCache;
exports.updateCacheWithTrl = updateCacheWithTrl;
exports.createPromiseCallback = createPromiseCallback;
exports.validateTtl = validateTtl;


function updateCacheWithTrl(model, key){
    log('Cache Expired');
    let random = uid();
    return model.updateOne({key: key}, {data: random, ttl: DEFAULT_TTL})
        .then((response) => {
            console.log(response);
            return model.findOne({key: key});
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function createNewCache(model,key) {
    log('Cache miss');
    let random = uid();
    console.log('random', random);
    return model.create({key: key, data:random})
        .then((response) => {
            console.log(response);
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}

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

