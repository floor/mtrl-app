// src/client/content/components/cards/styles.js

// Add CSS styles for the cards
export const addCardStyles = () => {
  // Check if styles already added
  if (document.getElementById('art-card-styles')) {
    return
  }

  const styleElement = document.createElement('style')
  styleElement.id = 'art-card-styles'
  styleElement.textContent = `
    /* Grid layout for cards */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 16px;
    }
    
    /* List layout for horizontal cards */
    .cards-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    
    /* Horizontal card layout */
    .horizontal-card-container {
      display: flex;
      height: 100%;
    }
    
    .horizontal-card-container .mtrl-card-media {
      width: 120px;
      flex-shrink: 0;
    }
    
    .horizontal-card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .horizontal-card-content .mtrl-card-content {
      flex: 1;
    }
    
    /* Style tag */
    .art-style-tag {
      background-color: var(--mtrl-sys-color-secondary-container, #e8def8);
      color: var(--mtrl-sys-color-on-secondary-container, #1d192b);
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 0.75rem;
    }
    
    /* Description text */
    .mtrl-content__description {
      color: var(--mtrl-sys-color-on-surface-variant, #49454f);
      margin-bottom: 8px;
    }
    
    /* Loading pulse animation */
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
    
    .card-loading-placeholder {
      animation: pulse 1.5s infinite ease-in-out;
      background-color: var(--mtrl-sys-color-surface-variant, #e7e0ec);
      border-radius: 4px;
    }
    
    /* Media queries for responsive layout */
    @media (max-width: 768px) {
      .cards-grid {
        grid-template-columns: 1fr;
      }
      
      .horizontal-card-container {
        flex-direction: column;
      }
      
      .horizontal-card-container .mtrl-card-media {
        width: 100%;
        height: 200px;
      }
    }
  `

  document.head.appendChild(styleElement)
}
