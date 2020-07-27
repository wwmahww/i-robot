const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'a discount most have a code'],
    unique: true,
  },
  percentage: {
    type: Number,
    required: [true, 'a discount most have a percentage'],
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  blackList: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
  ],
  createAt: {
    type: Date,
    default: Date.now(),
  },
  expiredAt: Date,
});

const Discount = mongoose.model('Discount', DiscountSchema);

module.exports = Discount;

DiscountSchema.pre('save', function (next) {
  if (expiredAt)
    this.expiredAt = creatAt + this.expiredAt * 24 * 60 * 60 * 1000;
  next();
});

DiscountSchema.pre(/^find/, function (next) {
  this.populate({
    path: ' blackList',
    select: 'email',
  });
  next();
});
