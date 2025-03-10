// src/client/content/components/cards/styles.js

/**
 * Add CSS styles for the cards showcase
 * Includes styles for grid layouts, card variations and animations
 */
export const addCardStyles = () => {
  // Check if styles already added
  if (document.getElementById('art-card-styles')) {
    return
  }

  const styleElement = document.createElement('style')
  styleElement.id = 'art-card-styles'
  styleElement.textContent = `
    /* Section and layout styles */
    .mtrl-content__section {
      margin-bottom: 48px;
    }
    
    .mtrl-content__section-title {
      color: var(--mtrl-sys-color-on-surface, #1c1b1f);
      margin-bottom: 8px;
      font-size: 1.5rem;
    }
    
    .mtrl-content__description {
      color: var(--mtrl-sys-color-on-surface-variant, #49454f);
      margin-bottom: 16px;
      font-size: 1rem;
      max-width: 800px;
    }
    
    /* Grid layout for cards */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(344px, 1fr));
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
      height: 100%;
    }
    
    .horizontal-card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .horizontal-card-content .mtrl-card-content {
      flex: 1;
    }
    
    /* Style tag for artwork styles */
    .art-style-tag {
      background-color: var(--mtrl-sys-color-secondary-container, #e8def8);
      color: var(--mtrl-sys-color-on-secondary-container, #1d192b);
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 0.75rem;
      display: inline-flex;
      align-items: center;
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
    
    /* Card update animation */
    @keyframes card-update {
      0% { transform: scale(0.95); opacity: 0.6; }
      70% { transform: scale(1.03); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .card-update-animation {
      animation: card-update 0.6s ease-out;
    }
    
    /* Draggable card indicator */
    .draggable-indicator {
      display: inline-flex;
      align-items: center;
      margin-right: 8px;
      color: var(--mtrl-sys-color-primary, #6750a4);
      font-size: 0.875rem;
    }
    
    .draggable-indicator::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 4px;
      background-color: currentColor;
      border-radius: 2px;
      margin-right: 4px;
      box-shadow: 0 -6px 0 currentColor, 0 6px 0 currentColor;
    }
    
    /* Swipeable card indicator */
    .swipe-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      color: var(--mtrl-sys-color-on-surface-variant, #49454f);
      font-size: 0.75rem;
    }
    
    .swipe-indicator::before,
    .swipe-indicator::after {
      content: '';
      display: inline-block;
      width: 24px;
      height: 2px;
      background-color: currentColor;
      position: relative;
    }
    
    .swipe-indicator::before {
      margin-right: 8px;
      transform: translateX(4px);
    }
    
    .swipe-indicator::before::after {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-left: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(45deg);
      position: absolute;
      left: -4px;
      top: -2px;
    }
    
    .swipe-indicator::after {
      margin-left: 8px;
      transform: translateX(-4px);
    }
    
    .swipe-indicator::after::before {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-right: 2px solid currentColor;
      border-top: 2px solid currentColor;
      transform: rotate(45deg);
      position: absolute;
      right: -4px;
      top: -2px;
    }
    
    /* Enhanced focus styles for a11y demo */
    .a11y-focus-demo:focus-visible {
      outline: 3px solid var(--mtrl-sys-color-tertiary, #7d5260) !important;
      outline-offset: 3px !important;
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
