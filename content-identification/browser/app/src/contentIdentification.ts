import { ParsedURLProps, parseLocation } from './utils'
import { MpUserProps } from './types'

const API_DOMAIN = process.env.API_DOMAIN || 'http://localhost:5000/dev'

export default class ContentIdentification {
  apiDomain: string
  url: ParsedURLProps | null
  userContext: MpUserProps

  constructor(accountSiteId: string) {
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
    this.url = null

  }

  async init() {
    console.debug('MP: Initializing Content Identification')

    // Check the url
    this.url = parseLocation(document.location)
    this.addVideoEventListeners()
    this.addScrollDepthListeners()
    this.addFormEventListeners()

    console.log({ ContentIdentification: this })
  }

  isAccountActive() {
    return this.userContext.accountStatus === 'active'
  }

  identifyContent() {
    return true
  }

// TODO: Define return type
  async apiRequest(method: string, endpoint: string, body: object = {}): Promise<any | boolean> {

    // TODO: Add better verification and validation before api requests get sent
    try {
      if (!this.userContext.accountSiteId) {
        console.warn('MP: Error: Missing ids, cannot track content')
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

  async trackIdentifiedContent(): Promise<boolean> {
    try {
      console.log(`Track Identified Content Request Body:`, { pageType: {} })
      await this.apiRequest('POST', 'identification/content', {})
      return true
    } catch(e) {
      console.error(`Error tracking page: ${e}`)
      return false
    }
  }

  addScrollDepthListeners(): void {
    window.addEventListener("scroll", (event) => {
      // console.log({ scrollEvent: event })
    })

    window.onscroll = function(){
      const top =	document.documentElement.scrollTop;
      // console.log({ top })
    };
  }

  addVideoEventListeners(): void {
    // Search for video elements
    const videos = document.querySelectorAll('video')

    // // Search for external video libraries
    // const videoJsVideos = document.querySelectorAll('video-js')

    const allVideoElements = [...Array.from(videos)]
    allVideoElements.map(videoElement => {
      console.log({ videoElement })
      videoElement.onplay = (event) => {
        console.log({ onPlayEvent: event });
      }
      videoElement.onpause = (event) => {
        console.log({ onPauseEvent: event });
      }

    })
  }

  addFormEventListeners(): void {
    const forms = document.querySelectorAll('form')
    const allFormElements = [...Array.from(forms)]
    allFormElements.map(formElement => {
      console.log({ formElement })
      formElement.oninput = (event) => {
        console.log({ onInputEvent: event })
      }
      formElement.onsubmit = (event) => {
        console.log({ onSubmitEvent: event })
        debugger
      }

    })
  }
}
