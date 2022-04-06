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