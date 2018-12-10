var express = require('express');
var router = express.Router();
let DocModel = require('./../datasource/doc-schema');

/* GET users listing. */
router.get('/', function(req, res) {
    DocModel.findAllKey()
        .then((docs) => {
            res.send(docs);
        })
        .catch((error) => {
            res.send(error);
        });
});

router.get('/:key', function(req, res) {
    console.log('req.params.key',req.params.key);
    DocModel.findOrCreateKey(req.params.key)
        .then((doc) => {
            res.send(doc);
        })
        .catch((error) => {
            res.status(400).send({error: error});
        });
});

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

router.delete('/:key', (req, res) => {
    DocModel.deleteOne({key: req.params.key})
        .then((deleted) => {
            res.send(deleted);
        })
        .catch((err) => {
            res.status(400).send({error: err});
        })
});

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
