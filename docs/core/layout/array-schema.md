# Layout System Usage

The mtrl layout system provides a powerful array-based schema for creating complex, responsive layouts with automatic component management and retrieval.

## Overview

The layout system uses an array-based syntax that's fast and less verbose than object-based approaches. It automatically handles component creation, positioning, and provides easy access to components via identification strings.

## How Parameters Work

### createLayout Function Parameters

The `createLayout` function itself has **positional parameters**:

```javascript
createLayout(schema, parent);
```

- **First parameter**: Schema is required, can be array or object
- **Second parameter**: Parent container element (optional)

**Important**: If the second parameter is omitted, the layout won't be added to the DOM. It is created using document fragments, allowing you to manually append elements later.

### Usage Examples

**With parent container (automatic DOM insertion):**

```javascript
// Layout is automatically appended to the container
const layout = createLayout(
  [
    [createButton, "submit", { label: "Submit" }],
  ],
  containerElement
).component;
```

**Without parent container (manual DOM insertion):**

```javascript
// Layout is created as fragments, manual append needed
const layout = createLayout([
  [createButton, "submit", { label: "Submit" }],
]).component;

// Manually append to DOM when ready
document.body.appendChild(layout.element);
// or
someContainer.appendChild(layout.element);
```

**Use cases for omitting parent:**

- Creating reusable layout components
- Conditional rendering based on application state
- Building complex layouts that need to be inserted at specific times
- Testing layouts without DOM insertion

### Array Schema Parameters

Within the array schema, parameters are **type-detected**, not positional:

```javascript
[CreatorFunction, "identifier", OptionsObject];
```

### Schema Options

The `createLayout` function accepts different schema formats:

```javascript
// Array-based schema (recommended)
createLayout(
  [
    [createButton, "submit", { label: "Submit" }],
  ],
  containerElement
);

// Object-based schema (alternative)
createLayout(
  {
    // object configuration
  },
  containerElement
);
```

### Array Schema Formatting Conventions

The array-based schema follows specific formatting rules for optimal readability:

#### 1. One Array Per Line (Primary Rule)

Each array element should be on its own line with inline parameters:

```javascript
const form = createLayout(
  [[createTextfield, "email", { label: "Email", type: "email" }],
    [createTextfield, "password", { label: "Password", type: "password" }],
    [createButton, "submit", { label: "Submit", variant: "filled" }],
  ],
  containerElement
).component;
```

#### 2. Long Options Exception

When options become too long, you can exceptionally break them across multiple lines:

```javascript
const complexForm = createLayout(
  [[createTextfield, "email", { label: "Email", type: "email" }],
    [createButton, "submit", {
      label: "Submit Application",
      variant: "filled",
      size: "L",
      icon: submitIcon,
      disabled: false,
      class: "submit-button",
      styles: { marginTop: "20px" },
    }],
  ],
  containerElement
).component;
```

#### 3. Nested Structure Indentation

Child arrays are indented to show hierarchy:

```javascript
const nestedLayout = createLayout(
  [["container", { tag: "div", class: "wrapper" },
      ["header", { tag: "header", class: "header" },
        ["title", { tag: "h1", text: "Page Title" }],
        ["subtitle", { tag: "p", text: "Page description" }],
      ],
    ],
    ["main", { tag: "main", class: "content" },
      [createButton, "action", { label: "Primary Action" }],
    ],
  ],
  containerElement
).component;
```

#### 4. Section Comments

Use comments to separate logical sections:

```javascript
const userForm = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 4 } },
    // User Information
    [createTextfield, "firstName", { label: "First Name" }],
    [createTextfield, "lastName", { label: "Last Name" }],
    [createTextfield, "email", { label: "Email", type: "email" }],
    // Preferences
    [createSwitch, "notifications", { label: "Email Notifications" }],
    [createSwitch, "newsletter", { label: "Newsletter Subscription" }],
    // Actions
    [createButton, "save", { label: "Save Profile", variant: "filled" }],
  ],
  containerElement
).component;
```

These formatting conventions ensure that even complex layouts remain readable and maintainable.

### Parameter Detection

The layout system automatically detects parameter types based on their JavaScript type:

1. **Creator Function** (optional)

   - **Type**: Function (e.g., `createButton`, `createTextfield`)
   - **When provided**: Uses the specified mtrl component creator
   - **When omitted**: Automatically uses `createElement` for raw DOM elements

