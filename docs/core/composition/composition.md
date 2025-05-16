# Composition System

The composition system is the heart of the mtrl library's component architecture. It provides a functional approach to building UI components through composition rather than inheritance, making components more flexible, testable, and maintainable.

## Core Principles

- **Functional Composition**: Components are built by composing small, focused functions rather than extending classes
- **Immutability**: Each function in the composition chain returns a new component instance without modifying the input
- **Single Responsibility**: Each enhancer focuses on adding a single capability or feature
- **Progressive Enhancement**: Start with a minimal base and build up functionality as needed
- **Type Safety**: Full TypeScript support with interfaces for each feature

## Architecture Overview

The composition system consists of several key pieces:

1. **Base Component Creation**: `createBase()` and `createComponent()`
2. **Composition Utilities**: `pipe()`, `compose()`, and `transform()`
3. **Element Creation**: `withElement()` 
4. **Feature Enhancers**: `withEvents()`, `withText()`, etc.
5. **Component Interfaces**: `BaseComponent`, `ElementComponent`, etc.

## Creating Components

### Basic Pattern

The standard pattern for creating components is:

```typescript
const component = pipe(
  createBase,                 // 1. Start with base component
  withElement(elementConfig), // 2. Add a DOM element
  withFeature1(config),       // 3. Add feature 1
  withFeature2(config),       // 4. Add feature 2
  ...
)(componentConfig);           // 5. Pass in component config
```

This pipeline of functions transforms a base configuration into a fully-featured component.

### Base Component Creation

The first step is creating a base component:

```typescript
import { createBase } from 'mtrl/core/compose';

const baseConfig = { 
  componentName: 'button',
  prefix: 'mtrl'
};

const base = createBase(baseConfig);
```

A base component provides:
- Configuration storage
- Component name
- Class name utilities
- Touch state tracking

### Adding a DOM Element

The next step is adding a DOM element:

```typescript
import { withElement } from 'mtrl/core/compose';

const elementConfig = {
  tag: 'button',
  attributes: { type: 'button' },
  className: ['primary', 'large'],
  interactive: true
};

const withDomElement = withElement(elementConfig);
const componentWithElement = withDomElement(base);
```

The `withElement` enhancer adds:
- A DOM element with the specified tag
- Component and variant CSS classes
- Attributes
- Touch event handling for interactive elements

## Component Features

### Core Features

Feature enhancers are higher-order functions that add specific capabilities to components:

| Feature | Purpose | Example Usage |
|---------|---------|---------------|
| `withEvents` | Adds custom event system | `withEvents()(component)` |
| `withText` | Adds text content management | `withText({ text: 'Label' })(component)` |
| `withIcon` | Adds icon support | `withIcon({ icon: '<svg>...</svg>' })(component)` |
| `withDisabled` | Adds disabled state | `withDisabled({ disabled: true })(component)` |
| `withRipple` | Adds ripple effect | `withRipple({ ripple: true })(component)` |
| `withLifecycle` | Adds lifecycle methods | `withLifecycle()(component)` |
| `withVariant` | Adds variant styling | `withVariant({ variant: 'filled' })(component)` |
| `withSize` | Adds size variant | `withSize({ size: 'large' })(component)` |
| `withPosition` | Adds positioning | `withPosition({ position: 'start' })(component)` |
| `withInput` | Adds input element | `withInput({ name: 'email' })(component)` |
| `withTextInput` | Adds text input | `withTextInput({ type: 'email' })(component)` |
| `withTrack` | Adds track/thumb elements | `withTrack({ componentName: 'switch' })(component)` |

### Event Handling

The event system is a core feature that provides:
- Custom event emission and subscription
- Automatic cleanup on component destruction
- Event delegation and bubbling
- Enhanced event utilities

```typescript
// Basic usage
component.on('click', (e) => console.log('Clicked'));
component.off('click', handler);
component.emit('custom', { data: 'value' });

// Enhanced events
component
  .on('change', handleChange)
  .on('input', handleInput);
```

### Performance Optimizations

Performance features help manage expensive operations:

| Feature | Purpose | Example Usage |
|---------|---------|---------------|
| `withThrottle` | Limits event frequency | `withThrottle({ throttledEvents: { 'scroll': { handler, wait: 100 } } })` |
| `withDebounce` | Delays until activity stops | `withDebounce({ debouncedEvents: { 'input': { handler, wait: 300 } } })` |

