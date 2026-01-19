import { useState, useEffect } from 'react';
import { BaseModal } from '../ui/BaseModal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Wallet, CreditCard, Landmark, Building2, Circle } from 'lucide-react';

export interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type TransactionType = 'expense' | 'income' | 'transfer';

interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  color?: string;
}

interface Account {
  id: string;
  name: string;
  bank?: string;
  balance: number;
}

interface CreditCard {
  id: string;
  name: string;
  limit: number;
  used: number;
}

/**
 * CreateTransactionModal - Modal master para criar transações
 * Suporta Despesas, Receitas e Transferências
 */
export function CreateTransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTransactionModalProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  
  // Dados do formulário
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [creditCardId, setCreditCardId] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  
  // Para transferências
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  
  // Dados carregados
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Carregar dados quando o modal abrir
  useEffect(() => {
    if (isOpen && user) {
      fetchData();
    }
  }, [isOpen, user, activeTab]);

  // Resetar formulário quando trocar de tab
  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategoryId('');
      setAccountId('');
      setCreditCardId('');
      setIsPaid(true);
      setFromAccountId('');
      setToAccountId('');
      setError(null);
    }
  }, [activeTab, isOpen]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoadingData(true);
    try {
      // Buscar categorias baseado no tipo
      // Mapear: expense -> 'expense', income -> 'income', transfer -> não precisa categoria
      if (activeTab !== 'transfer') {
        const categoryType = activeTab === 'income' ? 'income' : 'expense';
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('type', categoryType)
          .eq('user_id', user.id)
          .order('name');

        if (categoriesError) {
          console.error('Erro ao buscar categorias:', categoriesError);
          // Não bloquear se não houver categorias
        } else {
          setCategories(categoriesData || []);
        }
      }

      // Buscar contas
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (accountsError) {
        console.error('Erro ao buscar contas:', accountsError);
        setError('Erro ao carregar contas. Tente novamente.');
      } else {
        setAccounts(accountsData || []);
      }

      // Buscar cartões (apenas para despesas)
      if (activeTab === 'expense') {
        const { data: cardsData, error: cardsError } = await supabase
          .from('credit_cards')
          .select('*')
          .eq('user_id', user.id)
          .order('name');

        if (cardsError) {
          console.error('Erro ao buscar cartões:', cardsError);
          // Não bloquear se não houver cartões
        } else {
          setCreditCards(cardsData || []);
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    // Validações
    if (!description.trim()) {
      setError('Descrição é obrigatória');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }

    if (activeTab === 'transfer') {
      if (!fromAccountId || !toAccountId) {
        setError('Selecione conta de origem e destino');
        return;
      }
      if (fromAccountId === toAccountId) {
        setError('Conta de origem e destino devem ser diferentes');
        return;
      }
    } else {
      if (!categoryId) {
        setError('Selecione uma categoria');
        return;
      }
      if (!accountId && !creditCardId) {
        setError('Selecione uma conta ou cartão');
        return;
      }
    }

    setLoading(true);

    try {
      const transactionAmount = parseFloat(amount);
      
      if (activeTab === 'transfer') {
        // Transferência: criar duas transações (saída e entrada)
        const { error: outError } = await supabase
          .from('transactions')
          .insert([
            {
              description: `Transferência: ${description}`,
              amount: -transactionAmount,
              type: 'transfer',
              date: date,
              account_id: fromAccountId,
              credit_card_id: null,
              category_id: null,
              user_id: user.id,
              status: 'paid',
            },
          ]);

        if (outError) throw outError;

        const { error: inError } = await supabase
          .from('transactions')
          .insert([
            {
              description: `Transferência: ${description}`,
              amount: transactionAmount,
              type: 'transfer',
              date: date,
              account_id: toAccountId,
              credit_card_id: null,
              category_id: null,
              user_id: user.id,
              status: 'paid',
            },
          ]);

        if (inError) throw inError;

        // Atualizar saldos das contas
        const fromAccount = accounts.find(a => a.id === fromAccountId);
        const toAccount = accounts.find(a => a.id === toAccountId);

        if (fromAccount) {
          const { error: updateFromError } = await supabase
            .from('accounts')
            .update({ balance: fromAccount.balance - transactionAmount })
            .eq('id', fromAccountId);

          if (updateFromError) throw updateFromError;
        }

        if (toAccount) {
          const { error: updateToError } = await supabase
            .from('accounts')
            .update({ balance: toAccount.balance + transactionAmount })
            .eq('id', toAccountId);

          if (updateToError) throw updateToError;
        }
      } else {
        // Despesa ou Receita
        const transactionData: any = {
          description: description.trim(),
          amount: activeTab === 'income' ? transactionAmount : -transactionAmount,
          type: activeTab,
          date: date,
          category_id: categoryId || null,
          user_id: user.id,
          status: creditCardId ? 'pending' : (isPaid ? 'paid' : 'pending'),
        };

        if (creditCardId) {
          transactionData.credit_card_id = creditCardId;
          transactionData.account_id = null;
        } else {
          transactionData.account_id = accountId;
          transactionData.credit_card_id = null;
        }

        const { error: insertError } = await supabase
          .from('transactions')
          .insert([transactionData]);

        if (insertError) throw insertError;

        // Atualizar saldo da conta se for pago e não for cartão
        if (!creditCardId && isPaid && accountId) {
          const account = accounts.find(a => a.id === accountId);
          if (account) {
            const newBalance = activeTab === 'income'
              ? account.balance + transactionAmount
              : account.balance - transactionAmount;

            const { error: updateError } = await supabase
              .from('accounts')
              .update({ balance: newBalance })
              .eq('id', accountId);

            if (updateError) throw updateError;
          }
        }

        // Se for cartão, atualizar o campo "used"
        if (creditCardId && activeTab === 'expense') {
          const card = creditCards.find(c => c.id === creditCardId);
          if (card) {
            const { error: updateCardError } = await supabase
              .from('credit_cards')
              .update({ used: card.used + transactionAmount })
              .eq('id', creditCardId);

            if (updateCardError) throw updateCardError;
          }
        }
      }

      // Sucesso!
      showToast('Transação registrada com sucesso!', 'success');
      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error('Erro ao criar transação:', err);
      setError(err.message || 'Erro ao criar transação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategoryId('');
      setAccountId('');
      setCreditCardId('');
      setIsPaid(true);
      setFromAccountId('');
      setToAccountId('');
      setError(null);
      onClose();
    }
  };

  // Sistema simples de toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? themeColors.neon.emerald : themeColors.status.error};
      color: white;
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-weight: 600;
      animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // Adicionar animações CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getBankIcon = (bank?: string) => {
    if (!bank) return Landmark;
    const bankLower = bank.toLowerCase();
    if (bankLower === 'wallet') return Wallet;
    if (bankLower === 'nubank' || bankLower === 'inter') return Circle;
    if (bankLower === 'itau') return Landmark;
    if (bankLower === 'bradesco') return Building2;
    return Landmark;
  };

  const filteredCategories = categories.filter(cat => cat.type === activeTab);
  const availableDestinationAccounts = accounts.filter(acc => acc.id !== fromAccountId);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nova Transação"
      size="lg"
      footer={
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            style={{ flex: 1 }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || loadingData}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: `${themeColors.status.error}20`,
              border: `1px solid ${themeColors.status.error}`,
              borderRadius: '0.5rem',
              color: themeColors.status.error,
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('expense')}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: 'none',
              backgroundColor: activeTab === 'expense' ? '#EF4444' : themeColors.surface,
              color: activeTab === 'expense' ? 'white' : themeColors.textSecondary,
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <ArrowDownCircle style={{ width: '1rem', height: '1rem' }} />
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('income')}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: 'none',
              backgroundColor: activeTab === 'income' ? '#10B981' : themeColors.surface,
              color: activeTab === 'income' ? 'white' : themeColors.textSecondary,
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <ArrowUpCircle style={{ width: '1rem', height: '1rem' }} />
            Receita
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transfer')}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: 'none',
              backgroundColor: activeTab === 'transfer' ? '#3B82F6' : themeColors.surface,
              color: activeTab === 'transfer' ? 'white' : themeColors.textSecondary,
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <ArrowLeftRight style={{ width: '1rem', height: '1rem' }} />
            Transferência
          </button>
        </div>

        {/* Input de Valor Gigante */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <label
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: themeColors.textSecondary,
            }}
          >
            Valor
          </label>
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <span
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.5rem',
                fontWeight: '600',
                color: themeColors.textSecondary,
              }}
            >
              R$
            </span>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={loading || loadingData}
              style={{
                width: '100%',
                padding: '1.5rem 1rem 1.5rem 3.5rem',
                fontSize: '2.5rem',
                fontWeight: '700',
                textAlign: 'center',
                backgroundColor: themeColors.surface,
                border: `2px solid ${themeColors.border}`,
                borderRadius: '1rem',
                color: themeColors.text,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = themeColors.neon.purple;
                e.currentTarget.style.boxShadow = `0 0 0 4px ${themeColors.neon.purple}33`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = themeColors.border;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Descrição */}
        <Input
          label="Descrição"
          placeholder={activeTab === 'transfer' ? 'Ex: Transferência para poupança' : activeTab === 'income' ? 'Ex: Salário' : 'Ex: Almoço'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={loading || loadingData}
        />

        {/* Categoria (não para transferências) */}
        {activeTab !== 'transfer' && (
          <div>
            <Select
              label="Categoria"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={loading || loadingData}
            >
              <option value="">Selecione uma categoria</option>
              {filteredCategories.length === 0 ? (
                <option value="" disabled>Nenhuma categoria encontrada</option>
              ) : (
                filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </Select>
            {filteredCategories.length === 0 && !loadingData && (
              <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, marginTop: '0.5rem', margin: 0 }}>
                Você precisa criar uma categoria primeiro. Acesse a seção de Categorias.
              </p>
            )}
          </div>
        )}

        {/* Data */}
        <Input
          label="Data"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={loading || loadingData}
        />

        {/* Conta/Cartão de Origem */}
        {activeTab === 'transfer' ? (
          <>
            <Select
              label="Conta de Origem"
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              required
              disabled={loading || loadingData}
            >
              <option value="">Selecione a conta de origem</option>
              {accounts.map((acc) => {
                const BankIcon = getBankIcon(acc.bank);
                return (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.bank || 'Sem banco'})
                  </option>
                );
              })}
            </Select>
            <Select
              label="Conta de Destino"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              required
              disabled={loading || loadingData}
            >
              <option value="">Selecione a conta de destino</option>
              {availableDestinationAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.bank || 'Sem banco'})
                </option>
              ))}
            </Select>
          </>
        ) : (
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: themeColors.text,
                marginBottom: '0.5rem',
              }}
            >
              Conta ou Cartão
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Contas */}
              {accounts.length > 0 && (
                <Select
                  label=""
                  value={accountId}
                  onChange={(e) => {
                    setAccountId(e.target.value);
                    setCreditCardId('');
                  }}
                  disabled={loading || loadingData}
                  style={{ marginBottom: 0 }}
                >
                  <option value="">Selecione uma conta</option>
                  {accounts.map((acc) => {
                    const BankIcon = getBankIcon(acc.bank);
                    return (
                      <option key={acc.id} value={acc.id}>
                        💳 {acc.name} ({acc.bank || 'Sem banco'})
                      </option>
                    );
                  })}
                </Select>
              )}
              
              {/* Cartões (apenas para despesas) */}
              {activeTab === 'expense' && creditCards.length > 0 && (
                <Select
                  label=""
                  value={creditCardId}
                  onChange={(e) => {
                    setCreditCardId(e.target.value);
                    setAccountId('');
                  }}
                  disabled={loading || loadingData}
                  style={{ marginBottom: 0 }}
                >
                  <option value="">Ou selecione um cartão</option>
                  {creditCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      💳 {card.name} (Limite: R$ {card.limit.toFixed(2)})
                    </option>
                  ))}
                </Select>
              )}
            </div>
          </div>
        )}

        {/* Status Pago (apenas para despesa/receita e quando não for cartão) */}
        {activeTab !== 'transfer' && !creditCardId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="isPaid"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              disabled={loading || loadingData}
              style={{
                width: '1.25rem',
                height: '1.25rem',
                cursor: 'pointer',
              }}
            />
            <label
              htmlFor="isPaid"
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: themeColors.text,
                cursor: 'pointer',
              }}
            >
              Pago / Efetuado
            </label>
          </div>
        )}

        {loadingData && (
          <div style={{ textAlign: 'center', padding: '1rem', color: themeColors.textSecondary }}>
            Carregando dados...
          </div>
        )}
      </form>
    </BaseModal>
  );
}

