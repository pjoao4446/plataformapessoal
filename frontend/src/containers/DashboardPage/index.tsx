import { FC, useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { ProgressRing } from '../../components/dashboard/ProgressRing';
import { HabitCheckbox } from '../../components/dashboard/HabitCheckbox';
import { PageContainer } from '../../components/layout/PageContainer';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Flame, 
  Dumbbell, 
  Target,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import {
  MOCK_FINANCIAL_GOALS,
  MOCK_TRANSACTIONS,
  calculateBalance,
  getIncomeTotal,
  getExpenseTotal,
} from '../../mocks/database';

// Dados Mockados (mantidos para outras áreas)
const MOCK_DATA = {
  user: {
    name: 'João',
  },
  yearProgress: 14,
  health: {
    dopamineDetox: {
      days: 4,
      status: 'active',
    },
    workout: {
      status: 'pending',
      type: 'Treino de Pernas',
    },
  },
  habits: [
    { id: 1, label: 'Leitura (30min)', checked: true },
    { id: 2, label: 'Zero Açúcar', checked: false },
    { id: 3, label: 'Inglês', checked: true },
  ],
};

/**
 * DashboardPage - Página Principal com Bento Grid Layout
 * Suporte completo a Dark/Light Mode
 * Integrado com database mock para dados financeiros reais
 */
export const DashboardPage: FC = () => {
  const [habits, setHabits] = useState(MOCK_DATA.habits);
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, checked: !h.checked } : h));
  };

  // Cálculos Financeiros Reais
  const totalBalance = useMemo(() => calculateBalance(MOCK_TRANSACTIONS), []);
  const incomeTotal = useMemo(() => getIncomeTotal(MOCK_TRANSACTIONS), []);
  const expenseTotal = useMemo(() => getExpenseTotal(MOCK_TRANSACTIONS), []);

  // Calcular progresso geral das metas financeiras
  const goalsProgress = useMemo(() => {
    if (MOCK_FINANCIAL_GOALS.length === 0) return 0;
    
    const totalProgress = MOCK_FINANCIAL_GOALS.reduce((sum, goal) => {
      const progress = goal.totalTarget > 0 
        ? (goal.currentAmount / goal.totalTarget) * 100 
        : 0;
      return sum + progress;
    }, 0);
    
    return totalProgress / MOCK_FINANCIAL_GOALS.length;
  }, []);

  // Encontrar a meta mais próxima de ser concluída
  const nearestGoal = useMemo(() => {
    if (MOCK_FINANCIAL_GOALS.length === 0) return null;
    
    return MOCK_FINANCIAL_GOALS.reduce((nearest, goal) => {
      const progress = goal.totalTarget > 0 
        ? (goal.currentAmount / goal.totalTarget) * 100 
        : 0;
      
      const nearestProgress = nearest.totalTarget > 0
        ? (nearest.currentAmount / nearest.totalTarget) * 100
        : 0;
      
      // Se a meta atual está mais próxima de 100% e ainda não está completa
      if (progress > nearestProgress && progress < 100) {
        return goal;
      }
      
      return nearest;
    }, MOCK_FINANCIAL_GOALS[0]);
  }, []);

  // Dados para gráfico (últimos 6 meses simulados baseados no saldo atual)
  const chartData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const baseValue = totalBalance * 0.6; // Valor base estimado
    const increment = totalBalance * 0.08; // Incremento mensal estimado
    
    return months.map((month, index) => ({
      month,
      value: Math.max(0, baseValue + (increment * index)),
    }));
  }, [totalBalance]);

  // Calcular crescimento percentual (simulado - comparando com valor anterior)
  const growthPercentage = useMemo(() => {
    if (chartData.length < 2) return 0;
    const current = chartData[chartData.length - 1].value;
    const previous = chartData[chartData.length - 2].value;
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  }, [chartData]);

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Determinar cor do saldo (negativo = laranja/vermelho, positivo = verde/ciano)
  const balanceColor = totalBalance >= 0 
    ? themeColors.neon.emerald 
    : themeColors.neon.orange;

  // Tarefas de foco baseadas na meta mais próxima
  const focusTasks = useMemo(() => {
    const tasks: string[] = [];
    if (nearestGoal) {
      const progress = nearestGoal.totalTarget > 0
        ? (nearestGoal.currentAmount / nearestGoal.totalTarget) * 100
        : 0;
      const remaining = nearestGoal.totalTarget - nearestGoal.currentAmount;
      
      if (remaining > 0) {
        tasks.push(`Meta: ${nearestGoal.title} (${progress.toFixed(0)}% concluído)`);
      }
    }
    tasks.push('Treino de Pernas');
    return tasks;
  }, [nearestGoal]);

  return (
    <PageContainer>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '1.5rem',
          width: '100%',
        }}
        className="grid grid-cols-1 md:grid-cols-3"
      >
        {/* Welcome & Focus Hero - Ocupa 2 colunas */}
        <div
          style={{
            gridColumn: 'span 1',
            '@media (min-width: 768px)': { gridColumn: 'span 2' },
          }}
          className="md:col-span-2"
        >
          <Card variant="neon" padding="lg">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: themeColors.text, marginBottom: '0.5rem', margin: 0 }}>
                  Bom dia, {MOCK_DATA.user.name} 👋
                </h1>
                <p style={{ fontSize: '1.125rem', color: themeColors.textSecondary, marginBottom: '1.5rem', margin: 0 }}>
                  Seu foco hoje é:
                </p>
              </div>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.5rem',
                  background: `linear-gradient(to bottom right, ${themeColors.neon.purple}, ${themeColors.neon.cyan})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              {focusTasks.map((task, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '0.5rem',
                    border: `1px solid ${themeColors.border}`,
                    marginBottom: '1rem',
                  }}
                >
                  <Target style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.purple, flexShrink: 0 }} />
                  <span style={{ color: themeColors.text, fontWeight: '500' }}>{task}</span>
                </div>
              ))}
            </div>

            {/* Year Progress Bar */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: themeColors.textSecondary }}>Progresso do Ano</span>
                <span style={{ color: themeColors.text, fontWeight: 'bold' }}>
                  {MOCK_DATA.yearProgress}% de 2026 concluído
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '0.75rem',
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}>
                <div
                  style={{
                    height: '100%',
                    background: `linear-gradient(to right, ${themeColors.neon.purple}, ${themeColors.neon.cyan})`,
                    borderRadius: '9999px',
                    transition: 'width 1s ease',
                    width: `${MOCK_DATA.yearProgress}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Financial Snapshot - Ocupa 1 coluna */}
        <Card variant="glass" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
              Patrimônio & Meta
            </h2>
            {totalBalance >= 0 ? (
              <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.emerald }} />
            ) : (
              <TrendingDown style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.orange }} />
            )}
          </div>

          {/* Chart */}
          <div style={{ height: '8rem', marginBottom: '1rem', width: '100%' }}>
            <ResponsiveContainer width="100%" height={128}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorFinancial" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={balanceColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={balanceColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={balanceColor}
                  strokeWidth={2}
                  fill="url(#colorFinancial)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Total */}
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: balanceColor, marginTop: '1rem', margin: 0 }}>
              {formatCurrency(totalBalance)}
            </div>
            {growthPercentage !== 0 && (
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.5rem',
                backgroundColor: `${balanceColor}33`,
                color: balanceColor,
                fontSize: '0.75rem',
                fontWeight: '600',
                borderRadius: '0.25rem',
                marginTop: '0.5rem',
              }}>
                {growthPercentage > 0 ? '+' : ''}{growthPercentage}% vs mês passado
              </span>
            )}
          </div>
        </Card>

        {/* Health & Bio - Ocupa 1 coluna */}
        <Card padding="lg">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, marginBottom: '1.5rem', margin: 0 }}>
            Corpo & Mente
          </h2>

          <div>
            {/* Dopamine Detox */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Flame style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.orange }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>Dopamine Detox</p>
                  <p style={{ color: themeColors.text, fontWeight: '600', margin: 0 }}>
                    {MOCK_DATA.health.dopamineDetox.days} dias seguidos
                  </p>
                </div>
              </div>
              <ProgressRing
                progress={(MOCK_DATA.health.dopamineDetox.days / 7) * 100}
                size={60}
                color={themeColors.neon.orange}
                label={`${MOCK_DATA.health.dopamineDetox.days}/7`}
              />
            </div>

            {/* Workout */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: `1px solid ${themeColors.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Dumbbell style={{ width: '1.25rem', height: '1.25rem', color: themeColors.textMuted }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>Treino</p>
                  <p style={{ color: themeColors.textMuted, fontWeight: '600', margin: 0 }}>
                    {MOCK_DATA.health.workout.status === 'pending' ? 'Pendente hoje' : 'Concluído'}
                  </p>
                </div>
              </div>
              <ProgressRing
                progress={MOCK_DATA.health.workout.status === 'pending' ? 0 : 100}
                size={60}
                color={themeColors.textMuted}
                label={MOCK_DATA.health.workout.status === 'pending' ? '0%' : '100%'}
              />
            </div>
          </div>
        </Card>

        {/* Habit Tracker - Ocupa 1 coluna */}
        <Card variant="glass" padding="lg">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, marginBottom: '1.5rem', margin: 0 }}>
            Hábitos de Hoje
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            {habits.map((habit) => (
              <HabitCheckbox
                key={habit.id}
                label={habit.label}
                checked={habit.checked}
                onChange={() => toggleHabit(habit.id)}
              />
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: `1px solid ${themeColors.border}` }}>
            <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, margin: 0 }}>
              {habits.filter(h => h.checked).length} de {habits.length} concluídos
            </p>
          </div>
        </Card>

        {/* Project Status / Metas Financeiras - Ocupa 2 colunas */}
        <div
          style={{
            gridColumn: 'span 1',
            '@media (min-width: 768px)': { gridColumn: 'span 2' },
          }}
          className="md:col-span-2"
        >
          <Card variant="neon" padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                Metas Financeiras
              </h2>
              <Wallet style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.purple }} />
            </div>

            {/* Progresso Geral */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: `1px solid ${themeColors.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: themeColors.textSecondary, fontSize: '0.875rem' }}>Progresso Geral</span>
                <span style={{ color: themeColors.text, fontWeight: '600', fontSize: '0.875rem' }}>
                  {goalsProgress.toFixed(1)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '0.5rem',
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}>
                <div
                  style={{
                    height: '100%',
                    background: `linear-gradient(to right, ${themeColors.neon.purple}, ${themeColors.neon.cyan})`,
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease',
                    width: `${Math.min(goalsProgress, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Lista de Metas */}
            <div>
              {MOCK_FINANCIAL_GOALS.slice(0, 2).map((goal) => {
                const progress = goal.totalTarget > 0 
                  ? (goal.currentAmount / goal.totalTarget) * 100 
                  : 0;
                const progressColor = goal.type === 'investment' 
                  ? themeColors.neon.emerald 
                  : themeColors.neon.orange;

                return (
                  <div key={goal.id} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: themeColors.text, fontWeight: '500' }}>{goal.title}</span>
                        {goal.type === 'investment' ? (
                          <TrendingUp style={{ width: '1rem', height: '1rem', color: themeColors.neon.emerald }} />
                        ) : (
                          <TrendingDown style={{ width: '1rem', height: '1rem', color: themeColors.neon.orange }} />
                        )}
                      </div>
                      <span style={{ color: themeColors.textSecondary, fontSize: '0.875rem' }}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '0.5rem',
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                    }}>
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: progressColor,
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease',
                          width: `${Math.min(progress, 100)}%`,
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span style={{ color: themeColors.textMuted, fontSize: '0.75rem' }}>
                        {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.totalTarget)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
