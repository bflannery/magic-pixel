import { MagicPixelType, ContentIdentificationType } from './types'


declare global {
  interface Window {
    MP?: MagicPixelType
    MP_ContentIdentification?: ContentIdentificationType
    MP_HID?: string | null
    MP_SID?: string | null
  }
}
