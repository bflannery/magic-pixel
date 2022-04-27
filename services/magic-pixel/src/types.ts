export interface toObjectInterface {
  [key: string]: any
}

export interface ParsedURLProps {
  href: string | null
  hash: string | null
  host: string | null
  hostname: string | null
  pathname: string | null
  protocol: string | null
  query: toObjectInterface
}

export interface MpUserProps {
  accountSiteId: string | null
  accountStatus: string
  fingerprint: string | null
  sessionId: string | null
  lastVerified: number | null
  visitorUUID: string | null
  distinctPersonId: string | null
}

export interface MagicPixelType {
  apiDomain: string
  userContext: MpUserProps
  init: () => Promise<void>
  setIdentifiedUser: (distinctUserId: string) => void
  apiRequest: (method: string, endpoint: string, body: object) => Promise<any | Boolean>
  authenticateHostData: (mpData: MpUserProps) => Promise<boolean>
  authenticateAccountId: () => Promise<boolean>
  authenticateAccount: () => Promise<boolean>
}