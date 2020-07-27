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

Router.get('/godPanel', viewController.GodPanel);
Router.get('/god_view_users', viewController.allUsers);
Router.get('/god_view_user/:username', viewController.user);
Router.get('/god_view_messages', viewController.allMessges);
Router.get('/god_view_bots', viewController.allBots);
Router.get('/god_view_bot/:pageName', viewController.bot);
Router.get('/god_view_bills', viewController.allBills);

module.exports = Router;
