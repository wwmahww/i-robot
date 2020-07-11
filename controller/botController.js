const { fork } = require('child_process');

const Bot = require('../models/botModel');
const User = require('../models/userModel');
const pool = require('../bot/initializer');
const Bots = require('../models/botModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const delay = require('../bot/utils/delay');
const web = require('../bot/utils/interfaces');
const botLauncher = require('../utils/botLauncher');
const { newbot } = require('./viewController');

// ==========================================================

exports.start = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const bot = req.user.bots.find((b) => {
    return b.pageName === id;
  });

  if (!bot) {
    return next(new AppError('you do not have a bot with this name.', 401));
  }

  await botLauncher.launch(bot);

  bot.active = true;
  bot.markModified('active');
  await bot.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'bot starts.',
  });
});

exports.stop = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const bot = req.user.bots.find((b) => {
    return b.pageName === id;
  });

  web.childs[id].send('finish');
  setTimeout(() => {
    web.childs[id].kill();
    web.childs[id] = undefined;
  }, 2000);

  bot.active = false;
  bot.markModified('active');
  await bot.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'bot stoped.',
  });
});

exports.create = catchAsync(async (req, res, next) => {
  let serviceIndex;
  const bot = req.body;
  bot.owner = req.user.id;
  bot.timeLeft *= 86400000;
  const { user } = req;
  const service = user.services.find((item, index) => {
    serviceIndex = index;
    return item.timeLimit === req.body.timeLeft * 1;
  });
  console.log('service: ', service);
  if (!service) {
    return next(new AppError('این سرویس برای شما فعال نمی‌باشد', 401));
  }

  const newBot = await Bot.create(bot);

  if (!newBot) {
    return next(
      new AppError('مشکلی در ساخت ربات ایجاد شد. لطفا دوباره امتحان کنید', 401)
    );
  }

  user.services.splice(serviceIndex, 1);

  console.log('user.services:', user.services);

  user.bots.push(newBot._id);
  await user.updateOne({ $set: { services: user.services, bots: user.bots } });

  res.status(201).json({
    status: 'success',
    message: 'ربات ساخته شد.',
    date: {
      newBot,
    },
  });
});

exports.updateMyBot = catchAsync(async (req, res, next) => {
  console.log('request came.');
  const { pageName } = req.params;

  const bot = req.user.bots.find((b) => {
    return b.pageName === pageName;
  });

  if (!bot) {
    return next(new AppError('you do not have a bot with this name.', 401));
  }

  bot.pageName = req.body.pageName;
  bot.pagePassword = req.body.pagePassword;
  bot.targetPages = req.body.targetPages;
  bot.targetTags = req.body.targetTags;
  bot.comments = req.body.comments;
  bot.directTexts = req.body.directTexts;
  bot.whiteList = req.body.whiteList;
  bot.botPace = req.body.botPace;
  bot.followPrivate = req.body.followPrivate;
  bot.likeLastPost = req.body.likeLastPost;

  await bot.markModified('details');
  await bot.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'متوقف شد.',
  });
});

exports.getBot = factory.getOne(Bot);
exports.getAllBots = factory.getAll(Bot);
exports.deleteBot = factory.deleteOne(Bot);
exports.updateBot = factory.updateOne(Bot);
