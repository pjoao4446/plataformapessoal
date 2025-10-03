// ARQUIVO 1: src/styles/theme.ts (ATUALIZADO)
// Adicionamos novas cores (accentCyan, accentMagenta) e uma seção de gradientes.

const theme = {
  colors: {
    primary: '#4F46E5',
    secondary: '#3730A3',
    background: '#131B2E',
    surface: '#1E293B',
    text: '#E2E8F0',
    textSecondary: '#94A3B8',
    accentCyan: '#00FFFF',
    accentMagenta: '#D946EF',

    /* --- ADIÇÕES AQUI --- */
    surfaceDark: '#151F32', // Um tom um pouco mais escuro que 'surface'
    secondaryLight: '#5C54D1', // Um tom um pouco mais claro de 'secondary' para o hover
  },
  fonts: {
    main: 'Inter, sans-serif',
  },
  gradients: {
    primary: 'linear-gradient(90deg, #D946EF 0%, #00FFFF 100%)',
  }
};

export default theme;