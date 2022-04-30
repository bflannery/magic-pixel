import { ContentIdentificationType } from './types'


declare global {
  interface Window {
    MP_CONTENT_IDENTIFICATION?: ContentIdentificationType
    MP_HID?: string | null
    MP_SID?: string | null
  }
}
