# Component Composition Features

The composition system follows a functional programming approach, allowing you to build components by composing various features together.

## Overview

The composition system is based on the concept of Higher-Order Functions (HOF) that enhance a base component with additional capabilities. Each feature is implemented as a function that takes a configuration object and returns another function that applies the feature to a component.

The general pattern is:

```typescript
const withFeature = (config) => (component) => {
  // Enhance component with feature
  return enhancedComponent;
};
```

Features can be composed using the `pipe` function:

```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withEvents(),
  withText(config),
  withIcon(config),
  withLifecycle()
)(config);
```

## Core Features

### withEvents

Adds event handling capabilities to a component. It creates an event emitter that allows the component to emit and listen for custom events.

```typescript
withEvents(): <T extends BaseComponent>(component: T) => T & EventComponent
```

**Provided Capabilities:**
- `on(event: string, handler: Function)`: Subscribe to an event
- `off(event: string, handler: Function)`: Unsubscribe from an event
- `emit(event: string, data?: any)`: Emit an event with optional data

**Example:**
```typescript
const component = pipe(
  createBase,
  withEvents()
)(config);

component.on('click', (data) => console.log('Clicked:', data));
component.emit('click', { x: 10, y: 20 });
```

### withText

Adds text management to a component. Creates a text manager that handles setting and getting text content.

```typescript
withText<T extends TextConfig>(config: T): <C extends ElementComponent>(component: C) => C & TextComponent
```

**Configuration Options:**
- `text`: Initial text content
- `prefix`: CSS class prefix
- `componentName`: Component name for class generation

**Provided Capabilities:**
- `text.setText(text: string)`: Set the text content
- `text.getText()`: Get the current text content
- `text.getElement()`: Get the text DOM element

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withText({ text: 'Initial text' })
)(config);

component.text.setText('Updated text');
```

### withIcon

Adds icon management to a component. Creates an icon manager that handles setting and getting icon content.

```typescript
withIcon<T extends IconConfig>(config: T): <C extends ElementComponent>(component: C) => C & IconComponent
```

**Configuration Options:**
- `icon`: Icon HTML content (typically SVG)
- `iconPosition`: Position of the icon ('start' or 'end')
- `iconSize`: Size of the icon
- `prefix`: CSS class prefix
- `componentName`: Component name for class generation

**Provided Capabilities:**
- `icon.setIcon(html: string)`: Set the icon HTML content
- `icon.getIcon()`: Get the current icon HTML content
- `icon.getElement()`: Get the icon DOM element

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withIcon({ 
    icon: '<svg>...</svg>', 
    iconPosition: 'start' 
  })
)(config);

component.icon.setIcon('<svg>...</svg>');
```

### withVariant

Adds a variant class to a component. Useful for implementing different visual styles (filled, outlined, etc.).

```typescript
withVariant<T extends VariantConfig>(config: T): <C extends ElementComponent>(component: C) => C
```

**Configuration Options:**
- `variant`: Variant name (e.g., 'filled', 'outlined')
- `prefix`: CSS class prefix
- `componentName`: Component name for class generation

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withVariant({ variant: 'outlined' })
)(config);
```

### withSize

Adds a size class to a component. Useful for implementing different size variants (small, medium, large).

```typescript
withSize<T extends SizeConfig>(config: T): <C extends ElementComponent>(component: C) => C
```

**Configuration Options:**
- `size`: Size name (e.g., 'small', 'medium', 'large')
- `prefix`: CSS class prefix
- `componentName`: Component name for class generation

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withSize({ size: 'large' })
)(config);
```

### withPosition

Adds positioning functionality to a component. Useful for positioning components relative to each other.

```typescript
withPosition<T extends PositionConfig>(config: T): <C extends ElementComponent>(component: C) => C & PositionComponent
```

**Configuration Options:**
- `position`: Position value (e.g., 'start', 'end', 'top', 'bottom')
- `prefix`: CSS class prefix
- `componentName`: Component name for class generation

