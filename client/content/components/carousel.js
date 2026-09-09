// src/client/content/components/carousel.js

import {
  createComponentsLayout,
  createComponentSection,
  createDocs
} from '../../layout'

import {
  createCarousel
} from 'mtrl'
import { createLayout } from 'mtrl-addons'

const sampleSlides = [
  { image: 'https://picsum.photos/id/10/800/600', title: 'Forest Bridge', description: 'A wooden bridge through the trees' },
  { image: 'https://picsum.photos/id/11/800/600', title: 'Dark Waters', description: 'Still lake at twilight' },
  { image: 'https://picsum.photos/id/14/800/600', title: 'Autumn Path', description: 'Golden leaves on a country road' },
  { image: 'https://picsum.photos/id/15/800/600', title: 'River Bend', description: 'Winding river from above' },
  { image: 'https://picsum.photos/id/16/800/600', title: 'Island Surf', description: 'Waves crashing on the shore' },
  { image: 'https://picsum.photos/id/17/800/600', title: 'Wooden Pier', description: 'Dock stretching into the lake' },
  { image: 'https://picsum.photos/id/18/800/600', title: 'Coastal Rocks', description: 'Rocky shoreline at golden hour' },
  { image: 'https://picsum.photos/id/19/800/600', title: 'Misty Falls', description: 'Waterfall hidden in the forest' },
]

export const createCarouselContent = (container) => {
  const info = {
    title: 'Carousel',
    description: 'Carousels show a collection of items that can be scrolled on and off the screen. Items change size as they move through the layout and snap into place.'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  createMultiBrowseCarousel(layout.body)
  createHeroCarousel(layout.body)
  createHeroCenterCarousel(layout.body)
  createUncontainedCarousel(layout.body)
  createFullScreenCarousel(layout.body)
  createDocs(layout.body, 'components/carousel.md')
}

// Mounts a carousel in a section; the carousel fills the height it is given
const section = (container, title, description, config, height) => {
  const layout = createLayout(createComponentSection({ title, description }), container).component
  const carousel = createCarousel({ slides: sampleSlides, ariaLabel: title, ...config })
  carousel.element.style.height = height
  layout.body.appendChild(carousel.element)
  return carousel
}

function createMultiBrowseCarousel(container) {
  return section(
    container,
    'Multi-browse',
    'At least one large, one medium and one small item. Small items stay between 40 and 56dp; more large items appear as the container grows.',
    { variant: 'multi-browse', itemWidth: 280 },
    '280px'
  )
}

function createHeroCarousel(container) {
  return section(
    container,
    'Hero',
    'One large item with a small preview of the next one. The large item is as wide as the container unless itemWidth caps it.',
    { variant: 'hero', itemWidth: 480 },
    '320px'
  )
}

function createHeroCenterCarousel(container) {
  return section(
    container,
    'Center-aligned hero',
    'The large item sits between two small ones once the list is scrolled off its start.',
    { variant: 'hero-center', itemWidth: 480 },
    '320px'
  )
}

function createUncontainedCarousel(container) {
  return section(
    container,
    'Uncontained',
    'Items keep one size and run off the trailing edge. Default scrolling, no snapping.',
    { variant: 'uncontained', itemWidth: 280 },
    '240px'
  )
}

function createFullScreenCarousel(container) {
  const layout = createLayout(createComponentSection({
    title: 'Full-screen',
    description: 'One edge-to-edge item at a time, scrolling vertically. Shown here in a fixed-height frame.'
  }), container).component
  const carousel = createCarousel({ variant: 'full-screen', slides: sampleSlides, ariaLabel: 'Full-screen' })
  carousel.element.style.height = '480px'
  carousel.element.style.maxWidth = '360px'
  layout.body.appendChild(carousel.element)
  return carousel
}
