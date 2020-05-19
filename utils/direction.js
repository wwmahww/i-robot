const web = require('./interfaces');
const catchAsync = require('./catchAsync');

exports.goto_page = (url, check = '', timeout = 30000, waitUntil = 'load') => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      // Goto the url
      console.log('loading page');
      await web.page.waitFor(2000);
      await web.page.goto(url, { waitUntil: waitUntil, timeout: timeout });
      if (check !== '') await web.page.waitFor(check);
      await web.page.waitFor(1000);
      resolve();
    })
  );
};

exports.click = (
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
        link = await web.page.$x(element);
        link = link[0];
      } else if (element !== '') {
        console.log('normal element');
        link = await web.page.$(element);
      } else {
        link = web.page;
        click = 'reload';
      }
      //-----------------------------------------------------------------------------------------------
      await web.page.waitFor(2000);
      await Promise.all([
        web.page.waitForNavigation({ waitUntil: waitUntil, timeout: timeout }),
        link[click]()
      ]).catch(() => {
        console.log('navigation error!');
      });

      if (check != '')
        await web.page
          .waitFor(check)
          .catch(() => {
            console.log('not appear!');
          })
          .then(() => {
            success = true;
          });
      await web.page.waitFor(1000);
      resolve(success);
    })
  );
};
