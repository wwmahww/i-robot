const express = require('express');

const authController = require('../controller/authController');
const messageController = require('../controller/messageController');

const Router = express.Router();

Router.post('/', messageController.saveMessage);

Router.use(authController.protect, authController.restrictTo('admin'));

Router.route('/:id')
  .get(messageController.getMessage)
  .patch(messageController.updateMessage)
  .delete(messageController.deleteMessage);
Router.get('/', messageController.getAllMessages);

module.exports = Router;
