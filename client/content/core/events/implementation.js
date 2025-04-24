import {
  createLayout,
  createElement
} from 'mtrl'

export const initImplementation = (body) => {
  createLayout([createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Implementation' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how to use the events system in your code.' }],
    [createElement, { tag: 'div', class: 'code-examples' },
      [createElement, { tag: 'h3', text: 'Component Implementation' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// In a component's setup method
setup() {
  this.events = createEventManager(this.element);
  
  // Register DOM event handlers
  this.events.on('click', (e) => {
    if (!this.disabled) {
      this.events.emit('click', { originalEvent: e });
    }
  });
  
  // Add touch support
  this.events.on('tap', (e) => {
    if (!this.disabled) {
      this.events.emit('click', { originalEvent: e });
    }
  });
  
  // Clean up when component is destroyed
  this.lifecycle.onUnmount(() => {
    this.events.destroy();
  });
  
  return this;
}`
      }],
      [createElement, { tag: 'h3', text: 'Using with Event Bus' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// Create a shared event bus
const themeEvents = createEventBus();

// In theme manager component
themeSelector.on('change', (e) => {
  const newTheme = e.target.value;
  themeEvents.emit('theme-changed', { theme: newTheme });
});

// In any other component
themeEvents.on('theme-changed', ({ theme }) => {
  updateThemeStyles(theme);
});`
      }]
    ]
  ], body)
}
