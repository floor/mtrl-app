// src/client/content/styles/typography/roles.js
import { createLayout, createElement } from 'mtrl'

/**
 * Creates the Typography Roles section
 * @param {HTMLElement} container - Parent container
 */
export const createTypeRolesSection = (container) => {
  const sectionStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Typography Roles' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'Typography roles provide common use cases for the different type scales in your application.'
      },
      'roles', { id: 'typeRoles', class: 'mtrl-type-roles-container' }
    ]
  ], container)

  // Initialize content for the roles section
  initTypeRoles(sectionStructure.get('roles'))
}

/**
 * Initializes the typography roles content
 * @param {HTMLElement} container - Container for the content
 */
export const initTypeRoles = (container) => {
  // Create typography role examples
  const roles = [
    {
      role: 'Page Title',
      scale: 'headline-large',
      sample: 'Page Title',
      description: 'Used for primary headings and page titles.'
    },
    {
      role: 'Section Heading',
      scale: 'headline-medium',
      sample: 'Section Heading',
      description: 'Used for major section headings.'
    },
    {
      role: 'Subsection Heading',
      scale: 'headline-small',
      sample: 'Subsection Heading',
      description: 'Used for subsection headings.'
    },
    {
      role: 'Card Title',
      scale: 'title-medium',
      sample: 'Card Title',
      description: 'Used for card titles and smaller UI elements.'
    },
    {
      role: 'Body Text',
      scale: 'body-medium',
      sample: 'This is standard body text used for paragraphs and general content.',
      description: 'Used for the main body content.'
    },
    {
      role: 'Button Label',
      scale: 'label-large',
      sample: 'BUTTON TEXT',
      description: 'Used for button labels and interactive elements.'
    }
  ]

  roles.forEach(role => {
    const roleContainer = createElement({
      tag: 'div',
      class: 'mtrl-type-role-item'
    })

    const roleHeader = createElement({
      tag: 'div',
      class: 'mtrl-type-role__header'
    })

    const roleTitle = createElement({
      tag: 'h3',
      class: 'mtrl-type-role__title',
      text: role.role
    })

    const roleScale = createElement({
      tag: 'div',
      class: 'mtrl-type-role__scale',
      text: role.scale
    })

    const sampleText = createElement({
      tag: 'div',
      class: `mtrl-type-role__sample mtrl-type-${role.scale}`,
      text: role.sample
    })

    const roleDescription = createElement({
      tag: 'div',
      class: 'mtrl-type-role__description',
      text: role.description
    })

    roleHeader.appendChild(roleTitle)
    roleHeader.appendChild(roleScale)
    roleContainer.appendChild(roleHeader)
    roleContainer.appendChild(sampleText)
    roleContainer.appendChild(roleDescription)

    container.appendChild(roleContainer)
  })
}
