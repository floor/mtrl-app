import { Page } from "puppeteer";

/**
 * Performance and stress tests for VList component
 */

/**
 * Test request queuing behavior during scrolling
 */
export async function testRequestQueueing(page: Page): Promise<void> {
  console.log("\n📊 [QUEUE-TEST] Testing request queuing behavior...");

  // Helper to get loading stats
  const getLoadingStats = () =>
    page.evaluate(() => {
      const list = document.querySelector(".mtrl-vlist") as any;

      // The collection stats are exposed on the component that has the collection feature
      // This could be the viewport component or a parent component
      const findComponentWithCollection = (obj: any): any => {
        if (obj?.collection?.getLoadingStats) {
          return obj.collection.getLoadingStats();
        }
        if (obj?.viewport) {
          return findComponentWithCollection(obj.viewport);
        }
        if (obj?.component) {
          return findComponentWithCollection(obj.component);
        }
        // Check if the element itself has been enhanced with collection
        if (obj?.getLoadingStats) {
          return obj.getLoadingStats();
        }
        return null;
      };

      return findComponentWithCollection(list);
    });

  // Set up console log listener to capture loading manager logs
  const logs: string[] = [];
  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("[LoadingManager]")) {
      logs.push(text);
    }
  });

  // Get initial loading stats
  const initialStats = await getLoadingStats();

  console.log("📊 [QUEUE-TEST] Initial stats:", initialStats);

  // Test 1: Slow scroll - should queue and execute requests
  console.log(
    "\n🐌 [QUEUE-TEST] Testing slow scroll (should queue requests)..."
  );

  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel({ deltaY: 100 });
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const slowScrollStats = await getLoadingStats();

  console.log("📊 [QUEUE-TEST] After slow scroll:", slowScrollStats);

  // Test 2: Fast scroll - should cancel requests
  console.log(
    "\n🚀 [QUEUE-TEST] Testing fast scroll (should cancel requests)..."
  );

  logs.length = 0; // Clear logs

  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel({ deltaY: 500 });
    await new Promise((resolve) => setTimeout(resolve, 10)); // Very short delay
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  const fastScrollStats = await getLoadingStats();

  console.log("📊 [QUEUE-TEST] After fast scroll:", fastScrollStats);

  // Check for cancelled loads in logs
  const cancelledLogs = logs.filter((log) => log.includes("Load cancelled"));
  console.log(`📊 [QUEUE-TEST] Cancelled requests: ${cancelledLogs.length}`);

  if (cancelledLogs.length > 0) {
    console.log(
      "✅ [QUEUE-TEST] Velocity threshold working - requests cancelled during fast scroll"
    );
  } else {
    console.log(
      "⚠️ [QUEUE-TEST] No cancelled requests detected during fast scroll"
    );
  }

  // Test 3: Wait for idle and check if queue processes
  console.log("\n⏸️ [QUEUE-TEST] Waiting for idle to process queue...");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const idleStats = await getLoadingStats();

  console.log("📊 [QUEUE-TEST] After idle:", idleStats);

  // Summary
  console.log("\n📋 [QUEUE-TEST] Summary:");
  console.log(`  - Completed requests: ${idleStats?.completedRequests || 0}`);
  console.log(`  - Failed requests: ${idleStats?.failedRequests || 0}`);
  console.log(`  - Cancelled requests: ${idleStats?.cancelledRequests || 0}`);
  console.log(
    `  - Current velocity: ${idleStats?.currentVelocity?.toFixed(2) || 0}`
  );
  console.log(`  - Can load: ${idleStats?.canLoad || false}`);
  console.log(`  - Queued requests: ${idleStats?.queuedRequests || 0}`);

  // Remove console listener
  page.removeAllListeners("console");
}

/**
 * Test memory usage and performance under stress
 */
export async function testMemoryPerformance(page: Page): Promise<void> {
  console.log("\n💾 [MEMORY-TEST] Testing memory performance...");

  // Get initial memory stats
  const getMemoryStats = async () => {
    return await page.evaluate(() => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        return {
          usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + " MB",
          totalJSHeapSize:
            (memory.totalJSHeapSize / 1048576).toFixed(2) + " MB",
          jsHeapSizeLimit:
            (memory.jsHeapSizeLimit / 1048576).toFixed(2) + " MB",
        };
      }
      return null;
    });
  };

  const initialMemory = await getMemoryStats();
  console.log("💾 [MEMORY-TEST] Initial memory:", initialMemory);

  // Perform intensive scrolling
  console.log("💾 [MEMORY-TEST] Performing intensive scrolling...");

  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel({ deltaY: 300 });
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const afterScrollMemory = await getMemoryStats();
  console.log("💾 [MEMORY-TEST] After scrolling:", afterScrollMemory);

  // Scroll back up
  console.log("💾 [MEMORY-TEST] Scrolling back up...");

  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel({ deltaY: -300 });
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Wait for cleanup
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const finalMemory = await getMemoryStats();
  console.log("💾 [MEMORY-TEST] Final memory after cleanup:", finalMemory);

  // Check DOM element count
  const domStats = await page.evaluate(() => {
    const viewportItems = document.querySelectorAll(".mtrl-viewport-item");
    const listItems = document.querySelectorAll(".list-item");
    const allElements = document.querySelectorAll("*");

    return {
      viewportItems: viewportItems.length,
      listItems: listItems.length,
      totalElements: allElements.length,
    };
  });

  console.log("💾 [MEMORY-TEST] DOM stats:", domStats);

  if (domStats.viewportItems > 100) {
    console.log(
      "⚠️ [MEMORY-TEST] High number of viewport items - possible memory leak"
    );
  } else {
    console.log("✅ [MEMORY-TEST] DOM element count is reasonable");
  }
}

