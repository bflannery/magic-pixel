import {getDiffFromTimestamp, uuidv4} from "./utils";
import FingerprintJS from '@fingerprintjs/fingerprintjs'


interface ScribeFormType {
  formId: string
  formFields: Record<string, string>
}

interface MpDataProps {
  accountId: string | null
  accountSiteId: string | null
  accountStatus: string
  lastVerified: number | null
  distinctUserId: string | null
  visitorId: string | null
}

export interface MagicPixelType {
  apiDomain: string
  fingerprint: string | null
  context: MpDataProps
  init: (accountId: string | null, accountSiteId: string | null) => Promise<void>
  identify: (distinctUserId: string) => Promise<boolean>
  authenticateHostData: (mpData: MpDataProps) => Promise<boolean>
  authenticateAccountId: () => Promise<boolean>
  clearStorage: () => void
  getLocalStorageData: () => MpDataProps | null
  setLocalStorageData: (data: MpDataProps) => void
  trackEvent: (scribeEvent: any) => void
}

interface ScribeFormType {
  formId: string
  formFields: Record<string, string>
}

interface ScribeEventType {
  path: string
  value: {
    fingerprint : string
    sessionId : string
    visitorId : string
    userProfile? : string | null
    form?: ScribeFormType | null
    event: string
    timestamp: string
    source?: {
      url?: {
        host?: string
        hostname?: string
        pathname?: string
        protocol?: string
      }
    }
  }
  op: string,
  success: () => void
  failure: () => void
}

const defaultMpData = {
  accountId: null,
  accountSiteId: null,
  accountStatus: 'inactive',
  lastVerified: null,
  distinctUserId: null,
  visitorId: null
}

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load()


export default class MagicPixel {
  apiDomain: string
  fingerprint: string | null
  sessionId: string | null
  context: MpDataProps


  constructor() {
    this.apiDomain = 'http://localhost:5000/dev'
    this.fingerprint = null
    this.sessionId = null
    this.context = {
      accountId: null,
      accountSiteId: null,
      accountStatus: 'inactive',
      lastVerified: null,
      distinctUserId: null,
      visitorId: null
    }
  }

  async init(accountId: string | null, accountSiteId: string | null) {
    this.context.accountId = accountId
    this.context.accountSiteId = accountSiteId
    this.context.visitorId = uuidv4()
    this.sessionId = uuidv4()
  }

