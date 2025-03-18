// src/client/routes/index.js

import { generateDynamicRoutes } from '../core/router/dynamic-loader'

/**
 * Application routes configuration using dynamic loading
 * This approach uses code splitting for better performance
 */
export const routes = generateDynamicRoutes()

// Define a 404 route handler for not found routes
export const notFoundHandler = (route, ui) => {
  // if (ui?.content) {
  //   ui.content.innerHTML = `
  //     <div class="not-found">
  //       <h1>Page Not Found</h1>
  //       <p>The requested page "${route.path}" does not exist.</p>
  //       <a href="/" class="mtrl-button mtrl-button--filled">Go to Home</a>
  //     </div>
  //   `
  // }
  // document.title = 'Mtrl - Page Not Found'
  return true
}

export default routes
