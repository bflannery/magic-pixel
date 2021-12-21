import {getDiffFromTimestamp, uuidv4} from "./utils";
import FingerprintJS from '@fingerprintjs/fingerprintjs'


interface ScribeFormType {
  formId: string
  formFields: Record<string, string>
}

interface MpDataProps {
  accountId: string | null
  accountSiteId: string | null
  personId: string | null
  accountStatus: string
  lastVerified: number | null,
  fingerprint: string | null,
  sessionId: string | null,
}

export interface MagicPixelType {
  apiDomain: string
  mpData: MpDataProps
  authenticateHostData: (mpData: MpDataProps) => Promise<boolean>
  authenticateAccountId: () => Promise<boolean>
  clearStorage: () => void
  getLocalStorageData: () => MpDataProps | null
  getSessionStorageData: () => string | null
  setLocalStorageData: (data: MpDataProps) => void
  setSessionStorageData: (sid: string) => void
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
  sessionId: null,
  accountId: null,
  accountSiteId: null,
  accountStatus: 'inactive',
  personId: null,
  fingerprint: null,
  lastVerified: null
}

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load()


export default class MagicPixel {
  apiDomain: string
  mpData: MpDataProps


  constructor(accountId: string | null, accountSiteId: string | null) {
    this.apiDomain = 'http://localhost:5000/dev'
    this.mpData = {
      accountId: accountId,
      accountSiteId: accountSiteId,
      accountStatus: 'inactive',
      personId: null,
      fingerprint: null,
      lastVerified: null,
      sessionId: null
    }
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
    this.mpData = defaultMpData
    localStorage.removeItem('mp')
  }

  _removeSessionMpData(): void {
    this.mpData.sessionId = null
    sessionStorage.removeItem('mp_sid')
  }

  _setMpData(data: MpDataProps): boolean {
    this.mpData = data
    return this.mpData === data
  }

  _setSessionMpData(data: string | null): boolean {
    this.mpData.sessionId = data
    return this.mpData.sessionId === data
  }

  async _fingerprint() {
    const fp = await fpPromise
    const result = await fp.get()
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

  getSessionStorageData() {
    const sid = sessionStorage.getItem('mp_sid')
    if (sid) {
      const parsedSessionData = JSON.parse(sid)
      this._setSessionMpData(parsedSessionData)
      return parsedSessionData
    }
    return sid
  }

  setLocalStorageData(data: MpDataProps): void {
    this._setMpData(data)
    localStorage.setItem('mp', JSON.stringify(data))
  }

  setSessionStorageData(sid: string): void {
    this._setSessionMpData(sid)
    sessionStorage.setItem('mp_sid', sid)
  }

  clearStorage(): void {
    this._removeMpData()
    this._removeSessionMpData()
  }

  /**
   * @function: trackEvent
   * @description: The trackEvent function will make an api call to send a scribe event
   * to an event queue if MP object is in a valid state
   */
  async trackEvent(scribeEvent: ScribeEventType): Promise<boolean> {
    try {
      if (!this.mpData?.accountId || !this.mpData?.accountSiteId) {
        console.warn("MP: Error: Missing ids, cannot track event")
        return false
      }

      if (this.mpData?.accountStatus !== 'active') {
        console.warn("MP: Error: Account is not active, cannot track event")
        return false
      }

      const event = scribeEvent.value

      let accountEvent = {
        ...event,
        accountId: this.mpData?.accountId,
        accountSiteId: this.mpData?.accountSiteId,
        personId: this.mpData?.personId,
        fingerprint: this.mpData?.fingerprint
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
    console.log({ mpData: this.mpData})
    if (!this.mpData.fingerprint) {
      this.mpData.fingerprint = await this._fingerprint()
    }
    if (this.mpData.accountId && this.mpData.accountSiteId) {
      try {
        const jsonBody = JSON.stringify({
          accountId: this.mpData.accountId,
          accountSiteId: this.mpData.accountSiteId,
          personId: this.mpData.personId,
          fingerprint: this.mpData.fingerprint
        })

        const accountData = await this._apiRequest(
          'POST',
          `${this.apiDomain}/authentication`, jsonBody
        )

        const localStorageData = {
          ...this.mpData,
          accountId: this.mpData.accountId,
          accountSiteId: this.mpData.accountSiteId,
          personId: accountData.personId,
          accountStatus: accountData.accountStatus,
          lastVerified: Date.now(),
        }

          const sessionId = JSON.stringify(uuidv4())
          this.setLocalStorageData(localStorageData)
          this.setSessionStorageData(sessionId)

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
    if (!this.mpData) {
      return false
    }

    // If account ids don't match, re-authenticate and update any stale data
    if (this.mpData.accountId !== this.mpData.accountId) {
      return await this.authenticateAccountId()
    }

    const { lastVerified, accountStatus } = this.mpData
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
        console.debug(`MP: Re-authenticating account id ${this.mpData.accountId}`)
        return await this.authenticateAccountId()
      } else {
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
    const mpSessionID = this.getSessionStorageData()
    if (!mpLocalStorageData || !mpSessionID) {
      console.debug(`MP: Invalid browser data. Authenticating account id ${this.mpData.accountId}`)
      // Call verification service to check account status and other data
      return await this.authenticateAccountId()
    } else {
      console.debug(`MP: Authenticating host storage data for account id ${this.mpData.accountId}`)
      return await this.authenticateHostData()
    }
  }
}
