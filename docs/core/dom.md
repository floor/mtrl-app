# Core DOM Module Documentation

The DOM module provides a lightweight, performance-optimized set of utilities for DOM manipulation. It abstracts common DOM operations with a focus on minimal overhead, consistent behavior, and memory efficiency.

## Overview

The DOM module enables efficient manipulation of DOM elements through a functional API that emphasizes immutability and composition. Instead of modifying elements directly, many utilities return the modified element, allowing for method chaining and functional composition.

Key features of the DOM module include:

- Simplified element creation with comprehensive options
- Performance-optimized class manipulation with automatic prefixing
- Attribute management utilities
- Enhanced event handling with proper cleanup
- Memory-efficient operations to minimize garbage collection
- Support for functional composition patterns

## Module Structure

The DOM module is organized into several focused submodules:

- **create.ts**: Element creation utilities
- **attributes.ts**: Attribute manipulation functions
- **classes.ts**: Class manipulation with prefix handling
- **events.ts**: Enhanced event handling system
- **utils.ts**: Additional DOM utility functions

## Element Creation

The `createElement` function provides a streamlined way to create DOM elements with a single call, handling various properties like attributes, classes, text content, and event forwarding.

### Key Features

- Create elements with a single function call
- Automatic class prefixing with consistent naming
- Support for both prefixed and raw (unprefixed) classes
- Direct dataset property setting
- Event forwarding with conditional execution
- Automatic DOM insertion
- Support for container attachment

### Usage Patterns

Common patterns for element creation include:

- Basic elements with text content
- Elements with class names (automatically prefixed)
- Elements with attributes and event forwarding
- Composite elements with complex structure
- Integration with component context

## Class Manipulation

The class manipulation utilities provide optimized methods for working with element classes, with automatic prefixing to maintain consistent naming conventions.

### Key Features

- Performance-optimized class operations
- Automatic prefixing of class names
- Support for arrays of classes
- Batch operations for better performance
- Chainable API for method composition

### Utility Functions

The module provides four main class manipulation functions:

- **addClass**: Adds classes to an element with automatic prefixing
- **removeClass**: Removes classes from an element with prefix handling
- **toggleClass**: Toggles classes on an element
- **hasClass**: Checks if an element has specified classes

All these functions accept multiple class arguments in various formats (strings, arrays, space-separated).

## Attribute Manipulation

The attribute utilities provide simplified methods for managing element attributes.

### Key Features

- Batch attribute operations
- Type conversion handling
- Chainable API for method composition
- Null/undefined handling

### Utility Functions

The module provides two main attribute manipulation functions:

- **setAttributes**: Sets multiple attributes on an element
- **removeAttributes**: Removes multiple attributes from an element

## Event Handling

The event handling system provides enhanced event management with proper cleanup and error handling.

### Key Features

- Event handler registration with options support
- Centralized cleanup to prevent memory leaks
- Error boundary around handlers for stability
- Support for pausing and resuming event listeners
- Handler existence checking

### EventManager Interface

The `createEventManager` function returns an object implementing the `EventManager` interface, which provides methods for:

- Adding event listeners with `on()`
- Removing event listeners with `off()`
- Pausing all listeners with `pause()`
- Resuming listeners with `resume()`
- Cleaning up all listeners with `destroy()`
- Getting active handlers with `getHandlers()`
- Checking handler existence with `hasHandler()`

## Functional Composition

The DOM module supports functional composition patterns through higher-order functions that transform elements:

### Higher-Order Functions

- **withAttributes**: Adds attributes to an element
- **withClasses**: Adds classes to an element
- **withContent**: Adds content to an element

These functions follow a consistent pattern of accepting configuration and returning a function that transforms an element, enabling functional composition.

## Performance Optimizations

The DOM module includes several performance optimizations:

### Class Operations

- Uses `classList.add(...classes)` for batch operations
- Early returns for empty inputs
- Minimizes array operations with direct loops
- Caches prefix string for faster concatenation
- Uses a single DOM operation for multiple classes

### Event Handling

- Wraps handlers with error boundaries to prevent unhandled exceptions
- Uses unique handler IDs to avoid duplicate registrations
- Provides pause/resume capabilities to temporarily disable handlers
- Ensures proper cleanup to prevent memory leaks

### Element Creation

- Optimizes attribute setting with a single loop
- Efficient class name normalization and prefixing
- Handles raw class names without redundant processing
- Conditional processing to avoid unnecessary operations

## Memory Management

The DOM module includes several features to minimize memory leaks:

### Event Handler Cleanup

The module tracks registered event handlers and provides a `removeEventHandlers` function to clean them up, ensuring proper removal of all handlers when an element is no longer needed.

### Handler Storage

Event handlers are stored in a weak association with elements using the `__eventHandlers` property, enabling automatic cleanup when elements are garbage collected.

### Resource Allocation

The module minimizes object creation to reduce garbage collection pressure, reusing objects and arrays where possible.

## Best Practices

When working with the DOM module, consider these best practices:

1. **Use Composition**: Combine utilities with composition for complex operations
2. **Batch Operations**: Group multiple operations for better performance
3. **Cleanup Resources**: Always call `destroy()` on event managers and `removeEventHandlers()` on elements
4. **Class Naming**: Follow the library's class naming convention with prefixed names
5. **Error Handling**: Wrap complex DOM operations in try/catch blocks
6. **Element References**: Avoid creating circular references between elements and objects
7. **Performance Critical Sections**: Use the optimized batch operations in performance-critical code

## Integration with Component System

The DOM module is designed to integrate seamlessly with the component composition system:

1. **Element Creation**: Components use `createElement` for their DOM elements
2. **Event Handling**: Components use `createEventManager` for event management
3. **Class Manipulation**: Components use `addClass`, `removeClass`, etc. for style changes
4. **Attribute Management**: Components use `setAttributes` for property updates
5. **Cleanup**: Components call `removeEventHandlers` during destruction

## Browser Compatibility

The DOM module uses modern DOM APIs with wide browser support, including:

- `classList` for class manipulation
- `addEventListener` with options parameter
- `dataset` for data attributes
- `element.closest()` for ancestor matching

These APIs are supported in all modern browsers (Chrome, Firefox, Safari, Edge).