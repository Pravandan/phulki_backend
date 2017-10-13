var express = require('express');
var mongoose = require('mongoose');
var userModel = require('../models/schema/userSchema');

var router = express.Router();

mongoose.connect('mongodb://localhost/test');


function generateUserID() {
	let token = '';
	let allowedChars = 'abcdefghijklmnopqrstuvwxyz123456789';

	for(var i=0;i<5;i++){
		token += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
	}

	return token;
}


router.get('/', function(req, res, next) {
  res.status(404).send('Illegal');
});

router.get('/register', function(req, res, next) {
  let mobile = req.query.mobile;
  let name = req.query.name;

  let responseObj = {
  	'success' : false,
  	'userID' : '',
  	'name' : name,
  	'mobile' : mobile,
  }


  userModel.findOne({"mobile":mobile},function (err,foundObject) {
  	if(err){
  		console.log(err);
  		res.send(responseObj);
  	}else{
  		if(!foundObject){
  				let newUser = new userModel({
											  	'userID' : generateUserID(),
											  	'name' : name,
											  	'mobile' : mobile,
  											});

  				responseObj.userID = newUser.userID;


				  newUser.save(function (err,savedObject) {
				  	if(err){
				  		console.log(err);
				  	}else{
				  		responseObj.success = true;
				  		res.send(responseObj);
				  	}
				  })

  		}

  		else{
  			console.log('user already exists');
  			res.send(responseObj);
  		}
  	}
  })

  
  //res.status(200).send('register a new user');
});

router.get('/login', function(req, res, next) {
  let mobile = req.query.mobile;

  let responseObj = {
  	"success" : false,
  	"mobile" : mobile,
  }

  res.send(responseObj);

  //res.status(200).send('login a user,check also if already in session then return the message as already in session');
});


module.exports = router;
