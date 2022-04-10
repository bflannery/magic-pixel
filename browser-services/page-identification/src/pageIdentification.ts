import {
  DomAttributeType,
  DomButtonMapType,
  DomButtonType,
  DomElementType,
  DomFormElementType,
  DomFormMapType,
  DomLinkMapType,
  DomVideoMapType,
  PageIdPropsType, PageType, PaymentProcessorType,
} from './types'
import { getAncestors } from './dom'
import { MISC_PAGE_PROPS } from './constants'
import { ParsedURLProps, parseLocation } from './utils'

export default class PageIdentification {
  pageType: PageType | null
  pageIdProps: PageIdPropsType | null
  url: ParsedURLProps | null
  scripts: HTMLScriptElement[] | null
  elements: Element[] | null
  buttons: DomButtonMapType | null
  forms: DomFormMapType[] | null
  links: DomLinkMapType[] | null
  videos: DomVideoMapType[] | null

  constructor() {
    this.pageType = null
    this.pageIdProps = null
    this.url = null
    this.scripts = null
    this.elements = null
    this.buttons = null
    this.forms = null
    this.links = null
    this.videos = null
  }

  async init() {
    console.debug('MP: Initializing Page Identification')

    // Get page id props from S3
    await this.getPageIdPropsFromS3()
    // Check the url
    this.url = parseLocation(document.location)
    // Map the Dom
    this.mapDom()

    console.log({ PageIdentification: this })
  }

  /**
   * @function getKeywordsFromS3
   * @description Get json object of page identification keywords and identifiers
   */
  async getPageIdPropsFromS3() {
    try {
      const response = await fetch("https://magic-pixel-public.s3.amazonaws.com/pageidproperties.json")
      const s3JsonData = await response.json()
      this.pageIdProps = {
        ...MISC_PAGE_PROPS,
        ...s3JsonData
      }
    } catch(e) {
      console.error(`Error fetching mp keywords: ${e}`)
    }
  }

  /**
   * @function getAttributes
   * @description Create an array of the attributes on an element
   * @param  {NamedNodeMap} attributes The attributes on an element
   * @return {Array} The attributes on an element as an array of key/value pairs
   */
  getAttributes(attributes: NamedNodeMap): DomAttributeType[] {
    const allAttributes: DomAttributeType[] = []
    Array.prototype.map.call(attributes, function (attribute) {
      const newAttribute: DomAttributeType = {
        name: attribute.name,
        value: attribute.value,
      }
      allAttributes.push(newAttribute)
    })
    return allAttributes
  }

  /**
   * @function isTemplateElement
   * @description Check if form is part of the page template. We are looking for unique elements per page
   * @param  {HTMLFormElement} element The attributes on an element
   * @return {Boolean}
   */
  isTemplateElement(element: Element): boolean {
    const ancestors = getAncestors(element)
    let isTemplateForm = false
    ancestors.forEach((ancestor) => {
      ['sidebar', 'topbar', 'nav', 'header'].forEach((templateKeyword) => {
        if (ancestor.id.includes(templateKeyword)) {
          isTemplateForm = true
        }
        if (ancestor.className.includes(templateKeyword)) {
          isTemplateForm = true
        }
      })
    })
    return isTemplateForm
  }

  /**
   * @function createElementMap
   * @description Create an elements map of an HTMLElement
   * @param  {HTMLElement | Element} element the HTMLElement
   * @param  {Boolean} isSVG SVG are handled uniquely
   * @return {DomElementType[]} attributes about the HTMLFormElement
   */
  createElementMap(element: HTMLElement | Element, isSVG: boolean): DomElementType[] {
    let childNodes = []
    if (element.childNodes && element.childNodes.length > 0) {
      childNodes = Array.prototype.filter.call(
        element.childNodes,
        (node) =>
          (node.nodeType !== 8 && node.nodeType == 1 && node.localName !== 'br') ||
          (node.nodeType === 3 && node.textContent.trim() !== ''),
      )
    }
    return childNodes.map((node): DomElementType => {
      const id = node.id || null
      const className = node.className || null
      const attributes = node.nodeType !== 1 ? [] : this.getAttributes(node.attributes)
      const content = node.childNodes && node.childNodes.length > 0 ? null : node.textContent.trim()
      const type = node.nodeType === 3 ? 'text' : node.tagName.toLowerCase()
      const children = this.createElementMap(node, isSVG || node.type === 'svg')
      return {
        id,
        className,
        content,
        attributes,
        type,
        node,
        children,
        isSVG: isSVG || node.type === 'svg',
      }
    })
  }

