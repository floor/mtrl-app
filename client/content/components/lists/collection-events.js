import { createComponentSection } from "../../../layout";
import {
  createLayout,
  createList,
  createButton,
  COLLECTION_EVENTS,
} from "mtrl";

export const initCollectionEvents = (container) => {
  const title = "Collection Change Events";
  const layout = createLayout(
    createComponentSection({ title }),
    container
  ).component;

  console.log("Creating collection events demo...");

  // Create event log display
  const eventLog = document.createElement("div");
  eventLog.className = "collection-event-log";
  eventLog.style.cssText = `
    margin-bottom: 20px;
    padding: 16px;
    background: var(--md-sys-color-surface-variant);
    border-radius: 8px;
    max-height: 300px;
    overflow-y: auto;
  `;
  eventLog.innerHTML = "<h4>Collection Events Log:</h4>";

  // Create event counters display
  const eventCounters = document.createElement("div");
  eventCounters.className = "event-counters";
  eventCounters.style.cssText = `
    margin-bottom: 20px;
    padding: 16px;
    background: var(--md-sys-color-tertiary-container);
    border-radius: 8px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  `;

  const counters = {
    [COLLECTION_EVENTS.CHANGE]: 0,
    [COLLECTION_EVENTS.ADD]: 0,
    [COLLECTION_EVENTS.UPDATE]: 0,
    [COLLECTION_EVENTS.REMOVE]: 0,
    [COLLECTION_EVENTS.LOADING]: 0,
    [COLLECTION_EVENTS.ERROR]: 0,
  };

  const updateCounters = () => {
    eventCounters.innerHTML = Object.entries(counters)
      .map(([event, count]) => {
        const color = {
          [COLLECTION_EVENTS.CHANGE]: "#2196F3",
          [COLLECTION_EVENTS.ADD]: "#4CAF50",
          [COLLECTION_EVENTS.UPDATE]: "#FF9800",
          [COLLECTION_EVENTS.REMOVE]: "#F44336",
          [COLLECTION_EVENTS.LOADING]: "#9C27B0",
          [COLLECTION_EVENTS.ERROR]: "#E91E63",
        }[event];

        return `
          <div style="
            background: ${color}20;
            color: ${color};
            padding: 8px 12px;
            border-radius: 4px;
            border-left: 4px solid ${color};
          ">
            <strong>${event.toUpperCase()}:</strong> ${count}
          </div>
        `;
      })
      .join("");
  };

  updateCounters();

  // Create list with static data to demonstrate collection events
  const userList = createList({
    // Explicitly disable API mode for static demo
    baseUrl: null,
    collection: null,
    // Use static items instead of API for demo
    items: Array.from({ length: 50 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      company: { name: `Company ${Math.floor(i / 5) + 1}` },
    })),
    transform: (user) => ({
      id: user.id.toString(),
      headline: user.name,
      supportingText: user.email,
      meta: user.company?.name || "No company",
    }),
    renderItem: (user, index) => {
      const element = document.createElement("div");
      element.className = "user-item";
      element.setAttribute("data-id", user.id);
      element.style.cssText = `
        padding: 16px;
        border-bottom: 1px solid var(--md-sys-color-outline-variant);
        cursor: pointer;
        transition: background-color 0.2s ease;
      `;

      element.innerHTML = `
        <div class="user-headline" style="font-weight: 500; font-size: 16px; margin-bottom: 4px;">
          ${user.headline}
        </div>
        <div class="user-supporting" style="color: var(--md-sys-color-on-surface-variant); font-size: 14px; margin-bottom: 4px;">
          ${user.supportingText}
        </div>
        <div class="user-meta" style="color: var(--md-sys-color-primary); font-size: 12px;">
          ${user.meta}
        </div>
      `;

      element.addEventListener("mouseenter", () => {
        element.style.backgroundColor = "var(--md-sys-color-surface-variant)";
      });

      element.addEventListener("mouseleave", () => {
        element.style.backgroundColor = "transparent";
      });

      return element;
    },
    itemHeight: 80,
  });

  // Function to log events
  const logEvent = (eventType, eventData) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement("div");
    logEntry.className = `event-entry event-entry--${eventType}`;

    const color =
      {
        [COLLECTION_EVENTS.CHANGE]: "#2196F3",
        [COLLECTION_EVENTS.ADD]: "#4CAF50",
        [COLLECTION_EVENTS.UPDATE]: "#FF9800",
        [COLLECTION_EVENTS.REMOVE]: "#F44336",
        [COLLECTION_EVENTS.LOADING]: "#9C27B0",
        [COLLECTION_EVENTS.ERROR]: "#E91E63",
      }[eventType] || "#666";

    logEntry.style.cssText = `
      padding: 8px 12px;
      margin: 4px 0;
      border-left: 4px solid ${color};
      background: ${color}10;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    `;

    let dataInfo = "";
    if (
      eventType === COLLECTION_EVENTS.ADD ||
      eventType === COLLECTION_EVENTS.UPDATE
    ) {
      dataInfo = Array.isArray(eventData)
        ? `${eventData.length} items`
        : "1 item";
    } else if (eventType === COLLECTION_EVENTS.REMOVE) {
      dataInfo = Array.isArray(eventData)
        ? `${eventData.length} items`
        : "1 item";
    } else if (eventType === COLLECTION_EVENTS.LOADING) {
      dataInfo = eventData ? "Loading started" : "Loading finished";
    } else if (eventType === COLLECTION_EVENTS.CHANGE) {
      dataInfo = `${Array.isArray(eventData) ? eventData.length : "N/A"} total items`;
    }

    logEntry.innerHTML = `
      <strong style="color: ${color};">[${timestamp}]</strong> 
      <strong>${eventType.toUpperCase()}</strong>: ${dataInfo}
    `;

    eventLog.appendChild(logEntry);

    // Keep only last 20 entries
    const entries = eventLog.getElementsByClassName("event-entry");
    if (entries.length > 20) {
      entries[0].remove();
    }

    // Auto-scroll to bottom
    eventLog.scrollTop = eventLog.scrollHeight;

    // Update counters
    counters[eventType]++;
    updateCounters();
  };

  // Subscribe to collection change events
  const unsubscribe = userList.onCollectionChange((event) => {
    console.log("Collection event received:", event);
    logEvent(event.type, event.data);
  });

  // Create control buttons
  const controlsContainer = document.createElement("div");
  controlsContainer.className = "collection-controls";
  controlsContainer.style.cssText = `
    margin-bottom: 20px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  `;

  // Collection manipulation buttons
  const collectionButtons = [
    { text: "Add Items", action: "add", variant: "filled" },
    { text: "Update Items", action: "update", variant: "outlined" },
    { text: "Remove Items", action: "remove", variant: "outlined" },
    { text: "Clear All", action: "clear", variant: "text" },
  ];

  collectionButtons.forEach(({ text, action, variant }) => {
    const button = createButton({
      text,
      variant,
      size: "small",
    });

    button.on("click", async () => {
      try {
        const collection = userList.getCollection();

        switch (action) {
          case "add":
            const newItems = Array.from({ length: 3 }, (_, i) => {
              const id = Date.now() + i;
              return {
                id: id.toString(),
                name: `New User ${id}`,
                email: `newuser${id}@example.com`,
                company: { name: "New Company" },
              };
            });
            console.log("Adding items...", newItems);
            await collection.add(newItems);
            break;

          case "update":
            const allItems = userList.getAllItems();
            if (allItems.length > 0) {
              const itemToUpdate = allItems[0];
              const updatedItem = {
                ...itemToUpdate,
                headline: `${itemToUpdate.headline} (Updated)`,
                meta: "Updated Company",
              };
              console.log("Updating item...", updatedItem);
              await collection.update([updatedItem]);
            }
            break;

          case "remove":
            const items = userList.getAllItems();
            if (items.length > 0) {
              const idsToRemove = items.slice(0, 2).map((item) => item.id);
              console.log("Removing items...", idsToRemove);
              await collection.remove(idsToRemove);
            }
            break;

          case "clear":
            console.log("Clearing all items...");
            collection.clear();
            break;
        }
      } catch (error) {
        console.error("Error:", error);
        logEvent(COLLECTION_EVENTS.ERROR, error);
      }
    });

    controlsContainer.appendChild(button.element);
  });

  // Clear log button
  const clearLogButton = createButton({
    text: "Clear Log",
    variant: "text",
    size: "small",
  });

  clearLogButton.on("click", () => {
    const entries = eventLog.getElementsByClassName("event-entry");
    while (entries.length > 0) {
      entries[0].remove();
    }

    // Reset counters
    Object.keys(counters).forEach((key) => {
      counters[key] = 0;
    });
    updateCounters();
  });

  controlsContainer.appendChild(clearLogButton.element);

  // Create info section
  const infoSection = document.createElement("div");
  infoSection.className = "collection-info";
  infoSection.style.cssText = `
    margin-bottom: 20px;
    padding: 16px;
    background: var(--md-sys-color-primary-container);
    border-radius: 8px;
    color: var(--md-sys-color-on-primary-container);
  `;

  infoSection.innerHTML = `
    <h4 style="margin: 0 0 12px 0;">Collection Events Demo</h4>
    <p style="margin: 0 0 8px 0;">
      This demo shows all collection events that fire when data changes. 
      Try adding, updating, or removing items to see the events in action.
    </p>
    <p style="margin: 0; font-size: 14px; opacity: 0.8;">
      <strong>Available Events:</strong> 
      ${Object.values(COLLECTION_EVENTS).join(", ")}
    </p>
  `;

  // Create collection stats display
  const statsDisplay = document.createElement("div");
  statsDisplay.className = "collection-stats";
  statsDisplay.style.cssText = `
    margin-top: 20px;
    padding: 16px;
    background: var(--md-sys-color-surface-variant);
    border-radius: 8px;
  `;

  const updateStats = () => {
    const collection = userList.getCollection();
    const allItems = userList.getAllItems();
    const visibleItems = userList.getVisibleItems();

    statsDisplay.innerHTML = `
      <h4 style="margin: 0 0 12px 0;">Collection Statistics</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; font-size: 14px;">
        <div><strong>Total Items:</strong> ${allItems.length}</div>
        <div><strong>Visible Items:</strong> ${visibleItems.length}</div>
        <div><strong>Collection Size:</strong> ${collection.getSize()}</div>
        <div><strong>Loading:</strong> ${userList.isLoading() ? "Yes" : "No"}</div>
        <div><strong>Has Next:</strong> ${userList.hasNextPage() ? "Yes" : "No"}</div>
        <div><strong>API Mode:</strong> ${userList.isApiMode() ? "Yes" : "No"}</div>
      </div>
    `;
  };

  // Update stats periodically
  setInterval(updateStats, 1000);
  updateStats();

  // Add everything to layout
  layout.info.appendChild(infoSection);
  layout.info.appendChild(eventCounters);
  layout.info.appendChild(controlsContainer);
  layout.info.appendChild(eventLog);
  layout.showcase.appendChild(userList.element);
  layout.info.appendChild(statsDisplay);

  // Static items are already loaded, no need to call loadPage

  // Cleanup function (optional)
  return () => {
    unsubscribe();
  };
};
