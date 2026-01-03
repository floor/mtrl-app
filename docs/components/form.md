# Form Component

> **Created:** January 3, 2025
> **Updated:** January 4, 2025
> **Package:** mtrl-addons

The Form component is a functional form builder that uses the mtrl composition pattern to create forms from schema definitions. It provides built-in data management, validation, state tracking, and submission handling.

## Overview

Form is part of the `mtrl-addons` package and provides:

- **Schema-Based Layout**: Define form structure using array-based layout schemas
- **Automatic Field Extraction**: Fields prefixed with `info.` or `data.` are automatically extracted for data management
- **Data State Tracking**: Pristine/dirty state with automatic control button management
- **Change Detection**: Smart detection that reverts to pristine when data matches initial state
- **Auto-Wired Controls**: Submit and cancel buttons are automatically connected
- **Validation**: Configurable validation rules with error handling
- **Submit Handling**: Built-in fetch with JSON, or custom handlers via `onSubmit`
- **Event System**: Rich event system for change, submit, state changes, etc.

## Import

```javascript
import { createForm, DATA_STATE, FORM_EVENTS } from 'mtrl-addons';
```

## Basic Usage

### Simple Form

```javascript
import { createForm } from 'mtrl-addons';
import { createTextfield, createSwitch, createButton } from 'mtrl';

const form = createForm({
  class: 'user-form',
  layout: [
    ['section', { class: 'form-section' },
      [createTextfield, 'info.username', { label: 'Username' }],
      [createTextfield, 'info.email', { label: 'Email', type: 'email' }],
      [createSwitch, 'info.active', { label: 'Active' }]
    ],
    ['footer', { class: 'form-footer' },
      [createButton, 'cancel', { text: 'Cancel' }],
      [createButton, 'submit', { text: 'Save' }]
    ]
  ],
  container: document.querySelector('#form-container')
});

// Set data
form.setData({
  username: 'john_doe',
  email: 'john@example.com',
  active: true
});

// Get data
const data = form.getData();
// { username: 'john_doe', email: 'john@example.com', active: true }
```

### Form with API Submission

```javascript
import { createForm } from 'mtrl-addons';
import { createTextfield, createSelect, createButton } from 'mtrl';

const profileForm = createForm({
  class: 'profile-form',
  action: '/api/users',
  method: 'PUT',
  
  layout: [
    ['section', 'personal', { class: 'section' },
      ['div', { class: 'section-title', text: 'Personal Info' }],
      ['div', { class: 'row' },
        [createTextfield, 'info.firstName', { label: 'First Name' }],
        [createTextfield, 'info.lastName', { label: 'Last Name' }]
      ],
      [createTextfield, 'info.email', { label: 'Email', type: 'email', required: true }]
    ],
    ['section', 'preferences', { class: 'section' },
      ['div', { class: 'section-title', text: 'Preferences' }],
      [createSelect, 'info.language', { 
        label: 'Language',
        options: [
          { id: 'en', text: 'English' },
          { id: 'fr', text: 'French' },
          { id: 'es', text: 'Spanish' }
        ]
      }]
    ],
    ['footer', { class: 'form-controls' },
      [createButton, 'cancel', { text: 'Cancel' }],
      [createButton, 'submit', { text: 'Save', variant: 'filled' }]
    ]
  ],
  
  on: {
    change: (data) => {
      console.log('Form changed:', data);
    },
    'submit:success': (response) => {
      console.log('Saved successfully:', response);
    },
    'submit:error': (error) => {
      console.error('Save failed:', error);
    }
  }
});
```

## Configuration

The Form component accepts the following configuration options:

### Basic Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `class` | `string` | `undefined` | Additional CSS class for the form container |
| `prefix` | `string` | `'mtrl'` | Prefix for generated class names |
| `action` | `string` | `undefined` | URL for form submission |
| `method` | `string` | `'POST'` | HTTP method for submission |
| `autocomplete` | `string` | `'off'` | Form autocomplete attribute |
| `container` | `HTMLElement` | `undefined` | Container to append form to |

