const express = require('express')
const authController = require('./../controller/authController');
const discountController = require('./../controller/discountController')

const Router = express.Router();

Router.use(authController.protect);
Router.use(authController.restrictTo('admin'));

Router.post('/create', discountController.createDiscount);
Router.patch('/update', discountController.updateDiscount);
Router.delete('/delete', discountController.deleteDiscount);
Router.post('/check', discountController.checkDiscount);
Router.get('/:id', discountController.getDiscount);
Router.get('/', discountController.getAllDiscounts);

module.exports = Router