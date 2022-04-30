import { getSiteId } from './utils'
import PageIdentification from './pageIdentification'

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
  const pageIdentification = new PageIdentification(siteId)
  window.MP_PAGE_IDENTIFICATION = pageIdentification

  // Initialize MP class
  await pageIdentification.init()

  // Check if account is active
  const accountIsActive = pageIdentification.isAccountActive()
  if (accountIsActive) {
    console.debug('MP: Account is active.')
    pageIdentification.identifyPage()
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
