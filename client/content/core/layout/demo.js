// src/client/content/core/layout/demo.js
import { createLayout, createElement, createButton, createTextfield } from 'mtrl'

/**
 * Creates the Layout Demo section
 * @param {HTMLElement} container - Parent container
 */
export const createLayoutDemoSection = (container) => {
  const sectionStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Interactive Demo' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'Try out the layout module with this interactive demo. Create layouts and see the resulting output in real-time.'
      },
      'demoContainer', { tag: 'div', class: 'mtrl-layout-demo-container' }
    ]
  ], container)

  // Initialize the interactive demo
  initLayoutDemo(sectionStructure.get('demoContainer'))
}

/**
 * Initializes the interactive layout demo
 * @param {HTMLElement} container - Container for the demo
 */
const initLayoutDemo = (container) => {
  // Create the demo UI
  const demoStructure = createLayout([
    'demoContent', { tag: 'div', class: 'mtrl-layout-demo-content' },
    [
      'controlsPanel', { tag: 'div', class: 'mtrl-layout-demo-controls' },
      [
        'controlsTitle', { tag: 'h3', text: 'Layout Builder' },
        'schemaTypeContainer', { tag: 'div', class: 'mtrl-layout-demo-schema-type' },
        [
          'schemaLabel', { tag: 'label', for: 'schema-type', text: 'Schema Type:' },
          'schemaSelect', {
            tag: 'select',
            id: 'schema-type',
            class: 'mtrl-layout-demo-select'
          },
          [
            'option1', { tag: 'option', value: 'array', text: 'Array Schema', selected: true },
            'option2', { tag: 'option', value: 'object', text: 'Object Schema' },
            'option3', { tag: 'option', value: 'html', text: 'HTML String' }
          ]
        ],
        'templateContainer', { tag: 'div', class: 'mtrl-layout-demo-template' },
        [
          'templateLabel', { tag: 'label', for: 'template-select', text: 'Template:' },
          'templateSelect', {
            tag: 'select',
            id: 'template-select',
            class: 'mtrl-layout-demo-select'
          },
          [
            'template1', { tag: 'option', value: 'simple', text: 'Simple Card', selected: true },
            'template2', { tag: 'option', value: 'form', text: 'Registration Form' },
            'template3', { tag: 'option', value: 'dashboard', text: 'Dashboard Panel' }
          ]
        ],
        'editorContainer', { tag: 'div', class: 'mtrl-layout-demo-editor-container' },
        [
          'editorLabel', { tag: 'label', for: 'schema-editor', text: 'Edit Layout Schema:' },
          'editor', {
            tag: 'textarea',
            id: 'schema-editor',
            class: 'mtrl-layout-demo-editor',
            rows: '12'
          }
        ],
        'customizationContainer', { tag: 'div', class: 'mtrl-layout-demo-customization' },
        [
          'customizationTitle', { tag: 'h4', text: 'Customization' },
          'nameFieldContainer', { tag: 'div', class: 'mtrl-layout-demo-field' },
          'colorFieldContainer', { tag: 'div', class: 'mtrl-layout-demo-field' },
          'buttonContainer', { tag: 'div', class: 'mtrl-layout-demo-buttons' }
        ]
      ],
      'previewPanel', { tag: 'div', class: 'mtrl-layout-demo-preview' },
      [
        'previewTitle', { tag: 'h3', text: 'Preview' },
        'previewContent', { tag: 'div', class: 'mtrl-layout-demo-preview-content' },
        'previewCode', { tag: 'div', class: 'mtrl-layout-demo-preview-code' },
        [
          'codeTitle', { tag: 'h4', text: 'Generated DOM Structure' },
          'codeContent', { tag: 'pre', class: 'mtrl-layout-demo-code' }
        ]
      ]
    ]
  ], container)

  // Get references to key elements
  const controls = demoStructure.get('controlsPanel')
  const preview = demoStructure.get('previewContent')
  const codeView = demoStructure.get('codeContent')
  const schemaEditor = demoStructure.get('editor')
  const schemaType = demoStructure.get('schemaSelect')
  const templateSelect = demoStructure.get('templateSelect')

  // Add customization fields
  const nameField = createTextfield({
    label: 'Title Text',
    value: 'Card Title',
    className: 'mtrl-layout-demo-textfield'
  })

  demoStructure.get('nameFieldContainer').appendChild(nameField.element)

  const colorField = createTextfield({
    label: 'Primary Color',
    value: '#6750A4',
    className: 'mtrl-layout-demo-textfield'
  })

  demoStructure.get('colorFieldContainer').appendChild(colorField.element)

  // Add buttons
  const applyButton = createButton({
    text: 'Apply Changes',
    variant: 'filled',
    className: 'mtrl-layout-demo-apply-button'
  })

  const resetButton = createButton({
    text: 'Reset',
    variant: 'outlined',
    className: 'mtrl-layout-demo-reset-button'
  })

  demoStructure.get('buttonContainer').appendChild(applyButton.element)
  demoStructure.get('buttonContainer').appendChild(resetButton.element)

  // Sample templates
  const templates = {
    array: {
      simple: `[
  'card', { class: 'demo-card' },
  [
    'header', { class: 'demo-card-header' },
    [
      'title', { tag: 'h3', text: 'Card Title', style: 'color: #6750A4;' }
    ],
    'content', { class: 'demo-card-content' },
    [
      'description', { tag: 'p', text: 'This card was created using the Layout module with an array-based schema.' }
    ],
    'footer', { class: 'demo-card-footer' },
    [
      'button', { tag: 'button', text: 'Learn More', class: 'demo-button' }
    ]
  ]
]`,
      form: `[
  'form', { class: 'demo-form' },
  [
    'header', { class: 'demo-form-header' },
    [
      'title', { tag: 'h3', text: 'Registration Form', style: 'color: #6750A4;' }
    ],
    'fields', { class: 'demo-form-fields' },
    [
      'nameField', { tag: 'div', class: 'demo-form-field' },
      [
        'nameLabel', { tag: 'label', for: 'name', text: 'Full Name' },
        'nameInput', { tag: 'input', type: 'text', id: 'name', placeholder: 'Enter your name' }
      ],
      'emailField', { tag: 'div', class: 'demo-form-field' },
      [
        'emailLabel', { tag: 'label', for: 'email', text: 'Email Address' },
        'emailInput', { tag: 'input', type: 'email', id: 'email', placeholder: 'Enter your email' }
      ],
      'passwordField', { tag: 'div', class: 'demo-form-field' },
      [
        'passwordLabel', { tag: 'label', for: 'password', text: 'Password' },
        'passwordInput', { tag: 'input', type: 'password', id: 'password', placeholder: 'Create a password' }
      ]
    ],
    'actions', { class: 'demo-form-actions' },
    [
      'submitButton', { tag: 'button', text: 'Register', class: 'demo-submit-button', style: 'background-color: #6750A4; color: white;' },
      'cancelButton', { tag: 'button', text: 'Cancel', class: 'demo-cancel-button' }
    ]
  ]
]`,
      dashboard: `[
  'dashboard', { class: 'demo-dashboard' },
  [
    'header', { class: 'demo-dashboard-header' },
    [
      'title', { tag: 'h2', text: 'Dashboard Overview', style: 'color: #6750A4;' }
    ],
    'stats', { class: 'demo-dashboard-stats' },
    [
      'stat1', { class: 'demo-stat-card' },
      [
        'stat1Icon', { tag: 'span', class: 'demo-stat-icon', text: '📈' },
        'stat1Value', { tag: 'div', class: 'demo-stat-value', text: '2,457' },
        'stat1Label', { tag: 'div', class: 'demo-stat-label', text: 'Total Visits' }
      ],
      'stat2', { class: 'demo-stat-card' },
      [
        'stat2Icon', { tag: 'span', class: 'demo-stat-icon', text: '👥' },
        'stat2Value', { tag: 'div', class: 'demo-stat-value', text: '1,253' },
        'stat2Label', { tag: 'div', class: 'demo-stat-label', text: 'New Users' }
      ],
      'stat3', { class: 'demo-stat-card' },
      [
        'stat3Icon', { tag: 'span', class: 'demo-stat-icon', text: '💰' },
        'stat3Value', { tag: 'div', class: 'demo-stat-value', text: '$12,580' },
        'stat3Label', { tag: 'div', class: 'demo-stat-label', text: 'Revenue' }
      ]
    ]
  ]
]`
    },
    object: {
      simple: `{
  element: {
    creator: createElement,
    options: { tag: 'div', class: 'demo-card' },
    children: {
      header: {
        creator: createElement,
        options: { class: 'demo-card-header' },
        children: {
          title: {
            creator: createElement,
            options: { tag: 'h3', text: 'Card Title', style: 'color: #6750A4;' }
          }
        }
      },
      content: {
        creator: createElement,
        options: { class: 'demo-card-content' },
        children: {
          description: {
            creator: createElement,
            options: { tag: 'p', text: 'This card was created using the Layout module with an object-based schema.' }
          }
        }
      },
      footer: {
        creator: createElement,
        options: { class: 'demo-card-footer' },
        children: {
          button: {
            creator: createElement,
            options: { tag: 'button', text: 'Learn More', class: 'demo-button' }
          }
        }
      }
    }
  }
}`,
      form: `{
  element: {
    creator: createElement,
    options: { tag: 'div', class: 'demo-form' },
    children: {
      header: {
        creator: createElement,
        options: { class: 'demo-form-header' },
        children: {
          title: {
            creator: createElement,
            options: { tag: 'h3', text: 'Registration Form', style: 'color: #6750A4;' }
          }
        }
      },
      fields: {
        creator: createElement,
        options: { class: 'demo-form-fields' },
        children: {
          nameField: {
            creator: createElement,
            options: { tag: 'div', class: 'demo-form-field' },
            children: {
              nameLabel: {
                creator: createElement,
                options: { tag: 'label', for: 'name', text: 'Full Name' }
              },
              nameInput: {
                creator: createElement,
                options: { tag: 'input', type: 'text', id: 'name', placeholder: 'Enter your name' }
              }
            }
          },
          emailField: {
            creator: createElement,
            options: { tag: 'div', class: 'demo-form-field' },
            children: {
              emailLabel: {
                creator: createElement,
                options: { tag: 'label', for: 'email', text: 'Email Address' }
              },
              emailInput: {
                creator: createElement,
                options: { tag: 'input', type: 'email', id: 'email', placeholder: 'Enter your email' }
              }
            }
          },
          passwordField: {
            creator: createElement,
            options: { tag: 'div', class: 'demo-form-field' },
            children: {
              passwordLabel: {
                creator: createElement,
                options: { tag: 'label', for: 'password', text: 'Password' }
              },
              passwordInput: {
                creator: createElement,
                options: { tag: 'input', type: 'password', id: 'password', placeholder: 'Create a password' }
              }
            }
          }
        }
      },
      actions: {
        creator: createElement,
        options: { class: 'demo-form-actions' },
        children: {
          submitButton: {
            creator: createElement,
            options: { tag: 'button', text: 'Register', class: 'demo-submit-button', style: 'background-color: #6750A4; color: white;' }
          },
          cancelButton: {
            creator: createElement,
            options: { tag: 'button', text: 'Cancel', class: 'demo-cancel-button' }
          }
        }
      }
    }
  }
}`,
      dashboard: `{
  element: {
    creator: createElement,
    options: { tag: 'div', class: 'demo-dashboard' },
    children: {
      header: {
        creator: createElement,
        options: { class: 'demo-dashboard-header' },
        children: {
          title: {
            creator: createElement,
            options: { tag: 'h2', text: 'Dashboard Overview', style: 'color: #6750A4;' }
          }
        }
      },
      stats: {
        creator: createElement,
        options: { class: 'demo-dashboard-stats' },
        children: {
          stat1: {
            creator: createElement,
            options: { class: 'demo-stat-card' },
            children: {
              stat1Icon: {
                creator: createElement,
                options: { tag: 'span', class: 'demo-stat-icon', text: '📈' }
              },
              stat1Value: {
                creator: createElement,
                options: { tag: 'div', class: 'demo-stat-value', text: '2,457' }
              },
              stat1Label: {
                creator: createElement,
                options: { tag: 'div', class: 'demo-stat-label', text: 'Total Visits' }
              }
            }
          },
          stat2: {
            creator: createElement,
            options: { class: 'demo-stat-card' },
            children: {
              stat2Icon: {
                creator: createElement,
                options: { tag: 'span', class: 'demo-stat-icon', text: '👥' }
              },
              stat2Value: {
                creator: createElement,
                options: { tag: 'div', class: 'demo-stat-value', text: '1,253' }
              },
              stat2Label: {
                creator: createElement,
                options: { tag: 'div', class: 'demo-stat-label', text: 'New Users' }
              }
            }
          },
          stat3: {
            creator: createElement,
            options: { class: 'demo-stat-card' },
            children: {
              stat3Icon: {
                creator: createElement,
                options: { tag: 'span', class: 'demo-stat-icon', text: '💰' }
              },
              stat3Value: {
                creator: createElement,
                options: { tag: 'div', class: 'demo-stat-value', text: '$12,580' }
              },
              stat3Label: {
                creator: createElement,
                options: { tag: 'div', class: 'demo-stat-label', text: 'Revenue' }
              }
            }
          }
        }
      }
    }
  }
}`
    },
    html: {
      simple: `<div class="demo-card">
  <div class="demo-card-header">
    <h3 style="color: #6750A4;">Card Title</h3>
  </div>
  <div class="demo-card-content">
    <p>This card was created using the Layout module with an HTML string.</p>
  </div>
  <div class="demo-card-footer">
    <button class="demo-button">Learn More</button>
  </div>
</div>`,
      form: `<div class="demo-form">
  <div class="demo-form-header">
    <h3 style="color: #6750A4;">Registration Form</h3>
  </div>
  <div class="demo-form-fields">
    <div class="demo-form-field">
      <label for="name">Full Name</label>
      <input type="text" id="name" placeholder="Enter your name">
    </div>
    <div class="demo-form-field">
      <label for="email">Email Address</label>
      <input type="email" id="email" placeholder="Enter your email">
    </div>
    <div class="demo-form-field">
      <label for="password">Password</label>
      <input type="password" id="password" placeholder="Create a password">
    </div>
  </div>
  <div class="demo-form-actions">
    <button class="demo-submit-button" style="background-color: #6750A4; color: white;">Register</button>
    <button class="demo-cancel-button">Cancel</button>
  </div>
</div>`,
      dashboard: `<div class="demo-dashboard">
  <div class="demo-dashboard-header">
    <h2 style="color: #6750A4;">Dashboard Overview</h2>
  </div>
  <div class="demo-dashboard-stats">
    <div class="demo-stat-card">
      <span class="demo-stat-icon">📈</span>
      <div class="demo-stat-value">2,457</div>
      <div class="demo-stat-label">Total Visits</div>
    </div>
    <div class="demo-stat-card">
      <span class="demo-stat-icon">👥</span>
      <div class="demo-stat-value">1,253</div>
      <div class="demo-stat-label">New Users</div>
    </div>
    <div class="demo-stat-card">
      <span class="demo-stat-icon">💰</span>
      <div class="demo-stat-value">$12,580</div>
      <div class="demo-stat-label">Revenue</div>
    </div>
  </div>
</div>`
    }
  }

  // Set initial editor content
  schemaEditor.value = templates.array.simple

  // Function to update the preview
  const updatePreview = () => {
    try {
      // Clear previous preview
      preview.innerHTML = ''

      let schema
      const schemaText = schemaEditor.value

      // Parse the schema based on type
      if (schemaType.value === 'html') {
        // For HTML string, use it directly
        preview.innerHTML = schemaText
      } else {
        // For array or object, evaluate the schema
        schema = eval(`(${schemaText})`)

        // Create layout and append to preview
        const layout = createLayout(schema)
        preview.appendChild(layout.element)
      }

      // Generate code view of the DOM
      generateDOMCode(preview)
    } catch (error) {
      // Show error in the code view
      codeView.textContent = `Error: ${error.message}`
      codeView.classList.add('error')
    }
  }

  // Function to generate DOM structure code view
  const generateDOMCode = (element) => {
    codeView.classList.remove('error')

    const generateElementCode = (el, indent = 0) => {
      const indentStr = '  '.repeat(indent)
      let code = `${indentStr}<${el.tagName.toLowerCase()}`

      // Add attributes
      if (el.attributes.length > 0) {
        Array.from(el.attributes).forEach(attr => {
          if (attr.name !== 'style') {
            code += ` ${attr.name}="${attr.value}"`
          }
        })
      }

      // Add inline style if present
      if (el.style.cssText) {
        code += ` style="${el.style.cssText}"`
      }

      // Check if element has children
      if (el.children.length > 0 || el.textContent.trim()) {
        code += '>\n'

        // Add text content if not just whitespace from children's formatting
        if (el.children.length === 0 && el.textContent.trim()) {
          code += `${indentStr}  ${el.textContent.trim()}\n`
        }

        // Add children recursively
        Array.from(el.children).forEach(child => {
          code += generateElementCode(child, indent + 1) + '\n'
        })

        code += `${indentStr}</${el.tagName.toLowerCase()}>`
      } else {
        code += ' />'
      }

      return code
    }

    let code = ''
    Array.from(element.children).forEach(child => {
      code += generateElementCode(child) + '\n'
    })

    codeView.textContent = code
  }

  // Event handler for template selection
  templateSelect.addEventListener('change', () => {
    const currentSchema = schemaType.value
    const currentTemplate = templateSelect.value
    schemaEditor.value = templates[currentSchema][currentTemplate]
    updatePreview()
  })

  // Event handler for schema type selection
  schemaType.addEventListener('change', () => {
    const currentTemplate = templateSelect.value
    schemaEditor.value = templates[schemaType.value][currentTemplate]
    updatePreview()
  })

  // Event handler for apply button
  applyButton.on('click', () => {
    // Apply customizations
    const title = nameField.getValue()
    const color = colorField.getValue()

    // Update schema with new values
    let schema = schemaEditor.value
    schema = schema.replace(/text: ['"]Card Title['"]|text: ['"]Registration Form['"]|text: ['"]Dashboard Overview['"]/, `text: '${title}'`)
    schema = schema.replace(/#6750A4/g, color)

    schemaEditor.value = schema
    updatePreview()
  })

  // Event handler for reset button
  resetButton.on('click', () => {
    nameField.setValue('Card Title')
    colorField.setValue('#6750A4')

    const currentSchema = schemaType.value
    const currentTemplate = templateSelect.value
    schemaEditor.value = templates[currentSchema][currentTemplate]

    updatePreview()
  })

  // Initialize the preview
  updatePreview()

  // Add CSS styles for the demo
  const style = document.createElement('style')
  style.textContent = `
    .mtrl-layout-demo-content {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .mtrl-layout-demo-controls {
      flex: 1;
      min-width: 300px;
    }
    
    .mtrl-layout-demo-preview {
      flex: 1;
      min-width: 300px;
    }
    
    .mtrl-layout-demo-editor {
      width: 100%;
      font-family: monospace;
      padding: 10px;
      margin-top: 5px;
    }
    
    .mtrl-layout-demo-select {
      width: 100%;
      margin-top: 5px;
      padding: 8px;
    }
    
    .mtrl-layout-demo-field {
      margin-bottom: 15px;
    }
    
    .mtrl-layout-demo-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    
    .mtrl-layout-demo-preview-content {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-height: 200px;
    }
    
    .mtrl-layout-demo-code {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      overflow: auto;
      font-size: 13px;
    }
    
    .mtrl-layout-demo-code.error {
      color: #d32f2f;
    }
    
    /* Demo component styles */
    .demo-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .demo-card-header {
      padding: 16px;
      border-bottom: 1px solid #eee;
    }
    
    .demo-card-header h3 {
      margin: 0;
    }
    
    .demo-card-content {
      padding: 16px;
    }
    
    .demo-card-footer {
      padding: 16px;
      border-top: 1px solid #eee;
      text-align: right;
    }
    
    .demo-button {
      padding: 8px 16px;
      border: none;
      background: #eee;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .demo-button:hover {
      background: #ddd;
    }
    
    .demo-form {
      width: 100%;
      max-width: 500px;
    }
    
    .demo-form-header {
      margin-bottom: 20px;
    }
    
    .demo-form-field {
      margin-bottom: 15px;
    }
    
    .demo-form-field label {
      display: block;
      margin-bottom: 5px;
    }
    
    .demo-form-field input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .demo-form-actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }
    
    .demo-submit-button, .demo-cancel-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .demo-cancel-button {
      background: #eee;
    }
    
    .demo-dashboard {
      width: 100%;
    }
    
    .demo-dashboard-header {
      margin-bottom: 20px;
    }
    
    .demo-dashboard-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .demo-stat-card {
      flex: 1;
      min-width: 120px;
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 8px;
      text-align: center;
      background: white;
    }
    
    .demo-stat-icon {
      font-size: 24px;
      margin-bottom: 8px;
      display: block;
    }
    
    .demo-stat-value {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .demo-stat-label {
      color: #666;
      font-size: 14px;
    }
  `
  document.head.appendChild(style)
}
