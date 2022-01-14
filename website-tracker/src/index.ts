import { getSiteId } from './utils'
import MagicPixel from './magicPixel'

const script = document.currentScript

async function init() {
  const siteId = getSiteId(script)

  console.log({ siteId })

  if (!siteId) {
    console.error('MP: Error verifying account. No site id provided')
    return false
  }

  const MP = new MagicPixel(siteId)
  window.MP = MP

  const accountIsActive = await MP.authenticateAccount()

  // const domMap = createDOMMap(document.body, false)
  // console.log(domMap);

  if (accountIsActive) {
    console.debug('MP: Account is active.')
    await MP.init()
    // create a new script element
    const newScript = document.createElement('script')
    newScript.src = `http://localhost:8081/scribe-analytics-debug.js?hid=${siteId}`
    newScript.async = true

    // insert the script element into the document
    document.head.appendChild(newScript)
  } else {
    console.error(`MP: Account is not active for site id ${siteId}.`)
  }
}

// Wait until all elements are on the page from initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init().then(() => 'Successfully initiated Magic Pixel')
}
