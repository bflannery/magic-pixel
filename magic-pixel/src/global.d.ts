import { MagicPixelType } from './types'

declare global {
  interface Window {
    MP_INIT?: MagicPixelType
    MP_HID?: string | null
    MP_SID?: string | null
  }
}