### Data Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data` | `object` | `{}` | Initial form data |
| `useChanges` | `boolean` | `true` | Enable automatic state tracking and control management |
| `sysinfo` | `string[]` | `[]` | System fields to exclude from form data |

### Control Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `controls` | `string[]` | `['submit', 'cancel']` | Control button names to auto-wire |
| `onSubmit` | `function` | `undefined` | Custom submit handler `(data, form) => Promise` |
| `onCancel` | `function` | `undefined` | Custom cancel handler `(form) => void` |

### Validation Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `validation` | `array` | `[]` | Array of validation rules |

## Layout Schema

### Schema Format

The layout uses an array-based schema where each item can be:

1. **Element with class**: `[{ class: 'my-class' }]`
2. **Named element**: `['name', { class: 'my-class' }]`
3. **Component factory**: `[createTextfield, 'info.fieldName', { label: 'Label' }]`
4. **Nested structure**: `['section', { class: 'section' }, [...children]]`

### Field Naming Convention

Fields that should be tracked for data must be prefixed:
- `info.fieldName` - Standard data fields
- `data.fieldName` - Alternative data prefix
- `file.fieldName` - File upload fields

```javascript
// ✅ Tracked fields
[createTextfield, 'info.username', { label: 'Username' }]
[createTextfield, 'data.email', { label: 'Email' }]

// ❌ Not tracked (no prefix)
[createTextfield, 'username', { label: 'Username' }]
```

### Control Button Names

Buttons named `submit` and `cancel` are automatically wired:

```javascript
[createButton, 'submit', { text: 'Save' }]   // Auto-wired to form submit
[createButton, 'cancel', { text: 'Cancel' }] // Auto-wired to form reset
```

### Example Layout

```javascript
const layout = [
  // Header section
  ['header', { class: 'form-header' },
    ['h2', { class: 'title', text: 'Edit Profile' }]
  ],
  
  // User info section
  ['section', { class: 'section' },
    ['div', { class: 'section-title', text: 'User Information' }],
    ['div', { class: 'row' },
      [createTextfield, 'info.firstName', { label: 'First Name' }],
      [createTextfield, 'info.lastName', { label: 'Last Name' }]
    ],
    [createTextfield, 'info.email', { 
      label: 'Email',
      type: 'email',
      required: true 
    }],
    [createChips, 'info.role', {
      label: 'Role',
      chips: [
        { text: 'User', value: 'user' },
        { text: 'Admin', value: 'admin' },
        { text: 'Editor', value: 'editor' }
      ]
    }],
    [createSwitch, 'info.enabled', { label: 'Enabled' }]
  ],
  
  // Controls section
  ['footer', { class: 'form-footer' },
    ['div', { class: 'spacer' }],
    [createButton, 'cancel', { text: 'Cancel' }],
    [createButton, 'submit', { text: 'Save', variant: 'filled' }]
  ]
];
```

## Data State

The form tracks whether data has been modified from its initial state:

| State | Constant | Description |
|-------|----------|-------------|
| Pristine | `DATA_STATE.PRISTINE` | Data matches initial state, controls disabled |
| Dirty | `DATA_STATE.DIRTY` | Data has been modified, controls enabled |

### Automatic State Management

When `useChanges: true` (default):
1. **Field changes** → Form becomes dirty → Controls enabled
2. **Revert to initial values** → Form becomes pristine → Controls disabled
3. **Submit success** → New snapshot taken → Form becomes pristine
4. **Cancel/Reset** → Data reverted → Form becomes pristine

**Event Deduplication:** The form automatically deduplicates change events. For components that emit both `input` and `change` events (like textfields), the form tracks the last emitted value and only triggers state updates when the value actually changes. This prevents duplicate processing and ensures accurate dirty state tracking.

```javascript
import { createForm, DATA_STATE } from 'mtrl-addons';

const form = createForm({
  useChanges: true, // Default - enables automatic state management
  // ...
});

// Check current state
const state = form.getDataState();
if (state === DATA_STATE.DIRTY) {
  console.log('Form has unsaved changes');
}

// Check if modified
if (form.isModified()) {
  console.log('Form has been modified');
}

// Listen for state changes
form.on('state:change', ({ modified, state }) => {
  console.log(`State: ${state}, Modified: ${modified}`);
});
```

