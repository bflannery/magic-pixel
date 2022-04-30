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

export interface EventTrackerType {
  apiDomain: string
  userContext: MpUserProps
  init: () => Promise<void>
  apiRequest: (method: string, endpoint: string, body: object) => Promise<any | Boolean>
  authenticateHostData: (mpData: MpUserProps) => Promise<boolean>
  authenticateAccountId: () => Promise<boolean>
  authenticateAccount: () => Promise<boolean>
}

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

export interface MpUserProps {
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