import { FC, useState } from 'react';
import styled from 'styled-components';
import { FiCalendar } from 'react-icons/fi';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { CreateTransactionModal } from '../../modals/CreateTransactionModal';
import { Button } from '../../ui/Button';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  margin-bottom: 0;
  margin-top: 0;
  box-shadow: ${props => props.theme.shadows.md};
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-left: 0;
  margin-right: 0;
`;

const WelcomeText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  letter-spacing: 0.3px;
`;

const MonthSelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Select = styled.select`
  padding: 0.875rem 1.25rem;
  padding-right: 3rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%2394A3B8' d='M8 11L3 6h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  min-width: 120px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.hover};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  option {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    padding: 0.75rem;
  }
`;

const CalendarIcon = styled(FiCalendar)`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.25rem;
`;

type DashboardHeaderProps = {
  selectedMonth?: number;
  selectedYear?: number;
  onMonthChange?: (month: number, year: number) => void;
};

export const DashboardHeader: FC<DashboardHeaderProps> = ({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange 
}) => {
  const { user } = useAuth();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  
  const currentDate = new Date();
  const month = selectedMonth ?? currentDate.getMonth() + 1;
  const year = selectedYear ?? currentDate.getFullYear();

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number(e.target.value);
    onMonthChange?.(newMonth, year);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = Number(e.target.value);
    onMonthChange?.(month, newYear);
  };

  // Gerar opções de anos (últimos 5 anos)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      const yearValue = currentYear - i;
      years.push(
        <option key={yearValue} value={yearValue}>
          {yearValue}
        </option>
      );
    }
    return years;
  };

  return (
    <>
      <HeaderContainer>
        <WelcomeText>
          Bem vindo a sua vida financeira {user?.name || 'Usuário'}
        </WelcomeText>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <MonthSelectorWrapper>
            <CalendarIcon />
            <Select
              value={month}
              onChange={handleMonthChange}
            >
              {months.map((monthName, index) => (
                <option key={index + 1} value={index + 1}>
                  {monthName}
                </option>
              ))}
            </Select>
            <Select
              value={year}
              onChange={handleYearChange}
            >
              {generateYearOptions()}
            </Select>
          </MonthSelectorWrapper>
          <Button
            variant="primary"
            onClick={() => setIsTransactionModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            Nova Transação
          </Button>
        </div>
      </HeaderContainer>

      <CreateTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSuccess={() => {
          setIsTransactionModalOpen(false);
          // Recarregar dados se necessário
          onMonthChange?.(month, year);
        }}
      />
    </>
  );
};

