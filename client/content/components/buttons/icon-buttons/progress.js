// src/client/content/components/button/spinner.ts
/**
 * Button with progress indicator example
 * Progress is now rendered in a dedicated element, separate from the icon
 */
import {
  createComponentSection
} from '../../../../layout'

import {
  createLayout, createButton
} from 'mtrl'

import { checkIcon, sendIcon, refreshIcon } from '../../../../icons'

/**
 * Initializes button with progress example
 */
export const initProgressButton = (container) => {
  const title = 'Button with progress indicator'
  const description = 'Using the integrated progress indicator for loading states'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  createSendButton(layout.showcase)
  createUploadFileButton(layout.showcase)
  createRefreshButton(layout.showcase)
  createProcessDataButton(layout.showcase)
}

const createSendButton = (container) => {
  // Create a button with integrated progress
  const button = createButton({
    text: 'Send',
    icon: sendIcon,
    variant: 'filled',
    parent: container,
    progress: {
      variant: 'circular',
      size: 20,
      indeterminate: true
    }
  })

  // Add click handler using the new progress API
  button.on('click', () => {
    // Show loading state with progress indicator
    button.setLoadingSync(true, 'Sending...')

    // Simulate async operation
    setTimeout(() => {
      // Complete the operation
      button.setLoadingSync(false, 'Sent!')

      // Optionally show success icon
      if (checkIcon) {
        button.setIcon(checkIcon)

        // Reset after a delay
        setTimeout(() => {
          button.setIcon('')
          button.setText('Send')
        }, 2000)
      }
    }, 2000)
  })
}

const createUploadFileButton = (container) => {
  const uploadButton = createButton({
    text: 'Upload File',
    variant: 'outlined',
    parent: container,
    progress: {
      variant: 'circular',
      size: 20,
      shape: 'wavy',
      indeterminate: false,
      thickness: 2
    }
  })

  uploadButton.on('click', (container) => {
    uploadButton.setLoadingSync(true, 'Uploading...')
    uploadButton.setIndeterminateSync(false)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      uploadButton.setProgressSync(progress)

      if (progress >= 100) {
        clearInterval(interval)
        uploadButton.setLoadingSync(false, 'Uploaded!')
        uploadButton.hideProgressSync()
        // Reset after delay
        setTimeout(() => {
          uploadButton.setText('Upload File')
          uploadButton.setProgressSync(0)
        }, 1000)
      }
    }, 1500)
  })
}

/**
 * Creates Icon button with progress
 */
const createRefreshButton = (container) => {
  const refreshButton = createButton({
    icon: refreshIcon,
    ariaLabel: 'Refresh',
    parent: container,
    progress: {
      variant: 'circular',
      size: 20,
      indeterminate: true
    }
  })

  refreshButton.on('click', () => {
    refreshButton.showProgressSync()
    refreshButton.disable()

    setTimeout(() => {
      refreshButton.hideProgressSync()
      refreshButton.enable()
    }, 1500)
  })
}

const createProcessDataButton = (container) => {
  const processButton = createButton({
    text: 'Process Data',
    variant: 'tonal',
    parent: container,
    progress: {
      variant: 'circular',
      thickness: 2,
      size: 20,
      indeterminate: false
    }
  })

  processButton.on('click', () => {
    processButton.setLoadingSync(true, 'Processing...')

    // Simulate multi-step process
    const steps = 5
    let currentStep = 0

    const processStep = () => {
      currentStep++
      processButton.setProgressSync((currentStep / steps) * 100)

      if (currentStep < steps) {
        setTimeout(processStep, 500)
      } else {
        processButton.setLoadingSync(false, 'Complete!')
        setTimeout(() => {
          processButton.setText('Process Data')
          processButton.setProgressSync(0)
        }, 2000)
      }
    }

    setTimeout(processStep, 300)
  })
}
