// src/styles/styled.d.ts

import 'styled-components';
import theme from './theme';

type Theme = typeof theme; // O correto é typeof da variável 'theme', com 't' minúsculo

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}