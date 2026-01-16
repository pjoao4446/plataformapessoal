// ARQUIVO: src/styles/theme.ts
// Suporta dark e light mode com cores atualizadas

export type ThemeMode = 'dark' | 'light';

// Cores do Tema Dark
const darkTheme = {
  colors: {
    // Backgrounds
    sidebar: '#000000',           // Menu lateral PRETO
    background: '#1F2937',        // Fundo da página CINZA ESCURO
    surface: '#151725',           // Cards/Containers
    elevated: '#1E2139',          // Elementos elevados
    
    // Bordas
    border: 'rgba(255, 255, 255, 0.05)',
    borderStrong: 'rgba(255, 255, 255, 0.1)',
    
    // Texto
    text: '#E2E8F0',              // Texto principal
    textSecondary: '#94A3B8',     // Texto secundário
    textMuted: '#64748B',         // Texto desbotado
    
    // Cores de Acento Neon
    neon: {
      purple: '#A855F7',
      cyan: '#00FFFF',
      orange: '#FF6B35',
      emerald: '#10B981',
      pink: '#EC4899',
      blue: '#3B82F6',
    },
    
    // Status
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  fonts: {
    main: 'Inter, sans-serif',
  },
};

// Cores do Tema Light
const lightTheme = {
  colors: {
    // Backgrounds
    sidebar: '#FFFFFF',           // Menu lateral BRANCO
    background: '#F3F4F6',        // Fundo da página CINZA CLARO
    surface: '#FFFFFF',           // Cards/Containers
    elevated: '#F9FAFB',          // Elementos elevados
    
    // Bordas
    border: 'rgba(0, 0, 0, 0.1)',
    borderStrong: 'rgba(0, 0, 0, 0.2)',
    
    // Texto
    text: '#1F2937',              // Texto principal
    textSecondary: '#4B5563',     // Texto secundário
    textMuted: '#6B7280',         // Texto desbotado
    
    // Cores de Acento (mais suaves no light mode)
    neon: {
      purple: '#9333EA',
      cyan: '#06B6D4',
      orange: '#EA580C',
      emerald: '#059669',
      pink: '#DB2777',
      blue: '#2563EB',
    },
    
    // Status
    status: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB',
    },
  },
  fonts: {
    main: 'Inter, sans-serif',
  },
};

export const getTheme = (mode: ThemeMode = 'dark') => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

// Tema padrão (dark)
const theme = darkTheme;

export default theme;
