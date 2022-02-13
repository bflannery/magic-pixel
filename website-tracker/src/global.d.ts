import { MagicPixelType, PageIdentificationType } from './types'


declare global {
  interface Window {
    MP?: MagicPixelType
    MP_PAGE_ID?: PageIdentificationType
    MP_HID?: string | null
    MP_SID?: string | null
  }
}