### Gesture Recognition

Gesture features add touch interaction support:

| Feature | Purpose | Example Usage |
|---------|---------|---------------|
| `withGestures` | Adds comprehensive gestures | `withGestures({ gestureHandlers: { 'swipe': handler } })` |
| `withTapGesture` | Adds tap detection | `withTapGesture({ onTap: handler })` |
| `withSwipeGesture` | Adds swipe detection | `withSwipeGesture({ onSwipeLeft: handler })` |
| `withLongPressGesture` | Adds long press detection | `withLongPressGesture({ onLongPress: handler })` |
| `withPanGesture` | Adds pan/drag detection | `withPanGesture({ onPan: handler })` |
| `withPinchGesture` | Adds pinch-zoom detection | `withPinchGesture({ onPinch: handler })` |
| `withRotateGesture` | Adds rotation detection | `withRotateGesture({ onRotate: handler })` |

## Component Lifecycle

Components with `withLifecycle` have methods to manage their existence:

```typescript
// Lifecycle methods
component.lifecycle.mount();    // Mount component
component.lifecycle.unmount();  // Unmount component
component.lifecycle.destroy();  // Destroy and clean up

// Lifecycle events
component.lifecycle.onMount(() => console.log('Mounted'));
component.lifecycle.onUnmount(() => console.log('Unmounted'));
```

The lifecycle feature automatically handles:
- Cleanup of event listeners
- Removal of DOM elements
- Resource release
- Integration with other features

## Composition Utilities

### pipe

The `pipe` function is the primary composition utility:

```typescript
import { pipe } from 'mtrl/core/compose';

// Left-to-right function composition
const composed = pipe(
  fn1,
  fn2,
  fn3
);

// Usage
const result = composed(input);
// Equivalent to: fn3(fn2(fn1(input)))
```

### compose

The `compose` function works like `pipe` but in reverse (mathematical) order:

```typescript
import { compose } from 'mtrl/core/compose';

// Right-to-left function composition
const composed = compose(
  fn3,
  fn2,
  fn1
);

// Usage
const result = composed(input);
// Equivalent to: fn3(fn2(fn1(input)))
```

### transform

The `transform` function applies multiple transformations with a shared context:

```typescript
import { transform } from 'mtrl/core/compose';

const withName = (obj, ctx) => ({ ...obj, name: ctx.name });
const withAge = (obj, ctx) => ({ ...obj, age: ctx.age });

const createPerson = transform(withName, withAge);
const person = createPerson({}, { name: 'John', age: 30 });
// Result: { name: 'John', age: 30 }
```

## Component Interfaces

The composition system uses TypeScript interfaces to enforce contracts:

| Interface | Description |
|-----------|-------------|
| `Component` | Base component interface |
| `BaseComponent` | Component with prefix utilities |
| `ElementComponent` | Component with a DOM element |
| `EventComponent` | Component with event capabilities |
| `LifecycleComponent` | Component with lifecycle methods |
| `TextComponent` | Component with text content |
| `IconComponent` | Component with icon support |
| `DisabledComponent` | Component with disabled state |
| `RippleComponent` | Component with ripple effect |
| `InputComponent` | Component with input element |
| `TextInputComponent` | Component with text input |
| `CheckableComponent` | Component with checkable state |
| `TrackComponent` | Component with track/thumb elements |
| `LabelComponent` | Component with a label |
| `GestureComponent` | Component with gesture recognition |

## Example: Building a Button

Here's a complete example of building a button component:

```typescript
import { 
  pipe, 
  createBase, 
  withElement, 
  withEvents, 
  withText, 
  withIcon, 
  withRipple,
  withDisabled, 
  withVariant,
  withLifecycle
} from 'mtrl/core/compose';

const createButton = (config) => {
  // Create base configuration
  const baseConfig = {
    ...config,
    componentName: 'button',
    prefix: 'mtrl'
  };

  // Element configuration
  const elementConfig = {
    tag: 'button',
    attributes: { type: config.type || 'button' },
    className: config.class,
    interactive: true
  };

  // Create button through composition
  return pipe(
    createBase,
    withEvents(),
    withElement(elementConfig),
    withText(baseConfig),
    withIcon(baseConfig),
    withRipple({ ripple: true }),
    withDisabled(baseConfig),
    withVariant(baseConfig),
    withLifecycle()
  )(baseConfig);
};

// Usage
const button = createButton({
  text: 'Click Me',
  variant: 'filled',
  icon: '<svg>...</svg>',
  disabled: false
});

document.body.appendChild(button.element);

// Using the button API
button.text.setText('New Text');
button.disabled.disable();
button.on('click', () => console.log('Clicked'));
```

