/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const path = require('../../utils/direction');
const act = require('../../utils/action');
const web = require('../../utils/interfaces');
const methods = require('../../utils/methods');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

module.exports = page =>
  new Promise(
    catchAsync(async resolve => {
      console.log('in unfollowed');

      await path.goto_page(
        page,
        `https://www.instagram.com/${web.pageName}/`,
        `a[href="/${web.pageName}/followers/"]`,
        20000
      );
      await page.waitFor(2000);
      // Unfollow if the following number was more than a certain number
      let following = await page.$$('li a span');
      following = await page.evaluate(
        element => element.textContent,
        following[1]
      );

      if (following * 1 < web.unfollowStartAfter) {
        resolve();
        return;
      }

      await path.click(
        page,
        `a[href="/${web.pageName}/following/"]`,
        'img',
        5000
      );
      await page.waitFor(2000);
      const bodyElement = await page.$('html');

      // scroll tha page to the bottom
      while (true) {
        await page.evaluate(
          element => Promise.resolve(element.scrollBy(0, element.scrollHeight)),
          bodyElement
        );
        await page.waitFor(3000);
        const finish = await page.evaluate(element => {
          return Promise.resolve(
            element.scrollHeight - element.clientHeight ===
              Math.round(element.scrollTop)
          );
        }, bodyElement);

        console.log(finish);
        if (finish) break;
      }
      //---------------------------------------------------------
      // Unfollow loop
      while (web.Unfollowed < web.unfollowLimit) {
        let buttons = await page.$x('//button[contains(., "Following")]');
        let names = await page.$$('a[title]');

        console.log('number of buttons: ', buttons.length);
        console.log('number of names: ', names.length);

        // eslint-disable-next-line no-plusplus
        for (let i = buttons.length; i >= 0; i--) {
          console.log('unfollowed: ', web.Unfollowed);
          // eslint-disable-next-line no-plusplus
          const button = buttons[i - 1];
          const name = await page.evaluate(
            element => element.textContent,
            names[i - 1]
          );
          const buttonText = await page.evaluate(
            element => element.textContent,
            button
          );
          await page.waitFor(2000);

          // if (saveList.includes(name)) continue;
          if (!web.whiteList.includes(name) & (buttonText === 'Following')) {
            await path.click(
              page,
              button,
              '//button[contains(.,"Unfollow")]',
              5000
            );
            const admitUnfollow = await page.$x(
              '//button[contains(.,"Unfollow")]'
            );
            await admitUnfollow[0].click();
            await page.waitFor(2000);
            // eslint-disable-next-line no-plusplus
            web.Unfollowed++;
          }
          if (web.Unfollowed >= 20) {
            console.log('done');
            resolve();
            return;
          }
        }
        const finish = await page.evaluate(element => {
          if (element.scrollTop === 0) return true;
          bodyElement.scrollBy(0, -500);
          return false;
        }, bodyElement);

        if (finish) break;
        await page.waitFor(4000);
      }
      resolve();
    })
  );
