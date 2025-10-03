// ARQUIVO 2: src/components/Input/styles.ts (ATUALIZADO)
// Modificado para suportar um ícone posicionado à esquerda.

import styled from 'styled-components';

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textSecondary};
    width: 20px;
    height: 20px;
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem; /* Aumentamos o padding esquerdo para o ícone */
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.textSecondary};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary};
  }
`;