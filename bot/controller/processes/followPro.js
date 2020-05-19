/* eslint-disable no-await-in-loop */
const path = require('../../utils/direction');
const web = require('../../utils/interfaces');
const act = require('../../utils/action');
const methods = require('../../utils/methods');
const followLoop = require('./followLoopPro');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

exports.followTag = (page, tag, counter) =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('follow tag');
      let login = false;
      await act.loginCheck(page).then(res => (login = res));
      console.log('login: ', login);
      console.log('success');
      // Go to tag page
      await path.goto_page(
        page,
        web.TAG_URL(tag.substring(1)),
        'article > div:nth-child(1) img[decoding="auto"]'
      );
      for (let i = 0; i <= 6; i++) {
        let posts = await page.$$(
          'article > div:nth-child(1) img[decoding="auto"]'
        ); // Get all postS.
        let post = posts[i];

        // Click on the post
        await page.waitFor(2000);
        await path.click(
          page,
          post,
          'header > div:nth-child(2) a:nth-child(1)',
          5000
        );

        await page.waitFor(1000);

        // Check if page was already used
        let title = page.$('header > div:nth-child(2) a:nth-child(1)');
        title = page.evaluate(title => title.textContent, title);

        used = methods.check(page, title, web.used_pages);
        if (!used) break;
        // If used.
        await page.click('span[aria-label="Back"]');
        await page.waitFor(2000);
        break;
      }
      await act.loadPage(page, 'header > div:nth-child(2) a:nth-child(1)');

      await page.waitFor(2000);
      let permission = false;
      while (!permission) {
        console.log('click on follower button');
        await path
          .click(
            page,
            '//a[contains(., "followers")]',
            'main > div:first-child[contians(.,"Followers")]',
            10000,
            'load'
          )
          .then(res => {
            permission = res;
            console.log('res: ', res);
          });

        if (!permission) {
          await page.reload({ waitUntil: 'load' });
          continue;
        }
        await page.waitFor(3000);
      }
      console.log('it is loaded');
      resolve(await followLoop(page, counter, page.url()));
    })
  );

exports.followPage = (page, Ipage, counter) =>
  new Promise(
    catchAsync(async resolve => {
      console.log('follow page');
      let permission = false;
      let round = 0;

      while (!permission) {
        round += 1;
        if (round > 4) {
          resolve();
          return;
        }
        await path.goto_page(
          page,
          web.Page_URL(Ipage),
          'article > div:nth-child(1) img[decoding="auto"]'
        );
        await page.waitFor(2000);
        console.log('click on follower button');
        // eslint-disable-next-line no-await-in-loop
        await path
          .click(
            page,
            '//a[contains(., "followers")]',
            'ul button',
            10000,
            'load'
          )
          // eslint-disable-next-line no-loop-func
          .then(res => {
            permission = res;
            console.log('res: ', res);
          });
        await page.waitFor(3000);
      }
      console.log('it is loaded');
      resolve(await followLoop(page, counter, web.Page_URL(Ipage)));
    })
  );
