import { Page } from "puppeteer";

/**
 * Scroll-related tests for VList component
 */

/**
 * Test mouse wheel scrolling with visual content verification
 */
export async function testMouseWheelScrollingWithContentCheck(
  page: Page
): Promise<void> {
  console.log(
    "🔍 [PUPPETEER] Testing mouse wheel scrolling with content verification..."
  );

  // Wait for initial load
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Function to get visible item texts
  const getVisibleItemTexts = async (): Promise<string[]> => {
    return await page.evaluate(() => {
      const container = document.querySelector(".mtrl-viewport-items");
      if (!container) return [];

      const items = container.querySelectorAll(".list-item");
      const texts: string[] = [];

      items.forEach((item, index) => {
        const textContent = item.textContent?.trim();
        if (textContent) {
          texts.push(`${index}:${textContent.substring(0, 50)}...`);
        } else {
          texts.push(`${index}:EMPTY`);
        }
      });

      return texts;
    });
  };

  // Function to get container info
  const getContainerInfo = async () => {
    return await page.evaluate(() => {
      const container = document.querySelector(".mtrl-viewport-items");
      if (!container) return null;

      const style = window.getComputedStyle(container);
      const items = container.querySelectorAll(".list-item");

      return {
        itemCount: items.length,
        transform: style.transform,
        display: style.display,
        visibility: style.visibility,
        itemsWithContent: Array.from(items).map((item, i) => ({
          index: i,
          hasText: !!item.textContent?.trim(),
          isVisible: (item as HTMLElement).offsetParent !== null,
          text: item.textContent?.trim().substring(0, 30) || "EMPTY",
        })),
      };
    });
  };

  console.log("🔍 [PUPPETEER] Initial state:");
  const initialTexts = await getVisibleItemTexts();
  console.log("📝 [CONTENT] Initial visible texts:", initialTexts.slice(0, 5));

  const initialInfo = await getContainerInfo();
  console.log(
    "📊 [CONTAINER] Initial info:",
    JSON.stringify(initialInfo, null, 2)
  );

  // Perform mouse wheel scrolls with content verification
  for (let i = 1; i <= 5; i++) {
    console.log(`\n🖱️ [PUPPETEER] Scroll ${i}/5: deltaY=200`);

    // Target the viewport element specifically
    const viewport = await page.$(".mtrl-viewport");
    if (viewport) {
      await viewport.hover(); // Ensure focus
      await page.mouse.wheel({ deltaY: 20 });
    } else {
      console.log("⚠️ [PUPPETEER] Viewport not found, using page wheel");
      await page.mouse.wheel({ deltaY: 20 });
    }

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check content
    const texts = await getVisibleItemTexts();
    const info = await getContainerInfo();

    console.log(
      `📝 [CONTENT] Visible texts after scroll ${i}:`,
      texts.slice(0, 5)
    );
    console.log(
      `📊 [CONTAINER] Items: ${info?.itemCount || 0}, Transform: ${info?.transform || "none"}`
    );

    // Check for empty items
    const emptyItems =
      info?.itemsWithContent?.filter((item) => !item.hasText) || [];
    if (emptyItems.length > 0) {
      console.log(
        `⚠️ [WARNING] Found ${emptyItems.length} items without text content:`,
        emptyItems.slice(0, 3).map((item) => `${item.index}:${item.text}`)
      );
    }

    // Check for invisible items
    const invisibleItems =
      info?.itemsWithContent?.filter((item) => !item.isVisible) || [];
    if (invisibleItems.length > 0) {
      console.log(
        `⚠️ [WARNING] Found ${invisibleItems.length} invisible items`
      );
    }
  }

  console.log("🔍 [PUPPETEER] Content verification test completed");
}

/**
 * Test mouse wheel scrolling
 */