  /**
   * @function createFormElementsMap
   * @description Create an elements map of a form HTMLFormElement
   * @param  {HTMLButtonElement} form the HTMLFormElement
   * @return {DomFormElementType[]} an array of form elements with attributes about the HTMLFormElement
   */
  createFormElementsMap(form: HTMLFormElement): DomFormElementType[] {
    let childNodes = []
    if (form.childNodes && form.childNodes.length > 0) {
      childNodes = Array.prototype.filter.call(
        form.childNodes,
        (node) =>
          (node.nodeType !== 8 && node.nodeType == 1 && node.localName !== 'br') ||
          (node.nodeType === 3 && node.textContent.trim() !== ''),
      )
    }
    return childNodes.map((node): DomFormElementType => {
      const id = node.id || null
      const className = node.className || null
      const attributes = node.nodeType !== 1 ? [] : this.getAttributes(node.attributes)
      const content = node.childNodes && node.childNodes.length > 0 ? null : node.textContent.trim()
      const type = node.nodeType === 3 ? 'text' : node.tagName.toLowerCase()
      const children = this.createFormElementsMap(node)
      return {
        id,
        className,
        content,
        attributes,
        type,
        node,
        children,
      }
    })
  }

  /**
   * @function createButtonElementMap
   * @description Create an attribute map of a HTMLButton element
   * @param  {HTMLButtonElement} button: HTMLButton element
   * @return {DomButtonType} attributes about the HTMLButton
   */
  createButtonElementMap(button: HTMLButtonElement): DomButtonType {
    return {
      id: button.id,
      className: button.className,
      content: button.textContent?.trim() || null,
      attributes: this.getAttributes(button.attributes),
      type: button.tagName.toLowerCase(),
      ancestors: getAncestors(button),
    }
  }

  /**
   * @function createLinkElementMap
   * @description Create an attribute map of a HTMLAnchorElement element
   * @param  {HTMLAnchorElement} link: HTMLAnchorElement element
   * @param  {number} index used for reference if id is not provided
   * @return {DomLinkMapType} attributes about the HTMLAnchorElement
   */
  createLinkElementMap(link: HTMLAnchorElement, index: number): DomLinkMapType {
    return {
      id: link.id || `link-id-${index}`,
      isTemplateElement: this.isTemplateElement(link),
      className: link.className,
      content: link.textContent?.trim() || null,
      attributes: this.getAttributes(link.attributes),
      type: link.tagName.toLowerCase(),
    }
  }

  /**
   * @function createDomLinkMap
   * @description Create a list of attribute maps for each HTMLAnchorElement element
   * @return {DomLinkMapType[]} an array of attributes about the HTMLAnchorElement
   */
  createDomLinkMap(): DomLinkMapType[] {
    const links = document.querySelectorAll('a')
    const linksMap: DomLinkMapType[] = []
    Array.from(links).map((link, i) => {
      const mappedLink = this.createLinkElementMap(link, i)
      linksMap.push(mappedLink)
    })
    return linksMap
  }

  /**
   * @function createDomFormMap
   * @description Create a list of attribute maps for each HTMLFormElement element
   * @return {DomLinkMapType[]} an array of attributes about the HTMLFormElement
   */
  createDomFormMap(): DomFormMapType[] {
    const forms = document.querySelectorAll('form')
    const formsMap: DomFormMapType[] = []
    Array.from(forms).map((form, i) => {
      const mappedForm = {
        id: form.id || `form-id-${i}`,
        isTemplateElement: this.isTemplateElement(form),
        elements: this.createFormElementsMap(form),
      }
      formsMap.push(mappedForm)
    })
    return formsMap
  }

