// ARQUIVO: src/components/Dropdown/styles.ts (VERSÃO FINAL E CORRIGIDA)

import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const DropdownWrapper = styled.div`
  position: relative;
  
  /* --- A CORREÇÃO ESTÁ AQUI --- */
  /* 1. Criamos a ponte e o espaço visual com padding */
  padding-bottom: 1rem;
  /* 2. Cancelamos o espaço extra para o cálculo de alinhamento do layout */
  margin-bottom: -1rem;
`;

export const DropdownButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

export const Submenu = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  min-height: 140px; 
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.primary};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  padding: 0.5rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const SubmenuItem = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
    white-space: normal; 
  overflow-wrap: break-word; 
  word-break: break-word;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text};
  }
`;

export const IconWrapper = styled.span<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;
  transform: rotate(${(props) => (props.$isOpen ? '180deg' : '0deg')});
`;