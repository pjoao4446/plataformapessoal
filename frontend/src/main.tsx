// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// Importar Tailwind CSS PRIMEIRO para garantir que os estilos base sejam aplicados
import './styles/tailwind.css'; // Tailwind CSS - Design System Premium Dark
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);  