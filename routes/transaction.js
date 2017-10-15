var express = require('express');
var mongoose = require('mongoose');
var Insta = require('instamojo-nodejs');
var transactionModel = require('../models/schema/transactionSchema');
var userModel = require('../models/schema/userSchema');

const mailjet = require('node-mailjet').connect('5691bc2fd11fd19cf546d1a237df3f19','d89c20139c1382b9f1fc3a5eeda37cab');

var router = express.Router();

Insta.setKeys('be8db513eb1c15fd2252bf36f303d35b', 'cc7ada62651c5d4cf2b89b96fcc69f3f');
Insta.isSandboxMode(true);

mongoose.connect('mongodb://localhost/test');

function generateTransactionToken() {
	let token = '';
	let allowedChars = 'abcdefghijklmnopqrstuvwxyz123456789';

	for(var i=0;i<7;i++){
		token += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
	}

	return token;
}

function updateRewards(mobile,amount) {
	userModel.findOne({"mobile":mobile},function (err,foundObject) {
					if(err){
						console.log(err);
					}else{
						foundObject.rewards += (amount*0.01);
						foundObject.debit += amount;
						foundObject.save(function (err,savedObject) {
							if(err){
								console.log(err);
							}else{
								console.log('rewards successfully updated');
							}
						})
					}
	})


	const request = mailjet.post("send", {'version': 'v3.1'}).request({
        "Messages":[
                {
                        "From": {
                                "Email": "pravchand123@hotmail.com",
                                "Name": "Pravandan Chand"
                        },
                        "To": [
                                {
                                        "Email": "pravandan.chand@gmail.com",
                                        "Name": "Pravandan"
                                }
                        ],
                        "Subject": "Your email flight plan!",
                        "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                        "HTMLPart": "<h3>Dear passenger 1, welcome to Mailjet!</h3><br />May the delivery force be with you!"
                }
        ]
    })
request
    .then((result) => {
    	console.log('sent');
        console.log(result.body)
    })
    .catch((err) => {
    	console.log('error');
        console.log(err)
    })

}

function updateMerchant(mobile,amount) {
	userModel.findOne({"mobile":mobile},function (err,foundObject) {
					if(err){
						console.log(err);
					}else{
						if(foundObject){
						foundObject.credit += amount;
						
						foundObject.save(function (err,savedObject) {
							if(err){
								console.log(err);
							}else{
								console.log('credit successfully updated');
							}
						})
					  }
					}
	})
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
				responseObj.success = false;
				res.send(responseObj);
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
	let merchantMobile = req.query.merchantMobile;

	let responseObj = new transactionModel({
			"token" : token,
			"merchant" : merchant,
			"merchantMobile" : merchantMobile,
			"merchantName" : "Big Bazaar Pvt Ltd.",
			"amount" : amount,
			"mobile" : mobile,
			"creationTimeStamp" : creationTimeStamp,
			"expireTimeStamp" : creationTimeStamp + 60*1000, 
			"status" : 'Initiated',
			"isPaid" : false,
			"isCancel" : false,
			"longUrl" : '',
		});


	var data = new Insta.PaymentData();

		data.purpose = "Test";            // REQUIRED
		data.amount = amount;                  // REQUIRED
		data.setRedirectUrl('http://pravandan.in/transaction');

		Insta.createPayment(data, function(error, response) {
		  if (error) {
		    // some error

		    responseObj.save(function (err,savedObject) {
				if(err){
					console.log(err);
				}else{
					console.log('transaction instance saved');
				}
			})

  			res.status(200).send(responseObj);

		    console.log(error);

		  } else {
		    // Payment redirection link at response.payment_request.longurl
		    responseObj.longUrl = response.payment_request;
		    responseObj.save(function (err,savedObject) {
					if(err){
						console.log(err);
					}else{
						console.log('transaction instance saved');
					}
				})

  			res.status(200).send(responseObj);
		    console.log(JSON.parse(response.payment_request));
  		}
	});

	
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
		"mobile" : '',
		"merchantMobile" : '',
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
				responseObj.mobile = foundObject.mobile;
				responseObj.merchantMobile = foundObject.merchantMobile;

				foundObject.status = responseObj.status;
				foundObject.isPaid = responseObj.isPaid;

				updateRewards(responseObj.mobile,foundObject.amount);
				updateMerchant(responseObj.merchantMobile,foundObject.amount);

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

router.get('/cancel',function (req,res) {
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
				responseObj.status = 'Transaction Cancelled';
				responseObj.isPaid = false;
				responseObj.isCancel = true;
				foundObject.status = responseObj.status;
				foundObject.isPaid = responseObj.isPaid;
				foundObject.isCancel = foundObject.isCancel;

				foundObject.save(function (err,savedObject) {
					if(err){
						console.log(err);
					}else{
						console.log('transaction cancel instance saved');
					}
				})

				res.send(responseObj);
			}
		}
	})

})

router.get('/allCredit',function(req,res){
	let mobile  = req.query.mobile;

	let responseObj = {
		"success" : false,
		"creditObjects" : '',
	}

	transactionModel.find({"merchantMobile":mobile,"isPaid":true},function (err,foundObject) {
		if(err){
			console.log(err);
		}else{
			if(!foundObject){
				responseObj.success = false;
				res.send(responseObj);
			}else{
				responseObj.success = true;
				responseObj.creditObjects = foundObject;
				console.log(responseObj);
				res.send(responseObj);
			}
		}
	})
})

router.get('/allDebit',function(req,res){
	let mobile  = req.query.mobile;

	let responseObj = {
		"success" : false,
		"creditObjects" : '',
	}

	transactionModel.find({"mobile":mobile,"isPaid":true},function (err,foundObject) {
		if(err){
			console.log(err);
		}else{
			if(!foundObject){
				responseObj.success = false;
				res.send(responseObj);
			}else{
				responseObj.success = true;
				responseObj.creditObjects = foundObject;
				console.log(responseObj);
				res.send(responseObj);
			}
		}
	})
})


module.exports = router;
