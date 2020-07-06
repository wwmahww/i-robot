const express = require('express');
const authController = require('../controller/authController');
const billController = require('../controller/billController.js');

const Router = express.Router();

Router.use(authController.protect);

Router.get('/my-bills', billController.myBills);
Router.post('/create', billController.createBill);
Router.get('/pay', billController.pay);

Router.use(authController.restrictTo('admin'));

Router.get('/', billController.getAllBills);
Router.route('/:id')
  .delete(billController.deleteBill)
  .get(billController.getBill)
  .patch(billController.updateBill);

module.exports = Router;
