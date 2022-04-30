import { getSiteId } from './utils'
import ContentIdentification from './contentIdentification'

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
  // Create new MP class and add to window
  const contentIdentification = new ContentIdentification(siteId)
  window.MP_CONTENT_IDENTIFICATION = contentIdentification

  // Initialize MP class
  await contentIdentification.init()

  // Check if account is active
  const accountIsActive = contentIdentification.isAccountActive()
  if (accountIsActive) {
    console.debug('MP: Account is active.')
    contentIdentification.identifyContent()
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