/**
 * Test rendering performance metrics
 */
export async function testRenderingPerformance(page: Page): Promise<void> {
  console.log("\n🎨 [RENDER-TEST] Testing rendering performance...");

  // Enable performance tracking
  await page.evaluateOnNewDocument(() => {
    (window as any).renderMetrics = {
      frameCount: 0,
      frameTimes: [],
      lastFrameTime: performance.now(),
    };

    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function (callback) {
      return originalRAF.call(window, function (timestamp) {
        const metrics = (window as any).renderMetrics;
        if (metrics.lastFrameTime) {
          const frameTime = timestamp - metrics.lastFrameTime;
          metrics.frameTimes.push(frameTime);
          metrics.frameCount++;
        }
        metrics.lastFrameTime = timestamp;
        return callback(timestamp);
      });
    };
  });

  // Reload page to apply performance tracking
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Perform smooth scrolling
  console.log("🎨 [RENDER-TEST] Performing smooth scroll test...");

  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel({ deltaY: 50 });
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const metrics = (window as any).renderMetrics;
    if (!metrics || metrics.frameTimes.length === 0) {
      return null;
    }

    const frameTimes = metrics.frameTimes;
    const avgFrameTime =
      frameTimes.reduce((a: number, b: number) => a + b, 0) / frameTimes.length;
    const maxFrameTime = Math.max(...frameTimes);
    const minFrameTime = Math.min(...frameTimes);

    // Calculate FPS
    const fps = frameTimes.map((time: number) => 1000 / time);
    const avgFPS = fps.reduce((a, b) => a + b, 0) / fps.length;
    const minFPS = Math.min(...fps);

    // Count dropped frames (> 16.67ms for 60fps)
    const droppedFrames = frameTimes.filter(
      (time: number) => time > 16.67
    ).length;

    return {
      frameCount: metrics.frameCount,
      avgFrameTime: avgFrameTime.toFixed(2) + "ms",
      maxFrameTime: maxFrameTime.toFixed(2) + "ms",
      minFrameTime: minFrameTime.toFixed(2) + "ms",
      avgFPS: avgFPS.toFixed(1),
      minFPS: minFPS.toFixed(1),
      droppedFrames,
      droppedFramesPercent: ((droppedFrames / frameTimes.length) * 100).toFixed(
        1
      ),
    };
  });

  console.log("🎨 [RENDER-TEST] Performance metrics:", metrics);

  if (metrics) {
    if (parseFloat(metrics.avgFPS) >= 55) {
      console.log("✅ [RENDER-TEST] Excellent performance - near 60 FPS");
    } else if (parseFloat(metrics.avgFPS) >= 30) {
      console.log("⚠️ [RENDER-TEST] Acceptable performance - above 30 FPS");
    } else {
      console.log("❌ [RENDER-TEST] Poor performance - below 30 FPS");
    }

    if (parseFloat(metrics.droppedFramesPercent) > 10) {
      console.log(
        `⚠️ [RENDER-TEST] High number of dropped frames: ${metrics.droppedFramesPercent}%`
      );
    }
  }
}

/**
 * Test element recycling efficiency
 */
export async function testElementRecycling(page: Page): Promise<void> {
  console.log("\n♻️ [RECYCLE-TEST] Testing element recycling...");

  // Track element creation and recycling
  await page.evaluateOnNewDocument(() => {
    (window as any).recycleStats = {
      created: 0,
      recycled: 0,
      poolSize: 0,
    };
  });

  // Reload to apply tracking
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Monitor console logs for recycling stats
  const recycleLogs: string[] = [];
  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("Pool stats")) {
      recycleLogs.push(text);
    }
  });

  // Perform scrolling to trigger recycling
  console.log("♻️ [RECYCLE-TEST] Scrolling to trigger element recycling...");

  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel({ deltaY: 200 });
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  // Analyze recycling logs
  console.log(
    `♻️ [RECYCLE-TEST] Captured ${recycleLogs.length} recycling logs`
  );

  if (recycleLogs.length > 0) {
    // Parse the last log for stats
    const lastLog = recycleLogs[recycleLogs.length - 1];
    const createdMatch = lastLog.match(/Created: (\d+)/);
    const recycledMatch = lastLog.match(/Recycled: (\d+)/);
    const poolSizeMatch = lastLog.match(/Pool size: (\d+)/);

    if (createdMatch && recycledMatch) {
      const created = parseInt(createdMatch[1]);
      const recycled = parseInt(recycledMatch[1]);
      const poolSize = poolSizeMatch ? parseInt(poolSizeMatch[1]) : 0;

      console.log("♻️ [RECYCLE-TEST] Final stats:");
      console.log(`  - Elements created: ${created}`);
      console.log(`  - Elements recycled: ${recycled}`);
      console.log(`  - Current pool size: ${poolSize}`);

      const recycleRate =
        recycled > 0 ? (recycled / (created + recycled)) * 100 : 0;
      console.log(`  - Recycle rate: ${recycleRate.toFixed(1)}%`);

      if (recycleRate > 50) {
        console.log("✅ [RECYCLE-TEST] Good recycling efficiency");
      } else if (recycleRate > 20) {
        console.log("⚠️ [RECYCLE-TEST] Moderate recycling efficiency");
      } else {
        console.log("❌ [RECYCLE-TEST] Poor recycling efficiency");
      }
    }
  } else {
    console.log("⚠️ [RECYCLE-TEST] No recycling stats captured");
  }

  // Remove console listener
  page.removeAllListeners("console");
}
