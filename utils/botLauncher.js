const { fork } = require('child_process');

const Bot = require('../models/botModel');
const web = require('../bot/utils/interfaces');
const catchAsync = require('./catchAsync');

const save = async (data) => {
  const bot = await Bot.findOne({ pageName: data.pageName });
  // Update bot just for timeLeft
  if (data.decreaseTimeBy) {
    console.log('update time');
    const { decreaseTimeBy } = data;
    await bot.updateOne({ $inc: { timeLeft: decreaseTimeBy * -1 } });
    return;
  }
  // Update othe items of bot
  const {
    modified,
    followed,
    unfollowed,
    liked,
    commented,
    directed,
    posts,
    followers,
    following,
  } = data;

  bot.details = bot.details || {};
  bot.pageInfo = bot.pageInfo || {};

  console.log('bot : ', bot);

  // it this is the first time , this items needed to be initielized
  bot.details.hasFollowed = bot.details.hasFollowed || 0;
  bot.details.hasUnfollowed = bot.details.hasUnfollowed || 0;
  bot.details.hasLiked = bot.details.hasLiked || 0;
  bot.details.hasCommented = bot.details.hasCommented || 0;
  bot.details.hasDirected = bot.details.hasDirected || 0;
  //==============================================================

  // Identify the change and update the bot
  switch (modified) {
    case 'info':
      console.log('info');
      bot.pageInfo.posts = posts;
      bot.pageInfo.followers = followers;
      bot.pageInfo.following = following;
      if (bot.pageInfo.startFollowers === undefined)
        bot.pageInfo.startFollowers = followers;
      bot.pageInfo.followIncreasRate = followers - bot.pageInfo.startFollowers;
      break;
    case 'followed':
      bot.details.hasFollowed += followed;
      bot.details.hasLiked += liked;
      bot.details.hasCommented += commented;
      bot.details.hasDirected += directed;
      break;
    case 'unfollowed':
      bot.details.hasUnfollowed += unfollowed;
      break;
    case 'liked':
      bot.details.hasLiked += liked;
      bot.details.hasCommented += commented;
      break;
    default:
      console.log('nothing');
  }

  console.log('bot update: ', bot);

  bot.markModified('details');
  bot.markModified('pageInfo');
  await bot.save({ validateBeforeSave: false });

  console.log('saveing is done');
};

exports.launch = (bot) =>
  new Promise((resolve) => {
    console.log('bot start');
    const child = fork('./bot/index.js');
    console.log('hear after fork');
    child.send(bot);
    console.log('hear send message');
    // ---------------------------------------------------------------
    web.childs[bot.pageName] = child;
    // --------------------------------------------------------------
    child.on('error', (err) => {
      console.log('error: ', err);
    });

    child.on('exit', () => {
      console.log('cp exited');
    });

    child.on('message', (data) => {
      console.log('received data: ', data);
      if (data.pageName) {
        save(data);
        console.log('after save');
        resolve();
      }
      if (data === 'started') resolve();
    });
  });

exports.launcher = () =>
  new Promise(
    catchAsync(async (resolve) => {
      const bots = await Bot.find({ active: true });
      bots.map(async (bot) => {
        await this.launch(bot);
      });
      resolve();
    })
  );
