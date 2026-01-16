import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { RevenueModal } from '../RevenueModal';

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

type Revenue = {
  id: number;
  category_name: string;
  amount: number;
  description: string;
  transaction_date: string;
};

type RevenuesViewProps = {
  onRefresh?: () => void;
};

export const RevenuesView: FC<RevenuesViewProps> = ({ onRefresh }) => {
  const { token } = useAuth();
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
  const [periodFilter, setPeriodFilter] = useState('30days');

  useEffect(() => {
    fetchRevenues();
  }, [periodFilter]);

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

  const fetchRevenues = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();
      const params = new URLSearchParams({ startDate, endDate });

      const res = await fetch(`http://localhost:4000/api/financial/revenues?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setRevenues(data);
      }
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta receita?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/financial/revenues/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchRevenues();
        onRefresh?.();
      }
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
    }
  };

  const handleEdit = (revenue: Revenue) => {
    setEditingRevenue(revenue);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingRevenue(null);
  };

  const handleSave = () => {
    fetchRevenues();
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
        <Title>Minhas Receitas</Title>
        <HeaderControls>
          <Select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
            <option value="thisMonth">Este mês</option>
            <option value="lastMonth">Mês passado</option>
          </Select>
          <AddButton onClick={() => setModalOpen(true)}>
            <FiPlus />
            Adicionar Nova Receita
          </AddButton>
        </HeaderControls>
      </HeaderCard>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : revenues.length === 0 ? (
        <EmptyState>Nenhuma receita encontrada</EmptyState>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Data</TableHeaderCell>
                <TableHeaderCell>Descrição</TableHeaderCell>
                <TableHeaderCell>Categoria</TableHeaderCell>
                <TableHeaderCell>Valor</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {revenues.map((revenue) => (
                <TableRow key={revenue.id}>
                  <TableCell>{formatDate(revenue.transaction_date)}</TableCell>
                  <TableCell style={{ fontWeight: 500 }}>{revenue.description}</TableCell>
                  <TableCell>{revenue.category_name}</TableCell>
                  <TableCell style={{ fontWeight: 600, color: '#10b981' }}>{formatCurrency(revenue.amount)}</TableCell>
                  <ActionsCell>
                    <ActionButton onClick={() => handleEdit(revenue)} title="Editar">
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(revenue.id)} title="Excluir">
                      <FiTrash2 />
                    </ActionButton>
                  </ActionsCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      <RevenueModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        revenue={editingRevenue}
        onSave={handleSave}
      />
    </Container>
  );
};
