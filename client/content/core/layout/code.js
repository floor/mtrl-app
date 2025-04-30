// src/client/content/core/layout/code.js
import { createLayout } from 'mtrl'

/**
 * Creates the Layout Code Examples section
 * @param {HTMLElement} container - Parent container
 */
export const createLayoutCodeSection = (container) => {
  const sectionStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Code Examples' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'Learn how to use the Layout module in your code with these practical examples covering common use cases.'
      },
      'codeExamples', { tag: 'div', class: 'mtrl-layout-code-examples' }
    ]
  ], container)

  // Initialize content for code examples
  initCodeExamples(sectionStructure.get('codeExamples'))
}

/**
 * Initializes the layout code examples
 * @param {HTMLElement} container - Container for the content
 */
const initCodeExamples = (container) => {
  // Example 1: Basic Usage
  createLayout([
    'example1', { tag: 'div', class: 'mtrl-layout-code-example' },
    [
      'example1Title', { tag: 'h3', text: 'Basic Usage' },
      'example1Description', { tag: 'p', text: 'Create a simple layout with multiple components:' },
      'example1Code', {
        tag: 'pre',
        class: 'mtrl-layout-code',
        text: `import { createLayout, createButton, createTextfield } from 'mtrl';

// Create a login form layout with named components
const loginLayout = createLayout([
  'loginForm', { tag: 'form', class: 'login-form' },
  [
    'title', { tag: 'h2', text: 'Log In', class: 'login-title' },
    createTextfield, 'emailField', { 
      label: 'Email Address', 
      type: 'email', 
      required: true 
    },
    createTextfield, 'passwordField', { 
      label: 'Password', 
      type: 'password', 
      required: true 
    },
    'actions', { tag: 'div', class: 'login-actions' },
    [
      createButton, 'loginButton', { 
        text: 'Log In', 
        variant: 'filled', 
        class: 'login-button' 
      },
      createButton, 'forgotPasswordButton', { 
        text: 'Forgot Password?', 
        variant: 'text' 
      }
    ]
  ]
]);

// Access components by name
const emailField = loginLayout.get('emailField');
const passwordField = loginLayout.get('passwordField');
const loginButton = loginLayout.get('loginButton');

// Add event listeners
loginButton.on('click', (event) => {
  event.preventDefault();
  
  // Validate form
  if (emailField.validate() && passwordField.validate()) {
    // Submit form
    console.log('Login submitted with:', {
      email: emailField.getValue(),
      password: passwordField.getValue()
    });
  }
});`
      }
    ]
  ], container)

  // Example 2: Advanced Layout with Default Creator
  createLayout([
    'example2', { tag: 'div', class: 'mtrl-layout-code-example' },
    [
      'example2Title', { tag: 'h3', text: 'Advanced Layout with Default Creator' },
      'example2Description', { tag: 'p', text: 'Create a complex layout with a default creator function:' },
      'example2Code', {
        tag: 'pre',
        class: 'mtrl-layout-code',
        text: `import { createLayout, createCard, createButton } from 'mtrl';

// Create a data grid with a default creator for text fields
const dataGridLayout = createLayout([
  createCard, 'dataCard', { title: 'User Data', elevated: true },
  [
    'tableContainer', { tag: 'div', class: 'table-container' },
    [
      'table', { tag: 'table', class: 'data-table' },
      [
        'tableHead', { tag: 'thead' },
        [
          'headerRow', { tag: 'tr' },
          [
            'nameHeader', { tag: 'th', text: 'Name' },
            'emailHeader', { tag: 'th', text: 'Email' },
            'roleHeader', { tag: 'th', text: 'Role' },
            'actionsHeader', { tag: 'th', text: 'Actions' }
          ]
        ],
        'tableBody', { tag: 'tbody' },
        [
          // Row 1
          'row1', { tag: 'tr' },
          [
            'row1Name', { tag: 'td', text: 'John Doe' },
            'row1Email', { tag: 'td', text: 'john@example.com' },
            'row1Role', { tag: 'td', text: 'Admin' },
            'row1Actions', { tag: 'td' },
            [
              createButton, 'row1EditButton', { 
                text: 'Edit', 
                variant: 'outlined', 
                size: 'small' 
              }
            ]
          ],
          // Row 2
          'row2', { tag: 'tr' },
          [
            'row2Name', { tag: 'td', text: 'Jane Smith' },
            'row2Email', { tag: 'td', text: 'jane@example.com' },
            'row2Role', { tag: 'td', text: 'User' },
            'row2Actions', { tag: 'td' },
            [
              createButton, 'row2EditButton', { 
                text: 'Edit', 
                variant: 'outlined', 
                size: 'small' 
              }
            ]
          ]
        ]
      ]
    ]
  ]
]);

// Access and use components
const dataCard = dataGridLayout.get('dataCard');
dataCard.setTitle('Updated User Data');

// Access edit buttons
const row1EditButton = dataGridLayout.get('row1EditButton');
row1EditButton.on('click', () => {
  console.log('Editing User 1');
});`
      }
    ]
  ], container)

  // Example 3: Object-based Layout
  createLayout([
    'example3', { tag: 'div', class: 'mtrl-layout-code-example' },
    [
      'example3Title', { tag: 'h3', text: 'Object-based Layout' },
      'example3Description', { tag: 'p', text: 'Create a layout using the object schema format:' },
      'example3Code', {
        tag: 'pre',
        class: 'mtrl-layout-code',
        text: `import { createLayout, createTopAppBar, createNavigation, createList } from 'mtrl';

// Create application shell with object schema
const appLayout = createLayout({
  element: {
    creator: createTopAppBar,
    options: { 
      title: 'Dashboard',
      variant: 'fixed'
    },
    children: {
      navigation: {
        creator: createNavigation,
        options: { 
          variant: 'drawer',
          breakpoint: 'md'
        },
        children: {
          navList: {
            creator: createList,
            options: { interactive: true },
            children: {
              homeItem: {
                creator: createElement,
                options: { 
                  tag: 'li',
                  class: 'nav-item active',
                  text: 'Home'
                }
              },
              analyticsItem: {
                creator: createElement,
                options: { 
                  tag: 'li',
                  class: 'nav-item',
                  text: 'Analytics'
                }
              },
              settingsItem: {
                creator: createElement,
                options: { 
                  tag: 'li',
                  class: 'nav-item',
                  text: 'Settings'
                }
              }
            }
          }
        }
      },
      contentArea: {
        creator: createElement,
        options: { 
          tag: 'main',
          class: 'content-area'
        }
      }
    }
  }
});

// Add content to the content area
const createContentLayout = createLayout([
  'heading', { tag: 'h1', text: 'Welcome to the Dashboard' },
  'description', { 
    tag: 'p', 
    text: 'This content was added dynamically to the main content area.'
  }
], appLayout.get('contentArea'));

// You can access the components directly
appLayout.get('analyticsItem').addEventListener('click', () => {
  // Navigate to analytics page
  appLayout.get('navigation').close();
  appLayout.get('contentArea').innerHTML = '<h1>Analytics</h1>';
});`
      }
    ]
  ], container)

  // Example 4: HTML String Layout
  createLayout([
    'example4', { tag: 'div', class: 'mtrl-layout-code-example' },
    [
      'example4Title', { tag: 'h3', text: 'HTML String Layout' },
      'example4Description', { tag: 'p', text: 'Create a layout from an HTML string template:' },
      'example4Code', {
        tag: 'pre',
        class: 'mtrl-layout-code',
        text: `import { createLayout } from 'mtrl';

// Create a notification layout from HTML string
const notificationLayout = createLayout(\`
  <div class="notification-banner">
    <div class="notification-icon">
      <span class="material-icons">info</span>
    </div>
    <div class="notification-content">
      <h4 class="notification-title">System Update</h4>
      <p class="notification-message">
        The system will be down for maintenance on Saturday, March 30th
        from 2:00 AM to 4:00 AM EDT. Please save your work before this time.
      </p>
    </div>
    <div class="notification-actions">
      <button class="dismiss-button">Dismiss</button>
    </div>
  </div>
\`);

// Access the root element
const notificationBanner = notificationLayout.element;

// Add event listener to dismiss button (direct DOM access)
const dismissButton = notificationBanner.querySelector('.dismiss-button');
dismissButton.addEventListener('click', () => {
  notificationBanner.style.display = 'none';
});

// Add to the document
document.querySelector('#notifications-area').appendChild(notificationBanner);`
      }
    ]
  ], container)

  // Example 5: Dynamic Layout Creation
  createLayout([
    'example5', { tag: 'div', class: 'mtrl-layout-code-example' },
    [
      'example5Title', { tag: 'h3', text: 'Dynamic Layout Creation' },
      'example5Description', { tag: 'p', text: 'Create layouts dynamically based on data:' },
      'example5Code', {
        tag: 'pre',
        class: 'mtrl-layout-code',
        text: `import { createLayout, createCard, createChip } from 'mtrl';

// Sample data from API
const products = [
  { id: 1, name: 'Laptop', price: 1299, tags: ['Electronics', 'Computers'] },
  { id: 2, name: 'Smartphone', price: 899, tags: ['Electronics', 'Mobile'] },
  { id: 3, name: 'Headphones', price: 249, tags: ['Electronics', 'Audio'] }
];

// Create product grid container
const productGrid = document.getElementById('product-grid');

// Function to create a product card layout
const createProductCard = (product) => {
  return createLayout([
    createCard, \`product_\${product.id}\`, { 
      outlined: true,
      class: 'product-card'
    },
    [
      'productHeader', { class: 'product-header' },
      [
        'productName', { tag: 'h3', text: product.name, class: 'product-name' }
      ],
      'productInfo', { class: 'product-info' },
      [
        'productPrice', { tag: 'div', text: \`$\${product.price}\`, class: 'product-price' },
        'productTags', { tag: 'div', class: 'product-tags' }
      ]
    ]
  ]);
};

// Create all product cards dynamically
products.forEach(product => {
  // Create the product card
  const productLayout = createProductCard(product);
  
  // Add to grid
  productGrid.appendChild(productLayout.element);
  
  // Add tags as chips
  const tagsContainer = productLayout.get('productTags');
  
  product.tags.forEach(tag => {
    const tagChip = createChip({
      text: tag,
      variant: 'filled'
    });
    
    tagsContainer.appendChild(tagChip.element);
  });
});

// Add event listeners to all cards
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', () => {
    // Find the product ID from the layout ID
    const productId = parseInt(card.id.split('_')[1]);
    const product = products.find(p => p.id === productId);
    
    console.log('Product selected:', product);
  });
});`
      }
    ]
  ], container)

  // Example 6: Layout Management and Cleanup
  createLayout([
    'example6', { tag: 'div', class: 'mtrl-layout-code-example' },
    [
      'example6Title', { tag: 'h3', text: 'Layout Management and Cleanup' },
      'example6Description', { tag: 'p', text: 'Properly manage and clean up layouts to prevent memory leaks:' },
      'example6Code', {
        tag: 'pre',
        class: 'mtrl-layout-code',
        text: `import { createLayout, createDialog, createButton, createTextfield } from 'mtrl';

// Store layout references for cleanup
const layoutRefs = new Map();

// Create a modal dialog
function createModalDialog(id, title, content) {
  // Clean up existing dialog if it exists
  if (layoutRefs.has(id)) {
    layoutRefs.get(id).destroy();
    layoutRefs.delete(id);
  }
  
  // Create new dialog layout
  const dialogLayout = createLayout([
    createDialog, 'dialog', { 
      title: title,
      closeOnEscape: true,
      closeOnBackdrop: true,
      width: '400px'
    },
    [
      'content', { tag: 'div', class: 'dialog-content' },
      [
        'message', { tag: 'p', text: content }
      ],
      'actions', { tag: 'div', class: 'dialog-actions' },
      [
        createButton, 'confirmBtn', { 
          text: 'Confirm', 
          variant: 'filled' 
        },
        createButton, 'cancelBtn', { 
          text: 'Cancel', 
          variant: 'outlined' 
        }
      ]
    ]
  ]);
  
  // Store reference for cleanup
  layoutRefs.set(id, dialogLayout);
  
  // Setup event handlers
  const dialog = dialogLayout.get('dialog');
  const confirmBtn = dialogLayout.get('confirmBtn');
  const cancelBtn = dialogLayout.get('cancelBtn');
  
  // Auto-cleanup when dialog is closed
  dialog.on('close', () => {
    setTimeout(() => {
      if (layoutRefs.has(id)) {
        layoutRefs.get(id).destroy();
        layoutRefs.delete(id);
      }
    }, 300); // Allow animation to complete
  });
  
  // Handle button clicks
  confirmBtn.on('click', () => {
    console.log('Confirmed dialog:', id);
    dialog.close();
  });
  
  cancelBtn.on('click', () => {
    dialog.close();
  });
  
  // Open the dialog
  dialog.open();
  
  return dialogLayout;
}

// Usage
document.getElementById('showConfirmBtn').addEventListener('click', () => {
  createModalDialog(
    'confirm-dialog',
    'Confirm Action',
    'Are you sure you want to proceed with this action?'
  );
});

// Clean up all layouts when navigating away
window.addEventListener('beforeunload', () => {
  // Destroy all managed layouts
  for (const [id, layout] of layoutRefs.entries()) {
    layout.destroy();
  }
  layoutRefs.clear();
});`
      }
    ]
  ], container)

  // Best Practices
  createLayout([
    'bestPractices', { tag: 'div', class: 'mtrl-layout-best-practices-box' },
    [
      'title', { tag: 'h3', text: 'Best Practices for Layout Module' },
      'list', { tag: 'ul', class: 'mtrl-layout-best-practices-list' },
      [
        'practice1', { tag: 'li', html: '<strong>Use array-based layouts</strong> for performance-critical sections with many components.' },
        'practice2', { tag: 'li', html: '<strong>Use object-based layouts</strong> for complex, deeply nested structures that need maintainability.' },
        'practice3', { tag: 'li', html: '<strong>Always use descriptive component names</strong> to improve code readability and maintenance.' },
        'practice4', { tag: 'li', html: '<strong>Store layout references</strong> when creating dynamic layouts to ensure proper cleanup.' },
        'practice5', { tag: 'li', html: '<strong>Call destroy()</strong> when a layout is no longer needed to prevent memory leaks.' },
        'practice6', { tag: 'li', html: '<strong>Memoize frequently used layouts</strong> to improve performance in large applications.' },
        'practice7', { tag: 'li', html: '<strong>Use the default creator option</strong> to avoid repeating the same creator function for similar components.' },
        'practice8', { tag: 'li', html: '<strong>Structure layouts hierarchically</strong> to match your UI component hierarchy for better organization.' }
      ]
    ]
  ], container)
}
