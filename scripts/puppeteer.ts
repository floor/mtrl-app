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

      // Find chip with data-value="2" (as requested by user)
      const targetChip = chipInfo.find((chip) => chip.dataValue === "2");

      if (targetChip) {
        console.log(
          `\n🎯 [INTERACTION] Clicking on chip with data-value="2" (index ${targetChip.index})`
        );
        console.log(
          `📝 [INTERACTION] Chip details: Selected=${targetChip.selected}, Text="${targetChip.text}"`
        );

        // Clear console logs before click
        const preClickLogCount = this.consoleLogs.length;
        console.log(
          `\n📊 [INTERACTION] Console logs before click: ${preClickLogCount}`
        );

        // Click the chip
        await chips[targetChip.index].click();

        // Wait for any async operations
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Report new console logs
        const postClickLogCount = this.consoleLogs.length;
        const newLogs = this.consoleLogs.slice(preClickLogCount);

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
        }, targetChip.index);

        console.log(`\n🔄 [INTERACTION] Chip state after click:`);
        console.log(`   Value: ${updatedChipInfo.dataValue}`);
        console.log(
          `   Selected: ${targetChip.selected} → ${updatedChipInfo.selected}`
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

    // Check for any ripple effects or animations
    const ripples = await page.$$(".mtrl-ripple");
    console.log(`✨ [INTERACTION] Found ${ripples.length} ripple elements`);

    console.log("✅ [INTERACTION] Interactive testing completed");
  }

  private async analyzeComponent(page: Page): Promise<ComponentInfo> {
    return await page.evaluate(() => {
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
