// Test for virtual positioning when jumping to pages
import { createComponentSection } from "../../../layout";
import { createLayout, createList } from "mtrl";

export const virtualPositioningTest = (container) => {
  const title = "Virtual Positioning Test";
  const description = "Test virtual positioning when jumping to pages";
  const layout = createLayout(
    createComponentSection({ title, description }),
    container
  ).component;

  console.log("Creating virtual positioning test...");

  // Create control panel
  const controlPanel = document.createElement("div");
  controlPanel.style.cssText = `
    margin-bottom: 20px;
    padding: 16px;
    background: var(--md-sys-color-surface-variant);
    border-radius: 8px;
  `;

  controlPanel.innerHTML = `
    <h4 style="margin: 0 0 16px 0;">Virtual Positioning Test</h4>
    <p style="margin: 0 0 8px 0;">This test uses <strong>1,000,000 mock users</strong> to verify that jumping to page 1000 shows the correct items at the correct virtual positions.</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: var(--md-sys-color-on-surface-variant);">
      <strong>Expected for Page 1000:</strong> Items 19,981-20,000 at scroll position ~959,040px
    </p>
    
    <div class="controls" style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
      <button id="jumpToPage1000" class="mtrl-button">Jump to Page 1000</button>
      <button id="jumpToPage1" class="mtrl-button">Jump to Page 1</button>
      <button id="jumpToPage500" class="mtrl-button">Jump to Page 500</button>
    </div>
    
    <div class="debug-info" style="background: rgba(0,0,0,0.05); padding: 12px; border-radius: 4px; font-family: monospace; font-size: 12px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px;">
      <div>Current Page: <span id="currentPage">1</span></div>
      <div>Expected Items: <span id="expectedItems">1-20</span></div>
      <div>Scroll Position: <span id="scrollPosition">0</span></div>
      <div>Virtual Offset: <span id="virtualOffset">0</span></div>
      <div>First Visible Item: <span id="firstVisibleItem">-</span></div>
      <div>Last Visible Item: <span id="lastVisibleItem">-</span></div>
      <div>Total Items: <span id="totalItems">1,000,000</span></div>
      <div>Expected Height: <span id="expectedHeight">48,000,000px</span></div>
    </div>
  `;

  // Create the list using the local API with 1,000,000 users
  const userList = createList({
    collection: "users", // This creates a '/api/users' endpoint
    baseUrl: "/api", // Using relative URL - our API handles this properly
    itemHeight: 48,
    pageSize: 20,
    pagination: {
      strategy: "page", // Use page strategy
      pageParamName: "page", // Parameter for page number
      perPageParamName: "limit", // Parameter for page size (not per_page)
      defaultPageSize: 20, // Items per page
    },
    // Transform function for individual items
    transform: (user) => ({
      id: user.id || String(Math.random()),
      headline: user.name || "Unknown User",
      supportingText: user.email || "",
      meta: user.role || "",
      avatar: user.avatar || "",
    }),
    renderItem: (item, index) => {
      const element = document.createElement("div");
      element.className = "mtrl-list-item";
      element.style.cssText = `
        padding: 12px;
        border-bottom: 1px solid var(--md-sys-color-outline-variant);
        background: var(--md-sys-color-surface);
        display: flex;
        align-items: center;
        gap: 12px;
      `;

      element.innerHTML = `
        <div style="font-weight: 500; color: var(--md-sys-color-primary); min-width: 80px;">
          ID: ${item.id}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 500; color: var(--md-sys-color-on-surface);">${item.headline}</div>
          <div style="color: var(--md-sys-color-on-surface-variant); font-size: 14px;">${item.supportingText}</div>
        </div>
        <div style="color: var(--md-sys-color-outline); font-size: 12px;">
          Index: ${index}
        </div>
        <div style="color: var(--md-sys-color-secondary); font-size: 11px;">
          ${item.meta}
        </div>
      `;

      return element;
    },
  });

  // Add elements to layout
  layout.info.appendChild(controlPanel);
  layout.showcase.appendChild(userList.element);

  // Get control elements
  const jumpToPage1000Btn = controlPanel.querySelector("#jumpToPage1000");
  const jumpToPage1Btn = controlPanel.querySelector("#jumpToPage1");
  const jumpToPage500Btn = controlPanel.querySelector("#jumpToPage500");

  const currentPageSpan = controlPanel.querySelector("#currentPage");
  const expectedItemsSpan = controlPanel.querySelector("#expectedItems");
  const scrollPositionSpan = controlPanel.querySelector("#scrollPosition");
  const virtualOffsetSpan = controlPanel.querySelector("#virtualOffset");
  const firstVisibleItemSpan = controlPanel.querySelector("#firstVisibleItem");
  const lastVisibleItemSpan = controlPanel.querySelector("#lastVisibleItem");

  // Update debug info
  const updateDebugInfo = () => {
    try {
      const currentPage = userList.getCurrentPage?.() || 1;
      const pageSize = 20;
      const expectedStart = (currentPage - 1) * pageSize + 1;
      const expectedEnd = currentPage * pageSize;

      currentPageSpan.textContent = currentPage;
      expectedItemsSpan.textContent = `${expectedStart}-${expectedEnd}`;
      scrollPositionSpan.textContent = Math.round(
        userList.element.scrollTop || 0
      );

      // Try to get virtual offset from list state (if available)
      if (
        userList.list &&
        userList.list.state &&
        userList.list.state.virtualOffset !== undefined
      ) {
        virtualOffsetSpan.textContent = userList.list.state.virtualOffset;
      }

      // Get first and last visible items
      const visibleItems = userList.element.querySelectorAll(".mtrl-list-item");
      if (visibleItems.length > 0) {
        const firstItem = visibleItems[0];
        const lastItem = visibleItems[visibleItems.length - 1];

        const firstId =
          firstItem.querySelector("div")?.textContent?.replace("ID: ", "") ||
          "-";
        const lastId =
          lastItem.querySelector("div")?.textContent?.replace("ID: ", "") ||
          "-";

        firstVisibleItemSpan.textContent = firstId;
        lastVisibleItemSpan.textContent = lastId;
      }
    } catch (error) {
      console.warn("Error updating debug info:", error);
    }
  };

  // Update debug info periodically
  const debugInterval = setInterval(updateDebugInfo, 500);

  // Event handlers
  jumpToPage1000Btn.addEventListener("click", async () => {
    console.log("🎯 [Test] Jumping to page 1000...");
    try {
      await userList.loadPage(1000);
      setTimeout(updateDebugInfo, 1000);
    } catch (error) {
      console.error("Error jumping to page 1000:", error);
    }
  });

  jumpToPage1Btn.addEventListener("click", async () => {
    console.log("🎯 [Test] Jumping to page 1...");
    try {
      await userList.loadPage(1);
      setTimeout(updateDebugInfo, 1000);
    } catch (error) {
      console.error("Error jumping to page 1:", error);
    }
  });

  jumpToPage500Btn.addEventListener("click", async () => {
    console.log("🎯 [Test] Jumping to page 500...");
    try {
      await userList.loadPage(500);
      setTimeout(updateDebugInfo, 1000);
    } catch (error) {
      console.error("Error jumping to page 500:", error);
    }
  });

  // Initial debug update
  setTimeout(updateDebugInfo, 1000);

  // Cleanup function
  return () => {
    clearInterval(debugInterval);
    if (userList.destroy) {
      userList.destroy();
    }
  };
};

// Export for use in the app
export default virtualPositioningTest;