### CSS Classes for State

The form element receives state-specific CSS classes:

```css
.mtrl-form--modified { } /* Applied when form is dirty */
.mtrl-form--submitting { } /* Applied during submission */
```

## Auto-Wired Controls

The form automatically wires click handlers to buttons named `submit` and `cancel`:

### Default Behavior

```javascript
const form = createForm({
  action: '/api/users',
  method: 'PUT',
  layout: [
    // ... fields ...
    [createButton, 'cancel', { text: 'Cancel' }],  // Calls form.reset()
    [createButton, 'submit', { text: 'Save' }]     // Calls form.submit()
  ]
});
```

### Custom Handlers

Use `onSubmit` and `onCancel` for custom behavior:

```javascript
const form = createForm({
  layout: [
    // ... fields ...
    [createButton, 'cancel', { text: 'Cancel' }],
    [createButton, 'submit', { text: 'Save' }]
  ],
  
  // Custom submit handler
  onSubmit: async (data, form) => {
    const response = await myApi.saveUser(data);
    form.emit('updated', response);
    return response;
  },
  
  // Custom cancel handler
  onCancel: (form) => {
    if (confirm('Discard changes?')) {
      form.reset();
    }
  }
});
```

### Disabling Auto-Wire

Set `controls: null` to disable auto-wiring:

```javascript
const form = createForm({
  controls: null, // Don't auto-wire any buttons
  // ...
});
```

Or specify which buttons to wire:

```javascript
const form = createForm({
  controls: ['submit'], // Only wire submit, not cancel
  // ...
});
```

## API Reference

### Data Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getData()` | `object` | Get all form data |
| `setData(data, silent?)` | `Form` | Set form data |
| `getFieldValue(name)` | `any` | Get a specific field's value |
| `setFieldValue(name, value, silent?)` | `Form` | Set a specific field's value |
| `getField(name)` | `Field` | Get a field component by name |
| `getFieldNames()` | `string[]` | Get all field names |

### State Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `isModified()` | `boolean` | Check if form has been modified |
| `getDataState()` | `string` | Get current data state ('pristine' or 'dirty') |
| `reset()` | `Form` | Reset to initial/snapshot data |
| `clear()` | `Form` | Clear all field values |

### Control Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `enable()` | `Form` | Enable all form fields |
| `disable()` | `Form` | Disable all form fields |
| `enableControls()` | `Form` | Enable control buttons |
| `disableControls()` | `Form` | Disable control buttons |

### Validation Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `validate()` | `{ valid, errors }` | Validate form data |

### Submission Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `submit(options?)` | `Promise` | Submit the form |

### Event Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `on(event, handler)` | `Form` | Add event listener |
| `off(event, handler)` | `Form` | Remove event listener |
| `emit(event, data?)` | `void` | Emit an event |

### Lifecycle Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `destroy()` | `void` | Destroy the form and clean up |

## Events

### Change Events

```javascript
form.on('change', ({ name, value }) => {
  console.log(`Field ${name} changed to:`, value);
});

form.on('field:change', ({ name, value }) => {
  console.log(`Field ${name} changed to:`, value);
});
```

### State Events

```javascript
form.on('state:change', ({ modified, state }) => {
  console.log(`State: ${state}`); // 'pristine' or 'dirty'
  console.log(`Modified: ${modified}`); // true or false
});
```

### Data Events

```javascript
form.on('data:set', (data) => {
  console.log('Data set:', data);
});

form.on('data:get', (data) => {
  console.log('Data retrieved:', data);
});

form.on('reset', () => {
  console.log('Form reset');
});
```

### Submit Events

```javascript
form.on('submit', (data) => {
  console.log('Form submitting with:', data);
});

form.on('submit:success', (response) => {
  console.log('Submit successful:', response);
});

form.on('submit:error', (error) => {
  console.error('Submit failed:', error);
});
```

### Validation Events

```javascript
form.on('validation:error', (errors) => {
  console.log('Validation errors:', errors);
});
```

