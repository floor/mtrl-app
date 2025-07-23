#!/usr/bin/env bun

/**
 * VList component testing script using Puppeteer
 * Usage: bun run debug:vlist
 * Usage: bun run debug:vlist:interactive
 */

import { PuppeteerTester } from "./utils/puppeteer-base";
import { testIndexChipsClick } from "./tests/scroll-tests";
import { testPlaceholderSystem } from "./tests/placeholder-test";
import { testScrollToPageAPI } from "./tests/scroll-to-page-test";
import {
  testScrollToPageAPI as testScrollToPageAPIFromApiTests,
  testServerStopStartScenario,
} from "./tests/api-tests";
import { debugViewportStructure } from "./tests/debug-helpers";
import {
  testRequestQueueing,
  testMemoryPerformance,
} from "./tests/performance-tests";

/**
 * Custom VList tester that extends the base PuppeteerTester
 */
class VListTester extends PuppeteerTester {
  protected async runTests(page: any): Promise<void> {
    if (this.interactive) {
      await this.performInteractiveTests(page);
      // Also run the fast scroll test in interactive mode
      // await testFastMouseWheelScrolling(page); // Disabled - focusing on other issues
      // await testRequestQueueing(page); // Disabled - focusing on scrollToIndex
    } else {
      await this.performInteractiveTests(page);
    }

    // Test mouse wheel scrolling with content verification
    // await testMouseWheelScrollingWithContentCheck(page); // Disabled - focusing on scrollToIndex

    // Debug viewport structure
    // await debugViewportStructure(page); // Disabled - focusing on scrollToIndex

    // Test mouse wheel scrolling behavior
    // await testMouseWheelScrolling(page); // Disabled - focusing on scrollToIndex

    // Debug deferred cleanup behavior
    // await debugDeferredCleanup(page); // Disabled - focusing on scrollToIndex

    // Test backward scrolling for overlaps
    // await testBackwardScrolling(page); // Disabled - not focusing on overlaps now

    // Test server stop/start scenario
    // await testServerStopStartScenario(page); // Disabled - stops/starts server

    // Test gap issue specifically
    // await testGapIssue(page); // Disabled - stops/starts server

    // Test scroll functions
    // await testScrollFunctions(page); // Disabled - focusing on scrollToIndex

    // Test index chips clicking - FOCUS ON THIS
    await testIndexChipsClick(page);
    await testPlaceholderSystem(page);
    await testScrollToPageAPI(page);

    // Debug loaded ranges
    // await debugLoadedRanges(page); // Disabled - focusing on scrollToIndex

    // Test fast scrolling
    // await testFastScrolling(page); // Disabled - focusing on other issues

    // Performance tests (optional - can be enabled for performance testing)
    if (process.env.PERF_TEST === "true") {
      // await testMemoryPerformance(page); // Disabled - focusing on scrollToIndex
      // await testRenderingPerformance(page); // Disabled - focusing on scrollToIndex
      // await testElementRecycling(page); // Disabled - focusing on scrollToIndex
    }
  }
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      "❌ [PUPPETEER] Usage: bun run debug:vlist <example-path> [--interactive]"
    );
    console.log("📋 [PUPPETEER] Options:");
    console.log("   --interactive : Enable click testing");
    console.log("   PERF_TEST=true : Enable performance tests");
    process.exit(1);
  }

  // Get the example path from the first argument
  const examplePath = args.find((arg) => !arg.startsWith("--")) || args[0];
  const isInteractive = args.includes("--interactive");

  console.log(`🎯 [PUPPETEER] Testing VList example: ${examplePath}`);
  if (isInteractive) {
    console.log(
      "🎮 [PUPPETEER] Interactive mode: Will click on elements and track console logs"
    );
  }

  const tester = new VListTester(examplePath, isInteractive);
  await tester.test();
}

main().catch(console.error);
