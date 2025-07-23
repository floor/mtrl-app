import { Page } from "puppeteer";

/**
 * Debug helper functions for VList component testing
 */

/**
 * Debug the actual DOM structure of the viewport container
 */
export async function debugViewportStructure(page: Page): Promise<void> {
  console.log("🔍 [DEBUG] Examining viewport DOM structure...");

  const structure = await page.evaluate(() => {
    // Find the main viewport container
    const viewport = document.querySelector(".mtrl-viewport");
    const items = document.querySelector(".mtrl-viewport-items");

    if (!viewport) return { error: "Viewport not found" };
    if (!items) return { error: "Items container not found" };

    // Get all possible item selectors
    const allChildren = Array.from(items.children);
    const dataIndexItems = items.querySelectorAll("[data-index]");
    const divChildren = items.querySelectorAll("div");
    const anyItems = items.querySelectorAll("*");

    return {
      viewport: {
        className: viewport.className,
        innerHTML: viewport.innerHTML.substring(0, 500) + "...",
        childCount: viewport.children.length,
        transform: window.getComputedStyle(viewport).transform,
      },
      itemsContainer: {
        className: items.className,
        innerHTML: items.innerHTML.substring(0, 500) + "...",
        childCount: items.children.length,
        transform: window.getComputedStyle(items).transform,
        display: window.getComputedStyle(items).display,
        visibility: window.getComputedStyle(items).visibility,
      },
      itemCounts: {
        allChildren: allChildren.length,
        dataIndexItems: dataIndexItems.length,
        divChildren: divChildren.length,
        anyItems: anyItems.length,
      },
      childrenDetails: allChildren.slice(0, 5).map((child, i) => ({
        index: i,
        tagName: child.tagName,
        className: child.className,
        id: child.id,
        attributes: Array.from(child.attributes).map((attr) => ({
          name: attr.name,
          value: attr.value,
        })),
        textContent: child.textContent?.trim().substring(0, 50) || "EMPTY",
      })),
    };
  });

  console.log(
    "🔍 [DEBUG] Viewport structure:",
    JSON.stringify(structure, null, 2)
  );
}

/**
 * Debug deferred cleanup behavior - test the issue where viewport appears empty after cleanup
 */
