import {getDiffFromTimestamp, uuidv4} from "./utils";

interface MpDataProps {
  accountHid: string
  accountStatus: string
  lastVerified: number,
  attempts: number
}

export interface MagicPixelType {
  hostId: string | null
  apiDomain: string
  mpData: MpDataProps | null
  sessionData: string | null
  authenticateHostData: (mpData: MpDataProps) => Promise<boolean>
  authenticateHostId: () => Promise<boolean>
  clearStorage: () => void
  getLocalStorageData: () => MpDataProps | null
  getSessionStorageData: () => string | null
  setLocalStorageData: (data: MpDataProps) => void
  setSessionStorageData: (sid: string) => void
  trackEvent: (scribeEvent: any) => void
}


interface ScribeEventType {
  path: string,
  value: JSON,
  op: string,
  success: () => void,
  failure: () => void
}


export default class MagicPixel {
  hostId: string | null
  apiDomain: string
  mpData: MpDataProps | null
  sessionData: string | null


  constructor(hostId: string | null) {
    this.hostId = hostId
    this.apiDomain = 'http://localhost:5000/dev'
    this.mpData = null
    this.sessionData = null
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
    this.mpData = null
    localStorage.removeItem('mp')
  }

  _removeSessionMpData(): void {
    this.sessionData = null
    sessionStorage.removeItem('mp_sid')
  }

  _setMpData(data: MpDataProps | null): boolean {
    this.mpData = data
    return this.mpData === data
  }

  _setSessionMpData(data: string | null): boolean {
    this.sessionData = data
    return this.sessionData === data
  }

  getLocalStorageData() {
    const mpLocalStorageData = localStorage.getItem('mp')
    if (mpLocalStorageData) {
      return JSON.parse(mpLocalStorageData)
    }
   return mpLocalStorageData
  }

  getSessionStorageData() {
    return sessionStorage.getItem('mp_sid')
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
    // TODO: Check account status before making the call
    try {
      const eventValue = scribeEvent.value
      const accountEvent = {
        ...eventValue,
        accountHid: this.hostId
      }

      const body = JSON.stringify(accountEvent)
      const response = await this._apiRequest('POST', `${this.apiDomain}/dev/send-event`, body)
      if (response.status === '403') {
        console.warn("MP: Unauthorized")
        // TODO: Invalidate local storage data
        return false
      }
      return true
    } catch (e) {
      console.error('MP: Error sending scribe event to MP server.')
      // TODO: Retry or invalidate local storage data
      return false
    }
  }

  /**
   * @function: authenticateHostId
   * @description: The authenticateHostId function will make an api call to verify the account
   * status based on the host id provided in script. With response data,
   * the function will update the MP class object data and local/session storage
   */
  async authenticateHostId(): Promise<boolean> {
    if (this.hostId) {
      try {
        const jsonBody = JSON.stringify({
          hid: this.hostId
        })
        const accountData = await this._apiRequest(
          'POST',
          `${this.apiDomain}/authentication`, jsonBody
        )

        const localStorageData = {
          accountHid: this.hostId,
          accountStatus: accountData.status,
          lastVerified: Date.now(),
          attempts: this.mpData?.attempts ? this.mpData?.attempts + 1 : 1
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
    if (this.mpData.accountHid !== this.hostId) {
      return await this.authenticateHostId()
    }

    const { lastVerified, accountStatus } = this.mpData
    const now = new Date().getTime()
    const lastVerifiedHours = getDiffFromTimestamp(now, lastVerified, 'hours')

    // If account is inactive, kill it for 24 hours before trying to re-authenticate again
    // TODO: Add logic for delinquent once Stripe implemented
    if (accountStatus === 'inactive' || accountStatus === 'delinquent') {
      if (lastVerifiedHours < 24) {
        return false
      } else {
        return await this.authenticateHostId()
      }
    }

    // TODO: DO we want to add a way to prevent and future calls for an account?

    // If account is active but hasn't been verified for over an hour, re-authenticate again
    if (accountStatus === 'active') {
      if (lastVerifiedHours >= 1) {
        console.debug(`MP: Re-authenticating host id ${this.hostId}`)
        return await this.authenticateHostId()
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
      console.debug(`MP: Invalid browser data. Authenticating host id ${this.hostId}`)
      // Call verification service to check account status and other data
      return await this.authenticateHostId()
    } else {
      console.debug(`MP: Authenticating host storage data for host id ${this.hostId}`)
      return await this.authenticateHostData()
    }
  }
}
