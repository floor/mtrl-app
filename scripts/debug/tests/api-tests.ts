import { Page } from "puppeteer";

/**
 * API and data loading tests for VList component
 */

/**
 * Test scrollToPage API request behavior
 */
export async function testScrollToPageAPI(page: Page) {
  console.log("🧪 [PUPPETEER] Testing scrollToPage API requests...");

  await page.goto("http://localhost:3000/components/lists/collection-addons", {
    waitUntil: "networkidle2",
  });

  // Wait for initial load
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Enable request intercepting
  await page.setRequestInterception(true);

  const apiRequests: any[] = [];

  page.on("request", (request) => {
    if (request.url().includes("/api/users")) {
      console.log("🌐 [PUPPETEER] API REQUEST INTERCEPTED:", request.url());
      apiRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now(),
      });
    }
    request.continue();
  });

  // Test scrollToPage(2) - should trigger API request for page 2
  console.log("🎯 [PUPPETEER] Testing scrollToPage(2) API request...");

  const beforeRequestCount = apiRequests.length;
  console.log(
    "📊 [PUPPETEER] API requests before scrollToPage(2):",
    beforeRequestCount
  );

  // Click page 2 chip and monitor console logs
  await page.evaluate(() => {
    console.log("🔍 [PUPPETEER] === STARTING scrollToPage(2) TEST ===");
    console.log("🔍 [PUPPETEER] Current API requests count:", 0);
  });

  // Enable console logging
  page.on("console", (msg) => {
    if (
      msg.text().includes("COLLECTION") ||
      msg.text().includes("VIEWPORT") ||
      msg.text().includes("API")
    ) {
      console.log("📝 [BROWSER]", msg.text());
    }
  });

  // Click page 2 chip
  await page.click('mtrl-chip[data-value="2"]');

  // Wait for potential API calls
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const afterRequestCount = apiRequests.length;
  console.log(
    "📊 [PUPPETEER] API requests after scrollToPage(2):",
    afterRequestCount
  );
  console.log(
    "📊 [PUPPETEER] New API requests:",
    afterRequestCount - beforeRequestCount
  );

  // Check if any requests were made
  if (afterRequestCount > beforeRequestCount) {
    console.log("✅ [PUPPETEER] API requests were triggered!");
    apiRequests.slice(beforeRequestCount).forEach((req, i) => {
      console.log(`📋 [PUPPETEER] Request ${i + 1}: ${req.method} ${req.url}`);
    });
  } else {
    console.log("❌ [PUPPETEER] NO API requests were triggered!");

    // Debug: Check current list state
    const listState = await page.evaluate(() => {
      const listElement = document.querySelector(".list");
      if (!listElement) return { error: "No list element found" };

      const listManager = (listElement as any).listManager;
      if (!listManager) return { error: "No listManager found" };

      return {
        totalItems: listManager.getTotalItems(),
        itemsLength: listManager.getItems().length,
        visibleRange: listManager.getVisibleRange(),
        scrollPosition: listManager.getScrollPosition(),
        hasCollection: !!listManager.collection,
        hasViewport: !!listManager.viewport,
        loadedRanges: listManager.collection
          ? Array.from(listManager.collection.getLoadedRanges())
          : [],
        pendingRanges: listManager.collection
          ? Array.from(listManager.collection.getPendingRanges())
          : [],
      };
    });

    console.log(
      "🔍 [PUPPETEER] List state after scrollToPage(2):",
      JSON.stringify(listState, null, 2)
    );
  }

  // Test manual API call
  console.log("🧪 [PUPPETEER] Testing manual collection.loadMissingRanges...");

  const manualLoadResult = await page.evaluate(() => {
    const listElement = document.querySelector(".list");
    if (!listElement) return { error: "No list element found" };

    const listManager = (listElement as any).listManager;
    if (!listManager?.collection) return { error: "No collection found" };

    // Try to manually trigger loading for range 20-39 (page 2)
    return listManager.collection
      .loadMissingRanges({ start: 20, end: 39 })
      .then(() => ({ success: true }))
      .catch((error: any) => ({ error: error.message }));
  });

  console.log(
    "🧪 [PUPPETEER] Manual loadMissingRanges result:",
    manualLoadResult
  );

  // Wait for potential API calls from manual trigger
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const finalRequestCount = apiRequests.length;
  console.log("📊 [PUPPETEER] Final API requests count:", finalRequestCount);

  if (finalRequestCount > afterRequestCount) {
    console.log("✅ [PUPPETEER] Manual trigger worked!");
  } else {
    console.log("❌ [PUPPETEER] Manual trigger also failed!");
  }

  // Test if visible range calculation is working
  const visibleRangeTest = await page.evaluate(() => {
    const listElement = document.querySelector(".list");
    if (!listElement) return { error: "No list element found" };

    const listManager = (listElement as any).listManager;
    if (!listManager) return { error: "No listManager found" };

    console.log("🔍 [RANGE-TEST] === TESTING VISIBLE RANGE CALCULATION ===");

    // Try scrolling to specific position
    listManager.scrollToIndex(20, "start");

    // Get visible range after scroll
    const visibleRange = listManager.getVisibleRange();
    console.log(
      "🔍 [RANGE-TEST] Visible range after scrollToIndex(20):",
      visibleRange
    );

    // Check if range includes index 20
    const includesTarget = visibleRange.start <= 20 && visibleRange.end >= 20;
    console.log("🔍 [RANGE-TEST] Range includes index 20:", includesTarget);

    return {
      visibleRange,
      includesTarget,
      scrollPosition: listManager.getScrollPosition(),
      totalItems: listManager.getTotalItems(),
      itemsLength: listManager.getItems().length,
    };
  });

  console.log(
    "🔍 [PUPPETEER] Visible range test result:",
    JSON.stringify(visibleRangeTest, null, 2)
  );

  console.log("🧪 [PUPPETEER] scrollToPage API test completed");
}