## Best Practices

### Composition Order

The order of composition matters. A recommended order is:

1. `createBase` - Start with a base component
2. `withEvents` - Add event system early for other features to use
3. `withElement` - Add the DOM element
4. UI Features - Add text, icons, etc.
5. Behavior Features - Add interactivity, states, etc.
6. `withLifecycle` - Add lifecycle management last to clean up other features

### Extensibility

To make components extensible, expose their enhancers:

```typescript
// Export both the component creator and its enhancers
export { createButton as default, withButtonBehavior };

// This allows others to extend your component
import createButton, { withButtonBehavior } from './button';
import { pipe, withCustomFeature } from 'mtrl/core/compose';

const createCustomButton = (config) => pipe(
  createButton,
  withCustomFeature(config)
)(config);
```

### Performance Considerations

- Use `withThrottle` or `withDebounce` for expensive event handlers
- Apply `withLifecycle` to ensure proper cleanup
- Use the `transform` utility for complex component state calculations
- Leverage `requestAnimationFrame` for DOM manipulations

## Advanced Usage

### Conditional Enhancement

Apply features conditionally using helper functions:

```typescript
import { pipe } from 'mtrl/core/compose';

// Helper for conditional enhancement
const when = (condition, enhancer) => 
  component => condition ? enhancer(component) : component;

// Usage
const createButton = (config) => pipe(
  createBase,
  withElement(elementConfig),
  when(config.hasIcon, withIcon(config)),
  when(config.hasRipple, withRipple({ ripple: true }))
)(config);
```

### Feature Composition

Combine multiple features into a single enhancer:

```typescript
// Combine multiple features
const withButtonFeatures = (config) => pipe(
  withText(config),
  withIcon(config),
  withRipple({ ripple: true }),
  withDisabled(config)
);

// Use combined features
const createButton = (config) => pipe(
  createBase,
  withElement(elementConfig),
  withButtonFeatures(config)
)(config);
```

### Custom Component Enhancers

Create custom enhancers for reusable behavior:

```typescript
// Create a custom enhancer
const withCustomBehavior = (config) => component => {
  // Get existing event system or add it
  const withEventCapability = component.on ? 
    c => c : 
    withEvents();
    
  const enhanced = withEventCapability(component);
  
  // Add custom behavior
  enhanced.customMethod = () => {
    // Implementation
    return enhanced;
  };
  
  // Setup initial state
  if (config.initialState) {
    enhanced.customMethod();
  }
  
  return enhanced;
};

// Use custom enhancer
const component = pipe(
  createBase,
  withElement(elementConfig),
  withCustomBehavior({ initialState: true })
)(config);
```

## Debugging Components

To debug components, inspect their composition structure:

```typescript
// Add debug logging
const withLogging = () => component => {
  console.log('Component structure:', component);
  
  // Log lifecycle events if available
  if (component.lifecycle) {
    const originalMount = component.lifecycle.mount;
    component.lifecycle.mount = () => {
      console.log('Component mounted');
      return originalMount.call(component.lifecycle);
    };
  }
  
  return component;
};

// Add to composition chain
const component = pipe(
  createBase,
  withElement(config),
  withFeatures(config),
  withLogging() // Add before using the component
)(config);
```

## Conclusion

The composition system provides a powerful, functional approach to building UI components. By composing small, focused enhancers, you can create complex components that are:

- **Maintainable**: Each feature is isolated and can be tested independently
- **Flexible**: Add or remove features as needed without breaking others
- **Reusable**: Enhancers can be shared across different components
- **Testable**: Pure functions are easy to test
- **Type-safe**: Full TypeScript support ensures type safety

This approach aligns with functional programming principles and promotes a clean separation of concerns, making your UI components more robust and easier to maintain over time.