import {getDiffDaysFromTimestamp, getHostId} from './utils'

const script = document.currentScript

async function init() {

  const hostId = getHostId(script)
  const storageData = localStorage.getItem('mp')

  let accountIsActive

  async function verifyActiveHostId() {
    try {
      const response = await fetch('http://localhost:5000/dev/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hid: hostId
        })
      })
      const accountData = await response.json()

      console.log({accountData})

      if (accountData.is_active) {
        localStorage.setItem('mp', JSON.stringify({
          accountHid: hostId,
          accountActive: true,
          lastVerified: Date.now(),
        }))
        return true
      }
      return false
    } catch(e) {
      console.error('MP: Error verifying account.')
      return false
    }
  }

  if (!storageData) {
    console.log('No data in storage. Verifying host id..')
    console.log({ hostId })
    // Call verification service to check account status and other data

    accountIsActive = await verifyActiveHostId()

  } else {
    accountIsActive = true
    const mpData = JSON.parse(storageData)
    const { lastVerified, accountActive } = mpData
    const now = new Date().getTime()
    const daysDiff = getDiffDaysFromTimestamp(now, lastVerified)

    console.log({ daysDiff })

    if (daysDiff >= 1) {
      accountIsActive = await verifyActiveHostId()
    } else {
      accountIsActive = accountActive
    }
  }

  if (accountIsActive) {
    console.log('Account is active.')
    // create a new script element
    const newScript = document.createElement('script');
    newScript.src = 'http://localhost:8081/scribe-analytics.js';
    newScript.async = true;

    // insert the script element into the document
    document.head.appendChild(newScript);
  } else {
    console.error('MP: Account is not active.')
  }
}

// Wait until all elements are on the page from initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
