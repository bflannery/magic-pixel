import { ParsedURLProps } from './utils'


export interface MagicPixelType {
  apiRequest: (method: string, endpoint: string, body: object) => Promise<any | Boolean>
  authenticateAccount: () => Promise<boolean>
}

export interface ContentIdentificationType {
  url: ParsedURLProps | null
}