export async function debugDeferredCleanup(page: Page): Promise<void> {
  console.log("🐛 [DEFERRED-CLEANUP] Starting deferred cleanup debugging...");

  // Wait for initial load
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Helper function to get viewport state
  const getViewportState = async () => {
    return await page.evaluate(() => {
      const container = document.querySelector(
        ".mtrl-viewport-items"
      ) as HTMLElement;
      const viewport = document.querySelector(".mtrl-viewport") as HTMLElement;
      const items = Array.from(document.querySelectorAll(".list-item"));

      if (!container || !viewport) return null;

      const transform = container.style.transform;
      const translateY = transform.match(/translateY\(([^)]+)\)/)?.[1] || "0px";

      return {
        containerTransform: transform,
        translateY: translateY,
        totalItems: items.length,
        firstItemId: items[0]?.getAttribute("data-id") || "none",
        lastItemId: items[items.length - 1]?.getAttribute("data-id") || "none",
        viewportScrollTop: viewport.scrollTop,
        containerBounds: container.getBoundingClientRect(),
        viewportBounds: viewport.getBoundingClientRect(),
        visibleItems: items
          .filter((item) => {
            const rect = item.getBoundingClientRect();
            const viewportRect = viewport.getBoundingClientRect();
            return (
              rect.bottom > viewportRect.top && rect.top < viewportRect.bottom
            );
          })
          .map((item) => ({
            id: item.getAttribute("data-id"),
            bounds: item.getBoundingClientRect(),
          })),
      };
    });
  };

  // Initial state
  const initialState = await getViewportState();
  console.log("🐛 [DEFERRED-CLEANUP] Initial state:", {
    translateY: initialState?.translateY,
    totalItems: initialState?.totalItems,
    firstItemId: initialState?.firstItemId,
    lastItemId: initialState?.lastItemId,
    visibleItems: initialState?.visibleItems?.length || 0,
  });

  // Scroll to a position that will trigger cleanup
  console.log(
    "🐛 [DEFERRED-CLEANUP] Scrolling to position 4000 to trigger cleanup..."
  );

  // Perform multiple scrolls to build up items
  for (let i = 0; i < 20; i++) {
    const viewport = await page.$(".mtrl-viewport");
    if (viewport) {
      await viewport.hover();
      await page.mouse.wheel({ deltaY: 20 });
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // Wait a bit for scrolling to settle
  await new Promise((resolve) => setTimeout(resolve, 500));

  const afterScrollState = await getViewportState();
  console.log("🐛 [DEFERRED-CLEANUP] After scroll state:", {
    translateY: afterScrollState?.translateY,
    totalItems: afterScrollState?.totalItems,
    firstItemId: afterScrollState?.firstItemId,
    lastItemId: afterScrollState?.lastItemId,
    visibleItems: afterScrollState?.visibleItems?.length || 0,
  });

  // Now wait for cleanup to happen (1000ms delay)
  console.log("🐛 [DEFERRED-CLEANUP] Waiting for deferred cleanup (1000ms)...");
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const afterCleanupState = await getViewportState();
  console.log("🐛 [DEFERRED-CLEANUP] After cleanup state:", {
    translateY: afterCleanupState?.translateY,
    totalItems: afterCleanupState?.totalItems,
    firstItemId: afterCleanupState?.firstItemId,
    lastItemId: afterCleanupState?.lastItemId,
    visibleItems: afterCleanupState?.visibleItems?.length || 0,
  });

  // Check if items are visible
  const visibleItemsCount = afterCleanupState?.visibleItems?.length || 0;
  console.log(
    `🐛 [DEFERRED-CLEANUP] Visible items after cleanup: ${visibleItemsCount}`
  );

  if (visibleItemsCount === 0) {
    console.log("🚨 [DEFERRED-CLEANUP] NO ITEMS VISIBLE! Investigating...");

    // Get detailed positioning info
    const detailedInfo = await page.evaluate(() => {
      const container = document.querySelector(
        ".mtrl-viewport-items"
      ) as HTMLElement;
      const viewport = document.querySelector(".mtrl-viewport") as HTMLElement;
      const items = Array.from(document.querySelectorAll(".list-item"));

      if (!container || !viewport) return null;

      const viewportRect = viewport.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      return {
        viewportTop: viewportRect.top,
        viewportBottom: viewportRect.bottom,
        viewportHeight: viewportRect.height,
        containerTop: containerRect.top,
        containerBottom: containerRect.bottom,
        containerHeight: containerRect.height,
        containerTransform: container.style.transform,
        containerTransformMatrix: window.getComputedStyle(container).transform,
        itemsInfo: items.slice(0, 5).map((item) => ({
          id: item.getAttribute("data-id"),
          top: item.getBoundingClientRect().top,
          bottom: item.getBoundingClientRect().bottom,
          height: item.getBoundingClientRect().height,
          isVisible:
            item.getBoundingClientRect().bottom > viewportRect.top &&
            item.getBoundingClientRect().top < viewportRect.bottom,
        })),
      };
    });

    console.log("🐛 [DEFERRED-CLEANUP] Detailed positioning:");
    console.log(
      "  Viewport bounds:",
      `${detailedInfo?.viewportTop}px to ${detailedInfo?.viewportBottom}px`
    );
    console.log(
      "  Container bounds:",
      `${detailedInfo?.containerTop}px to ${detailedInfo?.containerBottom}px`
    );
    console.log("  Container transform:", detailedInfo?.containerTransform);
    console.log("  First 5 items:", detailedInfo?.itemsInfo);

    // Check if the issue is that items are positioned above the viewport
    if (detailedInfo?.itemsInfo && detailedInfo.itemsInfo.length > 0) {
      const firstItem = detailedInfo.itemsInfo[0];
      const translateYValue = parseFloat(
        detailedInfo.containerTransform?.match(
          /translateY\(([^)]+)px\)/
        )?.[1] || "0"
      );

      console.log("🔍 [DEFERRED-CLEANUP] Analysis:");
      console.log(`  First item top: ${firstItem.top}px`);
      console.log(`  Viewport top: ${detailedInfo.viewportTop}px`);
      console.log(`  TranslateY: ${translateYValue}px`);
      console.log(
        `  Items pushed above viewport: ${firstItem.top < detailedInfo.viewportTop}`
      );

      if (firstItem.top < detailedInfo.viewportTop) {
        console.log(
          "🚨 [DEFERRED-CLEANUP] PROBLEM: Items are positioned above viewport due to incorrect translateY!"
        );
      }
    }
  } else {
    console.log("✅ [DEFERRED-CLEANUP] Items are visible after cleanup");
  }

  console.log("🐛 [DEFERRED-CLEANUP] Debug completed");
}
