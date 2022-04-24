import { getDiffFromTimestamp, uuidv4 } from './utils'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { MpDataProps } from './types'

const defaultURLProps = {
  href: null,
  hash: null,
  host: null,
  hostname: null,
  pathname: null,
  protocol: null,
  query: {},
}

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load()

export default class MagicPixel {
  apiDomain: string
  fingerprint: string | null
  sessionId: string | null
  context: MpDataProps

  constructor(accountSiteId: string | null) {
    this.apiDomain = 'http://localhost:5000/dev'
    this.fingerprint = null
    this.sessionId = null
    this.context = {
      accountSiteId: accountSiteId,
      accountStatus: 'inactive',
      lastVerified: null,
      visitorUUID: null,
      distinctPersonId: null,
    }
  }

  async init(): Promise<void> {
    console.debug('MP: Initializing Magic Pixel')

    const mpContext = this._getStorageContext()
    const sessionId = this._getStorageSessionId()
    this.context.visitorUUID = mpContext?.visitorUUID || uuidv4()
    this.context.lastVerified = mpContext?.lastVerified || null
    this.sessionId = sessionId || uuidv4()

    // Save context and session to browser-services storage
    this._setStorageContext(this.context)

    if (this.sessionId) {
      this._setStorageSessionId(this.sessionId)
    }

    console.log({ MagicPixel: this })
  }

  // Context
  _getStorageContext(): MpDataProps | null {
    const mpStorageContext = localStorage.getItem('mp')
    if (!mpStorageContext) {
      return null
    }
    return JSON.parse(mpStorageContext)
  }

  _setStorageContext(data: MpDataProps): void {
    localStorage.setItem('mp', JSON.stringify(data))
  }

  _removeStorageContext(): void {
    localStorage.removeItem('mp')
  }

  // Session
  _getStorageSessionId(): string | null {
    return sessionStorage.getItem('mp_sid')
  }

  _setStorageSessionId(sid: string): void {
    sessionStorage.setItem('mp_sid', sid)
  }

  _removeStorageSessionId(): void {
    sessionStorage.removeItem('mp_sid')
  }


  // Fingerprint
  async _fingerprint() {
    const fp = await fpPromise
    const result = await fp.get()
    // const fingerprintTimezone = result.components.timezone.value
    return result.visitorId
  }

  setIdentifiedUser(distinctUserId: string): void {
    this.context.distinctPersonId = distinctUserId
    this._setStorageContext(this.context)
  }

  // TODO: Define return type
  async apiRequest(method: string, endpoint: string, body: object): Promise<any | boolean> {

    // TODO: Add better verification and validation before api requests get sent
    try {
      if (!this.context?.accountSiteId) {
        console.warn('MP: Error: Missing ids, cannot track event')
        return false
      }

      let accountBody = {
        ...body,
        accountSiteId: this.context?.accountSiteId,
        fingerprint: this.fingerprint,
        visitorUUID: this.context?.visitorUUID,
        distinctPersonId: this.context?.distinctPersonId,
        sessionId: this.sessionId,
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
    if (!this.fingerprint) {
      this.fingerprint = await this._fingerprint()
    }
    if (this.context.accountSiteId) {
      try {
        const authBody = {
          accountSiteId: this.context.accountSiteId,
        }

        const response = await this.apiRequest('POST', `authentication`, authBody)

        const mpContext = {
          ...this.context,
          accountSiteId: this.context.accountSiteId,
          accountStatus: response.accountStatus,
          lastVerified: Date.now(),
        }

        if (mpContext.accountStatus === 'active') {
          this.context = mpContext
          this._setStorageContext(mpContext)
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

  async authenticateHostData(mpStorageContext: MpDataProps): Promise<boolean> {
    try {
      // If no mpData kill it
      if (!this.context) {
        return false
      }

      // If account site ids don't match, re-authenticate and update any stale data
      if (this.context.accountSiteId !== mpStorageContext.accountSiteId) {
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
          console.debug(`MP: Re-authenticating account id ${this.context.accountSiteId}`)
          return await this.authenticateAccountId()
        } else {
          if (!this.fingerprint) {
            this.fingerprint = await this._fingerprint()
          }
          this.context = {
            ...this.context,
            ...mpStorageContext,
          }
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
    const mpStorageContext = this._getStorageContext()

    if (!mpStorageContext) {
      console.debug(`MP: Invalid browser data. Authenticating account site id ${this.context.accountSiteId}`)
      // Call verification service to check account status and other data
      return await this.authenticateAccountId()
    } else {
      console.debug(`MP: Authenticating host storage data for account site id ${this.context.accountSiteId}`)
      return await this.authenticateHostData(mpStorageContext)
    }
  }
}