  /**
   * @function createDomButtonMap
   * @description Create a list of attribute maps for each HTMLFormElement element
   * @return {DomLinkMapType[]} an array of attributes about the HTMLFormElement
   */
  createDomButtonMap(): DomButtonMapType {
    const buttons = document.querySelectorAll('button')
    const inputButtons = document.querySelectorAll('input[type="submit"]')
    const allButtons = Array.prototype.slice.call(buttons).concat(Array.prototype.slice.call(inputButtons))
    const buttonsMap: any = {}
    Array.from(allButtons).map((buttonNode, i) => {
      const buttonMap = this.createButtonElementMap(buttonNode)
      const buttonKey = buttonNode.id || `button-id-${i}`
      buttonsMap[buttonKey] = buttonMap
    })
    return buttonsMap
  }

  /**
   * @function createDomIFrameMap
   * @description
   * @return
   */
  createDomIFrameMap(): void {
    const iframes = document.querySelectorAll('iframe')
    console.log({ iframes })
  }

  /**
   * @function createDomVideoMap
   * @description Create a list of attribute maps for each HTMLVideoElement element
   * @return {DomVideoMapType[]} an array of attributes about the HTMLVideoElement
   */
  createDomVideoMap(): DomVideoMapType[] {
    // Search for video elements
    const videos = document.querySelectorAll('video')

    // Search for external video libraries
    const videoJsVideos = document.querySelectorAll('video-js')

    const allVideoElements = [...Array.from(videos), ...Array.from(videoJsVideos)]
    const videosMap: DomVideoMapType[] = []
    allVideoElements.map((video, i) => {
      const mappedForm = {
        id: video.id || `video-id-${i}`,
        elements: this.createElementMap(video, false),
      }
      videosMap.push(mappedForm)
    })
    return videosMap
  }

  /**
   * @function checkDomElementsForKeywords
   * @description Check url object to see if it contains a keyword in the keywords array.
   * @param {Element[]} elements: an array of element from the dom
   * @param {string[]} keywords: array of keywords to search from
   */
  checkDomElementsForKeywords(elements: Element[], keywords: string[]): string[] {
    const keywordMatches: string[] = []
    elements.map((element) => {
      return keywords.find((k) => {
        if (element.textContent) {
          const isMatch = element.textContent.toLowerCase().includes(k)
          if (isMatch) {
            keywordMatches.push(k)
          }
        }
      })
    })
    return !!keywordMatches.length ? keywordMatches : []
  }

  /**
   * @function checkUrlForKeywords
   * @description Check url object for keywords
   * @param {string} url: url string
   * @param {string[]} keywords: array of keywords to search from
   * @return {string[] | null}
   */
  checkUrlForKeywords(url: string, keywords: string[]): string[] {
    return keywords.filter(k => url.includes(k))
  }

  /**
   * @function checkForPaymentProcessorButton
   * @description Check dom for payment processor button elements
   */
  checkForPaymentProcessorButton(): void {
    const paymentProcessors = this.pageIdProps?.eCommerce.paymentProcessors
    if (paymentProcessors) {
      paymentProcessors.forEach((paymentProcessor: PaymentProcessorType) => {
        if (paymentProcessor.identifier.selector == 'id') {
          const idButton = document.getElementById(paymentProcessor.identifier.query)
          if (idButton && this.pageType) {
            this.pageType.paymentProcessor = paymentProcessor
          }
        } else if (paymentProcessor.identifier.selector == 'all') {
          const elementButton = document.querySelector(paymentProcessor.identifier.query)
          if (elementButton && this.pageType) {
            this.pageType.paymentProcessor = paymentProcessor
          }
        }
      })
    }
  }

