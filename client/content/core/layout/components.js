// src/client/content/core/layout/components.js
import { fLayout } from 'mtrl'

/**
 * Creates the Layout Components section
 * @param {HTMLElement} container - Parent container
 */
export const createLayoutComponentsSection = (container) => {
  const sectionStructure = fLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Component Management' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'The Layout module offers convenient ways to access, organize, and manage components within your UI hierarchy.'
      },
      'componentsContainer', { tag: 'div', class: 'mtrl-layout-components-container' }
    ]
  ], container)

  // Initialize content for the components section
  initComponentsContent(sectionStructure.get('componentsContainer'))
}

/**
 * Initializes the layout components content
 * @param {HTMLElement} container - Container for the content
 */
const initComponentsContent = (container) => {
  // Create component lifecycle visualization
  fLayout([
    'lifecycleContainer', { tag: 'div', class: 'mtrl-layout-lifecycle' },
    [
      'lifecycleTitle', { tag: 'h3', class: 'mtrl-layout-lifecycle-title', text: 'Component Lifecycle' },
      'lifecycleDescription', {
        tag: 'p',
        class: 'mtrl-layout-lifecycle-description',
        text: 'The Layout module manages the entire component lifecycle from creation to destruction.'
      },
      'lifecycleSteps', { tag: 'div', class: 'mtrl-layout-lifecycle-steps' },
      [
        'step1', { tag: 'div', class: 'mtrl-layout-lifecycle-step' },
        [
          'step1Number', { tag: 'div', class: 'mtrl-layout-lifecycle-number', text: '1' },
          'step1Content', { tag: 'div', class: 'mtrl-layout-lifecycle-content' },
          [
            'step1Title', { tag: 'h4', text: 'Component Instantiation' },
            'step1Description', { tag: 'p', text: 'Components are created from creator functions with options' }
          ]
        ],
        'step2', { tag: 'div', class: 'mtrl-layout-lifecycle-step' },
        [
          'step2Number', { tag: 'div', class: 'mtrl-layout-lifecycle-number', text: '2' },
          'step2Content', { tag: 'div', class: 'mtrl-layout-lifecycle-content' },
          [
            'step2Title', { tag: 'h4', text: 'Component Storage' },
            'step2Description', { tag: 'p', text: 'Components are stored in the layout result by their name' }
          ]
        ],
        'step3', { tag: 'div', class: 'mtrl-layout-lifecycle-step' },
        [
          'step3Number', { tag: 'div', class: 'mtrl-layout-lifecycle-number', text: '3' },
          'step3Content', { tag: 'div', class: 'mtrl-layout-lifecycle-content' },
          [
            'step3Title', { tag: 'h4', text: 'Component Usage' },
            'step3Description', { tag: 'p', text: 'Components are accessed through the layout.get() method' }
          ]
        ],
        'step4', { tag: 'div', class: 'mtrl-layout-lifecycle-step' },
        [
          'step4Number', { tag: 'div', class: 'mtrl-layout-lifecycle-number', text: '4' },
          'step4Content', { tag: 'div', class: 'mtrl-layout-lifecycle-content' },
          [
            'step4Title', { tag: 'h4', text: 'Component Updates' },
            'step4Description', { tag: 'p', text: 'Components can be updated using their own methods' }
          ]
        ],
        'step5', { tag: 'div', class: 'mtrl-layout-lifecycle-step' },
        [
          'step5Number', { tag: 'div', class: 'mtrl-layout-lifecycle-number', text: '5' },
          'step5Content', { tag: 'div', class: 'mtrl-layout-lifecycle-content' },
          [
            'step5Title', { tag: 'h4', text: 'Component Cleanup' },
            'step5Description', { tag: 'p', text: 'Components are destroyed when layout.destroy() is called' }
          ]
        ]
      ]
    ]
  ], container)

  // Create component access example
  fLayout([
    'accessContainer', { tag: 'div', class: 'mtrl-layout-access' },
    [
      'accessTitle', { tag: 'h3', class: 'mtrl-layout-access-title', text: 'Component Access Methods' },
      'accessTabs', { tag: 'div', class: 'mtrl-layout-access-tabs' },
      [
        'tab1', { tag: 'div', class: 'mtrl-layout-access-tab active', text: 'Direct Property Access', dataset: { tab: 'direct' } },
        'tab2', { tag: 'div', class: 'mtrl-layout-access-tab', text: 'get() Method', dataset: { tab: 'get' } },
        'tab3', { tag: 'div', class: 'mtrl-layout-access-tab', text: 'getAll() Method', dataset: { tab: 'getAll' } }
      ],
      'accessContent', { tag: 'div', class: 'mtrl-layout-access-content' },
      [
        'directContent', { tag: 'div', class: 'mtrl-layout-access-panel active', dataset: { panel: 'direct' } },
        [
          'directDescription', { tag: 'p', text: 'Access components directly using the component name as a property:' },
          'directCode', {
            tag: 'pre',
            class: 'mtrl-layout-code',
            text: `// Create a layout with named components
const layout = fLayout([
  fButton, 'saveButton', { text: 'Save' },
  fTextfield, 'nameField', { label: 'Name' }
]);

// Direct access by component name
const saveButton = layout.saveButton;
const nameField = layout.nameField;

// Use the components
saveButton.on('click', () => console.log('Saving: ' + nameField.getValue()));`
          }
        ],
        'getContent', { tag: 'div', class: 'mtrl-layout-access-panel', dataset: { panel: 'get' } },
        [
          'getDescription', { tag: 'p', text: 'Use the get() method to safely retrieve components by name:' },
          'getCode', {
            tag: 'pre',
            class: 'mtrl-layout-code',
            text: `// Create a layout with named components
const layout = fLayout([
  fButton, 'saveButton', { text: 'Save' },
  fTextfield, 'nameField', { label: 'Name' }
]);

// Access using get() method
const saveButton = layout.get('saveButton');
const nameField = layout.get('nameField');

// Will return null if component doesn't exist
const missingComponent = layout.get('nonExistentComponent'); // null`
          }
        ],
        'getAllContent', { tag: 'div', class: 'mtrl-layout-access-panel', dataset: { panel: 'getAll' } },
        [
          'getAllDescription', { tag: 'p', text: 'Use getAll() to retrieve all components as a flattened object:' },
          'getAllCode', {
            tag: 'pre',
            class: 'mtrl-layout-code',
            text: `// Create a complex layout
const layout = fLayout([
  createNavbar, 'navbar', { title: 'Dashboard' },
  createSidebar, 'sidebar', {},
  [
    fList, 'menuList', {},
    [
      createListItem, 'homeItem', { text: 'Home' },
      createListItem, 'settingsItem', { text: 'Settings' }
    ]
  ]
]);

// Get all components as a flattened object
const components = layout.getAll();

// Now you can access any component by name
components.navbar.setTitle('New Title');
components.homeItem.setActive(true);
components.settingsItem.setActive(false);`
          }
        ]
      ]
    ]
  ], container)

  // Add event listeners for tabs
  const tabs = container.querySelectorAll('.mtrl-layout-access-tab')
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and panels
      container.querySelectorAll('.mtrl-layout-access-tab').forEach(t => t.classList.remove('active'))
      container.querySelectorAll('.mtrl-layout-access-panel').forEach(p => p.classList.remove('active'))

      // Add active class to clicked tab
      tab.classList.add('active')

      // Add active class to corresponding panel
      const panel = container.querySelector(`.mtrl-layout-access-panel[data-panel="${tab.dataset.tab}"]`)
      if (panel) panel.classList.add('active')
    })
  })

  // Create component destruction visualization
  fLayout([
    'destructionContainer', { tag: 'div', class: 'mtrl-layout-destruction' },
    [
      'destructionTitle', { tag: 'h3', class: 'mtrl-layout-destruction-title', text: 'Component Cleanup' },
      'destructionDescription', {
        tag: 'p',
        class: 'mtrl-layout-destruction-description',
        text: 'The layout.destroy() method automatically cleans up all components in the layout to prevent memory leaks.'
      },
      'destructionCode', {
        tag: 'pre',
        class: 'mtrl-layout-code',
        text: `// Create a modal dialog layout
const modalLayout = fLayout([
  fDialog, 'confirmDialog', { title: 'Confirm Action' },
  [
    fTextfield, 'reasonField', { label: 'Reason' },
    fButton, 'confirmBtn', { text: 'Confirm' },
    fButton, 'cancelBtn', { text: 'Cancel' }
  ]
]);

// Use the dialog
modalLayout.get('confirmDialog').open();

// Handle cancel button
modalLayout.get('cancelBtn').on('click', () => {
  // Close and clean up the entire layout
  modalLayout.get('confirmDialog').close();
  modalLayout.destroy();
  
  // All components are now properly destroyed:
  // - Event listeners are removed
  // - DOM elements are removed from the document
  // - Component resources are released
});`
      }
    ]
  ], container)

  // Best practices box
  fLayout([
    'bestPractices', { tag: 'div', class: 'mtrl-layout-best-practices' },
    [
      'bestPracticesTitle', { tag: 'h3', text: 'Component Management Best Practices' },
      'bestPracticesList', { tag: 'ul', class: 'mtrl-layout-best-practices-list' },
      [
        'practice1', { tag: 'li', text: 'Use descriptive, consistent naming for components to improve code readability' },
        'practice2', { tag: 'li', text: 'Prefer the get() method over direct property access for safer component retrieval' },
        'practice3', { tag: 'li', text: 'Always call destroy() on layouts you no longer need to prevent memory leaks' },
        'practice4', { tag: 'li', text: 'Create separate layouts for sections that can be independently created and destroyed' },
        'practice5', { tag: 'li', text: 'Use flattened component access for deeply nested components' }
      ]
    ]
  ], container)
}
