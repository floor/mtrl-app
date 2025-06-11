# Global Configuration System

The mtrl library includes a lightweight global configuration system that allows you to set default values for all components in your application.

## Features

- ✅ **Lightweight**: Simple object-based storage, no complex state management
- ✅ **Type-safe**: Full TypeScript support with proper type inference
- ✅ **Efficient**: Configuration merging happens only during component creation
- ✅ **Clear precedence**: User config > Global defaults > Component defaults

## Basic Usage

### Setting Global Defaults for All Buttons

```typescript
import { setComponentDefaults, createButton } from 'mtrl';

// Set all buttons to be square by default
setComponentDefaults('button', {
  shape: 'square',
  size: 'm',
  variant: 'filled'
});

// Now all buttons will use square shape by default
const button1 = createButton({ text: 'Square by default' });

// You can still override the global defaults
const button2 = createButton({ 
  text: 'Round button',
  shape: 'round'  // Overrides global default
});
```

### Setting Defaults for Multiple Components

```typescript
import { setGlobalDefaults } from 'mtrl';

// Configure multiple components at once
setGlobalDefaults({
  button: {
    shape: 'square',
    size: 'm'
  },
  textfield: {
    variant: 'outlined',
    size: 'medium'
  }
});
```

### Application-wide Configuration

```typescript
// app-config.ts
import { setGlobalDefaults } from 'mtrl';

export function initializeMtrlDefaults() {
  setGlobalDefaults({
    button: {
      shape: 'square',
      size: 'm',
      ripple: true
    }
  });
}

// main.ts
import { initializeMtrlDefaults } from './app-config';

// Set defaults once when your app starts
initializeMtrlDefaults();
```

### Theme-based Configuration

```typescript
import { setComponentDefaults, clearGlobalDefaults } from 'mtrl';

function applyCompactTheme() {
  setComponentDefaults('button', {
    size: 'xs',
    shape: 'square'
  });
}

function applyComfortableTheme() {
  setComponentDefaults('button', {
    size: 'm',
    shape: 'round'
  });
}

// Switch themes dynamically
function switchTheme(theme: 'compact' | 'comfortable') {
  clearGlobalDefaults(); // Reset to component defaults
  
  if (theme === 'compact') {
    applyCompactTheme();
  } else {
    applyComfortableTheme();
  }
}
```

## API Reference

### `setComponentDefaults(component, config)`

Sets default configuration for a specific component type.

```typescript
setComponentDefaults('button', {
  shape: 'square',
  size: 'm'
});
```

### `setGlobalDefaults(configs)`

Sets defaults for multiple components at once.

```typescript
setGlobalDefaults({
  button: { shape: 'square' },
  textfield: { variant: 'outlined' }
});
```

### `getComponentDefaults(component)`

Retrieves the current global defaults for a component.

```typescript
const buttonDefaults = getComponentDefaults('button');
console.log(buttonDefaults); // { shape: 'square', size: 'm' }
```

### `clearGlobalDefaults()`

Removes all global defaults, reverting to built-in component defaults.

```typescript
clearGlobalDefaults();
```

## Precedence Rules

When a component is created, configurations are merged in this order:

1. **Component defaults** (built into the library) - Lowest priority
2. **Global defaults** (set via `setComponentDefaults`) - Medium priority  
3. **User config** (passed to create function) - Highest priority

Example:

```typescript
// Component default: shape = 'round'
// Global default: shape = 'square'
setComponentDefaults('button', { shape: 'square' });

// User config wins
const button = createButton({ 
  shape: 'round'  // This takes precedence
});
```

## Performance Considerations

- Configuration merging happens only once during component creation
- No runtime overhead after component is created
- Simple object spread operations for maximum performance
- No complex state management or subscriptions

## Testing with Global Defaults

Remember to clear global defaults between tests:

```typescript
import { clearGlobalDefaults } from 'mtrl';

beforeEach(() => {
  clearGlobalDefaults();
});
```

## TypeScript Support

The system is fully type-safe:

```typescript
// TypeScript will enforce valid configuration
setComponentDefaults('button', {
  shape: 'square',    // ✅ Valid
  size: 'huge'        // ❌ Error: Type '"huge"' is not assignable to type 'ButtonSize'
});
``` 