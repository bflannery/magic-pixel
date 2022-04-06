import { isChildLink, isSamePage, parseLocation, parseUrl, uuidv4 } from './utils'
import * as Dom from './dom'
import { getFormData } from './dom'
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


export default class EventTracker {
  javascriptRedirect: boolean
  oldHash: string | null
  queue: MPEventType[]
  handlers: Function[]

  constructor() {
    this.javascriptRedirect = true
    this.oldHash = document.location.hash
    this.queue = []
    this.handlers = []
  }

  async init(): Promise<void> {
    console.debug('MP: Initializing Event Tracker')

    // Init Trackers
    // this._initTrackers()

    // // Load Queue from storage
    // this._loadQueue()
    //
    // // Track pending events in the events Queue
    // if (this.queue.length > 0) {
    //   this.trackQueueEvents(this.queue)
    // }

    console.log({ EventTracker: this })
  }

  // Context
  _getStorageContext(): MpDataProps | null {
    const mpStorageContext = localStorage.getItem('mp')
    if (!mpStorageContext) {
      return null
    }
    return JSON.parse(mpStorageContext)
  }

  // Session
  _getStorageSessionId(): string | null {
    return sessionStorage.getItem('mp_sid')
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

    console.log({dispatchArgs: args, handlers: this.handlers})
    for (let i = 0; i < this.handlers.length; i++) {
      try {
        this.handlers[i].apply(null, args)
      } catch (e) {
        console.error(e)
      }
    }
    console.log({handlers: this.handlers})
  }

  // TRACKERS
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

  // TODO: Define EventPropsType
  _createEvent(eventType: string, properties: EventProps): MPEventType {
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
   * @function: trackScribeEvent
   * @param {ScribeEventType} [scribeEvent] A scribe-analytics event object
   * @description: internal method to track an visitor and/or event details via scribe-analytics
   */

  async trackScribeEvent(scribeEvent: ScribeEventType): Promise<boolean> {
    console.log('Tracking Scribe: ', {scribeEvent })
    try {
      const event = {
        type: scribeEvent.value.event,
        ...scribeEvent.value
      }
      const MP = window.MP
      if (!MP) {
        console.error('MP: No MP instance exists.')
        return false
      }

      const response = await MP.apiRequest('POST', 'collection', event)
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
   * @function: track
   * @param {String} [eventName] A string that identifies an event. Ex. "Sign Up"
   * @param {Object} [properties] A set of properties to include with the event you're sending.
   * @param {Function} [callback] A string that identifies an event. Ex. "Sign Up"
   * These describe the details about the visitor and/or event.
   * @description: track an visitor and/or event details
   */
  async track(eventName: string, properties: any, callback?: Function): Promise<boolean> {
    console.log('Tracking Event: ', {eventName, properties})
    try {
      const MP = window.MP
      if (!MP) {
        console.error('MP: No MP instance exists.')
        return false
      }

      const mpEvent = this._createEvent(eventName, properties)

      console.log('Customer Tracking Event: ', { mpEvent })
      await MP.apiRequest('POST', 'collection', mpEvent)
      return true
    } catch (e) {
      console.error('MP: Error trying to track event.')
      return false
    }
  }

  /**
   * @function: trackLater
   * @param {String} eventName A string that identifies an event. Ex. "Sign Up"
   * @param {Object | null} properties A key/pair object of custom event properties
   * @description: track an visitor and/or event details at a later time
   */
  async trackLater(eventName: string, properties: any): Promise<boolean> {
    try {
      const mpEvent = this._createEvent(eventName, properties)
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
        console.log({event})
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
        console.log({eventType, event})
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
   * @function: identify
   * @param {String} [distinctUserId] A string that uniquely identifies a visitor.
   * @description: Identify a visitor with a unique ID to track their events and create a person.
   * By default, unique visitors are tracked using a UUID generated the first time they visit the site.
   * Should be called when you know the identity of the current visitor (i.e login or signup).
   */
  async identify(distinctUserId: string): Promise<boolean> {
    try {
      const MP = window.MP
      if (!MP) {
        console.error('MP: No MP instance exists.')
        return false
      }

      const body = {
        distinctUserId: distinctUserId,
      }

      await MP.apiRequest('POST', 'identify', body)
      await MP.setIdentifiedUser(distinctUserId)
      return true
    } catch (e) {
      console.error('MP: Error trying to identify user.')
      return false
    }
  }
}