## Validation

### Defining Validation Rules

```javascript
const form = createForm({
  validation: [
    {
      field: 'email',
      validate: (value) => {
        if (!value) return 'Email is required';
        if (!value.includes('@')) return 'Invalid email format';
        return true;
      }
    },
    {
      field: 'password',
      validate: (value, data) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return true;
      },
      message: 'Password validation failed' // Fallback message
    },
    {
      field: 'confirmPassword',
      validate: (value, data) => value === data.password,
      message: 'Passwords do not match'
    }
  ],
  // ...
});
```

### Manual Validation

```javascript
const result = form.validate();

if (result.valid) {
  console.log('Form is valid');
} else {
  console.log('Validation errors:', result.errors);
  // { email: 'Invalid email format', password: 'Password is required' }
}
```

## Submission

### Default Submission (Fetch)

When `action` is provided, the form uses built-in fetch:

```javascript
const form = createForm({
  action: '/api/users',
  method: 'PUT',
  // ...
});

// Submit button click automatically calls form.submit()
// Or manually:
await form.submit();

// With custom options:
await form.submit({
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer token123'
  },
  validate: true // Validate before submit (default)
});
```

### Custom Submit Handler

Use `onSubmit` for custom submission logic:

```javascript
const form = createForm({
  onSubmit: async (data, form) => {
    // Custom submission logic
    const response = await myApi.updateUser(data);
    
    // Emit events for UI updates
    form.emit('updated', response);
    
    return response;
  },
  // ...
});
```

Or pass a handler to `submit()`:

```javascript
await form.submit({
  handler: async (data, formComponent) => {
    const response = await myCustomApi.updateUser(data);
    return response;
  }
});
```

## Examples

### Account Form with Sections

```javascript
import { createForm } from 'mtrl-addons';
import { createTextfield, createSwitch, createChips, createSelect, createButton } from 'mtrl';

const accountForm = createForm({
  class: 'account-form',
  action: '/api/users',
  method: 'PUT',
  
  layout: [
    // Header
    ['header', { class: 'form-header' },
      ['h2', { class: 'title', text: 'Account Settings' }]
    ],
    
    // User section
    ['section', { class: 'section' },
      ['div', { class: 'section-title', text: 'User' }],
      ['div', { class: 'row' },
        [createTextfield, 'info.username', { label: 'Username' }],
        [createTextfield, 'info.code', { label: 'Code', disabled: true }]
      ],
      [createChips, 'info.role', {
        label: 'Role',
        chips: [
          { text: 'User', value: 'user' },
          { text: 'Admin', value: 'admin' },
          { text: 'Premium', value: 'premium' }
        ]
      }],
      [createSwitch, 'info.enabled', { label: 'Enabled' }]
    ],
    
    // Profile section
    ['section', { class: 'section' },
      ['div', { class: 'section-title', text: 'Profile' }],
      ['div', { class: 'row' },
        [createTextfield, 'info.pseudonym', { label: 'Pseudonym' }],
        [createSelect, 'info.country', { 
          label: 'Country',
          options: [
            { id: 'US', text: 'United States' },
            { id: 'FR', text: 'France' },
            { id: 'UK', text: 'United Kingdom' }
          ]
        }]
      ]
    ],
    
    // Contact section
    ['section', { class: 'section' },
      ['div', { class: 'section-title', text: 'Contact' }],
      [createTextfield, 'info.email', { 
        label: 'Email',
        type: 'email',
        required: true 
      }],
      ['div', { class: 'row' },
        [createTextfield, 'info.firstName', { label: 'First Name' }],
        [createTextfield, 'info.lastName', { label: 'Last Name' }]
      ]
    ],
    
    // Controls
    ['footer', { class: 'form-footer' },
      ['div', { class: 'spacer' }],
      [createButton, 'cancel', { text: 'Cancel' }],
      [createButton, 'submit', { text: 'Save', variant: 'filled' }]
    ]
  ],
  
  on: {
    'submit:success': (result) => {
      console.log('Account updated:', result);
    },
    'submit:error': (error) => {
      console.error('Update failed:', error);
    }
  }
});

// Load user data
async function loadUser(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const user = await response.json();
  
  // Set data silently (won't trigger dirty state)
  accountForm.setData(user, true);
  
  // Take snapshot for change detection
  accountForm.state.initialData = { ...accountForm.getData() };
}
```

