import { AlertClassKey } from '@material-ui/lab'

// interface Test { a: string, b: number, c: string }
// ExtractKeyOfType<Test, string> == "a" | "c"
export {}
declare global {
  type ExtractKeyOfType<P, T> = { [K in keyof P]: P[K] extends T ? K : never }[keyof P]
}

// Add more palette options to material ui theme creator
declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions {
    success: PaletteColorOptions
    info: PaletteColorOptions
    warning: PaletteColorOptions
    purple: PaletteColorOptions
  }

  interface Palette {
    success: PaletteColor
    info: PaletteColor
    warning: PaletteColor
    purple: PaletteColor
  }
}

declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey {
    MuiAlert: AlertClassKey
  }
}
