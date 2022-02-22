import { ParsedURLProps } from './utils'

export type MPEventForm = {
  id?: string
  formId?: string
  name?: string
  elements: HTMLFormElement[]
}

export type MPEvent = {
  form?: MPEventForm
  target: { type: string; form: MPEventForm }
}

export type MPMouseEvent = MouseEvent & MPEvent

export type MPKeyboardEvent = KeyboardEvent & MPEvent

export type MPGenericEvent = Event & MPEvent

export interface MpDataProps {
  accountSiteId: string | null
  accountStatus: string
  lastVerified: number | null
  visitorUUID: string | null
  distinctPersonId: string | null
}

export interface EventProps {
  accountSiteId: string | null
  accountStatus: string
  lastVerified: number | null
  distinctPersonId: string | null
  visitorUUID: string | null

  [key: string]: string | number | null
}

export interface MagicPixelType {
  apiDomain: string
  fingerprint: string | null
  context: MpDataProps
  javascriptRedirect: boolean
  init: (accountId: string | null, accountSiteId: string | null) => Promise<void>
  identify: (distinctUserId: string) => Promise<boolean>
  track: (eventType: string, properties: object) => Promise<boolean>
  authenticateHostData: (mpData: MpDataProps) => Promise<boolean>
  authenticateAccountId: () => Promise<boolean>
  trackScribeEvent: (scribeEvent: any) => void
}

export interface MPEventType {
  accountSiteId: string | null
  accountStatus: string
  lastVerified: number | null
  visitorUUID: string | null
  distinctPersonId: string | null
  eventType: string
  timestamp: string
  target: {
    url: ParsedURLProps
  }
  source: {
    url: ParsedURLProps
  }
  form?: {
    formId: string
    formFields: Record<string, string>
  }
}

export interface ScribeFormType {
  formId: string
  formFields: Record<string, string>
}

export interface ScribeEventType {
  path: string
  value: {
    fingerprint: string
    sessionId: string
    visitorId: string
    userProfile?: string | null
    form?: ScribeFormType | null
    event: string
    timestamp: string
    source?: {
      url?: {
        host?: string
        hostname?: string
        pathname?: string
        protocol?: string
      }
    }
  }
  op: string
  success: () => void
  failure: () => void
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
  forms: DomFormMapType[]
  links: DomLinkMapType[]
  buttons: DomButtonMapType
  videos: DomVideoMapType[]
}

interface EcommDomType extends Record<string, boolean>{
  paypal: boolean
  google_pay: boolean
  apple_pay: boolean
  bolt_pay: boolean
  stripe_for: boolean
  braintree_form: boolean
  square_form: boolean
  checkout: boolean
  purchase: boolean
  order: boolean
  buy: boolean
  order_summary: boolean
  total: boolean
  subtotal: boolean
  shipping: boolean
  tax: boolean
  payment: boolean
  promo_code: boolean
  coupon: boolean
  shipping_address: boolean
  billing_address: boolean
}

export interface PageIdPropsType {
  eCommerce: {
    keywords: string[]
    dom: EcommDomType
  }
  confirmation: {
    keywords: string[]
    url: {
      thank_you: boolean
      order_summary: boolean
      order: boolean
      confirmation: boolean
    }
    dom: {
      confirmation: boolean
    }
  }
  lead_gen: {
    keywords: string[]
    dom: {
      email: boolean
    }
  }
  contact_us: {
    keywords: string[]
    url: {
      contact: boolean
      feedback: boolean
    }
  }
  careers: {
    keywords: string[]
    url: {
      careers: boolean
      jobs: boolean
    }
  }
  blog: {
    keywords: string[]
    url: {
      blog: boolean
      articles: boolean
    }
    dom: {
      list_of_articles: boolean
      list_of_links: boolean
    }
  }
  general: {
    forms_input: number
    videos_on_page: number
    content_on_page: number
  }
  misc: {
    has_sidebar: boolean
    has_topbar: boolean
    has_navbar: boolean
  }
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

export interface PageIdentificationType {
  buttons: DomButtonMapType | null
  forms: DomElementType[]
  links: DomLinkMapType[]
  pageIdProps: PageIdPropsType
  getDomMap: () => DomMapType
}


// export interface EventType {
//   accountId: string | null
//   accountSiteId: string | null
//   accountStatus: string
//   lastVerified: number | null
//   distinctUserId: string | null
//   visitorUUID: string | null
//   eventType: string,
//   timestamp: string,
//   target: {
//     url: ParsedURLProps
//   }
//   source: {
//     url: ParsedURLProps
//   }
// }
//
// interface EventProps {
//   accountId: string | null
//   accountSiteId: string | null
//   accountStatus: string
//   lastVerified: number | null
//   distinctUserId: string | null
//   visitorUUID: string | null
//   [key: string]: string | number | null
// }
