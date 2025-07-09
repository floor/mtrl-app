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
