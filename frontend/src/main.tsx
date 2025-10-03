// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Agora este import vai funcionar corretamente
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);  