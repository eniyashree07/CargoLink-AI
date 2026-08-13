import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

(async () => {
  try {
    const htmlPath = path.resolve(process.cwd(), 'frontend', 'diagram.html');
    const url = `file://${htmlPath}`;

    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'], headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wait a bit for mermaid to render
    await page.waitForTimeout(2000);

    // Screenshot the diagram container
    const container = await page.$('.diagram-container');
    if (container) {
      await container.screenshot({ path: path.resolve('frontend', 'architecture_diagram.png') });
    } else {
      await page.screenshot({ path: path.resolve('frontend', 'architecture_diagram.png'), fullPage: true });
    }

    // Save a PDF (A4) with background
    await page.pdf({ path: path.resolve('frontend', 'architecture_diagram.pdf'), printBackground: true, format: 'A4' });

    await browser.close();
    console.log('Exported architecture_diagram.png and architecture_diagram.pdf in frontend/');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
