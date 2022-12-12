import { createTheme } from "@mui/material";

declare module '@mui/material/styles' {
  interface Palette {
    gray: Palette['primary'];
  }
  interface PaletteOptions {
    gray: PaletteOptions['primary'];
  }

  interface Palette {
    white: Palette['primary'];
  }
  interface PaletteOptions {
    white: PaletteOptions['primary'];
  }
}

let theme = createTheme({
  palette: {
    primary: { 
      main: '#eb8fa2',
      light: '#ed9aab'
    },
    secondary: {
      main: '#30c7cf',
      dark: '#2bb3ba',
    },
    warning: {
      main: '#f54848'
    },
    gray: {
      main: '#595758',
      light: '#595758',
      dark: '#474646',
      contrastText: '#595758'
    },
    white: {
      main: '#ffffff',
      dark: '#F8F8F8',
    },

    text: {
      primary: '#343233',
    }
  },

  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-contained': {
            color: '#e8dfe2',
            label: {
              color: '#e8dfe2',
            }
          },
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          'label, input, svg, p': {
            color: '#e8dfe2',
          },
          '.MuiInputBase-root::before': {
            borderColor: '#e8dfe2',
          },
          '.MuiInputBase-root:hover': {
            '&::before': {
              borderColor: '#d15871!important'
            }
          },
        }
      },
    }
  }
});

theme = createTheme(theme, {
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.palette.gray.dark,
        }
      }
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          // dark inputs 
          "&.subvariant-dark": {
            'input, svg, .MuiInputAdornment-root p': {
              color: theme.palette.gray.main,
            },
            'label:not(.Mui-focused, .Mui-error)': {
              color: theme.palette.gray.main,
            }
          }
        }
      }
    }
  },
});

export default theme