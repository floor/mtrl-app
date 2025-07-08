// client/content/components/lists/users.js
import { createComponentSection } from "../../../layout";
import { createList } from "mtrl";
import { createLayout } from 'mtrl-addons';

export const initUsersList = (container) => {
  const title = "API Users List with Page Events";
  const layout = createLayout(
    createComponentSection({ title }),
    container
  ).component;
  console.log("Creating users list with page change events...");

  // Create current page display
  const currentPageDisplay = document.createElement("div");
  currentPageDisplay.className = "current-page-display";
  currentPageDisplay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  `;
  currentPageDisplay.textContent = "Current Page: 1";
  document.body.appendChild(currentPageDisplay);

  // Create page change log
  const pageChangeLog = document.createElement("div");
  pageChangeLog.className = "page-change-log";
  pageChangeLog.style.cssText = `
    margin-top: 16px;
    padding: 16px;
    background: var(--md-sys-color-surface-variant);
    border-radius: 8px;
    max-height: 200px;
    overflow-y: auto;
  `;
  pageChangeLog.innerHTML = "<h4>Page Change Events:</h4>";

  // Add log entry helper
  const addLogEntry = (message, type = "info") => {
    const entry = document.createElement("div");
    entry.className = `log-entry log-entry--${type}`;
    entry.style.cssText = `
      margin: 4px 0;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9em;
      background: ${type === "navigation" ? "var(--md-sys-color-primary-container)" : "var(--md-sys-color-secondary-container)"};
      color: ${type === "navigation" ? "var(--md-sys-color-on-primary-container)" : "var(--md-sys-color-on-secondary-container)"};
    `;
    entry.textContent = message;
    pageChangeLog.appendChild(entry);
    pageChangeLog.scrollTop = pageChangeLog.scrollHeight;
  };

  // Create the API-connected list
  const userList = createList({
    collection: "users", // This should create a '/api/users' endpoint
    baseUrl: "/api", // Using relative URL - our fixed adapter will handle this properly
    class: "list--users",
    itemHeight: 84,
    pageSize: 20,
    scrollStrategy: "hybrid",

    // Use page-based pagination for events
    pagination: {
      strategy: "page",
    },

    // Configure adapter to properly handle the response
    adapter: {
      parseResponse: (response) => {
        // Safely extract data and pagination info with fallbacks
        const items = response?.data || [];
        const pagination = response?.pagination || {};

        return {
          items,
          meta: {
            page: pagination.page || 1,
            hasNext: Boolean(pagination.hasNext),
            total: pagination.total,
          },
        };
      },
    },

    // Transform function for individual items - this gets called for each item
    transform: (user) => {
      // Make sure we have a valid user object
      if (!user || typeof user !== "object") {
        console.error("Invalid user object received in transform:", user);
        return {
          id: "error-" + Date.now() + Math.random(),
          headline: "Error: Invalid User",
          supportingText: "",
          meta: "",
        };
      }

      // Transform an individual user into the required format
      return {
        id: user.id || user._id || String(Math.random()),
        headline: user.name || "Unknown User",
        supportingText: user.email || "",
        meta: user.role || "",
        avatar: user.avatar || "",
        // Keep original data accessible
        original: user,
      };
    },

    // Render function to display each item
    renderItem: (user, index) => {
      const element = document.createElement("div");
      element.className = "mtrl-list-item user-item";
      element.setAttribute("data-id", user.id);
      element.innerHTML = `
        <div class="user-avatar">${user.avatar || user.headline?.charAt(0) || "?"}</div>
        <div class="user-details">
          <div class="user-name">${user.headline || "Unknown"}</div>
          <div class="user-email">${user.supportingText || ""}</div>
          <div class="user-role">${user.meta || ""}</div>
        </div>
      `;
      return element;
    },
  });

  // Subscribe to page change events
  const unsubscribePageChange = userList.list.onPageChange((event, data) => {
    console.log(`📢 Page changed via ${data.trigger}:`, data);

    // Update current page display
    currentPageDisplay.textContent = `Current Page: ${data.page}`;

    // Add to log
    const trigger =
      data.trigger === "navigation" ? "🎯 Navigation" : "📜 Scroll";
    const message = `${trigger}: Page ${data.previousPage || "?"} → ${data.page} (scroll: ${Math.round(data.scrollPosition)}px)`;
    addLogEntry(message, data.trigger);
  });

  // Navigation buttons for testing
  const navButtons = document.createElement("div");
  navButtons.className = "page-navigation";
  navButtons.style.cssText = `
    margin-top: 16px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `;

  const createNavButton = (text, page) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className = "mtrl-button mtrl-button--filled";
    btn.onclick = () => {
      console.log(`Navigating to page ${page}...`);
      userList.list.loadPage(page);
    };
    return btn;
  };

  navButtons.appendChild(createNavButton("Page 1", 1));
  navButtons.appendChild(createNavButton("Page 5", 5));
  navButtons.appendChild(createNavButton("Page 10", 10));
  navButtons.appendChild(createNavButton("Page 100", 100));

  // Sequential navigation buttons
  const prevPageBtn = document.createElement("button");
  prevPageBtn.textContent = "← Prev Page";
  prevPageBtn.className = "mtrl-button mtrl-button--outlined";
  prevPageBtn.onclick = () => {
    console.log("Using scrollPrevious...");
    userList.list.scrollPrevious();
  };
  navButtons.appendChild(prevPageBtn);

  const nextPageBtn = document.createElement("button");
  nextPageBtn.textContent = "Next Page →";
  nextPageBtn.className = "mtrl-button mtrl-button--outlined";
  nextPageBtn.onclick = () => {
    console.log("Using scrollNext...");
    userList.list.scrollNext();
  };
  navButtons.appendChild(nextPageBtn);

  // Current page checker button
  const currentPageBtn = document.createElement("button");
  currentPageBtn.textContent = "Get Current Page";
  currentPageBtn.className = "mtrl-button mtrl-button--outlined";
  currentPageBtn.onclick = () => {
    const currentPage = userList.list.getCurrentPage();
    addLogEntry(`Current page from API: ${currentPage}`, "info");
  };
  navButtons.appendChild(currentPageBtn);

  // Event listeners
  userList.on("load", (event) => {
    console.log("List loaded:", event);
  });

  userList.on("select", (event) => {
    console.log("Selected user:", event.item);
  });

  // Error handling
  userList.on("error", (event) => {
    console.error("List error:", event.error);
  });

  // Cleanup on destroy
  const originalDestroy = userList.destroy || (() => {});
  userList.destroy = () => {
    unsubscribePageChange();
    if (currentPageDisplay.parentNode) {
      currentPageDisplay.parentNode.removeChild(currentPageDisplay);
    }
    originalDestroy();
  };

  layout.showcase.appendChild(userList.element);
  layout.showcase.appendChild(navButtons);
  layout.showcase.appendChild(pageChangeLog);
  console.log("User list with page events appended to layout");

  return {
    layout,
    userList,
  };
};
