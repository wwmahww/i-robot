const path = require('../../utils/direction');
const act = require('../../utils/action');
const web = require('../../utils/interfaces');
const likeLastPost = require('./likeLastPost');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

module.exports = (page, pageName) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('subFollow is started.');

      let hasPost;
      let shouldFollow = true;

      await path.goto_page(
        page,
        web.Page_URL(pageName),
        '//button[contains(.,"Follow")]'
      ); // go to the page
      await page.waitFor(3000);

      const isBusiness = await page.evaluate(() => {
        return window._sharedData.entry_data.ProfilePage[0].graphql.user
          .is_business_account;
      });
      const isPrivate = await page.evaluate(() => {
        return window._sharedData.entry_data.ProfilePage[0].graphql.user
          .is_private;
      });

      hasPost = await page.$('li span span');
      hasPost = await page.evaluate((element) => element.textContent, hasPost);

      if (web.notFollowBusinessPage && isBusiness) shouldFollow = false;
      if (!web.followPrivate && isPrivate) shouldFollow = false;
      if (hasPost === '0') shouldFollow = false;
      // it make sure we send enought direct
      if (
        isPrivate &&
        web.followLimit - web.followCounter.hasDone <=
          web.directToSendPerProcess &&
        web.hasSentDirect < web.directToSendPerProcess
      )
        shouldFollow = false;

      if (shouldFollow) {
        const button = await page.$x('//button[contains(.,"Follow")]');
        await button[0].click();
        await page.waitFor(2000);
        // Send direct
        if (
          !isPrivate &&
          web.directTexts !== [] &&
          !(web.followCounter.hasDone % web.commentPace)
        ) {
          web.directQue = web.followPrivate ? 0 : Math.floor(Math.random() * 3);
        }
        if (web.directQue === 0) {
          if (await act.sendDirect(page)) web.hasSentDirect += 1;
        }
        web.directQue -= 1;
        await page.waitFor(1000);
        if (web.likeLastPost) await likeLastPost(page);
      }

      console.log('is page followd: ', shouldFollow);
      resolve(shouldFollow);
    })
  );
};
