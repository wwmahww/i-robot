const express = require('express');
const authController = require('../controller/authController');
const botController = require('../controller/botController');

const Router = express.Router();

Router.use(authController.protect);

Router.get('/start/:id', botController.start);
Router.get('/stop/:id', botController.stop);
Router.post('/create', botController.create);

Router.route('/:id')
  .get(botController.getBot)
  .patch(botController.updateBot)
  .delete(botController.deleteBot);

Router.patch('/update-my-bot/:id', botController.updateMyBot);

// Ristrict all routes after this point
Router.use(authController.restrictTo('admin'));

Router.get('/', botController.getAllBots);

module.exports = Router;
