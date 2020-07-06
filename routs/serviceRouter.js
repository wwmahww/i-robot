const express = require('express');
const authController = require('../controller/authController');
const serviceController = require('../controller/serviceController');

const Router = express.Router();

Router.use(authController.protect, authController.restrictTo('admin'));

Router.post('/create', serviceController.createService);

Router.get('/', serviceController.getAllServices);
Router.route('/:id')
  .delete(serviceController.deleteService)
  .get(serviceController.getService)
  .patch(serviceController.updateService);

module.exports = Router;
