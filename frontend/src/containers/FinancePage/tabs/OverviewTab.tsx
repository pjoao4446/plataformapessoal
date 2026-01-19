import { FC, useMemo, useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { getTheme } from '../../../styles/theme';
import { Card } from '../../../components/ui/Card';
import { 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, ArrowUp, ArrowDown, Calendar, Eye, EyeOff } from 'lucide-react';
import { CreditCardVisual } from '../../../components/FinancialManagement/CreditCardVisual';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

/**
 * OverviewTab - Aba de Visão Geral
 * Dashboard com resumo financeiro, KPIs inteligentes e gráficos refinados
 * Design System: VertexGuard 2.0 Premium
 */
export const OverviewTab: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isRealScenario, setIsRealScenario] = useState(true);
  
  // Estados para dados do Supabase
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  // Buscar dados do Supabase
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, selectedMonth, selectedYear]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Buscar transações do mês selecionado
      const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
      const lastDay = new Date(selectedYear, selectedMonth, 0);
      
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', firstDay.toISOString().split('T')[0])
        .lte('date', lastDay.toISOString().split('T')[0])
        .order('date', { ascending: false });

      // Buscar categorias
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);

      // Buscar cartões
      const { data: cardsData } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Buscar contas
      const { data: accountsData } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id);

      setTransactions(transactionsData || []);
      setCategories(categoriesData || []);
      setCards(cardsData || []);
      setAccounts(accountsData || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular KPIs com dados reais
  const kpis = useMemo(() => {
    // Calcular saldo total das contas
    const balance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    
    // Receitas do mês
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
    
    // Despesas do mês
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);

    // Calcular tendências (comparar com mês anterior)
    // Por enquanto, valores fixos (pode ser melhorado calculando mês anterior)
    const balanceTrend = 0;
    const incomeTrend = 0;
    const expenseTrend = 0;

    return { 
      balance, 
      income, 
      expense,
      balanceTrend,
      incomeTrend,
      expenseTrend,
    };
  }, [transactions, accounts]);

  // Dados para gráfico de área (Fluxo de Caixa Diário - últimos 7 dias)
  const dailyFlowData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => 
        t.date && t.date.startsWith(dateStr)
      );
      
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);

      return {
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        income,
        expense,
      };
    });
    
    return last7Days;
  }, [transactions]);

  // Dados para gráfico Donut (Gastos por Categoria)
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.type === 'expense' && t.category_id)
      .forEach(t => {
        const category = categories.find(c => c.id === t.category_id);
        const categoryName = category?.name || 'Outros';
        const current = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, current + Math.abs(t.amount || 0));
      });

    const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ 
        name, 
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions, categories]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const COLORS = [
    themeColors.neon.purple,
    themeColors.neon.cyan,
    themeColors.neon.orange,
    themeColors.neon.emerald,
    themeColors.neon.pink,
    themeColors.neon.blue,
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Card Container Principal com Header e Filtros */}
      <Card padding="lg">
        {/* Header do Card com Filtros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
            Resumo do Mês
          </h2>
          
          {/* Filtros à Direita */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Seletor de Mês/Ano */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={{
                  padding: '0.625rem 0.875rem',
                  backgroundColor: themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '0.5rem',
                  color: themeColors.text,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  minWidth: '130px',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = themeColors.neon.purple;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${themeColors.neon.purple}33`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = themeColors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {months.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{
                  padding: '0.625rem 0.875rem',
                  backgroundColor: themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '0.5rem',
                  color: themeColors.text,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  minWidth: '100px',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = themeColors.neon.purple;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${themeColors.neon.purple}33`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = themeColors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle Cenário Real vs Previsto */}
            <div
              style={{
                display: 'flex',
                backgroundColor: themeColors.surface,
                border: `1px solid ${themeColors.border}`,
                borderRadius: '0.5rem',
                padding: '0.25rem',
                gap: '0.25rem',
              }}
            >
              <button
                onClick={() => setIsRealScenario(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  backgroundColor: isRealScenario 
                    ? themeColors.neon.purple 
                    : 'transparent',
                  color: isRealScenario ? 'white' : themeColors.textSecondary,
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Eye size={14} />
                <span>Realizado</span>
              </button>
              <button
                onClick={() => setIsRealScenario(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  backgroundColor: !isRealScenario 
                    ? themeColors.neon.purple 
                    : 'transparent',
                  color: !isRealScenario ? 'white' : themeColors.textSecondary,
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                }}
              >
                <EyeOff size={14} />
                <span>Previsto</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPIs Inteligentes - Big Numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Card Saldo */}
          <div
            style={{
              padding: '1.5rem',
              background: `linear-gradient(to bottom right, rgba(255, 255, 255, ${theme === 'dark' ? '0.05' : '0.1'}), rgba(255, 255, 255, 0))`,
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '0.75rem',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                  Saldo Total
                </p>
                <p
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: kpis.balance >= 0 ? themeColors.neon.emerald : themeColors.status.error,
                    margin: 0,
                    lineHeight: 1.2,
                    textShadow: theme === 'dark' ? `0 2px 8px ${kpis.balance >= 0 ? themeColors.neon.emerald : themeColors.status.error}40` : 'none',
                  }}
                >
                  {formatCurrency(kpis.balance)}
                </p>
              </div>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                background: `linear-gradient(135deg, ${themeColors.neon.emerald} 0%, ${themeColors.neon.emerald}88 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Wallet style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
          </div>
          {/* Indicador de Tendência */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: `${themeColors.neon.emerald}20`,
              color: themeColors.neon.emerald,
              fontSize: '0.75rem',
              fontWeight: '600',
            }}
          >
            <ArrowUp size={12} />
            <span>{kpis.balanceTrend > 0 ? '+' : ''}{kpis.balanceTrend.toFixed(1)}% vs mês passado</span>
          </div>
        </div>

          {/* Card Receita */}
          <div
            style={{
              padding: '1.5rem',
              background: `linear-gradient(to bottom right, rgba(255, 255, 255, ${theme === 'dark' ? '0.05' : '0.1'}), rgba(255, 255, 255, 0))`,
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '0.75rem',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                  Receitas
                </p>
                <p
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: themeColors.neon.cyan,
                    margin: 0,
                    lineHeight: 1.2,
                    textShadow: theme === 'dark' ? `0 2px 8px ${themeColors.neon.cyan}40` : 'none',
                  }}
                >
                  {formatCurrency(kpis.income)}
                </p>
              </div>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                background: `linear-gradient(135deg, ${themeColors.neon.blue} 0%, ${themeColors.neon.blue}88 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
          </div>
          {/* Indicador de Tendência */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: `${themeColors.neon.emerald}20`,
              color: themeColors.neon.emerald,
              fontSize: '0.75rem',
              fontWeight: '600',
            }}
          >
            <ArrowUp size={12} />
            <span>{kpis.incomeTrend > 0 ? '+' : ''}{kpis.incomeTrend.toFixed(1)}% vs mês passado</span>
          </div>
        </div>

          {/* Card Despesa */}
          <div
            style={{
              padding: '1.5rem',
              background: `linear-gradient(to bottom right, rgba(255, 255, 255, ${theme === 'dark' ? '0.05' : '0.1'}), rgba(255, 255, 255, 0))`,
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '0.75rem',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                  Despesas
                </p>
                <p
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#F43F5E', // Rose-500 (vermelho alerta)
                    margin: 0,
                    lineHeight: 1.2,
                    textShadow: theme === 'dark' ? '0 2px 8px rgba(244, 63, 94, 0.4)' : 'none',
                  }}
                >
                  {formatCurrency(kpis.expense)}
                </p>
              </div>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                background: `linear-gradient(135deg, ${themeColors.status.error} 0%, ${themeColors.status.error}88 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TrendingDown style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
          </div>
          {/* Indicador de Tendência (redução é boa, então verde) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: `${themeColors.neon.emerald}20`,
              color: themeColors.neon.emerald,
              fontSize: '0.75rem',
              fontWeight: '600',
            }}
          >
            <ArrowDown size={12} />
            <span>{Math.abs(kpis.expenseTrend).toFixed(1)}% vs mês passado</span>
          </div>
        </div>
        </div>
      </Card>

      {/* Gráficos Refinados */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Gráfico de Área - Fluxo de Caixa Diário */}
        <Card padding="lg">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, marginBottom: '1.5rem', margin: 0 }}>
            Fluxo de Caixa Diário
          </h3>
          <div style={{ width: '100%', height: '300px', minHeight: '300px', position: 'relative' }}>
            {dailyFlowData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} minHeight={300}>
                <AreaChart data={dailyFlowData}>
                <defs>
                  <linearGradient id={`colorIncome-${theme}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeColors.neon.emerald} stopOpacity={0.6}/>
                    <stop offset="50%" stopColor={themeColors.neon.emerald} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={themeColors.neon.emerald} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id={`colorExpense-${theme}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeColors.status.error} stopOpacity={0.6}/>
                    <stop offset="50%" stopColor={themeColors.status.error} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={themeColors.status.error} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: themeColors.textSecondary, fontSize: 12 }}
                  axisLine={{ stroke: themeColors.border }}
                />
                <YAxis
                  tick={{ fill: themeColors.textSecondary, fontSize: 12 }}
                  axisLine={{ stroke: themeColors.border }}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
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
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  name="Receitas" 
                  stroke={themeColors.neon.emerald} 
                  fill={`url(#colorIncome-${theme})`}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name="Despesas" 
                  stroke={themeColors.status.error} 
                  fill={`url(#colorExpense-${theme})`}
                  strokeWidth={2}
                />
              </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: themeColors.textSecondary 
              }}>
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </div>
        </Card>

        {/* Gráfico Donut - Gastos por Categoria */}
        <Card padding="lg">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, marginBottom: '1.5rem', margin: 0 }}>
            Gastos por Categoria
          </h3>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ width: '200px', height: '200px', minWidth: '200px', minHeight: '200px', flexShrink: 0, position: 'relative' }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width={200} height={200} minHeight={200}>
                  <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: themeColors.surface,
                      border: `1px solid ${themeColors.border}`,
                      borderRadius: '0.5rem',
                      color: themeColors.text,
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  width: '100%',
                  color: themeColors.textSecondary 
                }}>
                  <p style={{ fontSize: '0.875rem' }}>Nenhum dado</p>
                </div>
              )}
            </div>
            {/* Legenda Customizada com Bullet Points */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categoryData.map((entry, index) => (
                <div
                  key={entry.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: COLORS[index % COLORS.length],
                      flexShrink: 0,
                      boxShadow: `0 0 0 3px ${COLORS[index % COLORS.length]}33`,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, margin: 0 }}>
                      {entry.name}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                      {formatCurrency(entry.value)}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: '0.25rem 0 0 0' }}>
                      {entry.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Seção de Cartões de Crédito */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
          Meus Cartões
        </h2>
        
        {/* Grid de Cartões: 3 colunas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: themeColors.textSecondary }}>
              Carregando cartões...
            </div>
          ) : cards.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: themeColors.textSecondary }}>
              Nenhum cartão cadastrado
            </div>
          ) : (
            cards.map((card: any) => {
              // Converter formato do Supabase para o formato esperado pelo componente
              const cardFormatted = {
                id: card.id,
                name: card.name,
                limit: card.limit_amount || 0,
                used: 0, // Será calculado via transações
                closingDay: card.closing_day || 10,
                dueDay: card.due_day || 15,
                bank: '',
                color: card.color || '#820AD1',
              };
              return (
                <div
                  key={card.id}
                  style={{
                    position: 'relative',
                  }}
                >
                  {/* Componente de Cartão Visual */}
                  <CreditCardVisual card={cardFormatted} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
