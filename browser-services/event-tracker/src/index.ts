import { getSiteId } from './utils'
import EventTracker from './eventTracker'

const script = document.currentScript

/**
 * @function: init
 * @description: When page is ready, validates script and account status
 * before loading scribe-analytics tracking and page identification services
 */
async function init() {

  // Get site id from script for validation
  const siteId = getSiteId(script)
  if (!siteId) {
    console.error('MP: Error verifying account. No site id provided')
    return false
  }

  const MP = window.MP
  if (!MP) {
    console.error('MP: No MP object found on window')
    return false
  }

  // Create new MP class and add to window
  const eventTracker = new EventTracker()
  window.MP_EventTracker = eventTracker

  // Check if account is active
  const accountIsActive = await MP.authenticateAccount()
  if (accountIsActive) {
    console.debug('MP: Account is active.')

    // Initialize MP class
    await eventTracker.init()

    // create a new script element
    const newScript = document.createElement('script')
    newScript.src = `http://localhost:8082/scribe-analytics-debug.js?hid=${siteId}`
    newScript.async = true

    // insert the scribe-analytics script element into doc
    document.head.appendChild(newScript)
  } else {
    console.error(`MP: Account is not active for site id ${siteId}.`)
  }
}

// Wait until all elements are on the pageIdentification from initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init().then(() => 'Successfully initiated Magic Pixel')
}
