# Progress Component

The Progress component provides a Material Design 3 compliant progress indicator that shows the completion progress of a task or process. It uses high-performance canvas rendering to deliver smooth animations and supports both determinate and indeterminate states across linear and circular variants.

## Overview

Progress indicators are commonly used for:

- Loading content or data
- Form submissions and file uploads
- Long-running operations
- Task completion tracking
- Video/audio buffering states

The component follows Material Design 3 guidelines with support for various variants (linear, circular), shapes (line, wavy), thickness options, and smooth animations powered by canvas rendering for optimal performance.

## Import

```javascript
import { createProgress } from 'mtrl';
```

## Basic Usage

```javascript
// Create a basic linear progress bar
const progress = createProgress({
  variant: 'linear',
  value: 42,
  max: 100
});

// Add to your page
document.querySelector('.loading-container').appendChild(progress.element);

// Update progress value
progress.setValue(75);

// Listen for completion
progress.on('complete', () => {
  console.log('Task completed!');
});
```

## Configuration

The Progress component accepts the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `'linear' \| 'circular'` | `'linear'` | Visual style of the progress indicator |
| `value` | `number` | `0` | Initial progress value (0 to max) |
| `max` | `number` | `100` | Maximum progress value |
| `buffer` | `number` | `0` | Buffer value for linear progress (e.g., video buffering) |
| `indeterminate` | `boolean` | `false` | Whether progress shows animation without specific value |
| `thickness` | `'thin' \| 'thick' \| number` | `'thin'` | Thickness of the progress track (thin=4px, thick=8px, or custom pixels) |
| `shape` | `'line' \| 'wavy'` | `'line'` | Shape of progress animation (works for both linear and circular variants) |
| `size` | `number` | `48` | Size of circular progress in pixels (24-240, circular variant only) |
| `showLabel` | `boolean` | `false` | Whether to show percentage label |
| `disabled` | `boolean` | `false` | Whether the progress indicator is initially disabled |
| `class` | `string` | `undefined` | Additional CSS classes to add to the progress component |
| `labelFormatter` | `function` | `undefined` | Custom label formatter function |
| `prefix` | `string` | `'mtrl'` | Prefix for CSS class names |

## Component API

The Progress component provides the following methods:

### Value Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getValue()` | none | `number` | Gets the current progress value |
| `setValue(value, animate?)` | `value: number, animate?: boolean` | `ProgressComponent` | Sets the progress value. If `animate` is `true` (default), changes are animated over 300ms. If `false`, changes are immediate. |
| `getMax()` | none | `number` | Gets the maximum progress value |

### Buffer Methods (Linear Only)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getBuffer()` | none | `number` | Gets the current buffer value |
| `setBuffer(value)` | `value: number` | `ProgressComponent` | Sets the buffer value for buffering indicators |

### State Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `enable()` | none | `ProgressComponent` | Enables the progress indicator |
| `disable()` | none | `ProgressComponent` | Disables the progress indicator |
| `isDisabled()` | none | `boolean` | Checks if the component is disabled |
| `setIndeterminate(state)` | `state: boolean` | `ProgressComponent` | Sets indeterminate state (shows animation) |
| `isIndeterminate()` | none | `boolean` | Checks if the component is in indeterminate state |

### Appearance Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setThickness(thickness)` | `thickness: 'thin' \| 'thick' \| number` | `ProgressComponent` | Sets the thickness of the progress track |
| `getThickness()` | none | `number` | Gets the current thickness value in pixels |
| `setShape(shape)` | `shape: 'line' \| 'wavy'` | `ProgressComponent` | Sets the shape (works for both linear and circular variants) |
| `getShape()` | none | `'line' \| 'wavy'` | Gets the current shape |

### Label Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `showLabel()` | none | `ProgressComponent` | Shows the percentage label |
| `hideLabel()` | none | `ProgressComponent` | Hides the percentage label |
| `setLabelFormatter(formatter)` | `formatter: (value: number, max: number) => string` | `ProgressComponent` | Sets custom label formatter |

### Event Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `on(event, handler)` | `event: string, handler: Function` | `ProgressComponent` | Adds an event listener |
| `off(event, handler)` | `event: string, handler: Function` | `ProgressComponent` | Removes an event listener |

