import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiEdit2, FiTrash2, FiPlus, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';

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

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const CreditCardItem = styled.div<{ $color: string }>`
  background: linear-gradient(135deg, ${props => props.$color} 0%, ${props => {
    // Criar cor mais escura para o gradiente
    const hex = props.$color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const darkerR = Math.max(0, r - 30);
    const darkerG = Math.max(0, g - 30);
    const darkerB = Math.max(0, b - 30);
    return `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
  }} 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 1;
`;

const CardName = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CardNumber = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 1;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DueDateLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DueDate = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
`;

const InvoiceAmount = styled.div`
  text-align: right;
`;

const InvoiceLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
`;

const InvoiceValue = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.125rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(Card)`
  width: 90%;
  max-width: 500px;
  position: relative;
  z-index: 1001;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ColorInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 0;
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    if (props.$variant === 'secondary') {
      return `
        background: ${props.theme.colors.surface};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.hover};
        }
      `;
    }
    return `
      background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%);
      color: ${props.theme.colors.text};
      box-shadow: ${props.theme.shadows.sm};
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${props.theme.shadows.md};
      }
    `;
  }}
`;

type CreditCard = {
  id: number;
  name: string;
  last_four_digits: string;
  due_day: number;
  color: string;
  is_active: number;
  current_invoice?: number;
  dueDate?: string;
};

type CreditCardsViewProps = {
  onRefresh?: () => void;
};

export const CreditCardsView: FC<CreditCardsViewProps> = ({ onRefresh }) => {
  const { token } = useAuth();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    last_four_digits: '',
    due_day: 1,
    color: '#3B82F6',
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/financial/credit-cards', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (error) {
      console.error('Erro ao buscar cartões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (card?: CreditCard) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        name: card.name,
        last_four_digits: card.last_four_digits,
        due_day: card.due_day,
        color: card.color || '#3B82F6',
      });
    } else {
      setEditingCard(null);
      setFormData({
        name: '',
        last_four_digits: '',
        due_day: 1,
        color: '#3B82F6',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCard(null);
    setFormData({
      name: '',
      last_four_digits: '',
      due_day: 1,
      color: '#3B82F6',
    });
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      const url = editingCard
        ? `http://localhost:4000/api/financial/credit-cards/${editingCard.id}`
        : 'http://localhost:4000/api/financial/credit-cards';
      
      const method = editingCard ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchCards();
        handleCloseModal();
        onRefresh?.();
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao salvar cartão');
      }
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      alert('Erro ao salvar cartão');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cartão?')) return;
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:4000/api/financial/credit-cards/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchCards();
        onRefresh?.();
      }
    } catch (error) {
      console.error('Erro ao deletar cartão:', error);
      alert('Erro ao deletar cartão');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatCardNumber = (lastFour: string) => {
    return `**** **** **** ${lastFour}`;
  };

  if (loading) {
    return <Container><EmptyState>Carregando...</EmptyState></Container>;
  }

  return (
    <Container>
      <HeaderCard>
        <Title>Cartões de Crédito</Title>
        <AddButton onClick={() => handleOpenModal()}>
          <FiPlus />
          Adicionar Cartão
        </AddButton>
      </HeaderCard>

      {cards.length === 0 ? (
        <EmptyState>Nenhum cartão cadastrado</EmptyState>
      ) : (
        <CardsGrid>
          {cards.map((card) => (
            <CreditCardItem key={card.id} $color={card.color || '#3B82F6'}>
              <CardHeader>
                <div>
                  <CardName>{card.name}</CardName>
                  <CardNumber>{formatCardNumber(card.last_four_digits)}</CardNumber>
                </div>
                <CardActions>
                  <ActionButton onClick={() => handleOpenModal(card)} title="Editar">
                    <FiEdit2 />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(card.id)} title="Excluir">
                    <FiTrash2 />
                  </ActionButton>
                </CardActions>
              </CardHeader>
              <CardFooter>
                <CardInfo>
                  <DueDateLabel>
                    <FiCreditCard size={12} />
                    Vencimento
                  </DueDateLabel>
                  <DueDate>Dia {card.due_day}</DueDate>
                </CardInfo>
                <InvoiceAmount>
                  <InvoiceLabel>Fatura do Mês</InvoiceLabel>
                  <InvoiceValue>{formatCurrency(card.current_invoice || 0)}</InvoiceValue>
                </InvoiceAmount>
              </CardFooter>
            </CreditCardItem>
          ))}
        </CardsGrid>
      )}

      {modalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingCard ? 'Editar Cartão' : 'Novo Cartão'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>Nome do Cartão</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Nubank, Inter, Itaú..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Últimos 4 dígitos</Label>
              <Input
                type="text"
                value={formData.last_four_digits}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setFormData({ ...formData, last_four_digits: value });
                }}
                placeholder="1234"
                maxLength={4}
              />
            </FormGroup>

            <FormGroup>
              <Label>Dia de Vencimento</Label>
              <Select
                value={formData.due_day}
                onChange={(e) => setFormData({ ...formData, due_day: parseInt(e.target.value) })}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    Dia {day}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Cor do Cartão</Label>
              <ColorInput
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </FormGroup>

            <ButtonGroup>
              <Button $variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingCard ? 'Salvar' : 'Adicionar'}
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

