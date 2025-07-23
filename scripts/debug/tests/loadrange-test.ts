// src/scripts/debug/tests/loadrange-test.ts

import { Page } from "puppeteer";

export async function testLoadRangeAPI(page: Page): Promise<void> {
  console.log("\n🔍 Testing LoadRange API with Placeholders...");

  // Wait for initial load
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Clear any existing data first
  await page.evaluate(() => {
    const listComponent = (window as any).listExample?.listComponent?.userList;
    if (listComponent) {
      // Scroll to top to reset
      listComponent.scrollToTop();
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Call loadRange API
  console.log("📜 Calling loadRange(2500, 20, 'page', 'start')...");
  await page.evaluate(() => {
    const listComponent = (window as any).listExample?.listComponent?.userList;
    if (listComponent?.loadRange) {
      listComponent.loadRange(2500, 20, "page", "start");
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

    // Get viewport scroll position
    const viewport = document.querySelector(".mtrl-viewport");
    const scrollTop = viewport?.scrollTop || 0;

    return {
      totalItems: items.length,
      placeholderCount: placeholderItems.length,
      sampleText: placeholderItems[0]?.textContent?.substring(0, 50) || "none",
      hasPlaceholders: placeholderItems.length > 0,
      scrollPosition: scrollTop,
    };
  });

  console.log(`📊 After loadRange call:`);
  console.log(`📊 Total items visible: ${placeholderInfo.totalItems}`);
  console.log(`📊 Placeholder items: ${placeholderInfo.placeholderCount}`);
  console.log(`📊 Has placeholders: ${placeholderInfo.hasPlaceholders}`);
  console.log(`📊 Sample text: ${placeholderInfo.sampleText}`);
  console.log(`📊 Scroll position: ${placeholderInfo.scrollPosition}`);

  // Wait for data to load
  console.log("⏳ Waiting for data to load...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check if placeholders were replaced
  const afterLoadInfo = await page.evaluate(() => {
    const items = document.querySelectorAll(".list-item");
    const realItems = Array.from(items).filter(
      (item) =>
        !item.classList.contains("list-item__placeholder") &&
        !item.textContent?.includes("xxxxx")
    );

    return {
      totalItems: items.length,
      realItemCount: realItems.length,
      sampleRealText: realItems[0]?.textContent?.substring(0, 50) || "none",
    };
  });

  console.log(`\n📊 After data load:`);
  console.log(`📊 Total items: ${afterLoadInfo.totalItems}`);
  console.log(`📊 Real items: ${afterLoadInfo.realItemCount}`);
  console.log(`📊 Sample real text: ${afterLoadInfo.sampleRealText}`);

  if (placeholderInfo.hasPlaceholders && afterLoadInfo.realItemCount > 0) {
    console.log("✅ LoadRange API shows placeholders correctly!");
  } else if (!placeholderInfo.hasPlaceholders) {
    console.log("❌ LoadRange API did not show placeholders");
  } else {
    console.log("❌ LoadRange API placeholders were not replaced");
  }
}
