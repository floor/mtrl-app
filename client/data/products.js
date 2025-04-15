export const products = [
  {
    id: 'electronics',
    text: 'Electronics',
    hasSubmenu: true,
    submenu: [
      {
        id: 'computers',
        text: 'Computers',
        hasSubmenu: true,
        submenu: [
          { id: 'laptops', text: 'Laptops' },
          { id: 'desktops', text: 'Desktops' },
          { id: 'tablets', text: 'Tablets' },
          { id: 'accessories', text: 'Accessories' }
        ]
      },
      {
        id: 'smartphones',
        text: 'Smartphones',
        hasSubmenu: true,
        submenu: [
          { id: 'android', text: 'Android Phones' },
          { id: 'ios', text: 'iPhones' },
          { id: 'other-phones', text: 'Other Phones' }
        ]
      },
      {
        id: 'tv-audio',
        text: 'TV & Audio',
        hasSubmenu: true,
        submenu: [
          { id: 'tvs', text: 'Televisions' },
          { id: 'speakers', text: 'Speakers' },
          { id: 'headphones', text: 'Headphones' }
        ]
      }
    ]
  },
  {
    id: 'home-garden',
    text: 'Home & Garden',
    hasSubmenu: true,
    submenu: [
      {
        id: 'kitchen',
        text: 'Kitchen',
        hasSubmenu: true,
        submenu: [
          { id: 'appliances', text: 'Appliances' },
          { id: 'cookware', text: 'Cookware' },
          { id: 'utensils', text: 'Utensils' }
        ]
      },
      {
        id: 'furniture',
        text: 'Furniture',
        hasSubmenu: true,
        submenu: [
          { id: 'living-room', text: 'Living Room' },
          { id: 'bedroom', text: 'Bedroom' },
          { id: 'office', text: 'Office' }
        ]
      },
      { id: 'garden', text: 'Garden' }
    ]
  },
  {
    id: 'clothing',
    text: 'Clothing',
    hasSubmenu: true,
    submenu: [
      { id: 'mens', text: 'Men\'s' },
      { id: 'womens', text: 'Women\'s' },
      { id: 'kids', text: 'Kids' }
    ]
  }
]
