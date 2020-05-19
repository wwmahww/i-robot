/* eslint-disable no-await-in-loop */
const web = require('./interfaces');
const catchAsync = require('./catchAsync');

exports.goto_page = (
  page,
  url,
  check = '',
  timeout = 30000,
  waitUntil = 'load'
) => {
  return new Promise(
    catchAsync(async resolve => {
      // Goto the url
      console.log('loading page');
      let done = false;
      await page.waitFor(2000);
      for (let i = 0; i <= 2; i++) {
        try {
          await page.goto(url, { waitUntil: waitUntil, timeout: timeout });
          if (check !== '') await page.waitFor(check);
          done = true;
          break;
        } catch (err) {
          done = false;
        }
      }
      await page.waitFor(1000);
      resolve(done);
    })
  );
};

exports.click = (
  page,
  element,
  check = '',
  timeout = 10000,
  waitUntil = 'networkidle0'
) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      let link;
      let click = 'click';
      let success = false;
      // Determin what is element --------------------------------------------------------------------
      if (typeof element === 'object') {
        link = element;
        console.log('element is an object');
      } else if (element.search('//') === 0) {
        console.log('element is not an object');

        console.log('xpath');
        link = await page.$x(element);
        link = link[0];
      } else if (element !== '') {
        console.log('normal element');
        link = await page.$(element);
      } else {
        link = page;
        click = 'reload';
      }
      //-----------------------------------------------------------------------------------------------
      await page.waitFor(2000);
      await Promise.all([
        page.waitForNavigation({ waitUntil: waitUntil, timeout: timeout }),
        link[click]()
      ]).catch(() => {
        console.log('navigation error!');
      });

      if (check !== '')
        await page
          .waitFor(check)
          .then(() => {
            success = true;
          })
          .catch(err => {
            console.log('error in finding check element');
          });
      await page.waitFor(1000);
      resolve(success);
    })
  );
};
