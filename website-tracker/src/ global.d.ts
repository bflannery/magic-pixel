import {MagicPixelType} from "./magicPixel";
import {MagicPixelEventType} from "./events";

declare global {
  interface Window {
    MP: MagicPixelType
    MP_Events: MagicPixelEventType
    MP_HID?: string | null
    MP_SID?: string | null
  }
}
