import { getDiffFromTimestamp, isChildLink, isSamePage, parseLocation, parseUrl, uuidv4 } from './utils'
import * as Dom from './dom'
import { getFormData } from './dom'
import { EventProps, MpUserProps, MPEventType, MPGenericEvent, ScribeEventType } from './types'

const defaultURLProps = {
  href: null,
  hash: null,
  host: null,
  hostname: null,
  pathname: null,
  protocol: null,
  query: {},
}

export default class EventTracker {
  apiDomain: string
  userContext: MpUserProps
  javascriptRedirect: boolean
  oldHash: string | null
  queue: MPEventType[]
  handlers: Function[]

  constructor(accountSiteId: string | null) {
    this.apiDomain = 'http://localhost:5000/dev'
    this.userContext = {
      accountSiteId: accountSiteId,
      accountStatus: 'inactive',
      fingerprint: null,
      sessionId: null,
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
    console.debug('MP: Initializing Event Tracker')

    const storageUserContext = this.getStorageContext()
    this.userContext = {
      ...this.userContext,
      ...storageUserContext
    }

    console.log({ EventTracker: this })
  }

  initTracking() {
    // Init Trackers
    // this.initTrackers()

    // // Load Queue from storage
    // this.loadQueue()
    //
    // // Track pending events in the events Queue
    // if (this.queue.length > 0) {
    //   this.trackQueueEvents(this.queue)
    // }
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

  // Session
  getStorageSessionId(): string | null {
    return sessionStorage.getItem('mp_sid')
  }

  getStorageQueue(): MPEventType[] {
    const mpEventsQueue = localStorage.getItem('mp_events_queue')
    return mpEventsQueue ? JSON.parse(mpEventsQueue) : []
  }

  loadQueue(): void {
    this.queue = this.getStorageQueue()
  }

  addToQueue(event: MPEventType): void {
    this.queue = [...this.queue, event]
  }

  saveQueue(): void {
    localStorage.setItem('mp_events_queue', JSON.stringify(this.queue))
  }

  clearQueue(): void {
    this.queue = []
  }

  isAccountActive() {
    return this.userContext.accountStatus === 'active'
  }

  async apiRequest(method: string, endpoint: string, body: object) {
    try {
      if (!this.userContext?.accountSiteId) {
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

  // TRACKERS
  initTrackers(): void {
    this.trackClicks()
    this.trackLinkClicks()
    this.trackFormSubmits()
  }

  // Track all clicks to the document
  trackClicks(): void {
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
  trackLinkClicks(): void {
    Dom.monitorElements('a', (el: HTMLLinkElement) =>
      Dom.onEvent(el, 'click', true, async (e: MouseEvent) => {
        //return if this click it created with createEvent and not by a real click
        if (!e.isTrusted) {
          return
        }

        const target = e.target

        // TODO: Make sure the link is actually to a pageIdentification.
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
          console.log('User is jumping around the same pageIdentification')
          // User is jumping around the same pageIdentification. Track here in case the
          // client prevents the default action and the hash doesn't change
          // (otherwise it would be tracked by onhashchange):
          this.oldHash = null

          // trackJump(document.location.hash);
        } else if (parsedUrl.hostname === document.location.hostname) {
          // We are linking to a pageIdentification on the same site. There's no need to send
          // the event now, we can safely send it later:
          console.log('We are linking to a pageIdentification on the same site.')
          await this.trackLater('click', value)
        } else {
          e.preventDefault()
          console.log('We are linking to a pageIdentification that is not on this site.')
          // We are linking to a pageIdentification that is not on this site. So we first
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
  trackFormSubmits(): void {
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

  createEvent(eventType: string, properties: EventProps): MPEventType {
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
   * @function: track
   * @param {String} [eventName] A string that identifies an event. Ex. "Sign Up"
   * @param {Object} [properties] A set of properties to include with the event you're sending.
   * @param {Function} [callback] A string that identifies an event. Ex. "Sign Up"
   * These describe the details about the visitor and/or event.
   * @description: track a visitor and/or event details
   */
  async track(eventName: string, properties: object, callback?: Function): Promise<boolean> {
    console.log('Tracking Event: ', { eventName, properties })
    try {
      const eventProps = {
        ...this.userContext,
        ...properties,
      }
      const mpEvent = this.createEvent(eventName, eventProps)

      console.log('Customer Tracking Event: ', { mpEvent })
      await this.apiRequest('POST', `${this.apiDomain}/event/collection`, mpEvent)
      return true
    } catch (e) {
      console.error('MP: Error trying to track event.')
      return false
    }
  }

  /**
   * @function: trackScribeEvent
   * @param {ScribeEventType} [scribeEvent] A scribe-analytics event object
   * @description: internal method to track a visitor and/or event details via scribe-analytics
   */

  async trackScribeEvent(scribeEvent: ScribeEventType): Promise<boolean> {
    try {
      const event = scribeEvent.value

      let accountEvent = {
        ...event,
        type: event.event,
        ...this.userContext,
      }

      console.log({ scribeAccountEvent: accountEvent })
      const response = await this.apiRequest('POST', `${this.apiDomain}/event/collection`, accountEvent)
      if (response.status === '403') {
        console.warn('MP: Unauthorized')
        // TODO: Invalidate local storage data
        return false
      }
      return true
    } catch (e) {
      console.error('MP: Error sending scribe-analytics event to MP server.')
      // TODO: Retry or invalidate local storage data
      return false
    }
  }

  /**
   * @function: trackLater
   * @param {String} eventName A string that identifies an event. Ex. "Sign Up"
   * @param {Object | null} properties A key/pair object of custom event properties
   * @description: track a visitor and/or event details at a later time
   */
  async trackLater(eventName: string, properties: object | null): Promise<boolean> {
    try {
      const eventProps = {
        ...this.userContext,
        ...properties,
      }
      const mpEvent = this.createEvent(eventName, eventProps)
      this.addToQueue(mpEvent)
      this.saveQueue()
      return true
    } catch (e) {
      console.error('MP: Error trying to track event.')
      return false
    }
  }

  /**
   * @function: trackQueueEvents
   * @param {MPEventType[]} [events] A string that identifies an event. Ex. "Sign Up"
   * @description: track a visitor and/or event details
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
              // it's a page reload:
              event.eventType = 'reload'
            }
          } catch (e) {
            console.error(e)
          }
        }
        console.log({ eventType, event })
        // const response = await this.apiRequest('POST', `${this.apiDomain}/event/collection`, event)
      })
      // this.clearQueue()
      // this.saveQueue()
      return true
    } catch (e) {
      console.error('MP: Error trying to track event.')
      return false
    }
  }

  /**
   * @function: identify
   * @param {String} [distinctUserId] A string that uniquely identifies a visitor.
   * @description: Identify a visitor with a unique ID to track their events and create a person.
   * By default, unique visitors are tracked using a UUID generated the first time they visit the site.
   * Should be called when you know the identity of the current visitor (i.e. login or signup).
   */
  async identify(distinctUserId: string): Promise<boolean> {
    try {
      // const body = {
      //   accountSiteId: this.userContext?.accountSiteId,
      //   distinctUserId: distinctUserId,
      //   userId: this.userContext?.userId,
      // }
      // await this.apiRequest('POST', `${this.apiDomain}/identify`, body)
      this.userContext.distinctPersonId = distinctUserId
      this.setStorageContext(this.userContext)
      return true
    } catch (e) {
      console.error('MP: Error trying to identify user.')
      return false
    }
  }

  /**
   * @function: authenticateAccountId
   * @description: Will call api to verify the account status based on the host id provided in script.
   * Will update the MP class object data and local/session storage on successful response.
   */
  async authenticateAccountId(): Promise<boolean> {
    if (this.userContext.accountSiteId) {
      try {
        const authBody = {
          accountSiteId: this.userContext.accountSiteId,
        }

        const response = await this.apiRequest('POST', `${this.apiDomain}/authentication`, authBody)

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
          this.userContext = {
            ...this.userContext,
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
    const mpStorageContext = this.getStorageContext()
    console.log({ mpStorageContext })

    if (mpStorageContext) {
      console.debug(`MP: Authenticating host storage data for account site id ${this.userContext.accountSiteId}`)
      return await this.authenticateHostData(mpStorageContext)
    } else {
      // console.debug(`MP: Authenticating host storage data for account site id ${this.userContext.accountSiteId}`)
      // return await this.authenticateHostData(mpStorageContext)
      return false
    }
  }
}
