import { getSiteId } from './utils'
import MagicPixel from './magicPixel'

const script = document.currentScript
console.log({ script })

/**
 * @function: init
 * @description: When page is ready, validates script and account status
 * before loading scribe-analytics tracking and page identification services
 */
async function init() {

  // get site id from script for validation
  const siteId = getSiteId(script)

  if (!siteId) {
    console.error('MP: Error verifying account. No site id provided')
    return false
  }
  // create new MP class and add to window
  const MP = new MagicPixel(siteId)
  window.MP = MP

  // check if account is active
  const accountIsActive = await MP.authenticateAccount()
  if (accountIsActive) {
    console.debug('MP: Account is active.')

    // initialize MP class
    await MP.init()

    // create a new event-tracker script element
    const eventTrackingScript = document.createElement('script')
    eventTrackingScript.src = `http://localhost:8082/mp-event-tracker.js?sid=${siteId}`
    eventTrackingScript.async = true

    // insert the event-tracker script element into doc
    document.head.appendChild(eventTrackingScript)

    // create a new page-identification script element
    const pageIdentificationScript = document.createElement('script')
    pageIdentificationScript.src = `http://localhost:8083/mp-page-identification.js?sid=${siteId}`
    pageIdentificationScript.async = true

    // insert the page-identification script element into doc
    document.head.appendChild(pageIdentificationScript)
  } else {
    console.error(`MP: Account is not active for site id ${siteId}.`)
  }
}

// wait until all elements are on the pageIdentification from initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init().then(() => 'Successfully initiated Magic Pixel')
}
