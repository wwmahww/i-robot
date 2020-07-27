const mongoose = require('mongoose');

// const validator = require('validator');

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a message most have a sender.'],
  },
  email: {
    type: String,
    required: [true, 'email of the sender is required.'],
    // validate:{
    //   validator: validator.isEmail
    // }
  },
  phone: {
    type: Number,
    default: 0,
  },
  message: {
    type: String,
    required: [true, 'a message most have a message.'],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  isReaded: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