### Style Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `addClass(...classes)` | `...classes: string[]` | `ProgressComponent` | Adds CSS classes to the progress element |

### Lifecycle Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `destroy()` | none | `void` | Destroys the progress component and cleans up resources |

## Events

The Progress component emits the following events:

| Event | Description | Data |
|-------|-------------|------|
| `change` | Fires when progress value changes | `{ value: number, max: number }` |
| `complete` | Fires when progress reaches 100%. **Note:** With animated value changes (default), this event fires after the animation completes (~300ms). With immediate value changes (`setValue(100, false)`), it fires immediately. | `{ value: number, max: number }` |

## Examples

### Basic Progress Variants

```javascript
// Linear determinate progress
const linearProgress = createProgress({
  variant: 'linear',
  value: 30,
  max: 100
});

// Circular determinate progress
const circularProgress = createProgress({
  variant: 'circular',
  value: 65,
  max: 100
});

// Indeterminate linear progress (loading animation)
const loadingProgress = createProgress({
  variant: 'linear',
  indeterminate: true
});

// Indeterminate circular progress (spinner)
const spinner = createProgress({
  variant: 'circular',
  indeterminate: true
});
```

### Progress with Labels

```javascript
const labeledProgress = createProgress({
  variant: 'linear',
  value: 42,
  showLabel: true
});

// Custom label formatter
const customProgress = createProgress({
  variant: 'linear',
  value: 7,
  max: 10,
  showLabel: true,
  labelFormatter: (value, max) => `${value} of ${max} items`
});
```

### Different Thickness Options

```javascript
// Thin progress (4px)
const thinProgress = createProgress({
  variant: 'linear',
  thickness: 'thin',
  value: 50
});

// Thick progress (8px)
const thickProgress = createProgress({
  variant: 'linear',
  thickness: 'thick',
  value: 50
});

// Custom thickness (12px)
const customThickness = createProgress({
  variant: 'linear',
  thickness: 12,
  value: 50
});
```

### Wavy Animated Progress

```javascript
// Wavy linear progress
const wavyProgress = createProgress({
  variant: 'linear',
  shape: 'wavy',
  value: 60
});

// Wavy circular progress
const wavyCircular = createProgress({
  variant: 'circular',
  shape: 'wavy',
  value: 60,
  size: 120
});

// Wavy indeterminate progress
const wavyLoading = createProgress({
  variant: 'linear',
  shape: 'wavy',
  indeterminate: true
});

// Wavy circular indeterminate
const wavySpinner = createProgress({
  variant: 'circular',
  shape: 'wavy',
  indeterminate: true
});
```

### Circular Progress with Custom Size

```javascript
// Small circular progress (24px)
const smallCircular = createProgress({
  variant: 'circular',
  size: 24,
  value: 75
});

// Large circular progress (120px)
const largeCircular = createProgress({
  variant: 'circular',
  size: 120,
  value: 75
});
```

### Buffer Progress (Video/Audio Loading)

```javascript
const bufferProgress = createProgress({
  variant: 'linear',
  value: 30,        // Current playback position
  buffer: 60,       // Amount buffered ahead
  max: 100
});

// Update as video plays and buffers
setInterval(() => {
  bufferProgress.setValue(bufferProgress.getValue() + 1);
  if (Math.random() > 0.7) {
    bufferProgress.setBuffer(bufferProgress.getBuffer() + 2);
  }
}, 1000);
```

### File Upload Progress

```javascript
const uploadProgress = createProgress({
  variant: 'linear',
  value: 0,
  showLabel: true,
  labelFormatter: (value, max) => `${Math.round(value)}% uploaded`
});

// Simulate file upload
async function uploadFile(file) {
  uploadProgress.setValue(0);
  uploadProgress.setIndeterminate(false);
  
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 10) {
    await new Promise(resolve => setTimeout(resolve, 200));
    uploadProgress.setValue(i);
  }
}

uploadProgress.on('complete', () => {
  console.log('Upload completed!');
  setTimeout(() => {
    uploadProgress.hideLabel();
  }, 2000);
});
```

### Immediate vs Animated Updates

