const web = require('../../utils/interfaces');
const act = require('../../utils/action');
const path = require('../../utils/direction');
const comment_post = require('./commnet_post');
const catchAsync = require('../../utils/catchAsync');

module.exports = (page) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      const private = await page.evaluate(() => {
        return window._sharedData.entry_data.ProfilePage[0].graphql.user
          .is_private;
      });
      if (!private) {
        const link = await page.$('article div a');
        await path.click(page, link, 'section  section svg', 10000);
        await page.waitFor(2000);
        if (await act.like(page)) web.likeCounter.hasDone += 1;
        if (
          web.writeComment &&
          web.comments !== [] &&
          !(web.likeCounter.hasDone % web.commentPace)
        ) {
          web.commentQue = web.followPrivate
            ? 0
            : Math.floor(Math.random() * 3);
        }
        if (web.commentQue === 0) {
          await comment_post(page);
        }
        web.commentQue -= 1;
      }
      resolve();
    })
  );
};
