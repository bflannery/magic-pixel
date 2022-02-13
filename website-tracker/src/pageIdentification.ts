import { DomAttributeType, DomElementType, DomLinkType, DomMapType, PageIdPropsType } from './types'

const PAGE_ID_PROPERTIES = {
  eCommerce: {
    keywords: [
      'paypal',
      'google_pay',
      'apple_pay',
      'bolt_pay',
      'stripe_for',
      'braintree_form',
      'square_form',
      'checkout',
      'purchase',
      'order',
      'buy',
      'order_summary',
      'total',
      'subtotal',
      'shipping',
      'tax',
      'payment',
      'promo_code',
      'coupon',
      'shipping_address',
      'billing_address',
    ],
    dom: {
      paypal: false,
      google_pay: false,
      apple_pay: false,
      bolt_pay: false,
      stripe_for: false,
      braintree_form: false,
      square_form: false,
      checkout: false,
      purchase: false,
      order: false,
      buy: false,
      order_summary: false,
      total: false,
      subtotal: false,
      shipping: false,
      tax: false,
      payment: false,
      promo_code: false,
      coupon: false,
      shipping_address: false,
      billing_address: false,
    },
  },
  confirmation: {
    keywords: ['thankyou', 'order', 'ordersummary', 'confirmation'],
    url: {
      thank_you: false,
      order_summary: false,
      order: false,
      confirmation: false,
    },
    dom: {
      confirmation: false,
    },
  },
  lead_gen: {
    keywords: ['email'],
    dom: {
      email: true,
    },
  },
  contact_us: {
    keywords: ['contact', 'feedback'],
    url: {
      contact: false,
      feedback: false,
    },
  },
  careers: {
    keywords: ['careers', 'jobs'],
    url: {
      careers: false,
      jobs: false,
    },
  },
  blog: {
    keywords: ['blog', 'articles'],
    url: {
      blog: false,
      articles: false,
    },
    dom: {
      list_of_articles: false,
      list_of_links: false,
    },
  },
  general: {
    forms_input: 0,
    videos_on_page: 0,
    content_on_page: 0,
  },
  misc: {
    buttons: [],
  },
}

export default class PageIdentification {
  buttons: DomElementType[]
  forms: DomElementType[]
  links: DomLinkType[]
  pageIdProps: PageIdPropsType

  constructor() {
    this.buttons = []
    this.forms = []
    this.links = []
    this.pageIdProps = PAGE_ID_PROPERTIES
  }

  init() {
    const domMap = this.getDomMap()
    this.buttons = domMap.buttons
    this.forms = domMap.forms
    this.links = domMap.links

    console.log({ pageIdThis: this })
  }

  /**
   * Create an array of the attributes on an element
   * @param  {NamedNodeMap} attributes The attributes on an element
   * @return {Array} sThe attributes on an element as an array of key/value pairs
   */
  _getAttributes = function (attributes: NamedNodeMap): DomAttributeType[] {
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

  _createButtonElementMap = (link: Element): DomLinkType => {
    return {
      id: link.id,
      className: link.className,
      content: link.textContent?.trim() || null,
      attributes: this._getAttributes(link.attributes),
      type: link.tagName.toLowerCase(),
    }
  }

  /**
   * Create a Tree Map for an element
   * @param  {Node}    element The element to map
   * @param  {Boolean} isSVG   If true, node is within an SVG
   * @return {Array}           A DOM tree map
   */
  _createElementMap = (element: Element, isSVG: boolean): DomElementType[] => {
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

  _createLinkElementMap = (link: Element): DomLinkType => {
    return {
      id: link.id,
      className: link.className,
      content: link.textContent?.trim() || null,
      attributes: this._getAttributes(link.attributes),
      type: link.tagName.toLowerCase(),
    }
  }

  _createDomLinkMap = (): DomLinkType[] => {
    const links = document.querySelectorAll('a')
    const linksMap: any = {}
    Array.prototype.map.call(links, (link, i) => {
      const linkMap = this._createLinkElementMap(link)
      const linkKey = link.id || `link-id-${i}`
      linksMap[linkKey] = linkMap
    })
    return linksMap
  }

  _createDomFormMap = (): DomElementType[] => {
    const forms = document.querySelectorAll('form')
    const formsMap: any = {}
    Array.prototype.map.call(forms, (form, i) => {
      const formMap = this._createElementMap(form, false)
      const formKey = form.id || `form-id-${i}`
      formsMap[formKey] = formMap
    })
    return formsMap
  }

  _createDomButtonMap = (): DomElementType[] => {
    const buttons = document.querySelectorAll('button')
    const inputButtons = document.querySelectorAll('input[type="submit"]')
    const allButtons = Array.prototype.slice.call(buttons).concat(Array.prototype.slice.call(inputButtons))
    const buttonsMap: any = {}
    Array.prototype.map.call(allButtons, (buttonNode, i) => {
      const buttonMap = this._createButtonElementMap(buttonNode)
      const buttonKey = buttonNode.id || `button-id-${i}`
      buttonsMap[buttonKey] = buttonMap
    })
    return buttonsMap
  }

  getDomMap = (): DomMapType => {
    console.log('Getting Dom Map...')
    const body = document.body
    return {
      forms: this._createDomFormMap(),
      links: this._createDomLinkMap(),
      buttons: this._createDomButtonMap(),
      body: this._createElementMap(body, false),
    }
  }
}
