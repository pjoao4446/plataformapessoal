import { FC, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiCreditCard, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';

const CardContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const CardTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 0.3px;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
  padding: 1.25rem;
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

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
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const CardName = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const CardIcon = styled(FiCreditCard)`
  font-size: 1.5rem;
  opacity: 0.8;
`;

const CardNumber = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  letter-spacing: 2px;
  font-family: monospace;
  margin-bottom: 1rem;
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
  opacity: 0.8;
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
  opacity: 0.8;
  margin-bottom: 0.25rem;
`;

const InvoiceValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9375rem;
`;

type CreditCard = {
  id: number;
  name: string;
  last_four_digits: string;
  due_day: number;
  color?: string;
  current_invoice: number;
};

type CreditCardsCardProps = {
  selectedMonth?: number;
  selectedYear?: number;
};

export const CreditCardsCard: FC<CreditCardsCardProps> = ({ 
  selectedMonth, 
  selectedYear 
}) => {
  const { token } = useAuth();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCreditCards = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.append('month', selectedMonth.toString());
      if (selectedYear) params.append('year', selectedYear.toString());
      
      const url = `http://localhost:4000/api/financial/credit-cards${params.toString() ? `?${params}` : ''}`;
      const res = await fetch(url, {
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
  }, [selectedMonth, selectedYear, token]);

  useEffect(() => {
    fetchCreditCards();
  }, [fetchCreditCards]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatCardNumber = (lastFour: string) => {
    return `**** **** **** ${lastFour}`;
  };

  const getCurrentMonth = (month?: number) => {
    const date = month ? new Date(selectedYear || new Date().getFullYear(), month - 1) : new Date();
    return date.toLocaleDateString('pt-BR', { month: 'long' });
  };

  if (loading) {
    return (
      <CardContainer>
        <CardTitle>Active Cards</CardTitle>
        <EmptyState>Carregando...</EmptyState>
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <CardTitle>Active Cards</CardTitle>
      {cards.length === 0 ? (
        <EmptyState>Nenhum cartão cadastrado</EmptyState>
      ) : (
        <CardsGrid>
          {cards.map((card) => (
            <CreditCardItem key={card.id} $color={card.color || '#3B82F6'}>
              <CardHeader>
                <CardName>{card.name}</CardName>
                <CardIcon />
              </CardHeader>
              <CardNumber>{formatCardNumber(card.last_four_digits)}</CardNumber>
              <CardFooter>
                <CardInfo>
                  <DueDateLabel>
                    <FiCalendar size={12} />
                    Vencimento
                  </DueDateLabel>
                  <DueDate>Dia {card.due_day} - {getCurrentMonth(selectedMonth)}</DueDate>
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
    </CardContainer>
  );
};