```javascript
const progress = createProgress({
  variant: 'linear',
  value: 0,
  showLabel: true
});

// Animated update (default) - smooth 300ms transition
progress.setValue(50);  // Same as setValue(50, true)

// Immediate update - no animation
progress.setValue(50, false);

// Real-time data example with immediate updates
function updateCPUUsage() {
  const cpuUsage = getCPUUsage();
  // Use immediate update for real-time data
  progress.setValue(cpuUsage, false);
}
setInterval(updateCPUUsage, 100);

// File upload with immediate updates
function onUploadProgress(event) {
  const percentComplete = (event.loaded / event.total) * 100;
  // Immediate update for smooth real-time progress
  progress.setValue(percentComplete, false);
}

// User interaction with animated update
button.onclick = () => {
  // Animated update for better UX on user actions
  progress.setValue(100);
};
```

### Task Progress with Dynamic States

```javascript
const taskProgress = createProgress({
  variant: 'linear',
  value: 0,
  showLabel: true
});

async function runLongTask() {
  // Start with indeterminate state
  taskProgress.setIndeterminate(true);
  taskProgress.setLabelFormatter(() => 'Initializing...');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Switch to determinate progress
  taskProgress.setIndeterminate(false);
  taskProgress.setLabelFormatter((value, max) => 
    `Processing: ${Math.round(value)}% complete`
  );
  
  // Simulate task progress
  for (let i = 0; i <= 100; i += 5) {
    await new Promise(resolve => setTimeout(resolve, 100));
    taskProgress.setValue(i);
  }
}

taskProgress.on('complete', () => {
  taskProgress.setLabelFormatter(() => 'Task completed!');
});
```

### Multiple Progress Indicators

```javascript
const progressContainer = document.querySelector('.progress-list');

const tasks = ['Downloading files', 'Processing data', 'Generating report'];
const progressBars = tasks.map((task, index) => {
  const progress = createProgress({
    variant: 'linear',
    value: 0,
    showLabel: true,
    labelFormatter: (value) => `${task}: ${Math.round(value)}%`
  });
  
  progressContainer.appendChild(progress.element);
  return progress;
});

// Simulate multiple concurrent tasks
progressBars.forEach((progress, index) => {
  setTimeout(() => {
    const interval = setInterval(() => {
      const newValue = progress.getValue() + Math.random() * 10;
      progress.setValue(Math.min(newValue, 100));
      
      if (progress.getValue() >= 100) {
        clearInterval(interval);
      }
    }, 200);
  }, index * 500);
});
```

## Functional Composition

The Progress component is built using functional composition, combining multiple features:

### Core Features

- **Base Component (`createBase`)**: Provides the foundation with component creation utilities.
- **Element Creation (`withElement`)**: Creates the DOM container element with proper attributes and classes.
- **Event Handling (`withEvents`)**: Enables event listening and emission.
- **Variant Styling (`withVariant`)**: Applies visual styling variants like linear or circular.
- **State Management (`withState`)**: Manages component state including value, buffer, and indeterminate state.
- **Canvas Rendering (`withCanvas`)**: High-performance canvas-based rendering for smooth animations.
- **Disabled State (`withDisabled`)**: Manages the disabled state of the progress indicator.
- **Lifecycle Management (`withLifecycle`)**: Handles component lifecycle including destruction and cleanup.
- **Public API (`withAPI`)**: Exposes a clean, chainable API for users.

### How Composition Works

The progress component is created by "piping" these features together:

```javascript
const progress = pipe(
  createBase,                    // Start with base component
  withEvents(),                  // Add event capability
  withElement(config),           // Create DOM container
  withVariant(config),           // Apply variant styling
  withDisabled(config),          // Add disabled state
  withState(config),             // Add state management
  withCanvas(config),            // Add canvas rendering
  comp => withAPI(config)(comp), // Apply public API
  withLifecycle()                // Add lifecycle management
)(baseConfig);
```

This composition pattern allows for:
- Modular, testable code
- Clean separation of concerns
- High-performance canvas rendering
- Lightweight bundles (only include what you need)
- Easy extension and customization
- Smooth animations without DOM manipulation overhead

## Canvas Rendering

The Progress component uses HTML5 Canvas for high-performance rendering:

### Benefits
- **Smooth Animations**: 60fps animations without DOM reflows
- **Pixel-Perfect Rendering**: Crisp visuals on all device pixel ratios
- **Memory Efficient**: Single canvas element instead of multiple DOM nodes
- **Flexible Styling**: Programmatic control over all visual aspects

