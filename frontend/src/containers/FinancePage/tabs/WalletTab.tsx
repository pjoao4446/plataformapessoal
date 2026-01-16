import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  Plus,
  Edit,
  Trash2,
  Wallet,
  Building2,
  Landmark,
  Circle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { getTheme } from '../../../styles/theme';
import {
  MOCK_ACCOUNTS,
  MOCK_CARDS,
  type Account,
  type CreditCard,
} from '../../../mocks/database';
import { CreditCardVisual } from '../../../components/FinancialManagement/CreditCardVisual';

/**
 * WalletTab - Componente da aba Carteira
 * Gerencia Contas Bancárias e Cartões de Crédito
 */
interface WalletTabProps {
  cards: CreditCard[];
  setCards: React.Dispatch<React.SetStateAction<CreditCard[]>>;
}

export const WalletTab: FC<WalletTabProps> = ({ cards, setCards }) => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  
  // Estados locais para gerenciar contas
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  
  // Estados dos modais
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  
  // Estados do formulário de conta
  const [accountForm, setAccountForm] = useState({
    name: '',
    bank: 'nubank',
    type: 'checking' as 'checking' | 'investment' | 'cash',
    balance: 0,
    color: '#820AD1',
  });
  
  // Estados do formulário de cartão
  const [cardForm, setCardForm] = useState({
    name: '',
    bank: 'nubank',
    limit: 0,
    closingDay: 10,
    dueDay: 15,
    color: '#820AD1',
    brand: 'mastercard' as 'mastercard' | 'visa',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getBankLogo = (bank: string) => {
    const logos: Record<string, string> = {
      nubank: 'NU',
      inter: 'INTER',
      xp: 'XP',
      itau: 'ITAU',
      bradesco: 'BRADESCO',
      wallet: '💵',
    };
    return logos[bank] || bank.toUpperCase().substring(0, 2);
  };

  const getBankName = (bank: string) => {
    const names: Record<string, string> = {
      nubank: 'Nubank',
      inter: 'Inter',
      xp: 'XP Investimentos',
      itau: 'Itaú',
      bradesco: 'Bradesco',
      wallet: 'Carteira',
    };
    return names[bank] || bank;
  };

  // Gerar dados mockados para sparkline (últimos 7 dias)
  const generateSparklineData = (currentBalance: number) => {
    const days = 7;
    const data = [];
    const variation = currentBalance * 0.15; // Variação de até 15%
    
    for (let i = days - 1; i >= 0; i--) {
      const randomVariation = (Math.random() - 0.5) * 2 * variation;
      data.push(currentBalance + randomVariation);
    }
    
    return data;
  };

  // Componente Mini Sparkline
  const MiniSparkline: FC<{ data: number[]; isPositive: boolean }> = ({ data, isPositive }) => {
    if (data.length === 0) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 60;
    const height = 20;
    const padding = 2;
    
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
    
    const color = isPositive ? themeColors.neon.emerald : themeColors.status.error;
    
    return (
      <svg width={width} height={height} style={{ display: 'block' }}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.8}
        />
      </svg>
    );
  };

  const handleOpenAddAccount = () => {
    setAccountForm({
      name: '',
      bank: 'nubank',
      type: 'checking',
      balance: 0,
      color: '#820AD1',
    });
    setEditingAccount(null);
    setIsAddAccountOpen(true);
  };

  const handleOpenEditAccount = (account: Account) => {
    setAccountForm({
      name: account.name,
      bank: account.bank,
      type: account.type,
      balance: account.balance,
      color: account.color,
    });
    setEditingAccount(account);
    setIsAddAccountOpen(true);
  };

  const handleSaveAccount = () => {
    if (!accountForm.name.trim()) return;
    
    if (editingAccount) {
      // Editar conta existente
      setAccounts(accounts.map(acc =>
        acc.id === editingAccount.id
          ? { ...acc, ...accountForm }
          : acc
      ));
    } else {
      // Adicionar nova conta
      const newAccount: Account = {
        id: `acc${Date.now()}`,
        ...accountForm,
      };
      setAccounts([...accounts, newAccount]);
    }
    
    setIsAddAccountOpen(false);
    setEditingAccount(null);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      setAccounts(accounts.filter(acc => acc.id !== accountId));
    }
  };

  const handleOpenAddCard = () => {
    setCardForm({
      name: '',
      bank: 'nubank',
      limit: 0,
      closingDay: 10,
      dueDay: 15,
      color: '#820AD1',
      brand: 'mastercard',
    });
    setEditingCard(null);
    setIsAddCardOpen(true);
  };

  const handleOpenEditCard = (card: CreditCard) => {
    setCardForm({
      name: card.name,
      bank: card.bank,
      limit: card.limit,
      closingDay: card.closingDay,
      dueDay: card.dueDay,
      color: card.color,
      brand: card.brand || 'mastercard',
    });
    setEditingCard(card);
    setIsAddCardOpen(true);
  };

  const handleSaveCard = () => {
    if (!cardForm.name.trim()) return;
    
    if (editingCard) {
      // Editar cartão existente
      setCards(cards.map(card =>
        card.id === editingCard.id
          ? { ...card, ...cardForm, used: editingCard.used }
          : card
      ));
    } else {
      // Adicionar novo cartão
      const newCard: CreditCard = {
        id: `card${Date.now()}`,
        ...cardForm,
        used: 0,
      };
      setCards([...cards, newCard]);
    }
    
    setIsAddCardOpen(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Tem certeza que deseja excluir este cartão?')) {
      setCards(cards.filter(card => card.id !== cardId));
    }
  };

  // Função para gerar gradiente baseado na cor do cartão
  const getCardGradient = (color: string) => {
    const gradients: Record<string, string> = {
      '#FF7A00': 'linear-gradient(135deg, #FF7A00 0%, #FF9500 50%, #FFB84D 100%)', // Inter - Laranja
      '#820AD1': 'linear-gradient(135deg, #820AD1 0%, #A855F7 50%, #C084FC 100%)', // Nubank - Roxo
      '#000000': 'linear-gradient(135deg, #1F2937 0%, #111827 50%, #000000 100%)', // XP - Preto
    };
    return gradients[color] || `linear-gradient(135deg, ${color} 0%, ${color}CC 50%, ${color}99 100%)`;
  };

  // Função para gerar número mascarado do cartão
  const getMaskedCardNumber = (cardId: string) => {
    // Usa os últimos 4 dígitos do ID como número do cartão
    const last4 = cardId.slice(-4).padStart(4, '0');
    return `**** **** **** ${last4}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* SEÇÃO 1: CONTAS BANCÁRIAS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
            Minhas Contas
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenAddAccount}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            Nova Conta
          </Button>
        </div>

        {/* Grid Responsivo de Contas: 1 col (mobile) -> 2 cols (tablet) -> 4 cols (desktop) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {accounts.map((account) => {
            const getBankIcon = () => {
              if (account.bank === 'wallet') return Wallet;
              if (account.bank === 'nubank') return Circle;
              if (account.bank === 'inter') return Circle;
              if (account.bank === 'itau') return Landmark;
              if (account.bank === 'bradesco') return Building2;
              return Landmark;
            };

            const BankIcon = getBankIcon();

            return (
              <Card
                key={account.id}
                padding="md"
                style={{
                  position: 'relative',
                  borderLeft: `4px solid ${account.color}`,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                  const actions = e.currentTarget.querySelector('.account-actions') as HTMLElement;
                  if (actions) actions.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                  const actions = e.currentTarget.querySelector('.account-actions') as HTMLElement;
                  if (actions) actions.style.opacity = '0';
                }}
              >
                {/* Barra de ações (aparece no hover) */}
                <div
                  className="account-actions"
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    display: 'flex',
                    gap: '0.5rem',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    zIndex: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenEditAccount(account)}
                    style={{
                      padding: '0.375rem',
                      borderRadius: '0.375rem',
                      border: `1px solid ${themeColors.border}`,
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                      color: themeColors.textSecondary,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = themeColors.neon.purple;
                      e.currentTarget.style.color = themeColors.neon.purple;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.color = themeColors.textSecondary;
                    }}
                  >
                    <Edit style={{ width: '0.875rem', height: '0.875rem' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAccount(account.id)}
                    style={{
                      padding: '0.375rem',
                      borderRadius: '0.375rem',
                      border: `1px solid ${themeColors.border}`,
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                      color: themeColors.textSecondary,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = themeColors.status.error;
                      e.currentTarget.style.color = themeColors.status.error;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.color = themeColors.textSecondary;
                    }}
                  >
                    <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                  </button>
                </div>

                {/* Conteúdo Compacto */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Logo do Banco (Círculo Colorido) */}
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      backgroundColor: `${account.color}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: `2px solid ${account.color}`,
                    }}
                  >
                    {account.bank === 'wallet' ? (
                      <Wallet style={{ width: '1.5rem', height: '1.5rem', color: account.color }} />
                    ) : (
                      <BankIcon style={{ width: '1.5rem', height: '1.5rem', color: account.color }} />
                    )}
                  </div>

                  {/* Informações */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: '0 0 0.5rem 0' }}>
                      {account.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {account.balance > 0 && (
                        <TrendingUp style={{ width: '1rem', height: '1rem', color: '#34D399', flexShrink: 0 }} />
                      )}
                      {account.balance <= 0 && (
                        <TrendingDown style={{ width: '1rem', height: '1rem', color: account.balance < 0 ? '#F43F5E' : '#94A3B8', flexShrink: 0 }} />
                      )}
                      <p style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        color: account.balance > 0 
                          ? '#34D399' 
                          : account.balance < 0 
                          ? '#F43F5E' 
                          : '#94A3B8', 
                        margin: 0 
                      }}>
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0 }}>
                        {getBankName(account.bank)} • {account.type === 'checking' ? 'Corrente' : account.type === 'investment' ? 'Investimento' : 'Dinheiro'}
                      </p>
                    </div>
                    {/* Mini Sparkline */}
                    <div style={{ marginTop: '0.5rem' }}>
                      <MiniSparkline 
                        data={generateSparklineData(account.balance)} 
                        isPositive={account.balance > 0}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 2: CARTÕES DE CRÉDITO */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
            Meus Cartões
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenAddCard}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            Novo Cartão
          </Button>
        </div>

        {/* Grid Responsivo de Cartões: 1 col (mobile) -> 2 cols (tablet) -> 3 cols (desktop) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {cards.map((card) => {
            return (
              <div
                key={card.id}
                style={{
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  const actions = e.currentTarget.querySelector('.card-actions') as HTMLElement;
                  if (actions) actions.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const actions = e.currentTarget.querySelector('.card-actions') as HTMLElement;
                  if (actions) actions.style.opacity = '0';
                }}
              >
                {/* Barra de ações (aparece no hover) */}
                <div
                  className="card-actions"
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    gap: '0.5rem',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    zIndex: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenEditCard(card)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    <Edit style={{ width: '1rem', height: '1rem' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    <Trash2 style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>

                {/* Componente de Cartão Visual */}
                <CreditCardVisual card={card} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Adicionar/Editar Conta */}
      {isAddAccountOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsAddAccountOpen(false)}
        >
          <Card
            padding="lg"
            variant="glass"
            style={{ maxWidth: '500px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: '0 0 1.5rem 0' }}>
              {editingAccount ? 'Editar Conta' : 'Nova Conta'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                  Nome da Conta
                </label>
                <input
                  type="text"
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                  placeholder="Ex: Conta Corrente Principal"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                  Banco
                </label>
                <select
                  value={accountForm.bank}
                  onChange={(e) => setAccountForm({ ...accountForm, bank: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="nubank">Nubank</option>
                  <option value="inter">Inter</option>
                  <option value="xp">XP Investimentos</option>
                  <option value="itau">Itaú</option>
                  <option value="bradesco">Bradesco</option>
                  <option value="wallet">Carteira</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                  Tipo
                </label>
                <select
                  value={accountForm.type}
                  onChange={(e) => setAccountForm({ ...accountForm, type: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="investment">Investimento</option>
                  <option value="cash">Dinheiro</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                  Saldo Inicial
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={accountForm.balance}
                  onChange={(e) => setAccountForm({ ...accountForm, balance: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                  Cor
                </label>
                <input
                  type="color"
                  value={accountForm.color}
                  onChange={(e) => setAccountForm({ ...accountForm, color: e.target.value })}
                  style={{
                    width: '100%',
                    height: '3rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    cursor: 'pointer',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button
                  variant="outline"
                  onClick={() => setIsAddAccountOpen(false)}
                  style={{ flex: 1 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveAccount}
                  style={{ flex: 1 }}
                >
                  {editingAccount ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Adicionar/Editar Cartão */}
      {isAddCardOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsAddCardOpen(false)}
        >
          <Card
            padding="lg"
            variant="glass"
            style={{ maxWidth: '500px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: '0 0 1.5rem 0' }}>
              {editingCard ? 'Editar Cartão' : 'Novo Cartão'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                  Nome do Cartão
                </label>
                <input
                  type="text"
                  value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                  placeholder="Ex: Nubank Ultravioleta"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                  Banco
                </label>
                <select
                  value={cardForm.bank}
                  onChange={(e) => setCardForm({ ...cardForm, bank: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="nubank">Nubank</option>
                  <option value="inter">Inter</option>
                  <option value="xp">XP Investimentos</option>
                  <option value="itau">Itaú</option>
                  <option value="bradesco">Bradesco</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                  Limite
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cardForm.limit}
                  onChange={(e) => setCardForm({ ...cardForm, limit: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                    Dia Fechamento
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={cardForm.closingDay}
                    onChange={(e) => setCardForm({ ...cardForm, closingDay: parseInt(e.target.value) || 1 })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${themeColors.border}`,
                      backgroundColor: themeColors.surface,
                      color: themeColors.text,
                      fontSize: '0.875rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                    Dia Vencimento
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={cardForm.dueDay}
                    onChange={(e) => setCardForm({ ...cardForm, dueDay: parseInt(e.target.value) || 1 })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${themeColors.border}`,
                      backgroundColor: themeColors.surface,
                      color: themeColors.text,
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                  Bandeira
                </label>
                <select
                  value={cardForm.brand}
                  onChange={(e) => setCardForm({ ...cardForm, brand: e.target.value as 'mastercard' | 'visa' })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="mastercard">Mastercard</option>
                  <option value="visa">Visa</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                  Cor
                </label>
                <input
                  type="color"
                  value={cardForm.color}
                  onChange={(e) => setCardForm({ ...cardForm, color: e.target.value })}
                  style={{
                    width: '100%',
                    height: '3rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    cursor: 'pointer',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button
                  variant="outline"
                  onClick={() => setIsAddCardOpen(false)}
                  style={{ flex: 1 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveCard}
                  style={{ flex: 1 }}
                >
                  {editingCard ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* CSS para grid responsivo de cartões */}
      <style>{`
        .cards-grid-wallet {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }
        
        @media (max-width: 1400px) {
          .cards-grid-wallet {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        @media (max-width: 900px) {
          .cards-grid-wallet {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

