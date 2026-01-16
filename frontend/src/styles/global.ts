// src/styles/global.ts

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* CSS Reset Básico - Mínimo para não conflitar com Tailwind */
  * {
    box-sizing: border-box;
  }
  
  /* Remover qualquer espaço no topo */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
  }
  
  #root {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
  }

  /* Links */
  a {
    text-decoration: none;
  }
`;

export default GlobalStyle;