**Available Positions:**
- `LEFT`, `RIGHT`, `TOP`, `BOTTOM`
- `START`, `END`, `CENTER`

**Provided Capabilities:**
- `position.setPosition(newPosition: string)`: Change the position
- `position.getPosition()`: Get the current position

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withPosition({ position: 'start' })
)(config);

component.position.setPosition('end');
```

### withRipple

Adds Material Design ripple effect to a component. Creates a ripple controller that handles mounting and unmounting ripple effects.

```typescript
withRipple<T extends RippleFeatureConfig>(config: T): <C extends ElementComponent>(component: C) => C & RippleComponent
```

**Configuration Options:**
- `ripple`: Whether to enable ripple effect
- `rippleConfig`: Detailed configuration for the ripple effect
  - `duration`: Duration of the ripple animation in milliseconds
  - `timing`: Timing function for the animation
  - `opacity`: Opacity values for the ripple

**Provided Capabilities:**
- `ripple.mount(element: HTMLElement)`: Mount ripple effect to an element
- `ripple.unmount(element: HTMLElement)`: Unmount ripple effect from an element

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withRipple({ 
    ripple: true,
    rippleConfig: { 
      duration: 300,
      timing: 'ease-out'
    }
  })
)(config);
```

### withInput

Creates an input element and adds it to a component. Useful for checkbox, radio, and other input components.

```typescript
withInput<T extends InputConfig>(config: T): <C extends ElementComponent>(component: C) => C & InputComponent
```

**Configuration Options:**
- `name`: Input name attribute
- `checked`: Initial checked state
- `required`: Whether input is required
- `disabled`: Whether input is disabled
- `value`: Input value attribute
- `label` or `ariaLabel`: Accessibility label

**Provided Capabilities:**
- `input`: HTML input element
- `getValue()`: Get the current input value
- `setValue(value: string)`: Set the input value

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withInput({ 
    name: 'agreement',
    checked: false,
    required: true
  })
)(config);

component.setValue('accepted');
```

### withCheckable

Adds checked state management to a component with an input. Manages visual state and event emission for checked changes.

```typescript
withCheckable<T extends CheckableConfig>(config: T): <C extends InputComponent>(component: C) => C & CheckableComponent
```

**Configuration Options:**
- `checked`: Initial checked state

**Provided Capabilities:**
- `checkable.check()`: Check the component
- `checkable.uncheck()`: Uncheck the component
- `checkable.toggle()`: Toggle the checked state
- `checkable.isChecked()`: Get the current checked state

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withInput({ name: 'agreement' }),
  withCheckable({ checked: false })
)(config);

component.checkable.toggle();
```

### withStyle

Adds style classes to a component based on configuration. Useful for applying multiple style aspects at once.

```typescript
withStyle<T extends StyleConfig>(config: T): <C extends ElementComponent>(component: C) => C
```

**Configuration Options:**
- `variant`: Variant style to apply
- `size`: Size style to apply

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withStyle({ 
    variant: 'outlined',
    size: 'large'
  })
)(config);
```

### withTextInput

Enhances a component with text input functionality. Useful for textfields, search inputs, etc.

```typescript
withTextInput<T extends TextInputConfig>(config: T): <C extends ElementComponent>(component: C) => C & TextInputComponent
```

**Configuration Options:**
- `type`: Input type (text, password, etc.)
- `multiline`: Whether to use textarea instead of input
- `name`: Input name attribute
- `required`: Whether input is required
- `disabled`: Whether input is disabled
- `maxLength`: Maximum allowed length
- `pattern`: Input validation pattern
- `autocomplete`: Autocomplete setting
- `value`: Initial input value

**Provided Capabilities:**
- `input`: HTML input or textarea element
- `setValue(value: string)`: Set the input value
- `getValue()`: Get the current input value
- `setAttribute(name: string, value: string)`: Set an attribute
- `getAttribute(name: string)`: Get an attribute
- `removeAttribute(name: string)`: Remove an attribute

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withTextInput({ 
    type: 'password',
    required: true,
    maxLength: 20
  })
)(config);

component.setValue('secure123');
```

