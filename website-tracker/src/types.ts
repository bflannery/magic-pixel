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
  clearStorage: () => void
  _getStorageContext: () => MpDataProps | null
  _getStorageSessionId: () => string | null
  setStorageContext: (data: MpDataProps) => void
  setSessionId: (sid: string) => void
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
