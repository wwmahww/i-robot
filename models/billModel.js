const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  authority: String,
  refID: Number,
  service: String,
  userEmail: String,
  amount: Number,
  finalPay: Number,
  description: String,
  createAt: {
    type: Date,
    default: Date.now(),
  },
  payedAt: Date,
  isPayed: {
    type: Boolean,
    default: false,
  },
  offCode: String,
});

const Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;

BillSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: ['username', 'email'],
  });
  next();
});
