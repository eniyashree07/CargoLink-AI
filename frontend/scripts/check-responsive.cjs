const puppeteer = require('puppeteer');

const URL = 'http://localhost:5173';
const VIEWPORTS = [
  { name: '1920 desktop', width: 1920, height: 1080 },
  { name: '1366 laptop', width: 1366, height: 768 },
  { name: '768 tablet', width: 768, height: 1024 },
  { name: '390 mobile', width: 390, height: 844 },
  { name: '375 mobile', width: 375, height: 812 },
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  let failures = 0;

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    const results = await page.evaluate(async (url) => {
      async function check(path) {
        await window.__navFetching(path);
      }
      return 'unused';
    }, []).catch(() => null);

    // /login
    await page.goto(`${URL}/login`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800));
    const loginOverflow = await page.evaluate(() => {
      const doc = document.scrollingElement || document.documentElement;
      return { scrollW: doc.scrollWidth, clientW: doc.clientWidth };
    });
    const hasLoginOverflow = loginOverflow.scrollW > loginOverflow.clientW + 1;

    // capture login screenshot
    await page.screenshot({ path: `C:\\Users\\ENIYAS~1\\AppData\\Local\\Temp\\opencode\\shot-login-${vp.width}.png` });

    // /driver-app
    await page.goto(`${URL}/driver-app`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));
    const driverOverflow = await page.evaluate(() => {
      const doc = document.scrollingElement || document.documentElement;
      const frame = document.querySelector('.android-device-wrapper');
      return {
        scrollW: doc.scrollWidth,
        clientW: doc.clientWidth,
        frameW: frame ? frame.getBoundingClientRect().width : null,
        frameRight: frame ? frame.getBoundingClientRect().right : null,
        vw: window.innerWidth
      };
    });
    const hasDriverOverflow = driverOverflow.scrollW > driverOverflow.clientW + 1;

    await page.screenshot({ path: `C:\\Users\\ENIYAS~1\\AppData\\Local\\Temp\\opencode\\shot-driver-${vp.width}.png` });

    const status = (hasLoginOverflow || hasDriverOverflow) ? 'FAIL' : 'OK';
    if (status === 'FAIL') failures++;
    console.log(`${vp.name.padEnd(14)} | login: ${hasLoginOverflow ? 'OVERFLOW ' + loginOverflow.scrollW + '/' + loginOverflow.clientW : 'ok'.padEnd(24)} | driver-app: ${hasDriverOverflow ? 'OVERFLOW ' + driverOverflow.scrollW + '/' + driverOverflow.clientW : 'ok'} frame=${driverOverflow.frameW} vw=${driverOverflow.vw}`);
    await page.close();
  }

  console.log(failures === 0 ? '\nALL VIEWPORTS OK' : `\n${failures} VIEWPORTS HAVE OVERFLOW`);
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
