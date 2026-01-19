import { useMemo, useState, useEffect } from 'react';
import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { PageContainer } from '../../components/layout/PageContainer';
import {
  Target,
  MessageSquare,
  Calendar,
  User,
  Building2,
  Award,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

/**
 * GoalsCareerPage - Página de Metas Profissionais e Carreira
 * Layout em duas colunas: PDI (Metas) e Feedback Vault
 * Design System: VertexGuard Premium Dark/Light
 */
export const GoalsCareerPage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [career, setCareer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Buscar dados de carreira do Supabase
  useEffect(() => {
    if (user) {
      fetchCareer();
    }
  }, [user]);

  const fetchCareer = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Por enquanto, deixar vazio pois pode não haver tabela de carreira
      // Se houver, buscar assim:
      // const { data } = await supabase
      //   .from('career_goals')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .single();
      // setCareer(data);
      setCareer(null);
    } catch (err) {
      console.error('Erro ao carregar dados de carreira:', err);
    } finally {
      setLoading(false);
    }
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Ordenar feedbacks por data (mais recentes primeiro)
  const sortedFeedbacks = useMemo(() => {
    if (!career || !career.feedbacks) return [];
    return [...career.feedbacks].sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [career]);

  return (
    <PageContainer>
      {/* Card de Informações do Cargo */}
      <div>
        <Card variant="neon" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '0.75rem',
                  backgroundColor: `${themeColors.neon.purple}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User style={{ width: '2rem', height: '2rem', color: themeColors.neon.purple }} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginBottom: '0.25rem', margin: 0 }}>
                  Cargo Atual
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                  {career?.role || 'Não especificado'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <Building2 style={{ width: '0.875rem', height: '0.875rem', color: themeColors.textMuted }} />
                  <span style={{ fontSize: '0.875rem', color: themeColors.textSecondary }}>
                    {career?.company || 'Não especificado'}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '1px',
                  height: '3rem',
                  backgroundColor: themeColors.border,
                }}
              />
              <div>
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginBottom: '0.25rem', margin: 0 }}>
                  Próximo Nível
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award style={{ width: '1rem', height: '1rem', color: themeColors.neon.emerald }} />
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.neon.emerald, margin: 0 }}>
                    {career?.nextLevel || 'Não especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Layout em Duas Colunas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '1.5rem',
        }}
        className="md:grid-cols-2"
      >
        {/* Coluna Esquerda - PDI (Metas de Carreira) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Target style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.purple }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
              Plano de Desenvolvimento Individual (PDI)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <Card padding="lg">
                <div style={{ textAlign: 'center', padding: '2rem', color: themeColors.textSecondary }}>
                  Carregando metas de carreira...
                </div>
              </Card>
            ) : !career || !career.goals || career.goals.length === 0 ? (
              <Card padding="lg">
                <div style={{ textAlign: 'center', padding: '2rem', color: themeColors.textSecondary }}>
                  <Target style={{ width: '3rem', height: '3rem', color: themeColors.textMuted, margin: '0 auto 1rem' }} />
                  <p style={{ margin: 0 }}>
                    Nenhuma meta de carreira cadastrada
                  </p>
                </div>
              </Card>
            ) : (
              career.goals.map((goal: any) => {
              const deadlineDate = new Date(goal.deadline);
              const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={goal.id} padding="lg">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, marginBottom: '0.5rem', margin: 0 }}>
                        {goal.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar style={{ width: '0.875rem', height: '0.875rem', color: themeColors.textMuted }} />
                        <span style={{ fontSize: '0.875rem', color: themeColors.textSecondary }}>
                          {formatDate(goal.deadline)}
                        </span>
                        <span style={{ color: themeColors.textMuted }}>•</span>
                        <span
                          style={{
                            fontSize: '0.875rem',
                            color: daysUntilDeadline < 30 ? themeColors.neon.orange : themeColors.textSecondary,
                            fontWeight: daysUntilDeadline < 30 ? '600' : '400',
                          }}
                        >
                          {daysUntilDeadline > 0 ? `${daysUntilDeadline} dias` : 'Prazo vencido'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: themeColors.textSecondary }}>Progresso</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.text }}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '0.75rem',
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          background: `linear-gradient(to right, ${themeColors.neon.purple}, ${themeColors.neon.cyan})`,
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease',
                          width: `${goal.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              );
              })
            )}
          </div>
        </div>

        {/* Coluna Direita - Feedback Vault */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <MessageSquare style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.cyan }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
              Feedback Vault
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sortedFeedbacks.length === 0 ? (
              <Card padding="lg">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <MessageSquare style={{ width: '3rem', height: '3rem', color: themeColors.textMuted, margin: '0 auto 1rem' }} />
                  <p style={{ color: themeColors.textSecondary, margin: 0 }}>
                    Nenhum feedback registrado ainda
                  </p>
                </div>
              </Card>
            ) : (
              sortedFeedbacks.map(feedback => {
                const isPositive = feedback.type === 'positive';
                const feedbackColor = isPositive ? themeColors.neon.emerald : themeColors.neon.orange;
                const feedbackBg = isPositive
                  ? `${themeColors.neon.emerald}1A`
                  : `${themeColors.neon.orange}1A`;

                return (
                  <div
                    key={feedback.id}
                    style={{
                      borderLeft: `4px solid ${feedbackColor}`,
                      backgroundColor: feedbackBg,
                      borderRadius: '1rem',
                    }}
                  >
                    <Card padding="lg">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <User style={{ width: '0.875rem', height: '0.875rem', color: feedbackColor }} />
                          <span
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: feedbackColor,
                            }}
                          >
                            {feedback.source}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar style={{ width: '0.75rem', height: '0.75rem', color: themeColors.textMuted }} />
                          <span style={{ fontSize: '0.75rem', color: themeColors.textMuted }}>
                            {formatDate(feedback.date)}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: `${feedbackColor}33`,
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: feedbackColor,
                          textTransform: 'capitalize',
                        }}
                      >
                        {isPositive ? 'Positivo' : 'Construtivo'}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: themeColors.text, lineHeight: '1.5', margin: 0 }}>
                      {feedback.content}
                    </p>
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
