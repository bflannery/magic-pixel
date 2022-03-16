import {
  DomAttributeType,
  DomButtonMapType,
  DomButtonType,
  DomElementType,
  DomFormElementType,
  DomFormMapType,
  DomLinkMapType,
  DomMapType, DomVideoMapType,
  PageIdPropsType,
} from '../types'
import { getAncestors } from '../dom'
import {
  CONFIRMATION_KEYWORDS,
  ECOMM_KEYWORDS, LEAD_GEN_KEYWORDS, PAGE_ID_PROPERTIES
} from './constants'
import {ParsedURLProps, parseLocation} from "../utils";

export default class PageIdentification {
  elements: Element[] | null
  buttons: DomButtonMapType | null
  forms: DomFormMapType[] | null
  links: DomLinkMapType[] | null
  videos: DomVideoMapType[] | null
  pageIdProps: PageIdPropsType
  url: ParsedURLProps | null

  constructor() {
    this.buttons = null
    this.forms = null
    this.links = null
    this.videos = null
    this.pageIdProps = PAGE_ID_PROPERTIES
    this.elements = null
    this.url = null
  }

  init() {
    const domMap = this._getDomMap()
    this.buttons = domMap.buttons
    this.forms = domMap.forms
    this.links = domMap.links
    this.videos = domMap.videos
    // Does the URL contain ecommerce keywords?
    this.url = parseLocation(document.location)

    const docElements = document.querySelectorAll('*')
    this.elements = Array.from(docElements)

    // Page Checks
    // TODO: Once page has been identified, can we stop checking?
    this._isEcommPage()
    this._isConfirmationPage()
    this._isLeadGenPage()

    // General and Misc items on the page
    this._checkGeneralProperties()
    this._checkMiscProperties()

    console.log({ initThis: this })
  }

  _getDomMap(): DomMapType {
    return {
      forms: this._createDomFormMap(),
      links: this._createDomLinkMap(),
      buttons: this._createDomButtonMap(),
      videos: this._createDomVideoMap(),
    }
  }

