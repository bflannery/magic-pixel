import {MagicPixelType, MPEventTrackerType} from './types'


declare global {
  interface Window {
    MP?: MagicPixelType
    MP_EventTracker?: MPEventTrackerType
    MP_HID?: string | null
    MP_SID?: string | null
  }
}
