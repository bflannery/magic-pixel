import {getDiffFromTimestamp, uuidv4} from "./utils"
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import {getAncestors, getNodeDescriptor} from "./dom";
import Events from "./events";


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
  track: (eventType: string, properties: object | null) => Promise<boolean>
  authenticateHostData: (mpData: MpDataProps) => Promise<boolean>
  authenticateAccountId: () => Promise<boolean>
  clearStorage: () => void
  getLocalStorageData: () => MpDataProps | null
  getSessionStorageData: () => string | null
  setLocalStorageData: (data: MpDataProps) => void
  setSessionStorageData: (sid: string) => void
  trackScribeEvent: (scribeEvent: any) => void
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


    const events = new Events()

    console.log({ events })

    // Track Clicks
    events.onReady(() => {
      console.log('Events ready.')
      // Track all clicks to the document:
      events.onEvent(document.body, 'click', true, (e: Event) => {
        console.log('On Event.')
        const ancestors = getAncestors(e.target)

        // Do not track clicks on links, these are tracked separately!
        let isChildLink = false
        for (let i = 0; i < ancestors.length; i++) {
          const element = ancestors[i]
          if (element.tagName == 'A') {
            isChildLink = true
          }
        }

        if (!isChildLink) {
          this.track('click', {
            target: getNodeDescriptor(e.target)
          })
        }
      })
    })
  }

  async _apiRequest(method: string, endpoint: string, body: object) {
    try {
      if (!this.context?.accountId || !this.context?.accountSiteId) {
        console.warn("MP: Error: Missing ids, cannot track event")
        return false
      }

      // if (this.context?.accountStatus !== 'active') {
      //   console.warn("MP: Error: Account is not active, cannot track event")
      //   return false
      // }

      const jsonBody = JSON.stringify(body)
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonBody
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

  _removeSessionMpData(): void {
    this.sessionId = null
    sessionStorage.removeItem('mp_sid')
  }

  _setMpData(data: MpDataProps): boolean {
    this.context = data
    return this.context === data
  }

  _setSessionMpData(data: string | null): boolean {
    this.sessionId = data
    return this.sessionId === data
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
   * @function: identify
   * @param {String} [distinctUserId] A string that uniquely identifies a visitor.
   * @description: Identify a visitor with a unique ID to track their events and create a person.
   * By default, unique visitors are tracked using a UUID generated the first time they visit the site.
   * Should be called when you know the identity of the current visitor (i.e login or signup).
   */
  async identify(distinctUserId: string): Promise<boolean> {
    try {
      const body = {
        accountId: this.context.accountId,
        distinctUserId,
        visitorId: this.context.visitorId,
      }
      await this._apiRequest('POST', `${this.apiDomain}/identify`, body)
      this.context.distinctUserId = distinctUserId
      this.setLocalStorageData(this.context)
      return true
    } catch (e) {
      console.error('MP: Error trying to identify user.')
      return false
    }
  }

  /**
   * @function: track
   * @param {String} [eventName] A string that identifies an event. Ex. "Sign Up"
   * @param {Object} [properties] A set of properties to include with the event you're sending.
   * These describe the details about the visitor and/or event.
   * @description: track an visitor and/or event details
   */
  async track(eventName: string, properties: object | null): Promise<boolean> {
    console.log('Tracking Event: ', { eventName, properties })
    try {
      const customEvent = {
        accountId: this.context?.accountId,
        accountSiteId: this.context?.accountSiteId,
        fingerprint: this.fingerprint,
        visitorId: this.context?.visitorId,
        sessionId: this.sessionId,
        type: eventName,
        properties,
        timestamp: new Date().toISOString()
      }
      console.log('Customer Tracking Event: ', { customEvent })
      // const response = await this._apiRequest('POST', `${this.apiDomain}/collection`, customEvent)
      return true
    } catch (e) {
      console.error('MP: Error trying to track event.')
      return false
    }
  }

  /**
   * @function: trackEvent
   * @param {String} [eventName] A string that identifies an event. Ex. "Sign Up"
   * @param {Object} [properties] A set of properties to include with the event you're sending.
   * These describe the details about the visitor and/or event.
   * @description: track an visitor and/or event details
   */
  async trackEvent(eventName: string, properties: object | null): Promise<boolean> {
    try {
      const eventProps = {
        accountId: this.context?.accountId,
        accountSiteId: this.context?.accountSiteId,
        fingerprint: this.fingerprint,
        visitorId: this.context?.visitorId,
        sessionId: this.sessionId,
        type: eventName,
        properties,
        timestamp: new Date().toISOString()
      }
      // const response = await this._apiRequest('POST', `${this.apiDomain}/collection`, eventProps)
      return true
    } catch (e) {
      console.error('MP: Error trying to track event.')
      return false
    }
  }


  /**
   * @function: trackScribeEvent
   * @param {Object} [scribeEvent] A scribe event object
   * @description: internal method to track an visitor and/or event details via scribe
   */

  async trackScribeEvent(scribeEvent: ScribeEventType): Promise<boolean> {
    try {
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
      const response = await this._apiRequest('POST', `${this.apiDomain}/collection`, accountEvent)
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
   * @description: Will call api to verify the account status based on the host id provided in script.
   * Will update the MP class object data and local/session storage on successful response.
   */
  async authenticateAccountId(): Promise<boolean> {
    console.log({ mpData: this.context})

    if (!this.fingerprint) {
      this.fingerprint = await this._fingerprint()
    }
    if (this.context.accountId && this.context.accountSiteId) {
      try {
        const authBody = {
          accountId: this.context.accountId,
          accountSiteId: this.context.accountSiteId,
        }

        const response = await this._apiRequest(
          'POST',
          `${this.apiDomain}/authentication`, authBody
        )

        const storageContext = {
          ...this.context,
          accountId: this.context.accountId,
          accountSiteId: this.context.accountSiteId,
          accountStatus: response.accountStatus,
          lastVerified: Date.now(),
        }

        const sessionId = JSON.stringify(uuidv4())
        this.setLocalStorageData(storageContext)
        this.setSessionStorageData(sessionId)
        this.sessionId = sessionId

        return storageContext.accountStatus === 'active'
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