2. **Identifier String** (optional)

   - **Type**: String (e.g., `'submitBtn'`, `'userEmail'`)
   - **When provided**: Creates a named element accessible via `layout.elementName`
   - **When omitted**: Creates an anonymous element (cannot be retrieved later)

3. **Options Object** (optional)
   - **Type**: Object (e.g., `{ label: 'Submit', variant: 'filled' }`)
   - **Purpose**: Configuration for the element/component
   - **For raw DOM elements**: must include `tag` property to specify HTML tag

### How Detection Works

The system scans each array and identifies parameters by their JavaScript type:

- **Function found** → Creator function
- **String found** → Identifier
- **Object found** → Options
- **Missing types** → Use defaults (createElement for creator, anonymous for identifier)

### Key Rules

- **createLayout parameters**: POSITIONAL (schema first, then options)
- **Array schema parameters**: TYPE-DETECTED (Function → Creator, String → Identifier, Object → Options)
- **Order is flexible**: You can provide array parameters in any order within each array
- **Any parameter can be omitted**: The system detects what you provide
- **Anonymous elements**: Perfect for static content that doesn't need interaction
- **Named elements**: Essential for components you need to access later

### Quick Reference

| Parameters                                       | Detected As                | Result                   | Access             |
| ------------------------------------------------ | -------------------------- | ------------------------ | ------------------ |
| `[createButton, 'submit', { label: 'OK' }]`      | Function + String + Object | Named mtrl component     | `layout.submit` ✅ |
| `[createButton, { label: 'Cancel' }]`            | Function + Object          | Anonymous mtrl component | Not accessible ❌  |
| `['title', { tag: 'h1', textContent: 'Hello' }]` | String + Object            | Named DOM element        | `layout.title` ✅  |
| `[{ tag: 'hr', class: 'divider' }]`              | Object only                | Anonymous DOM element    | Not accessible ❌  |

## Nesting Capabilities

The true power of the mtrl layout system lies in its **unlimited nesting capabilities**. You can create arbitrarily complex DOM structures with minimal, readable code.

### Basic Nesting Concept

Any array can contain **child arrays** that become nested elements:

```javascript
const basicLayout = createLayout(
  [["container", { tag: "div", class: "container" },
      ["child1", { tag: "h1", text: "Title" }],
      ["child2", { tag: "p", text: "Content" }],
    ],
  ],
  containerElement
).component;
```

### Multi-Level Nesting

Nesting can go as deep as needed:

```javascript
const siteHeader = createLayout(
  [["header", { class: "site-header" },
      ["nav", { tag: "nav", class: "navigation" },
        ["menu", { tag: "ul", class: "menu" },
          [{ tag: "li", class: "menu-item" },
            [{ tag: "a", href: "/home", text: "Home" }],
          ],
          [{ tag: "li", class: "menu-item" },
            [{ tag: "a", href: "/about", text: "About" }],
          ],
        ],
      ],
    ],
  ],
  containerElement
).component;
```

### Mixing Parameter Types in Nested Structures

Each level can use different parameter combinations:

```javascript
const userCard = createLayout(
  [[createCard, "userCard", { variant: "elevated" },
      // Card Header
      [{ tag: "header", class: "card-header" },
        ["title", { tag: "h2", text: "User Profile" }],
        [{ tag: "p", class: "subtitle", text: "Account Settings" }],
      ],
      // Card Body
      [createList, "settingsList", { variant: "three-line" }],
    ],
  ],
  containerElement
).component;
```

### Real-World Complex Example

Here's how you can create a complete content layout with just a few lines:

```javascript
export const createComponentsLayout = (info) => [
  ["head", { class: "content__header" },
    [{ tag: "section", class: "content__box content-info" },
      ["title", { tag: "h1", class: "content__title", text: info.title }],
      ["description", { tag: "p", class: "content__description", text: info.description }],
    ],
  ],
  ["body", { class: "content__body" }],
  ["foot", { class: "content__footer" },
    [{ tag: "section", className: "content__footer-section" },
      [{ html: mtrlIcon, className: "content-logo" }],
      [{ tag: "p", className: "components__description", text: "mtrl is a lightweight..." }],
    ],
    [{ tag: "section", className: "content__footer-section content__footer-link" },
      [{ text: "Links", className: "content__footer-section__social" }],
      [{ tag: "a", text: "npm", className: "content-link", href: "https://www.npmjs.com/package/mtrl", target: "_blank" }],
      [{ tag: "a", text: "GitHub", className: "content-link", href: "https://github.com/floor/mtrl", target: "_blank" }],
      [{ tag: "a", text: "X", className: "content-link", href: "https://x.com/mtrllib", target: "_blank" }],
    ],
  ],
];
```

