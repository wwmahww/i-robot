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
const e = require('express');

// ==========================================================

exports.start = catchAsync(async (req, res, next) => {
  console.log('in start');
  const { id } = req.params;
  const bot = req.user.bots.find((b) => {
    return b.pageName === id;
  });

  if (!bot) {
    return next(new AppError('you do not have a bot with this name.', 401));
  }

  const newBot = await Bot.findOne({ pageName: bot.pageName });

  if (bot.timeLeft === 1234567890) {
    await botLauncher.launch(bot, 'observe');
  } else {
    await botLauncher.launch(bot);
  }

  console.log('after lunch');
  console.log('bot: ', bot);

  newBot.active = true;
  newBot.markModified('active');
  await newBot.save({ validateBeforeSave: false });

  console.log('after save');

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
  const { timeLeft } = req.body;

  const bot = req.body;
  console.log('bot: ', bot);

  const { user } = req;

  const service = user.services.find((item, index) => {
    serviceIndex = index;
    return item.timeLimit === timeLeft * 1 && item.status === 'ready';
  });
  if (!service) {
    return next(new AppError('این سرویس برای شما فعال نمی‌باشد', 401));
  }

  bot.owner = req.user._id;
  bot.timeLeft *= 86400000;
  bot.refID = service.refID;

  const newBot = await Bot.create(bot);

  console.log('new bot: ', newBot);

  if (!newBot) {
    return next(
      new AppError('مشکلی در ساخت ربات ایجاد شد. لطفا دوباره امتحان کنید', 401)
    );
  }
  console.log('new bot id: ', newBot.id);

  // change service status
  service.status = 'active';
  user.services.splice(serviceIndex, 1);
  user.services.push(service);

  user.bots.push(newBot._id);
  console.log('bots: ', user.bots);
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
  console.log('pagename: ', pageName);

  const bot = req.user.bots.find((b) => {
    return b.pageName === pageName;
  });
  console.log('0000000');
  console.log('body: ', req.body);

  if (!bot) {
    return next(new AppError('you do not have a bot with this name.', 401));
  }
  const newBot = await Bot.findOne({ pageName: bot.pageName });

  console.log('newbot: ', newBot);

  console.log('1111.');
  console.log('bot :', bot);

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

  await bot.save({ validateBeforeSave: false });

  console.log('222222.');

  res.status(200).json({
    status: 'success',
    message: 'متوقف شد.',
  });
});

exports.getBot = factory.getOne(Bot);
exports.getAllBots = factory.getAll(Bot);
exports.deleteBot = factory.deleteOne(Bot);
exports.updateBot = factory.updateOne(Bot);
