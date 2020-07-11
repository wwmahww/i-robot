/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
const fs = require('fs');
const { CronJob } = require('cron');

const handler = require('./handler');
const web = require('./utils/interfaces');
const pool = require('./initializer');
const act = require('./utils/action');

let targetPages;
let targetTags;
let pageName;
let pagePassword;
let page;
let resourcePromise;

const init = () => {
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

  const obj = { ...web };
  delete obj.browser;
  delete obj.page;

  fs.writeFile('/interface.txt', JSON.stringify(obj), (err) => {
    console.log('error in writeing file:', err);
  });
};

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
  if (Object.keys(web.page).length === 0) {
    await bLauncher();
  }
  console.log('before init');
  init();
  console.log('before login check!');

  if (!(await act.loginCheck(page))) {
    await handler.login(page, pageName, pagePassword);
  }
  console.log('last one');

  // await page.waitFor(Math.floor(Math.random() * 30) * 1000 * 60);

  switch (web.turn) {
    case 'getDetail':
      await handler.getDetail(page);
    case 'follow':
      await handler.follow(page, targetPages);
    case 'unfollow':
      await handler.unfollow(page);
    case 'likeTags':
      await handler.likeTags(page, targetTags);
  }
  web.followCounter = { hasDone: 0, round: 0 };
  web.Unfollowed = 0;
  web.likeCounter = { hasDone: 0, round: 0 };
};

const manager = (order) => {
  const divide = web.processPace === 'slow' ? 2 : 1;
  switch (order) {
    case 'sequence': {
      const min = Math.floor(Math.random() * 59);
      console.log('min: ', min);
      // prettier-ignore
      const job = new CronJob(`0 ${min} 8-23/${divide} * * *`,sequence,null,true,'Iran');
      job.start();
      break;
    }
    // case ''
  }
};

process.on('message', (data) => {
  if (data === 'finish') {
    process.send({
      pageName: web.pageName,
      decreaseTimeBy: web.quarterCounter * 900000,
    });
    return;
  }
  const bot = data;
  ({ pageName, pagePassword, targetTags, targetPages } = bot);
  web.pageName = pageName;
  web.comments = bot.comments;
  web.directTexts = bot.directTexts;
  web.whiteList = bot.whiteList;
  web.followPrivate = bot.followPrivate;
  web.likeLastPost = bot.likeLastPost;
  web.processPace = bot.botPace;

  process.send(`started`);

  // Time duration for bot. it send the decrease command evry 6 hour
  const timer = bot.timeLeft < 21600000 ? bot.timeLeft : 21600000;
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

  // manager('sequence');
  sequence();
});

module.exports.sequence = sequence;
module.exports.bLauncher = bLauncher;
