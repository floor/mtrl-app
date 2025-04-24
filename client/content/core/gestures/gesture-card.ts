// src/examples/gesture-card.ts
/**
 * @module examples
 * @description Example component that uses the gesture system for interactive card functionality
 */

import { 
  pipe,
  createBase,
  withElement,
  withEvents,
  withText,
  withLifecycle,
  withGestures
} from 'mtrl/src/core';

const GESTURE_TYPES = {
  TAP: 'tap',
  SWIPE: 'swipe',
  SWIPE_LEFT: 'swipeleft',
  SWIPE_RIGHT: 'swiperight',
  SWIPE_UP: 'swipeup',
  SWIPE_DOWN: 'swipedown',
  PINCH: 'pinch',
  ROTATE: 'rotate',
  LONG_PRESS: 'longpress',
  PAN: 'pan'
}

/**
 * Configuration for the gesture card component
 */
interface GestureCardConfig {
  /**
   * Card title
   */
  title?: string;
  
  /**
   * Card content
   */
  content?: string;
  
  /**
   * Card image URL
   */
  imageUrl?: string;
  
  /**
   * Whether card is initially flipped to show the back
   */
  flipped?: boolean;
  
  /**
   * Additional CSS classes
   */
  class?: string;
  
  /**
   * Maximum rotation angle for tilt effect (in degrees)
   */
  maxTiltAngle?: number;
  
  /**
   * Minimum distance required for swipe to dismiss card
   */
  dismissThreshold?: number;
  
  /**
   * Component prefix
   */
  prefix?: string;
}

/**
 * Creates an interactive card with gesture-based interactions
 * 
 * This card demonstrates several gesture capabilities:
 * - Tap to flip the card
 * - Double tap to zoom
 * - Swipe to dismiss
 * - Pan to tilt in 3D
 * - Pinch to resize
 * 
 * @param {GestureCardConfig} config - Configuration options
 * @returns Enhanced card component with gesture recognition
 * 
 * @example
 * ```ts
 * const card = createGestureCard({
 *   title: 'Gesture Demo',
 *   content: 'Tap to flip, swipe to dismiss, pan to tilt...',
 *   imageUrl: '/images/card-image.jpg'
 * });
 * 
 * document.body.appendChild(card.element);
 * 
 * card.on('dismiss', () => {
 *   console.log('Card was dismissed');
 * });
 * ```
 */
