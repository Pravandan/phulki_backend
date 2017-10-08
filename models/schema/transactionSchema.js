var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var transactionModelSchema = new Schema({
  transactionToken : String,
  merchant : String,
  customer : String,
  amount : String,
  timestamp : Number,
  status : String,
  isPaid : Boolean,
});

module.exports = mongoose.model('transactionModel',transactionModelSchema);
