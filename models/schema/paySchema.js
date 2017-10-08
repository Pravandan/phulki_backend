var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var payModelSchema = new Schema({
  payToken : String,
  timestamp : Number,
  merchantID : String,
  amount : Number,
  mobile : Number,
  isPaid : Boolean
});

module.exports = mongoose.model('payModel',payModelSchema);
