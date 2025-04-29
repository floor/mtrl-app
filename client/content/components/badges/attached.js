// src/client/content/components/badges/attached.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout, createBadge, createButton,
  BADGE_VARIANTS, BADGE_COLORS
} from 'mtrl'

export const initAttached = (container) => {
  const title = 'Badges Attached to Elements'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const badgeContainer = document.createElement('div')
  badgeContainer.style.display = 'flex'
  badgeContainer.style.gap = '32px'
  badgeContainer.style.flexWrap = 'wrap'
  badgeContainer.style.marginBottom = '20px'

  // Create a button with a badge
  const buttonWrapper = document.createElement('div')
  buttonWrapper.style.display = 'flex'
  buttonWrapper.style.flexDirection = 'column'
  buttonWrapper.style.alignItems = 'center'
  buttonWrapper.style.gap = '16px'

  const button = createButton({
    text: 'Notifications'
  })

  // First add the button to our wrapper
  buttonWrapper.appendChild(button.element)

  // Then create badge attached to the button
  const badge = createBadge({
    variant: BADGE_VARIANTS.LARGE,
    label: '5',
    color: BADGE_COLORS.ERROR,
    target: button.element
  })

  const buttonLabel = document.createElement('span')
  buttonLabel.textContent = 'Button with large badge'
  buttonLabel.style.fontSize = '12px'

  buttonWrapper.appendChild(buttonLabel)
  badgeContainer.appendChild(buttonWrapper)

  // Create an icon with a dot badge
  const iconWrapper = document.createElement('div')
  iconWrapper.style.display = 'flex'
  iconWrapper.style.flexDirection = 'column'
  iconWrapper.style.alignItems = 'center'
  iconWrapper.style.gap = '16px'

  const icon = document.createElement('span')
  icon.innerHTML = '📧'
  icon.style.fontSize = '24px'

  // First add the icon to our wrapper
  iconWrapper.appendChild(icon)

  // Then create small badge attached to the icon
  const dotBadge = createBadge({
    variant: BADGE_VARIANTS.SMALL,
    color: BADGE_COLORS.PRIMARY,
    target: icon
  })

  const iconLabel = document.createElement('span')
  iconLabel.textContent = 'Icon with small dot badge'
  iconLabel.style.fontSize = '12px'

  iconWrapper.appendChild(iconLabel)
  badgeContainer.appendChild(iconWrapper)

  // Create an avatar with a badge
  const avatarWrapper = document.createElement('div')
  avatarWrapper.style.display = 'flex'
  avatarWrapper.style.flexDirection = 'column'
  avatarWrapper.style.alignItems = 'center'
  avatarWrapper.style.gap = '16px'

  const avatar = document.createElement('div')
  avatar.textContent = 'JD'
  avatar.style.width = '40px'
  avatar.style.height = '40px'
  avatar.style.borderRadius = '50%'
  avatar.style.backgroundColor = '#e0e0e0'
  avatar.style.display = 'flex'
  avatar.style.alignItems = 'center'
  avatar.style.justifyContent = 'center'

  // First add the avatar to our wrapper
  avatarWrapper.appendChild(avatar)

  // Then create small badge attached to the avatar
  const avatarBadge = createBadge({
    variant: BADGE_VARIANTS.SMALL,
    color: BADGE_COLORS.SUCCESS,
    target: avatar
  })

  const avatarLabel = document.createElement('span')
  avatarLabel.textContent = 'Avatar with small status indicator'
  avatarLabel.style.fontSize = '12px'

  avatarWrapper.appendChild(avatarLabel)
  badgeContainer.appendChild(avatarWrapper)

  // Add an example of a navigation item with badge (MD3 primary use case)
  const navWrapper = document.createElement('div')
  navWrapper.style.display = 'flex'
  navWrapper.style.flexDirection = 'column'
  navWrapper.style.alignItems = 'center'
  navWrapper.style.gap = '16px'

  const navItem = document.createElement('div')
  navItem.style.display = 'flex'
  navItem.style.flexDirection = 'column'
  navItem.style.alignItems = 'center'
  navItem.style.padding = '12px'
  navItem.style.borderRadius = '8px'
  navItem.style.backgroundColor = '#f5f5f5'
  navItem.style.cursor = 'pointer'

  const navIcon = document.createElement('span')
  navIcon.innerHTML = '📱'
  navIcon.style.fontSize = '24px'
  navIcon.style.marginBottom = '4px'

  const navText = document.createElement('span')
  navText.textContent = 'Notifications'
  navText.style.fontSize = '12px'

  navItem.appendChild(navIcon)
  navItem.appendChild(navText)
  navWrapper.appendChild(navItem)

  // Create large badge attached to the nav icon (typical MD3 use case)
  const navBadge = createBadge({
    variant: BADGE_VARIANTS.LARGE,
    label: '42',
    color: BADGE_COLORS.ERROR,
    target: navIcon
  })

  const navLabel = document.createElement('span')
  navLabel.textContent = 'Navigation item with badge (MD3 pattern)'
  navLabel.style.fontSize = '12px'

  navWrapper.appendChild(navLabel)
  badgeContainer.appendChild(navWrapper)

  layout.showcase.appendChild(badgeContainer)
}
