import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { Accordion } from '../../components/ui/Accordion';
import { ProgressRing } from '../../components/dashboard/ProgressRing';
import { Button } from '../../components/ui/Button';
import { PageContainer } from '../../components/layout/PageContainer';
import { 
  Wallet, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Edit3,
  CheckCircle2,
  Clock,
  XCircle,
  Target,
  DollarSign,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import type { FinancialGoal, QuarterStatus } from '../../mocks/database';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

/**
 * GoalsFinancePage - Página de Metas Financeiras
 * Visualização hierárquica: Ano > Trimestre > Mês
 * Design System: VertexGuard Premium Dark/Light - Redesign Visual
 */
export const GoalsFinancePage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [financialGoals, setFinancialGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar metas financeiras do Supabase
  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Por enquanto, deixar vazio pois pode não haver tabela de metas financeiras
      // Se houver, buscar assim:
      // const { data } = await supabase
      //   .from('financial_goals')
      //   .select('*')
      //   .eq('user_id', user.id);
      // setFinancialGoals(data || []);
      
      // Dados mockados para demonstração
      const mockGoals: any[] = [
        {
          id: '1',
          name: 'Reserva de Emergência',
          type: 'investment',
          totalTarget: 50000,
          currentAmount: 18500,
          deadline: '2024-12-31',
          quarters: [
            {
              quarter: 1,
              target: 12500,
              current: 4500,
              months: [
                { month: 1, target: 4167, current: 1500 },
                { month: 2, target: 4167, current: 1500 },
                { month: 3, target: 4166, current: 1500 },
              ],
            },
            {
              quarter: 2,
              target: 12500,
              current: 5000,
              months: [
                { month: 4, target: 4167, current: 1700 },
                { month: 5, target: 4167, current: 1600 },
                { month: 6, target: 4166, current: 1700 },
              ],
            },
            {
              quarter: 3,
              target: 12500,
              current: 5000,
              months: [
                { month: 7, target: 4167, current: 1800 },
                { month: 8, target: 4167, current: 1600 },
                { month: 9, target: 4166, current: 1600 },
              ],
            },
            {
              quarter: 4,
              target: 12500,
              current: 4000,
              months: [
                { month: 10, target: 4167, current: 1500 },
                { month: 11, target: 4167, current: 1500 },
                { month: 12, target: 4166, current: 1000 },
              ],
            },
          ],
        },
        {
          id: '2',
          name: 'Quitar Financiamento do Carro',
          type: 'debt',
          totalTarget: 35000,
          currentAmount: 28000,
          deadline: '2024-12-31',
          quarters: [
            {
              quarter: 1,
              target: 8750,
              current: 8750,
              months: [
                { month: 1, target: 2917, current: 2917 },
                { month: 2, target: 2917, current: 2917 },
                { month: 3, target: 2916, current: 2916 },
              ],
            },
            {
              quarter: 2,
              target: 8750,
              current: 8750,
              months: [
                { month: 4, target: 2917, current: 2917 },
                { month: 5, target: 2917, current: 2917 },
                { month: 6, target: 2916, current: 2916 },
              ],
            },
            {
              quarter: 3,
              target: 8750,
              current: 7000,
              months: [
                { month: 7, target: 2917, current: 2500 },
                { month: 8, target: 2917, current: 2000 },
                { month: 9, target: 2916, current: 2500 },
              ],
            },
            {
              quarter: 4,
              target: 8750,
              current: 3500,
              months: [
                { month: 10, target: 2917, current: 1500 },
                { month: 11, target: 2917, current: 1000 },
                { month: 12, target: 2916, current: 1000 },
              ],
            },
          ],
        },
        {
          id: '3',
          name: 'Investimento em Ações',
          type: 'investment',
          totalTarget: 100000,
          currentAmount: 42000,
          deadline: '2024-12-31',
          quarters: [
            {
              quarter: 1,
              target: 25000,
              current: 12000,
              months: [
                { month: 1, target: 8333, current: 4000 },
                { month: 2, target: 8333, current: 4000 },
                { month: 3, target: 8334, current: 4000 },
              ],
            },
            {
              quarter: 2,
              target: 25000,
              current: 15000,
              months: [
                { month: 4, target: 8333, current: 5000 },
                { month: 5, target: 8333, current: 5000 },
                { month: 6, target: 8334, current: 5000 },
              ],
            },
            {
              quarter: 3,
              target: 25000,
              current: 10000,
              months: [
                { month: 7, target: 8333, current: 3500 },
                { month: 8, target: 8333, current: 3000 },
                { month: 9, target: 8334, current: 3500 },
              ],
            },
            {
              quarter: 4,
              target: 25000,
              current: 5000,
              months: [
                { month: 10, target: 8333, current: 2000 },
                { month: 11, target: 8333, current: 2000 },
                { month: 12, target: 8334, current: 1000 },
              ],
            },
          ],
        },
      ];
      
      setFinancialGoals(mockGoals);
    } catch (err) {
      console.error('Erro ao carregar metas financeiras:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular KPIs do Ano
  const totalTarget = financialGoals.reduce((sum, goal) => sum + (goal.totalTarget || 0), 0);
  const totalCurrent = financialGoals.reduce((sum, goal) => {
    if (goal.type === 'investment') {
      return sum + (goal.currentAmount || 0);
    } else {
      // Para dívidas, o progresso é o quanto já foi pago
      return sum + ((goal.totalTarget || 0) - (goal.currentAmount || 0));
    }
  }, 0);
  const progressPercentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  type QuarterStatusType = 'completed' | 'failed' | 'pending';

  const getQuarterStatusIcon = (status: QuarterStatusType) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 style={{ width: '1.5rem', height: '1.5rem', color: themeColors.status.success }} />;
      case 'failed':
        return <XCircle style={{ width: '1.5rem', height: '1.5rem', color: themeColors.status.error }} />;
      case 'pending':
        return <Clock style={{ width: '1.5rem', height: '1.5rem', color: themeColors.textMuted }} />;
    }
  };

  const getQuarterStatusColor = (status: QuarterStatusType) => {
    switch (status) {
      case 'completed':
        return themeColors.status.success;
      case 'failed':
        return themeColors.status.error;
      case 'pending':
        return themeColors.textMuted;
    }
  };

  // Função auxiliar para calcular status de um quarter baseado no progresso
  const calculateQuarterStatus = (quarter: QuarterStatus): 'completed' | 'failed' | 'pending' => {
    if (!quarter) return 'pending';
    const progress = quarter.target > 0 ? (quarter.current / quarter.target) * 100 : 0;
    // Verificar se o trimestre já passou (baseado na data atual)
    const currentDate = new Date();
    const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
    
    if (quarter.quarter < currentQuarter) {
      // Trimestre já passou
      return progress >= 100 ? 'completed' : 'failed';
    }
    return 'pending';
  };

  // Verificar se quarter passou (completed ou failed)
  const isQuarterPassed = (status: 'completed' | 'failed' | 'pending'): boolean => {
    return status === 'completed' || status === 'failed';
  };

  // Função auxiliar para obter quarter por número
  const getQuarterByNumber = (quarters: QuarterStatus[], quarterNum: number): QuarterStatus | undefined => {
    return quarters.find(q => q.quarter === quarterNum);
  };

  return (
    <PageContainer>
      {/* Botão Nova Meta - Flutuante */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="primary"
          onClick={() => console.log('Nova meta')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus style={{ width: '1rem', height: '1rem' }} />
          Nova Meta
        </Button>
      </div>

      {/* Header - Grid de 3 Cards KPIs (Glassmorphism) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Card 1: Meta Anual Total */}
        <div
          style={{
            background: theme === 'dark'
              ? 'rgba(26, 29, 45, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${themeColors.border}`,
            borderRadius: '1.5rem',
            boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 20px ${themeColors.neon.purple}10`,
          }}
        >
          <Card variant="glass" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                backgroundColor: `${themeColors.neon.purple}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Target style={{ width: '1.5rem', height: '1.5rem', color: themeColors.neon.purple }} />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginBottom: '0.25rem', margin: 0 }}>
                Meta Anual Total
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                {formatCurrency(totalTarget)}
              </p>
            </div>
          </div>
          </Card>
        </div>

        {/* Card 2: Executado */}
        <div
          style={{
            background: theme === 'dark'
              ? 'rgba(26, 29, 45, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${themeColors.border}`,
            borderRadius: '1.5rem',
            boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 20px ${themeColors.neon.emerald}10`,
          }}
        >
          <Card variant="glass" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                backgroundColor: `${themeColors.neon.emerald}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet style={{ width: '1.5rem', height: '1.5rem', color: themeColors.neon.emerald }} />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginBottom: '0.25rem', margin: 0 }}>
                Executado
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: themeColors.neon.emerald, margin: 0 }}>
                {formatCurrency(totalCurrent)}
              </p>
            </div>
          </div>
          </Card>
        </div>

        {/* Card 3: Progresso (Circular Progress Ring) */}
        <div
          style={{
            background: theme === 'dark'
              ? 'rgba(26, 29, 45, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${themeColors.border}`,
            borderRadius: '1.5rem',
            boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 20px ${themeColors.neon.cyan}10`,
          }}
        >
          <Card variant="glass" padding="lg">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
              Progresso do Ano
            </p>
            <ProgressRing
              progress={progressPercentage}
              size={100}
              strokeWidth={8}
              color={themeColors.neon.purple}
            />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
              {progressPercentage.toFixed(1)}%
            </p>
          </div>
          </Card>
        </div>
      </div>

      {/* Lista de Metas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: themeColors.textSecondary }}>
            Carregando metas financeiras...
          </div>
        ) : financialGoals.length === 0 ? (
          <Card padding="lg">
            <div style={{ padding: '3rem', textAlign: 'center', color: themeColors.textSecondary }}>
              <p style={{ fontSize: '1rem', margin: '0 0 1rem 0' }}>
                Nenhuma meta financeira cadastrada.
              </p>
              <Button variant="primary">
                <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                Criar Primeira Meta
              </Button>
            </div>
          </Card>
        ) : (
          financialGoals.map((goal: any) => {
          const progress = goal.totalTarget > 0 
            ? (goal.currentAmount / goal.totalTarget) * 100 
            : 0;
          const borderColor = goal.type === 'investment' 
            ? themeColors.neon.emerald 
            : themeColors.neon.orange;

          return (
            <div
              key={goal.id}
              style={{
                borderLeft: `4px solid ${borderColor}`,
                backgroundColor: theme === 'dark' ? '#1A1D2D' : '#F9FAFB',
                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 20px ${borderColor}10`,
              }}
            >
              <Accordion
                isOpen={expandedGoal === goal.id}
                onToggle={() => {
                  setExpandedGoal(expandedGoal === goal.id ? null : goal.id);
                }}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    {/* Informações da Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      {/* Ícone do Tipo */}
                      {goal.type === 'investment' ? (
                        <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: themeColors.neon.emerald }} />
                      ) : (
                        <TrendingDown style={{ width: '1.5rem', height: '1.5rem', color: themeColors.neon.orange }} />
                      )}

                      {/* Título e Valores */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: themeColors.text, margin: 0, marginBottom: '0.25rem' }}>
                          {goal.name || goal.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                          <span style={{ color: themeColors.textSecondary }}>
                            Meta: <strong style={{ color: themeColors.text }}>{formatCurrency(goal.totalTarget)}</strong>
                          </span>
                          <span style={{ color: themeColors.textMuted }}>•</span>
                          <span style={{ color: themeColors.textSecondary }}>
                            Atual: <strong style={{ color: borderColor }}>{formatCurrency(goal.currentAmount)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso Mini */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '0.5rem',
                          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            backgroundColor: borderColor,
                            borderRadius: '9999px',
                            width: `${Math.min(progress, 100)}%`,
                            transition: 'width 0.3s ease-in-out',
                            boxShadow: `0 0 10px ${borderColor}66`,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.text, minWidth: '3rem', textAlign: 'right' }}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                }
                defaultOpen={expandedGoal === goal.id}
              >
                {/* Timeline dos Trimestres - Estilo Metro Map */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${themeColors.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                      Timeline Trimestral
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('Ajuste manual')}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Edit3 style={{ width: '0.875rem', height: '0.875rem' }} />
                      Ajuste Manual
                    </Button>
                  </div>

                  {/* Timeline Visual - Metro Map Style */}
                  <div style={{ position: 'relative', padding: '2rem 0' }}>
                    {/* Linha Conectora Grossa */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '3rem',
                        left: '0',
                        right: '0',
                        height: '4px',
                        backgroundColor: themeColors.border,
                        zIndex: 0,
                      }}
                    />
                    
                    {/* Linha Conectora Colorida (para quarters passados) */}
                    {([1, 2, 3, 4] as const).map((quarterNum, idx) => {
                      const quarter = getQuarterByNumber(goal.quarters, quarterNum);
                      if (!quarter) return null;
                      
                      const quarterStatus = calculateQuarterStatus(quarter);
                      const isPassed = isQuarterPassed(quarterStatus);
                      const prevQuarter = idx > 0 ? getQuarterByNumber(goal.quarters, quarterNum - 1) : null;
                      const prevIsPassed = prevQuarter ? isQuarterPassed(calculateQuarterStatus(prevQuarter)) : false;
                      
                      if (!isPassed && !prevIsPassed) return null;
                      
                      const segmentWidth = 25; // 25% por quarter
                      const leftPosition = idx * segmentWidth;
                      
                      return (
                        <div
                          key={`line-q${quarterNum}`}
                          style={{
                            position: 'absolute',
                            top: '3rem',
                            left: `${leftPosition}%`,
                            width: `${segmentWidth}%`,
                            height: '4px',
                            backgroundColor: isPassed || prevIsPassed ? borderColor : themeColors.border,
                            zIndex: 1,
                            transition: 'background-color 0.3s ease',
                          }}
                        />
                      );
                    })}

                    {/* Quarters */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', position: 'relative', zIndex: 2 }}>
                      {([1, 2, 3, 4] as const).map((quarterNum) => {
                        const quarter = getQuarterByNumber(goal.quarters, quarterNum);
                        if (!quarter) {
                          // Renderizar placeholder vazio se quarter não existir
                          return (
                            <div key={`q${quarterNum}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.3 }}>
                              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)', border: `4px solid ${themeColors.border}` }} />
                              <div style={{ fontSize: '0.875rem', color: themeColors.textSecondary }}>Q{quarterNum}</div>
                            </div>
                          );
                        }
                        
                        const quarterProgress = quarter.target > 0 
                          ? (quarter.current / quarter.target) * 100 
                          : 0;
                        const quarterStatus = calculateQuarterStatus(quarter);
                        const statusColor = getQuarterStatusColor(quarterStatus);
                        const isPassed = isQuarterPassed(quarterStatus);

                        return (
                          <div
                            key={`q${quarterNum}`}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '1rem',
                            }}
                          >
                            {/* Nó da Timeline - Círculo Grande */}
                            <div
                              style={{
                                width: '4rem',
                                height: '4rem',
                                borderRadius: '50%',
                                backgroundColor: isPassed 
                                  ? `${statusColor}33` 
                                  : theme === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.05)' 
                                  : 'rgba(0, 0, 0, 0.05)',
                                border: `4px solid ${isPassed ? statusColor : themeColors.border}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                zIndex: 3,
                                boxShadow: isPassed 
                                  ? `0 0 20px ${statusColor}66, 0 4px 6px -1px rgba(0, 0, 0, 0.1)` 
                                  : 'none',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {getQuarterStatusIcon(quarterStatus)}
                            </div>

                            {/* Card do Quarter - Com Fundo Sutil */}
                            <div
                              style={{
                                width: '100%',
                                padding: '1.25rem',
                                backgroundColor: theme === 'dark'
                                  ? 'rgba(255, 255, 255, 0.03)'
                                  : 'rgba(0, 0, 0, 0.02)',
                                border: `1px solid ${themeColors.border}`,
                                borderRadius: '0.75rem',
                                textAlign: 'center',
                                backdropFilter: 'blur(4px)',
                              }}
                            >
                              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: themeColors.textSecondary, margin: 0, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Q{quarterNum}
                              </p>
                              
                              {/* Valor Atingido - Destaque */}
                              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0, marginBottom: '0.25rem' }}>
                                {formatCurrency(quarter.current)}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, margin: 0, marginBottom: '1rem' }}>
                                de {formatCurrency(quarter.target)}
                              </p>
                              
                              {/* Barra de Progresso do Quarter */}
                              <div
                                style={{
                                  width: '100%',
                                  height: '0.5rem',
                                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                  borderRadius: '9999px',
                                  overflow: 'hidden',
                                  marginBottom: '1rem',
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    backgroundColor: statusColor,
                                    borderRadius: '9999px',
                                    width: `${Math.min(quarterProgress, 100)}%`,
                                    transition: 'width 0.3s ease-in-out',
                                    boxShadow: `0 0 8px ${statusColor}66`,
                                  }}
                                />
                              </div>

                              {/* Botão de Ação - Largura Total */}
                              <Button
                                variant={isPassed ? 'secondary' : 'primary'}
                                size="sm"
                                onClick={() => console.log(`Registrar pagamento/aporte para Q${quarterNum}`)}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem',
                                }}
                              >
                                <DollarSign style={{ width: '0.875rem', height: '0.875rem' }} />
                                {isPassed ? 'Ajustar Valor' : 'Registrar Pagamento'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Accordion>
            </div>
          );
          })
        )}
      </div>
    </PageContainer>
  );
};