### Login Form with Validation

```javascript
import { createForm } from 'mtrl-addons';
import { createTextfield, createButton } from 'mtrl';

const loginForm = createForm({
  class: 'login-form',
  action: '/api/auth/login',
  method: 'POST',
  
  layout: [
    ['section', { class: 'form-body' },
      [createTextfield, 'info.email', {
        label: 'Email',
        type: 'email',
        required: true
      }],
      [createTextfield, 'info.password', {
        label: 'Password',
        type: 'password',
        required: true
      }]
    ],
    ['footer', { class: 'form-footer' },
      [createButton, 'submit', { 
        text: 'Sign In',
        variant: 'filled'
      }]
    ]
  ],
  
  validation: [
    {
      field: 'email',
      validate: (value) => {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email';
        }
        return true;
      }
    },
    {
      field: 'password',
      validate: (value) => {
        if (!value) return 'Password is required';
        return true;
      }
    }
  ],
  
  on: {
    'submit:success': (response) => {
      window.location.href = '/dashboard';
    },
    'submit:error': (error) => {
      alert('Login failed: ' + error.message);
    }
  }
});
```

### Class Wrapper for Legacy Systems

For compatibility with class-based layout systems:

```javascript
import { createForm } from 'mtrl-addons';
import emitter from 'your-emitter-mixin';

class AccountForm {
  constructor(options = {}) {
    Object.assign(this, emitter);
    
    this._form = createForm({
      action: '/api/users',
      method: 'PUT',
      container: options.container,
      
      on: {
        'submit:success': (result) => this.emit('updated', result),
        'submit:error': (error) => this.emit('error', error),
        change: (data) => this.emit('changed', data)
      },
      
      layout: [
        // ... your layout
      ]
    });
    
    this.element = this._form.element;
  }
  
  get modified() {
    return this._form.isModified();
  }
  
  async set(data) {
    this._form.setData(data, true);
    this._form.state.initialData = { ...this._form.getData() };
  }
  
  getData() {
    return this._form.getData();
  }
  
  reset() {
    this._form.reset();
  }
  
  destroy() {
    this._form.destroy();
  }
}

export default AccountForm;
```

## CSS Customization

### Basic Styling

```css
/* Form container */
.mtrl-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Form element */
.mtrl-form form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* State-based styling */
.mtrl-form--modified {
  /* Styles when form has changes */
}

.mtrl-form--submitting {
  opacity: 0.7;
  pointer-events: none;
}

/* Sections */
.section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Rows */
.row {
  display: flex;
  gap: 1rem;
}

.row > * {
  flex: 1;
}

/* Form footer */
.form-footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.form-footer .spacer {
  flex: 1;
}
```

## Field Component Requirements

For a component to work as a form field, it must implement:

### Required

- `element` - The DOM element
- `getValue()` - Returns the current value
- `setValue(value)` - Sets the value
- `on(event, handler)` - Event listener support

### For Switch/Checkbox Components

With the unified API, switch and checkbox components now use the same `getValue()`/`setValue()` interface:

- `getValue()` - Returns `boolean` (checked state)
- `setValue(value)` - Accepts `boolean` or `string` (`'true'`/`'false'`/`'1'`/`'0'`)

The legacy `isChecked()`, `check()`, `uncheck()` methods are still available but not required for form compatibility.

### Optional (for full functionality)

- `enable()` - Enable the field
- `disable()` - Disable the field
- `destroy()` - Clean up resources

### Example Custom Field

