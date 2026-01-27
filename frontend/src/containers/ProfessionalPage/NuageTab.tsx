import { useState, useEffect, useMemo, useRef } from 'react';
import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SetProfessionalGoalModal } from '../../components/modals/SetProfessionalGoalModal';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import {
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Briefcase,
  FileCheck,
  CheckCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  Cell,
} from 'recharts';

/**
 * NuageTab - Dashboard Executivo NuageIT
 * UI/UX Overhaul: Layout denso e informativo com KPIs e gráficos avançados
 * Design System: VertexGuard Premium Dark/Light + Glassmorphism
 */
export const NuageTab: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  
  // Cache para evitar requisições desnecessárias ao voltar para a aba
  const lastFetchRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);
  const hasDataRef = useRef<boolean>(false);
  const CACHE_DURATION = 60000; // 60 segundos de cache (aumentado para melhor UX)

  // Buscar dados apenas se necessário
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchRef.current;
    
    // Se já temos dados carregados e o cache ainda é válido, não buscar novamente
    if (hasDataRef.current && timeSinceLastFetch < CACHE_DURATION) {
      setLoading(false);
      return;
    }
    
    // Se já está buscando, não fazer nova requisição
    if (isFetchingRef.current) {
      return;
    }
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Usar apenas user.id para evitar re-renders desnecessários

  const fetchData = async () => {
    if (!user || isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    
    try {
      // Buscar meta
      const currentYear = new Date().getFullYear();
      const { data: goalData } = await supabase
        .from('professional_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', currentYear)
        .single();

      setGoal(goalData);

      // Buscar oportunidades para cálculos
      const { data: opportunitiesData } = await supabase
        .from('professional_opportunities')
        .select('*')
        .eq('user_id', user.id);

      setOpportunities(opportunitiesData || []);
      
      // Atualizar cache e marcar que temos dados
      lastFetchRef.current = Date.now();
      hasDataRef.current = true;
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Função para obter probabilidade baseada no status
  const getProbability = (status: string): number => {
    switch (status) {
      case 'signed_contract':
        return 100;
      case 'formal_agreement':
        return 70;
      case 'negotiation':
        return 30;
      default:
        return 0;
    }
  };

  // Cálculos de TCV e KPIs
  const dashboardData = useMemo(() => {
    // Realizado (signed_contract)
    const realizedTCV = opportunities
      .filter(o => o.status === 'signed_contract')
      .reduce((sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0), 0);

    // Total em Negociação
    const totalNegotiation = opportunities
      .filter(o => o.status === 'negotiation')
      .reduce((sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0), 0);

    // Total em Acordo Formal
    const totalFormal = opportunities
      .filter(o => o.status === 'formal_agreement')
      .reduce((sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0), 0);

    const annualTarget = goal ? (parseFloat(goal.target_tcv_annual) || 0) : 0;
    const gap = Math.max(0, annualTarget - realizedTCV);
    const realizedProgress = annualTarget > 0 ? (realizedTCV / annualTarget) * 100 : 0;

    // Calcular % do ano transcorrido
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const totalDays = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const yearProgress = (daysElapsed / totalDays) * 100;

    // Dados mensais para gráfico de barras empilhadas
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthName = new Date(2026, i, 1).toLocaleDateString('pt-BR', { month: 'short' });
      
      let setup = 0;
      let recurring = 0;
      let billing = 0;

      opportunities
        .filter(o => {
          if (!o.expected_close_date) return false;
          const closeDate = new Date(o.expected_close_date);
          return closeDate.getMonth() + 1 === month;
        })
        .forEach(o => {
          const tcv = parseFloat(o.calculated_tcv_brl) || 0;
          
          // Calcular Setup
          if (o.has_setup && o.setup_value) {
            setup += parseFloat(o.setup_value) || 0;
          }
          
          // Calcular Recorrência
          if (o.has_recurring && o.recurring_monthly_value && o.recurring_months_duration) {
            const monthlyValue = parseFloat(o.recurring_monthly_value) || 0;
            const months = parseInt(o.recurring_months_duration) || 24;
            recurring += monthlyValue * months;
          }
          
          // Calcular Billing
          if (o.has_billing && o.billing_monthly_usd) {
            const monthlyUSD = parseFloat(o.billing_monthly_usd) || 0;
            const dollarRate = parseFloat(o.billing_dolar_rate) || 5.30;
            const totalDiscount = parseFloat(o.billing_total_discount_percent) || 13;
            const clientDiscount = parseFloat(o.billing_client_discount_percent) || 4;
            const marginPercent = (totalDiscount - clientDiscount) / 100;
            const monthlyBillingBRL = monthlyUSD * marginPercent * dollarRate;
            billing += monthlyBillingBRL * 24; // 24 meses padrão
          }
        });

      return {
        month: monthName,
        Setup: setup,
        Recorrência: recurring,
        Billing: billing,
      };
    });

    return {
      realizedTCV,
      totalNegotiation,
      totalFormal,
      annualTarget,
      gap,
      realizedProgress: Math.min(realizedProgress, 100),
      yearProgress: Math.min(yearProgress, 100),
      monthlyData,
    };
  }, [opportunities, goal]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Dados para gráfico radial
  const radialData = [
    {
      name: 'Meta Atingida',
      value: dashboardData.realizedProgress,
      fill: themeColors.neon.emerald,
    },
    {
      name: 'Tempo Transcorrido',
      value: dashboardData.yearProgress,
      fill: themeColors.neon.cyan,
    },
  ];

  // Cores para gráfico de barras
  const barColors = {
    Setup: themeColors.neon.purple,
    Recorrência: themeColors.neon.emerald,
    Billing: themeColors.neon.cyan,
  };

  const isAhead = dashboardData.realizedProgress > dashboardData.yearProgress;

  // Calcular quarter atual
  const getCurrentQuarter = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    if (month >= 1 && month <= 3) return 1;
    if (month >= 4 && month <= 6) return 2;
    if (month >= 7 && month <= 9) return 3;
    return 4;
  };

  const currentQuarter = getCurrentQuarter();

  // Dados dos quarters
  const quartersData = useMemo(() => {
    if (!goal) return [];
    
    return [1, 2, 3, 4].map((quarter) => {
      const quarterTarget = parseFloat(goal[`target_q${quarter}`] || 0);
      const quarterStartMonth = (quarter - 1) * 3 + 1;
      const quarterEndMonth = quarter * 3;
      
      // Calcular realizado do quarter
      const quarterRealized = opportunities
        .filter(o => {
          if (!o.expected_close_date || o.status !== 'signed_contract') return false;
          const closeDate = new Date(o.expected_close_date);
          const closeMonth = closeDate.getMonth() + 1;
          return closeMonth >= quarterStartMonth && closeMonth <= quarterEndMonth;
        })
        .reduce((sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0), 0);

      return {
        quarter,
        label: `Q${quarter}`,
        period: quarter === 1 ? 'Jan-Mar' : quarter === 2 ? 'Abr-Jun' : quarter === 3 ? 'Jul-Set' : 'Out-Dez',
        target: quarterTarget,
        realized: quarterRealized,
        progress: quarterTarget > 0 ? (quarterRealized / quarterTarget) * 100 : 0,
      };
    });
  }, [goal, opportunities]);

  // Dados mensais para roadmap
  const monthlyRoadmap = useMemo(() => {
    if (!goal) return [];
    
    const months = [
      { num: 1, name: 'Jan', quarter: 1 },
      { num: 2, name: 'Fev', quarter: 1 },
      { num: 3, name: 'Mar', quarter: 1 },
      { num: 4, name: 'Abr', quarter: 2 },
      { num: 5, name: 'Mai', quarter: 2 },
      { num: 6, name: 'Jun', quarter: 2 },
      { num: 7, name: 'Jul', quarter: 3 },
      { num: 8, name: 'Ago', quarter: 3 },
      { num: 9, name: 'Set', quarter: 3 },
      { num: 10, name: 'Out', quarter: 4 },
      { num: 11, name: 'Nov', quarter: 4 },
      { num: 12, name: 'Dez', quarter: 4 },
    ];

    const now = new Date();
    const currentYear = now.getFullYear();

    return months.map((month) => {
      const quarterTarget = parseFloat(goal[`target_q${month.quarter}`] || 0);
      const monthlyTarget = quarterTarget / 3; // Distribuição igual entre os 3 meses

      // Calcular realizado do mês (apenas oportunidades ganhas com signed_contract)
      const monthlyRealized = opportunities
        .filter(o => {
          if (!o.expected_close_date || o.status !== 'signed_contract') return false;
          const closeDate = new Date(o.expected_close_date);
          return closeDate.getFullYear() === currentYear && closeDate.getMonth() + 1 === month.num;
        })
        .reduce((sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0), 0);

      const progress = monthlyTarget > 0 ? (monthlyRealized / monthlyTarget) * 100 : 0;

      return {
        ...month,
        target: monthlyTarget,
        realized: monthlyRealized,
        progress: Math.round(progress * 10) / 10, // Arredondar para 1 casa decimal
      };
    });
  }, [goal, opportunities]);

  // Totais anuais para rodapé
  const annualTotals = useMemo(() => {
    const totalTarget = monthlyRoadmap.reduce((sum, month) => sum + month.target, 0);
    const totalRealized = monthlyRoadmap.reduce((sum, month) => sum + month.realized, 0);
    const totalProgress = totalTarget > 0 ? (totalRealized / totalTarget) * 100 : 0;

    return {
      target: totalTarget,
      realized: totalRealized,
      progress: Math.round(totalProgress * 10) / 10,
    };
  }, [monthlyRoadmap]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
          Dashboard Executivo
        </h2>
        <Button variant="primary" onClick={() => setIsGoalModalOpen(true)}>
          <Target style={{ width: '1rem', height: '1rem' }} />
          {goal ? 'Editar Meta' : 'Definir Meta'}
        </Button>
      </div>

      {loading ? (
        <Card padding="lg">
          <div style={{ textAlign: 'center', padding: '2rem', color: themeColors.textSecondary }}>
            Carregando...
          </div>
        </Card>
      ) : !goal ? (
        <Card padding="lg">
          <div style={{ textAlign: 'center', padding: '3rem', color: themeColors.textSecondary }}>
            <Target style={{ width: '3rem', height: '3rem', color: themeColors.textMuted, margin: '0 auto 1rem' }} />
            <p style={{ margin: 0, marginBottom: '1rem' }}>
              Nenhuma meta definida para {new Date().getFullYear()}
            </p>
            <Button variant="primary" onClick={() => setIsGoalModalOpen(true)}>
              Definir Meta
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* SEÇÃO 1: 5 Cards Compactos (KPIs) - Funil de Vendas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1: Meta Total - Indigo/Purple (O Alvo) */}
            <div
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(88, 28, 135, 0.2))'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(88, 28, 135, 0.1))',
                border: `1px solid ${theme === 'dark' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
                borderRadius: '1.5rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Card variant="glass" padding="lg" className="!bg-transparent !border-0">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target style={{ width: '1rem', height: '1rem', color: 'rgb(129, 140, 248)' }} />
                  <p style={{ fontSize: '0.75rem', color: 'rgb(129, 140, 248)', margin: 0, fontWeight: '500' }}>
                    Meta Anual
                  </p>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>
                  {formatCurrency(dashboardData.annualTarget)}
                </p>
              </div>
              </Card>
            </div>

            {/* Card 2: Em Negociação - Amber/Yellow (Entrada do Funil) */}
            <div
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(113, 63, 18, 0.2))'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(113, 63, 18, 0.1))',
                border: `1px solid ${theme === 'dark' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)'}`,
                borderRadius: '1.5rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Card variant="glass" padding="lg" className="!bg-transparent !border-0">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase style={{ width: '1rem', height: '1rem', color: 'rgb(251, 191, 36)' }} />
                  <p style={{ fontSize: '0.75rem', color: 'rgb(251, 191, 36)', margin: 0, fontWeight: '500' }}>
                    Em Negociação
                  </p>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>
                  {formatCurrency(dashboardData.totalNegotiation)}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                  Pipeline inicial
                </p>
              </div>
              </Card>
            </div>

            {/* Card 3: Acordo Formal - Blue (Meio do Funil / Confiança) */}
            <div
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(30, 58, 138, 0.2))'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(30, 58, 138, 0.1))',
                border: `1px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                borderRadius: '1.5rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Card variant="glass" padding="lg" className="!bg-transparent !border-0">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileCheck style={{ width: '1rem', height: '1rem', color: 'rgb(96, 165, 250)' }} />
                  <p style={{ fontSize: '0.75rem', color: 'rgb(96, 165, 250)', margin: 0, fontWeight: '500' }}>
                    Acordo Formal
                  </p>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>
                  {formatCurrency(dashboardData.totalFormal)}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                  Próximo passo
                </p>
              </div>
              </Card>
            </div>

            {/* Card 4: Realizado / Ganho - Emerald/Green (Sucesso) */}
            <div
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(20, 83, 45, 0.2))'
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(20, 83, 45, 0.1))',
                border: `1px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                borderRadius: '1.5rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Card variant="glass" padding="lg" className="!bg-transparent !border-0">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle style={{ width: '1rem', height: '1rem', color: 'rgb(52, 211, 153)' }} />
                  <p style={{ fontSize: '0.75rem', color: 'rgb(52, 211, 153)', margin: 0, fontWeight: '500' }}>
                    Realizado / Ganho
                  </p>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>
                  {formatCurrency(dashboardData.realizedTCV)}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                  {dashboardData.realizedProgress.toFixed(1)}% da meta
                </p>
              </div>
              </Card>
            </div>

            {/* Card 5: GAP (Restante) - Rose/Pink (O Desafio) */}
            <div
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(131, 24, 67, 0.2))'
                  : 'linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(131, 24, 67, 0.1))',
                border: `1px solid ${theme === 'dark' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(244, 63, 94, 0.2)'}`,
                borderRadius: '1.5rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Card variant="glass" padding="lg" className="!bg-transparent !border-0">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target style={{ width: '1rem', height: '1rem', color: 'rgb(251, 113, 133)' }} />
                  <p style={{ fontSize: '0.75rem', color: 'rgb(251, 113, 133)', margin: 0, fontWeight: '500' }}>
                    GAP (Restante)
                  </p>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>
                  {formatCurrency(dashboardData.gap)}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                  Para atingir a meta
                </p>
              </div>
              </Card>
            </div>
          </div>

          {/* SEÇÃO 2: Gráficos (2/3 e 1/3) */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            {/* Esquerda: Bar Chart Empilhado */}
            <div
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '1.5rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Card variant="glass" padding="lg" className="!bg-transparent !border-0">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: '0 0 2rem 0' }}>
                Composição Mensal (TCV)
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={dashboardData.monthlyData}>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: themeColors.textSecondary, fontSize: 12 }}
                    axisLine={{ stroke: themeColors.textMuted }}
                  />
                  <YAxis
                    tick={{ fill: themeColors.textSecondary, fontSize: 12 }}
                    axisLine={{ stroke: themeColors.textMuted }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                      border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                      borderRadius: '8px',
                      color: themeColors.text,
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '1rem' }}
                    iconType="square"
                  />
                  <Bar dataKey="Setup" stackId="a" fill={barColors.Setup} />
                  <Bar dataKey="Recorrência" stackId="a" fill={barColors.Recorrência} />
                  <Bar dataKey="Billing" stackId="a" fill={barColors.Billing} />
                </BarChart>
              </ResponsiveContainer>
              </Card>
            </div>

            {/* Direita: Radial Bar (Meta vs Tempo) */}
            <div
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '1.5rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Card variant="glass" padding="lg" className="!bg-transparent !border-0">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: '0 0 2rem 0' }}>
                Meta vs Tempo
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="80%"
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={(entry: any) => entry.fill}
                  >
                    {radialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </RadialBar>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                      border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                      borderRadius: '8px',
                      color: themeColors.text,
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '1rem' }}
                    iconType="circle"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0.5rem 0' }}>
                  {isAhead ? (
                    <span style={{ color: themeColors.neon.emerald }}>
                      ✓ Adiantado ({dashboardData.realizedProgress.toFixed(1)}% vs {dashboardData.yearProgress.toFixed(1)}%)
                    </span>
                  ) : (
                    <span style={{ color: themeColors.neon.orange }}>
                      ⚠ Atrasado ({dashboardData.realizedProgress.toFixed(1)}% vs {dashboardData.yearProgress.toFixed(1)}%)
                    </span>
                  )}
                </p>
              </div>
              </Card>
            </div>
          </div>

          {/* SEÇÃO 3: Breakdown de Metas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Título da Seção */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
              Breakdown de Metas
            </h3>

            {/* Grid de Quarters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {quartersData.map((q) => {
                const isCurrent = q.quarter === currentQuarter;
                
                return (
                  <div
                    key={q.quarter}
                    style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      border: isCurrent
                        ? `2px solid ${themeColors.neon.purple}`
                        : `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: '1rem',
                      padding: '1.25rem',
                      backdropFilter: 'blur(4px)',
                      boxShadow: isCurrent 
                        ? `0 0 20px ${themeColors.neon.purple}30` 
                        : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600', 
                          color: isCurrent ? themeColors.neon.purple : themeColors.textSecondary,
                          margin: 0 
                        }}>
                          {q.label} ({q.period})
                        </p>
                        {isCurrent && (
                          <div
                            style={{
                              width: '0.5rem',
                              height: '0.5rem',
                              borderRadius: '50%',
                              backgroundColor: themeColors.neon.purple,
                              boxShadow: `0 0 8px ${themeColors.neon.purple}`,
                            }}
                          />
                        )}
                      </div>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                        {formatCurrency(q.target)}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ color: themeColors.textSecondary }}>Realizado:</span>
                          <span style={{ color: themeColors.neon.emerald, fontWeight: '600' }}>
                            {formatCurrency(q.realized)}
                          </span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '0.375rem',
                            backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '9999px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${Math.min(q.progress, 100)}%`,
                              backgroundColor: themeColors.neon.emerald,
                              borderRadius: '9999px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabela de Roadmap Mensal */}
            <div
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '1rem',
                backdropFilter: 'blur(4px)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: '0 0 1.5rem 0' }}>
                  Roadmap Mensal de Execução
                </h4>
                
                {/* Cabeçalho da Tabela */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1.5fr 1.5fr 2fr',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    marginBottom: '0.5rem',
                  }}
                >
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: themeColors.textMuted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Mês / Quarter
                  </p>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: themeColors.textMuted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                    Realizado (R$)
                  </p>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: themeColors.textMuted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                    Meta (R$)
                  </p>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: themeColors.textMuted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                    Progresso (%)
                  </p>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: themeColors.textMuted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Barra de Progresso
                  </p>
                </div>

                {/* Linhas da Tabela */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {monthlyRoadmap.map((month, index) => {
                    const prevMonth = index > 0 ? monthlyRoadmap[index - 1] : null;
                    const isNewQuarter = !prevMonth || prevMonth.quarter !== month.quarter;
                    const isEven = index % 2 === 0;
                    const realizedColor = month.realized >= month.target 
                      ? 'rgb(52, 211, 153)' // emerald-400
                      : themeColors.text;
                    const progressColor = month.progress >= 100 
                      ? 'rgb(16, 185, 129)' // emerald-500
                      : month.progress >= 50 
                      ? 'rgb(59, 130, 246)' // blue-500
                      : 'rgb(244, 63, 94)'; // rose-500

                    return (
                      <div key={month.num}>
                        {/* Separador de Quarter */}
                        {isNewQuarter && index > 0 && (
                          <div
                            style={{
                              height: '1px',
                              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                              margin: '0.75rem 0',
                            }}
                          />
                        )}
                        
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1.2fr 1fr 1.5fr 1.5fr 2fr',
                            gap: '1rem',
                            padding: '0.875rem 1rem',
                            borderRadius: '0.5rem',
                            backgroundColor: isEven 
                              ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)')
                              : 'transparent',
                            transition: 'all 0.2s ease',
                            cursor: 'default',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)' 
                              : 'rgba(0, 0, 0, 0.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isEven 
                              ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)')
                              : 'transparent';
                          }}
                        >
                          {/* Mês / Quarter */}
                          <p style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: themeColors.text, 
                            margin: 0,
                            fontFamily: 'monospace',
                          }}>
                            {month.name} (Q{month.quarter})
                          </p>

                          {/* Realizado (R$) */}
                          <p style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: realizedColor, 
                            margin: 0,
                            fontFamily: 'monospace',
                            textAlign: 'center',
                          }}>
                            {formatCurrency(month.realized)}
                          </p>

                          {/* Meta (R$) */}
                          <p style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: themeColors.text, 
                            margin: 0,
                            fontFamily: 'monospace',
                            textAlign: 'right',
                          }}>
                            {formatCurrency(month.target)}
                          </p>

                          {/* Progresso (%) */}
                          <p style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: themeColors.text, 
                            margin: 0,
                            fontFamily: 'monospace',
                            textAlign: 'center',
                          }}>
                            {month.progress.toFixed(1)}%
                          </p>

                          {/* Barra de Progresso */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', justifyContent: 'center' }}>
                            <div
                              style={{
                                width: '100%',
                                height: '6px',
                                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                borderRadius: '3px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${Math.min(month.progress, 100)}%`,
                                  height: '100%',
                                  backgroundColor: progressColor,
                                  borderRadius: '3px',
                                  transition: 'width 0.3s ease',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Rodapé com Totais */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1.5fr 1.5fr 2fr',
                    gap: '1rem',
                    padding: '1rem',
                    marginTop: '1rem',
                    borderTop: `2px solid ${themeColors.border}`,
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '0.5rem',
                  }}
                >
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '700', 
                    color: themeColors.text, 
                    margin: 0,
                    fontFamily: 'monospace',
                  }}>
                    TOTAL ANUAL
                  </p>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '700', 
                    color: annualTotals.realized >= annualTotals.target 
                      ? 'rgb(52, 211, 153)' 
                      : themeColors.text, 
                    margin: 0,
                    fontFamily: 'monospace',
                    textAlign: 'center',
                  }}>
                    {formatCurrency(annualTotals.realized)}
                  </p>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '700', 
                    color: themeColors.text, 
                    margin: 0,
                    fontFamily: 'monospace',
                    textAlign: 'right',
                  }}>
                    {formatCurrency(annualTotals.target)}
                  </p>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '700', 
                    color: themeColors.text, 
                    margin: 0,
                    fontFamily: 'monospace',
                    textAlign: 'center',
                  }}>
                    {annualTotals.progress.toFixed(1)}%
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(annualTotals.progress, 100)}%`,
                          height: '100%',
                          backgroundColor: annualTotals.progress >= 100 
                            ? 'rgb(16, 185, 129)' 
                            : annualTotals.progress >= 50 
                            ? 'rgb(59, 130, 246)' 
                            : 'rgb(244, 63, 94)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <SetProfessionalGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSuccess={() => {
          setIsGoalModalOpen(false);
          // Forçar atualização ao salvar meta (invalidar cache)
          lastFetchRef.current = 0;
          hasDataRef.current = false;
          fetchData();
        }}
      />
    </div>
  );
};
