# Adaptive Layout System

The adaptive layout system provides responsive, Material Design 3-compliant layouts that automatically adjust based on screen size. It's a powerful pattern for creating apps that gracefully adapt from mobile to desktop viewports.

## Overview

The adaptive layout system supports several Material Design 3 patterns:
- **List-Detail Pattern** - For content browsing (email, files, contacts)
- **Feed Pattern** - For content consumption (social media, news)
- **Supporting Panel Pattern** - For task-focused apps (editors, settings)  
- **Canvas Pattern** - For creation and editing apps (design tools, document editors)

## Basic Usage

```typescript
import { createAdaptiveLayout } from 'mtrl';

const adaptiveLayout = createAdaptiveLayout({
  defaultMode: 'list',
  items: [
    {
      id: 'email1',
      title: 'Project Update',
      subtitle: 'Meeting notes from yesterday',
      icon: '<svg>...</svg>',
      data: {
        sender: 'john@company.com',
        date: '2024-01-15',
        body: 'Here are the updates from our meeting...'
      }
    }
  ],
  renderDetail: (item) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="email-header">
        <h2>${item.title}</h2>
        <p>From: ${item.data.sender} | ${item.data.date}</p>
      </div>
      <div class="email-body">${item.data.body}</div>
    `;
    return div;
  }
});

adaptiveLayout.mount(document.body);
```

## Configuration Options

### `AdaptiveLayoutConfig`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `defaultMode` | `'list' \| 'detail' \| 'split'` | `'list'` | Initial layout mode |
| `breakpoints` | `AdaptiveBreakpoints` | See below | Responsive breakpoints |
| `items` | `Array<ListItem>` | `[]` | Items for list view |
| `renderDetail` | `(item: any) => HTMLElement` | Default renderer | Custom detail view renderer |
| `renderList` | `(items: any[]) => HTMLElement` | Navigation system | Custom list view renderer |
| `class` | `string` | `''` | Additional CSS classes |
| `layout` | `LayoutConfig` | Auto-generated | Custom layout configuration |
| `navigation` | `NavigationConfig` | `{ enabled: true }` | Navigation system options |

### Default Breakpoints

```typescript
{
  compact: 600,   // Mobile: < 600px
  medium: 839,    // Tablet: 600px - 839px
  expanded: 1200  // Desktop: >= 840px
}
```

## Layout Modes

### List Mode (Mobile)
- Shows only the list view
- Perfect for mobile devices
- Navigation drawer appears on demand

### Detail Mode (Mobile)
- Shows only the detail view when an item is selected
- Automatically switches back to list when no item is selected

### Split Mode (Tablet/Desktop)
- Shows both list and detail views side by side
- List panel takes 4/12 width on desktop, 5/12 on tablet
- Detail panel takes 8/12 width on desktop, 7/12 on tablet

## API Methods

### `mount(container: HTMLElement)`
Mounts the layout to a container element.

```typescript
adaptiveLayout.mount(document.getElementById('app'));
```

### `setSelectedItem(item: any)`
Programmatically select an item and update the detail view.

```typescript
adaptiveLayout.setSelectedItem({ id: 'email1', title: 'Selected Email' });
```

### `setItems(items: any[])`
Update the list of items and refresh the navigation.

```typescript
adaptiveLayout.setItems([
  { id: 'new1', title: 'New Item 1' },
  { id: 'new2', title: 'New Item 2' }
]);
```

### `getState()`
Get the current state of the adaptive layout.

```typescript
const state = adaptiveLayout.getState();
console.log(state.mode, state.selectedItem);
```

### `destroy()`
Clean up the layout and remove event listeners.

```typescript
adaptiveLayout.destroy();
```

## Complete Examples

### 1. Email Application

```typescript
import { createAdaptiveLayout } from 'mtrl';

