import { MagicPixelType } from "./magicPixel";

interface Window {
  MP_HID?: string | null
  MP: MagicPixelType | null
}

declare const config: Readonly<Config>
