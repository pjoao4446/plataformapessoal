import { FC, useState, useMemo } from 'react';
import styled from 'styled-components';
import { DashboardHeader } from '../DashboardHeader';
import { 
  MOCK_TRANSACTIONS, 
  calculateBalance, 
  getIncomeTotal, 
  getExpenseTotal 
} from '../../../mocks/database';

const Container = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 100%;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const CardLabel = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
`;

const CardValue = styled.h3<{ $positive?: boolean }>`
  color: ${props => props.$positive 
    ? props.theme.colors.success 
    : props.theme.colors.error};
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

export const DashboardView: FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Filtrar transações do mês selecionado
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() + 1 === selectedMonth && 
             transactionDate.getFullYear() === selectedYear;
    });
  }, [selectedMonth, selectedYear]);

  const balance = useMemo(() => calculateBalance(filteredTransactions), [filteredTransactions]);
  const incomeTotal = useMemo(() => getIncomeTotal(filteredTransactions), [filteredTransactions]);
  const expenseTotal = useMemo(() => getExpenseTotal(filteredTransactions), [filteredTransactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <Container>
      <DashboardHeader
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
      />

      <CardsGrid>
        <Card>
          <CardLabel>Saldo Atual</CardLabel>
          <CardValue $positive={balance >= 0}>
            {formatCurrency(balance)}
          </CardValue>
        </Card>

        <Card>
          <CardLabel>Total de Entradas</CardLabel>
          <CardValue $positive={true}>
            {formatCurrency(incomeTotal)}
          </CardValue>
        </Card>

        <Card>
          <CardLabel>Total de Saídas</CardLabel>
          <CardValue $positive={false}>
            {formatCurrency(expenseTotal)}
          </CardValue>
        </Card>
      </CardsGrid>
    </Container>
  );
};
