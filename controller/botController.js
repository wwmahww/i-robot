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

// ==========================================================

exports.start = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const bot = req.user.bots.find((b) => {
    return b.pageName === id;
  });

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

  web.childs[id].kill();
  web.childs[id] = undefined;

  bot.active = false;
  bot.markModified('active');
  await bot.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'bot stoped.',
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role === 'user' && user.bots.length >= 1) {
    console.log('hear');
    return res.status(400).json({
      status: 'success',
      message: 'نمیتوانید بیشتر از یک ربات داشته باشید.',
      date: {
        // newBot
      },
    });
  }
  const newBot = await Bot.create(req.body);
  user.bots[user.bots.length] = newBot.id;
  user.markModified('bots');
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    message: 'ربات ساخته شد.',
    date: {
      // newBot
    },
  });
});

exports.updateMyBot = catchAsync(async (req, res, next) => {
  console.log('request came.');
  const { id } = req.params;
  const bot = req.user.bots.find((b) => {
    return b.pageName === id;
  });

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