  /**
   * Create an array of the attributes on an element
   * @param  {NamedNodeMap} attributes The attributes on an element
   * @return {Array} sThe attributes on an element as an array of key/value pairs
   */
  _getAttributes(attributes: NamedNodeMap): DomAttributeType[] {
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
   * Check if form is part of the page template. We are looking for unique elements per page
   * @param  {HTMLFormElement} element The attributes on an element
   * @return {Boolean}
   */
  _isTemplateElement(element: Element): boolean {
    const ancestors = getAncestors(element)
    let isTemplateForm = false
    ancestors.forEach((ancestor) => {
      ;['sidebar', 'topbar', 'nav', 'header'].forEach((templateKeyword) => {
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
   * Create an elements map of an HTMLElement
   * @param  {HTMLElement} element the HTMLElement
   * @param  {Boolean} isSVG SVG are handled uniquely
   * @return {DomElementType[]} attributes about the HTMLFormElement
   */
  _createElementMap(element: HTMLElement, isSVG: boolean): DomElementType[] {
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
      const attributes = node.nodeType !== 1 ? [] : this._getAttributes(node.attributes)
      const content = node.childNodes && node.childNodes.length > 0 ? null : node.textContent.trim()
      const type = node.nodeType === 3 ? 'text' : node.tagName.toLowerCase()
      const children = this._createElementMap(node, isSVG || node.type === 'svg')
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
   * Create an elements map of a form HTMLFormElement
   * @param  {HTMLButtonElement} form the HTMLFormElement
   * @return {DomFormElementType[]} an array of form elements with attributes about the HTMLFormElement
   */
  _createFormElementsMap(form: HTMLFormElement): DomFormElementType[] {
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
      const attributes = node.nodeType !== 1 ? [] : this._getAttributes(node.attributes)
      const content = node.childNodes && node.childNodes.length > 0 ? null : node.textContent.trim()
      const type = node.nodeType === 3 ? 'text' : node.tagName.toLowerCase()
      const children = this._createFormElementsMap(node)
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
   * Create an attribute map of a HTMLButton element
   * @param  {HTMLButtonElement} button: HTMLButton element
   * @return {DomButtonType} attributes about the HTMLButton
   */
  _createButtonElementMap(button: HTMLButtonElement): DomButtonType {
    return {
      id: button.id,
      className: button.className,
      content: button.textContent?.trim() || null,
      attributes: this._getAttributes(button.attributes),
      type: button.tagName.toLowerCase(),
      ancestors: getAncestors(button),
    }
  }

  /**
   * Create an attribute map of a HTMLAnchorElement element
   * @param  {HTMLAnchorElement} link: HTMLAnchorElement element
   * @param  {number} index used for reference if id is not provided
   * @return {DomLinkMapType} attributes about the HTMLAnchorElement
   */
  _createLinkElementMap(link: HTMLAnchorElement, index: number): DomLinkMapType {
    return {
      id: link.id || `link-id-${index}`,
      isTemplateElement: this._isTemplateElement(link),
      className: link.className,
      content: link.textContent?.trim() || null,
      attributes: this._getAttributes(link.attributes),
      type: link.tagName.toLowerCase(),
    }
  }

  /**
   * Create a list of attribute maps for each HTMLAnchorElement element
   * @return {DomLinkMapType[]} an array of attributes about the HTMLAnchorElement
   */
  _createDomLinkMap(): DomLinkMapType[] {
    const links = document.querySelectorAll('a')
    const linksMap: DomLinkMapType[] = []
    Array.from(links).map((link, i) => {
      const mappedLink = this._createLinkElementMap(link, i)
      linksMap.push(mappedLink)
    })
    return linksMap
  }

  /**
   * Create a list of attribute maps for each HTMLFormElement element
   * @return {DomLinkMapType[]} an array of attributes about the HTMLFormElement
   */
  _createDomFormMap(): DomFormMapType[] {
    const forms = document.querySelectorAll('form')
    const formsMap: DomFormMapType[] = []
    Array.from(forms).map((form, i) => {
      const mappedForm = {
        id: form.id || `form-id-${i}`,
        isTemplateElement: this._isTemplateElement(form),
        elements: this._createFormElementsMap(form),
      }
      formsMap.push(mappedForm)
    })
    return formsMap
  }

  _createDomButtonMap(): DomButtonMapType {
    const buttons = document.querySelectorAll('button')
    const inputButtons = document.querySelectorAll('input[type="submit"]')
    const allButtons = Array.prototype.slice.call(buttons).concat(Array.prototype.slice.call(inputButtons))
    const buttonsMap: any = {}
    Array.from(allButtons).map((buttonNode, i) => {
      const buttonMap = this._createButtonElementMap(buttonNode)
      const buttonKey = buttonNode.id || `button-id-${i}`
      buttonsMap[buttonKey] = buttonMap
    })
    return buttonsMap
  }

  /**
   * Create a list of attribute maps for each HTMLVideoElement element
   * @return {DomVideoMapType[]} an array of attributes about the HTMLVideoElement
   */
  _createDomVideoMap(): DomVideoMapType[] {
    const videos = document.querySelectorAll('video')
    const videosMap: DomVideoMapType[] = []
    Array.from(videos).map((video, i) => {
      const mappedForm = {
        id: video.id || `video-id-${i}`,
        elements: this._createElementMap(video, false),
      }
      videosMap.push(mappedForm)
    })
    return videosMap
  }

  /**
   * @function _checkUrlForKeywords
   * @description Check url object to see if it contains a keyword in the keywords array.
   * @param {Element[]} elements: an array of element from the dom
   * @param {string[]} keywords: array of keywords to search from
   */
  _checkDomElementsForKeywords(elements: Element[], keywords: string[]): string[] | null {
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
    return !!keywordMatches.length ? keywordMatches : null
  }

  /**
   * @function _checkUrlForKeywords
   * @description Check url object for keywords
   * @param {ParsedURLProps} url: url object
   * @param {string[]} keywords: array of keywords to search from
   */
  _checkUrlForKeywords(url: ParsedURLProps, keywords: string[]): string | null {
    const pathname = url.pathname
    return pathname ? (keywords.find(k => pathname.includes(k)) || null) : null
  }

  /**
   * @function _isEcommPage
   * @description Check if page is an ecomm page by checking the url and dom for
   * ECOMM_KEYWORDS. If so, set the ecomm page flag true
   */
  _isEcommPage(): void {
    // Check for payment processor button
    // Determine if the JS objects, scripts or methods exist.
    // TODO: Get Clarity from Justin on this

    // Does the URL contain ecommerce keywords?
    if (this.url) {
      const keyword = this._checkUrlForKeywords(this.url, ECOMM_KEYWORDS)
      if (keyword) {
        this.pageIdProps.eCommerce.url[keyword] = true
      }
    }

    // Does the DOM contain ecommerce keywords?
    if (this.elements) {
      const keywords = this._checkDomElementsForKeywords(this.elements, ECOMM_KEYWORDS)
      if (keywords) {
        keywords.forEach((keyword => this.pageIdProps.eCommerce.dom[keyword] = true))
      }
    }

    // Check if page is an ecomm page
    this.pageIdProps.eCommerce.isEcommPage = (
      Object.values(this.pageIdProps.eCommerce.dom).some(value => value) ||
      Object.values(this.pageIdProps.eCommerce.url).some(value => value)
    )
  }

  /**
   * @function _isConfirmationPage
   * @description Check if page is a confirmation page by checking the url and dom
   * for CONFIRMATION_KEYWORDS. If so, will set the confirmation page flag true
   */
  _isConfirmationPage() {
    // Does the URL contain CONFIRMATION_KEYWORDS keywords?
    if (this.url) {
      const keyword = this._checkUrlForKeywords(this.url, CONFIRMATION_KEYWORDS)
      if (keyword) {
        this.pageIdProps.confirmation.url[keyword] = true
      }

    }

    // Does the DOM contain CONFIRMATION_KEYWORDS keywords?
    if (this.elements) {
      const keywords = this._checkDomElementsForKeywords(this.elements, CONFIRMATION_KEYWORDS)
      if (keywords) {
        keywords.forEach((keyword => this.pageIdProps.confirmation.dom[keyword] = true))
      }
    }

    // Check if page is a confirmation page
    this.pageIdProps.confirmation.isConfirmationPage = (
      Object.values(this.pageIdProps.confirmation.dom).some(value => value) ||
      Object.values(this.pageIdProps.confirmation.url).some(value => value)
    )
  }

  /**
   * @function _isLeadGenPage
   * @description Check if page is a lead gen page by checking the url and dom
   * for LEAD_GEN_KEYWORDS. If so, will set the lead gen page flag true
   */
  _isLeadGenPage() {
    // Does the DOM contain LEAD_GEN_KEYWORDS keywords?
    if (this.elements) {
      const keywords = this._checkDomElementsForKeywords(this.elements, LEAD_GEN_KEYWORDS)
      if (keywords) {
        keywords.forEach((keyword => this.pageIdProps.lead_gen.dom[keyword] = true))
      }
    }

    // Check if page is a lead gen page
    this.pageIdProps.lead_gen.isLeadGenPage = (
      Object.values(this.pageIdProps.lead_gen.dom).some(value => value)
    )
  }

  /**
   * @function _isContactPage
   * @description Check if page is a contact page by checking the url and dom
   * for CONTACT_KEYWORDS. If so, will set the contact page flag true
   */
  // _isContactPage() {}

  /**
   * @function _isCareersPage
   * @description Check if page is a careers' page by checking the url and dom
   * for CAREERS_KEYWORDS. If so, will set the careers' page flag true
   */
  // _isCareersPage() {}

  /**
   * @function _isBlogPage
   * @description Check if page is a blog page by checking the url and dom
   * for BLOG_KEYWORDS. If so, will set the blog page flag true
   */
  // _isBlogPage() {}


  /**
   * @function _checkGeneralProperties
   * @description Check page for general page properties. Will set general attributes
   * on general page id properties
   */
  _checkGeneralProperties(): void {
    // How many form inputs are on the page?
    const pageForms = this.forms && this.forms.filter((f) => !f.isTemplateElement)
    this.pageIdProps.general.form_inputs_on_page = pageForms?.length || 0

    // How many videos are on the page?
    this.pageIdProps.general.videos_on_page = this.videos?.length || 0

    // How much content is on the page?
    // TODO: Get Clarity from Justin on this
  }

  _checkMiscProperties(): void {
    // What buttons are on the page?
  }
}
