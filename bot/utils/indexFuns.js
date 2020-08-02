/* eslint-disable default-case */
/* eslint-disable no-fallthrough */
const { CronJob } = require('cron');
const web = require('./interfaces');
const handler = require('../handler');
const observer = require('../observer');
const pool = require('../initializer');
const act = require('./action');

let targetPages;
let targetTags;
let pageName;
let pagePassword;
let page;
let resourcePromise;

exports.setData = function (data) {
  console.log('set data');
  const bot = data;
  ({ pageName, pagePassword, targetTags, targetPages } = bot);
  web.pageName = pageName;
  web.comments = bot.comments;
  web.directTexts = bot.directTexts;
  web.whiteList = bot.whiteList;
  web.followPrivate = bot.followPrivate;
  web.likeLastPost = bot.likeLastPost;
  web.processPace = bot.botPace;
};

exports.setTimer = function (data) {
  console.log('in set timer');
  // Time duration for bot. it send the decrease command evry 6 hour
  const timer = data.timeLeft < 21600000 ? data.timeLeft : 21600000;
  setInterval(() => {
    web.sixHours += 1;
    web.quarterCounter = 0;
    process.send({ pageName: web.pageName, decreaseTimeBy: timer });
  }, 21600000);

  //-----------------------
  // this will count times under 6 hour
  setInterval(() => {
    web.quarterCounter += 1;
  }, 900000);
};

const init = () => {
  // eslint-disable-next-line default-case
  switch (web.processPace) {
    case 'slow':
    case 'medium':
      web.followLimit = 7 + Math.floor(Math.random() * 7);
      web.likeLimit = 16 + Math.floor(Math.random() * 6);
      web.unfollowLimit = 17 + Math.floor(Math.random() * 6);
      web.commentPace = 6;
      web.directLimitPerProcess = 1;
      web.followPrivateLimit = web.followLimit - web.directLimitPerProcess; // make space to follow no private and send direct
      break;
    // case 'medium':
    //   break;
    case 'fast':
      web.followLimit = 16 + Math.floor(Math.random() * 7);
      web.likeLimit = 30 + Math.floor(Math.random() * 6);
      web.unfollowLimit = 17 + Math.floor(Math.random() * 6);
      web.commentPace = 5;
      web.directLimitPerProcess = 1;
      web.followPrivateLimit = web.followLimit - web.directLimitPerProcess; // make space to follow no private and send direct
      break;
  }
};

// It launch the browser
const bLauncher = () =>
  new Promise((resolve) => {
    resourcePromise = pool.acquire();
    resourcePromise.then(async (fun) => {
      console.log('we are in then!');
      page = await fun();
      web.page = page;
      web.turn = 'login';
      resolve();
    });
  });

const sequence = async () => {
  console.log('in sequence');
  // Launch browser if its not
  if (Object.keys(web.page).length === 0) {
    await bLauncher();
  }
  // Init the bot
  init();

  // Check if its loged in
  if (!(await act.loginCheck(page))) {
    await handler.login(page, pageName, pagePassword);
  }

  // await page.waitFor(Math.floor(Math.random() * 30) * 1000 * 60);

  // sequence controller
  switch (web.turn) {
    case 'getDetail':
      await handler.getDetail(page);
    case 'follow':
    // await handler.follow(page, targetPages);
    case 'unfollow':
    // await handler.unfollow(page);
    case 'likeTags':
    // await handler.likeTags(page, targetTags);
  }

  // reset bot to the begining
  web.followCounter = { hasDone: 0, round: 0 };
  web.Unfollowed = 0;
  web.likeCounter = { hasDone: 0, round: 0 };
};

const observe = async () => {
  // Launch browser if its not
  if (Object.keys(web.page).length === 0) {
    await bLauncher();
  }
  // Init the bot
  init();

  // Check if its loged in
  if (!(await act.loginCheck(page))) {
    await observer.loginTest(page, pageName, pagePassword);
  }

  // sequence controller
  switch (web.turn) {
    case 'getDetails':
      await observer.getDetailsTest(page);
    case 'follow':
      await observer.followTest(page, 'laxucars');
    case 'followTag':
      await observer.followTagTest(page, 'cars');
    case 'unfollow':
      await observer.unfollowTest(page);
    case 'likeTag':
      await observer.likeTagTest(page, 'cars');
  }
};

exports.manager = (order) => {
  const processPace = web.processPace === 'slow' ? 2 : 1;
  switch (order) {
    case 'sequence': {
      const min = Math.floor(Math.random() * 59);
      console.log('min: ', min);
      // prettier-ignore
      const job = new CronJob(`0 ${min} 8-23/${processPace} * * *`,sequence,null,true,'Iran');
      job.start();
      break;
    }
    case 'observe': {
      const job = new CronJob(`0 0 8-23/1 * * *`, observe, null, true, 'Iran');
      job.start();
      break;
    }
  }
};

exports.sequence = sequence;
exports.observe = observe;
exports.init = init;
exports.bLauncher = bLauncher;