### Animation Features
- **Material Design 3 Compliant**: Follows MD3 animation specifications
- **Indeterminate Animations**: Two-segment animation for linear progress, creating fluid, organic motion
- **Value Transitions**: Eased transitions when changing progress values
- **Wavy Animations**: Unique wavy progress shapes for enhanced visual appeal
- **Responsive Sizing**: Automatic canvas scaling for different container sizes

### Enhanced Indeterminate Animation

The linear indeterminate progress now features Material Design 3 compliant two-segment animation:

```javascript
// Linear indeterminate with two segments
const loadingProgress = createProgress({
  variant: 'linear',
  indeterminate: true
});

// Wavy indeterminate with two segments
const wavyLoading = createProgress({
  variant: 'linear',
  indeterminate: true,
  shape: 'wavy'
});
```

**Two-Segment Animation Details:**
- **Primary Segment**: Starts immediately, expands from 8% to 66% width as it moves across
- **Secondary Segment**: Enters at 50% of the cycle when the primary segment is exiting
- **Continuous Flow**: The secondary segment maintains visual continuity as the primary exits
- **2-Second Cycle**: Complete animation loops every 2 seconds
- **MD3 Compliant**: Creates organic, fluid motion with proper overlap between segments

## Visual Enhancements

The Progress component includes several visual refinements for improved user experience:

### Minimal Arc at 0%
Instead of showing a dot, circular progress indicators now display a minimal arc (0.1%) when the value is 0. This provides:
- Visual continuity with other progress states
- Clear indication that the process is ready to start
- Better accessibility with a more visible indicator

### Intelligent Wave Amplitude
The wavy shape animation now scales intelligently based on:
- **Component Size**: Smaller progress indicators have proportionally reduced wave amplitude
- **Stroke Width**: Wave amplitude adapts to the thickness setting
- **Progress Value**: Wave amplitude smoothly reduces from 97% to 100% for a clean finish

### Wave Shape Features
- **Material Design 3 Compliant**: Smooth, organic wave patterns
- **Size-Aware Scaling**: 30% amplitude at minimum size (40px), 100% at maximum size (240px)
- **Smooth Transitions**: Wave amplitude gracefully reduces as progress approaches completion
- **Both Variants**: Wavy shape works for both linear and circular progress indicators

```javascript
// Wavy progress with size-aware amplitude
const smallWavy = createProgress({
  variant: 'circular',
  shape: 'wavy',
  size: 40,  // Small size = reduced wave amplitude
  value: 60
});

const largeWavy = createProgress({
  variant: 'circular',
  shape: 'wavy',
  size: 240,  // Large size = full wave amplitude
  value: 60
});
```

## Accessibility

The Progress component follows accessibility best practices:

- Proper semantic HTML with ARIA attributes
- `role="progressbar"` for screen reader compatibility
- `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` attributes
- `aria-valuenow` removed during indeterminate state
- `aria-disabled` when component is disabled
- Respects user preferences for reduced motion

### Screen Reader Support

The component provides appropriate information to assistive technologies:

```html
<!-- Determinate progress -->
<div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="42">
  <!-- Canvas rendering -->
</div>

<!-- Indeterminate progress -->
<div role="progressbar" aria-valuemin="0" aria-valuemax="100">
  <!-- Canvas rendering -->
</div>
```

## CSS Customization

The Progress component uses BEM-style CSS classes for easy customization:

```css
/* Base progress styles */
.mtrl-progress { /* ... */ }

/* Progress variants */
.mtrl-progress--linear { /* ... */ }
.mtrl-progress--circular { /* ... */ }

/* Progress states */
.mtrl-progress--indeterminate { /* ... */ }
.mtrl-progress--disabled { /* ... */ }

/* Progress shapes */
.mtrl-progress--wavy { /* ... */ }

/* Progress thickness */
.mtrl-progress--thin { /* ... */ }
.mtrl-progress--thick { /* ... */ }

/* Progress label */
.mtrl-progress__label { /* ... */ }

/* Canvas element */
.mtrl-progress-canvas { /* ... */ }
```

### CSS Custom Properties

The component supports CSS custom properties for theming:

