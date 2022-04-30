import { getSiteId } from './utils'
import MagicPixel from './magicPixel'

const script = document.currentScript

/**
 * @function: init
 * @description: When page is ready, validates script and account status
 * before loading event tracking and identification services
 */
async function init() {
  // get site id from script for validation
  const siteId = getSiteId(script)

  if (!siteId) {
    console.error('MP: Error verifying account. No site id provided')
    return false
  }
  // create new MP class and add to window
  const magicPixel = new MagicPixel(siteId)
  window.MP_INIT = magicPixel

  // check if account is active
  const accountIsActive = await magicPixel.authenticateAccount()
  if (accountIsActive) {
    console.debug('MP: Account is active.')

    // initialize MP class
    await magicPixel.init()

    // create a new event-tracker script element
    const eventTrackingScript = document.createElement('script')
    eventTrackingScript.src = `http://localhost:8082/mp-event-tracker.js?sid=${siteId}`
    eventTrackingScript.async = true

    // insert the event-tracker script element into doc
    document.head.appendChild(eventTrackingScript)

    // create a new page identification script element
    const pageIdentificationScript = document.createElement('script')
    pageIdentificationScript.src = `http://localhost:8083/mp-page-identification.js?sid=${siteId}`
    pageIdentificationScript.async = true

    // insert the new page identification script element into doc
    document.head.appendChild(pageIdentificationScript)

    // // create a new content-identification script element
    // const contentIdentificationScript = document.createElement('script')
    // contentIdentificationScript.src = `http://localhost:8084/mp-content-identification.js?sid=${siteId}`
    // contentIdentificationScript.async = true
    //
    // // insert the content-identification script element into doc
    // document.head.appendChild(contentIdentificationScript)
  } else {
    console.error(`MP: Account is not active for site id ${siteId}.`)
  }
}

// wait until all elements are on the page from initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init().then(() => 'Successfully initiated Magic Pixel')
}
