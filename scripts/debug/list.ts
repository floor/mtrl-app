#!/usr/bin/env bun

/**
 * General-purpose Puppeteer testing script for mtrl components
 * Usage: bun run puppeteer examples/list
 * Usage: bun run puppeteer examples/list --interactive
 * Tests any example at http://localhost:4000/{example_path}
 */

import puppeteer, { Browser, Page } from "puppeteer";

interface ComponentInfo {
  title: string;
  bodyLength: number;
  bodyPreview: string;

  // Component detection
  componentContainer: boolean;
  mtrlElements: number;

  // Script detection
  scriptTags: number;
  moduleScripts: number;
  importMaps: number;

  // Error detection
  errorElements: number;

  // Structure analysis
  divsWithClasses: number;
  sampleClasses: string[];
  containerHTML?: string;
}

class PuppeteerTester {
  private browser: Browser | null = null;
  private examplePath: string;
  private baseUrl: string = "http://localhost:4000";
  private isInteractive: boolean = false;
  private consoleLogs: string[] = [];

  constructor(examplePath: string, isInteractive: boolean = false) {
    this.examplePath = examplePath;
    this.isInteractive = isInteractive;
  }

  async test(): Promise<void> {
    console.log("🚀 [PUPPETEER] Starting automated testing session...");
    if (this.isInteractive) {
      console.log(
        "🎮 [PUPPETEER] Interactive mode enabled - will perform clicks"
      );
    }

    try {
      await this.launchBrowser();
      const page = await this.createPage();
      const url = this.buildUrl();

      console.log(`📄 [PUPPETEER] Loading ${url}...`);

      await this.navigateToPage(page, url);
      await this.waitForInitialization();

      const componentInfo = await this.analyzeComponent(page);
      this.reportResults(componentInfo);

      if (this.isInteractive) {
        await this.performInteractiveTests(page);
      }

      // Test mouse wheel scrolling with content verification
      await testMouseWheelScrollingWithContentCheck(page);

      // Debug viewport structure
      await debugViewportStructure(page);

      // Test mouse wheel scrolling behavior
      await testMouseWheelScrolling(page);

      // Debug deferred cleanup behavior
      await debugDeferredCleanup(page);

      // Test backward scrolling for overlaps
      await testBackwardScrolling(page);

      // Test server stop/start scenario
      await testServerStopStartScenario(page);

      // Test gap issue specifically
      await testGapIssue(page);

      // Test scroll functions
      await testScrollFunctions(page);

      // Debug loaded ranges
      await debugLoadedRanges(page);
    } catch (error) {
      console.error(
        "❌ [PUPPETEER] Error during testing:",
        (error as Error).message
      );
    } finally {
      await this.cleanup();
    }
  }

