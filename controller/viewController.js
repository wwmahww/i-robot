const jsStringify = require('js-stringify');

const User = require('../models/userModel');
const Bot = require('../models/botModel');
const Service = require('../models/serviceModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.Introduction = catchAsync(async (req, res, next) => {
  let users = await User.find();
  users = users.length;

  let bots = await Bot.find({ active: true });
  bots = bots.length;

  const services = await Service.find();

  res.status(200).render('intro', {
    title: 'i-robot',
    usersNumber: users,
    botsNumber: bots,
    services,
  });
});

exports.about = (req, res, next) => {
  res.status(200).render('about');
};

exports.contact = (req, res, next) => {
  res.status(200).render('contact');
};

exports.signIn = (req, res, next) => {
  res.status(200).render('signIn');
};

exports.signUp = (req, res, next) => {
  res.status(200).render('signIn');
};

exports.pricing = catchAsync(async (req, res, next) => {
  const services = await Service.find();
  res.status(200).render('pricing', { services });
});

exports.service = catchAsync(async (req, res, next) => {
  const { code } = req.params;
  const service = await Service.findOne({ code });

  if (req.user) {
    if (req.user.firstTime && req.user.introducer) {
      service.priec2 = (service.price * 80) / 100;
    }
  }
  res.status(200).render('service', { jsStringify, service });
});

exports.payResult = (req, res, next) => {
  const { Status } = req.query;
  console.log('query:', Status);

  res.status(200).render('payResult', { Status });
};

exports.myProfile = (req, res, next) => {
  res.status(200).render('admin_profile');
};

exports.mybots = (req, res, next) => {
  const { user } = req;
  res.status(200).render('myBots', { user });
};

exports.botManager = (req, res, next) => {
  const { pageName } = req.params;
  const bot = req.user.bots.find((b) => {
    return b.pageName === pageName;
  });
  if (!bot) {
    return next(new AppError('you do not have a bot with this name.', 401));
  }
  console.log('bot: ', bot);
  res.status(200).render('admin_bot_manager', { jsStringify, bot });
};

exports.newbot = (req, res, next) => {
  const { timeLimit } = req.params;
  res.status(200).render('admin_newBot', { timeLimit });
};
