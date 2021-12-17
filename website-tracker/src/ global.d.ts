import {MagicPixelType} from "./magicPixel";

declare global {
  interface Window {
    MP: MagicPixelType
    MP_HID?: string | null
    MP_SID?: string | null
  }
}