export async function testMouseWheelScrolling(page: Page): Promise<void> {
  console.log("🖱️ [PUPPETEER] Testing mouse wheel scrolling...");

  // Wait for list to initialize
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("🖱️ [PUPPETEER] Testing multiple small mouse wheel scrolls...");

  // Test multiple small scrolls
  for (let i = 1; i <= 10; i++) {
    console.log(`🖱️ [PUPPETEER] Scroll ${i}/10: deltaY=200`);

    // Target the viewport element specifically
    const viewport = await page.$(".mtrl-viewport");
    if (viewport) {
      await viewport.hover(); // Ensure focus
      await page.mouse.wheel({ deltaY: 20 });
    } else {
      await page.mouse.wheel({ deltaY: 20 });
    }

    // Wait for any animations/updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Get current state
    const result = await page.evaluate(() => {
      const container = document.querySelector(".mtrl-viewport-items");
      if (!container) return { containerFound: false };

      const style = window.getComputedStyle(container);
      const items = container.querySelectorAll(".list-item");

      return {
        containerFound: true,
        itemCount: items.length,
        containerDisplay: style.display,
        containerTransform: style.transform,
      };
    });

    console.log(
      `🖱️ [PUPPETEER] Scroll ${i} result: ${result.itemCount} items, transform: ${result.containerTransform}`
    );
  }

  // Final state check
  const finalState = await page.evaluate(() => {
    const container = document.querySelector(".mtrl-viewport-items");
    if (!container) return { containerFound: false };

    const style = window.getComputedStyle(container);
    const items = container.querySelectorAll(".list-item");

    return {
      containerFound: true,
      itemCount: items.length,
      containerDisplay: style.display,
      containerTransform: style.transform,
    };
  });

  console.log("🖱️ [PUPPETEER] Final state after multiple scrolls:", finalState);
  console.log("🖱️ [PUPPETEER] Mouse wheel scrolling test completed");
}

/**
 * Test backward scrolling for overlapping items
 */
export async function testBackwardScrolling(page: Page): Promise<void> {
  console.log(
    "\n🔄 [BACKWARD-SCROLL] Testing backward scrolling for overlaps..."
  );

  // First scroll to a position
  await page.evaluate(() => window.scrollTo(0, 8680));
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for rendering

  // Now scroll backward in steps
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, -1000));
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check for overlapping items
    const overlapCheck = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".list-item"));
      const overlaps: Array<{
        item1: string | null;
        item2: string | null;
        overlap: number;
      }> = [];

      // Sort items by their translateY position
      const itemPositions = items
        .map((item) => {
          const transform = (item as HTMLElement).style.transform;
          const match = transform.match(/translateY\(([-\d.]+)px\)/);
          const position = match ? parseFloat(match[1]) : 0;
          return {
            id: item.getAttribute("data-id"),
            position,
            element: item,
          };
        })
        .sort((a, b) => a.position - b.position);

      // Check for overlaps
      for (let i = 1; i < itemPositions.length; i++) {
        const prev = itemPositions[i - 1];
        const curr = itemPositions[i];
        const prevBottom = prev.position + 84; // Assuming 84px height

        if (curr.position < prevBottom) {
          overlaps.push({
            item1: prev.id,
            item2: curr.id,
            overlap: prevBottom - curr.position,
          });
        }
      }

      return {
        scrollPosition: window.scrollY,
        itemCount: items.length,
        overlaps,
      };
    });

    console.log(`🔄 [BACKWARD-SCROLL] Step ${i + 1}:`, {
      scrollPosition: overlapCheck.scrollPosition,
      itemCount: overlapCheck.itemCount,
      overlaps: overlapCheck.overlaps.length,
    });

    if (overlapCheck.overlaps.length > 0) {
      console.log("❌ [BACKWARD-SCROLL] Found overlapping items:");
      overlapCheck.overlaps.forEach((overlap) => {
        console.log(
          `   Item ${overlap.item1} overlaps with ${overlap.item2} by ${overlap.overlap}px`
        );
      });
    } else {
      console.log("✅ [BACKWARD-SCROLL] No overlapping items found");
    }
  }
}

/**
 * Test scrollToPage and scrollToIndex functionality
 */
