/* eslint-disable default-case */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');

const web = require('./utils/interfaces');
const follow = require('./controller/processes/followPro');
const unfollow = require('./controller/processes/unfollowProcess');
const likeTagPro = require('./controller/processes/likeTagPro');
const catchAsync = require('./utils/catchAsync');
const act = require('./utils/action');
const path = require('./utils/direction');

exports.login = (page, username, password) => {
  return new Promise(
    catchAsync(async resolve => {
      console.log('login started');
      // await path.goto_page(web.login_URL, '//button[contains(., "Log In")]');
      while (
        !(await path.goto_page(page, web.login_URL, 'input[name="username"]'))
      ) {
        if (await act.loginCheck(page)) {
          resolve();
          return;
        }
      }
      console.log('auth begine');
      await act.authenticate(page, username, password);
      web.turn = 'getDetail';
      resolve();
    })
  );
};

exports.getDetail = page => {
  return new Promise(
    catchAsync(async resolve => {
      console.log('start getting details');
      await path.goto_page(
        page,
        `https://www.instagram.com/${web.pageName}/`,
        `a[href="/${web.pageName}/followers/"]`,
        20000
      );
      await page.waitFor(2000);
      const following = await page.$$('li a span');
      web.following = await page.evaluate(
        element => element.textContent * 1,
        following[1]
      );

      const followers = await page.$$('li a span');
      web.followers = await page.evaluate(
        element => element.textContent * 1,
        followers[0]
      );

      process.send({
        pageName: web.pageName,
        followers: web.followers,
        following: web.following,
        modified: 'info'
      });
      console.log('getDetail is done');
      web.turn = 'follow';
      resolve();
    })
  );
};

exports.follow = (page, targets) =>
  new Promise(
    catchAsync(async resolve => {
      const { followCounter } = web;
      // eslint-disable-next-line no-restricted-syntax
      for (const target of targets) {
        // eslint-disable-next-line default-case
        if (web.followCounter.hasDone >= web.followLimit) {
          web.turn = 'unfollow';
          break;
        }
        // eslint-disable-next-line no-continue
        if (web.usedTargets.includes(target)) continue;
        switch (target.search('#')) {
          case 0:
            await follow.followTag(page, target, followCounter);
            break;
          case -1:
            await follow.followPage(page, target, followCounter);
            break;
        }
        web.usedTargets.push(target);
      }
      process.send({
        pageName: web.pageName,
        followed: web.followCounter.hasDone,
        liked: web.likeCounter.hasDone,
        commented: web.hasCommented,
        directed: web.hasSentDirect,
        modified: 'followed'
      });
      console.log('follow is done');
      web.turn = 'unfollow';
      web.likeCounter = { hasDone: 0, round: 0 };
      web.hasCommented = 0;
      web.hasSentDirect = 0;
      resolve();
    })
  );

exports.unfollow = page =>
  new Promise(
    catchAsync(async resolve => {
      console.log('start unfollow pro');
      if (web.Unfollowed >= web.unfollowLimit) {
        resolve();
        return;
      }
      await unfollow(page);
      process.send({
        pageName: web.pageName,
        unfollowed: web.Unfollowed,
        modified: 'unfollowed'
      });
      console.log('unfollow is done');
      web.turn = 'likeTags';
      resolve();
    })
  );

exports.likeTags = (page, items) =>
  new Promise(
    catchAsync(async resolve => {
      console.log('start like tag pro');
      if (web.likeCounter.hasDone >= web.likeLimit) {
        resolve();
        return;
      }
      await likeTagPro(page, items);
      process.send({
        pageName: web.pageName,
        liked: web.likeCounter.hasDone,
        commented: web.hasCommented,
        modified: 'liked'
      });
      console.log('likeTags is done');
      web.turn = 'follow';
      web.hasCommented = 0;
      resolve();
    })
  );

// exports.closeBrowser = () =>
//   new Promise(
//     catchAsync(async (resolve, reject) => {
//       await page.close();
//       await browser.close();
//       resolve();
//     })
//   );
