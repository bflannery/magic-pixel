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

export interface ContentIdentificationType {
  url: ParsedURLProps | null
  userContext: MpUserProps
}