### withTextLabel

Adds a text label to a component. Useful for form controls, switches, etc.

```typescript
withTextLabel<T extends TextLabelConfig>(config: T): <C extends ElementComponent>(component: C) => C & LabelComponent
```

**Configuration Options:**
- `label`: Label text content
- `labelPosition`: Position of the label ('start' or 'end')
- `prefix`: CSS class prefix
- `componentName`: Component name for class generation

**Provided Capabilities:**
- `label.setText(text: string)`: Set the label text
- `label.getText()`: Get the current label text
- `label.getElement()`: Get the label DOM element

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withTextLabel({ 
    label: 'Agree to terms',
    labelPosition: 'end'
  })
)(config);

component.label.setText('Accept all terms and conditions');
```

### withTrack

Adds track and thumb elements to a component. Useful for sliders, switches, and other track-based components.

```typescript
withTrack<T extends TrackConfig>(config: T): <C extends ElementComponent>(component: C) => C & TrackComponent
```

**Configuration Options:**
- `prefix`: CSS class prefix
- `componentName`: Component name for class generation
- `icon`: Custom icon HTML or 'none'

**Provided Capabilities:**
- `track`: Track DOM element
- `thumb`: Thumb DOM element

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withTrack({ 
    prefix: 'mtrl',
    componentName: 'switch'
  })
)(config);
```

### withBadge

Adds badge functionality to a component. Creates and configures a badge component attached to the main component.

```typescript
withBadge<T extends BadgeConfig>(config: T): <C extends ElementComponent>(component: C) => C & BadgeComponent
```

**Configuration Options:**
- `badge`: Badge content to display (string or number)
- `badgeConfig`: Detailed configuration for the badge
  - `variant`: Badge style variant
  - `color`: Badge color
  - `size`: Badge size
  - `position`: Badge position
  - `max`: Maximum number to display before showing "+"
- `prefix`: CSS class prefix

**Provided Capabilities:**
- `badge`: Badge component instance

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withBadge({ 
    badge: 5,
    badgeConfig: { 
      position: 'top-right',
      color: 'error'
    }
  })
)(config);
```

## State Management Features

### withDisabled

Adds disabled state management to a component. Manages both visual disabled state and functionality disabling.

```typescript
withDisabled<T extends DisabledConfig>(config: T): <C extends ElementComponent>(component: C) => C & DisabledComponent
```

**Configuration Options:**
- `disabled`: Whether the component is initially disabled
- `componentName`: Component name for class generation

**Provided Capabilities:**
- `disabled.enable()`: Enable the component
- `disabled.disable()`: Disable the component
- `disabled.toggle()`: Toggle the disabled state
- `disabled.isDisabled()`: Get the current disabled state

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withDisabled({ disabled: false })
)(config);

component.disabled.disable();
```

### withLifecycle

Adds lifecycle management to a component. Tracks component mounting state and provides cleanup functionality.

```typescript
withLifecycle(): <T extends ElementComponent>(component: T) => T & LifecycleComponent
```

**Provided Capabilities:**
- `lifecycle.onMount(handler: () => void)`: Register mount event handler
- `lifecycle.onUnmount(handler: () => void)`: Register unmount event handler
- `lifecycle.mount()`: Mount the component
- `lifecycle.unmount()`: Unmount the component
- `lifecycle.isMounted()`: Check if component is mounted
- `lifecycle.destroy()`: Destroy the component and clean up resources

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withLifecycle()
)(config);

