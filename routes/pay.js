var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.status(404).send('Illegal');
});

router.get('/request', function(req, res, next) {
  res.status(200).send('request a payment, send the public key to the requested mobile number along with amount and a purchaseToken');
});


router.get('/pay', function(req, res, next) {
  res.status(200).send('pay a user,send your private key along with the received purchaseToken,amount,public key of merchant');
});


module.exports = router;
