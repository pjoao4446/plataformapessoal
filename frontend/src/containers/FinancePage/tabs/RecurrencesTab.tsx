import { FC, useMemo, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { getTheme } from '../../../styles/theme';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Cell
} from 'recharts';
import { Repeat, CreditCard, FileText, Building2, Calendar, Music, Video, Home, Smartphone, LayoutDashboard, AlertCircle, Plus } from 'lucide-react';
import { CreateRecurrenceModal } from '../../../components/modals/CreateRecurrenceModal';

/**
 * RecurrencesTab - Aba de Recorrências
 * Transações fixas, parceladas e recorrentes com projeção de 12 meses
 */
type ViewMode = 'overview' | 'credit_cards' | 'loans' | 'fixed';

export const RecurrencesTab: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);

  // Dados mockados de recorrências
  const mockRecurrences = useMemo(() => [
    {
      id: '1',
      type: 'subscription' as const,
      description: 'Netflix',
      amount: 45.90,
      dueDay: 10,
      status: 'active' as const,
    },
    {
      id: '2',
      type: 'subscription' as const,
      description: 'Spotify Premium',
      amount: 21.90,
      dueDay: 15,
      status: 'active' as const,
    },
    {
      id: '3',
      type: 'subscription' as const,
      description: 'Academia Smart Fit',
      amount: 99.90,
      dueDay: 5,
      status: 'active' as const,
    },
    {
      id: '4',
      type: 'subscription' as const,
      description: 'Aluguel',
      amount: 1500.00,
      dueDay: 1,
      status: 'active' as const,
    },
    {
      id: '5',
      type: 'installment' as const,
      description: 'Notebook Dell',
      amount: 350.00,
      dueDay: 5,
      status: 'active' as const,
      totalInstallments: 12,
      currentInstallment: 3,
    },
    {
      id: '6',
      type: 'installment' as const,
      description: 'iPhone 15 Pro',
      amount: 450.00,
      dueDay: 15,
      status: 'active' as const,
      totalInstallments: 10,
      currentInstallment: 2,
    },
    {
      id: '7',
      type: 'loan' as const,
      description: 'Empréstimo Consignado',
      amount: 800.00,
      dueDay: 1,
      status: 'active' as const,
      totalInstallments: 24,
      currentInstallment: 8,
    },
    {
      id: '8',
      type: 'loan' as const,
      description: 'Financiamento Carro',
      amount: 1200.00,
      dueDay: 10,
      status: 'active' as const,
      totalInstallments: 60,
      currentInstallment: 12,
    },
  ], []);

  // Filtrar recorrências conforme viewMode
  const filteredRecurrences = useMemo(() => {
    switch (viewMode) {
      case 'credit_cards':
        return mockRecurrences.filter(r => r.type === 'installment');
      case 'loans':
        return mockRecurrences.filter(r => r.type === 'loan');
      case 'fixed':
        return mockRecurrences.filter(r => r.type === 'subscription');
      default:
        return mockRecurrences;
    }
  }, [mockRecurrences, viewMode]);

  // Renda mensal mockada (para cálculo de %)
  const mockMonthlyIncome = 8000;

  // Calcular % da renda comprometida
  const calculateIncomePercentage = (value: number) => {
    return ((value / mockMonthlyIncome) * 100).toFixed(1);
  };

  // Calcular KPIs conforme viewMode
  const kpis = useMemo(() => {
    switch (viewMode) {
      case 'credit_cards': {
        const totalInstallments = filteredRecurrences.reduce((sum, r) => {
          if (r.totalInstallments && r.currentInstallment) {
            const remaining = r.totalInstallments - r.currentInstallment;
            return sum + (r.amount * remaining);
          }
          return sum;
        }, 0);
        return { 
          title: 'Total em Parcelas a Vencer',
          value: totalInstallments,
          icon: CreditCard,
          color: themeColors.neon.purple,
        };
      }
      case 'loans': {
        const totalDebt = filteredRecurrences.reduce((sum, r) => {
          if (r.totalInstallments && r.currentInstallment) {
            const remaining = r.totalInstallments - r.currentInstallment;
            return sum + (r.amount * remaining);
          }
          return sum;
        }, 0);
        return {
          title: 'Saldo Devedor Total',
          value: totalDebt,
          icon: Building2,
          color: themeColors.status.error,
        };
      }
      case 'fixed': {
        const totalFixed = filteredRecurrences.reduce((sum, r) => sum + r.amount, 0);
        return {
          title: 'Custo de Vida Basal',
          value: totalFixed,
          icon: Repeat,
          color: themeColors.neon.orange,
        };
      }
      default: {
        const fixedMonthly = mockRecurrences
          .filter(r => r.type === 'subscription')
          .reduce((sum, r) => sum + r.amount, 0);
        
        const installmentRemaining = mockRecurrences
          .filter(r => r.type === 'installment' || r.type === 'loan')
          .reduce((sum, r) => {
            if (r.totalInstallments && r.currentInstallment) {
              const remaining = r.totalInstallments - r.currentInstallment;
              return sum + (r.amount * remaining);
            }
            return sum;
          }, 0);

        return { 
          fixedMonthly, 
          installmentRemaining,
          title: null,
          value: null,
          icon: null,
          color: null,
        };
      }
    }
  }, [mockRecurrences, filteredRecurrences, viewMode, themeColors]);

  // Dados para gráfico de projeção de 12 meses (filtrado conforme viewMode)
  const projectionData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      // Calcular total do mês baseado no filtro
      let total = 0;
      
      if (viewMode === 'overview') {
        // Adicionar assinaturas (fixas mensais)
        mockRecurrences
          .filter(r => r.type === 'subscription')
          .forEach(r => {
            total += r.amount;
          });
        
        // Adicionar parcelas ativas
        mockRecurrences
          .filter(r => (r.type === 'installment' || r.type === 'loan') && r.totalInstallments && r.currentInstallment)
          .forEach(r => {
            const remaining = r.totalInstallments - r.currentInstallment;
            if (i < remaining) {
              total += r.amount;
            }
          });
      } else {
        // Filtrar apenas os itens do tipo selecionado
        filteredRecurrences.forEach(r => {
          if (r.type === 'subscription') {
            // Fixas sempre aparecem
            total += r.amount;
          } else if ((r.type === 'installment' || r.type === 'loan') && r.totalInstallments && r.currentInstallment) {
            // Parcelas/Empréstimos: só aparecem se ainda tiverem parcelas restantes
            const remaining = r.totalInstallments - r.currentInstallment;
            if (i < remaining) {
              total += r.amount;
            }
          }
        });
      }

      // Calcular se é um mês de alto comprometimento (> 50% da renda)
      const isHighCommitment = total > mockMonthlyIncome * 0.5;
      const dueCount = filteredRecurrences.filter(r => r.status === 'active').length;

      return {
        month: monthName,
        total: total,
        isHighCommitment,
        dueCount,
      };
    });

    return months;
  }, [mockRecurrences, filteredRecurrences, viewMode]);

  // Função para determinar cor da barra baseada no valor
  const getBarColor = (value: number, isHighCommitment: boolean) => {
    if (isHighCommitment) {
      // Gradiente de roxo para vermelho
      return `url(#gradient-danger-${value})`;
    }
    return themeColors.neon.purple;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getRecurrenceIcon = (type: string, description?: string) => {
    if (type === 'subscription') {
      const desc = description?.toLowerCase() || '';
      if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('youtube')) {
        return desc.includes('spotify') ? Music : Video;
      }
      if (desc.includes('aluguel') || desc.includes('condomínio')) {
        return Home;
      }
      if (desc.includes('celular') || desc.includes('telefone')) {
        return Smartphone;
      }
      return Repeat;
    }
    switch (type) {
      case 'installment':
        return CreditCard;
      case 'loan':
        return Building2;
      default:
        return FileText;
    }
  };

  const getRecurrenceTypeLabel = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'Assinatura';
      case 'installment':
        return 'Parcelamento';
      case 'loan':
        return 'Empréstimo';
      default:
        return 'Outro';
    }
  };


  const viewModes: Array<{ id: ViewMode; label: string; icon: typeof LayoutDashboard }> = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'credit_cards', label: 'Cartões de Crédito', icon: CreditCard },
    { id: 'loans', label: 'Empréstimos', icon: Building2 },
    { id: 'fixed', label: 'Fixas', icon: Repeat },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header com Sub-Menu */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
            Recorrências e Compromissos
          </h2>
          <Button
            variant="primary"
            onClick={() => setIsRecurrenceModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            Nova Recorrência
          </Button>
        </div>
        
        {/* Sub-Menu (Pills) */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '9999px',
                  backgroundColor: isActive
                    ? themeColors.neon.purple
                    : theme === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)',
                  border: `1px solid ${isActive ? themeColors.neon.purple : themeColors.border}`,
                  color: isActive ? 'white' : themeColors.textSecondary,
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = themeColors.neon.purple;
                    e.currentTarget.style.color = themeColors.text;
                    e.currentTarget.style.backgroundColor = theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = themeColors.border;
                    e.currentTarget.style.color = themeColors.textSecondary;
                    e.currentTarget.style.backgroundColor = theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)';
                  }
                }}
              >
                <Icon size={16} />
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPIs - Renderização Condicional */}
      {viewMode === 'overview' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Card Custo Fixo Mensal */}
          <Card
            variant="neon"
            padding="lg"
            style={{
              background: `linear-gradient(135deg, ${themeColors.neon.purple} 0%, ${themeColors.neon.purple}88 100%)`,
              border: `1px solid ${themeColors.neon.purple}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontWeight: '500' }}>
                Total Fixas
              </p>
              <Repeat style={{ width: '1.5rem', height: '1.5rem', color: 'white', opacity: 0.9 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
              <p
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}
              >
                {formatCurrency(kpis.fixedMonthly || 0)}
              </p>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                }}
              >
                {calculateIncomePercentage(kpis.fixedMonthly || 0)}% da Renda
              </span>
            </div>
          </Card>

          {/* Card Total Parcelado Restante */}
          <Card
            variant="neon"
            padding="lg"
            style={{
              background: `linear-gradient(135deg, ${themeColors.neon.orange} 0%, ${themeColors.neon.orange}88 100%)`,
              border: `1px solid ${themeColors.neon.orange}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontWeight: '500' }}>
                Total Parcelas
              </p>
              <CreditCard style={{ width: '1.5rem', height: '1.5rem', color: 'white', opacity: 0.9 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
              <p
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#FB7185',
                  margin: 0,
                }}
              >
                {formatCurrency(kpis.installmentRemaining || 0)}
              </p>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                }}
              >
                {calculateIncomePercentage(kpis.installmentRemaining || 0)}% da Renda
              </span>
            </div>
          </Card>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {kpis.title && kpis.icon && (
            <Card
              variant="neon"
              padding="lg"
              style={{
                background: `linear-gradient(135deg, ${kpis.color} 0%, ${kpis.color}88 100%)`,
                border: `1px solid ${kpis.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontWeight: '500' }}>
                  {kpis.title}
                </p>
                {(() => {
                  const Icon = kpis.icon;
                  return <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'white', opacity: 0.9 }} />;
                })()}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                <p
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: viewMode === 'loans' || viewMode === 'credit_cards' ? '#FB7185' : viewMode === 'fixed' ? 'white' : 'white',
                    margin: 0,
                  }}
                >
                  {formatCurrency(kpis.value || 0)}
                </p>
                {(viewMode === 'loans' || viewMode === 'credit_cards' || viewMode === 'fixed') && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {calculateIncomePercentage(kpis.value || 0)}% da Renda
                  </span>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Layout com Gráfico e Timeline */}
      {(viewMode === 'overview' || filteredRecurrences.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
          {/* Gráfico de Projeção */}
          <Card padding="lg">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, marginBottom: '1.5rem', margin: 0 }}>
              {viewMode === 'overview' 
                ? 'Projeção de 12 Meses (Geral)'
                : viewMode === 'credit_cards'
                ? 'Projeção de Faturas (12 Meses)'
                : viewMode === 'loans'
                ? 'Projeção de Empréstimos (12 Meses)'
                : 'Projeção de Fixas (12 Meses)'}
            </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectionData}>
                <defs>
                  {projectionData.map((entry, index) => {
                    if (entry.isHighCommitment) {
                      return (
                        <linearGradient key={`gradient-danger-${entry.total}`} id={`gradient-danger-${entry.total}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={themeColors.neon.purple} />
                          <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                      );
                    }
                    return null;
                  })}
                </defs>
                <XAxis
                  dataKey="month"
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
                    padding: '0.75rem',
                  }}
                  formatter={(value: number, name: string, props: any) => {
                    const dueCount = props.payload.dueCount || filteredRecurrences.filter(r => r.status === 'active').length;
                    return [
                      `${formatCurrency(value)} - Você tem ${dueCount} ${dueCount === 1 ? 'conta' : 'contas'} vencendo neste mês`,
                      'Total'
                    ];
                  }}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {projectionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isHighCommitment 
                        ? `url(#gradient-danger-${entry.total})` 
                        : themeColors.neon.purple
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Timeline de Próximos Vencimentos */}
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Calendar style={{ width: '1.5rem', height: '1.5rem', color: themeColors.neon.purple }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
              Próximos Vencimentos
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredRecurrences
              .sort((a, b) => {
                const today = new Date().getDate();
                const aDaysUntil = a.dueDay >= today ? a.dueDay - today : a.dueDay + (30 - today);
                const bDaysUntil = b.dueDay >= today ? b.dueDay - today : b.dueDay + (30 - today);
                return aDaysUntil - bDaysUntil;
              })
              .slice(0, 5)
              .map((recurrence) => {
                const today = new Date().getDate();
                const daysUntil = recurrence.dueDay >= today 
                  ? recurrence.dueDay - today 
                  : recurrence.dueDay + (30 - today);
                const isTomorrow = daysUntil === 1;
                const isToday = daysUntil === 0;

                return (
                  <div
                    key={recurrence.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: isToday || isTomorrow
                        ? `${themeColors.status.error}15`
                        : themeColors.surface,
                      border: `1px solid ${isToday || isTomorrow ? themeColors.status.error : themeColors.border}`,
                      borderRadius: '0.75rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                        {recurrence.description}
                      </p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                        {formatCurrency(recurrence.amount)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} style={{ color: themeColors.textSecondary }} />
                      <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary }}>
                        {isToday 
                          ? 'Hoje' 
                          : isTomorrow 
                          ? 'Amanhã' 
                          : `Dia ${recurrence.dueDay} (${daysUntil} dias)`}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
        </div>
      )}

      {/* Lista Detalhada - Renderização Condicional */}
      {filteredRecurrences.length > 0 ? (
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {(() => {
              const Icon = viewModes.find(m => m.id === viewMode)?.icon || Repeat;
              return <Icon style={{ width: '1.5rem', height: '1.5rem', color: themeColors.neon.purple }} />;
            })()}
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
              {viewMode === 'overview' 
                ? 'Assinaturas e Contratos Ativos'
                : viewMode === 'credit_cards'
                ? 'Parcelamentos de Cartão'
                : viewMode === 'loans'
                ? 'Empréstimos e Financiamentos'
                : 'Despesas Fixas Mensais'}
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {filteredRecurrences.map((recurrence) => {
            const Icon = getRecurrenceIcon(recurrence.type, recurrence.description);
            const progress = recurrence.totalInstallments && recurrence.currentInstallment
              ? (recurrence.currentInstallment / recurrence.totalInstallments) * 100
              : null;
            
            // Calcular dias até vencimento
            const today = new Date().getDate();
            const daysUntil = recurrence.dueDay >= today 
              ? recurrence.dueDay - today 
              : recurrence.dueDay + (30 - today);
            const isDueSoon = daysUntil <= 1; // Hoje ou amanhã
            const isAlmostDone = progress !== null && progress >= 90; // Quase terminado

            return (
              <div
                key={recurrence.id}
                style={{
                  padding: '1.25rem',
                  backgroundColor: themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = themeColors.neon.purple;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme === 'dark'
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    : '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = themeColors.border;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header do Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      backgroundColor: `${themeColors.neon.purple}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: '1.5rem', height: '1.5rem', color: themeColors.neon.purple }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                        {recurrence.description}
                      </p>
                      {isDueSoon && (
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: '700',
                            color: '#FFFFFF',
                            backgroundColor: '#EF4444',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            animation: daysUntil === 0 ? 'pulse 2s infinite' : 'none',
                          }}
                        >
                          <AlertCircle size={10} />
                          {daysUntil === 0 ? 'Vence Hoje' : 'Vence Amanhã'}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0 }}>
                      {getRecurrenceTypeLabel(recurrence.type)}
                    </p>
                  </div>
                </div>

                {/* Valor e Vencimento */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: '0 0 0.25rem 0' }}>
                      Valor Mensal
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                      {formatCurrency(recurrence.amount)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: '0 0 0.25rem 0' }}>
                      Vencimento
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Calendar size={14} style={{ color: themeColors.textSecondary }} />
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                        Dia {recurrence.dueDay}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Barra de Progresso (se parcelado) */}
                {progress !== null && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary }}>
                        {recurrence.currentInstallment}/{recurrence.totalInstallments} parcelas
                      </span>
                      {isAlmostDone && (
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: '600',
                            color: themeColors.neon.emerald,
                            backgroundColor: `${themeColors.neon.emerald}20`,
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                          }}
                        >
                          Quase lá!
                        </span>
                      )}
                      {!isAlmostDone && (
                        <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary }}>
                          {Math.round(progress)}%
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: '100%',
                          backgroundColor: isAlmostDone 
                            ? themeColors.neon.emerald 
                            : themeColors.neon.purple,
                          transition: 'all 0.3s',
                          borderRadius: '9999px',
                          boxShadow: isAlmostDone 
                            ? `0 0 8px ${themeColors.neon.emerald}66` 
                            : 'none',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </Card>
      ) : (
        <Card padding="lg">
          <div style={{ padding: '3rem', textAlign: 'center', color: themeColors.textSecondary }}>
            <p style={{ fontSize: '1rem', margin: 0 }}>
              Nenhum item encontrado nesta categoria.
            </p>
          </div>
        </Card>
      )}

      {/* CSS para animação pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>

      {/* Modal de Nova Recorrência */}
      <CreateRecurrenceModal
        isOpen={isRecurrenceModalOpen}
        onClose={() => setIsRecurrenceModalOpen(false)}
        onSuccess={() => {
          setIsRecurrenceModalOpen(false);
          // Recarregar dados se necessário
          // Por enquanto, os dados são mockados, então apenas fechamos o modal
        }}
      />
    </div>
  );
};
