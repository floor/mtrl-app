// src/scripts/debug/tests/scroll-to-page-test.ts

import { Page } from "puppeteer";

export async function testScrollToPageAPI(page: Page): Promise<void> {
  console.log("\n🔍 Testing ScrollToPage API with Placeholders...");

  // Wait for initial load
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Reset to top first
  await page.evaluate(() => {
    const listComponent = (window as any).listExample?.listComponent?.userList;
    if (listComponent) {
      listComponent.scrollToTop();
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Call scrollToPage API
  console.log("📜 Calling scrollToPage(2500, 'start')...");
  await page.evaluate(() => {
    const listComponent = (window as any).listExample?.listComponent?.userList;
    if (listComponent?.scrollToPage) {
      listComponent.scrollToPage(2500, "start");
    } else {
      console.log("scrollToPage method not found on userList");
    }
  });

  // Immediately check for placeholders (within 100ms)
  await new Promise((resolve) => setTimeout(resolve, 100));

  const placeholderInfo = await page.evaluate(() => {
    const items = document.querySelectorAll(".list-item");
    const placeholderItems = Array.from(items).filter(
      (item) =>
        item.classList.contains("list-item__placeholder") ||
        item.textContent?.includes("xxxxx")
    );

    return {
      totalItems: items.length,
      placeholderCount: placeholderItems.length,
      sampleText: placeholderItems[0]?.textContent?.substring(0, 50) || "none",
      hasPlaceholders: placeholderItems.length > 0,
    };
  });

  console.log(`📊 After scrollToPage call:`);
  console.log(`📊 Total items visible: ${placeholderInfo.totalItems}`);
  console.log(`📊 Placeholder items: ${placeholderInfo.placeholderCount}`);
  console.log(`📊 Sample placeholder text: ${placeholderInfo.sampleText}`);
  console.log(`📊 Has placeholders: ${placeholderInfo.hasPlaceholders}`);
}
