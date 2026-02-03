import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', error => console.error('Page error:', error.message));
  
  await page.goto('http://localhost:4000/examples/test-selection.html');
  await new Promise(r => setTimeout(r, 2000));
  
  // Get error details
  const errorInfo = await page.evaluate(() => {
    return {
      hasVList: !!window.vlist,
      errorLogs: window.errorLogs || []
    };
  });
  
  console.log('Error info:', errorInfo);
  
  // Keep browser open
  console.log('Browser open for debugging. Press Ctrl+C to close.');
})();