export async function testScrollFunctions(page: Page): Promise<void> {
  console.log("\n🧪 [SCROLL-TEST] Testing scrollToPage and scrollToIndex...");

  // Test scrollToIndex
  console.log("\n📍 [SCROLL-TEST] Testing scrollToIndex...");

  const indexTestResult = await page.evaluate(() => {
    // Try to find the list component
    const list =
      (window as any).userList ||
      (window as any).listExample?.list ||
      document.querySelector(".mtrl-vlist");

    if (!list) {
      return { error: "List not found" };
    }
    const beforeScroll = {
      scrollPosition: list.viewport?.getScrollPosition() || 0,
      visibleRange: list.viewport?.getVisibleRange() || { start: 0, end: 0 },
    };

    // Scroll to index 100
    console.log("🎯 Calling scrollToIndex(100, 'start')");
    list.scrollToIndex(100, "start");

    // Wait a bit for scroll to complete
    return new Promise((resolve) => {
      setTimeout(() => {
        const afterScroll = {
          scrollPosition: list.viewport?.getScrollPosition() || 0,
          visibleRange: list.viewport?.getVisibleRange() || {
            start: 0,
            end: 0,
          },
        };

        resolve({
          beforeScroll,
          afterScroll,
          success:
            afterScroll.visibleRange.start <= 100 &&
            afterScroll.visibleRange.end >= 100,
        });
      }, 500);
    });
  });

  console.log("📊 [SCROLL-TEST] scrollToIndex result:", indexTestResult);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test scrollToPage
  console.log("\n📄 [SCROLL-TEST] Testing scrollToPage...");

  const pageTestResult = await page.evaluate(() => {
    // Try to find the list component
    const list =
      (window as any).userList ||
      (window as any).listExample?.list ||
      document.querySelector(".mtrl-vlist");

    if (!list) {
      return { error: "List not found" };
    }
    const beforeScroll = {
      scrollPosition: list.viewport?.getScrollPosition() || 0,
      visibleRange: list.viewport?.getVisibleRange() || { start: 0, end: 0 },
    };

    // Scroll to page 5 (assuming page size is 33 based on the API calls we've seen)
    console.log("🎯 Calling scrollToPage(5)");
    list.scrollToPage(5);

    // Wait for scroll and data load
    return new Promise((resolve) => {
      setTimeout(() => {
        const afterScroll = {
          scrollPosition: list.viewport?.getScrollPosition() || 0,
          visibleRange: list.viewport?.getVisibleRange() || {
            start: 0,
            end: 0,
          },
        };

        // Page 5 with page size 33 should show items starting around index 132 (4 * 33)
        const expectedStartIndex = 4 * 33; // Pages are 1-indexed

        resolve({
          beforeScroll,
          afterScroll,
          expectedStartIndex,
          success:
            Math.abs(afterScroll.visibleRange.start - expectedStartIndex) < 10,
        });
      }, 1000);
    });
  });

  console.log("📊 [SCROLL-TEST] scrollToPage result:", pageTestResult);

  // Test alignment options
  console.log("\n🎯 [SCROLL-TEST] Testing alignment options...");

  const alignmentTest = await page.evaluate(() => {
    // Try to find the list component
    const list =
      (window as any).userList ||
      (window as any).listExample?.list ||
      document.querySelector(".mtrl-vlist");

    if (!list) {
      return { error: "List not found" };
    }
    const results: any = {};

    // Test center alignment
    list.scrollToIndex(200, "center");

    return new Promise((resolve) => {
      setTimeout(() => {
        const centerRange = list.viewport?.getVisibleRange() || {
          start: 0,
          end: 0,
        };
        results.center = {
          range: centerRange,
          containsTarget: centerRange.start < 200 && centerRange.end > 200,
        };

        // Test end alignment
        list.scrollToIndex(300, "end");

        setTimeout(() => {
          const endRange = list.viewport?.getVisibleRange() || {
            start: 0,
            end: 0,
          };
          results.end = {
            range: endRange,
            containsTarget: endRange.start <= 300 && endRange.end >= 300,
          };

          resolve(results);
        }, 500);
      }, 500);
    });
  });

  console.log("📊 [SCROLL-TEST] Alignment test results:", alignmentTest);

  console.log("\n✅ [SCROLL-TEST] Scroll function tests completed!");
}

/**
 * Test fast scrolling
 */
