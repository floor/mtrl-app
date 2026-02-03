// src/scripts/debug/tests/selection-test.ts

import { Page } from "puppeteer";

// Helper to get userList from page
async function getUserList(page: Page) {
  return page.evaluate(() => {
    const listExample = (window as any).listExample;
    return listExample?.listComponent?.userList || listExample?.userList;
  });
}

export async function testSelectionFeature(page: Page): Promise<void> {
  console.log("\n🔍 Testing VList Selection Feature...");

  // Wait for initial load
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check for BEM modifier classes
  console.log("\n📋 Test 0: BEM Modifier Classes");
  const containerClasses = await page.evaluate(() => {
    const container = document.querySelector(".mtrl-vlist");
    return {
      exists: !!container,
      classes: container?.className || "",
      hasSelectionModifier: container?.classList.contains(
        "mtrl-vlist--selection"
      ),
      hasSelectionModeModifier:
        container?.classList.contains("mtrl-vlist--selection-multiple") ||
        container?.classList.contains("mtrl-vlist--selection-single"),
    };
  });

  console.log("Container exists:", containerClasses.exists);
  console.log("Container classes:", containerClasses.classes);
  console.log("Has selection modifier:", containerClasses.hasSelectionModifier);
  console.log(
    "Has selection mode modifier:",
    containerClasses.hasSelectionModeModifier
  );

  // Wait for userList to be available
  let hasSelection;
  for (let i = 0; i < 10; i++) {
    hasSelection = await page.evaluate(() => {
      const listExample = (window as any).listExample;
      const userList =
        listExample?.listComponent?.userList || listExample?.userList;

      // Debug log to see what's available
      if (userList) {
        console.log(
          "📊 UserList methods:",
          Object.getOwnPropertyNames(userList).filter(
            (m) => typeof userList[m] === "function"
          )
        );
      }

      return {
        hasListExample: !!listExample,
        exists: !!userList,
        hasSelectItems: typeof userList?.selectItems === "function",
        hasGetSelectedItems: typeof userList?.getSelectedItems === "function",
        hasClearSelection: typeof userList?.clearSelection === "function",
        selectionEnabled: userList?.config?.selection?.enabled,
        selectionMode: userList?.config?.selection?.mode,
      };
    });

    if (hasSelection.exists) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("📊 Selection API availability:", hasSelection);

  if (!hasSelection.hasSelectItems) {
    console.log("❌ Selection API not available on VList");
    return;
  }

  // Test 1: Programmatic selection
  console.log("\n📌 Test 1: Programmatic selection of items [0, 1, 2]");
  await page.evaluate(() => {
    const listExample = (window as any).listExample;
    const userList =
      listExample?.listComponent?.userList || listExample?.userList;
    if (userList?.selectItems) {
      try {
        console.log("📊 Calling selectItems([0, 1, 2])");
        userList.selectItems([0, 1, 2]);
      } catch (error) {
        console.error("❌ Error in selectItems:", error);
        console.error("Stack:", error.stack);
      }
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  const programmaticResult = await page.evaluate(() => {
    const listExample = (window as any).listExample;
    const userList =
      listExample?.listComponent?.userList || listExample?.userList;
    const selectedItems = userList?.getSelectedItems
      ? userList.getSelectedItems()
      : [];
    const selectedIndices = userList?.getSelectedIndices
      ? userList.getSelectedIndices()
      : [];
    const selectedElements = document.querySelectorAll(
      ".mtrl-list-item--selected"
    );

    return {
      selectedCount: selectedItems.length,
      selectedIndices,
      selectedElementCount: selectedElements.length,
      firstSelectedName: selectedItems[0]?.name,
    };
  });

  console.log("✅ Programmatic selection result:", programmaticResult);

  // Test 2: Click selection
  console.log("\n📌 Test 2: Click selection on first visible item");

  // Clear selection first
  await page.evaluate(() => {
    const listExample = (window as any).listExample;
    const userList =
      listExample?.listComponent?.userList || listExample?.userList;
    if (userList?.clearSelection) {
      userList.clearSelection();
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Click on the first visible item
  const clickable = await page.$(".mtrl-viewport-item:first-child .user-item");
  if (clickable) {
    await clickable.click();
    console.log("🖱️ Clicked on first item");
  } else {
    console.log("❌ Could not find clickable item");
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const clickResult = await page.evaluate(() => {
    const listExample = (window as any).listExample;
    const userList =
      listExample?.listComponent?.userList || listExample?.userList;
    const selectedItems = userList?.getSelectedItems
      ? userList.getSelectedItems()
      : [];
    const selectedElements = document.querySelectorAll(
      ".mtrl-list-item--selected"
    );

    return {
      selectedCount: selectedItems.length,
      selectedElementCount: selectedElements.length,
      selectedNames: selectedItems.map((item: any) => item.name),
    };
  });

  console.log("✅ Click selection result:", clickResult);

  // Test 2.5: Test toggle without modifiers (if multi-select and requireModifiers is false)
  const isMultiSelect = hasSelection.selectionMode === "multiple";
  if (isMultiSelect) {
    console.log("\n📌 Test 2.5: Toggle selection without modifiers");

    // First, select the first item programmatically to ensure it's selected
    await page.evaluate(() => {
      const listExample = (window as any).listExample;
      const userList =
        listExample?.listComponent?.userList || listExample?.userList;
      if (userList?.selectItems) {
        userList.selectItems([0]);
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Check if click handler is attached
    const hasClickHandler = await page.evaluate(() => {
      const listExample = (window as any).listExample;
      const userList =
        listExample?.listComponent?.userList || listExample?.userList;
      const element = userList?.element;
      return {
        hasElement: !!element,
        elementClass: element?.className,
        itemCount: element?.querySelectorAll(".mtrl-viewport-item").length,
      };
    });
    console.log("🔍 Click handler check:", hasClickHandler);

    // Click on first item again to test toggle
    const firstItem = await page.$(
      ".mtrl-viewport-item:first-child .user-item"
    );
    if (firstItem) {
      // Force click in the center of the element
      const box = await firstItem.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        console.log("🖱️ Clicked on first item again (should toggle OFF)");
      } else {
        await firstItem.click();
        console.log("🖱️ Clicked on first item again using element.click()");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const toggleResult = await page.evaluate(() => {
        const listExample = (window as any).listExample;
        const userList =
          listExample?.listComponent?.userList || listExample?.userList;
        const selectedItems = userList?.getSelectedItems
          ? userList.getSelectedItems()
          : [];

        return {
          selectedCount: selectedItems.length,
          firstItemStillSelected: selectedItems.some(
            (item: any) => item.id === "1"
          ),
          requireModifiers: userList?.config?.selection?.requireModifiers,
          selectionConfig: userList?.config?.selection,
        };
      });

      console.log("✅ Toggle result:", toggleResult);

      // Click on second and third items to test multi-select without modifiers
      const secondItem = await page.$(
        ".mtrl-viewport-item:nth-child(2) .user-item"
      );
      const thirdItem = await page.$(
        ".mtrl-viewport-item:nth-child(3) .user-item"
      );

      if (secondItem) {
        await secondItem.click();
        console.log("🖱️ Clicked on second item");
      }

      await new Promise((resolve) => setTimeout(resolve, 200));

      if (thirdItem) {
        await thirdItem.click();
        console.log("🖱️ Clicked on third item");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const multiToggleResult = await page.evaluate(() => {
        const listExample = (window as any).listExample;
        const userList =
          listExample?.listComponent?.userList || listExample?.userList;
        const selectedIndices = userList?.getSelectedIndices
          ? userList.getSelectedIndices()
          : [];

        return {
          selectedIndices,
          count: selectedIndices.length,
        };
      });

      console.log("✅ Multi-toggle result:", multiToggleResult);
    }
  }

  // Test 3: Select All functionality
  console.log("\n📌 Test 3: Select All button");

  const selectAllButton = await page.$("button#select-all");
  if (selectAllButton) {
    await selectAllButton.click();
    console.log("🖱️ Clicked Select All button");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const selectAllResult = await page.evaluate(() => {
      const listExample = (window as any).listExample;
      const userList =
        listExample?.listComponent?.userList || listExample?.userList;
      const selectedItems = userList?.getSelectedItems
        ? userList.getSelectedItems()
        : [];
      const allItems = userList?.getItems ? userList.getItems() : [];

      return {
        selectedCount: selectedItems.length,
        totalItems: allItems.length,
        allSelected: selectedItems.length === allItems.length,
      };
    });

    console.log("✅ Select All result:", selectAllResult);
  } else {
    console.log("⚠️ Select All button not found");
  }

  // Test 4: Clear Selection
  console.log("\n📌 Test 4: Clear Selection button");

  const clearButton = await page.$("button#clear-selection");
  if (clearButton) {
    await clearButton.click();
    console.log("🖱️ Clicked Clear Selection button");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const clearResult = await page.evaluate(() => {
      const listExample = (window as any).listExample;
      const userList =
        listExample?.listComponent?.userList || listExample?.userList;
      const selectedItems = userList?.getSelectedItems
        ? userList.getSelectedItems()
        : [];
      const selectedElements = document.querySelectorAll(
        ".mtrl-list-item--selected"
      );

      return {
        selectedCount: selectedItems.length,
        selectedElementCount: selectedElements.length,
        isCleared: selectedItems.length === 0 && selectedElements.length === 0,
      };
    });

    console.log("✅ Clear Selection result:", clearResult);
  } else {
    console.log("⚠️ Clear Selection button not found");
  }

  // Test 5: Multiple clicks with shift/ctrl (if in multi-select mode)
  if (isMultiSelect) {
    console.log("\n📌 Test 5: Multi-select with keyboard modifiers");

    // First, scroll to top to ensure we're at the beginning
    await page.evaluate(() => {
      const listExample = (window as any).listExample;
      const userList =
        listExample?.listComponent?.userList || listExample?.userList;
      if (userList?.scrollToTop) {
        userList.scrollToTop();
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Select first item
    await page.evaluate(() => {
      const listExample = (window as any).listExample;
      const userList =
        listExample?.listComponent?.userList || listExample?.userList;
      if (userList?.selectItems) {
        userList.selectItems([0]);
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Shift+click on 5th item for range selection
    const fifthItem = await page.$(
      ".mtrl-viewport-item:nth-child(5) .user-item"
    );
    if (fifthItem) {
      await page.keyboard.down("Shift");
      await fifthItem.click();
      await page.keyboard.up("Shift");
      console.log("🖱️ Shift+clicked on 5th item");

      await new Promise((resolve) => setTimeout(resolve, 500));

      const rangeResult = await page.evaluate(() => {
        const listExample = (window as any).listExample;
        const userList =
          listExample?.listComponent?.userList || listExample?.userList;
        const selectedIndices = userList?.getSelectedIndices
          ? userList.getSelectedIndices()
          : [];

        return {
          selectedIndices,
          isRangeSelected:
            selectedIndices.length === 5 &&
            selectedIndices.every((idx: number, i: number) => idx === i),
        };
      });

      console.log("✅ Range selection result:", rangeResult);
    }
  } else {
    console.log("\n⚠️ Skipping multi-select tests (single selection mode)");
  }

  console.log("\n✅ Selection feature tests completed!");
}
