import { MagicPixelType, PageIdentificationType } from './types'


declare global {
  interface Window {
    MP?: MagicPixelType
    MP_PageIdentification?: PageIdentificationType
    MP_HID?: string | null
    MP_SID?: string | null
  }
}
