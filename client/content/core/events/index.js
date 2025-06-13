// src/client/content/core/events.js

import {
  createContentLayout
} from '../../../layout'

import {
  createLayout
} from 'mtrl'

import { initEventManager } from './manager'
import { initEventEmitter } from './emitter'
import { initEventBus } from './bus'
import { initEventDelegation } from './delegation'
import { initPerformanceUtils } from './performance'
import { initThrottle } from './throttle'
import { initDebounce } from './debounce'
import { initBestPractice } from './bestpractice'
import { initImplementation } from './implementation'

export const createEventsContent = (container) => {
  const content = {
    title: 'Events',
    description: 'A standardized system for handling events across components'
  }

  const layout = createLayout(createContentLayout(content), container).component

  initEventManager(layout.body)
  initEventEmitter(layout.body)
  initEventBus(layout.body)
  initEventDelegation(layout.body)
  initThrottle(layout.body)
  initDebounce(layout.body)
  initPerformanceUtils(layout.body)
  initBestPractice(layout.body)
  initImplementation(layout.body)
}