  checkForPaymentProcessorScript(): void {
    // TODO: Check for scripts
  }

  checkForPaymentProcessor(): void {
    this.checkForPaymentProcessorButton()
    this.checkForPaymentProcessorScript()
  }

  /**
   * @function isEcommPage
   * @description Check if page is an ecomm page by checking the url and dom for
   * ECOMM_KEYWORDS. If so, set the ecomm page flag true
   */
  isEcommPage(): boolean {
    // Check for payment processor button
    // Determine if the JS objects, scripts or methods exist.
    // TODO: Get Clarity from Justin on this
    this.checkForPaymentProcessor()

    if (this.pageIdProps?.eCommerce.keywords && this.pageType) {
      const keywords =  this.pageIdProps.eCommerce.keywords
      // Does the URL contain ecommerce keywords?
      if (this.url?.pathname) {
        this.pageType.urlKeywords = this.checkUrlForKeywords(this.url?.pathname, keywords)
      }

      // Does the DOM contain ecommerce keywords?
      if (this.elements) {
        this.pageType.domKeywords = this.checkDomElementsForKeywords(this.elements, keywords)
      }
    }

    // Check if page is an ecomm page
    if (this.pageType && (this.pageType.paymentProcessor || this.pageType.urlKeywords.length > 0 || this.pageType.domKeywords.length > 0)) {
      this.pageType.type = 'ecomm'
      return true
    } else {
      this.pageType = null
      return false
    }
  }

  /**
   * @function isConfirmationPage
   * @description Check if page is a confirmation page by checking the url and dom
   * for CONFIRMATION_KEYWORDS. If so, will set the confirmation page flag true
   */
  isConfirmationPage(): boolean {
    if (this.pageIdProps?.confirmation.keywords && this.pageType) {
      const keywords =  this.pageIdProps.confirmation.keywords
      // Does the URL contain confirmation keywords?
      if (this.url?.pathname) {
        this.pageType.urlKeywords = this.checkUrlForKeywords(this.url?.pathname, keywords)
      }

      // Does the DOM contain confirmation keywords?
      if (this.elements) {
        this.pageType.domKeywords = this.checkDomElementsForKeywords(this.elements, keywords)
      }
    }

    // Check if page is a confirmation page
    if (this.pageType && (this.pageType.urlKeywords.length > 0 || this.pageType.domKeywords.length > 0)) {
      this.pageType.type = 'confirmation'
      return true
    } else {
      this.pageType = null
      return false
    }
  }

  /**
   * @function isLeadGenPage
   * @description Check if page is a lead gen page by for form email input. If so, will set the lead gen page flag true
   */
  isLeadGenPage() {
    // Check if page is a lead gen page
    const emailInput = document.querySelector('input[type="email"]')
    if (this.pageType && emailInput) {
      this.pageType.type = 'lead_gen'
      return true
    } else {
      this.pageType = null
      return false
    }
  }

  /**
   * @function isContactUsPage
   * @description Check if page is a contact page by checking the url and dom
   * for CONTACT_US_KEYWORDS. If so, will set the contact page flag true
   */
  isContactUsPage() {
    if (this.pageIdProps?.contactUs.keywords && this.pageType) {
      const keywords =  this.pageIdProps.contactUs.keywords
      // Does the URL contain contact us keywords?
      if (this.url?.pathname) {
        this.pageType.urlKeywords = this.checkUrlForKeywords(this.url?.pathname, keywords)
      }

      // Does the DOM contain contact us keywords?
      if (this.elements) {
        this.pageType.domKeywords = this.checkDomElementsForKeywords(this.elements, keywords)
      }
    }

    // Check if page is a contact us page
    if (this.pageType && (this.pageType.urlKeywords.length > 0 || this.pageType.domKeywords.length > 0)) {
      this.pageType.type = 'contact_us'
      return true
    } else {
      this.pageType = null
      return false
    }
  }