component.lifecycle.onMount(() => console.log('Component mounted'));
component.lifecycle.mount();
```

## Enhanced Event Handling

### withEnhancedEvents

Adds enhanced event handling capabilities to a component. Provides more powerful event management features than the basic `withEvents`.

```typescript
withEnhancedEvents(target?: HTMLElement): <C extends ElementComponent>(component: C) => C & EnhancedEventComponent
```

**Parameters:**
- `target`: Optional custom event target (defaults to component.element)

**Provided Capabilities:**
- `events.on(event: string, handler: Function)`: Add event listener
- `events.off(event: string, handler: Function)`: Remove event listener
- `events.addListeners(listeners: Record<string, Function>)`: Add multiple listeners
- `events.removeListeners(listeners: Record<string, Function>)`: Remove multiple listeners
- `events.once(event: string, handler: Function)`: Add one-time event handler
- `events.destroy()`: Clean up all event listeners
- `on(event: string, handler: Function)`: Shorthand for events.on
- `off(event: string, handler: Function)`: Shorthand for events.off

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withEnhancedEvents()
)(config);

component.events.addListeners({
  'click': (e) => console.log('Clicked'),
  'focus': (e) => console.log('Focused')
});

component.events.once('hover', (e) => console.log('First hover only'));
```

## Performance Features

### withThrottle

Adds throttled event handling capabilities to a component. Limits how often an event handler can be called.

```typescript
withThrottle(config: ThrottleConfig): <C extends ElementComponent>(component: C) => C & ThrottleComponent
```

**Configuration Options:**
- `throttledEvents`: Record of events with throttle settings
  - `handler`: Event handler function
  - `wait`: Throttle interval in milliseconds
  - `options`: Throttle options (leading, trailing)

**Provided Capabilities:**
- `addThrottledEvent(event, handler, wait, options)`: Add throttled event
- `removeThrottledEvent(event)`: Remove throttled event

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withThrottle({
    throttledEvents: {
      'scroll': {
        handler: handleScroll,
        wait: 100,
        options: { trailing: true }
      }
    }
  })
)(config);

component.addThrottledEvent('resize', handleResize, 200);
```

### withDebounce

Adds debounced event handling capabilities to a component. Delays calling the event handler until after a specified wait time.

```typescript
withDebounce(config: DebounceConfig): <C extends ElementComponent>(component: C) => C & DebounceComponent
```

**Configuration Options:**
- `debouncedEvents`: Record of events with debounce settings
  - `handler`: Event handler function
  - `wait`: Debounce delay in milliseconds
  - `options`: Debounce options (leading, maxWait)

**Provided Capabilities:**
- `addDebouncedEvent(event, handler, wait, options)`: Add debounced event
- `removeDebouncedEvent(event)`: Remove debounced event

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withDebounce({
    debouncedEvents: {
      'input': {
        handler: handleInput,
        wait: 300
      }
    }
  })
)(config);

component.addDebouncedEvent('search', handleSearch, 500);
```

## Gesture Features

### withGestures

Adds comprehensive gesture recognition capabilities to a component. Handles various touch gestures like tap, swipe, pinch, etc.

```typescript
withGestures(config: GestureFeatureConfig): <C extends ElementComponent>(component: C) => C & GesturesComponent
```

**Configuration Options:**
- `enableGestures`: Whether to enable gesture recognition initially
- `gestureHandlers`: Initial gesture event handlers
- Other gesture-specific options (swipeThreshold, etc.)

**Provided Capabilities:**
- `gestures`: Gesture manager instance
- `onGesture(eventType, handler)`: Add gesture event handler
- `offGesture(eventType, handler)`: Remove gesture event handler
- `isGestureSupported(gestureType)`: Check if gesture is supported
- `enableGestures()`: Enable gesture recognition
- `disableGestures()`: Disable gesture recognition

**Example:**
```typescript
const component = pipe(
  createBase,
  withElement(elementConfig),
  withGestures({
    gestureHandlers: {
      'tap': handleTap,
      'swipeleft': handleSwipeLeft
    }
  })
)(config);

component.onGesture('pinch', handlePinch);
```

### Individual Gesture Features

For more lightweight gesture handling, you can use specific gesture features:

#### withTapGesture

