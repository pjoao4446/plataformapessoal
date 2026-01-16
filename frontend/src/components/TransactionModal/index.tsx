import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import {
  MOCK_ACCOUNTS,
  MOCK_CARDS,
  MOCK_CATEGORIES,
  type Transaction,
  type Account,
  type Category,
  type PaymentMethod,
  type PaymentCondition,
} from '../../mocks/database';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  Plus,
  X,
  Infinity,
  Calendar,
  Check,
} from 'lucide-react';

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
}

type TabType = 'expense' | 'income' | 'transfer';

export const TransactionModal: FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  // Estado da aba atual
  const [activeTab, setActiveTab] = useState<TabType>('expense');

  // Estados gerais
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Estados para GASTO
  const [expenseCategoryId, setExpenseCategoryId] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('debit_card');
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition>('spot');
  const [expenseAccountId, setExpenseAccountId] = useState(MOCK_ACCOUNTS[0]?.id || '');
  const [expenseCardId, setExpenseCardId] = useState(MOCK_CARDS[0]?.id || '');
  const [isPaid, setIsPaid] = useState(true);
  const [installmentsTotal, setInstallmentsTotal] = useState(2);
  const [installmentStartNow, setInstallmentStartNow] = useState(true);
  const [recurringFrequency, setRecurringFrequency] = useState<'monthly' | 'weekly'>('monthly');

  // Estados para GANHO
  const [incomeType, setIncomeType] = useState<'unique' | 'recurring'>('unique');
  const [incomeCategoryId, setIncomeCategoryId] = useState('');
  const [isCreatingIncomeCategory, setIsCreatingIncomeCategory] = useState(false);
  const [newIncomeCategoryName, setNewIncomeCategoryName] = useState('');
  const [incomeAccountId, setIncomeAccountId] = useState(MOCK_ACCOUNTS[0]?.id || '');

  // Estados para TRANSFERÊNCIA
  const [transferAmount, setTransferAmount] = useState('');
  const [fromAccountId, setFromAccountId] = useState(MOCK_ACCOUNTS[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(MOCK_ACCOUNTS[1]?.id || '');
  const [transferDescription, setTransferDescription] = useState('');

  // Filtrar categorias por tipo
  const expenseCategories = useMemo(() => 
    MOCK_CATEGORIES.filter(cat => cat.type === 'expense'),
    []
  );

  const incomeCategories = useMemo(() => 
    MOCK_CATEGORIES.filter(cat => cat.type === 'income'),
    []
  );

  // Filtrar contas de destino (não pode ser a mesma da origem)
  const availableDestinationAccounts = useMemo(() => 
    MOCK_ACCOUNTS.filter(acc => acc.id !== fromAccountId),
    [fromAccountId]
  );

  // Resetar formulário ao fechar
  const handleClose = () => {
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setExpenseCategoryId('');
    setIsCreatingCategory(false);
    setNewCategoryName('');
    setPaymentMethod('debit_card');
    setPaymentCondition('spot');
    setExpenseAccountId(MOCK_ACCOUNTS[0]?.id || '');
    setExpenseCardId(MOCK_CARDS[0]?.id || '');
    setIsPaid(true);
    setInstallmentsTotal(2);
    setInstallmentStartNow(true);
    setRecurringFrequency('monthly');
    setIncomeType('unique');
    setIncomeCategoryId('');
    setIsCreatingIncomeCategory(false);
    setNewIncomeCategoryName('');
    setIncomeAccountId(MOCK_ACCOUNTS[0]?.id || '');
    setTransferAmount('');
    setFromAccountId(MOCK_ACCOUNTS[0]?.id || '');
    setToAccountId(MOCK_ACCOUNTS[1]?.id || '');
    setTransferDescription('');
    setShowDatePicker(false);
    onClose();
  };

  // Criar nova categoria
  const handleCreateCategory = (type: 'expense' | 'income') => {
    if (type === 'expense' && newCategoryName.trim()) {
      // Em produção, isso seria uma chamada à API
      console.log('Criando categoria de despesa:', newCategoryName);
      setIsCreatingCategory(false);
      setNewCategoryName('');
      // Por enquanto, apenas resetar o estado
    } else if (type === 'income' && newIncomeCategoryName.trim()) {
      console.log('Criando categoria de receita:', newIncomeCategoryName);
      setIsCreatingIncomeCategory(false);
      setNewIncomeCategoryName('');
    }
  };

  // Submeter formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'expense') {
      if (!description || !amount || !expenseCategoryId) {
        return;
      }
      // Validar conta ou cartão baseado no método de pagamento
      if (paymentMethod === 'credit_card' && !expenseCardId) {
        return;
      }
      if (paymentMethod !== 'credit_card' && !expenseAccountId) {
        return;
      }

      const transaction: Omit<Transaction, 'id'> = {
        description,
        amount: -Math.abs(parseFloat(amount)),
        type: 'expense',
        category: expenseCategories.find(c => c.id === expenseCategoryId)?.name || '',
        date,
        status: isPaid ? 'paid' : 'pending',
        categoryId: expenseCategoryId,
        accountId: paymentMethod === 'credit_card' ? undefined : expenseAccountId,
        cardId: paymentMethod === 'credit_card' ? expenseCardId : undefined,
        paymentMethod,
        paymentCondition,
        installments: paymentCondition === 'installments' 
          ? { current: 1, total: installmentsTotal }
          : undefined,
        isRecurring: paymentCondition === 'recurring',
      };

      onSave(transaction);
    } else if (activeTab === 'income') {
      if (!description || !amount || !incomeCategoryId || !incomeAccountId) {
        return;
      }

      const transaction: Omit<Transaction, 'id'> = {
        description,
        amount: parseFloat(amount),
        type: 'income',
        category: incomeCategories.find(c => c.id === incomeCategoryId)?.name || '',
        date,
        status: 'paid',
        categoryId: incomeCategoryId,
        accountId: incomeAccountId,
        paymentMethod: 'pix',
        paymentCondition: incomeType === 'recurring' ? 'recurring' : 'spot',
        isRecurring: incomeType === 'recurring',
      };

      onSave(transaction);
    } else if (activeTab === 'transfer') {
      if (!transferAmount || !fromAccountId || !toAccountId) {
        return;
      }

      const transaction: Omit<Transaction, 'id'> = {
        description: transferDescription.trim() || `Transferência de ${MOCK_ACCOUNTS.find(a => a.id === fromAccountId)?.name} para ${MOCK_ACCOUNTS.find(a => a.id === toAccountId)?.name}`,
        amount: parseFloat(transferAmount),
        type: 'transfer',
        category: 'Transferência',
        date,
        status: 'paid',
        accountId: fromAccountId,
        destinationAccountId: toAccountId,
        paymentMethod: 'pix',
        paymentCondition: 'spot',
        isRecurring: false,
      };

      onSave(transaction);
    }

    handleClose();
  };

  // Estilo das abas
  const tabStyle = (isActive: boolean, color: string) => ({
    flex: 1,
    padding: '0.875rem 1rem',
    borderRadius: '0.75rem',
    border: `2px solid ${isActive ? color : themeColors.border}`,
    backgroundColor: isActive ? `${color}33` : 'transparent',
    color: isActive ? color : themeColors.text,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9375rem',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nova Transação"
      size="lg"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Abas */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('expense')}
            style={tabStyle(activeTab === 'expense', themeColors.status.error)}
          >
            <ArrowDownCircle style={{ width: '1rem', height: '1rem' }} />
            GASTO
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('income')}
            style={tabStyle(activeTab === 'income', themeColors.neon.emerald)}
          >
            <ArrowUpCircle style={{ width: '1rem', height: '1rem' }} />
            GANHO
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transfer')}
            style={tabStyle(activeTab === 'transfer', themeColors.neon.cyan)}
          >
            <ArrowLeftRight style={{ width: '1rem', height: '1rem' }} />
            TRANSFERÊNCIA
          </button>
        </div>

        {/* Conteúdo da Aba GASTO */}
        {activeTab === 'expense' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Valor Grande Centralizado */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: themeColors.text,
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                }}
              >
                Valor <span style={{ color: themeColors.status.error }}>*</span>
              </label>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: themeColors.status.error,
                    }}
                  >
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '1.25rem 1rem 1.25rem 3.5rem',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      backgroundColor: theme === 'dark' ? '#1A1D2D' : '#F9FAFB',
                      border: `2px solid ${themeColors.border}`,
                      borderRadius: '0.75rem',
                      color: themeColors.text,
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColors.status.error;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${themeColors.status.error}33`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Descrição */}
            <Input
              label="Descrição"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado, Conta de Luz..."
              required
            />

            {/* Categoria com botão de criar */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: themeColors.text,
                    flex: 1,
                  }}
                >
                  Categoria <span style={{ color: themeColors.status.error }}>*</span>
                </label>
                {!isCreatingCategory && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(true)}
                    style={{
                      padding: '0.375rem 0.5rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${themeColors.border}`,
                      backgroundColor: 'transparent',
                      color: themeColors.text,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = themeColors.neon.purple;
                      e.currentTarget.style.color = themeColors.neon.purple;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.color = themeColors.text;
                    }}
                  >
                    <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
                    Nova
                  </button>
                )}
              </div>
              {isCreatingCategory ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Nome da categoria"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleCreateCategory('expense')}
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    <Check style={{ width: '1rem', height: '1rem' }} />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsCreatingCategory(false);
                      setNewCategoryName('');
                    }}
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    <X style={{ width: '1rem', height: '1rem' }} />
                  </Button>
                </div>
              ) : (
                <Select
                  value={expenseCategoryId}
                  onChange={(e) => setExpenseCategoryId(e.target.value)}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            {/* Forma de Pagamento */}
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
                Forma de Pagamento <span style={{ color: themeColors.status.error }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${paymentMethod === 'credit_card' ? themeColors.neon.purple : themeColors.border}`,
                    backgroundColor: paymentMethod === 'credit_card' ? `${themeColors.neon.purple}33` : 'transparent',
                    color: paymentMethod === 'credit_card' ? themeColors.neon.purple : themeColors.text,
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                >
                  Crédito
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('debit_card')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${paymentMethod === 'debit_card' ? themeColors.neon.purple : themeColors.border}`,
                    backgroundColor: paymentMethod === 'debit_card' ? `${themeColors.neon.purple}33` : 'transparent',
                    color: paymentMethod === 'debit_card' ? themeColors.neon.purple : themeColors.text,
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                >
                  Débito
                </button>
              </div>
            </div>

            {/* Condição */}
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
                Condição <span style={{ color: themeColors.status.error }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentCondition('spot')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${paymentCondition === 'spot' ? themeColors.neon.purple : themeColors.border}`,
                    backgroundColor: paymentCondition === 'spot' ? `${themeColors.neon.purple}33` : 'transparent',
                    color: paymentCondition === 'spot' ? themeColors.neon.purple : themeColors.text,
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                >
                  À Vista
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentCondition('installments')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${paymentCondition === 'installments' ? themeColors.neon.purple : themeColors.border}`,
                    backgroundColor: paymentCondition === 'installments' ? `${themeColors.neon.purple}33` : 'transparent',
                    color: paymentCondition === 'installments' ? themeColors.neon.purple : themeColors.text,
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                >
                  Parcelado
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentCondition('recurring')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${paymentCondition === 'recurring' ? themeColors.neon.purple : themeColors.border}`,
                    backgroundColor: paymentCondition === 'recurring' ? `${themeColors.neon.purple}33` : 'transparent',
                    color: paymentCondition === 'recurring' ? themeColors.neon.purple : themeColors.text,
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Infinity style={{ width: '0.875rem', height: '0.875rem' }} />
                  Recorrente
                </button>
              </div>
            </div>

            {/* Conteúdo condicional baseado na condição */}
            {paymentCondition === 'spot' && (
              <>
                {/* Grid 2 colunas: Data e Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Data */}
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
                      Data <span style={{ color: themeColors.status.error }}>*</span>
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Status Toggle */}
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
                      Status
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', borderRadius: '0.5rem', border: `1px solid ${themeColors.border}`, padding: '0.25rem', backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}>
                      <button
                        type="button"
                        onClick={() => setIsPaid(true)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          color: isPaid ? '#10B981' : themeColors.textSecondary,
                          cursor: 'pointer',
                          fontWeight: isPaid ? '600' : '500',
                          fontSize: '0.8125rem',
                          transition: 'all 0.2s',
                        }}
                      >
                        Pago
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPaid(false)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          backgroundColor: !isPaid ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
                          color: !isPaid ? '#FBBF24' : themeColors.textSecondary,
                          cursor: 'pointer',
                          fontWeight: !isPaid ? '600' : '500',
                          fontSize: '0.8125rem',
                          transition: 'all 0.2s',
                        }}
                      >
                        Pendente
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conta de Saída ou Cartão */}
                {paymentMethod === 'credit_card' ? (
                  <Select
                    label="Cartão de Crédito"
                    value={expenseCardId}
                    onChange={(e) => setExpenseCardId(e.target.value)}
                    required
                  >
                    {MOCK_CARDS.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name} ({card.bank}) - Limite: R$ {card.limit.toLocaleString('pt-BR')}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Select
                    label="Conta de Saída"
                    value={expenseAccountId}
                    onChange={(e) => setExpenseAccountId(e.target.value)}
                    required
                  >
                    {MOCK_ACCOUNTS.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.bank})
                      </option>
                    ))}
                  </Select>
                )}
              </>
            )}

            {paymentCondition === 'installments' && (
              <>
                {/* Quantidade de Parcelas */}
                <Input
                  label="Quantidade de Parcelas"
                  type="number"
                  min="2"
                  max="48"
                  value={installmentsTotal}
                  onChange={(e) => setInstallmentsTotal(parseInt(e.target.value) || 1)}
                  required
                />

                {/* Toggle Primeira Parcela Agora */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', border: `1px solid ${themeColors.border}`, backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}>
                  <span style={{ fontSize: '0.875rem', color: themeColors.text, flex: 1 }}>
                    Primeira parcela agora?
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', borderRadius: '0.5rem', border: `1px solid ${themeColors.border}`, padding: '0.25rem', backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }}>
                    <button
                      type="button"
                      onClick={() => setInstallmentStartNow(true)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        backgroundColor: installmentStartNow ? themeColors.neon.purple : 'transparent',
                        color: installmentStartNow ? 'white' : themeColors.textSecondary,
                        cursor: 'pointer',
                        fontWeight: installmentStartNow ? '600' : '500',
                        fontSize: '0.8125rem',
                        transition: 'all 0.2s',
                      }}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstallmentStartNow(false)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        backgroundColor: !installmentStartNow ? themeColors.neon.purple : 'transparent',
                        color: !installmentStartNow ? 'white' : themeColors.textSecondary,
                        cursor: 'pointer',
                        fontWeight: !installmentStartNow ? '600' : '500',
                        fontSize: '0.8125rem',
                        transition: 'all 0.2s',
                      }}
                    >
                      Não
                    </button>
                  </div>
                </div>

                {/* Conta de Saída ou Cartão */}
                {paymentMethod === 'credit_card' ? (
                  <Select
                    label="Cartão de Crédito"
                    value={expenseCardId}
                    onChange={(e) => setExpenseCardId(e.target.value)}
                    required
                  >
                    {MOCK_CARDS.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name} ({card.bank}) - Limite: R$ {card.limit.toLocaleString('pt-BR')}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Select
                    label="Conta de Saída"
                    value={expenseAccountId}
                    onChange={(e) => setExpenseAccountId(e.target.value)}
                    required
                  >
                    {MOCK_ACCOUNTS.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.bank})
                      </option>
                    ))}
                  </Select>
                )}
              </>
            )}

            {paymentCondition === 'recurring' && (
              <>
                {/* Select Frequência */}
                <Select
                  label="Frequência"
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value as 'monthly' | 'weekly')}
                  required
                >
                  <option value="monthly">Mensal</option>
                  <option value="weekly">Semanal</option>
                </Select>

                {/* Conta de Saída ou Cartão */}
                {paymentMethod === 'credit_card' ? (
                  <Select
                    label="Cartão de Crédito"
                    value={expenseCardId}
                    onChange={(e) => setExpenseCardId(e.target.value)}
                    required
                  >
                    {MOCK_CARDS.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name} ({card.bank}) - Limite: R$ {card.limit.toLocaleString('pt-BR')}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Select
                    label="Conta de Saída"
                    value={expenseAccountId}
                    onChange={(e) => setExpenseAccountId(e.target.value)}
                    required
                  >
                    {MOCK_ACCOUNTS.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.bank})
                      </option>
                    ))}
                  </Select>
                )}

                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                    border: `1px solid ${themeColors.neon.purple}33`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: themeColors.neon.purple,
                  }}
                >
                  <Infinity style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    Esta despesa será registrada automaticamente {recurringFrequency === 'monthly' ? 'todos os meses' : 'toda semana'}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Conteúdo da Aba GANHO */}
        {activeTab === 'income' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Valor Grande Centralizado (Verde) */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: themeColors.text,
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                }}
              >
                Valor <span style={{ color: themeColors.status.error }}>*</span>
              </label>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: '#10B981',
                    }}
                  >
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '1.25rem 1rem 1.25rem 3.5rem',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      backgroundColor: theme === 'dark' ? '#1A1D2D' : '#F9FAFB',
                      border: `2px solid ${themeColors.border}`,
                      borderRadius: '0.75rem',
                      color: themeColors.text,
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#10B981';
                      e.currentTarget.style.boxShadow = `0 0 0 3px rgba(16, 185, 129, 0.2)`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Descrição */}
            <Input
              label="Descrição"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário, Freelance..."
              required
            />

            {/* Tipo */}
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
                Tipo <span style={{ color: themeColors.status.error }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIncomeType('unique')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${incomeType === 'unique' ? themeColors.neon.emerald : themeColors.border}`,
                    backgroundColor: incomeType === 'unique' ? `${themeColors.neon.emerald}33` : 'transparent',
                    color: incomeType === 'unique' ? themeColors.neon.emerald : themeColors.text,
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                >
                  Único
                </button>
                <button
                  type="button"
                  onClick={() => setIncomeType('recurring')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${incomeType === 'recurring' ? themeColors.neon.emerald : themeColors.border}`,
                    backgroundColor: incomeType === 'recurring' ? `${themeColors.neon.emerald}33` : 'transparent',
                    color: incomeType === 'recurring' ? themeColors.neon.emerald : themeColors.text,
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Infinity style={{ width: '0.875rem', height: '0.875rem' }} />
                  Recorrente
                </button>
              </div>
            </div>

            {/* Categoria com botão de criar */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: themeColors.text,
                    flex: 1,
                  }}
                >
                  Categoria <span style={{ color: themeColors.status.error }}>*</span>
                </label>
                {!isCreatingIncomeCategory && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingIncomeCategory(true)}
                    style={{
                      padding: '0.375rem 0.5rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${themeColors.border}`,
                      backgroundColor: 'transparent',
                      color: themeColors.text,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = themeColors.neon.emerald;
                      e.currentTarget.style.color = themeColors.neon.emerald;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.color = themeColors.text;
                    }}
                  >
                    <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
                    Nova
                  </button>
                )}
              </div>
              {isCreatingIncomeCategory ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="text"
                      value={newIncomeCategoryName}
                      onChange={(e) => setNewIncomeCategoryName(e.target.value)}
                      placeholder="Nome da categoria"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleCreateCategory('income')}
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    <Check style={{ width: '1rem', height: '1rem' }} />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsCreatingIncomeCategory(false);
                      setNewIncomeCategoryName('');
                    }}
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    <X style={{ width: '1rem', height: '1rem' }} />
                  </Button>
                </div>
              ) : (
                <Select
                  value={incomeCategoryId}
                  onChange={(e) => setIncomeCategoryId(e.target.value)}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {incomeCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            {/* Conta de Entrada */}
            <Select
              label="Conta de Entrada"
              value={incomeAccountId}
              onChange={(e) => setIncomeAccountId(e.target.value)}
              required
            >
              {MOCK_ACCOUNTS.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.bank})
                </option>
              ))}
            </Select>

            {/* Data (se não for recorrente) */}
            {incomeType === 'unique' && (
              <Input
                label="Data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            )}

            {incomeType === 'recurring' && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                  border: `1px solid ${themeColors.neon.emerald}33`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: themeColors.neon.emerald,
                }}
              >
                <Infinity style={{ width: '1.25rem', height: '1.25rem' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  Esta receita será registrada automaticamente todos os meses
                </span>
              </div>
            )}
          </div>
        )}

        {/* Conteúdo da Aba TRANSFERÊNCIA */}
        {activeTab === 'transfer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Valor Grande Centralizado (Azul) */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: themeColors.text,
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                }}
              >
                Valor <span style={{ color: themeColors.status.error }}>*</span>
              </label>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: themeColors.neon.cyan,
                    }}
                  >
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0,00"
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '1.25rem 1rem 1.25rem 3.5rem',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      backgroundColor: theme === 'dark' ? '#1A1D2D' : '#F9FAFB',
                      border: `2px solid ${themeColors.border}`,
                      borderRadius: '0.75rem',
                      color: themeColors.text,
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColors.neon.cyan;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${themeColors.neon.cyan}33`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* De (Origem) */}
            <Select
              label="De (Origem)"
              value={fromAccountId}
              onChange={(e) => {
                setFromAccountId(e.target.value);
                // Se a conta de destino for a mesma, resetar
                if (toAccountId === e.target.value) {
                  setToAccountId(availableDestinationAccounts[0]?.id || '');
                }
              }}
              required
            >
              {MOCK_ACCOUNTS.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.bank})
                </option>
              ))}
            </Select>

            {/* Para (Destino) */}
            <Select
              label="Para (Destino)"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              required
            >
              {availableDestinationAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.bank})
                </option>
              ))}
            </Select>

            {/* Data */}
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
                Data <span style={{ color: themeColors.status.error }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button
                  type="button"
                  variant={date === new Date().toISOString().split('T')[0] ? 'primary' : 'secondary'}
                  onClick={() => setDate(new Date().toISOString().split('T')[0])}
                  style={{ flex: 1 }}
                >
                  <Calendar style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                  Hoje
                </Button>
                <div style={{ flex: 1 }}>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Observação (Opcional) */}
            <Input
              label="Observação (Opcional)"
              type="text"
              value={transferDescription}
              onChange={(e) => setTransferDescription(e.target.value)}
              placeholder="Ex: Transferência para investimentos..."
            />
          </div>
        )}

        {/* Botões */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${themeColors.border}` }}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar Transação
          </Button>
        </div>
      </form>
    </Modal>
  );
};