  /**
   * @function isCareersPage
   * @description Check if page is a careers' page by checking the url and dom
   * for CAREERS_KEYWORDS. If so, will set the careers' page flag true
   */
  isCareersPage() {
    if (this.pageIdProps?.careers.keywords && this.pageType) {
      const keywords =  this.pageIdProps.careers.keywords
      // Does the URL contain careers keywords?
      if (this.url?.pathname) {
        this.pageType.urlKeywords = this.checkUrlForKeywords(this.url?.pathname, keywords)
      }
    }

    // Check if page is a contact us page
    if (this.pageType && (this.pageType.urlKeywords.length > 0 || this.pageType.domKeywords.length > 0)) {
      this.pageType.type = 'careers'
      return true
    } else {
      this.pageType = null
      return false
    }
  }

  /**
   * @function isBlogPage
   * @description Check if page is a blog page by checking the url and dom
   * for BLOG_KEYWORDS. If so, will set the blog page flag true
   */
  isBlogPage() {
    if (this.pageIdProps?.blog.keywords && this.pageType) {
      const keywords =  this.pageIdProps.blog.keywords
      // Does the URL contain blog keywords?
      if (this.url?.pathname) {
        this.pageType.urlKeywords = this.checkUrlForKeywords(this.url?.pathname, keywords)
      }

      // Does the DOM contain contact us keywords?
      if (this.elements) {
        this.pageType.domKeywords = this.checkDomElementsForKeywords(this.elements, keywords)
      }
    }

    // Check if page is a blog page
    if (this.pageType && (this.pageType.urlKeywords.length > 0 || this.pageType.domKeywords.length > 0)) {
      this.pageType.type = 'blog'
      return true
    } else {
      this.pageType = null
      return false
    }
  }

  /**
   * @function checkMiscProperties
   * @description Check page for misc page properties. Will set general attributes
   * on misc page id properties
   */
  checkMiscProperties(): void {
    if (this.pageType) {
      // How many form inputs are on the page?
      const pageForms = this.forms && this.forms.filter((f) => !f.isTemplateElement)
      this.pageType.formInputsOnPage = pageForms?.length || 0

      // How many videos are on the page?
      this.pageType.videosOnPage = this.videos?.length || 0

      // How much content is on the page?
      // TODO: Get Clarity from Justin on this

      // What buttons are on the page?
    }
  }

  /**
   * @function mapDom
   * @description Get and set, parsed Dom scripts and elements
   */
  mapDom(): void {
    // Select all page elements
    const docElements = document.querySelectorAll('*')
    // Select all scripts
    const scripts = document.querySelectorAll('script')
    // Set DOM mapped attributes
    this.elements = Array.from(docElements)
    this.scripts = Array.from(scripts)
    this.buttons = this.createDomButtonMap()
    this.forms = this.createDomFormMap()
    this.links = this.createDomLinkMap()
    this.videos = this.createDomVideoMap()

    // TODO: Check IFrames somehow
    // this.createDomIFrameMap()
    // this.iframes = domMap.iframes
  }

  async trackPage(): Promise<boolean> {
    try {
      const MP = window.MP
      if (!MP) {
        console.error('MP: No MP instance exists.')
        return false
      }
      console.log(`Track Page Request Body:`, { pageType: this.pageType })
      await MP.apiRequest('POST', 'track-page', this.pageType)
      return true
    } catch(e) {
      console.error(`Error tracking page: ${e}`)
      return false
    }
  }

  /**
   * @function identifyPage
   * @description Run sequence of checks to determine what page the user is on.
   * Once identified, will call the track-page api
   */
   identifyPage(): void {
    // Check for misc items on the page first
    // These are included in every api call
    this.checkMiscProperties()

    // Check for page type
    // Stop checking once a page has been identified
    // TODO: Implement breakout from page check
    const isEcommPage = this.isEcommPage()
    if (isEcommPage) {
      this.trackPage()
      return
    }
    this.isConfirmationPage()
    this.isLeadGenPage()
    this.isContactUsPage()
    this.isBlogPage()
    this.isCareersPage()
  }
}
