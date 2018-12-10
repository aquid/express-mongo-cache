const mongoose = require('mongoose');
const utils = require('./utils');
const Schema = mongoose.Schema;
const debug = require('debug')('fc-express-mongo:datasource:schema');

let docSchema = new Schema({
    key: {type: String, lowercase: true, required: true, maxlength: 10, minlength: 3, unique: true},
    data:  String,
    ttl: { type: Number, default: 900 },
    date: { type: Date, default: Date.now },
});

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
                    return utils.updateCacheWithTrl(this, result.key);
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


docSchema.statics.findAllKey = function(callback){
    callback = callback || utils.createPromiseCallback();
    this.find({}, 'key ttl date')
        .then((results) => {
            console.log(results);
            results = results.filter( (doc) => {
                return utils.validateTtl(doc);
            });
            callback(null, results);
        })
        .catch((error) => {
            callback(error);
        });
    return callback.promise;
};

let DocModel = mongoose.model('Document', docSchema);


module.exports  = DocModel;