  private async launchBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true, // Set to false for debugging: headless: false
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--allow-running-insecure-content",
      ],
    });
  }

  private async createPage(): Promise<Page> {
    if (!this.browser) throw new Error("Browser not initialized");

    const page = await this.browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    // Capture console messages
    page.on("console", (msg) => {
      const message = `💬 [${msg.type().toUpperCase()}] ${msg.text()}`;
      console.log(message);
      this.consoleLogs.push(message);
    });

    // Capture JavaScript errors
    page.on("pageerror", (error) => {
      const message = `❌ [JS-ERROR] ${error.message}`;
      console.log(message);
      this.consoleLogs.push(message);
    });

    // Capture failed requests
    page.on("requestfailed", (request) => {
      const message = `🔴 [REQUEST-FAILED] ${request.url()} - ${request.failure()?.errorText}`;
      console.log(message);
      this.consoleLogs.push(message);
    });

    return page;
  }

  private buildUrl(): string {
    // Support both directory paths and direct file paths
    const cleanPath = this.examplePath.replace(/^\/+|\/+$/g, ""); // Remove leading/trailing slashes
    return `${this.baseUrl}/${cleanPath}`;
  }

  private async navigateToPage(page: Page, url: string): Promise<void> {
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 10000,
    });

    console.log("✅ [PUPPETEER] Page loaded successfully");
  }

  private async waitForInitialization(): Promise<void> {
    // Give components time to initialize
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  private async performInteractiveTests(page: Page): Promise<void> {
    console.log("\n=== 🎮 INTERACTIVE TESTING MODE ===");

    // Clear previous console logs for interaction tracking
    this.consoleLogs = [];

    // Look for chips to click
    const chips = await page.$$(".mtrl-chip[data-value]");
    console.log(`🔍 [INTERACTION] Found ${chips.length} clickable chips`);

    if (chips.length > 0) {
      // Get chip information
      const chipInfo = await page.evaluate(() => {
        const chips = Array.from(
          document.querySelectorAll(".mtrl-chip[data-value]")
        );
        return chips.map((chip, index) => ({
          index,
          dataValue: chip.getAttribute("data-value"),
          selected: chip.getAttribute("aria-selected") === "true",
          className: chip.className,
          text: chip.textContent?.trim() || "",
        }));
      });

      console.log("\n📋 [INTERACTION] Available chips:");
      chipInfo.forEach((chip) => {
        console.log(
          `  ${chip.index + 1}. Value: ${chip.dataValue}, Selected: ${chip.selected}, Text: "${chip.text}"`
        );
      });

      // Click on the second chip (index 1) to test page 2
      const targetChip = chips[1]; // Change to index 1 for chip 2
      if (targetChip) {
        const chipValue = await targetChip.evaluate((el) =>
          el.getAttribute("data-value")
        );
        const chipSelected = await targetChip.evaluate(
          (el) => el.getAttribute("aria-selected") === "true"
        );
        const chipText = await targetChip.evaluate((el) => el.textContent);

        console.log(
          `🎯 [INTERACTION] Clicking on chip with data-value="${chipValue}" (index 1)`
        );
        console.log(
          `💬 [INTERACTION] Chip details: Selected=${chipSelected}, Text="${chipText}"`
        );

        // Count logs before click
        const logsBefore = this.consoleLogs.length;
        console.log(
          `📊 [INTERACTION] Console logs before click: ${logsBefore}`
        );

        // Click the chip
        await targetChip.click();

        // Wait a bit for any async operations
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Report new console logs
        const postClickLogCount = this.consoleLogs.length;
        const newLogs = this.consoleLogs.slice(logsBefore);

        console.log(
          `\n📊 [INTERACTION] Console logs after click: ${postClickLogCount}`
        );
        console.log(`🆕 [INTERACTION] New logs from click: ${newLogs.length}`);

        if (newLogs.length > 0) {
          console.log("\n=== 📋 NEW CONSOLE LOGS FROM CLICK ===");
          newLogs.forEach((log, index) => {
            console.log(`${index + 1}. ${log}`);
          });
        } else {
          console.log(
            "ℹ️ [INTERACTION] No new console logs generated from click"
          );
        }

        // Check if chip state changed
        const updatedChipInfo = await page.evaluate((targetIndex) => {
          const chip = document.querySelectorAll(".mtrl-chip[data-value]")[
            targetIndex
          ];
          return {
            dataValue: chip?.getAttribute("data-value"),
            selected: chip?.getAttribute("aria-selected") === "true",
            className: chip?.className,
            text: chip?.textContent?.trim() || "",
          };
        }, 2); // Pass index 2 for chip 3

        console.log(`\n🔄 [INTERACTION] Chip state after click:`);
        console.log(`   Value: ${updatedChipInfo.dataValue}`);
        console.log(
          `   Selected: ${chipSelected} → ${updatedChipInfo.selected}`
        );
        console.log(`   Text: "${updatedChipInfo.text}"`);
        console.log(`   Classes: ${updatedChipInfo.className}`);

        // Additional interaction tests
        await this.testAdditionalInteractions(page);
      } else {
        console.log(`❌ [INTERACTION] Chip with data-value="3" not found`);
        console.log(
          `📋 [INTERACTION] Available values: ${chipInfo.map((c) => c.dataValue).join(", ")}`
        );
      }
    } else {
      console.log("❌ [INTERACTION] No clickable chips found on page");
    }
  }

  private async testAdditionalInteractions(page: Page): Promise<void> {
    console.log("\n=== 🧪 ADDITIONAL INTERACTION TESTS ===");

    // Test keyboard interactions
    console.log("⌨️ [INTERACTION] Testing keyboard navigation...");
    await page.keyboard.press("Tab");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Test hover effects
    console.log("🖱️ [INTERACTION] Testing hover effects...");
    const hoverTarget = await page.$('.mtrl-chip[data-value="2"]');
    if (hoverTarget) {
      await hoverTarget.hover();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Test scrollbar hover behavior
    console.log("📜 [INTERACTION] Testing scrollbar hover behavior...");
    const scrollbarTrack = await page.$(".mtrl-list-manager-scrollbar-track");
    if (scrollbarTrack) {
      // Check initial opacity
      const initialOpacity = await scrollbarTrack.evaluate(
        (el) => window.getComputedStyle(el).opacity
      );
      console.log(
        `📜 [INTERACTION] Scrollbar initial opacity: ${initialOpacity}`
      );

      // Hover over scrollbar
      await scrollbarTrack.hover();
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Check opacity after hover
      const hoverOpacity = await scrollbarTrack.evaluate(
        (el) => window.getComputedStyle(el).opacity
      );
      console.log(
        `📜 [INTERACTION] Scrollbar opacity on hover: ${hoverOpacity}`
      );

      // Move mouse away
      await page.mouse.move(100, 100);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Wait for fade timeout (500ms) + transition (200ms)

      // Check opacity after mouse leave
      const finalOpacity = await scrollbarTrack.evaluate(
        (el) => window.getComputedStyle(el).opacity
      );
      console.log(
        `📜 [INTERACTION] Scrollbar opacity after hover: ${finalOpacity}`
      );

      // Report results
      if (
        hoverOpacity === "1" &&
        (finalOpacity === "0" || parseFloat(finalOpacity) < 0.1)
      ) {
        console.log(
          "✅ [INTERACTION] Scrollbar hover behavior working correctly!"
        );
      } else if (hoverOpacity === "1") {
        console.log(
          "⚠️ [INTERACTION] Scrollbar shows on hover but may not hide properly"
        );
        console.log(
          `📜 [INTERACTION] Expected opacity: 0, Got: ${finalOpacity}`
        );
      } else {
        console.log("❌ [INTERACTION] Scrollbar hover events not working");
      }
    } else {
      console.log("❌ [INTERACTION] Scrollbar track not found");
    }

    // Check for any ripple effects or animations
    const ripples = await page.$$(".mtrl-ripple");
    console.log(`✨ [INTERACTION] Found ${ripples.length} ripple elements`);

    console.log("✅ [INTERACTION] Interactive testing completed");
  }

  private async analyzeComponent(page: Page): Promise<ComponentInfo> {
    return await page.evaluate(() => {
      // List-specific analysis
      const listItemsContainer = document.querySelector(
        ".mtrl-list-manager-items"
      );
      const listItems = listItemsContainer?.children || [];
      const listComponent = document.querySelector(".mtrl-list");

      // Check for any items in the container
      console.log(
        `📊 [DOM-ANALYSIS] List items container:`,
        listItemsContainer
      );
      console.log(`📊 [DOM-ANALYSIS] Items in container: ${listItems.length}`);
      console.log(`📊 [DOM-ANALYSIS] List component:`, listComponent);

      // Check for placeholder or loading elements
      const placeholders = document.querySelectorAll('[class*="placeholder"]');
      const loadingElements = document.querySelectorAll('[class*="loading"]');

      console.log(`📊 [DOM-ANALYSIS] Placeholders: ${placeholders.length}`);
      console.log(
        `📊 [DOM-ANALYSIS] Loading elements: ${loadingElements.length}`
      );

      // Log the actual HTML content of the items container
      if (listItemsContainer) {
        console.log(
          `📊 [DOM-ANALYSIS] Items container HTML:`,
          listItemsContainer.innerHTML.substring(0, 500)
        );
        console.log(
          `📊 [DOM-ANALYSIS] Items container style:`,
          window.getComputedStyle(listItemsContainer).display
        );
        console.log(`📊 [DOM-ANALYSIS] Items container dimensions:`, {
          width: (listItemsContainer as HTMLElement).offsetWidth,
          height: (listItemsContainer as HTMLElement).offsetHeight,
          scrollHeight: (listItemsContainer as HTMLElement).scrollHeight,
        });
      }

      // Check for scrollbar elements
      const scrollbarTrack = document.querySelector(
        ".mtrl-list-manager-scrollbar-track"
      );
      const scrollbarThumb = document.querySelector(
        ".mtrl-list-manager-scrollbar-thumb"
      );

      if (scrollbarTrack && scrollbarThumb) {
        const trackHeight = (scrollbarTrack as HTMLElement).offsetHeight;
        const thumbHeight = (scrollbarThumb as HTMLElement).offsetHeight;
        const thumbTop = (scrollbarThumb as HTMLElement).offsetTop;

        console.log(
          `📊 [DOM-ANALYSIS] Scrollbar track height: ${trackHeight}px`
        );
        console.log(
          `📊 [DOM-ANALYSIS] Scrollbar thumb height: ${thumbHeight}px`
        );
        console.log(
          `📊 [DOM-ANALYSIS] Scrollbar thumb position: ${thumbTop}px`
        );
        console.log(
          `📊 [DOM-ANALYSIS] Scrollbar thumb ratio: ${((thumbHeight / trackHeight) * 100).toFixed(2)}%`
        );
      } else {
        console.log(`📊 [DOM-ANALYSIS] Scrollbar not found or not visible`);
      }

      return {
        title: document.title,
        bodyLength: document.body.innerHTML.length,
        bodyPreview: document.body.innerHTML.substring(0, 400) + "...",

        // General component detection (not list-specific)
        componentContainer: !!document.querySelector('[class*="container"]'),
        mtrlElements: document.querySelectorAll('[class*="mtrl"]').length,

        // Script detection
        scriptTags: document.querySelectorAll("script").length,
        moduleScripts: document.querySelectorAll('script[type="module"]')
          .length,
        importMaps: document.querySelectorAll('script[type="importmap"]')
          .length,

        // Error detection
        errorElements: document.querySelectorAll('.error, [class*="error"]')
          .length,

        // Structure analysis
        divsWithClasses: document.querySelectorAll("div[class]").length,
        sampleClasses: Array.from(document.querySelectorAll("div[class]"))
          .slice(0, 10)
          .map((el) => el.className),

        // Container content preview
        containerHTML:
          document
            .querySelector('[class*="container"]')
            ?.innerHTML?.substring(0, 200) || undefined,
      };
    });
  }

  private reportResults(info: ComponentInfo): void {
    console.log("\n=== 📊 DETAILED PAGE ANALYSIS ===");
    console.log(`📄 Page title: ${info.title}`);
    console.log(`📄 Body content length: ${info.bodyLength} characters`);
    console.log(`📊 Total divs with classes: ${info.divsWithClasses}`);
    console.log(
      `📊 Script tags: ${info.scriptTags} (${info.moduleScripts} ES modules)`
    );
    console.log(`📊 Import maps: ${info.importMaps}`);

    console.log("\n=== 🎯 COMPONENT DETECTION ===");
    console.log(
      `🎯 Component container: ${info.componentContainer ? "✅ Found" : "❌ Not found"}`
    );
    console.log(
      `🎯 mtrl elements: ${info.mtrlElements > 0 ? `✅ Found ${info.mtrlElements}` : "❌ None found"}`
    );
    console.log(
      `🎯 Error elements: ${info.errorElements > 0 ? `⚠️ Found ${info.errorElements}` : "✅ None found"}`
    );

    if (info.containerHTML) {
      console.log(`\n📋 Container content preview:`);
      console.log(info.containerHTML);
    }

    if (info.sampleClasses.length > 0) {
      console.log(`\n📋 Sample element classes:`);
      info.sampleClasses.forEach((className, i) => {
        console.log(`  ${i + 1}. ${className}`);
      });
    }

    console.log("\n=== 📄 BODY CONTENT PREVIEW ===");
    console.log(info.bodyPreview);

    // Final assessment
    console.log("\n=== 🎯 FINAL ASSESSMENT ===");
    if (
      info.componentContainer &&
      info.mtrlElements > 0 &&
      info.errorElements === 0
    ) {
      console.log("🎉 SUCCESS: Component appears to be working correctly!");
    } else if (info.componentContainer && info.mtrlElements > 0) {
      console.log("⚠️  PARTIAL: Component found but may have issues");
    } else if (info.errorElements > 0) {
      console.log("❌ ERROR: Error elements detected on page");
    } else {
      console.log("❌ FAILURE: Component does not appear to be working");
    }
  }

  private async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log("👋 [PUPPETEER] Browser closed");
    }
  }
}

