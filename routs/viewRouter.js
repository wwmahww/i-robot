const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');
const billController = require('../controller/billController');

const Router = express.Router();

Router.use(authController.isLoggedIn);

Router.get('/signin', viewController.signIn);
Router.get('/signup', viewController.signIn);
Router.get('/services', viewController.services);
Router.get('/service/:code', viewController.service);
Router.get('/about', viewController.about);
Router.get('/contact', viewController.contact);
Router.get('/passwordRecovery', viewController.passwordRecovery);
Router.get('/resetPassword/:token', viewController.resetPassword);
Router.get('/God', viewController.GodLogin);
Router.get('/', viewController.Introduction);

Router.use(authController.protect);

Router.get('/profile', viewController.myProfile);
Router.get('/newBot/:timeLimit', viewController.newbot);
Router.get('/mybots', viewController.mybots);
Router.get('/bot/:pageName', viewController.botManager);
Router.get('/payResult', billController.checkout, viewController.payResult);

Router.use(authController.restrictTo('admin'));

Router.get('/GodPanel', viewController.GodPanel);

module.exports = Router;
