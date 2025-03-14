// src/client/content/components/carousel.js

import { CAROUSEL_LAYOUTS, CAROUSEL_SCROLL_BEHAVIORS } from 'mtrl/src/components/carousel'

import {
  componentsLayout,
  createComponentsSectionLayout
} from '../../config'

import {
  createLayout,
  createCarousel
} from 'mtrl'

// Sample slide data for examples
const sampleSlides = [
  {
    image: 'https://example.com/image1.jpg',
    title: 'Recent highlights',
    description: 'Check out our latest collection',
    accent: '#3C4043'
  },
  {
    image: 'https://example.com/image2.jpg',
    title: 'La Familia',
    description: 'Family-friendly options',
    accent: '#7E5260',
    buttonText: 'View options',
    buttonUrl: '/family'
  },
  {
    image: 'https://example.com/image3.jpg',
    title: 'New Arrivals',
    description: 'See what\'s new this season',
    accent: '#4F6F52',
    buttonText: 'Explore',
    buttonUrl: '/new'
  },
  {
    image: 'https://example.com/image4.jpg',
    title: 'Limited Edition',
    description: 'Get it before it\'s gone',
    accent: '#5C374C',
    buttonText: 'Buy now',
    buttonUrl: '/limited'
  },
  {
    image: 'https://example.com/image5.jpg',
    title: 'Seasonal Collection',
    description: 'Perfect for this time of year',
    accent: '#4A55A2',
    buttonText: 'See collection',
    buttonUrl: '/seasonal'
  },
  {
    image: 'https://example.com/image1.jpg',
    title: 'Recent highlights',
    description: 'Check out our latest collection',
    accent: '#3C4043',
    buttonText: 'Shop now',
    buttonUrl: '/shop'
  },
  {
    image: 'https://example.com/image2.jpg',
    title: 'La Familia',
    description: 'Family-friendly options',
    accent: '#7E5260',
    buttonText: 'View options',
    buttonUrl: '/family'
  },
  {
    image: 'https://example.com/image3.jpg',
    title: 'New Arrivals',
    description: 'See what\'s new this season',
    accent: '#4F6F52',
    buttonText: 'Explore',
    buttonUrl: '/new'
  },
  {
    image: 'https://example.com/image4.jpg',
    title: 'Limited Edition',
    description: 'Get it before it\'s gone',
    accent: '#5C374C',
    buttonText: 'Buy now',
    buttonUrl: '/limited'
  },
  {
    image: 'https://example.com/image5.jpg',
    title: 'Seasonal Collection',
    description: 'Perfect for this time of year',
    accent: '#4A55A2',
    buttonText: 'See collection',
    buttonUrl: '/seasonal'
  }
]

export const createCarouselContent = (container) => {
  const info = {
    title: 'Carousel',
    description: 'Carousels show a collection of items that can be scrolled on and off the screen'
  }

  const layout = createLayout(componentsLayout(info), container).component

  createMultiBrowseCarousel(layout.body)
  createUncontainedCarousel(layout.body)
  createHeroCarousel(layout.body)
}

export const createMultiBrowseCarousel = (container) => {
  const title = 'Carousel'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component
  // Sample slide content

  // Create the carousel with configuration
  const carousel = createCarousel({
    layout: CAROUSEL_LAYOUTS.MULTI_BROWSE,
    scrollBehavior: CAROUSEL_SCROLL_BEHAVIORS.SNAP,
    slides: sampleSlides,
    gap: 12,
    showAllLink: true,
    onShowAll: () => {
      console.log('Show all items clicked')
      // Typically would navigate to a page showing all items
    }
  })

  // Add to container
  container.appendChild(carousel.element)

  layout.body.appendChild(carousel.element)
}

export function createUncontainedCarousel (container) {
  const title = 'Carousel'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component
  // Create the carousel with uncontained layout and default scrolling
  const carousel = createCarousel({
    layout: CAROUSEL_LAYOUTS.UNCONTAINED,
    scrollBehavior: CAROUSEL_SCROLL_BEHAVIORS.DEFAULT, // Standard scrolling
    slides: sampleSlides.map(slide => ({
      ...slide,
      // Add longer descriptions for text-heavy example
      description: `${slide.description}. This layout is perfect for more detailed content that requires more explanation and context.`
    })),
    gap: 16,
    // We still show the "Show all" link for accessibility
    showAllLink: true
  })

  // Add to container
  layout.body.appendChild(carousel.element)

  return carousel
}

/**
 * Example 3: Hero Carousel
 * For spotlighting content that needs more attention, like featured media
 */
export function createHeroCarousel (container, centered = false) {
  const title = 'Hero carousel'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component
  const carousel = createCarousel({
    layout: CAROUSEL_LAYOUTS.HERO,
    scrollBehavior: CAROUSEL_SCROLL_BEHAVIORS.SNAP, // Snap scrolling recommended
    slides: sampleSlides,
    gap: 8,
    // Optional centered layout
    centered,
    // Adjust the large item width
    largeItemMaxWidth: 320
  })

  // Add to container
  layout.body.appendChild(carousel.element)

  return carousel
}