```css
:root {
  --mtrl-primary: #6750A4;                    /* Progress indicator color */
  --mtrl-primary-rgb: 103, 80, 164;          /* RGB values for alpha */
  --mtrl-secondary-container: #E8DEF8;       /* Buffer indicator color */
  --mtrl-outline-variant: rgba(0,0,0,0.12);  /* Track color */
}
```

## Performance Considerations

The Progress component is designed for optimal performance:

### Canvas Rendering Benefits
- **No DOM Reflows**: Canvas updates don't trigger layout recalculations
- **Hardware Acceleration**: GPU-accelerated rendering when available
- **Efficient Animations**: RequestAnimationFrame-based animation loops
- **Memory Efficient**: Single canvas element vs. multiple DOM nodes

### Optimization Features
- **Debounced Resize**: Smart resize handling to prevent excessive redraws
- **Animation Cleanup**: Proper cleanup of animation loops to prevent memory leaks
- **Pixel Ratio Awareness**: Automatic scaling for high-DPI displays
- **Selective Redraws**: Only redraws when values actually change

### Best Practices for Performance
- Use indeterminate state for unknown durations
- Batch multiple value updates when possible
- Clean up components when no longer needed
- Avoid creating many progress instances simultaneously
- Use immediate updates (`setValue(value, false)`) for high-frequency changes like real-time data or file uploads
- Use animated updates (default) for user-triggered actions for better UX

## Browser Support

The Progress component works in all modern browsers that support:
- HTML5 Canvas API
- CSS Custom Properties
- ES6+ JavaScript features
- RequestAnimationFrame API

For older browsers, the component requires these APIs to function properly. Consider using polyfills or alternative solutions for environments that don't support these modern web standards.

## Best Practices

### When to Use Progress Indicators
- **Determinate**: When you know the completion percentage (file uploads, form submissions)
- **Indeterminate**: When duration is unknown (loading data, processing)
- **Linear**: For horizontal layouts, forms, and step-by-step processes
- **Circular**: For compact spaces, overlays, and general loading states

### Visual Guidelines
- Use appropriate thickness for the context (thin for subtle, thick for emphasis)
- Choose wavy shape sparingly for special effects or brand differentiation
- Position labels clearly without obstructing the progress indicator
- Ensure sufficient color contrast for accessibility
- Use consistent progress styling throughout your application

### Animation Guidelines
- **Use Animated Updates (`setValue(value)` or `setValue(value, true)`)** for:
  - User-triggered actions (button clicks, form submissions)
  - Step-by-step processes
  - Milestone achievements
  - Any interaction where smooth visual feedback enhances UX
  
- **Use Immediate Updates (`setValue(value, false)`)** for:
  - Real-time data (CPU usage, network speed)
  - File upload/download progress
  - Rapid polling or streaming data
  - High-frequency updates (> 10 updates per second)
  - Situations where animation queuing could cause lag

### Performance Guidelines
- Limit the number of simultaneous animated progress indicators
- Use indeterminate state judiciously (can be distracting if overused)
- Update progress values at reasonable intervals (not too frequently)
- Clean up progress components when navigation occurs

### Accessibility Guidelines
- Always provide meaningful labels for screen readers
- Don't rely solely on color to convey progress state
- Ensure progress indicators are keyboard accessible when interactive
- Test with screen readers to verify proper announcements
- Consider users with vestibular disorders when using animated states

## Error Handling

The Progress component includes robust error handling:

```javascript
// Safe value setting with validation
progress.setValue(150); // Automatically clamped to max value
progress.setValue(-10); // Automatically clamped to 0

// Component handles canvas initialization gracefully
const progress = createProgress({
  variant: 'circular',
  value: 50
});

// Component will retry canvas initialization if needed
```

## TypeScript Support

The Progress component includes full TypeScript definitions:

```typescript
import { createProgress, ProgressConfig, ProgressComponent } from 'mtrl';

const progress: ProgressComponent = createProgress({
  variant: 'linear',
  value: 50,
  thickness: 'thick'
} as ProgressConfig);

// Type-safe method calls
progress.setValue(75); // TypeScript will validate the number type
progress.setValue(75, true); // Animated update
progress.setValue(75, false); // Immediate update
progress.setShape('wavy'); // TypeScript will validate shape options
```