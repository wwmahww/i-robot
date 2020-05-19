/* eslint-disable no-await-in-loop */
const path = require('../../utils/direction');
const act = require('../../utils/action');
const web = require('../../utils/interfaces');
const comment_post = require('./commnet_post');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

module.exports = (page, tags) =>
  new Promise(
    catchAsync(async resolve => {
      console.log('here in likeTagPro');
      // eslint-disable-next-line no-restricted-syntax
      for (const tag of tags) {
        console.log('hasDone: ', web.likeCounter.hasDone);
        console.log('likeLimit: ', web.likeLimit);
        // Check if it pass the limit
        if (web.likeCounter.hasDone >= web.likeLimit) {
          console.log('like is done');
          resolve();
          return;
        }
        // Check if it has done the tag
        console.log('used targets: ', web.usedTargets);
        if (web.usedTargets.includes(tag)) {
          console.log(`${tag} was used`);
          continue;
        }
        console.log('tag: ', tag);
        // eslint-disable-next-line no-await-in-loop
        await path.goto_page(
          page,
          web.TAG_URL(tag),
          'img',
          30000,
          'networkidle0'
        );
        await page.waitFor(3000);
        // loop on posts
        for (let i = 0; i < 6; i++) {
          console.log('i: ', i);
          // eslint-disable-next-line no-await-in-loop
          let posts = await page.$$(
            'article > div:nth-child(3) img[decoding="auto"]'
          );
          // Check if page is loaded correctly
          while (posts[i] === undefined) {
            console.log('load again');
            await path.goto_page(
              page,
              web.TAG_URL(tag),
              'img',
              30000,
              'networkidle0'
            );
            await page.waitFor(3000);

            posts = await page.$$(
              'article > div:nth-child(3) img[decoding="auto"]'
            );
          }

          await path.click(page, posts[i], 'section section svg', 20000);
          await page.waitFor(3000);
          if (await act.like(page).catch()) {
            web.likeCounter.hasDone += 1;
          }
          await page.waitFor(2000);
          if (
            web.writeComment &&
            web.comments !== [] &&
            !(web.likeCounter.hasDone % web.commentPace)
          ) {
            web.commentQue = Math.floor(Math.random() * 3)
            
          }
          if(web.commentQue === 0) {
            await comment_post(page).catch(() => {
              console.log('comment error???');
            });
            await page.goBack({ waitUntil: 'load' });
            await page.waitFor(2000);
          }
          web.commentQue -= 1
          await page.goBack({ waitUntil: 'load' });
          await web.page.waitFor(2000);
          console.log('this one is done');
        }
        console.log('tag is done');
        web.usedTargets.push(tag);
        console.log('next tag');
      }
      web.usedTargets = [];
      resolve();
    })
  );
