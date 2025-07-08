import { createComponentSection } from "../../../layout";
import { createList, createButton } from "mtrl";
import { createLayout } from 'mtrl-addons';

export const initNavigationDebug = (container) => {
  const title = "Navigation Consistency Debug";
  const layout = createLayout(
    createComponentSection({ title }),
    container
  ).component;

  console.log("Creating navigation debug info...");

  // Create informational display
  const infoDisplay = document.createElement("div");
  infoDisplay.className = "navigation-debug-info";
  infoDisplay.style.cssText = `
    margin-bottom: 20px;
    padding: 20px;
    background: var(--md-sys-color-primary-container);
    border-radius: 8px;
    color: var(--md-sys-color-on-primary-container);
  `;

  infoDisplay.innerHTML = `
    <h4 style="margin: 0 0 16px 0;">🔍 Navigation Consistency Issue</h4>
    
    <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; margin: 16px 0;">
      <h5 style="margin: 0 0 8px 0;">🎯 The Problem:</h5>
      <p style="margin: 0;">
        <strong>Direct Navigation:</strong> <code>userList.loadPage(10)</code> goes directly to page 10<br>
        <strong>Sequential Navigation:</strong> Using <code>scrollNext()</code> 10 times should also reach page 10<br>
        <strong>Issue:</strong> These two methods arrive at different data/pages
      </p>
    </div>

    <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; margin: 16px 0;">
      <h5 style="margin: 0 0 8px 0;">🔧 How to Test:</h5>
      <ol style="margin: 8px 0; padding-left: 20px;">
        <li>Use the <strong>first list component</strong> above (the working API-connected one)</li>
        <li>Click <strong>"Page 10"</strong> button - note the items shown</li>
        <li>Click <strong>"Page 1"</strong> to reset</li>
        <li>Click <strong>"Next Page →"</strong> button 9 times to reach page 10</li>
        <li>Compare the items - they should be the same but might be different</li>
      </ol>
    </div>

    <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; margin: 16px 0;">
      <h5 style="margin: 0 0 8px 0;">🧐 What to Look For:</h5>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li><strong>Item IDs:</strong> First and last item IDs should be the same</li>
        <li><strong>Item Count:</strong> Both should show same number of items</li>
        <li><strong>Console Logs:</strong> Check browser console for navigation details</li>
        <li><strong>Debug Panel:</strong> Use the debug panel below the list to compare states</li>
      </ul>
    </div>
  `;

  // Create debugging tips
  const tipsDisplay = document.createElement("div");
  tipsDisplay.className = "navigation-debug-tips";
  tipsDisplay.style.cssText = `
    padding: 20px;
    background: var(--md-sys-color-secondary-container);
    border-radius: 8px;
    color: var(--md-sys-color-on-secondary-container);
  `;

  tipsDisplay.innerHTML = `
    <h4 style="margin: 0 0 16px 0;">💡 Debugging Tips</h4>
    
    <div style="margin: 16px 0;">
      <h5 style="margin: 0 0 8px 0;">Expected Behavior (Page 10 with pageSize 20):</h5>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li><strong>First Item ID:</strong> 181 (because (10-1) × 20 + 1 = 181)</li>
        <li><strong>Last Item ID:</strong> 200 (because 10 × 20 = 200)</li>
        <li><strong>Total Items:</strong> 20 items on the page</li>
      </ul>
    </div>

    <div style="margin: 16px 0;">
      <h5 style="margin: 0 0 8px 0;">Common Issues:</h5>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li><strong>State Corruption:</strong> Page number gets corrupted during sequential navigation</li>
        <li><strong>Collection Management:</strong> Items accumulate instead of replacing</li>
        <li><strong>Scroll Position:</strong> Virtual scrolling calculations differ between methods</li>
        <li><strong>Timing Issues:</strong> Async operations complete in different orders</li>
      </ul>
    </div>

    <div style="margin: 16px 0;">
      <h5 style="margin: 0 0 8px 0;">Console Commands for Manual Testing:</h5>
      <pre style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px; font-size: 12px; overflow-x: auto;">
// In browser console, find the list instance:
const userList = window.userListInstance; // (if exposed)

// Test direct navigation:
await userList.loadPage(10);
console.log('Direct:', userList.getAllItems().map(i => i.id));

// Reset and test sequential:
await userList.refresh();
for(let i = 1; i < 10; i++) await userList.scrollNext();
console.log('Sequential:', userList.getAllItems().map(i => i.id));
      </pre>
    </div>
  `;

  // Add the informational displays to layout
  layout.info.appendChild(infoDisplay);
  layout.showcase.appendChild(tipsDisplay);

  return () => {
    // No cleanup needed for informational component
  };
};