```typescript
withTapGesture(config: TapGestureConfig): <C extends ElementComponent>(component: C) => C & TapGestureComponent
```

**Provided Capabilities:**
- `onTap(handler)`, `offTap(handler)`
- `enableTap()`, `disableTap()`

#### withSwipeGesture

```typescript
withSwipeGesture(config: SwipeGestureConfig): <C extends ElementComponent>(component: C) => C & SwipeGestureComponent
```

**Provided Capabilities:**
- `onSwipe(handler)`, `onSwipeLeft(handler)`, `onSwipeRight(handler)`, etc.
- `offSwipe(handler)`, `offSwipeLeft(handler)`, etc.
- `enableSwipe()`, `disableSwipe()`

#### withLongPressGesture

```typescript
withLongPressGesture(config: LongPressGestureConfig): <C extends ElementComponent>(component: C) => C & LongPressGestureComponent
```

**Provided Capabilities:**
- `onLongPress(handler)`, `offLongPress(handler)`
- `enableLongPress()`, `disableLongPress()`

#### withPanGesture

```typescript
withPanGesture(config: PanGestureConfig): <C extends ElementComponent>(component: C) => C & PanGestureComponent
```

**Provided Capabilities:**
- `onPanStart(handler)`, `onPan(handler)`, `onPanEnd(handler)`
- `offPanStart(handler)`, `offPan(handler)`, `offPanEnd(handler)`
- `enablePan()`, `disablePan()`

#### withPinchGesture

```typescript
withPinchGesture(config: PinchGestureConfig): <C extends ElementComponent>(component: C) => C & PinchGestureComponent
```

**Provided Capabilities:**
- `onPinch(handler)`, `onPinchStart(handler)`, `onPinchEnd(handler)`
- `offPinch(handler)`, `offPinchStart(handler)`, `offPinchEnd(handler)`
- `enablePinch()`, `disablePinch()`
- `isPinchSupported()`

#### withRotateGesture

```typescript
withRotateGesture(config: RotateGestureConfig): <C extends ElementComponent>(component: C) => C & RotateGestureComponent
```

**Provided Capabilities:**
- `onRotate(handler)`, `onRotateStart(handler)`, `onRotateEnd(handler)`
- `offRotate(handler)`, `offRotateStart(handler)`, `offRotateEnd(handler)`
- `enableRotate()`, `disableRotate()`
- `isRotateSupported()`

## Feature Composition Best Practices

1. **Order Matters**: Some features depend on others. For example, `withCheckable` requires `withInput` to be applied first.

2. **Base Components First**: Always start with `createBase` and `withElement` before adding other features.

3. **State Management Later**: Apply state management features like `withDisabled` and `withLifecycle` after UI features.

4. **Lifecycle Last**: `withLifecycle` is typically applied last to ensure proper cleanup of all added features.

5. **Avoid Redundancy**: Don't apply multiple features that provide the same capability. For example, don't use both `withEvents` and `withEnhancedEvents`.

6. **Performance Considerations**: For high-frequency events, consider using `withThrottle` or `withDebounce`.

7. **Gesture Handling**: Use the specific gesture features (`withTapGesture`, etc.) for better performance if you only need one gesture type.

## Component API Pattern

When creating components, follow this pattern to ensure a consistent API:

1. Use feature composition to build the component internally
2. Create a public API that exposes only the necessary methods
3. Use method chaining for a fluent interface
4. Implement proper cleanup through the lifecycle feature

Example:

```typescript
// Internal implementation
const createComponent = (config) => {
  try {
    const component = pipe(
      createBase,
      withElement(elementConfig),
      withEvents(),
      withText(config),
      withVariant(config),
      withDisabled(config),
      withLifecycle()
    )(config);
    
    // Expose public API
    return withAPI(getApiConfig(component))(component);
  } catch (error) {
    console.error('Component creation error:', error);
    throw new Error(`Failed to create component: ${error.message}`);
  }
};
```

This ensures a clean and consistent public API while keeping the internal implementation flexible and modular.