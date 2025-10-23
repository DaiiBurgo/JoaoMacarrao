/**
 * Tema João Macarrão - Fase 8
 * Paleta de Cores Oficial baseada no Logo e nos Pratos
 * 
 * Conceito: "Sabor artesanal do litoral — tecnologia que dá água na boca."
 */

export const theme = {
  colors: {
    // Paleta Principal
    primary: {
      main: '#FFC300',        // 🟡 Amarelo Massa - Representa a massa fresca artesanal
      light: '#FFD54F',
      dark: '#FFA000',
      contrastText: '#1A1A1D',
    },
    secondary: {
      main: '#E63946',        // 🔴 Vermelho Molho - Energia e apetite
      light: '#F26670',
      dark: '#C62828',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#1A1A1D',     // ⚫ Antracite Marinho - Fundo sofisticado
      paper: '#FFF5E4',       // 🤍 Creme Claro - Equilíbrio visual
      light: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1D',     // Texto principal
      secondary: '#004E7C',   // 🌊 Azul Profundo - Representa o mar
      light: '#666666',
      white: '#FFFFFF',
    },
    // Cores de Suporte
    support: {
      coral: '#FF6B35',       // 🟠 Coral Quente - Frutos do mar
      ocean: '#004E7C',       // 🌊 Azul Profundo - Mar e frescor
      cream: '#FFF5E4',       // 🤍 Creme Claro - Aconchego
    },
    accent: {
      green: '#6A994E',       // 🌿 Verde Salsa - Detalhes naturais
      greenDark: '#4A7C30',
    },
    // Status e Estados
    success: '#6A994E',
    error: '#E63946',
    warning: '#FF6B35',
    info: '#004E7C',
    // Neutros
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    // WhatsApp
    whatsapp: {
      main: '#25D366',
      dark: '#128C7E',
    },
  },
  
  typography: {
    fontFamily: {
      primary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      heading: "'Baloo 2', 'Fredoka One', cursive, sans-serif",
      accent: "'Playfair Display', serif",
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    // Sombras coloridas para destaque
    glow: '0 0 20px rgba(255, 195, 0, 0.3)',
    glowRed: '0 0 20px rgba(230, 57, 70, 0.3)',
  },

  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
    verySlow: '500ms ease-in-out',
  },

  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type Theme = typeof theme;

// CSS Variables para uso em CSS puro
export const cssVars = `
:root {
  /* Colors */
  --color-primary: ${theme.colors.primary.main};
  --color-primary-light: ${theme.colors.primary.light};
  --color-primary-dark: ${theme.colors.primary.dark};
  
  --color-secondary: ${theme.colors.secondary.main};
  --color-secondary-light: ${theme.colors.secondary.light};
  --color-secondary-dark: ${theme.colors.secondary.dark};
  
  --color-bg-default: ${theme.colors.background.default};
  --color-bg-paper: ${theme.colors.background.paper};
  --color-bg-light: ${theme.colors.background.light};
  
  --color-text-primary: ${theme.colors.text.primary};
  --color-text-secondary: ${theme.colors.text.secondary};
  --color-text-light: ${theme.colors.text.light};
  --color-text-white: ${theme.colors.text.white};
  
  --color-coral: ${theme.colors.support.coral};
  --color-ocean: ${theme.colors.support.ocean};
  --color-cream: ${theme.colors.support.cream};
  --color-green: ${theme.colors.accent.green};
  
  --color-whatsapp: ${theme.colors.whatsapp.main};
  --color-whatsapp-dark: ${theme.colors.whatsapp.dark};
  
  /* Typography */
  --font-primary: ${theme.typography.fontFamily.primary};
  --font-heading: ${theme.typography.fontFamily.heading};
  --font-accent: ${theme.typography.fontFamily.accent};
  
  /* Spacing */
  --spacing-xs: ${theme.spacing.xs};
  --spacing-sm: ${theme.spacing.sm};
  --spacing-md: ${theme.spacing.md};
  --spacing-lg: ${theme.spacing.lg};
  --spacing-xl: ${theme.spacing.xl};
  
  /* Border Radius */
  --radius-sm: ${theme.borderRadius.sm};
  --radius-md: ${theme.borderRadius.md};
  --radius-lg: ${theme.borderRadius.lg};
  --radius-xl: ${theme.borderRadius.xl};
  
  /* Shadows */
  --shadow-base: ${theme.shadows.base};
  --shadow-md: ${theme.shadows.md};
  --shadow-lg: ${theme.shadows.lg};
  --shadow-glow: ${theme.shadows.glow};
  
  /* Transitions */
  --transition-fast: ${theme.transitions.fast};
  --transition-base: ${theme.transitions.base};
  --transition-slow: ${theme.transitions.slow};
}
`;

export default theme;