// Sample email data
const emails = [
  {
    id: 'email1',
    title: 'Team Meeting Notes',
    subtitle: 'Q4 Planning Discussion',
    icon: `<svg class="email-icon" viewBox="0 0 24 24">
      <path d="M20 6l-10 6L0 6L10 0l10 6z"/>
      <path d="M0 8v10h20V8l-10 6L0 8z"/>
    </svg>`,
    data: {
      sender: 'sarah.johnson@company.com',
      date: '2024-01-15 10:30',
      body: `Hi team,

Here are the key points from today's Q4 planning meeting:

1. Product Launch Timeline
   - Beta testing: Feb 1-14
   - Final QA: Feb 15-28
   - Launch date: March 1

2. Resource Allocation
   - 3 developers for core features
   - 2 QA engineers for testing
   - 1 designer for final assets

Please let me know if you have any questions.

Best regards,
Sarah`,
      attachments: [
        { name: 'Q4-Timeline.pdf', size: '2.4 MB' },
        { name: 'Budget-Proposal.xlsx', size: '856 KB' }
      ]
    }
  },
  {
    id: 'email2',
    title: 'Security Update Required',
    subtitle: 'Action needed by Friday',
    icon: `<svg class="email-icon warning" viewBox="0 0 24 24">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
      <path d="M2 17L12 22L22 17"/>
      <path d="M2 12L12 17L22 12"/>
    </svg>`,
    data: {
      sender: 'security@company.com',
      date: '2024-01-14 14:00',
      body: `IMPORTANT: Security Update Required

Your account requires a security update by Friday, January 19th.

Required actions:
- Update your password (min 12 characters)
- Enable two-factor authentication
- Review connected devices

Failure to complete these steps may result in temporary account suspension.

Security Team`,
      priority: 'high',
      labels: ['Security', 'Action Required']
    }
  }
];