  async _apiRequest(method: string, endpoint: string, body: BodyInit) {
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      })
      return response.json()
    } catch (e) {
      console.error(e)
      return e
    }
  }

  _removeMpData(): void {
    this.context = defaultMpData
    localStorage.removeItem('mp')
  }

  _setMpData(data: MpDataProps): boolean {
    this.context = data
    return this.context === data
  }


  async _fingerprint() {
    const fp = await fpPromise
    const result = await fp.get()
    // const fingerprintTimezone = result.components.timezone.value
    return result.visitorId
  }

  getLocalStorageData() {
    const mpLocalStorageData = localStorage.getItem('mp')
    if (mpLocalStorageData) {
      const parsedData = JSON.parse(mpLocalStorageData)
      this._setMpData(parsedData)
      return parsedData
    }
   return mpLocalStorageData
  }

  setLocalStorageData(data: MpDataProps): void {
    this._setMpData(data)
    localStorage.setItem('mp', JSON.stringify(data))
  }

  clearStorage(): void {
    this._removeMpData()
  }

  /**
   * @function: identify
   * @description: The identify function will make an api call to server to create a new person with
   * current visitor UUID. On success, the function will set the MP context distinct user id and update
   * local storage. All future requests will use the new distinct user id to identify events
   */
  async identify(distinctUserId: string): Promise<boolean> {
    try {
      const body = {
        accountId: this.context.accountId,
        distinctUserId,
        visitorId: this.context.visitorId,
      }
      await this._apiRequest('POST', `${this.apiDomain}/identify`, JSON.stringify(body))
      this.context.distinctUserId = distinctUserId
      this.setLocalStorageData(this.context)
      return true
    } catch (e) {
      console.error('MP: Error trying to identify user.')
      return false
    }
  }

  /**
   * @function: trackEvent
   * @description: The trackEvent function will make an api call to send a scribe event
   * to an event queue if MP object is in a valid state
   */
  async trackEvent(scribeEvent: ScribeEventType): Promise<boolean> {
    try {
      if (!this.context?.accountId || !this.context?.accountSiteId) {
        console.warn("MP: Error: Missing ids, cannot track event")
        return false
      }

      if (this.context?.accountStatus !== 'active') {
        console.warn("MP: Error: Account is not active, cannot track event")
        return false
      }

      const event = scribeEvent.value

      let accountEvent = {
        ...event,
        accountId: this.context?.accountId,
        accountSiteId: this.context?.accountSiteId,
        fingerprint: this.fingerprint,
        visitorId: this.context?.visitorId,
        sessionId: this.sessionId
      }

      console.log({ accountEvent })
      const body = JSON.stringify(accountEvent)
      const response = await this._apiRequest('POST', `${this.apiDomain}/collection`, body)
      if (response.status === '403') {
        console.warn("MP: Unauthorized")
        // TODO: Invalidate local storage data
        return false
      }
      console.log('Sent')
      return true
    } catch (e) {
      console.error('MP: Error sending scribe event to MP server.')
      // TODO: Retry or invalidate local storage data
      return false
    }
  }

  /**
   * @function: authenticateAccountId
   * @description: The authenticateAccountId function will make an api call to verify the account
   * status based on the host id provided in script. With response data,
   * the function will update the MP class object data and local/session storage
   */
  async authenticateAccountId(): Promise<boolean> {
    console.log({ mpData: this.context})

    if (!this.fingerprint) {
      this.fingerprint = await this._fingerprint()
    }
    if (this.context.accountId && this.context.accountSiteId) {
      try {
        const jsonBody = JSON.stringify({
          accountId: this.context.accountId,
          accountSiteId: this.context.accountSiteId,
        })

        const accountData = await this._apiRequest(
          'POST',
          `${this.apiDomain}/authentication`, jsonBody
        )

        const localStorageData = {
          ...this.context,
          accountId: this.context.accountId,
          accountSiteId: this.context.accountSiteId,
          accountStatus: accountData.accountStatus,
          lastVerified: Date.now(),
        }

          this.setLocalStorageData(localStorageData)
          // this.setSessionStorageData(sessionId)

          return localStorageData.accountStatus === 'active'
      } catch (e) {
        console.error('MP: Error verifying account.')
        return false
      }
    }
    return false
  }

  /**
   * @function: authenticateHostData
   * @description: Used to verify local storage and MP class object data.
   * The function will check local storage for MP data, and determine if the account
   * is valid through a series of checks on the MP class object around the
   * account id, status, and the last time it was verified
   */

  async authenticateHostData(): Promise<boolean> {
    // If no mpData kill it
    if (!this.context) {
      return false
    }

    // If account ids don't match, re-authenticate and update any stale data
    if (this.context.accountId !== this.context.accountId) {
      return await this.authenticateAccountId()
    }

    // If current location is different from stored fingerprint, get new fingerprint


    const { lastVerified, accountStatus } = this.context
    const now = new Date().getTime()
    const lastVerifiedTimeStamp = lastVerified || new Date().getTime()
    const lastVerifiedHours = getDiffFromTimestamp(now, lastVerifiedTimeStamp, 'hours')

    // If account is inactive, kill it for 24 hours before trying to re-authenticate again
    // TODO: Add logic for delinquent once Stripe implemented
    if (accountStatus === 'inactive' || accountStatus === 'delinquent') {
      if (lastVerifiedHours < 1) {
        return false
      } else {
        return await this.authenticateAccountId()
      }
    }

    // TODO: DO we want to add a way to prevent and future calls for an account?

    // If account is active but hasn't been verified for over an hour, re-authenticate again
    if (accountStatus === 'active') {
      if (lastVerifiedHours >= 1) {
        console.debug(`MP: Re-authenticating account id ${this.context.accountId}`)
        return await this.authenticateAccountId()
      } else {
        if (!this.fingerprint) {
          this.fingerprint = await this._fingerprint()
        }
        return true
      }
    }
    return false
  }

  /**
   * @function: authenticateAccount
   * @description: The authenticateAccount function will authenticate an account
   * based on either host id provided in script or existing local and session storage data
   */
  async authenticateAccount(): Promise<boolean> {
    const mpLocalStorageData = this.getLocalStorageData()
    // const mpSessionID = this.getSessionStorageData()
    if (!mpLocalStorageData) {
      console.debug(`MP: Invalid browser data. Authenticating account id ${this.context.accountId}`)
      // Call verification service to check account status and other data
      return await this.authenticateAccountId()
    } else {
      console.debug(`MP: Authenticating host storage data for account id ${this.context.accountId}`)
      return await this.authenticateHostData()
    }
  }
}
