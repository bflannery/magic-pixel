import { ParsedURLProps } from './utils'

export interface MpDataProps {
  accountSiteId: string | null
  accountStatus: string
  lastVerified: number | null
  visitorUUID: string | null
  distinctPersonId: string | null
}

export interface MagicPixelType {
  apiDomain: string
  fingerprint: string | null
  context: MpDataProps
  init: (accountId: string | null, accountSiteId: string | null) => Promise<void>
  setIdentifiedUser: (distinctUserId: string) => void
  apiRequest: (method: string, endpoint: string, body: object) => Promise<any | Boolean>
  authenticateHostData: (mpData: MpDataProps) => Promise<boolean>
  authenticateAccountId: () => Promise<boolean>
  authenticateAccount: () => Promise<boolean>
}

export interface MPEventTrackerType {
  javascriptRedirect: boolean
  init: () => Promise<void>
  identify: (distinctUserId: string) => Promise<boolean>
  track: (eventType: string, properties: object) => Promise<boolean>
  trackScribeEvent: (scribeEvent: any) => void
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

export type MPKeyboardEvent = KeyboardEvent & MPEvent

export type MPGenericEvent = Event & MPEvent

export interface EventProps {
  [key: string]: string | number | null
}


export interface MPEventType {
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


/// Scribe Types
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