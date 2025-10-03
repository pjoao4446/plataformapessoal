// ARQUIVO 4: src/components/Button/styles.ts (ATUALIZADO)
// Modificado para usar o gradiente do nosso tema.

import styled from 'styled-components';

export const StyledButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-image: ${props => props.theme.gradients.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-transform: uppercase;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 15px rgba(217, 70, 239, 0.5);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: scale(1);
    box-shadow: none;
  }
`;