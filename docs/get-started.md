# Getting Started with mtrl

A lightweight TypeScript component library implementing Material Design 3 with zero dependencies. This guide will help you get up and running quickly.

## Installation

Install mtrl using bun, npm or yarn:

```bash
# Using npm
npm install mtrl

# Using npm
npm install mtrl

# Using yarn
yarn add mtrl
```

## Basic Usage

mtrl components follow a factory pattern - you create components by calling a creator function:

```javascript
import { createButton } from 'mtrl';

// Create a button
const button = createButton({
  text: 'Click Me',
  variant: 'filled'
});

// Add it to the DOM
document.getElementById('container').appendChild(button.element);

// Add event listeners
button.on('click', () => {
  console.log('Button clicked!');
});

// Cleanup when done
button.destroy();
```

## Core Components

mtrl provides several components out of the box:

```javascript
import { 
  createButton,
  createCheckbox,
  createTextField,
  createMenu,
  createSlider
} from 'mtrl';

// Create various components
const submitButton = createButton({ text: 'Submit' });
const termsCheckbox = createCheckbox({ label: 'I agree to terms' });
const emailField = createTextField({ label: 'Email' });
```

## Event Handling

All components use a consistent event system:

```javascript
// Add event listeners
button.on('click', handleClick);

// Remove listeners
button.off('click', handleClick);

// Components emit custom events
checkbox.on('change', (event) => {
  console.log('Checkbox state:', event.checked);
});
```

## Component Lifecycle

Always destroy components when they're no longer needed:

```javascript
// When removing a component
button.destroy();
```

## mtrl App - Development Environment

mtrl has a companion app called "mtrl App" that's essential for testing and development. It provides a visual playground to see your components in action.

### What is mtrl App?

mtrl App is a separate repository that:

1. Showcases all mtrl components with live examples
2. Provides a development environment for testing components
3. Documents component usage patterns and variants
4. Enables visual feedback during component development

### Setting Up mtrl App

To use mtrl app for development:

```bash
# 1. Clone both repositories side by side
git clone https://github.com/yourusername/mtrl.git
git clone https://github.com/yourusername/mtrl.app.git

# 2. Install dependencies in both
cd mtrl
bun install

cd ../mtrl.app
bun install

# 3. Link your local mtrl to mtrl App
cd ../mtrl
bun run build
cd ../mtrl.app
bun link ../mtrl

# 4. Start the mtrl App development server
bun run dev
```

This launches a live development environment at `http://localhost:3000` where you can see and interact with your components.

### Using mtrl App for Component Development

When developing a new component:

1. Create your component in the mtrl repository
2. Build mtrl with `bun run build`
3. Create a new page in mtrl App to showcase your component
4. Start the mtrl App dev server to see live results

For example, to test a new Button component:

1. Navigate to mtrl App's components directory:
   ```
   cd mtrl.app/src/client/content/components/
   ```

2. Create a new file for your component examples:
   ```
   touch button.tsx
   ```

3. Add component examples:
   ```jsx
   // button.tsx
   import { createButton } from 'mtrl';
   
   export default function ButtonPage() {
     return (
       <div>
         <h1>Button Examples</h1>
         <div className="example">
           <h2>Filled Button</h2>
           {createButton({ text: 'Filled Button', variant: 'filled' }).element}
         </div>
         <div className="example">
           <h2>Outlined Button</h2>
           {createButton({ text: 'Outlined Button', variant: 'outlined' }).element}
         </div>
       </div>
     );
   }
   ```

4. Add the route in mtrl App's navigation file
5. Run the dev server to see your component

### Workflow for Component Updates

When making changes to an existing component:

1. Modify the component in the mtrl repository
2. Run `bun run build` in mtrl
3. The changes will automatically reflect in mtrl App (no need to restart)
4. Test all component variants and interactions

This workflow provides immediate visual feedback while keeping the core library clean.

## Next Steps

1. Explore available components in the mtrl App
2. Try creating a simple project with mtrl
3. Check out the documentation for advanced usage
4. Consider contributing your own components or improvements

## Common Patterns

mtrl uses functional composition instead of class inheritance. Components are built by combining small feature enhancers.

Understanding these patterns will help you work with and extend mtrl components:

```javascript
// Component creation follows this pattern
const component = pipe(
  createBase,               // Start with base component
  withEvents(),             // Add event handling
  withElement(config),      // Add DOM element
  withSpecificFeatures(),   // Add component-specific features
  withLifecycle()           // Add lifecycle management
)(config);
```

This composition approach makes components highly adaptable and maintainable.

## Conclusion

mtrl provides a lightweight, performant implementation of Material Design 3 using functional composition. The mtrl App development environment makes it easy to create and test components with immediate visual feedback.

Happy building with mtrl!