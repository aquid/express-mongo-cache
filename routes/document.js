const express = require('express');
const router = express.Router();
const Document = require('../common/models/doc-model');

/**
 * Get All the key that are present in the cache and are not expired
 */
router.get('/', function(req, res) {
    Document.findAllKey()
        .then((docs) => {
            res.status(200).send(docs);
        })
        .catch((error) => {
            res.res.status(400).send({error: error || 'Unable to find all the keys, Please try again later.'});
        });
});

/**
 * Get all the data for a give key passed in the url
 */
router.get('/:key', function(req, res) {
    Document.findOrCreateKey(req.app, req.params.key)
        .then((doc) => {
            res.status(201).send(doc);
        })
        .catch((error) => {
            res.status(400).send({error: error || 'Unable to get cache data for given key'});
        });
});

/**
 * Create ot update a key with new data and ttl
 */
router.post('/', (req, res) => {
    if(req.body && req.body.key){
        Document.findOrCreateKey(req.body.key)
            .then((response) => {
                res.res.status(201).send(response);
            })
            .catch((error) => {
                res.status(400).send({error: error || 'Something went wrong'});
            });
    }
    else {
        res.status(500).send('Key is required');
    }
});


/**
 * Delete cache for a given key
 */
router.delete('/:key', (req, res) => {
    Document.deleteOne({key: req.params.key})
        .then((deleted) => {
            res.status(200).send(deleted);
        })
        .catch((err) => {
            res.status(400).send({error: err || 'Error while deleting'});
        })
});


/**
 * Delete all the keys and their data
 */
router.delete('/', (req, res) => {
    Document.deleteMany({})
        .then((deleted) => {
            res.status(200).send(deleted);
        })
        .catch((err) => {
            res.status(400).send({error: err || 'Error while deleting'});
        })
});

module.exports = router;
