var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.status(404).send('Illegal');
});

router.get('/fetch', function(req, res, next) {
  res.status(200).send('will return any pending transaction details which is there');
});

router.get('/status', function(req, res, next) {
  res.status(200).send('return the transaction live details,can be asked by both customer as well as merchant');
});

router.get('/initiate', function(req, res, next) {
  res.status(200).send('initiate a transaction and return its id so that its status can be queried upon by the merchant');
});

router.get('/all', function(req, res, next) {
  res.status(200).send('return all the transactions so far done');
});


router.get('/complete', function(req, res, next) {
  res.status(200).send('pay a user,send your private key along with the received purchaseToken,amount,public key of merchant');
});



module.exports = router;
