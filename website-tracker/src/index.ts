import {getDiffDaysFromTimestamp, getHostId, uuidv4} from './utils'

const script = document.currentScript

async function init() {
  const hostId = getHostId(script)
  const mpLocalStorageData = localStorage.getItem('mp')
  const mpSessionID  = sessionStorage.getItem('mp_sid')

  let accountIsActive = false

  async function authenticateHostId(): Promise<boolean>  {
    try {
      const response = await fetch('http://localhost:5000/dev/authentication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hid: hostId
        })
      })
      const accountData = await response.json()

      if (accountData.status === 'active') {
        localStorage.setItem('mp', JSON.stringify({
          accountHid: hostId,
          accountStatus: 'active',
          lastVerified: Date.now(),
        }))

        sessionStorage.setItem('mp_sid',  JSON.stringify(uuidv4()))
        return true
      }
      return false
    } catch(e) {
      console.error('MP: Error verifying account.')
      return false
    }
  }

  if (!mpLocalStorageData || !mpSessionID) {
    console.debug(`MP: Invalid browser data. Authenticating host id ${hostId}`)
    // Call verification service to check account status and other data
    accountIsActive = await authenticateHostId()
  } else {
    const mpData = JSON.parse(mpLocalStorageData)
    const {lastVerified, accountStatus} = mpData

    if (accountStatus === 'active') {
      const now = new Date().getTime()
      const daysDiff = getDiffDaysFromTimestamp(now, lastVerified)

      if (daysDiff >= 1) {
        console.debug(`MP: Re-authenticating host id ${hostId}`)
        accountIsActive = await authenticateHostId()
      } else {
        accountIsActive = accountStatus
      }
    }
  }

  if (accountIsActive) {
    console.debug('MP: Account is active.')
    // create a new script element
    const newScript = document.createElement('script');
    newScript.src = 'http://localhost:8081/scribe-analytics.js';
    newScript.async = true;

    // insert the script element into the document
    document.head.appendChild(newScript);
  } else {
    console.error('MP: Account is not active.')
    localStorage.removeItem('mp')
    sessionStorage.removeItem('mp_sid')
  }
}

// Wait until all elements are on the page from initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
