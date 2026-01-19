// Tema para styled-components
// Compatível com os componentes FinancialManagement que usam styled-components

import { getTheme } from './theme';
import type { ThemeMode } from './theme';

export const getStyledTheme = (mode: ThemeMode = 'dark') => {
  const theme = getTheme(mode);
  
  return {
    colors: {
      ...theme.colors,
      // Propriedades adicionais que os componentes styled-components esperam
      cardBackground: theme.colors.surface,
      primary: theme.colors.neon.purple,
      secondary: theme.colors.neon.cyan,
      hover: mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.05)',
      accentCyan: theme.colors.neon.cyan,
      success: theme.colors.status.success,
      error: theme.colors.status.error,
      warning: theme.colors.status.warning,
      info: theme.colors.status.info,
    },
    shadows: {
      sm: mode === 'dark'
        ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)'
        : '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
      md: mode === 'dark'
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: mode === 'dark'
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    fonts: theme.fonts,
  };
};

export default getStyledTheme('dark');


