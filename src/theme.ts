import { Color, createTheme, PaletteColor } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    grey: Color;
  }
  interface PaletteOptions {
    grey: PaletteColor;
  }
}

const theme = createTheme({
  palette: {
    primary: { 
      main: '#FFADBE',
      light: '#FFADBE'
    },
    secondary: {
      main: '#B6C757'
    },
    warning: {
      main: '#f54848'
    },
    grey: {
      main: '#595758',
      light: '#595758',
      dark: '#595758',
      contrastText: '#595758'
    },

    text: {
      primary: '#343233',
    }
  },
})

export default theme