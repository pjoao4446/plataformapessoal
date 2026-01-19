import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import {
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import {
  MOCK_TRANSACTIONS,
  MOCK_FINANCIAL_GOALS,
  getGoalById,
  calculateBalance,
  getIncomeTotal,
  getExpenseTotal,
  type Transaction,
} from '../../mocks/database';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

/**
 * GestaoFinanceiraPage - Página de Gestão Financeira Operacional
 * Fluxo de Caixa diário com vínculo de metas
 * Design System: VertexGuard Premium Dark/Light
 */
export const GestaoFinanceiraPage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'income' as 'income' | 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    goalId: '',
  });

  // Calcular saldo e totais
  const balance = useMemo(() => calculateBalance(transactions), [transactions]);
  const incomeTotal = useMemo(() => getIncomeTotal(transactions), [transactions]);
  const expenseTotal = useMemo(() => getExpenseTotal(transactions), [transactions]);

  // Dados para gráfico de barras (últimos 7 dias)
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => 
        t.date.startsWith(dateStr)
      );
      
      return {
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        income: getIncomeTotal(dayTransactions),
        expense: getExpenseTotal(dayTransactions),
      };
    });
    
    return last7Days;
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      description: formData.description,
      amount: formData.type === 'income' 
        ? parseFloat(formData.amount) 
        : -Math.abs(parseFloat(formData.amount)),
      type: formData.type,
      category: formData.category,
      date: new Date(formData.date).toISOString().split('T')[0],
      goalId: formData.goalId || null,
    };

    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
    setFormData({
      description: '',
      amount: '',
      type: 'income',
      category: '',
      date: new Date().toISOString().split('T')[0],
      goalId: '',
    });
  };

  const categories = [
    'Salário',
    'Freelance',
    'Investimento',
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Dívidas',
    'Outros',
  ];

  return (
    <div style={{ padding: '2rem', color: themeColors.text }}>
      {/* Header da Página */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.75rem',
              background: `linear-gradient(to bottom right, ${themeColors.neon.purple}, ${themeColors.neon.cyan})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
              Gestão Financeira
            </h1>
          </div>
        </div>

        {/* Botão Nova Transação */}
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus style={{ width: '1rem', height: '1rem' }} />
          Nova Transação
        </Button>
      </div>

      {/* Header Cards - Saldo e Gráfico */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Card Saldo Atual */}
        <Card variant="neon" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
              Saldo Atual
            </p>
            <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.purple }} />
          </div>
          <p
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: balance >= 0 ? themeColors.neon.emerald : themeColors.status.error,
              margin: 0,
            }}
          >
            {formatCurrency(balance)}
          </p>
        </Card>

        {/* Card Entradas */}
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
              Entradas
            </p>
            <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.emerald }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: themeColors.neon.emerald, margin: 0 }}>
            {formatCurrency(incomeTotal)}
          </p>
        </Card>

        {/* Card Saídas */}
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
              Saídas
            </p>
            <TrendingDown style={{ width: '1.25rem', height: '1.25rem', color: themeColors.status.error }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: themeColors.status.error, margin: 0 }}>
            {formatCurrency(expenseTotal)}
          </p>
        </Card>

        {/* Card Gráfico Entradas vs Saídas */}
        <Card padding="lg">
          <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginBottom: '1rem', margin: 0 }}>
            Últimos 7 Dias
          </p>
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: themeColors.textSecondary, fontSize: 12 }}
                  axisLine={{ stroke: themeColors.border }}
                />
                <YAxis
                  tick={{ fill: themeColors.textSecondary, fontSize: 12 }}
                  axisLine={{ stroke: themeColors.border }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: themeColors.surface,
                    border: `1px solid ${themeColors.border}`,
                    borderRadius: '0.5rem',
                    color: themeColors.text,
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="income" name="Entradas">
                  {chartData.map((_, index) => (
                    <Cell key={`cell-income-${index}`} fill={themeColors.neon.emerald} />
                  ))}
                </Bar>
                <Bar dataKey="expense" name="Saídas">
                  {chartData.map((_, index) => (
                    <Cell key={`cell-expense-${index}`} fill={themeColors.status.error} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tabela de Transações */}
      <Card padding="none">
        <div style={{ padding: '1.5rem', borderBottom: `1px solid ${themeColors.border}` }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
            Extrato de Transações
          </h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${themeColors.border}`,
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Data
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Descrição
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Categoria
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Valor
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Meta Vinculada
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: '3rem',
                      textAlign: 'center',
                      color: themeColors.textSecondary,
                    }}
                  >
                    Nenhuma transação encontrada
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const goal = transaction.goalId ? getGoalById(transaction.goalId) : null;
                  const isIncome = transaction.type === 'income';

                  return (
                    <tr
                      key={transaction.id}
                      style={{
                        borderBottom: `1px solid ${themeColors.border}`,
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark'
                          ? 'rgba(255, 255, 255, 0.03)'
                          : 'rgba(0, 0, 0, 0.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          fontSize: '0.875rem',
                          color: themeColors.textSecondary,
                        }}
                      >
                        {formatDate(transaction.date)}
                      </td>
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          fontSize: '0.875rem',
                          color: themeColors.text,
                          fontWeight: '500',
                        }}
                      >
                        {transaction.description}
                      </td>
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            backgroundColor: theme === 'dark'
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(0, 0, 0, 0.05)',
                            color: themeColors.text,
                            fontSize: '0.75rem',
                            fontWeight: '500',
                          }}
                        >
                          {transaction.category}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'right',
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: isIncome ? themeColors.neon.emerald : themeColors.status.error,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          {isIncome ? (
                            <ArrowUpCircle style={{ width: '1rem', height: '1rem' }} />
                          ) : (
                            <ArrowDownCircle style={{ width: '1rem', height: '1rem' }} />
                          )}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'center',
                        }}
                      >
                        {goal ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              backgroundColor: theme === 'dark'
                                ? `${themeColors.neon.purple}33`
                                : `${themeColors.neon.purple}1A`,
                              color: themeColors.neon.purple,
                              fontSize: '0.75rem',
                              fontWeight: '500',
                            }}
                          >
                            <Target style={{ width: '0.875rem', height: '0.875rem' }} />
                            {goal.title}
                          </div>
                        ) : (
                          <span style={{ color: themeColors.textMuted, fontSize: '0.875rem' }}>
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Nova Transação */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Transação"
        size="md"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: `2px solid ${formData.type === 'income' ? themeColors.neon.emerald : themeColors.border}`,
                  backgroundColor: formData.type === 'income' 
                    ? `${themeColors.neon.emerald}33` 
                    : 'transparent',
                  color: formData.type === 'income' ? themeColors.neon.emerald : themeColors.text,
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                Receita
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: `2px solid ${formData.type === 'expense' ? themeColors.status.error : themeColors.border}`,
                  backgroundColor: formData.type === 'expense' 
                    ? `${themeColors.status.error}33` 
                    : 'transparent',
                  color: formData.type === 'expense' ? themeColors.status.error : themeColors.text,
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                Despesa
              </button>
            </div>
          </div>

          {/* Valor */}
          <Input
            label="Valor"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
            autoFocus
          />

          {/* Descrição */}
          <Input
            label="Descrição"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ex: Salário, Supermercado..."
            required
          />

          {/* Categoria */}
          <Select
            label="Categoria"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>

          {/* Data */}
          <Input
            label="Data"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          {/* Vincular a Meta */}
          <Select
            label="Vincular a Meta (Opcional)"
            value={formData.goalId}
            onChange={(e) => setFormData({ ...formData, goalId: e.target.value })}
          >
            <option value="">Nenhuma meta</option>
            {MOCK_FINANCIAL_GOALS.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title} ({goal.type === 'investment' ? 'Investimento' : 'Dívida'})
              </option>
            ))}
          </Select>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Salvar Transação
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
