import React from 'react'
import { createTheme } from '@material-ui/core/styles'
import { Palette, PaletteColor } from '@material-ui/core/styles/createPalette'
import { ReactComponent as Cross } from './icons/cross.svg'
import { ReactComponent as Checkbox } from './icons/checkbox.svg'
import { ReactComponent as CheckboxBlank } from './icons/checkbox-blank.svg'
import { ReactComponent as CheckboxIndeterminate } from './icons/checkbox-indeterminate.svg'

export const white = '#FFF'

export const primary = {
  100: '#E8DDFF',
  200: '#DDCCFF',
  500: '#5500FF',
  600: '#4400CC',
  700: '#330099',
  800: '#220066',
  900: '#1C0055',
}

export const secondary = {
  50: '#FBFAFC',
  100: '#F5F4F8',
  200: '#EEEDF3',
  300: '#E9E9F0',
  400: '#DAD9E6',
  500: '#BCBBD1',
  600: '#7C7CA4',
  700: '#252467',
  800: '#1C1B57',
  900: '#0E0E28',
}

export const cyan = {
  100: '#E2F9FF',
  500: '#38D3FF',
  600: '#05C8FF',
  700: '#00A3D1',
}

export const amber = {
  100: '#FFF6E5',
  500: '#FFCC6E',
  600: '#FFBA3B',
  700: '#D48900',
}

export const purple = {
  100: '#F4E1FC',
  500: '#CB74F2',
  600: '#BA46ED',
  700: '#8712BB',
}

export const error = {
  100: '#FFE6E6',
  500: '#FF6F6F',
  600: '#FF3C3C',
  700: '#D50000',
}

export const success = {
  100: '#EAFFFA',
  500: '#00C89B',
  600: '#009E8E',
  700: '#00624C',
}

