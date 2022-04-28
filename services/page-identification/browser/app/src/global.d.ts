import { PageIdentificationType } from './types'

declare global {
  interface Window {
    MP_PAGE_IDENTIFICATION?: PageIdentificationType
    MP_HID?: string | null
    MP_SID?: string | null
  }
}