### Component Section Example

A typical component section with clear hierarchy:

```javascript
export const createComponentSection = (info) => [
  [{ tag: "section", class: "components__section" },
    [{ class: "components__section-head" },
      ["title", { tag: "h2", class: "components__section-title", text: info.title }],
      ["description", { tag: "div", class: "components__section-description", text: info.description }],
    ],
    ["body", { class: "components__section-body" },
      ["showcase", { class: `components__section-showcase ${info.class}` }],
      ["info", { id: "info", class: "components__section-info" }],
    ],
  ],
];
```

### Form Layout Example

A complete form with layout and sections:

```javascript
const userForm = createLayout(
  [{ layout: { type: "grid", column: 4 } },
    // User Info Section
    [createTextfield, "firstName", { label: "First Name" }],
    [createTextfield, "lastName", { label: "Last Name" }],
    [createTextfield, "email", { label: "Email", type: "email" }],
    // Preferences Section
    [{ layout: { type: "row", column: 2, gap: 2 } },
      [createSwitch, "notifications", { label: "Email Notifications" }],
      [createSwitch, "newsletter", { label: "Newsletter" }],
    ],
    // Actions
    [{ layout: { type: "row", column: 2, gap: 2, justify: "end" } },
      [createButton, "cancel", { label: "Cancel", variant: "outlined" }],
      [createButton, "save", { label: "Save", variant: "filled" }],
    ],
  ],
  containerElement
).component;
```

### Formatting Convention

**One array per line** - This makes the nested structure incredibly clear:

```javascript
const layout = createLayout(
  [[parent,
      [child1],
      [child2,
        [grandchild1],
        [grandchild2],
      ],
    ],
  ],
  containerElement
).component;
```

### Key Formatting Rules

1. **One array per line** - Each array element gets its own line
2. **Consistent indentation** - Child arrays are indented 2 spaces
3. **Section comments** - Use comments to separate logical sections
4. **Trailing commas** - Include trailing commas for cleaner diffs
5. **Layout wrapper** - Use `createLayout()` for complete layouts

The indentation visually shows the DOM hierarchy, making it easy to understand the structure at a glance.

### Nesting Rules

1. **Unlimited depth**: Nest as many levels as needed
2. **Mixed parameters**: Each level can use different parameter combinations
3. **Named accessibility**: Named elements at any level are accessible via `layout.elementName`
4. **Performance**: The system efficiently handles deep nesting without performance issues
5. **Readability**: Despite complexity, the structure remains clean and readable

### Nesting with mtrl Components

mtrl components can also have nested children:

```javascript
const productCard = createLayout(
  [[createCard, "productCard", { variant: "outlined" },
      [createButton, "buyButton", { label: "Add to Cart", variant: "filled" }],
      [createTextField, "quantity", { label: "Quantity", type: "number" }],
    ],
  ],
  containerElement
).component;
```

The nesting system makes it incredibly easy to build complex, maintainable layouts with minimal code.

## Parameter Omission Examples

The layout system is flexible with optional parameters. Here are all possible combinations:

### All Parameters Present

```javascript
const layout = createLayout(
  [{ layout: { type: "grid", column: 2, gap: 4 } },
    // [Creator, Identifier, Options]
    [createButton, "submitBtn", { label: "Submit", variant: "filled" }],
    [createTextfield, "emailField", { label: "Email", type: "email" }],
  ],
  containerElement
).component;

// Access later
layout.submitBtn.on("click", handler);
layout.emailField.getValue();
```

### Creator Function Omitted (Uses createElement)

```javascript
const layout = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 2 } },
    // [Identifier, Options] - Creator omitted, uses createElement
    ["pageTitle", { tag: "h1", textContent: "Welcome", class: "title" }],
    ["divider", { tag: "hr", class: "separator" }],
    ["content", { tag: "div", class: "main-content" }],
  ],
  containerElement
).component;

// Access later
layout.pageTitle.textContent = "New Title";
layout.content.appendChild(someElement);
```

### Identifier Omitted (Anonymous Elements)

