var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.status(404).send('Illegal');
});

router.get('/register', function(req, res, next) {
  res.status(200).send('register a new user');
});

router.get('/login', function(req, res, next) {
  res.status(200).send('login a user,check also if already in session then return the message as already in session');
});


module.exports = router;
