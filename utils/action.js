const util = require('util');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = util.promisify(readline.question).bind(readline);
const rlon = util.promisify(readline.on).bind(readline);

const web = require('./interfaces');
const path = require('./direction');
const _error = require('./errorClass');
const catchAsync = require('./catchAsync');

exports.authenticate = (username, password) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      let login = false;
      let code;
      await web.page.waitFor(2000);
      /* writeing the username and password */
      await web.page.type('input[name="username"]', username, { delay: 50 });
      await web.page.type('input[name="password"]', password, { delay: 50 });

      //click on login button
      await path.click('//button[contains(., "Log In")]', '', 30000);
      // check if login has done properly
      while (!(await this.loginCheck())) {
        console.log('security');

        const button = await web.page.$x(
          '//button[contains(., "Send Security Code")]'
        );
        if (button[0]) {
          await button[0].click();
          await web.page.waitFor(2000);
          await question(`please enter the code:\n`).catch(reply => {
            code = reply;
          });
        } else {
          readline.setPrompt('please enter again:\n');
          readline.prompt();
          await rlon('line').catch(reply => {
            code = reply;
          });
          await web.page.reload({ waitUntil: 'load', timeout: 5000 });
          await web.page.waitFor(1000);
        }

        await web.page.type('input[aria-label="Security code"]', code, {
          delay: 50
        });
        await path.click('//button[contains(., "Submit")]');
      }
      // readline.close();
      console.log('out');
      resolve();
    })
  );
};

exports.loginCheck = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      const loginID = await web.page.evaluate(() => {
        return window._sharedData.config.viewerId;
      });
      console.log('loginID: ', loginID);
      if (loginID) {
        console.log('we are loged in');
        await web.page.waitFor(2000);
        resolve(true);
        return;
      }
      console.log('we are not loged in');
      resolve(false);
    })
  );
};

exports.unfollow = button =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      let text = await web.page.evaluate(button => button.textContent, button);

      console.log(text);
      if (text === 'Following') {
        // Click on unfollow button
        await path.click(button, '//button[contains(.,"Unfollow")]', 3000, '');
        const admit = await web.page.$x('//button[contains(.,"Unfollow")]');
        await admit[0].click();
        return true;
      }
      return false;
    })
  );

exports.like = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('like start.');
      await web.page.waitFor(2000);
      const isLikable = await web.page.$('svg[aria-label="Like"]');
      // If you haven't liked this post
      if (isLikable) {
        await web.page.click('svg[aria-label="Like"]');
        console.log('done');
        resolve();
        return;
      }
      console.log('faild');
      resolve();
    })
  );
};

exports.comment = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('comment start');
      await web.page.waitFor(1000);
      await web.page.waitFor('textarea');

      let done = false;

      await web.page.click('textarea');
      await web.page.keyboard.type(web.comment_text, { delay: 30 });

      while (!done) {
        await web.page.click('button[type="submit"]');
        await web.page.waitFor(2000);
        await web.page
          .waitFor(`//a[contains(., ${web.username})]`, 3000)
          .then(() => {
            done = true;
          });
        console.log('done: ', done);
      }
      resolve();
    })
  );
};

exports.loadPage = page => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('reachToFollowerpage started.');

      if (page.search('header') === 0) {
        await path.click(page, 'ul > li:nth-child(2) > a', 10000); // Click on page link
        await web.page.waitFor(2000);
      } else {
        // If there was a current page
        console.log('it use current url');
        await path.goto_page(page, 'ul > li:nth-child(2) > a');
        await web.page.waitFor(2000);
      }
      resolve();
    })
  );
};
