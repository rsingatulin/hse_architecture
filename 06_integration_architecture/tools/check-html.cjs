// node tools/check-html.cjs [absolute path to playwright package]
// Use PLAYWRIGHT_BROWSERS_PATH if browsers are installed in a temporary directory.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {pathToFileURL} = require('url');
const {chromium} = require(process.argv[2] || 'playwright');
const root = path.resolve(__dirname, '..');
const html = path.join(root, 'output/RetailMax_Integration_ToBe.html');
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(html).href);
    await page.locator('.diagram').first().click();
    await page.locator('dialog[open]').waitFor();
    await page.locator('#scale').click();
    if (!await page.locator('.canvas').evaluate(el => el.classList.contains('actual'))) throw Error('Zoom failed');
    await page.keyboard.press('Escape');
    await page.locator('nav a[href="#gallery"]').click();
    await page.waitForFunction(() => location.hash === '#gallery');
    await page.evaluate(async () => {
      const images = [...document.querySelectorAll('.diagram img')];
      images.forEach(image => image.loading = 'eager');
      await Promise.all(images.map(image => image.decode()));
    });
    const brokenImages = await page.locator('.diagram img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).length);
    const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    await page.setViewportSize({width:390,height:844});
    await page.goto(pathToFileURL(html).href);
    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    const result = {
      date:'2026-11-12', htmlSha256:crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
      pageErrors:errors, brokenImages, desktopOverflow, mobileOverflow, zoomAndNavigation:'PASS',
      status:errors.length || brokenImages || desktopOverflow || mobileOverflow ? 'FAIL' : 'PASS'
    };
    fs.writeFileSync(path.join(root, 'output/browser-validation.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result));
    if (result.status !== 'PASS') process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error);process.exitCode = 1;});
