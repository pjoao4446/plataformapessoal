// ARQUIVO 3: src/components/Input/index.tsx (ATUALIZADO)
// Modificado para aceitar e renderizar um ícone.

import type { InputHTMLAttributes, ReactNode } from 'react';
import { StyledInput, InputWrapper } from './styles';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
};

export function Input({ icon, ...props }: InputProps) {
  return (
    <InputWrapper>
      {icon}
      <StyledInput {...props} />
    </InputWrapper>
  );
}