import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // SWITCH TO DARK MODE
    primary: {
      main: '#22d3ee', // Bright Cyan for contrast
      light: '#67e8f9',
      dark: '#0e7490',
      contrastText: '#000000',
    },
    secondary: {
      main: '#f1f5f9',
      dark: '#e2e8f0',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(15, 23, 42, 0.6)', // Glassy dark blue for cards
    },
    text: {
      primary: '#f8fafc', // White text
      secondary: '#94a3b8', // Light grey secondary
    },
    success: { main: '#10b981' },
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    info: { main: '#3b82f6' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' },
    h2: { fontSize: '1.75rem', fontWeight: 700, color: '#fff' },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    h4: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'transparent !important',
          backgroundImage: 'none !important',
        },
        '#root': {
          backgroundColor: 'transparent !important',
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.6)', // Dark Glass
          backdropFilter: 'blur(12px)', // Blurs what's behind the card
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.08)', // Subtle white border
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          backgroundImage: 'none', // Prevent MUI overlay
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        InputLabelProps: { shrink: false },
      },
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': { display: 'none' },
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(30, 41, 59, 0.5)', // Darker input bg
            borderRadius: 9999,
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
            '&:hover fieldset': { borderColor: '#22d3ee' },
            '&.Mui-focused fieldset': { borderColor: '#22d3ee', borderWidth: 1 },
            '& input': { color: 'white' } // Input text white
          },
        },
      },
    },
    // Fix Input styling generally
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 9999,
          '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
          '&:hover fieldset': { borderColor: '#22d3ee' },
          '&.Mui-focused fieldset': { borderColor: '#22d3ee' },
          '& input': { color: 'white' }
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 9999,
        },
        contained: {
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.3)', // Glowing buttons
        }
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit',
        }
      }
    }
  },
});

export default theme;
