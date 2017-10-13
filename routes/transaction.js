var express = require('express');
var mongoose = require('mongoose');
var transactionModel = require('../models/schema/transactionSchema');

var router = express.Router();

mongoose.connect('mongodb://localhost/test');

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
  let mobile = req.query.mobile;

  let responseObj={
		"success" : false,
		"token" : '',
		"merchantName" : '',
		"amount" : 0,
		"status" : '',
		"isPaid" : false,
	}


	transactionModel.findOne({"mobile":mobile,"isPaid":false},function (err,foundObject) {
		if(err){
			console.log(err);
		}else{
			if(!foundObject){
				reponseObj.success = false;
				res.send(reponseObj);
			}else{
				responseObj.success = true;
				responseObj.token = foundObject.token;
				responseObj.merchantName = foundObject.merchantName;
				responseObj.amount = foundObject.amount;
				responseObj.status = foundObject.status;

				res.send(responseObj);
			}
		}
	})


  //res.status(200).send('will return any pending transaction details which is there');
});

router.get('/status', function(req, res, next) {
	let token = req.query.token;

	let responseObj={
		"success" : false,
		"token" : token,
		"merchantName" : '',
		"amount" : 0,
		"status" : '',
		"isPaid" : false,
	}

	transactionModel.findOne({"token":token},function (err,foundObject) {
		if(err){
			console.log(err);
		}else{
			if(!foundObject){
				responseObj.success = false;
				res.send(reponseObj);
			}else{
				responseObj.success = true;
				responseObj.merchantName = foundObject.merchantName;
				responseObj.amount = foundObject.amount;
				responseObj.status = foundObject.status;
				responseObj.isPaid = foundObject.isPaid;
				res.send(responseObj);
			}
		}
	})

 	//res.status(200).send('return the transaction live details,can be asked by both customer as well as merchant');
});

router.get('/initiate', function(req, res, next) {
	let token = generateTransactionToken();
	let merchant = req.query.merchantID;
	let amount = req.query.amount;
	let mobile = req.query.mobile;	
	let creationTimeStamp = (new Date).getTime();


	let responseObj = new transactionModel({
			"token" : token,
			"merchant" : merchant,
			"merchantName" : "Big Bazaar Pvt Ltd.",
			"amount" : amount,
			"mobile" : mobile,
			"creationTimeStamp" : creationTimeStamp,
			"expireTimeStamp" : creationTimeStamp + 60*1000, 
			"status" : 'Initiated',
			"isPaid" : false,
		});


	responseObj.save(function (err,savedObject) {
		if(err){
			console.log(err);
		}else{
			console.log('transaction instance saved');
		}
	})

  	res.status(200).send(responseObj);
});


router.get('/all', function(req, res, next) {
	  res.status(200).send('return all the transactions so far done');
});


router.get('/complete', function(req, res, next) {
	let token = req.query.token;

	let responseObj={
		"success" : false,
		"token" : token,
		"merchantName" : '',
		"amount" : 0,
		"status" : '',
		"isPaid" : false,
	}

	transactionModel.findOne({"token":token},function (err,foundObject) {
		if(err){
			console.log(err);
		}else{
			if(!foundObject){
				responseObj.success = false;
				res.send(responseObj);
			}else{
				responseObj.success = true;
				responseObj.merchantName = foundObject.merchantName;
				responseObj.amount = foundObject.amount;
				responseObj.status = 'Transaction Succesfull';
				responseObj.isPaid = true;

				foundObject.status = responseObj.status;
				foundObject.isPaid = responseObj.isPaid;

				foundObject.save(function (err,savedObject) {
					if(err){
						console.log(err);
					}else{
						console.log('transaction successfull instance saved');
					}
				})

				res.send(responseObj);
			}
		}
	})
  //res.status(200).send('pay a user,send your private key along with the received purchaseToken,amount,public key of merchant');
});



module.exports = router;
