import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { AppRoutes } from './routes';
import GlobalStyle from './styles/global';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import { getStyledTheme } from './styles/styled-theme';
import { useMemo } from 'react';

function AppContent() {
  const { theme } = useTheme();
  const styledTheme = useMemo(() => getStyledTheme(theme), [theme]);

  return (
    <StyledThemeProvider theme={styledTheme}>
      <AuthProvider>
        <GlobalStyle />
        <AppRoutes />
      </AuthProvider>
    </StyledThemeProvider>
  );
}

function App() {
  return (
    // Este é o ÚNICO BrowserRouter da aplicação
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;