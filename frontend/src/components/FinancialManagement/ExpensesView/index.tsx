import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { ExpenseModal } from '../ExpenseModal';

const Container = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 100%;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const HeaderCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin: 0;
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.75rem 1.25rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.hover};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: ${props => props.theme.shadows.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableWrapper = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.surface};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.hover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.hover};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ActionsCell = styled(TableCell)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.125rem;
`;

type Expense = {
  id: number;
  category_name: string;
  amount: number;
  description: string;
  payment_method?: string;
  transaction_date: string;
};

type ExpensesViewProps = {
  onRefresh?: () => void;
};

export const ExpensesView: FC<ExpensesViewProps> = ({ onRefresh }) => {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [periodFilter, setPeriodFilter] = useState('30days');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, [periodFilter, categoryFilter]);

  const fetchCategories = async () => {
    if (!token) return;
    
    try {
      const res = await fetch('http://localhost:4000/api/financial/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const getDateRange = () => {
    const endDate = new Date().toISOString().split('T')[0];
    let startDate = new Date();
    
    if (periodFilter === '30days') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (periodFilter === '7days') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (periodFilter === 'thisMonth') {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    } else if (periodFilter === 'lastMonth') {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
      const lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0],
      };
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate,
    };
  };

  const fetchExpenses = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      
      if (categoryFilter !== 'all') {
        params.append('categoryId', categoryFilter);
      }

      const res = await fetch(`http://localhost:4000/api/financial/expenses?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/financial/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchExpenses();
        onRefresh?.();
      }
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  const handleSave = () => {
    fetchExpenses();
    onRefresh?.();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Container>
      <HeaderCard>
        <Title>Minhas Despesas</Title>
        <HeaderControls>
          <Select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
            <option value="thisMonth">Este mês</option>
            <option value="lastMonth">Mês passado</option>
          </Select>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">Todas as categorias</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
            ))}
          </Select>
          <AddButton onClick={() => setModalOpen(true)}>
            <FiPlus />
            Adicionar Nova Despesa
          </AddButton>
        </HeaderControls>
      </HeaderCard>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : expenses.length === 0 ? (
        <EmptyState>Nenhuma despesa encontrada</EmptyState>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Data</TableHeaderCell>
                <TableHeaderCell>Descrição</TableHeaderCell>
                <TableHeaderCell>Categoria</TableHeaderCell>
                <TableHeaderCell>Método de Pagamento</TableHeaderCell>
                <TableHeaderCell>Valor</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.transaction_date)}</TableCell>
                  <TableCell style={{ fontWeight: 500 }}>{expense.description}</TableCell>
                  <TableCell>{expense.category_name}</TableCell>
                  <TableCell>{expense.payment_method || '-'}</TableCell>
                  <TableCell style={{ fontWeight: 600, color: '#ef4444' }}>{formatCurrency(expense.amount)}</TableCell>
                  <ActionsCell>
                    <ActionButton onClick={() => handleEdit(expense)} title="Editar">
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(expense.id)} title="Excluir">
                      <FiTrash2 />
                    </ActionButton>
                  </ActionsCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      <ExpenseModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        expense={editingExpense}
        onSave={handleSave}
      />
    </Container>
  );
};
