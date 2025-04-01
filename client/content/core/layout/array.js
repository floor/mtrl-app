// src/client/content/core/layout/array.js
import { createLayout } from 'mtrl'

/**
 * Creates the Array-based Layout section
 * @param {HTMLElement} container - Parent container
 */
export const createLayoutArraySection = (container) => {
  const sectionStructure = createLayout([
    'section', { tag: 'section', class: 'content__section' },
    [
      'title', { tag: 'h2', class: 'content__section-title', text: 'Array-based Layout' },
      'description', {
        tag: 'p',
        class: 'content__description',
        text: 'Array-based schemas provide a concise, sequential approach to defining layouts with efficient memory usage and optimal performance.'
      },
      'arrayLayoutContainer', { tag: 'div', class: 'layout-array-container' }
    ]
  ], container)

  // Initialize content for the array layouts
  initArrayLayouts(sectionStructure.get('arrayLayoutContainer'))
}

/**
 * Initializes the array-based layout examples
 * @param {HTMLElement} container - Container for the content
 */
const initArrayLayouts = (container) => {
  // Create visual representation of array-based layout structure
  createLayout([
    'arrayStructure', { tag: 'div', class: 'layout-structure' },
    [
      'structureTitle', { tag: 'h3', class: 'layout-structure-title', text: 'Array-based Schema Structure' },
      'structureDescription', {
        tag: 'p',
        class: 'layout-structure-description',
        text: 'Elements are defined sequentially in a flat or nested array structure, providing excellent performance and compact representation.'
      },
      'structureVisualization', { tag: 'div', class: 'layout-structure-visualization' },
      [
        'visualRoot', { tag: 'div', class: 'layout-array-node root' },
        [
          'rootLabel', { tag: 'div', class: 'layout-array-label', text: 'Root Array' },
          'rootContent', { tag: 'div', class: 'layout-array-content' },
          [
            'rootItem1', { tag: 'div', class: 'layout-array-item' },
            [
              'item1Label', { tag: 'div', class: 'layout-array-item-label', text: 'creator' }
            ],
            'rootItem2', { tag: 'div', class: 'layout-array-item' },
            [
              'item2Label', { tag: 'div', class: 'layout-array-item-label', text: 'name' }
            ],
            'rootItem3', { tag: 'div', class: 'layout-array-item' },
            [
              'item3Label', { tag: 'div', class: 'layout-array-item-label', text: 'options' }
            ],
            'rootItem4', { tag: 'div', class: 'layout-array-item nested' },
            [
              'item4Label', { tag: 'div', class: 'layout-array-item-label', text: 'Nested Array' },
              'item4Children', { tag: 'div', class: 'layout-array-content' },
              [
                'childItem1', { tag: 'div', class: 'layout-array-item' },
                [
                  'childItem1Label', { tag: 'div', class: 'layout-array-item-label', text: 'creator' }
                ],
                'childItem2', { tag: 'div', class: 'layout-array-item' },
                [
                  'childItem2Label', { tag: 'div', class: 'layout-array-item-label', text: 'name' }
                ],
                'childItem3', { tag: 'div', class: 'layout-array-item' },
                [
                  'childItem3Label', { tag: 'div', class: 'layout-array-item-label', text: 'options' }
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ], container)

  // Create a table showing different patterns for array-based layouts
  createLayout([
    'patternContainer', { tag: 'div', class: 'layout-patterns' },
    [
      'patternTitle', { tag: 'h3', class: 'layout-patterns-title', text: 'Common Patterns for Array Schema' },
      'patternTable', { tag: 'table', class: 'layout-patterns-table' },
      [
        'tableHead', { tag: 'thead' },
        [
          'headerRow', { tag: 'tr' },
          [
            'headerPattern', { tag: 'th', text: 'Pattern' },
            'headerStructure', { tag: 'th', text: 'Array Structure' },
            'headerDescription', { tag: 'th', text: 'Description' }
          ]
        ],
        'tableBody', { tag: 'tbody' },
        [
          'row1', { tag: 'tr' },
          [
            'row1Pattern', { tag: 'td', text: 'Creator + Name + Options' },
            'row1Structure', { tag: 'td', class: 'code', text: '[createButton, "saveBtn", { text: "Save" }]' },
            'row1Description', { tag: 'td', text: 'Full pattern with explicit component creator function and naming' }
          ],
          'row2', { tag: 'tr' },
          [
            'row2Pattern', { tag: 'td', text: 'Creator + Options' },
            'row2Structure', { tag: 'td', class: 'code', text: '[createButton, { text: "Save" }]' },
            'row2Description', { tag: 'td', text: 'Anonymous component with no reference name' }
          ],
          'row3', { tag: 'tr' },
          [
            'row3Pattern', { tag: 'td', text: 'Name + Options (Default Creator)' },
            'row3Structure', { tag: 'td', class: 'code', text: '["saveBtn", { text: "Save" }]' },
            'row3Description', { tag: 'td', text: 'Named component using default creator function from options' }
          ],
          'row4', { tag: 'tr' },
          [
            'row4Pattern', { tag: 'td', text: 'Nested Children' },
            'row4Structure', { tag: 'td', class: 'code', text: '[createCard, "card", {}, [...]]' },
            'row4Description', { tag: 'td', text: 'Component with nested children in a sub-array' }
          ],
          'row5', { tag: 'tr' },
          [
            'row5Pattern', { tag: 'td', text: 'DOM Element' },
            'row5Structure', { tag: 'td', class: 'code', text: '["div", { class: "container", id: "main" }]' },
            'row5Description', { tag: 'td', text: 'Creates a DOM element using createElement as default' }
          ]
        ]
      ]
    ]
  ], container)

  // Example showing array-to-DOM mapping
  createLayout([
    'visualExample', { tag: 'div', class: 'layout-visual-example' },
    [
      'exampleTitle', { tag: 'h3', class: 'layout-example-title', text: 'From Schema to DOM' },
      'exampleContainer', { tag: 'div', class: 'layout-example-container' },
      [
        'schemaColumn', { tag: 'div', class: 'layout-schema-column' },
        [
          'schemaTitle', { tag: 'h4', text: 'Array Schema' },
          'schemaCode', {
            tag: 'pre',
            class: 'layout-code',
            text: `[
  'container', { class: 'card' },
  [
    'header', { class: 'card-header' },
    [
      'title', { tag: 'h3', text: 'User Profile' }
    ],
    'content', { class: 'card-content' },
    [
      'avatar', { tag: 'img', attrs: { src: 'avatar.jpg' } },
      'userName', { tag: 'h4', text: 'John Doe' },
      'userInfo', { tag: 'p', text: 'Software Developer' }
    ]
  ]
]`
          }
        ],
        'arrowColumn', { tag: 'div', class: 'layout-arrow-column' },
        [
          'arrow', { tag: 'div', class: 'layout-large-arrow', html: '&#8594;' }
        ],
        'domColumn', { tag: 'div', class: 'layout-dom-column' },
        [
          'domTitle', { tag: 'h4', text: 'Resulting DOM' },
          'domVisualization', { tag: 'div', class: 'layout-dom-visualization' },
          [
            'domContainer', { tag: 'div', class: 'layout-dom-node container' },
            [
              'containerLabel', { tag: 'span', class: 'layout-dom-tag', text: 'div.card' },
              'domHeader', { tag: 'div', class: 'layout-dom-node header' },
              [
                'headerLabel', { tag: 'span', class: 'layout-dom-tag', text: 'div.card-header' },
                'domTitle', { tag: 'div', class: 'layout-dom-node title' },
                [
                  'titleLabel', { tag: 'span', class: 'layout-dom-tag', text: 'h3' },
                  'titleContent', { tag: 'span', class: 'layout-dom-content', text: 'User Profile' }
                ]
              ],
              'domContent', { tag: 'div', class: 'layout-dom-node' },
              [
                'contentLabel', { tag: 'span', class: 'layout-dom-tag', text: 'div.card-content' },
                'domAvatar', { tag: 'div', class: 'layout-dom-node avatar' },
                [
                  'avatarLabel', { tag: 'span', class: 'layout-dom-tag', text: 'img' },
                  'avatarAttr', { tag: 'span', class: 'layout-dom-attr', text: 'src="avatar.jpg"' }
                ],
                'domUserName', { tag: 'div', class: 'layout-dom-node userName' },
                [
                  'userNameLabel', { tag: 'span', class: 'layout-dom-tag', text: 'h4' },
                  'userNameContent', { tag: 'span', class: 'layout-dom-content', text: 'John Doe' }
                ],
                'domUserInfo', { tag: 'div', class: 'layout-dom-node userInfo' },
                [
                  'userInfoLabel', { tag: 'span', class: 'layout-dom-tag', text: 'p' },
                  'userInfoContent', { tag: 'span', class: 'layout-dom-content', text: 'Software Developer' }
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ], container)

  // Add a performance tip box
  createLayout([
    'tipBox', { tag: 'div', class: 'layout-tip-box' },
    [
      'tipIcon', { tag: 'span', class: 'material-icons', text: 'tips_and_updates' },
      'tipContent', { tag: 'div', class: 'layout-tip-content' },
      [
        'tipTitle', { tag: 'h4', text: 'Performance Tip' },
        'tipDescription', {
          tag: 'p',
          text: 'Array-based schemas are 15-30% faster than object-based schemas for large layouts due to more efficient memory usage and faster iteration.'
        }
      ]
    ]
  ], container)
}