```javascript
const layout = createLayout(
  [{ layout: { type: "row", column: 3, gap: 2 } },
    // [Creator, Options] - Identifier omitted, anonymous
    [createButton, { label: "Cancel", variant: "outlined" }], // Anonymous
    [createButton, "submit", { label: "Submit", variant: "filled" }], // Named
    [createButton, { label: "Reset", variant: "text" }], // Anonymous
  ],
  containerElement
).component;

// Only named elements can be accessed
layout.submit.on("click", handler); // ✅ Works
// layout.cancel - ❌ Not available (anonymous)
```

### Both Creator and Identifier Omitted

```javascript
const layout = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 3 } },
    // [Options] - Both creator and identifier omitted
    [{ tag: "h2", textContent: "Settings", class: "section-title" }], // Anonymous div
    [createTextfield, "username", { label: "Username" }], // Named component
    [{ tag: "p", textContent: "Footer text", class: "footer" }], // Anonymous div
  ],
  containerElement
).component;

// Only the named textfield can be accessed
layout.username.getValue(); // ✅ Works
```

### Raw DOM Elements with Different Tags

```javascript
const layout = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 2 } },
    // Different HTML elements using createElement (tag specified in options)
    ["header", { tag: "header", class: "page-header" }],
    ["title", { tag: "h1", textContent: "Page Title", class: "title" }],
    ["nav", { tag: "nav", class: "navigation" }],
    ["main", { tag: "main", class: "content" }],
    ["aside", { tag: "aside", class: "sidebar" }],
    ["footer", { tag: "footer", class: "page-footer" }],
  ],
  containerElement
).component;

// Access semantic HTML elements
layout.header.appendChild(titleElement);
layout.title.textContent = "Welcome";
layout.nav.appendChild(menuElement);
layout.main.appendChild(contentElement);
```

## Basic Syntax

```javascript
import { createLayout, createButton, createTextfield } from "mtrl";

const layout = createLayout(
  [{ layout: { type: "grid", column: 2, gap: 4 } },
    [createButton, "submit", { label: "Submit", variant: "filled" }],
    [createTextfield, "email", { label: "Email", type: "email" }],
  ],
  containerElement
).component;

// Access components using identification strings
layout.submit.on("click", () => {
  const email = layout.email.getValue();
  console.log("Email:", email);
});
```

## Array Schema Structure

Each layout item follows this pattern:

```javascript
[CreatorFunction, "identifier", OptionsObject];
```

### 1. Creator Function (Optional)

The first parameter is a mtrl component creator function. **If omitted, it automatically uses `createElement`**:

```javascript
// Valid mtrl component creators
[createButton, 'btn', { ... }]
[createTextfield, 'input', { ... }]
[createChips, 'tags', { ... }]
[createSlider, 'range', { ... }]
[createSwitch, 'toggle', { ... }]
[createList, 'items', { ... }]

// When creator function is omitted, defaults to createElement
['container', { tag: 'div', class: 'wrapper' }]  // Creates a div
['title', { tag: 'h2', textContent: 'Title' }]   // Creates an h2
```

**For raw DOM elements, specify the tag in options**:

```javascript
// ✅ Correct: Specify tag in options
['container', { tag: 'div', class: 'wrapper' }]
['header', { tag: 'header', class: 'page-header' }]
['section', { tag: 'section', id: 'main-content' }]

// ❌ This won't work - you can't put the tag as the creator
['div', 'container', { ... }]  // 'div' is treated as identifier, not tag
```

### 2. Identifier String (Optional)

The second parameter is a unique identifier for component retrieval. **If omitted, the element becomes anonymous** (cannot be retrieved later):

```javascript
// Named components - can be retrieved later
[createButton, "submitBtn", { label: "Submit" }],
[createTextfield, "userEmail", { label: "Email" }]

// Anonymous components - cannot be retrieved
[createButton, { label: "Cancel", variant: "outlined" }], // No identifier
["divider", { tag: "hr", class: "separator" }]; // No identifier

// Later access via identifier (only works for named components)
layout.submitBtn.on("click", handler);
layout.userEmail.setValue("user@example.com");
// layout.cancel - ❌ Not available (anonymous)
```

**Use anonymous elements for**:

- Static content (dividers, spacers, labels)
- One-time use elements that don't need interaction
- Decorative elements

**Use named elements for**:

- Interactive components (buttons, inputs, sliders)
- Elements you need to update dynamically
- Components that handle events

### 3. Options Object

The third parameter contains component configuration:

