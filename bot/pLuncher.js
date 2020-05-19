const puppeteer = require('puppeteer');

const web = require('./utils/interfaces');

const iPhone = puppeteer.devices['Galaxy Note 3'];

const launchOptions = {
  args: ['--disable-features=site-per-process'],
  headless: false,
  devtools: false,
  defaultViewport: { width: 1200, height: 1000 },
  executablePath:
    './node_modules/puppeteer/.local-chromium/win64-722234/chrome-win/chrome.exe',
};

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.emulate(iPhone);
    web.browser = browser;
    web.page = page;
    resolve(page);
  });
};
