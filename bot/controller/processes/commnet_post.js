const path = require('../../utils/direction');
const web = require('../../utils/interfaces');
const act = require('../../utils/action');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

module.exports = page => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('commentPost starts');
      await page.waitFor(2000);
      const link = await page.$('svg[aria-label="Comment"]');
      if (link) {
        console.log('inside of comment');
        // Add commnet
        await path.click(page, 'svg[aria-label="Comment"]', 'textarea');
        await page.waitFor(1000);
        // write the comment
        if (await act.comment(page)) {
          web.hasCommented += 1;
          await page.waitFor(1000);
          console.log('done');
          resolve(true);
          return;
        }
      }
      console.log('failed');
      resolve(false);
    })
  );
};
