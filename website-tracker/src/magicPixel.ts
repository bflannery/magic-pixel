import { getDiffFromTimestamp, isChildLink, isSamePage, parseLocation, parseUrl, uuidv4 } from './utils'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import * as Dom from './dom'
import { getFormData } from './dom'
import PageIdentification from './pageIdentification'
import { EventProps, MpDataProps, MPEventType, MPGenericEvent, ScribeEventType } from './types'

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
  javascriptRedirect: boolean
  oldHash: string | null
  queue: MPEventType[]
  handlers: Function[]

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
    this.javascriptRedirect = true
    this.oldHash = document.location.hash
    this.queue = []
    this.handlers = []
  }

  async init(): Promise<void> {
    console.debug('MP: Initializing Magic Pixel')
    console.log({ MP: this })

    const mpContext = this._getStorageContext()
    const sessionId = this._getStorageSessionId()
    this.context.visitorUUID = mpContext?.visitorUUID || uuidv4()
    this.context.lastVerified = mpContext?.lastVerified || null
    this.sessionId = sessionId || uuidv4()

    // Save context and session to browser storage
    this._setStorageContext(this.context)
    this._setStorageSessionId(this.sessionId)

    // Init Trackers
    // this._initTrackers()

    // // Load Queue from storage
    // this._loadQueue()
    //
    // // Track pending events in the events Queue
    // if (this.queue.length > 0) {
    //   this.trackQueueEvents(this.queue)
    // }
  }

  async init_page_identification(): Promise<void> {
    console.debug('MP: Initializing Magic Pixel Page Identification')
    console.log({ MP: this })

    const pageIdentification = new PageIdentification()
    window.MP_PAGE_ID = pageIdentification
    pageIdentification.init()
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

  _getStorageQueue(): MPEventType[] {
    const mpEventsQueue = localStorage.getItem('mp_events_queue')
    return mpEventsQueue ? JSON.parse(mpEventsQueue) : []
  }

  _loadQueue(): void {
    this.queue = this._getStorageQueue()
  }

  _addToQueue(event: MPEventType): void {
    this.queue = [...this.queue, event]
  }

  _saveQueue(): void {
    localStorage.setItem('mp_events_queue', JSON.stringify(this.queue))
  }

  _clearQueue(): void {
    this.queue = []
  }

  _dispatch(): void {
    const args = Array.prototype.slice.call(arguments, 0)

    console.log({ dispatchArgs: args, handlers: this.handlers })
    for (let i = 0; i < this.handlers.length; i++) {
      try {
        this.handlers[i].apply(null, args)
      } catch (e) {
        console.error(e)
      }
    }
    console.log({ handlers: this.handlers })
  }

  async _apiRequest(method: string, endpoint: string, body: object) {
    try {
      if (!this.context?.accountSiteId) {
        console.warn('MP: Error: Missing ids, cannot track event')
        return false
      }

      const jsonBody = JSON.stringify(body)
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonBody,
      })
      return response.json()
    } catch (e) {
      console.error(e)
      return e
    }
  }

  // Fingerprint
  async _fingerprint() {
    const fp = await fpPromise
    const result = await fp.get()
    // const fingerprintTimezone = result.components.timezone.value
    return result.visitorId
  }

  _initTrackers(): void {
    this._trackClicks()
    this._trackLinkClicks()
    this._trackFormSubmits()
  }

  // Track all clicks to the document
  _trackClicks(): void {
    Dom.onReady(() =>
      Dom.onEvent(document.body, 'click', true, async (e: Event) => {
        const ancestors = Dom.getAncestors(e.target)
        if (!isChildLink(ancestors)) {
          await this.track('click', {
            target: Dom.getNodeDescriptor(e.target),
          })
        }
      }),
    )
  }

  // Track all link clicks on the document
  _trackLinkClicks(): void {
    Dom.monitorElements('a', (el: HTMLLinkElement) =>
      Dom.onEvent(el, 'click', true, async (e: MouseEvent) => {
        //return if this click it created with createEvent and not by a real click
        if (!e.isTrusted) {
          return
        }

        const target = e.target

        // TODO: Make sure the link is actually to a page.
        // It's a click, not a Javascript redirect:
        this.javascriptRedirect = false

        setTimeout(() => {
          this.javascriptRedirect = true
        }, 500)

        const parsedUrl = parseUrl(el.href)
        const value = {
          target: {
            url: parsedUrl,
            ...Dom.getNodeDescriptor(target),
          },
        }

        if (isSamePage(parsedUrl.href, document.location.href)) {
          console.log('User is jumping around the same page')
          // User is jumping around the same page. Track here in case the
          // client prevents the default action and the hash doesn't change
          // (otherwise it would be tracked by onhashchange):
          this.oldHash = null

          // trackJump(document.location.hash);
        } else if (parsedUrl.hostname === document.location.hostname) {
          // We are linking to a page on the same site. There's no need to send
          // the event now, we can safely send it later:
          console.log('We are linking to a page on the same site.')
          await this.trackLater('click', value)
        } else {
          e.preventDefault()
          console.log('We are linking to a page that is not on this site.')
          // We are linking to a page that is not on this site. So we first
          // wait to send the event before simulating a different click
          // on the link. This ensures we don't lose the event if the user
          // does not return to this site ever again.
          await this.track('click', value, () => {
            // It's a click, not a Javascript redirect:
            this.javascriptRedirect = false

            if (target) {
              // Simulate a click to the original element if we were waiting on the tracker:
              Dom.simulateMouseEvent(target, 'click')
            }
          })
        }
      }),
    )
  }

  // Track all form submissions
  _trackFormSubmits(): void {
    Dom.onSubmit(async (e: MPGenericEvent) => {
      if (e.form) {
        if (!e.form.id) {
          e.form.id = uuidv4()
        }

        await this.trackLater('form_submit', {
          form: {
            ...getFormData(e.form),
            formId: e.form.id,
          },
        })
      }
    })
  }

  _createEvent(eventType: string, properties: EventProps): MPEventType {
    console.log({ eventType, properties })
    return {
      eventType,
      timestamp: new Date().toISOString(),
      source: {
        url: parseLocation(document.location),
      },
      target: {
        url: defaultURLProps,
      },
      ...properties,
    }
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
      // const body = {
      //   accountSiteId: this.context?.accountSiteId,
      //   distinctUserId: distinctUserId,
      //   userId: this.context?.userId,
      // }
      // await this._apiRequest('POST', `${this.apiDomain}/identify`, body)
      this.context.distinctPersonId = distinctUserId
      this._setStorageContext(this.context)
      return true
    } catch (e) {
      console.error('MP: Error trying to identify user.')
      return false
    }
  }

  /**
   * @function: track
   * @param {String} [eventName] A string that identifies an event. Ex. "Sign Up"
   * @param {Function} [callback] A string that identifies an event. Ex. "Sign Up"
   * @param {Object} [properties] A set of properties to include with the event you're sending.
   * These describe the details about the visitor and/or event.
   * @description: track an visitor and/or event details
   */
  async track(eventName: string, properties: object, callback?: Function): Promise<boolean> {
    console.log('Tracking Event: ', { eventName, properties })
    try {
      const eventProps = {
        ...this.context,
        ...properties,
      }
      const mpEvent = this._createEvent(eventName, eventProps)

      console.log('Customer Tracking Event: ', { mpEvent })
      await this._apiRequest('POST', `${this.apiDomain}/collection`, mpEvent)
      return true
    } catch (e) {
      console.error('MP: Error trying to track event.')
      return false
    }
  }

  /**
   * @function: trackScribeEvent
   * @param {ScribeEventType} [scribeEvent] A scribe event object
   * @description: internal method to track an visitor and/or event details via scribe
   */

  async trackScribeEvent(scribeEvent: ScribeEventType): Promise<boolean> {
    try {
      const event = scribeEvent.value

      let accountEvent = {
        ...event,
        type: event.event,
        accountSiteId: this.context?.accountSiteId,
        fingerprint: this.fingerprint,
        visitorUUID: this.context?.visitorUUID,
        distinctPersonId: this.context?.distinctPersonId,
        sessionId: this.sessionId,
      }

      console.log({ scribeAccountEvent: accountEvent })
      const response = await this._apiRequest('POST', `${this.apiDomain}/collection`, accountEvent)
      if (response.status === '403') {
        console.warn('MP: Unauthorized')
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
   * @function: trackLater
   * @param {String} eventName A string that identifies an event. Ex. "Sign Up"
   * @param {Object | null} properties A key/pair object of custom event properties
   * @description: track an visitor and/or event details at a later time
   */
  async trackLater(eventName: string, properties: object | null): Promise<boolean> {
    try {
      const eventProps = {
        ...this.context,
        ...properties,
      }
      const mpEvent = this._createEvent(eventName, eventProps)
      this._addToQueue(mpEvent)
      this._saveQueue()
      return true
    } catch (e) {
      console.error('MP: Error trying to track event.')
      return false
    }
  }

  /**
   * @function: trackQueueEvents
   * @param {MPEventType[]} [events] A string that identifies an event. Ex. "Sign Up"
   * @description: track an visitor and/or event details
   */
  trackQueueEvents(events: MPEventType[]): boolean {
    console.log('Track Queue Event')
    try {
      events.forEach(async (event: MPEventType) => {
        console.log({ event })
        const eventType = event.eventType
        // Specially modify redirect, formSubmit events to save the new URL,
        // because the URL is not known at the time of the event:
        if (['redirect', 'formSubmit'].includes(eventType)) {
          event.target = {
            ...event.target,
            url: parseLocation(document.location),
          }
        }

        // If source and target urls are the same, change redirect events
        // to reload events:
        if (eventType === 'redirect') {
          try {
            // See if it's a redirect (= different url) or reload (= same url):
            const sourceUrl = event.source.url.href
            const targetUrl = event.target.url.href

            if (sourceUrl === targetUrl) {
              // It's a reload:
              event.eventType = 'reload'
            }
          } catch (e) {
            console.error(e)
          }
        }
        console.log({ eventType, event })
        // const response = await this._apiRequest('POST', `${this.apiDomain}/collection`, event)
      })
      // this._clearQueue()
      // this._saveQueue()
      return true
    } catch (e) {
      console.error('MP: Error trying to track event.')
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

        const response = await this._apiRequest('POST', `${this.apiDomain}/authentication`, authBody)

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
