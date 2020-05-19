const { fork } = require('child_process');

const Bot = require('./../models/botModel');
const web = require('./../bot/utils/interfaces');
const catchAsync = require('./../utils/catchAsync');

const save = async data => {
  const {
    pageName,
    modified,
    followed,
    unfollowed,
    liked,
    commented,
    directed,
    posts,
    followers,
    following
  } = data;
  const bot = await Bot.findOne({ pageName });
  bot.details = bot.details ? bot.details : {};
  bot.pageInfo = bot.pageInfo ? bot.pageInfo : {};

  bot.details.hasFollowed = bot.details.hasFollowed || 0;
  bot.details.hasUnfollowed = bot.details.hasUnfollowed || 0;
  bot.details.hasLiked = bot.details.hasLiked || 0;
  bot.details.hasCommented = bot.details.hasCommented || 0;
  bot.details.hasDirected = bot.details.hasDirected || 0;

  console.log('bot hasfollowed: ', bot.details.hasFollowed);
  console.log('recieved followed: ', followed);

  switch (modified) {
    case 'info':
      console.log('followers');
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

  console.log('bot details: ', bot.details);
  console.log('now saving');
  bot.markModified('details');
  await bot.save({ validateBeforeSave: false });
  console.log('saveing is done');
};

exports.launch = bot =>
  new Promise(resolve => {
    console.log('bot start');
    const child = fork('./bot/index.js');
    child.send(bot);
    // ---------------------------------------------------------------
    web.childs[bot.pageName] = child;
    // --------------------------------------------------------------
    child.on('error', err => {
      console.log('error: ', err);
    });

    child.on('exit', () => {
      console.log('cp exited');
    });

    child.on('message', data => {
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
    catchAsync(async resolve => {
      const bots = await Bot.find({ active: true });
      bots.map(async bot => {
        await this.launch(bot);
      });
      resolve();
    })
  );
