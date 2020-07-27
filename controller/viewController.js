const jsStringify = require('js-stringify');

const User = require('../models/userModel');
const Bot = require('../models/botModel');
const Message = require('../models/messageModel');
const Bills = require('../models/billModel');
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

exports.services = catchAsync(async (req, res, next) => {
  const services = await Service.find();
  res.status(200).render('services', { services });
});

exports.service = catchAsync(async (req, res, next) => {
  const { code } = req.params;
  const service = await Service.findOne({ code });

  if (req.user && req.user.firstPurchase && req.user.introducer) {
    service.price2 = service.price * 0.8;
    console.log('first purchase');
  }
  console.log('service: ', service);

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

exports.passwordRecovery = catchAsync(async (req, res, next) => {
  res.status(200).render('passwordRecovery');
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log('hear in reset password view');
  const { token } = req.params;
  res.status(200).render('resetPassword', { jsStringify, token });
});

exports.GodLogin = (req, res, next) => {
  res.status(200).render('GodLogin');
};

exports.GodPanel = (req, res, next) => {
  res.status(200).render('GodPanel');
};

exports.allUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render('god_view_users', { jsStringify, users });
});

exports.user = catchAsync(async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).select('-__v');
  const copyUser = {};
  for (const [key, val] of Object.entries(user['_doc'])) {
    copyUser[key] = val;
  }
  console.log('copyUser: ', copyUser);
  res.status(200).render('god_view_user', { jsStringify, copyUser });
});

exports.allMessges = catchAsync(async (req, res, next) => {
  const messages = await Message.find().select('-__v');
  res.status(200).render('god_view_messages', { jsStringify, messages });
});

exports.allBots = catchAsync(async (req, res, next) => {
  const bots = await Bot.find().select('-__v');
  console.log('bots: ', bots);
  res.status(200).render('god_view_bots', { jsStringify, bots });
});

exports.bot = catchAsync(async (req, res, next) => {
  const { pageName } = req.params;
  console.log('pageName: ', pageName);
  let bot = await Bot.findOne({ pageName }).select('-__v');
  console.log(bot);
  res.status(200).render('god_view_bot', { jsStringify, bot });
});

exports.allBills = catchAsync(async (req, res, next) => {
  const bills = await Bills.find().select('-__v');
  res.status(200).render('god_view_bills', { jsStringify, bills });
});
