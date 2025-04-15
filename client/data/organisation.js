// Example 3: Company Organization with Icons
export const organisation = [
  {
    id: 'executive',
    text: 'Executive',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>',
    hasSubmenu: true,
    submenu: [
      { id: 'ceo', text: 'CEO Office' },
      { id: 'cfo', text: 'Finance' },
      { id: 'coo', text: 'Operations' }
    ]
  },
  {
    id: 'engineering',
    text: 'Engineering',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></svg>',
    hasSubmenu: true,
    submenu: [
      {
        id: 'software',
        text: 'Software',
        hasSubmenu: true,
        submenu: [
          { id: 'frontend', text: 'Frontend' },
          { id: 'backend', text: 'Backend' },
          { id: 'mobile', text: 'Mobile' }
        ]
      },
      {
        id: 'infrastructure',
        text: 'Infrastructure',
        hasSubmenu: true,
        submenu: [
          { id: 'devops', text: 'DevOps' },
          { id: 'security', text: 'Security' },
          { id: 'cloud', text: 'Cloud Operations' }
        ]
      },
      { id: 'qa', text: 'Quality Assurance' }
    ]
  },
  {
    id: 'marketing',
    text: 'Marketing',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z"></path></svg>',
    hasSubmenu: true,
    submenu: [
      { id: 'digital', text: 'Digital Marketing' },
      { id: 'content', text: 'Content Creation' },
      { id: 'events', text: 'Events & PR' }
    ]
  },
  {
    id: 'hr',
    text: 'Human Resources',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path></svg>',
    hasSubmenu: true,
    submenu: [
      { id: 'recruiting', text: 'Recruiting' },
      { id: 'benefits', text: 'Benefits & Compensation' },
      { id: 'training', text: 'Training & Development' }
    ]
  }
]
