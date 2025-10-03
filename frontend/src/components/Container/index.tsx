import React from 'react';
import { StyledContainer } from './styles.ts';

// Definimos que o componente pode receber "filhos",
// que é qualquer conteúdo que colocarmos dentro dele.
interface ContainerProps {
  children: React.ReactNode;
}

export function Container({ children }: ContainerProps) {
  return <StyledContainer>{children}</StyledContainer>;
}