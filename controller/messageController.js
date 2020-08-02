const Message = require('../models/messageModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.saveMessage = catchAsync(async (req, res, next) => {
  console.log('message: ', req.body);
  const newMessage = await Message.create(req.body);
  console.log('newmessage: ', newMessage);
  console.log('newmessage Id: ', newMessage.id);
  console.log('newmessage _Id: ', newMessage._id);
  console.log('newmessage v: ', newMessage.v);
  console.log('newmessage _v: ', newMessage._v);
  console.log('newmessage __v: ', newMessage.__v);

  res.status(201).json({
    status: 'success',
    message: newMessage,
  });
});

exports.getMessage = factory.getOne(Message);
exports.getAllMessages = factory.getAll(Message);
exports.deleteMessage = factory.deleteOne(Message);
exports.updateMessage = factory.updateOne(Message);
