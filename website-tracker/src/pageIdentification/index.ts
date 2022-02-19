import {
  DomAttributeType,
  DomButtonMapType,
  DomButtonType,
  DomElementType,
  DomFormElementType,
  DomFormMapType,
  DomLinkType,
  DomMapType,
  PageIdPropsType,
} from '../types'
import { getAncestors } from '../dom'
import { PAGE_ID_PROPERTIES } from './constants'

export default class PageIdentification {
  buttons: DomButtonMapType | null
  forms: DomFormMapType
  links: DomLinkType[]
  pageIdProps: PageIdPropsType
  elements: Element[] | null

  constructor() {
    this.buttons = null
    this.forms = {}
    this.links = []
    this.pageIdProps = PAGE_ID_PROPERTIES
    this.elements = null
  }

  init() {
    const domMap = this._getDomMap()
    this.buttons = domMap.buttons
    this.forms = domMap.forms
    this.links = domMap.links

    const docElements = document.querySelectorAll('*')
    this.elements = Array.from(docElements)

    console.log({ initThis: this })

    // this._isEcommPage()
    this._isGeneralPage()
  }

  _getDomMap(): DomMapType {
    const body = document.body
    return {
      forms: this._createDomFormMap(),
      links: this._createDomLinkMap(),
      buttons: this._createDomButtonMap(),
      body: this._createElementMap(body, false),
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
   * Check if form is apart of the page template. We are looking for unique forms per page
   * @param  {HTMLFormElement} form The attributes on an element
   * @return {Boolean}
   */
  _isTemplateForm(form: HTMLFormElement): boolean {
    const ancestors = getAncestors(form)
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
   * Create a elements map of an HTMLElement
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
    return childNodes.map((node, i): DomElementType => {
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
   * Create a elements map of a form HTMLFormElement
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
    return childNodes.map((node, i): DomFormElementType => {
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
   * Create a attribute map of a HTMLButton element
   * @param  {HTMLButtonElement} button HTMLButton element
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

  _createLinkElementMap(link: Element): DomLinkType {
    return {
      id: link.id,
      className: link.className,
      content: link.textContent?.trim() || null,
      attributes: this._getAttributes(link.attributes),
      type: link.tagName.toLowerCase(),
    }
  }

  _createDomLinkMap(): DomLinkType[] {
    const links = document.querySelectorAll('a')
    const linksMap: any = {}
    Array.from(links).map((link, i) => {
      const linkMap = this._createLinkElementMap(link)
      const linkKey = link.id || `link-id-${i}`
      linksMap[linkKey] = linkMap
    })
    return linksMap
  }

  _createDomFormMap(): DomFormMapType {
    const forms = document.querySelectorAll('form')
    const formsMap: DomFormMapType = {}
    Array.from(forms).map((form, i) => {
      const formKey = form.id || `form-id-${i}`
      formsMap[formKey] = {
        isTemplateForm: this._isTemplateForm(form),
        formElements: this._createFormElementsMap(form),
      }
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

  _checkElementsForKeywords(elements: Element[], keywords: string[]): void {
    elements.map((element, i) => {
      const keyword = keywords.find((k) => {
        if (element.textContent) {
          return element.textContent.toLowerCase().includes(k)
        }
      })
      if (keyword) {
        this.pageIdProps.eCommerce.dom[keyword] = true
      }
    })
  }

  _isEcommPage(): void {
    // Check for payment processor button
    // Determine if the JS objects, scripts or methods exist.

    // Does the DOM contain ecommerce keywords?
    const keywords = this.pageIdProps.eCommerce.keywords
    const elements = this.elements

    if (elements) {
      this._checkElementsForKeywords(elements, keywords)
    }

    // Does the URL contain ecommerce keywords?
    console.log({ pageIdProps: this.pageIdProps })
  }

  _isGeneralPage() {
    // How many form inputs are on the page?
    const forms = this.forms
    console.log({ forms })
    // How many videos are on the page?
    // How much content is on the page?
  }

  _isConfirmationPage() {
    // Does the URL contain the following words?	[thankyou, confirmation, ordersummary, summary]
    // Does the DOM contain the keyword, 'confirmation'
  }

  _isLeadGenPage() {}

  _isMiscPage() {}

  _isContactPage() {}

  _isCareersPage() {}

  _isBlogPage() {}
}
