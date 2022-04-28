import { ParsedURLProps } from './utils'

export interface MpUserProps {
  accountSiteId: string | null
  accountStatus: string
  fingerprint: string | null
  sessionId: string | null
  lastVerified: number | null
  visitorUUID: string | null
  distinctPersonId: string | null
}

export interface PageIdentificationType {
  userContext: MpUserProps
  pageType: PageType
  pageIdProps: PageIdPropsType | null
  scripts: HTMLScriptElement[] | null
  elements: Element[] | null
  buttons: DomButtonMapType | null
  forms: DomFormMapType[] | null
  links: DomLinkMapType[] | null
  videos: DomVideoMapType[] | null
  url: ParsedURLProps | null
}


export interface DomAttributeType {
  name: string
  value: string
}

export interface DomElementType {
  id: string | null
  className: string | null
  content: string | null
  attributes: DomAttributeType[]
  type: string | null
  node: Node
  children: any
  isSVG: boolean
}

export interface DomFormElementType {
  id: string | null
  className: string | null
  content: string | null
  attributes: DomAttributeType[]
  type: string | null
  node: Node
  children: any
}

export interface DomFormMapType {
  id: string,
  isTemplateElement: boolean
  elements: DomFormElementType[]
}

export interface DomButtonType {
  id: string | null
  className: string | null
  content: string | null
  attributes: DomAttributeType[] | null
  type: string | null
  ancestors: Element[] | null
}

export interface DomLinkMapType {
  isTemplateElement: boolean
  id: string | null
  className: string | null
  content: string | null
  attributes: DomAttributeType[] | null
  type: string | null
}

export interface DomVideoMapType {
  id: string,
  elements: DomElementType[]
}

export type DomButtonMapType = Record<string, DomButtonType>

export interface DomMapType {
  scripts: HTMLScriptElement[]
  elements: Element[]
  forms: DomFormMapType[]
  links: DomLinkMapType[]
  buttons: DomButtonMapType
  videos: DomVideoMapType[]
}

interface MiscPageAttributesType {
  formInputsOnPage: number
  videosOnPage: number
  contentOnPage: number
}

export interface PaymentProcessorType {
  "name": string,
  "identifier": {
    "type": "element" | "script"
    "query": string
    "selector": "id" | "class" | "all"
  }
}


export interface PageType extends MiscPageAttributesType {
  paymentProcessor?: PaymentProcessorType
  domKeywords: string[]
  urlKeywords: string[]
  category: string
}


export interface PageIdPropsType {
  eCommerce: {
    paymentProcessors: PaymentProcessorType[] | null
    keywords: string[]
  }
  confirmation: {
    keywords: string[]
  }
  contactUs: {
    keywords: string[]
  }
  careers: {
    keywords: string[]
  }
  blog: {
    keywords: string[]
  }
  misc: MiscPageAttributesType
}

export type EcommKeywordType =
  'paypal' |
  'google_pay' |
  'apple_pay' |
  'bolt_pay' |
  'stripe_for' |
  'braintree_form' |
  'square_form' |
  'checkout' |
  'purchase' |
  'order' |
  'buy' |
  'order_summary' |
  'total' |
  'subtotal' |
  'shipping' |
  'tax' |
  'payment' |
  'promo_code' |
  'coupon' |
  'shipping_address' |
  'billing_address' |
  null

