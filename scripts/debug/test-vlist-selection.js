// scripts/debug/test-vlist-selection.js

import puppeteer from 'puppeteer';

async function testVListSelection() {
  console.log('🎯 Testing VList Selection Feature');
  
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1200, height: 800 }
  });

  const page = await browser.newPage();
  
  // Listen to all console logs
  page.on('console', msg => {
    console.log(`💬 [${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  await page.goto('http://localhost:4000/examples/vlist-addons');
  
  // Wait for list to load
  await page.waitForSelector('.mtrl-viewport-item', { timeout: 5000 });
  await page.waitForTimeout(1000); // Give time for selection feature to initialize
  
  console.log('📋 Testing list item clicks...');
  
  // Get info about the first item
  const itemInfo = await page.evaluate(() => {
    const firstViewportItem = document.querySelector('.mtrl-viewport-item');
    const listItem = firstViewportItem?.querySelector('.list-item, .user-item');
    
    // Check if click handler is attached
    const vlist = window.listExample?.userList;
    const hasSelection = vlist && typeof vlist.selectItems === 'function';
    
    return {
      viewportItemExists: !!firstViewportItem,
      listItemExists: !!listItem,
      listItemClasses: listItem?.className,
      hasSelection,
      selectionEnabled: vlist?.config?.selection?.enabled,
      selectionMode: vlist?.config?.selection?.mode
    };
  });
  
  console.log('📊 Initial state:', itemInfo);
  
  // Click on the first list item
  console.log('🖱️ Clicking on first list item...');
  await page.click('.mtrl-viewport-item:first-child .user-item');
  await page.waitForTimeout(500);
  
  // Check selection state
  const afterClick = await page.evaluate(() => {
    const firstItem = document.querySelector('.mtrl-viewport-item:first-child .user-item');
    const vlist = window.listExample?.userList;
    const selectedItems = vlist?.getSelectedItems ? vlist.getSelectedItems() : [];
    const selectedIndices = vlist?.getSelectedIndices ? vlist.getSelectedIndices() : [];
    
    return {
      hasSelectionClass: firstItem?.classList.contains('mtrl-list-item--selected'),
      selectedCount: selectedItems.length,
      selectedIndices,
      firstItemClasses: firstItem?.className
    };
  });
  
  console.log('✅ After click:', afterClick);
  
  // Test selection buttons
  console.log('🔧 Testing selection buttons...');
  
  // Click Select All button
  const selectAllButton = await page.$('button:has-text("Select All")');
  if (selectAllButton) {
    console.log('📌 Clicking Select All...');
    await selectAllButton.click();
    await page.waitForTimeout(500);
    
    const afterSelectAll = await page.evaluate(() => {
      const vlist = window.listExample?.userList;
      const selectedItems = vlist?.getSelectedItems ? vlist.getSelectedItems() : [];
      const selectedElements = document.querySelectorAll('.mtrl-list-item--selected');
      
      return {
        selectedCount: selectedItems.length,
        selectedElementCount: selectedElements.length
      };
    });
    
    console.log('✅ After Select All:', afterSelectAll);
  }
  
  // Click Clear Selection button
  const clearButton = await page.$('button:has-text("Clear Selection")');
  if (clearButton) {
    console.log('📌 Clicking Clear Selection...');
    await clearButton.click();
    await page.waitForTimeout(500);
    
    const afterClear = await page.evaluate(() => {
      const vlist = window.listExample?.userList;
      const selectedItems = vlist?.getSelectedItems ? vlist.getSelectedItems() : [];
      const selectedElements = document.querySelectorAll('.mtrl-list-item--selected');
      
      return {
        selectedCount: selectedItems.length,
        selectedElementCount: selectedElements.length
      };
    });
    
    console.log('✅ After Clear:', afterClear);
  }
  
  console.log('✨ Test complete. Browser will stay open for inspection.');
  console.log('Press Ctrl+C to exit.');
}

testVListSelection().catch(console.error); 