// src/scripts/debug/tests/placeholder-test.ts

import { Page } from "puppeteer";

export async function testPlaceholderSystem(page: Page): Promise<void> {
  console.log("\n🔍 Testing Placeholder System...");

  // Wait for initial load
  await page.waitForFunction(() => true, { timeout: 1000 }).catch(() => {});

  // Scroll to trigger placeholders
  console.log("📜 Scrolling to index 50000 to trigger placeholders...");
  await page.evaluate(() => {
    const listComponent = (window as any).listExample?.listComponent?.userList;
    if (listComponent?.scrollToIndex) {
      listComponent.scrollToIndex(50000);
    }
  });

  // Wait a bit for placeholders to render
  await page.waitForFunction(() => true, { timeout: 500 }).catch(() => {});

  // Check for placeholders
  const placeholderInfo = await page.evaluate(() => {
    const placeholders = document.querySelectorAll(".list-item__placeholder");
    const items = document.querySelectorAll(".list-item");
    const placeholderItems = Array.from(items).filter(
      (item) =>
        item.classList.contains("list-item__placeholder") ||
        item.textContent?.includes("xxxxx") // mask character
    );

    return {
      placeholderCount: placeholders.length,
      totalItems: items.length,
      placeholderItemCount: placeholderItems.length,
      sampleText: placeholderItems[0]?.textContent || "none",
    };
  });

  console.log(`📊 Placeholders found: ${placeholderInfo.placeholderCount}`);
  console.log(`📊 Total items: ${placeholderInfo.totalItems}`);
  console.log(
    `📊 Items with placeholder class: ${placeholderInfo.placeholderItemCount}`
  );
  console.log(`📊 Sample placeholder text: ${placeholderInfo.sampleText}`);

  // Wait for idle and data load
  console.log("⏳ Waiting for idle state and data load...");

  // Wait for replacement to happen
  await page
    .waitForFunction(
      () => {
        const items = document.querySelectorAll(".list-item");
        // Check if we have items without mask character 'x'
        return Array.from(items).some(
          (item) => item.textContent && !item.textContent.includes("xxxxx")
        );
      },
      { timeout: 5000 }
    )
    .catch(() => {});

  // Check if placeholders were replaced
  const afterLoadInfo = await page.evaluate(() => {
    const placeholders = document.querySelectorAll(".list-item__placeholder");
    const items = document.querySelectorAll(".list-item");
    const realItems = Array.from(items).filter((item) => {
      const text = item.textContent || "";
      // Real items don't have multiple x's in a row and don't have placeholder class
      return (
        !text.includes("xxxxx") &&
        !item.classList.contains("list-item__placeholder")
      );
    });
    const placeholderItems = Array.from(items).filter((item) => {
      const text = item.textContent || "";
      // Placeholder items have multiple x's or placeholder class
      return (
        text.includes("xxxxx") ||
        item.classList.contains("list-item__placeholder")
      );
    });

    return {
      remainingPlaceholders: placeholders.length,
      totalItems: items.length,
      realItemCount: realItems.length,
      placeholderItemCount: placeholderItems.length,
      sampleRealText: realItems[0]?.textContent?.substring(0, 50) || "none",
      samplePlaceholderText:
        placeholderItems[0]?.textContent?.substring(0, 50) || "none",
    };
  });

  console.log(`\n📊 After data load:`);
  console.log(
    `📊 Remaining placeholders: ${afterLoadInfo.remainingPlaceholders}`
  );
  console.log(`📊 Total items: ${afterLoadInfo.totalItems}`);
  console.log(`📊 Real items: ${afterLoadInfo.realItemCount}`);
  console.log(`📊 Placeholder items: ${afterLoadInfo.placeholderItemCount}`);
  console.log(`📊 Sample real text: ${afterLoadInfo.sampleRealText}`);
  console.log(
    `📊 Sample placeholder text: ${afterLoadInfo.samplePlaceholderText}`
  );

  if (
    afterLoadInfo.remainingPlaceholders === 0 &&
    afterLoadInfo.realItemCount > 0
  ) {
    console.log("✅ Placeholder replacement working correctly!");
  } else {
    console.log("❌ Placeholder replacement not working as expected");
  }
}
