/* eslint-disable no-await-in-loop */

const puppeteer = require('puppeteer');

const web = require('../../utils/interfaces');
const subFollow = require('./subFollowPro');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');
const act = require('../../utils/action');
const path = require('../../utils/direction');

const iPhone = puppeteer.devices['Galaxy Note 3'];

const reload = (page, currentPage) =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('reload is hear');
      let permission = false;
      while (!permission) {
        await act.loadPage(page, currentPage);
        await page.waitFor(2000);
        await path
          .click(page, '//a[contains(., "followers")]', 'li canvas', 10000)
          // eslint-disable-next-line no-loop-func
          .then(res => {
            permission = res;
            console.log('res: ', permission);
          });
      }
      resolve();
    })
  );
module.exports = (page, counter, currentPage) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('loop is started.');
      const page2 = await web.browser.newPage();
      await page2.emulate(iPhone);
      web.page2 = page2;

      while (counter.hasDone <= web.followLimit) {
        let buttons = await page.$$('button');
        let pageLinks = await page.$$('a[title]');
        while (counter.round < buttons.length) {
          console.log(counter);
          console.log('buttons lenght: ', buttons.length);

          const buttonText = await page.evaluate(
            element => element.textContent,
            buttons[counter.round]
          );
          const pageName = await page.evaluate(
            element => element.textContent,
            pageLinks[counter.round]
          );

          console.log('text: ', buttonText);
          if (buttonText === 'Follow') {
            web.writeComment = counter.hasDone % web.commentPace === 0;
            if (await subFollow(page2, pageName)) {
              counter.hasDone += 1;
              web.followCounter.hasDone = counter.hasDone;
            }
            if (counter.hasDone >= web.followLimit) break;
            await page.waitFor(2000);
          }
          counter.round += 1;
          web.followCounter.round = counter.round;
        }
        console.log('not yet!');
        // check limit
        if (counter.hasDone >= web.followLimit) break;
        // scroll
        if (!buttons) {
          console.log('******* infinit hole **************');
          await reload(page, currentPage);
        }
        console.log('ttt!');
        const elementscroll = await page.$('html');
        await page.evaluate(element => element.scrollBy(0, 500), elementscroll);
      }
      await page2.close();
      resolve(counter);
    })
  );
};
