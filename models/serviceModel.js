const mongoose = require('mongoose');
const stringify = require('js-stringify');
const { ready } = require('jquery');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A service most have an name'],
    unique: true,
  },
  code: {
    type: Number,
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A service most have price'],
  },
  description: String,
  timeLimit: Number,
  active: {
    type: Boolean,
    default: true,
  },
  refID: Number,
  status: {
    type: String,
    enum: ['inpay', 'ready', 'active', 'unactive'],
    message:
      'status most be one of the "inpay"m, "ready", "active", "unactive"',
  },
  offCode: String,
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