```javascript
[createButton, "action", {
  label: "Click Me",
  variant: "outlined",
  size: "M",
  icon: iconSvg,
  disabled: false,
  class: "custom-button", // Adds 'mtrl-custom-button'
  rawclass: "raw-class", // Adds 'raw-class' without prefix
  styles: {
    display: "none",
    opacity: 0.5,
  },
}];
```

## Layout Configuration

### Grid Layout

```javascript
const gridLayout = createLayout(
  [{ layout: { type: "grid", column: 3, gap: 4, dense: true, align: "center" } },
    [createButton, "btn1", { label: "Button 1" }],
    [createButton, "btn2", { label: "Button 2" }],
    [createButton, "btn3", { label: "Button 3" }],
  ],
  containerElement
).component;
```

### Row Layout

```javascript
const rowLayout = createLayout(
  [{ layout: { type: "row", column: 2, gap: 2, justify: "space-between" } },
    [createTextfield, "firstName", { label: "First Name" }],
    [createTextfield, "lastName", { label: "Last Name" }],
  ],
  containerElement
).component;
```

### Nested Layouts

```javascript
const nestedLayout = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 4 } },
    [createTextfield, "title", { label: "Title" }],
    [{ layout: { type: "row", column: 3, gap: 1 } },
      [createButton, "prev", { icon: leftIcon, variant: "outlined" }],
      [createTextfield, "page", { label: "Page", density: "compact" }],
      [createButton, "next", { icon: rightIcon, variant: "outlined" }],
    ],
    [createSwitch, "enabled", { label: "Enable feature" }],
  ],
  containerElement
).component;
```

## Component Access & Interaction

### Basic Access

```javascript
const controls = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 2 } },
    [createTextfield, "username", { label: "Username" }],
    [createTextfield, "password", { label: "Password", type: "password" }],
    [createButton, "login", { label: "Login", variant: "filled" }],
  ],
  containerElement
).component;

// Access components
const username = controls.username.getValue();
const password = controls.password.getValue();

controls.login.on("click", () => {
  console.log("Login:", { username, password });
});
```

### Event Handling

```javascript
const form = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 3 } },
    [createTextfield, "email", { label: "Email", type: "email" }],
    [createSlider, "age", { label: "Age", min: 18, max: 100, value: 25 }],
    [createSwitch, "newsletter", { label: "Subscribe to newsletter" }],
    [createButton, "submit", { label: "Submit" }],
  ],
  containerElement
).component;

// Event handlers
form.email.on("input", (event) => {
  console.log("Email changed:", event.value);
});

form.age.on("change", (event) => {
  console.log("Age changed:", event.value);
});

form.newsletter.on("change", (event) => {
  console.log("Newsletter subscription:", event.checked);
});

form.submit.on("click", () => {
  const data = {
    email: form.email.getValue(),
    age: form.age.getValue(),
    newsletter: form.newsletter.getChecked(),
  };
  console.log("Form data:", data);
});
```

### Dynamic Updates

```javascript
const dashboard = createLayout(
  [{ layout: { type: "grid", column: 2, gap: 4 } },
    [createTextfield, "status", { label: "Status", readonly: true }],
    [createButton, "refresh", { label: "Refresh", variant: "outlined" }],
    [createSlider, "progress", { label: "Progress", min: 0, max: 100, value: 0 }],
    [createSwitch, "autoUpdate", { label: "Auto-update" }],
  ],
  containerElement
).component;

// Dynamic updates
dashboard.refresh.on("click", async () => {
  dashboard.status.setValue("Loading...");
  dashboard.refresh.setDisabled(true);

  try {
    const data = await fetchData();
    dashboard.status.setValue("Success");
    dashboard.progress.setValue(data.progress);
  } catch (error) {
    dashboard.status.setValue("Error: " + error.message);
  } finally {
    dashboard.refresh.setDisabled(false);
  }
});
```

## Advanced Patterns

### Chips with Dynamic Content

```javascript
const navigation = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 3 } },
    [createChips, "pages", { scrollable: false, label: "Jump to page" }],
    [createSlider, "index", {
      label: "Jump to index",
      min: 0,
      max: 100000,
      step: 1,
      size: "XS",
      variant: "discrete",
    }],
  ],
  containerElement
).component;

// Add chips dynamically
const pages = [
  { label: "1", value: 1 },
  { label: "10", value: 10 },
  { label: "100", value: 100 },
  { label: "1'000", value: 1000 },
];

pages.forEach(({ label, value }) => {
  navigation.pages.addChip({
    text: label.toLowerCase(),
    value,
    variant: "filter",
    selectable: true,
    selected: value === 1,
  });
});

// Handle chip selection
navigation.pages.on("change", (selectedPages) => {
  const value = parseInt(selectedPages[0], 10);
  console.log("Page selected:", value);
  navigation.index.setValue(value * 20); // Sync with slider
});
```

