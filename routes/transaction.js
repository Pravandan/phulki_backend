var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();


function generateTransactionToken() {
	let token = '';
	let allowedChars = 'abcdefghijklmnopqrstuvwxyz123456789';

	for(var i=0;i<7;i++){
		token += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
	}

	return token;
}


router.get('/', function(req, res, next) {
  res.status(404).send('Illegal');
});

router.get('/fetch', function(req, res, next) {
  res.status(200).send('will return any pending transaction details which is there');
});

router.get('/status', function(req, res, next) {
	let token = req.query.token;
 	res.status(200).send('return the transaction live details,can be asked by both customer as well as merchant');
});

router.get('/initiate', function(req, res, next) {
	let token = generateTransactionToken();
	let merchant = req.query.merchantID;
	let amount = req.query.amount;
	let mobile = req.query.mobile;	
	let creationTimeStamp = (new Date).getTime();


	let reponseObj = {
		"token" : token,
		"merchant" : merchant,
		"amount" : amount,
		"mobile" : mobile,
		"creationTimeStamp" : creationTimeStamp,
		"expireTimeStamp" : creationTimeStamp + 60*1000, 
		"status" : 'Initiated',
		"isPaid" : false,
	}

  	res.status(200).send(reponseObj);
});

router.get('/all', function(req, res, next) {
	  res.status(200).send('return all the transactions so far done');
});


router.get('/complete', function(req, res, next) {
  res.status(200).send('pay a user,send your private key along with the received purchaseToken,amount,public key of merchant');
});



module.exports = router;
