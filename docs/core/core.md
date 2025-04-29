# Core Library Documentation

The core library provides the fundamental building blocks for creating efficient, composable UI components with the mtrl design system. This documentation covers the main modules, utilities, and composition patterns that serve as the foundation for all components.

## Overview

The mtrl core library is designed around principles of functional composition, immutability, and minimal dependencies. Instead of relying on class inheritance, components are built through a pipeline of composable functions, each adding a specific capability or feature.

Key advantages of this approach:

- **Composable**: Features can be mixed and matched per component
- **Testable**: Each feature can be tested in isolation
- **Lightweight**: Only include what you need
- **Type-safe**: Full TypeScript support
- **Performant**: Optimized for minimal overhead

The core library provides several key modules:

- **Composition System**: Functions for creating and enhancing components
- **DOM Utilities**: Lightweight DOM manipulation helpers
- **State Management**: Event and state handling tools
- **Layout System**: Utilities for creating layouts and structures
- **Collection Module**: Tools for data management and virtualized lists
- **Gesture System**: Touch and pointer event handling
- **Utility Functions**: Common helpers and performance optimizations

## Composition System

The composition system lies at the heart of the mtrl component architecture, providing a functional approach to building UI components.

### Core Concepts

- **Component Factories**: Each component has a factory function (e.g., `createButton`) that applies a series of enhancers
- **Feature Enhancers**: Higher-order functions that add specific capabilities (e.g., `withEvents`, `withText`)
- **Piping**: Functions that combine enhancers into a processing pipeline
- **Immutability**: Each enhancement returns a new component without modifying the input

### Functional Composition Utilities

- **pipe**: Performs left-to-right function composition
- **compose**: Performs right-to-left function composition (mathematical order)
- **transform**: Applies multiple transformations with a shared context

### Component Creation Process

1. Create a base component with configuration
2. Add a DOM element with appropriate attributes
3. Enhance with UI features (text, icons, etc.)
4. Enhance with behavioral features (events, states, etc.)
5. Add lifecycle management for cleanup

### Component Interfaces

The composition system defines key interfaces that describe component capabilities:

- **BaseComponent**: The core interface with configuration and utilities
- **ElementComponent**: Adds DOM element support
- **EventComponent**: Adds event handling capabilities
- **LifecycleComponent**: Adds lifecycle management
- **TextComponent**: Adds text content management
- **IconComponent**: Adds icon support
- **DisabledComponent**: Adds disabled state management
- **RippleComponent**: Adds ripple effect
- **InputComponent**: Adds input element support

## DOM Utilities

The DOM utilities provide a lightweight layer over native DOM APIs for element creation, attribute manipulation, and event handling. These utilities are performance-optimized and designed for minimal overhead.

### Key Features

- **Element Creation**: Simplified creation of DOM elements with attributes, classes, and content
- **Attribute Management**: Utilities for setting, getting, and removing attributes
- **Class Manipulation**: Functions for adding, removing, and toggling classes with automatic prefixing
- **Event Handling**: Advanced event management with proper cleanup and memory leak prevention
- **DOM Fragments**: Batch DOM operations using DocumentFragment for performance
- **DOM Recycling**: Reuse DOM elements to minimize creation and garbage collection

### Performance Optimizations

- **Batching**: Multiple DOM operations are batched together
- **Throttling**: High-frequency events are throttled for performance
- **Passive Events**: Touch events use passive listeners where appropriate
- **Minimal Object Creation**: Careful memory management to reduce GC pressure
- **Class List Operations**: Optimized class manipulation with single calls

## State Management

The state management utilities provide lightweight tools for handling component state and events.

### Emitter

A minimal event system for subscribing to and emitting events:

- Subscribe to events with `on`
- Unsubscribe with `off` or the returned function
- Emit events with `emit`
- Clean up all subscribers with `clear`

### Store

A small but powerful state container:

- Holds component state with change notification
- Supports derived state computation
- Provides middleware for intercepting state changes
- Allows selective observation via `subscribe`
- Supports selective updates via `setState`

### Lifecycle

Manages component lifecycle:

- Mount and unmount events
- State tracking for mounted status
- Cleanup on destruction
- Automatic integration with other features

## Layout System

The layout system provides tools for creating flexible, responsive layouts.

### Layout Types

- **Grid**: CSS Grid-based layout with column configuration
- **Stack**: Vertical column of elements with spacing
- **Row**: Horizontal row of elements with alignment and wrapping
- **Masonry**: Masonry-style layout for card-like items
- **Split**: Two-column split layout with configurable ratio
- **Sidebar**: Sidebar with main content and position control

### Layout Features

- **Responsive Grids**: Support for different column counts at different breakpoints
- **Layout Items**: Individual item configuration for sizing and placement
- **Gap Controls**: Consistent spacing system
- **Alignment**: Control for horizontal and vertical alignment
- **Mobile Adaptations**: Special handling for mobile viewports
- **Nesting**: Support for nested layouts

### Schema Formats

- **Array-based**: Compact representation with implicit structure
- **Object-based**: Explicit object structure with named children
- **JSX**: Support for JSX syntax for more readable layouts
- **HTML String**: Conversion from HTML strings to layouts