const theme = createTheme({
  palette: {
    primary: {
      light: primary[100],
      main: primary[500],
      dark: primary[700],
      contrastText: white,
    },
    secondary: {
      light: secondary[200],
      main: secondary[600],
      dark: secondary[700],
      contrastText: secondary[700],
    },
    text: {
      primary: secondary[700],
      secondary: primary[500],
      disabled: secondary[500],
      hint: secondary[500],
    },
    error: {
      light: error[100],
      main: error[600],
      dark: error[700],
      contrastText: white,
    },
    success: {
      light: success[100],
      main: success[600],
      dark: success[700],
      contrastText: white,
    },
    warning: {
      light: amber[100],
      main: amber[600],
      dark: amber[700],
      contrastText: white,
    },
    info: {
      light: cyan[100],
      main: cyan[600],
      dark: cyan[700],
      contrastText: white,
    },
    purple: {
      light: purple[100],
      main: purple[600],
      dark: purple[700],
      contrastText: white,
    },
    grey: {
      ...secondary,
    },
    background: {
      default: secondary[100],
    },
  },
  spacing: 4,
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      '-apple-system', //iOS
      'BlinkMacSystemFont', //OSX chrome
      '"Segoe UI"', //Windows
      'Roboto', //Android
      '"Helvetica Neue"', //old iOS
      'Ubuntu', // Ubuntu
      'Oxygen', // linux: GNOME
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 600,
    h2: {
      fontSize: '4rem',
      lineHeight: 1.25,
      fontWeight: 400,
    },
    h3: {
      fontSize: '3rem',
      lineHeight: 1.25,
      fontWeight: 400,
    },
    h4: {
      fontSize: '2.25rem',
      lineHeight: 1.375,
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.5rem',
      lineHeight: 1.375,
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.25rem',
      lineHeight: 1.5,
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: '.875rem',
      lineHeight: 1.625,
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: {
      fontSize: '.75rem',
      lineHeight: 1.625,
      fontWeight: 400,
    },
  },
  shadows: [
    'none',
    '0px 10px 20px rgba(205, 191, 208, 0.25)',
    '0px 10px 20px rgba(205, 191, 208, 0.25)',
    '0px 10px 20px rgba(205, 191, 208, 0.25)',
    '0px 10px 20px rgba(205, 191, 208, 0.25)',
    '0px 10px 20px rgba(205, 191, 208, 0.25)',
    '0px 10px 20px rgba(205, 191, 208, 0.25)',
    '0px 10px 20px rgba(205, 191, 208, 0.25)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
    '0px 16px 20px rgba(85, 0, 255, 0.15)',
  ],
  overrides: {
    MuiTableCell: {
      head: {
        color: secondary[600],
      },
      root: {
        padding: 18,
      },
      sizeSmall: {
        padding: 12,
        '&$head': {
          padding: 16,
        },
      },
    },
    MuiTableSortLabel: {
      root: {
        '&$active': {
          '&& $icon': {
            color: 'inherit',
          },
        },
      },
      icon: {
        fontSize: '.875rem',
        marginLeft: 12,
        marginRight: 12,
      },
    },
    MuiBadge: {
      dot: {
        border: `3px solid ${white}`,
        height: 18,
        width: 18,
        borderRadius: '50%',
      },
    },
    MuiButton: {
      contained: {
        height: 40,
        borderRadius: 88,
      },
      containedSizeLarge: {
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 80,
      },
      outlinedSizeLarge: {
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 80,
      },
      outlined: {
        height: 40,
        borderRadius: 88,
      },
      text: {
        height: 40,
        borderRadius: 88,
        paddingLeft: 16,
        paddingRight: 16,
      },
    },
    MuiCheckbox: {
      root: {
        color: secondary[500],
      },
    },
    MuiChip: {
      root: {
        backgroundColor: secondary[400],
        color: secondary[700],
        fontWeight: 600,
        height: 32,
        paddingLeft: 8,
        paddingRight: 8,
      },
      icon: {
        marginLeft: 0,
        marginRight: 0,
      },
      label: {
        paddingLeft: 8,
        paddingRight: 8,
      },
      deleteIcon: {
        height: 8,
      },
      sizeSmall: {
        paddingLeft: 4,
        paddingRight: 4,
      },
    },
    MuiLink: {
      root: { cursor: 'pointer' },
    },
    MuiListSubheader: {
      root: {
        color: secondary[600],
        fontSize: '.75rem',
      },
    },
    MuiAlert: {
      root: {
        paddingRight: 20,
        paddingLeft: 20,
      },
      icon: {
        marginRight: 20,
        alignSelf: 'center',
      },
      standardSuccess: {
        borderTop: `4px solid ${success[600]}`,
        borderRadius: 0,
        color: success[700],
        '& $icon': {
          color: success[700],
        },
      },
      standardInfo: {
        borderTop: `4px solid ${cyan[600]}`,
        borderRadius: 0,
        color: cyan[700],
        '& $icon': {
          color: cyan[700],
        },
      },
      standardWarning: {
        borderTop: `4px solid ${amber[600]}`,
        borderRadius: 0,
        color: amber[700],
        '& $icon': {
          color: amber[700],
        },
      },
      standardError: {
        borderTop: `4px solid ${error[600]}`,
        borderRadius: 0,
        color: error[700],
        '& $icon': {
          color: error[700],
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 4,
        borderWidth: 1,
        padding: 0,
      },
      input: {
        padding: 8,
      },
    },
    MuiMenuItem: {
      root: {
        '&:hover': {
          backgroundColor: primary[100],
        },
      },
    },
    MuiTab: {
      root: {
        paddingLeft: 40,
        paddingRight: 40,
      },
    },
  },
  props: {
    MuiChip: {
      deleteIcon: <Cross width={8} height={8} color={secondary[600]}></Cross>,
    },
    MuiLink: {
      underline: 'none',
    },
    MuiCheckbox: {
      icon: <CheckboxBlank width={16} height={16} />,
      checkedIcon: <Checkbox width={16} height={16} />,
      indeterminateIcon: <CheckboxIndeterminate width={16} height={16} />,
    },
  },
})

export type ColorOptions = ExtractKeyOfType<Palette, PaletteColor>
export default theme
