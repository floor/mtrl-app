import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
  
  await page.goto('http://localhost:4000/examples/test-selection.html');
  await new Promise(r => setTimeout(r, 1000));
  
  // Check if vlist was created
  const vlistInfo = await page.evaluate(() => {
    const vlist = window.vlist;
    return {
      exists: !!vlist,
      hasSelectItems: typeof vlist?.selectItems === 'function',
      hasGetSelectedItems: typeof vlist?.getSelectedItems === 'function',
      hasClearSelection: typeof vlist?.clearSelection === 'function',
      element: !!vlist?.element,
      viewport: !!vlist?.viewport
    };
  });
  
  console.log('VList info:', vlistInfo);
  
  // Try programmatic selection
  await page.evaluate(() => {
    console.log('Selecting items [0, 1, 2]...');
    window.vlist.selectItems([0, 1, 2]);
  });
  
  await new Promise(r => setTimeout(r, 500));
  
  // Check selection
  const selectionInfo = await page.evaluate(() => {
    const selected = window.vlist.getSelectedItems();
    const indices = window.vlist.getSelectedIndices();
    const selectedElements = document.querySelectorAll('.mtrl-list-item--selected');
    
    return {
      selectedCount: selected.length,
      selectedIndices: indices,
      selectedElementsCount: selectedElements.length,
      firstSelectedName: selected[0]?.name
    };
  });
  
  console.log('Selection info:', selectionInfo);
  
  // Try clicking
  console.log('Clicking first item...');
  await page.click('.user-item:first-child');
  await new Promise(r => setTimeout(r, 500));
  
  const afterClick = await page.evaluate(() => {
    const selected = window.vlist.getSelectedItems();
    return {
      selectedCount: selected.length,
      selectedNames: selected.map(s => s.name)
    };
  });
  
  console.log('After click:', afterClick);
  
  await browser.close();
})();
