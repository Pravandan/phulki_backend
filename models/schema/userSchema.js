var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userModelSchema = new Schema({
  userID : String,
  name : String,
  mobile : String,
  publicKey : String,
  privateKey : String,
  credit : Number,
  debit : Number,
  rewards : Number,
  inSession : Boolean,
});

module.exports = mongoose.model('userModel',userModelSchema);