export async function testFastScrolling(page: Page) {
  console.log("\n🚀 [FAST-SCROLL] Testing very fast scrolling behavior...");

  // Scroll to top first
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Perform very fast scrolling
  console.log("🚀 [FAST-SCROLL] Performing rapid scroll...");

  // Simulate very fast scrolling with large deltas
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel({ deltaY: 1000 });
    await new Promise((resolve) => setTimeout(resolve, 10)); // Very short delay
  }

  // Check scroll position immediately after scrolling
  const scrollPosAfterScroll = await page.evaluate(() => window.scrollY);
  console.log(
    `🚀 [FAST-SCROLL] Scroll position after fast scroll: ${scrollPosAfterScroll}`
  );

  // Wait for idle detection and loading
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Additional wait for items to render after idle
  console.log("⏳ [FAST-SCROLL] Waiting for items to render...");
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Check final state
  const finalState = await page.evaluate(() => {
    const container = document.querySelector(
      ".mtrl-viewport-items"
    ) as HTMLElement;
    const items = container?.querySelectorAll(".list-item");
    const visibleItems = Array.from(items || []).filter((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    return {
      itemCount: items?.length || 0,
      visibleCount: visibleItems.length,
      hasEmptyViewport: visibleItems.length === 0,
      scrollPosition: window.scrollY,
    };
  });

  console.log("🚀 [FAST-SCROLL] Final state:", finalState);

  if (finalState.hasEmptyViewport) {
    console.error("❌ [FAST-SCROLL] Empty viewport after fast scrolling!");
  } else {
    console.log("✅ [FAST-SCROLL] Items loaded correctly after fast scrolling");
  }
}

/**
 * Test fast mouse wheel scrolling to reproduce empty viewport issue
 */
export async function testFastMouseWheelScrolling(page: Page): Promise<void> {
  console.log(
    "🖱️ [PUPPETEER] Testing fast mouse wheel scrolling to reproduce empty viewport issue..."
  );

  // Wait for list to initialize
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Get initial state
  const initialState = await page.evaluate(() => {
    const items = document.querySelectorAll(".list-item");
    const visibleItems = Array.from(items).filter((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight;
    });
    return {
      totalItems: items.length,
      visibleCount: visibleItems.length,
      firstVisible: visibleItems[0]?.getAttribute("data-index"),
      scrollPosition: document.querySelector(".mtrl-viewport")?.scrollTop || 0,
    };
  });
  console.log("📊 [FAST-SCROLL] Initial state:", initialState);

  // Simulate fast scrolling with large deltas (like real mouse wheel)
  console.log("🖱️ [FAST-SCROLL] Performing fast scroll sequence...");

  const viewport = await page.$(".mtrl-viewport");
  if (viewport) {
    await viewport.hover();
  }

  // Simulate fast scrolling bursts like a real mouse wheel
  const scrollSequence = [
    { deltaY: 400, wait: 50 },
    { deltaY: 420, wait: 40 },
    { deltaY: 440, wait: 35 },
    { deltaY: 450, wait: 30 },
    { deltaY: 430, wait: 40 },
    { deltaY: 410, wait: 50 },
  ];

  for (let i = 0; i < scrollSequence.length; i++) {
    const { deltaY, wait } = scrollSequence[i];
    console.log(`🖱️ [FAST-SCROLL] Scroll ${i + 1}: deltaY=${deltaY}`);
    await page.mouse.wheel({ deltaY });
    await new Promise((resolve) => setTimeout(resolve, wait));
  }

  // Wait for scrolling to stop and idle to trigger
  console.log("⏳ [FAST-SCROLL] Waiting for idle state...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Additional wait for items to render after idle
  console.log("⏳ [FAST-SCROLL] Waiting for items to render...");
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Check viewport state after fast scrolling
  const afterScrollState = await page.evaluate(() => {
    const viewport = document.querySelector(".mtrl-viewport");
    const itemsContainer = document.querySelector(".mtrl-viewport-items");
    const items = document.querySelectorAll(".list-item");

    // Get visible items
    const visibleItems = Array.from(items).filter((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    // Get item positions
    const itemPositions = Array.from(items)
      .slice(0, 5)
      .map((item) => ({
        index: item.getAttribute("data-index"),
        transform: (item as HTMLElement).style.transform,
        top: item.getBoundingClientRect().top,
      }));

    return {
      viewportHeight: viewport?.clientHeight || 0,
      scrollPosition: viewport?.scrollTop || 0,
      totalItems: items.length,
      visibleCount: visibleItems.length,
      itemPositions,
      isEmpty: visibleItems.length === 0,
      firstVisibleIndex: visibleItems[0]?.getAttribute("data-index"),
      lastVisibleIndex:
        visibleItems[visibleItems.length - 1]?.getAttribute("data-index"),
    };
  });

  console.log("📊 [FAST-SCROLL] After fast scroll state:", afterScrollState);

  if (afterScrollState.isEmpty) {
    console.log(
      "❌ [FAST-SCROLL] ISSUE REPRODUCED: Viewport is empty after fast scrolling!"
    );
    console.log(
      "📊 [FAST-SCROLL] Item positions:",
      afterScrollState.itemPositions
    );
  } else if (afterScrollState.itemPositions.some((item) => item.top > 600)) {
    console.log("⚠️ [FAST-SCROLL] Items positioned outside viewport!");
  } else {
    console.log("✅ [FAST-SCROLL] Items are visible after fast scrolling");
  }

  // Try scrolling slightly to see if it fixes the issue
  console.log(
    "🖱️ [FAST-SCROLL] Attempting small scroll to trigger re-render..."
  );
  await page.mouse.wheel({ deltaY: 10 });
  await new Promise((resolve) => setTimeout(resolve, 500));

  const afterFixState = await page.evaluate(() => {
    const items = document.querySelectorAll(".list-item");
    const visibleItems = Array.from(items).filter((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    return {
      visibleCount: visibleItems.length,
      fixed: visibleItems.length > 0,
    };
  });

  console.log("📊 [FAST-SCROLL] After small scroll:", afterFixState);
}

/**
 * Test clicking on index chips to trigger scrollToIndex
 */
export async function testIndexChipsClick(page: Page): Promise<void> {
  console.log("\n🎯 [INDEX-CHIPS] Testing index chips click functionality...");

  await page.waitForSelector(".mtrl-chips", { timeout: 5000 });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Find all chip containers on the page
  const chipContainers = await page.$$(".mtrl-chips");
  console.log(
    `🔍 [INDEX-CHIPS] Found ${chipContainers.length} chip containers`
  );

  if (chipContainers.length < 2) {
    console.log(
      "❌ [INDEX-CHIPS] Expected at least 2 chip containers (Pages and Indexes)"
    );
    return;
  }

  // Get all chips from both containers
  const firstContainerChips = await chipContainers[0].$$(".mtrl-chip");
  const secondContainerChips = await chipContainers[1].$$(".mtrl-chip");

  console.log(
    `📊 [INDEX-CHIPS] First container has ${firstContainerChips.length} chips`
  );
  console.log(
    `📊 [INDEX-CHIPS] Second container has ${secondContainerChips.length} chips`
  );

  // Get chip info from the second container (Indexes)
  const indexChipInfo = await page.evaluate(() => {
    const containers = document.querySelectorAll(".mtrl-chips");
    if (containers.length < 2) return [];

    const secondContainer = containers[1];
    const chips = secondContainer.querySelectorAll(".mtrl-chip");
    return Array.from(chips).map((chip) => ({
      text: chip.textContent?.trim() || "",
      dataValue: chip.getAttribute("data-value") || "",
      isSelected: chip.classList.contains("mtrl-chip--selected"),
    }));
  });

  console.log(
    `🎯 [INDEX-CHIPS] Second container (Indexes) chips:`,
    indexChipInfo.map((c) => `${c.text} (${c.dataValue})`).join(", ")
  );

  // Test clicking on actual index chips available
  const availableIndices = indexChipInfo
    .map((c) => parseInt(c.dataValue || "0"))
    .filter((v) => v > 0);

  if (availableIndices.length === 0) {
    console.log("❌ [INDEX-CHIPS] No valid index chips found");
    return;
  }

  // Test all available index chips (including the last one)
  const testIndices = availableIndices;

  for (const targetIndex of testIndices) {
    const chipIndex = indexChipInfo.findIndex(
      (c) => parseInt(c.dataValue || "0") === targetIndex
    );
    if (chipIndex === -1) continue;

    console.log(
      `\n🖱️ [INDEX-CHIPS] Clicking on index chip: ${indexChipInfo[chipIndex].text} (index: ${targetIndex})`
    );

    // Get state before click
    const beforeState = await page.evaluate(() => {
      const viewport = document.querySelector(".mtrl-viewport");
      const items = document.querySelectorAll(".list-item");
      const visibleItems = Array.from(items).filter((item) => {
        const rect = item.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });

      // Get the viewport's scroll position from the exposed component
      const listExample = (window as any).listExample;
      const userList = listExample?.listComponent?.userList;
      const scrollPosition = userList?.getScrollPosition?.() || 0;

      // Debug: log what's available
      if (!userList && listExample?.listComponent) {
        const listComponentKeys = Object.keys(listExample.listComponent);
        console.log(
          "[DEBUG] listComponent keys:",
          listComponentKeys.join(", ")
        );
      }

      return {
        scrollTop: viewport?.scrollTop || 0,
        scrollPosition: scrollPosition,
        visibleCount: visibleItems.length,
        firstVisibleId: visibleItems[0]?.getAttribute("data-id") || "none",
        lastVisibleId:
          visibleItems[visibleItems.length - 1]?.getAttribute("data-id") ||
          "none",
        hasListExample: !!listExample,
        hasUserList: !!userList,
        hasGetScrollPosition: !!userList?.getScrollPosition,
      };
    });

    console.log("📊 [INDEX-CHIPS] Before click:", beforeState);

    // Click the chip
    const chipElement = secondContainerChips[chipIndex];
    await chipElement.click();

    // Wait for scroll and rendering to complete
    // Larger indices may need more time for data loading
    const waitTime = targetIndex > 100000 ? 2000 : 1000;
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Wait for items to be rendered
    await page.waitForSelector(".list-item", { timeout: 5000 });

    // Get state after click
    const afterState = await page.evaluate((targetIndex) => {
      const viewport = document.querySelector(".mtrl-viewport");
      const items = document.querySelectorAll(".list-item");
      const visibleItems = Array.from(items).filter((item) => {
        const rect = item.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });

      // Get the viewport's scroll position from the exposed component
      const listExample = (window as any).listExample;
      const userList = listExample?.listComponent?.userList;
      const scrollPosition = userList?.getScrollPosition?.() || 0;

      // Find the item closest to the target index
      const targetItem = Array.from(items).find((item) => {
        const id = parseInt(item.getAttribute("data-id") || "0");
        return id >= targetIndex; // Use parameter
      });

      return {
        scrollTop: viewport?.scrollTop || 0,
        scrollPosition: scrollPosition,
        visibleCount: visibleItems.length,
        firstVisibleId: visibleItems[0]?.getAttribute("data-id") || "none",
        lastVisibleId:
          visibleItems[visibleItems.length - 1]?.getAttribute("data-id") ||
          "none",
        targetItemVisible: !!targetItem,
        targetItemId: targetItem?.getAttribute("data-id") || "none",
        hasUserList: !!userList,
        hasGetScrollPosition: !!userList?.getScrollPosition,
      };
    }, targetIndex); // Pass targetIndex as parameter

    console.log("📊 [INDEX-CHIPS] After click:", afterState);

    // Verify scroll happened - check scrollPosition instead of scrollTop
    if (afterState.scrollPosition !== beforeState.scrollPosition) {
      console.log(
        `✅ [INDEX-CHIPS] Scroll successful - moved from ${beforeState.scrollPosition} to ${afterState.scrollPosition}`
      );

      // Check if we're showing items around the target index
      const firstId = parseInt(afterState.firstVisibleId);
      const lastId = parseInt(afterState.lastVisibleId);

      // Check if the target index is within the visible range
      if (firstId <= targetIndex && targetIndex <= lastId) {
        console.log(
          `✅ [INDEX-CHIPS] Target index ${targetIndex} is visible in range [${firstId}-${lastId}]`
        );
      } else if (Math.abs(firstId - targetIndex) <= 10) {
        console.log(
          `⚠️ [INDEX-CHIPS] Target index ${targetIndex} is close to visible range [${firstId}-${lastId}]`
        );
      } else {
        console.log(
          `❌ [INDEX-CHIPS] Target index ${targetIndex} is not in visible range [${firstId}-${lastId}]`
        );
      }
    } else {
      console.log("❌ [INDEX-CHIPS] No scroll detected after click");
      console.log(
        `   scrollTop: ${beforeState.scrollTop} → ${afterState.scrollTop}`
      );
      console.log(
        `   scrollPosition: ${beforeState.scrollPosition} → ${afterState.scrollPosition}`
      );
    }
  }

  // Test rapid clicking between different indices
  console.log("\n🚀 [INDEX-CHIPS] Testing rapid index switching...");

  if (secondContainerChips.length >= 2) {
    const chip1 = secondContainerChips[0];
    const chip2 = secondContainerChips[secondContainerChips.length - 1];

    console.log(
      `🔄 [INDEX-CHIPS] Rapid clicking between first and last index chips`
    );

    // Click back and forth quickly
    await chip1.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    await chip2.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    await chip1.click();

    // Wait for final position
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("✅ [INDEX-CHIPS] Rapid switching test completed");
  }

  console.log("\n✅ [INDEX-CHIPS] Index chips click test completed!");
}
