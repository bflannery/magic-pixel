import { getDiffFromTimestamp, uuidv4 } from './utils'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { MpUserProps } from './types'

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load()

const API_DOMAIN = process.env.API_DOMAIN || 'http://localhost:5000/dev'

export default class MagicPixel {
  apiDomain: string
  userContext: MpUserProps

  constructor(accountSiteId: string | null) {
    this.apiDomain = API_DOMAIN
    this.userContext = {
      accountSiteId: accountSiteId,
      accountStatus: 'inactive',
      fingerprint: null,
      sessionId: null,
      lastVerified: null,
      visitorUUID: null,
      distinctPersonId: null,
    }
  }

  async init(): Promise<void> {
    console.debug('MP: Initializing Magic Pixel')

    const mpContext = this.getStorageContext()
    const sessionId = this.getStorageSessionId()

    this.userContext.visitorUUID = mpContext?.visitorUUID || uuidv4()
    this.userContext.lastVerified = mpContext?.lastVerified || null
    this.userContext.sessionId = sessionId || uuidv4()

    if (!mpContext?.fingerprint) {
      this.userContext.fingerprint = await this.fingerprint()
    }
    // Save context and session to browser-services storage
    this.setStorageContext(this.userContext)

    if (this.userContext.sessionId) {
      this.setStorageSessionId(this.userContext.sessionId)
    }

    console.log({ MagicPixel: this })
  }

  // Context
  getStorageContext(): MpUserProps | null {
    const mpStorageContext = localStorage.getItem('mp')
    if (!mpStorageContext) {
      return null
    }
    return JSON.parse(mpStorageContext)
  }

  setStorageContext(data: MpUserProps): void {
    localStorage.setItem('mp', JSON.stringify(data))
  }

  removeStorageContext(): void {
    localStorage.removeItem('mp')
  }

  // Session
  getStorageSessionId(): string | null {
    return sessionStorage.getItem('mp_sid')
  }

  setStorageSessionId(sid: string): void {
    sessionStorage.setItem('mp_sid', sid)
  }

  removeStorageSessionId(): void {
    sessionStorage.removeItem('mp_sid')
  }


  // Fingerprint
  async fingerprint() {
    const fp = await fpPromise
    const result = await fp.get()
    // const fingerprintTimezone = result.components.timezone.value
    return result.visitorId
  }

  setIdentifiedUser(distinctUserId: string): void {
    this.userContext.distinctPersonId = distinctUserId
    this.setStorageContext(this.userContext)
  }

  // TODO: Define return type
  async apiRequest(method: string, endpoint: string, body: object): Promise<any | boolean> {

    // TODO: Add better verification and validation before api requests get sent
    try {
      if (!this.userContext.accountSiteId) {
        console.warn('MP: Error: Missing ids, cannot track event')
        return false
      }

      let accountBody = {
        ...body,
        ...this.userContext,
      }

      const response = await fetch(`${this.apiDomain}/${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountBody),
      })
      return response.json()
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /**
   * @function: authenticateAccountId
   * @description: Will call api to verify the account status based on the host id provided in script.
   * Will update the MP class object data and local/session storage on successful response.
   */
  async authenticateAccountId(): Promise<boolean> {
    if (!this.userContext.fingerprint) {
      this.userContext.fingerprint = await this.fingerprint()
    }
    if (this.userContext.accountSiteId) {
      try {
        const authBody = {
          accountSiteId: this.userContext.accountSiteId,
        }

        const response = await this.apiRequest('POST', `authentication`, authBody)

        const mpContext = {
          ...this.userContext,
          accountSiteId: this.userContext.accountSiteId,
          accountStatus: response.accountStatus,
          lastVerified: Date.now(),
        }

        if (mpContext.accountStatus === 'active') {
          this.userContext = mpContext
          this.setStorageContext(mpContext)
          return true
        }
        return false
      } catch (e) {
        console.error('MP: Error verifying account.')
        return false
      }
    }
    return false
  }

  /**
   * @function: authenticateHostData
   * @description: Verify local storage and MP class object data.
   * Will check local storage for MP data, and determine if the account
   * is valid through a series of checks on the MP class object around the
   * account id, status, and the last time it was verified
   */

  async authenticateHostData(mpStorageContext: MpUserProps): Promise<boolean> {
    try {
      // If no mpData kill it
      if (!this.userContext) {
        return false
      }

      // If account site ids don't match, re-authenticate and update any stale data
      if (this.userContext.accountSiteId !== mpStorageContext.accountSiteId) {
        return await this.authenticateAccountId()
      }

      const { lastVerified, accountStatus } = mpStorageContext
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
          console.debug(`MP: Re-authenticating account id ${this.userContext.accountSiteId}`)
          return await this.authenticateAccountId()
        } else {
          return true
        }
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /**
   * @function: authenticateAccount
   * @description: The authenticateAccount function will authenticate an account
   * based on either host id provided in script or existing local and session storage data
   */
  async authenticateAccount(): Promise<boolean> {
    const mpStorageContext = this.getStorageContext()

    if (!mpStorageContext) {
      console.debug(`MP: Invalid browser data. Authenticating account site id ${this.userContext.accountSiteId}`)
      // Call verification service to check account status and other data
      return await this.authenticateAccountId()
    } else {
      console.debug(`MP: Authenticating host storage data for account site id ${this.userContext.accountSiteId}`)
      return await this.authenticateHostData(mpStorageContext)
    }
  }
}