## Collection Module

The Collection module provides tools for managing, transforming, and displaying collections of data.

### Collection Management

- **Data Storage**: Efficient storage of items indexed by ID
- **Querying**: Filter collections with predicates
- **Sorting**: Sort collections with custom compare functions
- **Observation**: Subscribe to collection changes
- **Batching**: Efficient batch operations for adding, updating, and removing items
- **Validation**: Validate items before adding to collection
- **Transformation**: Transform items to a consistent format

### List Manager

Specialized tools for list rendering:

- **Virtual Rendering**: Only render visible items in a viewport
- **DOM Recycling**: Reuse DOM elements for scrolling performance
- **Pagination**: Support for cursor-based, page-based, and offset-based pagination
- **Dynamic Heights**: Handle variable-height items
- **Scroll Optimization**: Efficient scroll handling with throttling and intersection observers
- **API Integration**: Built-in support for loading from APIs

### Route Adapter

Connectivity for REST APIs:

- **Endpoint Management**: Configure endpoints for CRUD operations
- **Query Transformation**: Convert queries to URL parameters
- **Response Parsing**: Normalize API responses
- **Caching**: Cache responses to reduce network calls
- **Error Handling**: Consistent error reporting
- **Request Aborting**: Cancel superseded requests
- **Pagination Support**: Handle various pagination strategies

## Gesture System

The gesture system provides tools for recognizing and handling touch and pointer gestures.

### Gesture Types

- **Tap**: Single and multi-tap detection
- **Swipe**: Directional swipes with velocity tracking
- **Long Press**: Press and hold detection
- **Pan**: Dragging gesture with delta tracking
- **Pinch**: Two-finger pinch gesture with scale tracking
- **Rotate**: Two-finger rotation gesture with angle tracking

### Gesture Features

- **Multi-Touch**: Support for multiple simultaneous touches
- **Cross-Device**: Works on touch and pointer devices
- **Configuration**: Adjust thresholds and timing
- **Velocity Tracking**: Track gesture speed for inertia effects
- **Event Normalization**: Consistent event properties across devices
- **Passive Support**: Uses passive event listeners where appropriate

### Integration Methods

- **withGestures**: Add comprehensive gesture support to a component
- **Specialized Enhancers**: Add specific gestures like `withTapGesture`
- **Manual Detection**: Use the detection functions directly for custom handling

## Utility Functions

The utility functions provide common helpers for various tasks.

### Object Utilities

- **isObject**: Check if a value is a plain object
- **byString**: Access nested properties with a string path
- **transform**: Apply multiple transformations to an object
- **validateConfig**: Validate configuration against a schema

### String Utilities

- **classNames**: Join class names with filtering
- **normalizeClasses**: Normalize class names from various formats
- **createClassName**: Create a BEM-style class name

### Mobile Utilities

- **hasTouchSupport**: Check if the device supports touch
- **isMobileDevice**: Detect if the current device is mobile
- **normalizeEvent**: Normalize touch and mouse events
- **getTouchCoordinates**: Get coordinates from various event types

### Validation

- **validateConfig**: Validate configuration against a schema
- **validateValue**: Validate a single value against a rule
- **applyDefaults**: Apply default values from a schema

## Performance Optimizations

The core library includes numerous performance optimizations.

### DOM Operations

- **Batch Updates**: Use DocumentFragment for multiple insertions
- **Element Recycling**: Reuse elements instead of creating new ones
- **Minimal Reflows**: Group operations to minimize layout recalculations
- **Attribute Batching**: Set multiple attributes in a single operation
- **Shadow DOM Consideration**: Support for shadow DOM when needed

### Event Handling

- **Delegation**: Use event delegation for multiple elements
- **Throttling**: Limit frequency of high-rate events like scroll
- **Passive Listeners**: Use passive event listeners for touch events
- **Cleanup**: Proper removal of listeners to prevent memory leaks
- **Efficient Handlers**: Optimize event handler performance

### Memory Management

- **Object Pooling**: Reuse objects for frequent operations
- **Minimal Closures**: Carefully manage closure creation
- **Weak References**: Use WeakMap/WeakSet for object references
- **Memory Profiling**: Regular memory analysis to identify leaks
- **Garbage Collection Consideration**: Minimize pressure on GC

## Best Practices

### Component Composition

- **Feature Order**: Organize enhancers in a logical order
- **Base Components First**: Start with createBase and withElement
- **Events Early**: Add event handling early for other features to use
- **State Later**: Add state management after UI features
- **Lifecycle Last**: Add lifecycle management last for proper cleanup

### Event Management

- **Cleanup**: Always remove event listeners when done
- **Delegation**: Use event delegation for lists of similar items
- **Throttling**: Throttle high-frequency events
- **Passive Listeners**: Use passive listeners for non-blocking scroll
- **Context Preservation**: Maintain proper this context in handlers

### State Management

- **Immutability**: Treat state as immutable
- **Single Source**: Avoid duplicating state
- **Minimal Updates**: Update only what changed
- **Batching**: Batch related state changes
- **Derived Values**: Compute derived values instead of storing them