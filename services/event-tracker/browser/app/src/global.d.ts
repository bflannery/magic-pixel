import {EventTrackerType} from './types'


declare global {
  interface Window {
    MP_EVENT_TRACKER?: EventTrackerType
    MP_HID?: string | null
    MP_SID?: string | null
  }
}
