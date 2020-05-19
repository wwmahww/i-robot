const web = require('./interfaces');
const index = require('./../index');

module.exports = fn => {
  return (...args) => {
    fn(...args).catch(async err => {
      if (err) console.log('catchAsync Error💥:', err);
      if (Object.keys(web.page2).length !== 0 && !web.page2.isClosed())
        web.page2.close();
      if (web.page.isClosed()) {
        console.log('launch new page');
        await index.bLauncher();
        console.log('new page has been created');
        index.sequence();
      } else {
        console.log('we are in else');
        web.page.waitFor(5000);
        console.log('get button');
        const button = await web.page.$$('div[dialog] button');
        console.log('button: ', button);
        if (button[1]) {
          console.log('/////button is hear/////');
          await button[1].click();
        }
        console.log('module in the middle:', index);
        await web.page.waitFor(2000);
        console.log('***start again***');
        index.sequence();
      }
    });
  };
};
