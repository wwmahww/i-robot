/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */

const web = require('./interfaces');
const path = require('./direction');
const _error = require('./errorClass');
const catchAsync = require('./catchAsync');

exports.authenticate = (page, username, password) => {
  return new Promise(
    catchAsync(async (resolve) => {
      let code;
      await page.waitFor(2000);
      await page.waitFor('input[name="username"]');
      /* writeing the username and password */
      await page.type('input[name="username"]', username, { delay: 50 });
      await page.type('input[name="password"]', password, { delay: 50 });

      //click on login button
      await path.click(page, '//button[contains(., "Log In")]', '', 30000);
      // check if login has done properly
      while (!(await this.loginCheck(page))) {
        console.log('security');

        const button = await page.$x(
          '//button[contains(., "Send Security Code")]'
        );
        if (button[0]) {
          console.log('first');
          await button[0].click();
          await page.waitFor(2000);
          // # need to get the secure code from user to code
        } else {
          // # need to get the secure code from user to code
          await page.reload({ waitUntil: 'load', timeout: 5000 });
          await page.waitFor(1000);
        }
        console.log('hear!');
        await page.type('input[aria-label="Security code"]', code, {
          delay: 50,
        });
        await path.click(page, '//button[contains(., "Submit")]');
      }
      // readline.close();
      console.log('out');
      resolve();
    })
  );
};

exports.loginCheck = (page) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      const loginID = await page.evaluate(() => {
        if (window._sharedData) {
          return window._sharedData.config.viewerId;
        }
      });
      console.log('loginID: ', loginID);
      if (loginID) {
        console.log('we are loged in');
        await page.waitFor(2000);
        resolve(true);
        return;
      }
      console.log('we are not loged in');
      resolve(false);
    })
  );
};

exports.unfollow = (page, button) =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      const text = await page.evaluate((button) => button.textContent, button);

      console.log(text);
      if (text === 'Following') {
        // Click on unfollow button
        await path.click(
          page,
          button,
          '//button[contains(.,"Unfollow")]',
          3000,
          ''
        );
        const admit = await page.$x('//button[contains(.,"Unfollow")]');
        await admit[0].click();
        return true;
      }
      return false;
    })
  );

exports.like = (page) => {
  return new Promise(
    catchAsync(async (resolve) => {
      console.log('like start.');
      const isLikable = await page.$('svg[aria-label="Like"]');
      await page.waitFor(2000);
      // If you haven't liked this post
      if (isLikable) {
        await page.evaluate(
          (element) => Promise.resolve(element.scrollIntoView()),
          isLikable
        );
        await page.waitFor(500);
        await page.click('svg[aria-label="Like"]');
        console.log('done');
        resolve(true);
        return;
      }
      console.log('faild');
      resolve(false);
    })
  );
};

exports.comment = (page) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('comment start');

      let done = false;

      await page.waitFor(1000);
      await page.waitFor('textarea');
      await page.click('textarea');
      await page.keyboard.type(
        web.comments[Math.floor(Math.random() * web.comments.length)], //randomly choose one of the comments
        { delay: 100 }
      );
      await page.waitFor(2000);

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 3; i++) {
        console.log('send post');
        const submit = await page.$('button[type="submit"]');
        if (submit) {
          await page.click('button[type="submit"]');
          await page.waitFor(1000);
          await page
            .waitFor(`//a[contains(., '${web.pageName}')]`, { timeout: 3000 })
            .then(() => {
              done = true;
              resolve(true);
            })
            .catch(() => {
              console.log('problem in sending comment.');
            });
        }
        console.log('done: ', done);
        if (done) break;
        if (i === 2) resolve(false);
      }
    })
  );
};

exports.loadPage = (page, url) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('reachToFollowerpage started.');

      if (url.search('header') === 0) {
        await path.click(page, url, 'ul > li:nth-child(2) > a', 10000); // Click on page link
        await page.waitFor(2000);
      } else {
        // If there was a current page
        console.log('it use current url');
        await path.goto_page(page, url, 'ul > li:nth-child(2) > a');
        await page.waitFor(2000);
      }
      resolve();
    })
  );
};

exports.sendDirect = (page) =>
  new Promise(
    catchAsync(async (resolve) => {
      console.log('direct start');
      await page.waitFor('//button[contains(.,"Message")]');
      const button = await page.$x('//button[contains(.,"Message")]');
      if (button) {
        console.log('click on message');
        await button[0].click();
        await page.waitFor(2000);
        await page.waitFor('textarea');
        await page.click('textarea');
        await page.keyboard.type(
          web.directTexts[Math.floor(Math.random() * web.comments.length)],
          { delay: 100 }
        );
        await page.waitFor(1000);
        await path.click(page, '//button[contains(., "Send")]');
        await page.waitFor(3000);
        await page.goBack({ waitUntil: 'load' });
        await page.waitFor(2000);
        resolve(true);
        return;
      }
      resolve(false);
    })
  );