```javascript
const createCustomField = (config) => {
  const element = document.createElement('div');
  element.className = 'custom-field';
  
  const input = document.createElement('input');
  input.type = 'text';
  
  element.appendChild(input);
  
  const handlers = new Map();
  
  return {
    element,
    
    getValue: () => input.value,
    
    setValue: (value) => {
      input.value = value || '';
    },
    
    on: (event, handler) => {
      if (event === 'input' || event === 'change') {
        input.addEventListener(event, () => handler());
      }
      handlers.set(event, handler);
    },
    
    enable: () => { input.disabled = false; },
    disable: () => { input.disabled = true; },
    
    destroy: () => {
      handlers.clear();
      element.remove();
    }
  };
};
```

## Constants

### DATA_STATE

```javascript
import { DATA_STATE } from 'mtrl-addons';

DATA_STATE.PRISTINE  // 'pristine' - No changes from initial data
DATA_STATE.DIRTY     // 'dirty' - Data has been modified
```

### FORM_EVENTS

```javascript
import { FORM_EVENTS } from 'mtrl-addons';

FORM_EVENTS.CHANGE           // 'change'
FORM_EVENTS.SUBMIT           // 'submit'
FORM_EVENTS.STATE_CHANGE     // 'state:change'
FORM_EVENTS.DATA_SET         // 'data:set'
FORM_EVENTS.DATA_GET         // 'data:get'
FORM_EVENTS.FIELD_CHANGE     // 'field:change'
FORM_EVENTS.VALIDATION_ERROR // 'validation:error'
FORM_EVENTS.SUBMIT_SUCCESS   // 'submit:success'
FORM_EVENTS.SUBMIT_ERROR     // 'submit:error'
FORM_EVENTS.RESET            // 'reset'
```

## Troubleshooting

### Fields Not Being Tracked

Ensure field names are prefixed with `info.` or `data.`:

```javascript
// ✅ Correct - field will be tracked
[createTextfield, 'info.email', { label: 'Email' }]

// ❌ Wrong - field won't be tracked for data
[createTextfield, 'email', { label: 'Email' }]
```

### Buttons Not Working

Ensure buttons are named `submit` and `cancel`:

```javascript
// ✅ Correct - buttons will be auto-wired
[createButton, 'submit', { text: 'Save' }]
[createButton, 'cancel', { text: 'Cancel' }]

// ❌ Wrong - buttons won't be auto-wired
[createButton, 'saveBtn', { text: 'Save' }]
```

### Form Not Submitting

Check that:
1. `action` URL is set if using default submission
2. Button is named `submit` or you're calling `form.submit()` manually
3. Validation passes (`validate().valid` is `true`)

### Switch Initial Value Triggers Change

This was fixed - setting data with `silent: true` now properly sets switch values without triggering change events. The form also syncs the internal change tracker, so subsequent user changes are correctly detected:

```javascript
form.setData(userData, true); // Silent - won't trigger dirty state, syncs tracker
```

Additionally, the textfield's `--empty` class is now properly updated during silent updates, ensuring the label is positioned correctly.

### Controls Not Enabling/Disabling

Ensure `useChanges: true` (default) is set:

```javascript
const form = createForm({
  useChanges: true, // Enable automatic control management
  // ...
});
```

### Events Not Firing

Check event name spelling:

```javascript
// ✅ Correct
form.on('submit:success', (response) => { ... });
form.on('state:change', ({ modified, state }) => { ... });

// ❌ Wrong event names
form.on('submitSuccess', (response) => { ... });
form.on('mode:change', ({ mode }) => { ... }); // Old API - use state:change
```

## Migration from FORM_MODES

If upgrading from an older version that used `FORM_MODES`:

| Old API | New API |
|---------|---------|
| `FORM_MODES.READ` | `DATA_STATE.PRISTINE` |
| `FORM_MODES.UPDATE` | `DATA_STATE.DIRTY` |
| `FORM_MODES.CREATE` | Removed (use dirty state) |
| `getMode()` | `getDataState()` |
| `setMode(mode)` | Removed (state is automatic) |
| `mode:change` event | `state:change` event |

## Related Documentation

- [Layout System](/docs/core/layout) - Layout schema format
- [Textfield Component](/docs/components/textfield) - Text input component
- [Switch Component](/docs/components/switch) - Toggle switch component
- [Chips Component](/docs/components/chips) - Selection chips
- [Button Component](/docs/components/button) - Button component