import React from 'react';
import { StyledButton } from './styles';

// Usamos a mesma técnica do 'type' para evitar o erro do ESLint
// e permitir que nosso botão receba todas as propriedades de um botão normal
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode; // Adicionamos 'children' para o texto do botão
};

export function Button({ children, ...props }: ButtonProps) {
  return <StyledButton {...props}>{children}</StyledButton>;
}