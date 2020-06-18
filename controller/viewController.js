const jsStringify = require('js-stringify');

const User = require('../models/userModel');
const Bot = require('../models/botModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.Introduction = catchAsync(async (req, res, next) => {
  let users = await User.find();
  users = users.length;

  let bots = await Bot.find({ active: true });
  bots = bots.length;

  res.status(200).render('intro', {
    title: 'i-robot',
    usersNumber: users,
    botsNumber: bots,
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

exports.pricing = (req, res, next) => {
  res.status(200).render('pricing');
};

exports.service = (req, res, next) => {
  const { type } = req.params;
  const data =
    type === 'free'
      ? { name: 'رایگان', price: 0, number: 1 }
      : type === 'standard'
      ? { name: 'استاندارد', price: 49000, number: 1 }
      : type === 'silver'
      ? { name: 'نقره‌ای', price: 89000, number: 3 }
      : { name: 'طلایی', price: 129000, number: 5 };

  if (req.user) {
    if (req.user.firstTime && req.user.introducer) {
      data.priec2 = (data.price * 80) / 100;
    }
  }
  res.status(200).render('service', { jsStringify, data });
};

exports.myProfile = (req, res, next) => {
  res.status(200).render('admin_profile');
};

exports.bot = (req, res, next) => {
  res.status(200).render('admin_bot');
};

exports.botManager = (req, res, next) => {
  const { id } = req.params;
  const bot = req.user.bots.find((b) => {
    return b.pageName === id;
  });
  if (!bot) {
    return next(new AppError('you do not have a bot with this name.', 401));
  }
  console.log('bot: ', bot);
  res.status(200).render('admin_bot_manager', { bot });
};

exports.newbot = (req, res, next) => {
  res.status(200).render('admin_newBot');
};
