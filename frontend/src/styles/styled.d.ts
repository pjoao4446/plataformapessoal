// src/styles/styled.d.ts

import 'styled-components';
import { getStyledTheme } from './styled-theme';

type Theme = ReturnType<typeof getStyledTheme>;

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}