import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiEdit2, FiTrash2, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { RecurringRevenueModal } from '../RecurringRevenueModal';

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
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderTop = styled.div`
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
  min-width: 150px;

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  padding: 1.25rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const StatValue = styled.div<{ $color?: string }>`
  color: ${props => props.$color || props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
`;

const RevenuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const RevenueCard = styled.div<{ $status: string }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-left: 4px solid ${props => {
    if (props.$status === 'received') return '#10b981';
    if (props.$status === 'skipped') return '#6b7280';
    return '#f59e0b';
  }};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.2s ease;
  box-shadow: ${props => props.theme.shadows.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const RevenueHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const RevenueInfo = styled.div`
  flex: 1;
`;

const RevenueDescription = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.3px;
`;

const RevenueMeta = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-weight: 500;
`;

const RevenueAmount = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 700;
  font-size: 1.5rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.375rem 0.875rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    if (props.$status === 'received') return 'rgba(16, 185, 129, 0.2)';
    if (props.$status === 'skipped') return 'rgba(107, 114, 128, 0.2)';
    return 'rgba(245, 158, 11, 0.2)';
  }};
  color: ${props => {
    if (props.$status === 'received') return '#10b981';
    if (props.$status === 'skipped') return '#6b7280';
    return '#f59e0b';
  }};
  border: 1px solid ${props => {
    if (props.$status === 'received') return '#10b981';
    if (props.$status === 'skipped') return '#6b7280';
    return '#f59e0b';
  }};
`;

const RevenueActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' | 'success' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  ${props => {
    if (props.$variant === 'success') {
      return `
        background: #10b981;
        color: white;
        &:hover { background: #059669; }
      `;
    }
    if (props.$variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover { background: #dc2626; }
      `;
    }
    return `
      background: ${props.theme.colors.primary};
      color: ${props.theme.colors.text};
      &:hover { opacity: 0.9; }
    `;
  }}
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.125rem;
`;

type RecurringRevenue = {
  id: number;
  category_id: number;
  category_name: string;
  category_color: string;
  amount: number;
  description: string;
  notes?: string;
  due_day: number;
  is_active: number;
  current_status?: string;
};

type RecurringRevenuesViewProps = {
  onRefresh?: () => void;
};

export const RecurringRevenuesView: FC<RecurringRevenuesViewProps> = ({ onRefresh }) => {
  const { token } = useAuth();
  const [revenues, setRevenues] = useState<RecurringRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<RecurringRevenue | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchRevenues();
  }, [currentYear, currentMonth]);

  const fetchRevenues = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/api/financial/recurring-revenues/status/${currentYear}/${currentMonth}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.ok) {
        const data = await res.json();
        const revenuesWithStatus = data.revenues.map((rev: any) => ({
          ...rev,
          current_status: rev.currentStatus || rev.current_status || 'pending',
        }));
        setRevenues(revenuesWithStatus);
      }
    } catch (error) {
      console.error('Erro ao buscar receitas recorrentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReceived = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/financial/recurring-revenues/${id}/mark-received`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          year: currentYear,
          month: currentMonth,
        }),
      });

      if (res.ok) {
        setTimeout(() => {
          fetchRevenues();
          onRefresh?.();
        }, 100);
      }
    } catch (error) {
      console.error('Erro ao marcar como recebida:', error);
    }
  };

  const handleSkip = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/financial/recurring-revenues/${id}/skip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          year: currentYear,
          month: currentMonth,
        }),
      });

      if (res.ok) {
        setTimeout(() => {
          fetchRevenues();
        }, 100);
      }
    } catch (error) {
      console.error('Erro ao pular receita:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta receita recorrente?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/financial/recurring-revenues/${id}`, {
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
      console.error('Erro ao deletar receita recorrente:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusLabel = (status: string) => {
    if (status === 'received') return 'Recebida';
    if (status === 'skipped') return 'Pulada';
    return 'Pendente';
  };

  const totalAmount = revenues.reduce((sum, rev) => sum + rev.amount, 0);
  const receivedAmount = revenues
    .filter(rev => rev.current_status === 'received')
    .reduce((sum, rev) => sum + rev.amount, 0);
  const pendingAmount = revenues
    .filter(rev => rev.current_status !== 'received' && rev.current_status !== 'skipped')
    .reduce((sum, rev) => sum + rev.amount, 0);

  if (loading) {
    return <Container><EmptyState>Carregando...</EmptyState></Container>;
  }

  return (
    <Container>
      <HeaderCard>
        <HeaderTop>
          <Title>Receitas Recorrentes</Title>
          <HeaderControls>
            <Select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </Select>
            <Select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            <AddButton onClick={() => setModalOpen(true)}>
              <FiPlus />
              Adicionar Receita Recorrente
            </AddButton>
          </HeaderControls>
        </HeaderTop>
        {revenues.length > 0 && (
          <StatsGrid>
            <StatCard>
              <StatLabel>Total</StatLabel>
              <StatValue>{formatCurrency(totalAmount)}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Recebidas</StatLabel>
              <StatValue $color="#10b981">{formatCurrency(receivedAmount)}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>A Receber</StatLabel>
              <StatValue $color="#f59e0b">{formatCurrency(pendingAmount)}</StatValue>
            </StatCard>
          </StatsGrid>
        )}
      </HeaderCard>

      {revenues.length === 0 ? (
        <EmptyState>Nenhuma receita recorrente cadastrada</EmptyState>
      ) : (
        <RevenuesGrid>
          {revenues.map((revenue) => (
            <RevenueCard key={revenue.id} $status={revenue.current_status || 'pending'}>
              <RevenueHeader>
                <RevenueInfo>
                  <RevenueDescription>{revenue.description}</RevenueDescription>
                  <RevenueMeta>
                    <span>{revenue.category_name}</span>
                    <span>Recebimento: dia {revenue.due_day}</span>
                  </RevenueMeta>
                </RevenueInfo>
                <StatusBadge $status={revenue.current_status || 'pending'}>
                  {getStatusLabel(revenue.current_status || 'pending')}
                </StatusBadge>
              </RevenueHeader>
              <RevenueAmount>{formatCurrency(revenue.amount)}</RevenueAmount>
              <RevenueActions>
                {revenue.current_status !== 'received' && revenue.current_status !== 'skipped' && (
                  <>
                    <ActionButton $variant="success" onClick={() => handleMarkReceived(revenue.id)}>
                      <FiCheck /> Marcar como Recebida
                    </ActionButton>
                    <ActionButton onClick={() => handleSkip(revenue.id)}>
                      <FiX /> Pular
                    </ActionButton>
                  </>
                )}
                <ActionButton onClick={() => {
                  setEditingRevenue(revenue);
                  setModalOpen(true);
                }}>
                  <FiEdit2 /> Editar
                </ActionButton>
                <ActionButton $variant="danger" onClick={() => handleDelete(revenue.id)}>
                  <FiTrash2 /> Excluir
                </ActionButton>
              </RevenueActions>
            </RevenueCard>
          ))}
        </RevenuesGrid>
      )}

      <RecurringRevenueModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRevenue(null);
        }}
        revenue={editingRevenue ? {
          id: editingRevenue.id,
          category_id: editingRevenue.category_id,
          amount: editingRevenue.amount,
          description: editingRevenue.description,
          notes: editingRevenue.notes || '',
          due_day: editingRevenue.due_day,
          is_active: editingRevenue.is_active === 1,
        } : undefined}
        onSave={() => {
          fetchRevenues();
          onRefresh?.();
        }}
      />
    </Container>
  );
};