// Create adaptive email layout
const emailApp = createAdaptiveLayout({
  defaultMode: 'list',
  items: emails,
  
  // Custom list renderer with email-specific styling
  renderList: (items) => {
    const list = document.createElement('div');
    list.className = 'email-list-custom';
    
    items.forEach(item => {
      const emailCard = document.createElement('div');
      emailCard.className = 'email-card';
      if (item.data.priority === 'high') {
        emailCard.classList.add('email-card--priority');
      }
      
      emailCard.innerHTML = `
        <div class="email-preview">
          <div class="email-meta">
            ${item.icon}
            <div class="email-headers">
              <h3>${item.title}</h3>
              <p class="email-subtitle">${item.subtitle}</p>
              <div class="email-info">
                <span>${item.data.sender}</span>
                <span>${item.data.date}</span>
              </div>
            </div>
          </div>
          ${item.data.attachments ? `
            <div class="attachments-indicator">
              <svg viewBox="0 0 24 24">
                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
              </svg>
              ${item.data.attachments.length}
            </div>
          ` : ''}
        </div>
      `;
      
      emailCard.onclick = () => emailApp.setSelectedItem(item);
      list.appendChild(emailCard);
    });
    
    return list;
  },
  
  // Custom detail renderer with rich content
  renderDetail: (item) => {
    const detail = document.createElement('div');
    detail.className = 'email-detail';
    
    detail.innerHTML = `
      <div class="email-detail-header">
        <button class="back-button" onclick="${() => emailApp.setSelectedItem(null)}">
          <svg viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back
        </button>
        <h2>${item.title}</h2>
      </div>
      
      <div class="email-detail-meta">
        <div class="sender-info">
          <div class="avatar">${item.data.sender.charAt(0).toUpperCase()}</div>
          <div>
            <strong>${item.data.sender}</strong>
            <p>${item.data.date}</p>
          </div>
        </div>
        ${item.data.labels ? `
          <div class="email-labels">
            ${item.data.labels.map(label => `
              <span class="email-label">${label}</span>
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      <div class="email-body">
        ${item.data.body.replace(/\n/g, '<br>')}
      </div>
      
      ${item.data.attachments ? `
        <div class="email-attachments">
          <h3>Attachments</h3>
          <ul>
            ${item.data.attachments.map(att => `
              <li class="attachment-item">
                <svg viewBox="0 0 24 24">
                  <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8l6-6V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
                </svg>
                <div>
                  <div>${att.name}</div>
                  <div class="attachment-size">${att.size}</div>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
      
      <div class="email-actions">
        <button class="primary-button">Reply</button>
        <button class="secondary-button">Forward</button>
        <button class="text-button">Archive</button>
      </div>
    `;
    
    return detail;
  },
  
  // Custom navigation options
  navigation: {
    enabled: true,
    options: {
      hideDrawerOnClick: true,
      showLabelsOnRail: false,
      hoverDelay: 100,
      closeDelay: 200
    }
  }
});

emailApp.mount(document.body);
```

### 2. Social Media Feed

```typescript
const socialFeed = createAdaptiveLayout({
  defaultMode: 'feed',
  
  // Custom layout for feed pattern
  layout: {
    type: 'row',
    gap: 16,
    class: 'social-feed-layout'
  },
  
  items: socialPosts,
  
  // Customize layout schema for feed pattern
  getLayoutSchema: (state) => ({
    element: {
      options: {
        tag: 'div',
        className: 'social-feed-container',
        layout: {
          type: 'row',
          gap: 16
        }
      },
      children: {
        sidebar: {
          name: 'sidebar',
          options: {
            tag: 'div',
            className: 'social-sidebar',
            layoutItem: { width: state.isMobile ? 0 : 2 },
            style: { display: state.isMobile ? 'none' : 'block' }
          }
        },
        feed: {
          name: 'feed',
          options: {
            tag: 'div',
            className: 'social-feed',
            layoutItem: { width: state.isMobile ? 12 : 6 }
          }
        },
        trending: {
          name: 'trending',
          options: {
            tag: 'div',
            className: 'social-trending',
            layoutItem: { width: state.isMobile ? 0 : 4 },
            style: { display: state.isMobile ? 'none' : 'block' }
          }
        }
      }
    }
  }),
  
  renderList: (items) => {
    const feed = document.createElement('div');
    feed.className = 'social-feed-content';
    
    items.forEach(post => {
      const postElement = document.createElement('article');
      postElement.className = 'social-post';
      
      postElement.innerHTML = `
        <div class="post-header">
          <img src="${post.userAvatar}" alt="${post.username}" class="avatar">
          <div class="post-meta">
            <strong>${post.username}</strong>
            <time>${post.timestamp}</time>
          </div>
        </div>
        
        <div class="post-content">
          <p>${post.content}</p>
          ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
        </div>
        
        <div class="post-actions">
          <button class="action-button like ${post.liked ? 'active' : ''}">
            <svg viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            ${post.likes}
          </button>
          
          <button class="action-button comment">
            <svg viewBox="0 0 24 24">
              <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
            ${post.comments}
          </button>
          
          <button class="action-button share">
            <svg viewBox="0 0 24 24">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
          </button>
        </div>
      `;
      
      feed.appendChild(postElement);
    });
    
    return feed;
  }
});
```

### 3. File Manager

```typescript
const fileManager = createAdaptiveLayout({
  defaultMode: 'list',
  items: files,
  
  renderList: (items) => {
    const fileGrid = document.createElement('div');
    fileGrid.className = 'file-grid';
    
    items.forEach(file => {
      const fileCard = document.createElement('div');
      fileCard.className = `file-card file-card--${file.type}`;
      
      fileCard.innerHTML = `
        <div class="file-icon">
          ${getFileIcon(file.type)}
        </div>
        <div class="file-info">
          <h4>${file.name}</h4>
          <p>${formatFileSize(file.size)}</p>
          <p>${new Date(file.modified).toLocaleDateString()}</p>
        </div>
        ${file.thumbnail ? `
          <img src="${file.thumbnail}" alt="${file.name}" class="file-thumbnail">
        ` : ''}
      `;
      
      // Double-click to open
      fileCard.ondblclick = () => handleFileOpen(file);
      
      fileCard.onclick = () => fileManager.setSelectedItem(file);
      
      fileGrid.appendChild(fileCard);
    });
    
    return fileGrid;
  },
  
  renderDetail: (file) => {
    const detail = document.createElement('div');
    detail.className = 'file-detail';
    
    detail.innerHTML = `
      <div class="file-preview">
        ${getFilePreview(file)}
      </div>
      
      <div class="file-properties">
        <h2>${file.name}</h2>
        
        <dl>
          <dt>Type:</dt>
          <dd>${file.type.toUpperCase()} File</dd>
          
          <dt>Size:</dt>
          <dd>${formatFileSize(file.size)}</dd>
          
          <dt>Created:</dt>
          <dd>${new Date(file.created).toLocaleString()}</dd>
          
          <dt>Modified:</dt>
          <dd>${new Date(file.modified).toLocaleString()}</dd>
          
          <dt>Location:</dt>
          <dd>${file.path}</dd>
        </dl>
        
        <div class="file-actions">
          <button class="primary-button" onclick="${() => handleFileOpen(file)}">
            Open
          </button>
          <button class="secondary-button" onclick="${() => handleFileEdit(file)}">
            Edit
          </button>
          <button class="text-button" onclick="${() => handleFileDelete(file)}">
            Delete
          </button>
        </div>
      </div>
      
      ${file.metadata ? `
        <div class="file-metadata">
          <h3>Metadata</h3>
          <pre>${JSON.stringify(file.metadata, null, 2)}</pre>
        </div>
```

### 4. Settings/Preferences Panel

```typescript
const settingsPanel = createAdaptiveLayout({
  defaultMode: 'list',
  
  items: [
    {
      id: 'profile',
      title: 'Profile',
      subtitle: 'Manage your account settings',
      icon: `<svg viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>`,
      data: {
        category: 'account',
        settings: [
          { id: 'username', label: 'Username', value: 'john.doe', type: 'text' },
          { id: 'email', label: 'Email', value: 'john@example.com', type: 'email' },
          { id: 'password', label: 'Password', value: '******', type: 'password' },
          { id: 'avatar', label: 'Profile Picture', type: 'file' }
        ]
      }
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Configure alert preferences',
      icon: `<svg viewBox="0 0 24 24">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
      </svg>`,
      data: {
        category: 'preferences',
        settings: [
          { id: 'email-notifs', label: 'Email Notifications', value: true, type: 'toggle' },
          { id: 'push-notifs', label: 'Push Notifications', value: false, type: 'toggle' },
          { id: 'frequency', label: 'Notification Frequency', value: 'immediate', type: 'select', options: ['immediate', 'hourly', 'daily'] },
          { id: 'do-not-disturb', label: 'Do Not Disturb', value: false, type: 'toggle' }
        ]
      }
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Control your data and security',
      icon: `<svg viewBox="0 0 24 24">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>`,
      data: {
        category: 'security',
        settings: [
          { id: 'two-factor', label: 'Two-Factor Authentication', value: true, type: 'toggle' },
          { id: 'session-timeout', label: 'Session Timeout', value: '30', type: 'number', unit: 'minutes' },
          { id: 'data-sharing', label: 'Data Sharing', value: false, type: 'toggle' },
          { id: 'activity-log', label: 'View Activity Log', type: 'action' }
        ]
      }
    }
  ],
  
  renderDetail: (item) => {
    const detail = document.createElement('div');
    detail.className = 'settings-detail';
    
    detail.innerHTML = `
      <div class="settings-header">
        <h2>${item.title}</h2>
        <p>${item.subtitle}</p>
      </div>
      
      <form class="settings-form">
        ${item.data.settings.map(setting => {
          switch (setting.type) {
            case 'text':
            case 'email':
              return `
                <div class="form-group">
                  <label for="${setting.id}">${setting.label}</label>
                  <input type="${setting.type}" id="${setting.id}" value="${setting.value}">
                </div>
              `;
            
            case 'password':
              return `
                <div class="form-group">
                  <label for="${setting.id}">${setting.label}</label>
                  <div class="password-field">
                    <input type="password" id="${setting.id}" value="${setting.value}">
                    <button type="button" class="show-password" onclick="togglePassword('${setting.id}')">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              `;
            
            case 'toggle':
              return `
                <div class="form-group form-group--toggle">
                  <label for="${setting.id}">${setting.label}</label>
                  <div class="toggle-wrapper">
                    <input type="checkbox" id="${setting.id}" ${setting.value ? 'checked' : ''}>
                    <label for="${setting.id}" class="toggle-slider"></label>
                  </div>
                </div>
              `;
            
            case 'select':
              return `
                <div class="form-group">
                  <label for="${setting.id}">${setting.label}</label>
                  <select id="${setting.id}">
                    ${setting.options?.map(option => `
                      <option value="${option}" ${option === setting.value ? 'selected' : ''}>
                        ${option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    `).join('')}
                  </select>
                </div>
              `;
            
            case 'number':
              return `
                <div class="form-group">
                  <label for="${setting.id}">${setting.label}</label>
                  <div class="number-input">
                    <input type="number" id="${setting.id}" value="${setting.value}">
                    ${setting.unit ? `<span class="unit">${setting.unit}</span>` : ''}
                  </div>
                </div>
              `;
            
            case 'action':
              return `
                <div class="form-group form-group--action">
                  <button type="button" class="action-button" onclick="handleSettingAction('${setting.id}')">
                    ${setting.label}
                  </button>
                </div>
              `;
            
            default:
              return '';
          }
        }).join('')}
        
        <div class="form-actions">
          <button type="submit" class="primary-button">Save Changes</button>
          <button type="reset" class="secondary-button">Reset</button>
        </div>
      </form>
    `;
    
    // Add form submit handler
    const form = detail.querySelector('.settings-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      saveSettings(item.id, formData);
    };
    
    return detail;
  },
  
  // Add custom navigation with categories
  navigation: {
    enabled: true,
    options: {
      showLabelsOnRail: true,
      railOptions: {
        variant: 'drawer',
        showCategories: true
      }
    }
  }
});
```

### 5. Dashboard Layout

```typescript
const dashboard = createAdaptiveLayout({
  defaultMode: 'overview',
  
  // Custom layout for dashboard
  getLayoutSchema: (state) => ({
    element: {
      options: {
        tag: 'div',
        className: 'dashboard-layout',
        layout: {
          type: 'grid',
          columns: state.isMobile ? 1 : state.isTablet ? 2 : 4,
          gap: 16,
          autoHeight: true
        }
      },
      children: {
        overview: {
          name: 'overview',
          options: {
            tag: 'div',
            className: 'dashboard-overview',
            layoutItem: { span: state.isMobile ? 1 : 4 }
          }
        },
        charts: {
          name: 'charts',
          options: {
            tag: 'div',
            className: 'dashboard-charts',
            layoutItem: { span: state.isMobile ? 1 : state.isTablet ? 2 : 3 }
          }
        },
        alerts: {
          name: 'alerts',
          options: {
            tag: 'div',
            className: 'dashboard-alerts',
            layoutItem: { span: state.isMobile ? 1 : state.isTablet ? 2 : 1 }
          }
        },
        activity: {
          name: 'activity',
          options: {
            tag: 'div',
            className: 'dashboard-activity',
            layoutItem: { span: state.isMobile ? 1 : 2 }
          }
        }
      }
    }
  }),
  
  // Render overview section with metrics cards
  renderOverview: () => {
    const overview = document.createElement('div');
    overview.className = 'metrics-grid';
    
    const metrics = [
      {
        title: 'Total Revenue',
        value: '$47,589',
        change: '+12.5%',
        trend: 'up',
        icon: `<svg viewBox="0 0 24 24">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>`
      },
      // ... more metrics
    ];
    
    metrics.forEach(metric => {
      overview.appendChild(createMetricCard(metric));
    });
    
    return overview;
  }
});
```

### 6. Real-time Analytics

```typescript
const analytics = createAdaptiveLayout({
  defaultMode: 'realtime',
  
  // Initialize with real-time data streaming
  onMount: () => {
    setupWebSocket();
    updateDataStream();
  },
  
  renderDetail: (data) => {
    const detail = document.createElement('div');
    detail.className = 'analytics-detail';
    
    detail.innerHTML = `
      <div class="analytics-header">
        <h2>Real-time Analytics</h2>
        <div class="time-range-selector">
          <button class="active" data-range="1h">1h</button>
          <button data-range="6h">6h</button>
          <button data-range="24h">24h</button>
          <button data-range="7d">7d</button>
        </div>
      </div>
      
      <div class="charts-container">
        <div class="chart-card">
          <h3>User Activity</h3>
          <canvas id="user-activity-chart"></canvas>
        </div>
        
        <div class="chart-card">
          <h3>Revenue Stream</h3>
          <canvas id="revenue-chart"></canvas>
        </div>
        
        <div class="chart-card">
          <h3>System Performance</h3>
          <canvas id="performance-chart"></canvas>
        </div>
      </div>
      
      <div class="live-metrics">
        <div class="metric-item">
          <span>Active Users</span>
          <strong id="active-users">0</strong>
        </div>
        <div class="metric-item">
          <span>API Calls/sec</span>
          <strong id="api-calls">0</strong>
        </div>
        <div class="metric-item">
          <span>Error Rate</span>
          <strong id="error-rate">0%</strong>
        </div>
      </div>
    `;
    
    // Initialize charts
    initializeCharts();
    
    // Start real-time updates
    startRealtimeUpdates();
    
    return detail;
  }
});
```

## Advanced Responsive Features

### Custom Breakpoint Handlers

```typescript
const adaptiveLayout = createAdaptiveLayout({
  // ... config
  
  onBreakpointChange: (state) => {
    switch (true) {
      case state.isMobile:
        // Mobile-specific optimizations
        disableAnimations();
        reduceChartComplexity();
        break;
        
      case state.isTablet:
        // Tablet-specific optimizations
        enableBasicAnimations();
        mediumChartComplexity();
        break;
        
      case state.isDesktop:
        // Desktop-specific optimizations
        enableAllAnimations();
        highDetailCharts();
        break;
    }
  }
});
```

### Custom Event Handling

```typescript
const adaptiveLayout = createAdaptiveLayout({
  // ... config
  
  onItemSelect: (item, state) => {
    // Custom selection handling
    if (state.isMobile) {
      // Add custom mobile behavior
      addTouchFeedback();
    }
    
    // Update URL for deep linking
    updateURL(item.id);
    
    // Track analytics
    trackItemView(item);
  },
  
  onModeChange: (newMode, oldMode) => {
    // Handle layout mode changes
    console.log(`Layout changed from ${oldMode} to ${newMode}`);
    
    // Save user preference
    saveLayoutPreference(newMode);
  }
});
```

## CSS Styling Examples

### Complete SCSS Implementation

```scss
.mtrl-adaptive-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  &-content {
    flex: 1;
    overflow: hidden;
    position: relative;
    
    // Mode-specific layouts
    &.mtrl-adaptive-layout--list {
      .mtrl-adaptive-layout-detail {
        display: none;
      }
    }
    
    &.mtrl-adaptive-layout--detail {
      .mtrl-adaptive-layout-list {
        display: none;
      }
    }
    
    &.mtrl-adaptive-layout--split {
      display: flex;
      gap: var(--mtrl-spacing-2);
      
      @media (max-width: 600px) {
        flex-direction: column;
      }
    }
  }
  
  // Panel styling
  &-list, &-detail {
    overflow-y: auto;
    overflow-x: hidden;
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--mtrl-surface-variant);
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--mtrl-on-surface-variant);
      border-radius: 4px;
    }
  }
  
  &-list {
    background: var(--mtrl-surface);
    border-right: 1px solid var(--mtrl-outline-variant);
    
    @media (max-width: 600px) {
      border-right: none;
      border-bottom: 1px solid var(--mtrl-outline-variant);
    }
  }
  
  &-detail {
    background: var(--mtrl-surface-container);
    padding: var(--mtrl-spacing-2);
    
    @media (max-width: 600px) {
      padding: var(--mtrl-spacing-1);
    }
  }
}

// Email application specific styles
.email-card {
  border-radius: var(--mtrl-corner-medium);
  padding: var(--mtrl-spacing-2);
  margin-bottom: var(--mtrl-spacing-1);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--mtrl-surface-variant);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &--priority {
    border-left: 4px solid var(--mtrl-error);
  }
  
  .email-preview {
    display: flex;
    align-items: center;
    gap: var(--mtrl-spacing-2);
  }
  
  .email-icon {
    width: 24px;
    height: 24px;
    fill: var(--mtrl-primary);
    
    &.warning {
      fill: var(--mtrl-error);
    }
  }
  
  h3 {
    font: var(--mtrl-title-medium);
    margin: 0;
  }
  
  .email-subtitle {
    font: var(--mtrl-body-medium);
    color: var(--mtrl-on-surface-variant);
  }
}
```

## Performance Optimization

### Lazy Loading

```typescript
const adaptiveLayout = createAdaptiveLayout({
  // ... config
  
  renderDetail: async (item) => {
    const detail = document.createElement('div');
    
    // Show loading state
    detail.innerHTML = '<div class="loading">Loading...</div>';
    
    // Lazy load heavy content
    const heavyContent = await loadHeavyContent(item.id);
    
    detail.innerHTML = `
      <div class="detail-content">
        ${heavyContent}
      </div>
    `;
    
    return detail;
  }
});
```

### Virtual Scrolling

```typescript
import { VirtualScroller } from './virtual-scroller';

const adaptiveLayout = createAdaptiveLayout({
  renderList: (items) => {
    const container = document.createElement('div');
    
    const virtualScroller = new VirtualScroller({
      container,
      items,
      rowHeight: 60,
      renderItem: (item, index) => {
        const row = document.createElement('div');
        row.className = 'list-item';
        row.style.height = '60px';
        row.innerHTML = `
          <div>${item.title}</div>
        `;
        return row;
      }
    });
    
    return container;
  }
});
```

## Best Practices

1. **Performance**
   - Implement virtual scrolling for long lists
   - Use lazy loading for heavy detail views
   - Debounce resize events
   - Optimize animations based on device capabilities

2. **Accessibility**
   - Ensure keyboard navigation works across all modes
   - Provide proper ARIA attributes
   - Support screen readers
   - Make touch targets at least 44px

3. **Mobile-First**
   - Design for mobile constraints first
   - Progressive enhancement for larger screens
   - Use appropriate touch gestures
   - Optimize for thumb reach zones

4. **Data Management**
   - Handle loading states gracefully
   - Implement error boundaries
   - Cache frequently accessed data
   - Use optimistic updates

5. **User Experience**
   - Maintain navigation context
   - Preserve scroll positions
   - Provide clear visual feedback
   - Support deep linking

## Troubleshooting Guide

### Common Issues

1. **Navigation Not Showing**
   ```typescript
   // Check if navigation is enabled
   console.log(adaptiveLayout.getState().navigation);
   
   // Ensure items array is not empty
   if (config.items.length === 0) {
     // Handle empty state
   }
   ```

2. **Layout Not Responsive**
   ```typescript
   // Verify breakpoints
   window.addEventListener('resize', () => {
     console.log(window.innerWidth);
     console.log(adaptiveLayout.getState());
   });
   ```

3. **Performance Issues**
   ```typescript
   // Use performance monitoring
   const observer = new PerformanceObserver((list) => {
     list.getEntries().forEach(entry => {
       console.log(entry.name, entry.duration);
     });
   });
   observer.observe({ entryTypes: ['measure'] });
   ```

4. **Memory Leaks**
   ```typescript
   // Ensure proper cleanup
   window.addEventListener('beforeunload', () => {
     adaptiveLayout.destroy();
   });
   ```

5. **Touch Targets Too Small**
   ```scss
   // Use minimum touch target size
   .clickable {
     min-width: 44px;
     min-height: 44px;
   }
   ```