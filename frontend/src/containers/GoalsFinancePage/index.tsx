import { useState } from 'react';
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
import { MOCK_FINANCIAL_GOALS, type FinancialGoal, type QuarterStatus } from '../../mocks/database';

/**
 * GoalsFinancePage - Página de Metas Financeiras
 * Visualização hierárquica: Ano > Trimestre > Mês
 * Design System: VertexGuard Premium Dark/Light - Redesign Visual
 */
export const GoalsFinancePage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  // Calcular KPIs do Ano
  const totalTarget = MOCK_FINANCIAL_GOALS.reduce((sum, goal) => sum + goal.totalTarget, 0);
  const totalCurrent = MOCK_FINANCIAL_GOALS.reduce((sum, goal) => {
    if (goal.type === 'investment') {
      return sum + goal.currentAmount;
    } else {
      // Para dívidas, o progresso é o quanto já foi pago
      return sum + (goal.totalTarget - goal.currentAmount);
    }
  }, 0);
  const progressPercentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getQuarterStatusIcon = (status: QuarterStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 style={{ width: '1.5rem', height: '1.5rem', color: themeColors.status.success }} />;
      case 'failed':
        return <XCircle style={{ width: '1.5rem', height: '1.5rem', color: themeColors.status.error }} />;
      case 'pending':
        return <Clock style={{ width: '1.5rem', height: '1.5rem', color: themeColors.textMuted }} />;
    }
  };

  const getQuarterStatusColor = (status: QuarterStatus) => {
    switch (status) {
      case 'completed':
        return themeColors.status.success;
      case 'failed':
        return themeColors.status.error;
      case 'pending':
        return themeColors.textMuted;
    }
  };

  // Verificar se quarter passou (completed ou failed)
  const isQuarterPassed = (status: QuarterStatus): boolean => {
    return status === 'completed' || status === 'failed';
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
        {MOCK_FINANCIAL_GOALS.map((goal: FinancialGoal) => {
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
                          {goal.title}
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
                    {(['q1', 'q2', 'q3', 'q4'] as const).map((quarterKey, idx) => {
                      const quarter = goal.quarters[quarterKey];
                      const isPassed = isQuarterPassed(quarter.status);
                      const prevQuarter = idx > 0 ? goal.quarters[(['q1', 'q2', 'q3', 'q4'] as const)[idx - 1]] : null;
                      const prevIsPassed = prevQuarter ? isQuarterPassed(prevQuarter.status) : false;
                      
                      if (!isPassed && !prevIsPassed) return null;
                      
                      const segmentWidth = 25; // 25% por quarter
                      const leftPosition = idx * segmentWidth;
                      
                      return (
                        <div
                          key={`line-${quarterKey}`}
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
                      {(['q1', 'q2', 'q3', 'q4'] as const).map((quarterKey) => {
                        const quarter = goal.quarters[quarterKey];
                        const quarterProgress = quarter.target > 0 
                          ? (quarter.actual / quarter.target) * 100 
                          : 0;
                        const statusColor = getQuarterStatusColor(quarter.status);
                        const isPassed = isQuarterPassed(quarter.status);

                        return (
                          <div
                            key={quarterKey}
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
                              {getQuarterStatusIcon(quarter.status)}
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
                                {quarterKey.toUpperCase()}
                              </p>
                              
                              {/* Valor Atingido - Destaque */}
                              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0, marginBottom: '0.25rem' }}>
                                {formatCurrency(quarter.actual)}
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
                                onClick={() => console.log(`Registrar pagamento/aporte para ${quarterKey}`)}
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
        })}
      </div>
    </PageContainer>
  );
};