/**
 * Test server stop/start scenario for failed range loading
 */
export async function testServerStopStartScenario(page: Page): Promise<void> {
  console.log(
    "\n🔌 [SERVER-STOP-START] Testing failed range loading scenario..."
  );

  // First, expose the list to window for debugging
  await page.evaluate(() => {
    const listElement = document.querySelector('[data-component="list"]');
    if (listElement) {
      // Try to find the list component
      const allElements = document.querySelectorAll("*");
      for (const el of allElements) {
        if ((el as any).userList) {
          (window as any).debugUserList = (el as any).userList;
          console.log("✅ Found and exposed userList to window.debugUserList");
          break;
        }
      }
    }
  });

  // Get initial state
  const initialState = await page.evaluate(() => {
    const items = document.querySelectorAll(".list-item");
    return {
      itemCount: items.length,
      firstItemId: items[0]?.getAttribute("data-id"),
      lastItemId: items[items.length - 1]?.getAttribute("data-id"),
      scrollPosition: window.scrollY,
    };
  });

  console.log("📊 [SERVER-STOP-START] Initial state:", initialState);

  // Scroll to a position that has loaded data
  console.log(
    "📜 [SERVER-STOP-START] Scrolling to position 8400 (items ~100)..."
  );

  // Get viewport element and scroll it directly
  const scrollResult = await page.evaluate(() => {
    const viewport = document.querySelector(".mtrl-list__viewport");
    if (viewport) {
      // Try scrolling the viewport directly
      viewport.scrollTop = 8400;
      return {
        success: true,
        scrollTop: viewport.scrollTop,
        scrollHeight: viewport.scrollHeight,
        clientHeight: viewport.clientHeight,
      };
    }
    // Fallback to window scroll
    window.scrollTo(0, 8400);
    return {
      success: false,
      windowScrollY: window.scrollY,
      bodyScrollHeight: document.body.scrollHeight,
    };
  });

  console.log("📊 [SERVER-STOP-START] Scroll result:", scrollResult);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Debug ranges before stopping server
  await debugLoadedRanges(page);

  // Check what's loaded
  const beforeStopState = await page.evaluate(() => {
    const items = document.querySelectorAll(".list-item");
    const visibleItems = Array.from(items).filter((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    return {
      itemCount: items.length,
      visibleCount: visibleItems.length,
      firstVisibleId: visibleItems[0]?.getAttribute("data-id"),
      lastVisibleId:
        visibleItems[visibleItems.length - 1]?.getAttribute("data-id"),
      scrollPosition: window.scrollY,
    };
  });

  console.log("📊 [SERVER-STOP-START] Before server stop:", beforeStopState);

  // Stop the server
  console.log("🛑 [SERVER-STOP-START] Stopping server...");
  const { execSync } = require("child_process");
  try {
    execSync("cd /Users/jvial/Code/mtrl-app && bun run server:stop", {
      stdio: "pipe",
    });
    console.log("✅ [SERVER-STOP-START] Server stopped");
  } catch (error) {
    console.log(
      "⚠️ [SERVER-STOP-START] Server stop command failed (might already be stopped)"
    );
  }

  // Wait a bit
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Scroll forward to trigger loading of new range that will fail
  console.log(
    "📜 [SERVER-STOP-START] Scrolling forward to trigger failed load (position 20000 - range ~238)..."
  );

  const scrollResult2 = await page.evaluate(() => {
    const viewport = document.querySelector(".mtrl-list__viewport");
    if (viewport) {
      viewport.scrollTop = 20000;
      return {
        success: true,
        scrollTop: viewport.scrollTop,
        scrollHeight: viewport.scrollHeight,
        maxScroll: viewport.scrollHeight - viewport.clientHeight,
      };
    }
    window.scrollTo(0, 20000);
    return { success: false, windowScrollY: window.scrollY };
  });

  console.log("📊 [SERVER-STOP-START] Scroll result 2:", scrollResult2);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Debug ranges after failed load attempt
  console.log("📊 [SERVER-STOP-START] Ranges after failed load attempt:");
  await debugLoadedRanges(page);

  // Check for failed requests
  const failedLoadState = await page.evaluate(() => {
    const items = document.querySelectorAll(".list-item");
    const visibleItems = Array.from(items).filter((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    // Check console for errors
    const errors = (window as any).__puppeteerErrors || [];

    return {
      itemCount: items.length,
      visibleCount: visibleItems.length,
      firstVisibleId: visibleItems[0]?.getAttribute("data-id"),
      lastVisibleId:
        visibleItems[visibleItems.length - 1]?.getAttribute("data-id"),
      scrollPosition: window.scrollY,
      hasErrors: errors.length > 0,
      errorCount: errors.length,
    };
  });

  console.log(
    "📊 [SERVER-STOP-START] After failed load attempt:",
    failedLoadState
  );

  // Start the server again
  console.log("🚀 [SERVER-STOP-START] Starting server...");
  try {
    execSync("cd /Users/jvial/Code/mtrl-app && bun run server:start", {
      stdio: "pipe",
      detached: true,
    });
    console.log("✅ [SERVER-STOP-START] Server started");
  } catch (error) {
    console.log("⚠️ [SERVER-STOP-START] Server start command failed");
  }

  // Wait for server to be ready
  console.log("⏳ [SERVER-STOP-START] Waiting for server to be ready...");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Scroll back to the area that failed to load
  console.log(
    "📜 [SERVER-STOP-START] Scrolling back to failed area (position 20000)..."
  );

  const scrollResult3 = await page.evaluate(() => {
    const viewport = document.querySelector(".mtrl-list__viewport");
    if (viewport) {
      viewport.scrollTop = 20000;
      return {
        success: true,
        scrollTop: viewport.scrollTop,
        visibleRange: `Items should be around ${Math.floor(20000 / 84)} - ${Math.floor(20000 / 84) + 20}`,
      };
    }
    window.scrollTo(0, 20000);
    return { success: false, windowScrollY: window.scrollY };
  });

  console.log("📊 [SERVER-STOP-START] Scroll result 3:", scrollResult3);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Debug ranges after scrolling back
  console.log("📊 [SERVER-STOP-START] Ranges after scrolling back:");
  await debugLoadedRanges(page);

  // Check if items loaded
  const afterRestartState = await page.evaluate(() => {
    const items = document.querySelectorAll(".list-item");
    const visibleItems = Array.from(items).filter((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    // Get the actual item content to see if they're placeholders or real data
    const visibleItemsContent = visibleItems.map((item) => ({
      id: item.getAttribute("data-id"),
      text: item.textContent?.substring(0, 50),
      hasContent: (item.textContent?.length || 0) > 10,
    }));

    return {
      itemCount: items.length,
      visibleCount: visibleItems.length,
      firstVisibleId: visibleItems[0]?.getAttribute("data-id"),
      lastVisibleId:
        visibleItems[visibleItems.length - 1]?.getAttribute("data-id"),
      scrollPosition: window.scrollY,
      visibleItemsContent,
    };
  });

  console.log(
    "📊 [SERVER-STOP-START] After server restart and scroll back:",
    afterRestartState
  );

  // Check if the failed range was actually loaded
  if (afterRestartState.visibleCount === 0) {
    console.log(
      "❌ [SERVER-STOP-START] No items visible - failed ranges not reloaded!"
    );
  } else if (
    afterRestartState.visibleItemsContent.some((item) => !item.hasContent)
  ) {
    console.log("⚠️ [SERVER-STOP-START] Some items are empty/placeholders");
  } else {
    console.log("✅ [SERVER-STOP-START] Items loaded successfully");
  }

  // Try scrolling slightly to trigger a re-check
  console.log(
    "📜 [SERVER-STOP-START] Scrolling slightly to trigger re-check..."
  );
  await page.evaluate(() => window.scrollBy(0, 10));
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.evaluate(() => window.scrollBy(0, -10));
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Final check
  const finalState = await page.evaluate(() => {
    const items = document.querySelectorAll(".list-item");
    const visibleItems = Array.from(items).filter((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    return {
      itemCount: items.length,
      visibleCount: visibleItems.length,
      visibleItemIds: Array.from(visibleItems).map((item) =>
        item.getAttribute("data-id")
      ),
    };
  });

  console.log(
    "📊 [SERVER-STOP-START] Final state after slight scroll:",
    finalState
  );

  // Log collection state
  const collectionState = await page.evaluate(() => {
    // Try different ways to find the list manager
    const listElement = document.querySelector('[data-component="list"]');

    // Check if list manager is exposed on window
    let manager = (window as any).__listManager || (window as any).listManager;

    // Try to find it through the list element's data
    if (!manager && listElement) {
      // Check various properties where it might be stored
      manager =
        (listElement as any).listManager ||
        (listElement as any)._listManager ||
        (listElement as any).__manager;
    }

    // Try to find through mtrl global
    if (!manager && (window as any).mtrl) {
      const components = (window as any).mtrl.components || {};
      manager = components.listManager || components.list;
    }

    if (!manager) {
      return {
        error: "List manager not found",
        listElementFound: !!listElement,
        windowKeys: Object.keys(window)
          .filter((k) => k.includes("list") || k.includes("manager"))
          .slice(0, 10),
      };
    }

    const collection = manager.collection;

    if (!collection) {
      return {
        error: "Collection not found on manager",
        managerKeys: Object.keys(manager).slice(0, 20),
      };
    }

    // Get loaded ranges
    let loadedRanges = [];
    let pendingRanges = [];

    try {
      if (collection.getLoadedRanges) {
        loadedRanges = Array.from(collection.getLoadedRanges());
      }
      if (collection.getPendingRanges) {
        pendingRanges = Array.from(collection.getPendingRanges());
      }
    } catch (e) {
      console.error("Error getting ranges:", e);
    }

    return {
      loadedRanges,
      pendingRanges,
      totalItems: collection.getTotalItems ? collection.getTotalItems() : "N/A",
      collectionMethods: Object.keys(collection)
        .filter((k) => typeof collection[k] === "function")
        .slice(0, 10),
    };
  });

  console.log("📊 [SERVER-STOP-START] Collection state:", collectionState);
}

/**
 * Test for gaps in loaded items when server fails
 */
export async function testGapIssue(page: Page): Promise<void> {
  console.log("\n🔍 [GAP-TEST] Testing for gaps in loaded items...");

  // Helper function to scroll using mouse wheel
  const scrollWithWheel = async (deltaY: number, times: number = 1) => {
    for (let i = 0; i < times; i++) {
      await page.mouse.wheel({ deltaY });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  // Helper to check for gaps
  const checkForGaps = async () => {
    return await page.evaluate(() => {
      const items = document.querySelectorAll(".list-item");
      const ids = Array.from(items)
        .map((el) => parseInt(el.getAttribute("data-id") || "0"))
        .filter((id) => !isNaN(id))
        .sort((a, b) => a - b);

      const gaps: Array<{ start: number; end: number; size: number }> = [];
      for (let i = 1; i < ids.length; i++) {
        if (ids[i] - ids[i - 1] > 1) {
          gaps.push({
            start: ids[i - 1],
            end: ids[i],
            size: ids[i] - ids[i - 1] - 1,
          });
        }
      }

      return {
        totalItems: items.length,
        firstId: ids[0],
        lastId: ids[ids.length - 1],
        gaps,
        hasGaps: gaps.length > 0,
      };
    });
  };

  // Helper to get collection state
  const getCollectionState = async () => {
    return await page.evaluate(() => {
      const example = (window as any).listExample;
      if (!example || !example.list) {
        return { error: "List not found" };
      }

      const list = example.list;
      const collection = list.collection || list._collection;

      if (!collection) {
        return { error: "Collection not found" };
      }

      // Try to access internal state
      const state: any = {
        totalItems: list.totalItems || "unknown",
        itemsArrayLength: list.items ? list.items.length : "unknown",
      };

      // Count null items
      if (list.items && Array.isArray(list.items)) {
        let nullCount = 0;
        const nullRanges: Array<{ start: number; end: number }> = [];
        let rangeStart = -1;

        for (let i = 0; i < list.items.length; i++) {
          if (list.items[i] === null || list.items[i] === undefined) {
            nullCount++;
            if (rangeStart === -1) rangeStart = i;
          } else if (rangeStart !== -1) {
            nullRanges.push({ start: rangeStart, end: i - 1 });
            rangeStart = -1;
          }
        }

        if (rangeStart !== -1) {
          nullRanges.push({ start: rangeStart, end: list.items.length - 1 });
        }

        state.nullCount = nullCount;
        state.nullRanges = nullRanges.slice(0, 10); // First 10 ranges
      }

      // Try to get loaded ranges
      if (collection.getLoadedRanges) {
        try {
          state.loadedRanges = Array.from(collection.getLoadedRanges());
        } catch (e) {
          state.loadedRanges = "error getting ranges";
        }
      }

      return state;
    });
  };

  // Initial state
  console.log("📊 [GAP-TEST] Initial check:");
  let gapCheck = await checkForGaps();
  console.log("   Items:", gapCheck);
  let collectionState = await getCollectionState();
  console.log("   Collection:", collectionState);

  // Scroll down to load some items
  console.log("\n📜 [GAP-TEST] Scrolling down to load items...");
  await scrollWithWheel(300, 10);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  gapCheck = await checkForGaps();
  console.log("📊 [GAP-TEST] After initial scroll:", gapCheck);

  // Stop the server
  console.log("\n🛑 [GAP-TEST] Stopping server...");
  const { execSync } = require("child_process");
  try {
    execSync("cd /Users/jvial/Code/mtrl-app && bun run server:stop", {
      stdio: "pipe",
    });
    console.log("✅ Server stopped");
  } catch (error) {
    console.log("⚠️ Server might already be stopped");
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Scroll to trigger failed loads
  console.log("\n📜 [GAP-TEST] Scrolling to trigger failed loads...");
  await scrollWithWheel(300, 20);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  gapCheck = await checkForGaps();
  console.log("📊 [GAP-TEST] After failed load attempts:", gapCheck);
  collectionState = await getCollectionState();
  console.log("   Collection state:", collectionState);

  // Start the server
  console.log("\n▶️ [GAP-TEST] Starting server...");
  try {
    execSync("cd /Users/jvial/Code/mtrl-app && bun run server:start", {
      stdio: "pipe",
    });
    console.log("✅ Server started");
  } catch (error) {
    console.log("⚠️ Failed to start server:", error);
  }

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Scroll back to the gap area
  console.log("\n📜 [GAP-TEST] Scrolling back to gap area...");
  await scrollWithWheel(-300, 10);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  gapCheck = await checkForGaps();
  console.log(
    "📊 [GAP-TEST] After scrolling back (should load gaps):",
    gapCheck
  );
  collectionState = await getCollectionState();
  console.log("   Collection state:", collectionState);

  // Try scrolling over the gap area again
  console.log("\n📜 [GAP-TEST] Scrolling over gap area again...");
  await scrollWithWheel(100, 5);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await scrollWithWheel(-100, 5);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  gapCheck = await checkForGaps();
  console.log("📊 [GAP-TEST] Final check:", gapCheck);
  collectionState = await getCollectionState();
  console.log("   Final collection state:", collectionState);

  if (gapCheck.hasGaps) {
    console.log("\n❌ [GAP-TEST] ISSUE FOUND: Gaps still exist!");
    console.log("   Gap details:", gapCheck.gaps);
  } else {
    console.log("\n✅ [GAP-TEST] No gaps found - items loaded correctly");
  }
}

/**
 * Debug loaded ranges in the collection
 */
export async function debugLoadedRanges(page: Page): Promise<void> {
  console.log("\n🔍 [DEBUG-RANGES] Checking loaded ranges...");

  const rangeInfo = await page.evaluate(() => {
    const listElement = document.querySelector('[data-component="list"]');

    // Try to find the list component through various methods
    let listComponent: any = null;

    // Method 1: Check if it's stored on the element
    if ((listElement as any)?._component) {
      listComponent = (listElement as any)._component;
    }

    // Method 2: Check window for list instances
    if (!listComponent) {
      // Look for any property that might be our list
      for (const key of Object.keys(window)) {
        const value = (window as any)[key];
        if (
          value &&
          typeof value === "object" &&
          value.element === listElement
        ) {
          listComponent = value;
          break;
        }
      }
    }

    // Method 3: Check for list in global scope
    if (!listComponent && (window as any).userList) {
      listComponent = (window as any).userList;
    }

    // Method 4: Check for listExample (mtrl-addons)
    if (!listComponent && (window as any).listExample) {
      listComponent = (window as any).listExample.listComponent?.userList;
    }

    if (!listComponent) {
      return { error: "Could not find list component" };
    }

    // Now try to access the collection
    const collection =
      listComponent.collection ||
      (listComponent as any)._collection ||
      (listComponent.getCollection && listComponent.getCollection());

    if (!collection) {
      return {
        error: "Collection not found",
        componentKeys: Object.keys(listComponent).slice(0, 20),
      };
    }

    // Get range information
    const loadedRanges = collection.getLoadedRanges
      ? Array.from(collection.getLoadedRanges())
      : "Method not available";

    const pendingRanges = collection.getPendingRanges
      ? Array.from(collection.getPendingRanges())
      : "Method not available";

    const totalItems = collection.getTotalItems
      ? collection.getTotalItems()
      : listComponent.totalItems || "Unknown";

    const itemsLength = listComponent.items
      ? listComponent.items.length
      : "Unknown";

    // Check for null items in the array
    let nullItemRanges: number[] = [];
    if (listComponent.items && Array.isArray(listComponent.items)) {
      for (let i = 0; i < Math.min(listComponent.items.length, 500); i++) {
        if (
          listComponent.items[i] === null ||
          listComponent.items[i] === undefined
        ) {
          nullItemRanges.push(i);
        }
      }
    }

    return {
      loadedRanges,
      pendingRanges,
      totalItems,
      itemsLength,
      nullItemRanges: nullItemRanges.slice(0, 50), // First 50 null items
      nullItemCount: nullItemRanges.length,
      collectionMethods: collection
        ? Object.keys(collection)
            .filter((k) => typeof collection[k] === "function")
            .slice(0, 15)
        : [],
    };
  });

  console.log("📊 [DEBUG-RANGES] Range information:", rangeInfo);
}
