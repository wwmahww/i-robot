/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const web = require('./utils/interfaces');
const catchAsync = require('./utils/testCatchAsync');
const act = require('./utils/action');
const path = require('./utils/direction');
const likeLastPost = require('./controller/processes/likeLastPost');

exports.loginTest = (page, username, password) =>
  new Promise(
    catchAsync(async (resolve) => {
      console.log('login test started');
      await path.goto_page(page, web.login_URL, 'input[name="username"]');
      await act.loginCheck(page);
      await act.authenticate(page, username, password);
      console.log('login test finished');
      web.turn = 'getDetails';
      resolve();
    })
  );

exports.getDetailsTest = (page) =>
  new Promise(
    catchAsync(async (resolve) => {
      console.log('get details test started');
      await path.goto_page(
        page,
        `https://www.instagram.com/${web.pageName}/`,
        `a[href="/${web.pageName}/followers/"]`,
        20000
      );
      const posts = await page.$$('li span span');
      const followers = await page.$$('li a span');
      const following = await page.$$('li a span');
      console.log('get details test finished');
      web.turn = 'follow';
      resolve();
    })
  );

exports.followTest = (page, target) =>
  new Promise(
    catchAsync(async (resolve) => {
      console.log('follow test started');
      const iPhone = puppeteer.devices['Galaxy Note 3'];
      const page2 = await web.browser.newPage();
      await page2.emulate(iPhone);
      web.page2 = page2;

      await path.goto_page(
        page,
        web.Page_URL(target),
        'article > div:nth-child(1) img[decoding="auto"]'
      );
      await path.click(
        page,
        '//a[contains(., "followers")]',
        'ul button',
        10000,
        'load'
      );

      const pageLinks = await page.$$('a[title]');
      const buttons = await page.$$('button');

      for (let i = 0; i < 1000; i++) {
        console.log('in for');
        const buttonText = await page.evaluate(
          (element) => element.textContent,
          buttons[i]
        );
        const pageName = await page.evaluate(
          (element) => element.textContent,
          pageLinks[i]
        );
        if (buttonText === 'Follow') {
          console.log('ready to follow');
          await path.goto_page(
            page2,
            web.Page_URL(pageName),
            '//button[contains(.,"Follow")]'
          );
          const isBusiness = await page2.evaluate(() => {
            return window._sharedData.entry_data.ProfilePage[0].graphql.user
              .is_business_account;
          });
          const isPrivate = await page2.evaluate(() => {
            return window._sharedData.entry_data.ProfilePage[0].graphql.user
              .is_private;
          });
          if (typeof isBusiness !== 'boolean' || typeof isPrivate !== 'boolean')
            throw new Error('cannot detect isprivate or is business');

          let hasPost = await page2.$('li span span');
          hasPost = await page2.evaluate(
            (element) => element.textContent,
            hasPost
          );

          if (isPrivate === false && hasPost !== '0') break;
        }
      }

      const button = await page2.$x('//button[contains(.,"Follow")]');
      await button[0].click();

      await act.sendDirect(page2);
      await likeLastPost(page2);
      await page2.close();
      console.log('follow test finished');
      web.turn = 'followTag';
      resolve();
    })
  );

exports.followTagTest = (page, target) =>
  new Promise(
    catchAsync(async (resolve) => {
      console.log('follow tag test started');
      await path.goto_page(
        page,
        web.TAG_URL(tag.substring(1)),
        'article > div:nth-child(1) img[decoding="auto"]'
      );
      let post = await page.$(
        'article > div:nth-child(1) img[decoding="auto"]'
      );
      await path.click(
        page,
        post,
        'header > div:nth-child(2) a:nth-child(1)',
        5000
      );
      await act.loadPage(page, 'header > div:nth-child(2) a:nth-child(1)');
      console.log('follow tag test finished');
      web.turn = 'unfollow';
      resolve();
    })
  );

exports.unfollowTest = (page) =>
  new Promise(
    catchAsync(async (resolve) => {
      console.log('unfollow test started');
      await path.goto_page(
        page,
        `https://www.instagram.com/${web.pageName}/`,
        `a[href="/${web.pageName}/followers/"]`,
        20000
      );
      let following = await page.$$('li a span');
      await path.click(
        page,
        `a[href="/${web.pageName}/following/"]`,
        'img',
        5000
      );
      let buttons = await page.$x('//button[contains(., "Following")]');
      let name = await page.$('a[title]');

      await path.click(page, button, '//button[contains(.,"Unfollow")]', 5000);
      const admitUnfollow = await page.$x('//button[contains(.,"Unfollow")]');
      await admitUnfollow[0].click();
      console.log('unfollow test finished');
      web.turn = 'likeTag';
      resolve();
    })
  );

exports.likeTagTest = (page, tag) =>
  new Promise(
    catchAsync(async (resolve) => {
      console.log('likeTag test started');
      await path.goto_page(
        page,
        web.TAG_URL(tag),
        'img',
        30000,
        'networkidle0'
      );
      let post = await page.$(
        'article > div:nth-child(3) img[decoding="auto"]'
      );
      await path.click(page, post, 'section section svg', 20000);
      await act.like(page);
      console.log('likeTag test finished');
      web.turn = 'getDetails';
      resolve();
    })
  );