### Form Validation

```javascript
const registrationForm = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 3 } },
    [createTextfield, "email", {
      label: "Email",
      type: "email",
      required: true,
      helperText: "Enter a valid email address",
    }],
    [createTextfield, "password", {
      label: "Password",
      type: "password",
      required: true,
      helperText: "Minimum 8 characters",
    }],
    [createTextfield, "confirmPassword", {
      label: "Confirm Password",
      type: "password",
      required: true,
    }],
    [createSwitch, "terms", {
      label: "I agree to the terms and conditions",
      required: true,
    }],
    [createButton, "register", {
      label: "Register",
      variant: "filled",
      disabled: true,
    }],
  ],
  containerElement
).component;

// Validation logic
const validateForm = () => {
  const email = registrationForm.email.getValue();
  const password = registrationForm.password.getValue();
  const confirmPassword = registrationForm.confirmPassword.getValue();
  const termsAccepted = registrationForm.terms.getChecked();

  const isEmailValid = email.includes("@");
  const isPasswordValid = password.length >= 8;
  const passwordsMatch = password === confirmPassword;
  const isFormValid =
    isEmailValid && isPasswordValid && passwordsMatch && termsAccepted;

  // Update field states
  registrationForm.email.setError(!isEmailValid ? "Invalid email format" : "");
  registrationForm.password.setError(
    !isPasswordValid ? "Password too short" : ""
  );
  registrationForm.confirmPassword.setError(
    !passwordsMatch ? "Passwords do not match" : ""
  );

  // Enable/disable submit button
  registrationForm.register.setDisabled(!isFormValid);
};

// Attach validation to input events
registrationForm.email.on("input", validateForm);
registrationForm.password.on("input", validateForm);
registrationForm.confirmPassword.on("input", validateForm);
registrationForm.terms.on("change", validateForm);
```

## Styling & Classes

### CSS Classes

```javascript
const styledComponents = createLayout(
  [{ layout: { type: "row", column: 2, gap: 2 } },
    [createButton, "primary", {
      label: "Primary",
      class: "custom-primary", // Becomes 'mtrl-custom-primary'
      rawclass: "btn-special", // Becomes 'btn-special' (no prefix)
    }],
    [createButton, "secondary", {
      label: "Secondary",
      class: "custom-secondary",
    }],
  ],
  containerElement
).component;
```

### Inline Styles

```javascript
const hiddenPanel = createLayout(
  [{ layout: { type: "grid", column: 1 } },
    [createTextfield, "hiddenInput", {
      label: "Hidden Input",
      styles: {
        display: "none",
        opacity: 0,
        transition: "opacity 0.3s ease",
      },
    }],
    [createButton, "toggle", {
      label: "Toggle Input",
      styles: {
        marginTop: "16px",
      },
    }],
  ],
  containerElement
).component;

// Toggle visibility
hiddenPanel.toggle.on("click", () => {
  const isHidden = hiddenPanel.hiddenInput.element.style.display === "none";
  hiddenPanel.hiddenInput.element.style.display = isHidden ? "block" : "none";
  hiddenPanel.hiddenInput.element.style.opacity = isHidden ? "1" : "0";
});
```

## Performance Tips

### Lazy Component Creation

```javascript
// Only create expensive components when needed
const lazyDashboard = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 4 } },
    [createButton, "loadChart", { label: "Load Chart", variant: "outlined" }],
  ],
  containerElement
).component;

lazyDashboard.loadChart.on("click", () => {
  // Add chart component dynamically
  const chartLayout = createLayout(
    [{ layout: { type: "grid", column: 1 } },
      [createSlider, "timeRange", { label: "Time Range", min: 1, max: 30, value: 7 }],
    ],
    containerElement
  ).component;

  lazyDashboard.loadChart.setDisabled(true);
  lazyDashboard.loadChart.setLabel("Chart Loaded");
});
```

### Efficient Updates

