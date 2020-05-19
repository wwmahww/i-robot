const express = require('express');
const viewController = require('./../controller/viewController');
const authController = require('./../controller/authController');

const Router = express.Router();

Router.use(authController.isLoggedIn);

Router.get('/signin', viewController.signIn);
Router.get('/signup', viewController.signUp);
Router.get('/', viewController.getIntroduction);

Router.use(authController.protect);

Router.get('/me', viewController.myProfile);
Router.get('/newBot', viewController.newbot);
Router.get('/bot', viewController.bot);
Router.get('/bot/:id', viewController.botManager);

module.exports = Router;
