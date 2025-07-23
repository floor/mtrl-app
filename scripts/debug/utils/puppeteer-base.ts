import puppeteer, { Browser, Page } from "puppeteer";

export interface ComponentInfo {
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

export class PuppeteerTester {
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

      // Let the main script handle test execution
      await this.runTests(page);
    } catch (error) {
      console.error(
        "❌ [PUPPETEER] Error during testing:",
        (error as Error).message
      );
    } finally {
      await this.cleanup();
    }
  }

  // Override this method in the main script
  protected async runTests(page: Page): Promise<void> {
    // To be implemented by the main script
  }

  private async launchBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--allow-running-insecure-content",
      ],
    });
  }

  async createPage(): Promise<Page> {
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
    const cleanPath = this.examplePath.replace(/^\/+|\/+$/g, "");
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  async performInteractiveTests(page: Page): Promise<void> {
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

      // Click on the third chip (index 2) to test page 3
      const targetChip = chips[2];
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
        }, 2);

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
    const scrollbarTrack = await page.$(".mtrl-viewport-scrollbar");
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
      await new Promise((resolve) => setTimeout(resolve, 800));

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

      // Test scrollbar dragging
      console.log("🎯 [INTERACTION] Testing scrollbar drag...");
      const scrollbarThumb = await page.$(".mtrl-viewport-scrollbar-thumb");
      if (scrollbarThumb) {
        const thumbBox = await scrollbarThumb.boundingBox();
        if (thumbBox) {
          // Record initial scroll position
          const initialScrollPos = await page.evaluate(() => {
            const firstItem = document.querySelector(
              ".mtrl-viewport-items > :first-child"
            ) as HTMLElement;
            if (firstItem && firstItem.style.transform) {
              const match = firstItem.style.transform.match(
                /translateY\(([-\d.]+)px\)/
              );
              return match ? parseFloat(match[1]) : 0;
            }
            return 0;
          });

          console.log(
            `📍 [INTERACTION] Initial scroll position: ${initialScrollPos}`
          );

          // Drag the thumb down
          const startY = thumbBox.y + thumbBox.height / 2;
          const endY = startY + 100;

          await page.mouse.move(thumbBox.x + thumbBox.width / 2, startY);
          await page.mouse.down();
          await page.mouse.move(thumbBox.x + thumbBox.width / 2, endY, {
            steps: 10,
          });
          await page.mouse.up();

          // Check new scroll position
          const newScrollPos = await page.evaluate(() => {
            const firstItem = document.querySelector(
              ".mtrl-viewport-items > :first-child"
            ) as HTMLElement;
            if (firstItem && firstItem.style.transform) {
              const match = firstItem.style.transform.match(
                /translateY\(([-\d.]+)px\)/
              );
              return match ? parseFloat(match[1]) : 0;
            }
            return 0;
          });

          console.log(`📍 [INTERACTION] New scroll position: ${newScrollPos}`);

          if (Math.abs(newScrollPos) > Math.abs(initialScrollPos)) {
            console.log("✅ [INTERACTION] Scrollbar drag working correctly!");
          } else {
            console.log("❌ [INTERACTION] Scrollbar drag not working");
          }

          // Test velocity-based loading
          console.log(
            "\n🏃 [VELOCITY] Testing fast scrolling to trigger load cancellation..."
          );

          // Setup console log capture
          await page.evaluateOnNewDocument(() => {
            (window as any).velocityLogs = [];
            const originalLog = console.log;
            console.log = (...args) => {
              const message = args.join(" ");
              if (
                message.includes("[LOADING]") ||
                message.includes("velocity") ||
                message.includes("cancelled")
              ) {
                (window as any).velocityLogs.push(message);
              }
              originalLog.apply(console, args);
            };
          });

          // Fast drag test
          const currentThumbBox = await scrollbarThumb.boundingBox();
          if (currentThumbBox) {
            await page.mouse.move(
              currentThumbBox.x + currentThumbBox.width / 2,
              currentThumbBox.y + currentThumbBox.height / 2
            );
            await page.mouse.down();
            // Very fast drag
            await page.mouse.move(
              currentThumbBox.x + currentThumbBox.width / 2,
              currentThumbBox.y + 300,
              { steps: 2 }
            );
            await page.mouse.up();

            await new Promise((resolve) => setTimeout(resolve, 200));

            // Check for velocity logs
            const velocityLogs = await page.evaluate(
              () => (window as any).velocityLogs || []
            );
            console.log("📊 [VELOCITY] Captured velocity logs:", velocityLogs);

            if (velocityLogs.some((log: string) => log.includes("cancelled"))) {
              console.log("✅ [VELOCITY] Load cancellation working!");
            } else {
              console.log("⚠️ [VELOCITY] No load cancellation detected");
            }
          }
        }
      } else {
        console.log("❌ [INTERACTION] Scrollbar thumb not found");
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
      const listItemsContainer = document.querySelector(".mtrl-viewport-items");
      const listItems = listItemsContainer?.children || [];
      const listComponent = document.querySelector(".mtrl-vlist");

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
      const scrollbarTrack = document.querySelector(".mtrl-viewport-scrollbar");
      const scrollbarThumb = document.querySelector(
        ".mtrl-viewport-scrollbar-thumb"
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

        // General component detection
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

  // Getters for subclasses
  get interactive(): boolean {
    return this.isInteractive;
  }

  get logs(): string[] {
    return this.consoleLogs;
  }
}
