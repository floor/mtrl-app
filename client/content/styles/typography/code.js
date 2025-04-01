// src/client/content/styles/typography/code.js
import { createLayout } from 'mtrl'

/**
 * Creates the Typography Code section
 * @param {HTMLElement} container - Parent container
 */
export const createTypographyCodeSection = (container) => {
  const sectionStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Using Typography in Code' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'Learn how to use typography scales in your SCSS and JavaScript code.'
      },
      'codeExamples', { tag: 'div', class: 'code-examples' },
      [
        'scssTitle', { tag: 'h3', text: 'SCSS Usage' },
        'scssExample', {
          tag: 'pre',
          class: 'code-block',
          text: `@use 'mtrl/src/styles/abstract/config' as c;

.my-heading {
  @include c.typography('headline-large');
}

.my-paragraph {
  @include c.typography('body-medium');
  
  strong {
    font-weight: 500; // Using defined weights
  }
}`
        },
        'jsTitle', { tag: 'h3', text: 'JavaScript Component Usage' },
        'jsExample', {
          tag: 'pre',
          class: 'code-block',
          text: `// Creating a component with typography styles
const heading = createElement({
  tag: 'h1',
  class: 'type-headline-large',
  text: 'My Heading'
});

// Dynamically changing typography
element.classList.add('type-body-large');
element.classList.remove('type-body-medium');`
        }
      ]
    ]
  ], container)

  return sectionStructure
}