```javascript
const efficientList = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 2 } },
    [createTextfield, "search", { label: "Search", type: "search" }],
    [createChips, "filters", { label: "Filters" }],
  ],
  containerElement
).component;

// Debounced search to avoid excessive API calls
let searchTimeout;
efficientList.search.on("input", (event) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(event.value);
  }, 300);
});
```

## Best Practices

### 1. Component Naming

```javascript
// ✅ Good: Descriptive identifiers
[createButton, 'submitForm', { ... }]
[createTextfield, 'userEmail', { ... }]
[createSlider, 'volumeControl', { ... }]

// ❌ Avoid: Generic names
[createButton, 'btn1', { ... }]
[createTextfield, 'input', { ... }]
```

### 2. Layout Organization

```javascript
// ✅ Good: Logical grouping
const userForm = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 4 } },
    // User Info Section
    [createTextfield, "firstName", { label: "First Name" }],
    [createTextfield, "lastName", { label: "Last Name" }],
    [createTextfield, "email", { label: "Email", type: "email" }],
    // Preferences Section
    [{ layout: { type: "row", column: 2, gap: 2 } },
      [createSwitch, "notifications", { label: "Email Notifications" }],
      [createSwitch, "newsletter", { label: "Newsletter" }],
    ],
    // Actions
    [{ layout: { type: "row", column: 2, gap: 2, justify: "end" } },
      [createButton, "cancel", { label: "Cancel", variant: "outlined" }],
      [createButton, "save", { label: "Save", variant: "filled" }],
    ],
  ],
  containerElement
).component;
```

### 3. Error Handling

```javascript
const robustForm = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 3 } },
    [createTextfield, "apiKey", { label: "API Key", type: "password" }],
    [createButton, "testConnection", { label: "Test Connection" }],
  ],
  containerElement
).component;

robustForm.testConnection.on("click", async () => {
  try {
    robustForm.testConnection.setLoading(true);
    robustForm.apiKey.setError("");

    const result = await testApiConnection(robustForm.apiKey.getValue());

    if (result.success) {
      robustForm.apiKey.setHelperText("Connection successful!");
    } else {
      robustForm.apiKey.setError("Connection failed: " + result.error);
    }
  } catch (error) {
    robustForm.apiKey.setError("Network error: " + error.message);
  } finally {
    robustForm.testConnection.setLoading(false);
  }
});
```

## Common Patterns

### Settings Panel

```javascript
const settingsPanel = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 4 } },
    // Theme Settings
    [createTextfield, "themeTitle", {
      value: "Theme Settings",
      readonly: true,
      variant: "outlined",
      class: "section-title",
    }],
    [createSwitch, "darkMode", { label: "Dark Mode", checked: false }],
    [createSlider, "fontSize", { label: "Font Size", min: 12, max: 24, value: 16 }],
    // Notification Settings
    [createTextfield, "notifTitle", {
      value: "Notifications",
      readonly: true,
      variant: "outlined",
      class: "section-title",
    }],
    [createSwitch, "emailNotifs", { label: "Email Notifications", checked: true }],
    [createSwitch, "pushNotifs", { label: "Push Notifications", checked: false }],
    // Save Button
    [createButton, "saveSettings", {
      label: "Save Settings",
      variant: "filled",
      class: "save-button",
    }],
  ],
  containerElement
).component;
```

### Data Table Controls

```javascript
const tableControls = createLayout(
  [{ layout: { type: "grid", column: 1, gap: 4 } },
    // Search & Filters
    [{ layout: { type: "row", column: 3, gap: 2 } },
      [createTextfield, "searchTable", {
        label: "Search",
        type: "search",
        placeholder: "Search records...",
      }],
      [createChips, "statusFilter", { label: "Status" }],
      [createButton, "clearFilters", {
        label: "Clear",
        variant: "outlined",
        size: "S",
      }],
    ],
    // Pagination
    [{ layout: { type: "row", column: 4, gap: 1, align: "center" } },
      [createButton, "firstPage", { icon: firstPageIcon, variant: "outlined", size: "XS" }],
      [createButton, "prevPage", { icon: prevIcon, variant: "outlined", size: "XS" }],
      [createTextfield, "currentPage", {
        label: "Page",
        density: "compact",
        value: "1",
        styles: { width: "80px" },
      }],
      [createButton, "nextPage", { icon: nextIcon, variant: "outlined", size: "XS" }],
    ],
  ],
  containerElement
).component;
```

This array-based layout system provides powerful, fast component creation and management while maintaining clean, readable code structure.