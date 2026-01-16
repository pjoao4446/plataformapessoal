import { FC } from 'react';
import styled from 'styled-components';
import { FiHome, FiDollarSign, FiTrendingUp, FiTag, FiPlus, FiRepeat, FiCreditCard, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme as useThemeContext } from '../../../context/ThemeContext';

const SidebarContainer = styled.aside`
  width: 100%;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.shadows.md};
  margin-top: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 0 1.5rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 1.5rem;
`;

const SidebarTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
`;

const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0;
`;

const MenuItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: none;
  background: ${props => props.$active 
    ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)` 
    : 'transparent'};
  color: ${props => props.$active 
    ? props.theme.colors.text 
    : props.theme.colors.textSecondary};
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: ${props => props.theme.colors.primary};
    transform: ${props => props.$active ? 'scaleY(1)' : 'scaleY(0)'};
    transition: transform 0.25s ease;
  }

  &:hover {
    background: ${props => props.$active 
      ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)` 
      : props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
    transform: translateX(4px);
  }

  svg {
    font-size: 1.375rem;
    min-width: 1.375rem;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const CTAButton = styled.button`
  margin: 1rem 0 0 0;
  padding: 1.125rem 1.5rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.theme.shadows.md};
  position: relative;
  overflow: hidden;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover::before {
    width: 300px;
    height: 300px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1.375rem;
    position: relative;
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 1;
  }
`;

const ThemeToggle = styled.button`
  margin: 0.75rem 0 0 0;
  padding: 1rem 1.25rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  font-weight: 500;
  width: 100%;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }

  svg {
    font-size: 1.25rem;
  }
`;

type ViewType = 'dashboard' | 'expenses' | 'revenues' | 'categories' | 'recurring' | 'recurring-revenues' | 'credit-cards';

type FinancialSidebarProps = {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onNewTransaction: () => void;
};

export const FinancialSidebar: FC<FinancialSidebarProps> = ({
  activeView,
  onViewChange,
  onNewTransaction,
}) => {
  const { theme: themeMode, toggleTheme } = useThemeContext();

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>Gestão Financeira</SidebarTitle>
      </SidebarHeader>
      <MenuList>
        <MenuItem
          $active={activeView === 'dashboard'}
          onClick={() => onViewChange('dashboard')}
        >
          <FiHome />
          Dashboard
        </MenuItem>
        <MenuItem
          $active={activeView === 'expenses'}
          onClick={() => onViewChange('expenses')}
        >
          <FiDollarSign />
          Despesas
        </MenuItem>
        <MenuItem
          $active={activeView === 'revenues'}
          onClick={() => onViewChange('revenues')}
        >
          <FiTrendingUp />
          Receitas
        </MenuItem>
        <MenuItem
          $active={activeView === 'categories'}
          onClick={() => onViewChange('categories')}
        >
          <FiTag />
          Categorias
        </MenuItem>
        <MenuItem
          $active={activeView === 'credit-cards'}
          onClick={() => onViewChange('credit-cards')}
        >
          <FiCreditCard />
          Cartões de Crédito
        </MenuItem>
        <MenuItem
          $active={activeView === 'recurring'}
          onClick={() => onViewChange('recurring')}
        >
          <FiRepeat />
          Despesas Recorrentes
        </MenuItem>
        <MenuItem
          $active={activeView === 'recurring-revenues'}
          onClick={() => onViewChange('recurring-revenues')}
        >
          <FiTrendingUp />
          Receitas Recorrentes
        </MenuItem>
      </MenuList>
      <CTAButton onClick={onNewTransaction}>
        <FiPlus />
        <span>Nova Transação</span>
      </CTAButton>
      <ThemeToggle onClick={toggleTheme}>
        {themeMode === 'dark' ? <FiSun /> : <FiMoon />}
        <span>{themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </ThemeToggle>
    </SidebarContainer>
  );
};

