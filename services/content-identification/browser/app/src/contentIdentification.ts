import { getAncestors } from './dom'
import { ParsedURLProps, parseLocation } from './utils'


export default class ContentIdentification {
  url: ParsedURLProps | null

  constructor() {
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


  async trackIdentifiedContent(): Promise<boolean> {
    try {
      const MP = window.MP
      if (!MP) {
        console.error('MP: No MP instance exists.')
        return false
      }
      console.log(`Track Identified Content Request Body:`, { pageType: {} })
      await MP.apiRequest('POST', 'identification/content', {})
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
