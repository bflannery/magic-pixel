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
  scripts: HTMLScriptElement[]
  elements: Element[]
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

interface EcommUrlType extends Record<string, boolean>{
  checkout: boolean
  purchase: boolean
  order: boolean
  buy: boolean
  order_summary: boolean
}

interface ConfirmationDomType extends Record<string, boolean>{
  confirmation: boolean
}

interface ConfirmationUrlType extends Record<string, boolean>{
  thank_you: boolean
  order_summary: boolean
  order: boolean
  confirmation: boolean
}

interface LeadGenDomType extends Record<string, boolean>{
  email: boolean
}

interface ContactUsDomType extends Record<string, boolean>{
  contact: boolean
}

interface ContactUsUrlType extends Record<string, boolean>{
  contact: boolean
  feedback: boolean
}

interface CareersUrlType extends Record<string, boolean>{
  careers: boolean
  jobs: boolean
}

interface BlogDomType extends Record<string, boolean>{
  list_of_articles: boolean
  list_of_links: boolean
}

interface BlogUrlType extends Record<string, boolean>{
  blog: boolean
  articles: boolean
}

interface GeneralType extends Record<string, boolean | number>{
  form_inputs_on_page: number
  videos_on_page: number
  content_on_page: number
}

interface MiscType extends Record<string, boolean>{
  has_sidebar: boolean
  has_topbar: boolean
  has_navbar: boolean
}

export interface PageIdPropsType {
  eCommerce: {
    isEcommPage: boolean
    dom: EcommDomType
    url: EcommUrlType
  }
  confirmation: {
    isConfirmationPage: boolean
    url: ConfirmationUrlType
    dom: ConfirmationDomType
  }
  lead_gen: {
    isLeadGenPage: boolean
    dom: LeadGenDomType
  }
  contact_us: {
    isContactUsPage: boolean
    dom: ContactUsDomType
    url: ContactUsUrlType
  }
  careers: {
    isCareersPage: boolean
    url: CareersUrlType
  }
  blog: {
    isBlogPage: boolean
    url: BlogUrlType
    dom: BlogDomType
  }
  general: GeneralType
  misc: MiscType
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
  scripts: HTMLScriptElement[] | null
  elements: Element[] | null
  buttons: DomButtonMapType | null
  forms: DomFormMapType[] | null
  links: DomLinkMapType[] | null
  videos: DomVideoMapType[] | null
  pageIdProps: PageIdPropsType
  url: ParsedURLProps | null
}
