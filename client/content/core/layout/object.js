// src/client/content/core/layout/object.js
import { createLayout, createElement } from 'mtrl'

/**
 * Creates the Object-based Layout section
 * @param {HTMLElement} container - Parent container
 */
export const createLayoutObjectSection = (container) => {
  const sectionStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Object-based Layout' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'Object-based schemas provide a structured, hierarchical approach to defining layouts with explicit property names for improved readability and self-documentation.'
      },
      'objectLayoutContainer', { tag: 'div', class: 'mtrl-layout-object-container' }
    ]
  ], container)

  // Initialize content for the object layouts
  initObjectLayouts(sectionStructure.get('objectLayoutContainer'))
}

/**
 * Initializes the object-based layout examples
 * @param {HTMLElement} container - Container for the content
 */
const initObjectLayouts = (container) => {
  // Create visual representation of object-based layout structure
  createLayout([
    'objectStructure', { tag: 'div', class: 'mtrl-layout-structure' },
    [
      'structureTitle', { tag: 'h3', class: 'mtrl-layout-structure-title', text: 'Object-based Schema Structure' },
      'structureDescription', {
        tag: 'p',
        class: 'mtrl-layout-structure-description',
        text: 'Elements are defined as properties in a hierarchical object structure, providing clear visibility of the UI component hierarchy.'
      },
      'structureVisualization', { tag: 'div', class: 'mtrl-layout-structure-visualization' },
      [
        'visualRoot', { tag: 'div', class: 'mtrl-layout-object-node root' },
        [
          'rootLabel', { tag: 'div', class: 'mtrl-layout-object-label', text: 'Root Object' },
          'rootContent', { tag: 'div', class: 'mtrl-layout-object-content' },
          [
            'elementProp', { tag: 'div', class: 'mtrl-layout-object-property' },
            [
              'elementKey', { tag: 'div', class: 'mtrl-layout-object-key', text: 'element:' },
              'elementValue', { tag: 'div', class: 'mtrl-layout-object-value' },
              [
                'elementObj', { tag: 'div', class: 'mtrl-layout-object-inner' },
                [
                  'creatorProp', { tag: 'div', class: 'mtrl-layout-object-property' },
                  [
                    'creatorKey', { tag: 'div', class: 'mtrl-layout-object-key', text: 'creator:' },
                    'creatorValue', { tag: 'div', class: 'mtrl-layout-object-function', text: 'createComponent' }
                  ],
                  'optionsProp', { tag: 'div', class: 'mtrl-layout-object-property' },
                  [
                    'optionsKey', { tag: 'div', class: 'mtrl-layout-object-key', text: 'options:' },
                    'optionsValue', { tag: 'div', class: 'mtrl-layout-object-value', text: '{...}' }
                  ],
                  'childrenProp', { tag: 'div', class: 'mtrl-layout-object-property' },
                  [
                    'childrenKey', { tag: 'div', class: 'mtrl-layout-object-key', text: 'children:' },
                    'childrenValue', { tag: 'div', class: 'mtrl-layout-object-value' },
                    [
                      'childrenObj', { tag: 'div', class: 'mtrl-layout-object-inner' },
                      [
                        'childProp', { tag: 'div', class: 'mtrl-layout-object-property' },
                        [
                          'childKey', { tag: 'div', class: 'mtrl-layout-object-key', text: 'childName:' },
                          'childValue', { tag: 'div', class: 'mtrl-layout-object-value', text: '{...}' }
                        ]
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ], container)

  // Example showing object-to-DOM mapping
  createLayout([
    'visualExample', { tag: 'div', class: 'mtrl-layout-visual-example' },
    [
      'exampleTitle', { tag: 'h3', class: 'mtrl-layout-example-title', text: 'From Object Schema to DOM' },
      'exampleContainer', { tag: 'div', class: 'mtrl-layout-example-container' },
      [
        'schemaColumn', { tag: 'div', class: 'mtrl-layout-schema-column' },
        [
          'schemaTitle', { tag: 'h4', text: 'Object Schema' },
          'schemaCode', {
            tag: 'pre',
            class: 'mtrl-layout-code',
            text: `{
  element: {
    creator: createElement,
    options: { tag: 'div', class: 'card' },
    children: {
      header: {
        creator: createElement,
        options: { class: 'card-header' },
        children: {
          title: {
            creator: createElement,
            options: { tag: 'h3', text: 'User Profile' }
          }
        }
      },
      content: {
        creator: createElement,
        options: { class: 'card-content' },
        children: {
          avatar: {
            creator: createElement,
            options: { tag: 'img', attributes: { src: 'avatar.jpg' } }
          },
          userName: {
            creator: createElement,
            options: { tag: 'h4', text: 'John Doe' }
          },
          userInfo: {
            creator: createElement,
            options: { tag: 'p', text: 'Software Developer' }
          }
        }
      }
    }
  }
}`
          }
        ],
        'arrowColumn', { tag: 'div', class: 'mtrl-layout-arrow-column' },
        [
          'arrow', { tag: 'div', class: 'mtrl-layout-large-arrow', html: '&#8594;' }
        ],
        'domColumn', { tag: 'div', class: 'mtrl-layout-dom-column' },
        [
          'domTitle', { tag: 'h4', text: 'Resulting DOM' },
          'domVisualization', { tag: 'div', class: 'mtrl-layout-dom-visualization' },
          [
            'domContainer', { tag: 'div', class: 'mtrl-layout-dom-node container' },
            [
              'containerLabel', { tag: 'span', class: 'mtrl-layout-dom-tag', text: 'div.card' },
              'domHeader', { tag: 'div', class: 'mtrl-layout-dom-node header' },
              [
                'headerLabel', { tag: 'span', class: 'mtrl-layout-dom-tag', text: 'div.card-header' },
                'domTitle', { tag: 'div', class: 'mtrl-layout-dom-node title' },
                [
                  'titleLabel', { tag: 'span', class: 'mtrl-layout-dom-tag', text: 'h3' },
                  'titleContent', { tag: 'span', class: 'mtrl-layout-dom-content', text: 'User Profile' }
                ]
              ],
              'domContent', { tag: 'div', class: 'mtrl-layout-dom-node' },
              [
                'contentLabel', { tag: 'span', class: 'mtrl-layout-dom-tag', text: 'div.card-content' },
                'domAvatar', { tag: 'div', class: 'mtrl-layout-dom-node avatar' },
                [
                  'avatarLabel', { tag: 'span', class: 'mtrl-layout-dom-tag', text: 'img' },
                  'avatarAttr', { tag: 'span', class: 'mtrl-layout-dom-attr', text: 'src="avatar.jpg"' }
                ],
                'domUserName', { tag: 'div', class: 'mtrl-layout-dom-node userName' },
                [
                  'userNameLabel', { tag: 'span', class: 'mtrl-layout-dom-tag', text: 'h4' },
                  'userNameContent', { tag: 'span', class: 'mtrl-layout-dom-content', text: 'John Doe' }
                ],
                'domUserInfo', { tag: 'div', class: 'mtrl-layout-dom-node userInfo' },
                [
                  'userInfoLabel', { tag: 'span', class: 'mtrl-layout-dom-tag', text: 'p' },
                  'userInfoContent', { tag: 'span', class: 'mtrl-layout-dom-content', text: 'Software Developer' }
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ], container)

  // Comparison table between array and object schemas
  createLayout([
    'comparisonTable', { tag: 'div', class: 'mtrl-layout-comparison' },
    [
      'comparisonTitle', { tag: 'h3', class: 'mtrl-layout-comparison-title', text: 'Object vs Array Schema Comparison' },
      'comparisonContent', { tag: 'table', class: 'mtrl-layout-comparison-table' },
      [
        'tableHead', { tag: 'thead' },
        [
          'headerRow', { tag: 'tr' },
          [
            'headerFeature', { tag: 'th', text: 'Feature' },
            'headerObject', { tag: 'th', text: 'Object Schema' },
            'headerArray', { tag: 'th', text: 'Array Schema' }
          ]
        ],
        'tableBody', { tag: 'tbody' },
        [
          'row1', { tag: 'tr' },
          [
            'row1Feature', { tag: 'td', text: 'Readability' },
            'row1Object', { tag: 'td', class: 'advantage', text: 'More explicit structure with named properties' },
            'row1Array', { tag: 'td', text: 'More compact but less explicit naming' }
          ],
          'row2', { tag: 'tr' },
          [
            'row2Feature', { tag: 'td', text: 'Performance' },
            'row2Object', { tag: 'td', text: 'Slower for large layouts (property access)' },
            'row2Array', { tag: 'td', class: 'advantage', text: '15-30% faster for large layouts' }
          ],
          'row3', { tag: 'tr' },
          [
            'row3Feature', { tag: 'td', text: 'Memory Usage' },
            'row3Object', { tag: 'td', text: 'Higher memory usage (property names)' },
            'row3Array', { tag: 'td', class: 'advantage', text: 'Lower memory usage' }
          ],
          'row4', { tag: 'tr' },
          [
            'row4Feature', { tag: 'td', text: 'Self-Documentation' },
            'row4Object', { tag: 'td', class: 'advantage', text: 'Property names describe the layout purpose' },
            'row4Array', { tag: 'td', text: 'Relies on comments for documentation' }
          ],
          'row5', { tag: 'tr' },
          [
            'row5Feature', { tag: 'td', text: 'Deep Nesting' },
            'row5Object', { tag: 'td', class: 'advantage', text: 'Clearer representation of deeply nested structures' },
            'row5Array', { tag: 'td', text: 'Can become harder to read with deep nesting' }
          ],
          'row6', { tag: 'tr' },
          [
            'row6Feature', { tag: 'td', text: 'Recommended for' },
            'row6Object', { tag: 'td', text: 'Complex, deeply nested UI structures' },
            'row6Array', { tag: 'td', text: 'Performance-critical and large layouts' }
          ]
        ]
      ]
    ]
  ], container)

  // Add a usage tip box
  createLayout([
    'tipBox', { tag: 'div', class: 'mtrl-layout-tip-box' },
    [
      'tipIcon', { tag: 'span', class: 'material-icons', text: 'tips_and_updates' },
      'tipContent', { tag: 'div', class: 'mtrl-layout-tip-content' },
      [
        'tipTitle', { tag: 'h4', text: 'Usage Tip' },
        'tipDescription', {
          tag: 'p',
          text: 'Consider using object-based schemas for application shell layouts where readability and maintainability are more important than raw performance.'
        }
      ]
    ]
  ], container)
}