/**
 * Test scrollToPage API request behavior
 */
async function testScrollToPageAPI(page: Page) {
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
 * Test mouse wheel scrolling with visual content verification
 */
async function testMouseWheelScrollingWithContentCheck(
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
      const container = document.querySelector(
        ".mtrl-list-manager-viewport-items"
      );
      if (!container) return [];

      const items = container.querySelectorAll(".mtrl-list-item");
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
      const container = document.querySelector(
        ".mtrl-list-manager-viewport-items"
      );
      if (!container) return null;

      const style = window.getComputedStyle(container);
      const items = container.querySelectorAll(".mtrl-list-item");

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
    const viewport = await page.$(".mtrl-list-manager-viewport");
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
async function testMouseWheelScrolling(page: Page): Promise<void> {
  console.log("🖱️ [PUPPETEER] Testing mouse wheel scrolling...");

  // Wait for list to initialize
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("🖱️ [PUPPETEER] Testing multiple small mouse wheel scrolls...");

  // Test multiple small scrolls
  for (let i = 1; i <= 10; i++) {
    console.log(`🖱️ [PUPPETEER] Scroll ${i}/10: deltaY=200`);

    // Target the viewport element specifically
    const viewport = await page.$(".mtrl-list-manager-viewport");
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
      const container = document.querySelector(
        ".mtrl-list-manager-viewport-items"
      );
      if (!container) return { containerFound: false };

      const style = window.getComputedStyle(container);
      const items = container.querySelectorAll(".mtrl-list-item");

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
    const container = document.querySelector(
      ".mtrl-list-manager-viewport-items"
    );
    if (!container) return { containerFound: false };

    const style = window.getComputedStyle(container);
    const items = container.querySelectorAll(".mtrl-list-item");

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
 * Debug the actual DOM structure of the viewport container
 */
async function debugViewportStructure(page: Page): Promise<void> {
  console.log("🔍 [DEBUG] Examining viewport DOM structure...");

  const structure = await page.evaluate(() => {
    // Find the main viewport container
    const viewport = document.querySelector(".mtrl-list-manager-viewport");
    const items = document.querySelector(".mtrl-list-manager-viewport-items");

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
async function debugDeferredCleanup(page: Page): Promise<void> {
  console.log("🐛 [DEFERRED-CLEANUP] Starting deferred cleanup debugging...");

  // Wait for initial load
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Helper function to get viewport state
  const getViewportState = async () => {
    return await page.evaluate(() => {
      const container = document.querySelector(
        ".mtrl-list-manager-viewport-items"
      ) as HTMLElement;
      const viewport = document.querySelector(
        ".mtrl-list-manager-viewport"
      ) as HTMLElement;
      const items = Array.from(document.querySelectorAll(".mtrl-list-item"));

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
    const viewport = await page.$(".mtrl-list-manager-viewport");
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
        ".mtrl-list-manager-viewport-items"
      ) as HTMLElement;
      const viewport = document.querySelector(
        ".mtrl-list-manager-viewport"
      ) as HTMLElement;
      const items = Array.from(document.querySelectorAll(".mtrl-list-item"));

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

/**
 * Test backward scrolling for overlapping items
 */
async function testBackwardScrolling(page: Page): Promise<void> {
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
      const items = Array.from(document.querySelectorAll(".mtrl-list-item"));
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
 * Test server stop/start scenario for failed range loading
 */
async function testServerStopStartScenario(page: Page): Promise<void> {
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
    const items = document.querySelectorAll(".mtrl-list-item");
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
    const items = document.querySelectorAll(".mtrl-list-item");
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
    const items = document.querySelectorAll(".mtrl-list-item");
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
    const items = document.querySelectorAll(".mtrl-list-item");
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
    const items = document.querySelectorAll(".mtrl-list-item");
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

  // Log collection state - try to find the list manager
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
 * Debug loaded ranges in the collection
 */
async function debugLoadedRanges(page: Page): Promise<void> {
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

/**
 * Test for gaps in loaded items when server fails
 */
async function testGapIssue(page: Page): Promise<void> {
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
      const items = document.querySelectorAll(".mtrl-list-item");
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
 * Test scrollToPage and scrollToIndex functionality
 */
async function testScrollFunctions(page: Page): Promise<void> {
  console.log("\n🧪 [SCROLL-TEST] Testing scrollToPage and scrollToIndex...");

  // Test scrollToIndex
  console.log("\n📍 [SCROLL-TEST] Testing scrollToIndex...");

  const indexTestResult = await page.evaluate(() => {
    const example = (window as any).listExample;
    if (!example || !example.list) {
      return { error: "List not found" };
    }

    const list = example.list;
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
    const example = (window as any).listExample;
    if (!example || !example.list) {
      return { error: "List not found" };
    }

    const list = example.list;
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
    const example = (window as any).listExample;
    if (!example || !example.list) {
      return { error: "List not found" };
    }

    const list = example.list;
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

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      "❌ [PUPPETEER] Usage: bun run puppeteer <example_path> [--interactive]"
    );
    console.log("📋 [PUPPETEER] Examples:");
    console.log("   bun run puppeteer examples/list");
    console.log("   bun run puppeteer examples/list --interactive");
    console.log("   bun run puppeteer examples/grid");
    console.log("   bun run puppeteer examples/form");
    console.log("🎮 [PUPPETEER] Use --interactive to enable click testing");
    process.exit(1);
  }

  const examplePath = args[0];
  const isInteractive = args.includes("--interactive");

  console.log(`🎯 [PUPPETEER] Testing example: ${examplePath}`);
  if (isInteractive) {
    console.log(
      "🎮 [PUPPETEER] Interactive mode: Will click on elements and track console logs"
    );
  }

  const tester = new PuppeteerTester(examplePath, isInteractive);
  await tester.test();
}

main().catch(console.error);
