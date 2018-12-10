const express = require('express');
const router = express.Router();
const DocModel = require('./../datasource/doc-schema');

/**
 * Get All the key that are present in the cache and are not expired
 */
router.get('/', function(req, res) {
    DocModel.findAllKey()
        .then((docs) => {
            res.send(docs);
        })
        .catch((error) => {
            res.send(error);
        });
});

/**
 * Get all the data for a give key passed in the url
 */
router.get('/:key', function(req, res) {
    DocModel.findOrCreateKey(req.app, req.params.key)
        .then((doc) => {
            res.send(doc);
        })
        .catch((error) => {
            res.status(400).send({error: error});
        });
});

/**
 * Create ot update a key with new data and ttl
 */
router.post('/', (req, res) => {
    if(req.body && req.body.key){
        DocModel.findOrCreateKey(req.body.key)
            .then((response) => {
                res.send(response);
            })
            .catch((error) => {
                res.status(400).send({error: error});
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
    DocModel.deleteOne({key: req.params.key})
        .then((deleted) => {
            res.send(deleted);
        })
        .catch((err) => {
            res.status(400).send({error: err});
        })
});


/**
 * Delete all the keys and their data
 */
router.delete('/', (req, res) => {
    DocModel.deleteMany({})
        .then((deleted) => {
            res.send(deleted);
        })
        .catch((err) => {
            res.status(400).send({error: err});
        })
});

module.exports = router;
