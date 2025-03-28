// src/client/content/styles/elevation/code.js
import { createLayout } from 'mtrl'

/**
 * Creates the Elevation Code section
 * @param {HTMLElement} container - Parent container
 */
export const createElevationCodeSection = (container) => {
  const sectionStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Using Elevation in Code' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'Learn how to use elevation in your SCSS and JavaScript code.'
      },
      'codeExamples', { tag: 'div', class: 'code-examples' },
      [
        'scssTitle', { tag: 'h3', text: 'SCSS Usage' },
        'scssExample', {
          tag: 'pre',
          class: 'code-block',
          text: `@use 'mtrl/src/styles/abstract/config' as c;

.my-card {
  @include c.elevation(1);
  
  &:hover {
    @include c.elevation(2);
    transition: box-shadow 0.2s ease;
  }
}`
        },
        'jsTitle', { tag: 'h3', text: 'JavaScript Component Usage' },
        'jsExample', {
          tag: 'pre',
          class: 'code-block',
          text: `// Creating a component with elevation
const card = createElement({
  tag: 'div',
  class: 'elevation-1',
  // other properties...
});

// Dynamically changing elevation
element.classList.remove('elevation-1');
element.classList.add('elevation-3');`
        }
      ]
    ]
  ], container)

  return sectionStructure
}
