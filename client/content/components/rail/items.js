// src/client/content/components/rail/items.js

import { icons } from '../drawer/items'

export const railItems = () => [
  { id: 'inbox', label: 'Inbox', icon: icons.inbox, badge: 24, badgeLabel: '24 unread', active: true },
  { id: 'outbox', label: 'Outbox', icon: icons.send },
  { id: 'favorites', label: 'Favorites', icon: icons.star, badge: true, badgeLabel: 'New favorites' },
  { id: 'trash', label: 'Trash', icon: icons.trash },
  { id: 'archive', label: 'Archive', icon: icons.label, disabled: true },
  { id: 'settings', label: 'Settings', icon: icons.settings }
]
