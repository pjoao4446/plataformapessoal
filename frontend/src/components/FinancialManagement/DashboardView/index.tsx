import { FC, useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { DashboardHeader } from '../DashboardHeader';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

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
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar transações do Supabase
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, selectedMonth, selectedYear]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
      const lastDay = new Date(selectedYear, selectedMonth, 0);
      
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', firstDay.toISOString().split('T')[0])
        .lte('date', lastDay.toISOString().split('T')[0])
        .order('date', { ascending: false });

      setTransactions(data || []);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar transações do mês selecionado
  const filteredTransactions = useMemo(() => {
    return transactions;
  }, [transactions]);

  const balance = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => {
      if (t.type === 'income') return sum + Math.abs(t.amount || 0);
      if (t.type === 'expense') return sum - Math.abs(t.amount || 0);
      return sum;
    }, 0);
  }, [filteredTransactions]);
  
  const incomeTotal = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
  }, [filteredTransactions]);
  
  const expenseTotal = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
  }, [filteredTransactions]);

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