const createGestureCard = (config: GestureCardConfig = {}) => {
  const {
    title = 'Interactive Card',
    content = 'Use gestures to interact with this card',
    imageUrl = '',
    flipped = false,
    maxTiltAngle = 15,
    dismissThreshold = 150,
    prefix = 'mtrl'
  } = config;
  
  // Card state tracking
  const state = {
    isFlipped: flipped,
    isZoomed: false,
    isDismissing: false,
    tiltX: 0,
    tiltY: 0,
    scale: 1
  };
  
  // Create the component
  const component = pipe(
    createBase,
    withEvents(),
    withElement({
      tag: 'div',
      className: ['gesture-card', config.class],
      componentName: 'gesture-card'
    }),
    withText({ 
      ...config,
      text: '', // We'll set content manually
      componentName: 'gesture-card',
      prefix
    }),
    withGestures({
      // Configure gesture recognition
      swipeThreshold: 30,
      tapDistanceThreshold: 10,
      
      // Set up initial gesture handlers
      gestureHandlers: {
        // Tap to flip card
        'tap': (e) => {
          if (e.count === 1) {
            flipCard();
          } else if (e.count >= 2) {
            toggleZoom();
          }
        },
        
        // Swipe to dismiss
        'swipe': (e) => {
          // Only dismiss on horizontal swipes exceeding threshold
          if (Math.abs(e.deltaX) >= dismissThreshold) {
            dismissCard(e.direction);
          }
        },
        
        // Pan to tilt in 3D
        'pan': (e) => {
          if (state.isZoomed) return; // Don't tilt when zoomed
          
          // Calculate tilt angles based on pan movement
          const cardRect = component.element.getBoundingClientRect();
          const centerX = cardRect.width / 2;
          const centerY = cardRect.height / 2;
          
          // Get position relative to card center
          const relativeX = e.currentX - cardRect.left - centerX;
          const relativeY = e.currentY - cardRect.top - centerY;
          
          // Calculate tilt (invert Y for natural tilt feeling)
          state.tiltY = -relativeX / centerX * maxTiltAngle;
          state.tiltX = relativeY / centerY * maxTiltAngle;
          
          applyTilt();
        },
        
        // Reset tilt when interaction ends
        'tap': () => {
          resetTilt();
        },
        
        // Pinch to resize
        'pinch': (e) => {
          // Limit scale between 0.8 and 1.5
          state.scale = Math.max(0.8, Math.min(1.5, e.scale));
          applyScale();
        }
      }
    }),
    withLifecycle()
  )(config);
  
  /**
   * Create card content structure
   */
  const setupCardContent = () => {
    // Create card inner container (for flip effect)
    const cardInner = document.createElement('div');
    cardInner.className = `${prefix}-gesture-card-inner`;
    
    // Create card front
    const cardFront = document.createElement('div');
    cardFront.className = `${prefix}-gesture-card-front`;
    
    // Add image if provided
    if (imageUrl) {
      const cardImage = document.createElement('div');
      cardImage.className = `${prefix}-gesture-card-image`;
      cardImage.style.backgroundImage = `url(${imageUrl})`;
      cardFront.appendChild(cardImage);
    }
    
    // Add title and content
    const cardTitle = document.createElement('h3');
    cardTitle.className = `${prefix}-gesture-card-title`;
    cardTitle.textContent = title;
    
    const cardContent = document.createElement('div');
    cardContent.className = `${prefix}-gesture-card-content`;
    cardContent.textContent = content;
    
    cardFront.appendChild(cardTitle);
    cardFront.appendChild(cardContent);
    
    // Create card back
    const cardBack = document.createElement('div');
    cardBack.className = `${prefix}-gesture-card-back`;
    
    const backContent = document.createElement('div');
    backContent.className = `${prefix}-gesture-card-content`;
    backContent.innerHTML = `
      <h3>Gesture Instructions</h3>
      <ul>
        <li><strong>Tap</strong> to flip the card</li>
        <li><strong>Double tap</strong> to zoom</li>
        <li><strong>Swipe</strong> left/right to dismiss</li>
        <li><strong>Pan</strong> to tilt in 3D</li>
        <li><strong>Pinch</strong> to resize</li>
      </ul>
    `;
    
    cardBack.appendChild(backContent);
    
    // Assemble card structure
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    component.element.appendChild(cardInner);
    
    // Add gesture hint icon
    const gestureHint = document.createElement('div');
    gestureHint.className = `${prefix}-gesture-card-hint`;
    gestureHint.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M8 13v-8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5v6.5h2v-4.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5v4.5h2v-2.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5v6c0 3.314-2.686 6-6 6h-4c-3.314 0-6-2.686-6-6v-2.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5z"/>
      </svg>
    `;
    component.element.appendChild(gestureHint);
    
    // Apply initial state
    if (state.isFlipped) {
      cardInner.classList.add(`${prefix}-gesture-card-inner--flipped`);
    }
  };
  
  /**
   * Flip the card between front and back
   */
  const flipCard = () => {
    const cardInner = component.element.querySelector(`.${prefix}-gesture-card-inner`);
    if (!cardInner) return;
    
    state.isFlipped = !state.isFlipped;
    cardInner.classList.toggle(`${prefix}-gesture-card-inner--flipped`, state.isFlipped);
    
    // Emit event
    component.emit('flip', { isFlipped: state.isFlipped });
    
    // Reset tilt and zoom when flipping
    resetTilt();
    if (state.isZoomed) {
      toggleZoom();
    }
  };
  
  /**
   * Toggle card zoom state
   */
  const toggleZoom = () => {
    state.isZoomed = !state.isZoomed;
    component.element.classList.toggle(`${prefix}-gesture-card--zoomed`, state.isZoomed);
    
    // Emit event
    component.emit('zoom', { isZoomed: state.isZoomed });
    
    // Reset tilt when zooming
    resetTilt();
  };
  
  /**
   * Apply 3D tilt effect
   */
  const applyTilt = () => {
    component.element.style.transform = 
      `perspective(1000px) rotateX(${state.tiltX}deg) rotateY(${state.tiltY}deg) scale(${state.scale})`;
  };
  
  /**
   * Reset tilt to neutral position
   */
  const resetTilt = () => {
    state.tiltX = 0;
    state.tiltY = 0;
    
    // Only reset scale if not zoomed
    if (!state.isZoomed) {
      state.scale = 1;
    }
    
    // Smooth transition back to neutral
    component.element.style.transition = 'transform 0.5s ease-out';
    applyTilt();
    
    // Remove transition after animation completes
    setTimeout(() => {
      if (component.element) {
        component.element.style.transition = '';
      }
    }, 500);
  };
  
  /**
   * Apply scale transform
   */
  const applyScale = () => {
    // Only apply scale if not zoomed
    if (!state.isZoomed) {
      component.element.style.transform = `scale(${state.scale})`;
    }
  };
  
  /**
   * Dismiss card with animation
   */
  const dismissCard = (direction: string) => {
    if (state.isDismissing) return;
    state.isDismissing = true;
    
    // Add dismissing class for styling
    component.element.classList.add(`${prefix}-gesture-card--dismissing`);
    component.element.classList.add(`${prefix}-gesture-card--dismiss-${direction}`);
    
    // Emit event
    component.emit('dismiss', { direction });
    
    // Remove card after animation
    setTimeout(() => {
      component.element.remove();
    }, 500);
  };
  
  // Initialize card content
  setupCardContent();
    
  // Return enhanced component
  return {
    ...component,
    
    /**
     * Flips the card programmatically
     */
    flip() {
      flipCard();
      return this;
    },
    
    /**
     * Dismisses the card programmatically
     */
    dismiss(direction = 'right') {
      dismissCard(direction);
      return this;
    },
    
    /**
     * Gets current card state
     */
    getState() {
      return { ...state };
    }
  };
};

export default createGestureCard;