const mongoose = require('mongoose');

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
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
