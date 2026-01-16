import { useMemo } from 'react';
import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressRing } from '../../components/dashboard/ProgressRing';
import { PageContainer } from '../../components/layout/PageContainer';
import {
  Dumbbell,
  Footprints,
  Flame,
  Plus,
  Trophy,
  Activity,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { MOCK_WORKOUTS } from '../../mocks/database';

/**
 * GoalsHealthPage - Página de Treinos & Saúde
 * Visualização de Musculação e Corrida com KPIs e Recordes
 * Design System: VertexGuard Premium Dark/Light
 */
export const GoalsHealthPage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  const gymWorkout = useMemo(() => MOCK_WORKOUTS.find(w => w.type === 'gym'), []);
  const runWorkout = useMemo(() => MOCK_WORKOUTS.find(w => w.type === 'run'), []);

  // Calcular progresso semanal para Gym (dias)
  const gymWeeklyProgress = gymWorkout
    ? Math.min((gymWorkout.currentWeek / gymWorkout.weeklyGoal) * 100, 100)
    : 0;

  // Calcular progresso semanal para Run (km)
  const runWeeklyProgress = runWorkout
    ? Math.min((runWorkout.currentWeek / runWorkout.weeklyGoal) * 100, 100)
    : 0;

  return (
    <PageContainer>
      {/* Grid de 2 Colunas - Musculação e Corrida */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Card Esquerda: MUSCULAÇÃO (Iron Temple) */}
        <div
          style={{
            border: `2px solid ${themeColors.neon.purple}33`,
            background: theme === 'dark'
              ? `linear-gradient(135deg, rgba(26, 29, 45, 0.9), rgba(30, 33, 57, 0.9))`
              : `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.9))`,
            boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 30px ${themeColors.neon.purple}20`,
            borderRadius: '1.5rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Card variant="glass" padding="lg">
          {/* Header do Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: `linear-gradient(135deg, ${themeColors.neon.purple}, ${themeColors.neon.pink})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 20px ${themeColors.neon.purple}66`,
                }}
              >
                <Dumbbell style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                  Iron Temple
                </h2>
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                  Musculação
                </p>
              </div>
            </div>
          </div>

          {/* KPI Principal: Anel de Progresso Semanal */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <ProgressRing
              progress={gymWeeklyProgress}
              size={120}
              strokeWidth={10}
              color={themeColors.neon.purple}
            />
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                Frequência Semanal
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: themeColors.neon.purple, margin: 0 }}>
                {gymWorkout?.currentWeek || 0}/{gymWorkout?.weeklyGoal || 0}
              </p>
              <p style={{ fontSize: '0.875rem', color: themeColors.textMuted, margin: 0 }}>
                Treinos
              </p>
            </div>
          </div>

          {/* Streak */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              marginBottom: '2rem',
            }}
          >
            <Flame style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.orange }} />
            <p style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
              {gymWorkout?.streak || 0} Dias no Foco
            </p>
          </div>

          {/* Estatísticas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0, marginBottom: '0.5rem' }}>
                Total do Ano
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                {gymWorkout?.totalStats || 0}
              </p>
              <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, margin: 0 }}>
                Treinos
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0, marginBottom: '0.5rem' }}>
                Meta Semanal
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                {gymWorkout?.weeklyGoal || 0}
              </p>
              <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, margin: 0 }}>
                Dias
              </p>
            </div>
          </div>

          {/* Lista de Recordes (PRs) */}
          {gymWorkout?.records && gymWorkout.records.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Trophy style={{ width: '1rem', height: '1rem', color: themeColors.neon.purple }} />
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Recordes Pessoais
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {gymWorkout.records.map((record, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      border: `1px solid ${themeColors.border}`,
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', color: themeColors.textSecondary }}>
                      {record.label}
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: themeColors.neon.purple }}>
                      {record.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botão Registrar Treino */}
          <Button
            variant="primary"
            onClick={() => console.log('Registrar treino de musculação')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: themeColors.neon.purple,
              borderColor: themeColors.neon.purple,
            }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            Registrar Treino
          </Button>
          </Card>
        </div>

        {/* Card Direita: CORRIDA (Cardio) */}
        <div
          style={{
            border: `2px solid ${themeColors.neon.orange}33`,
            background: theme === 'dark'
              ? `linear-gradient(135deg, rgba(26, 29, 45, 0.9), rgba(30, 33, 57, 0.9))`
              : `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.9))`,
            boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 30px ${themeColors.neon.orange}20`,
            borderRadius: '1.5rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Card variant="glass" padding="lg">
          {/* Header do Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: `linear-gradient(135deg, ${themeColors.neon.orange}, ${themeColors.neon.cyan})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 20px ${themeColors.neon.orange}66`,
                }}
              >
                <Footprints style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                  Cardio Zone
                </h2>
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                  Corrida
                </p>
              </div>
            </div>
          </div>

          {/* KPI Principal: Barra de Progresso Semanal */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                Volume Semanal
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 'bold', color: themeColors.neon.orange, margin: 0 }}>
                {runWorkout?.currentWeek.toFixed(1) || 0} / {runWorkout?.weeklyGoal || 0} km
              </p>
            </div>
            <div
              style={{
                width: '100%',
                height: '1rem',
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: `1px solid ${themeColors.neon.orange}33`,
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: `linear-gradient(to right, ${themeColors.neon.orange}, ${themeColors.neon.cyan})`,
                  borderRadius: '9999px',
                  width: `${Math.min(runWeeklyProgress, 100)}%`,
                  transition: 'width 0.5s ease',
                  boxShadow: `0 0 10px ${themeColors.neon.orange}66`,
                }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, marginTop: '0.5rem', margin: 0, textAlign: 'right' }}>
              {runWeeklyProgress.toFixed(0)}% da meta
            </p>
          </div>

          {/* Streak */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              marginBottom: '2rem',
            }}
          >
            <Activity style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.cyan }} />
            <p style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
              {runWorkout?.streak || 0} Semanas Seguidas
            </p>
          </div>

          {/* Estatísticas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0, marginBottom: '0.5rem' }}>
                Total do Ano
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.neon.orange, margin: 0 }}>
                {runWorkout?.totalStats || 0}
              </p>
              <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, margin: 0 }}>
                Quilômetros
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0, marginBottom: '0.5rem' }}>
                Meta Semanal
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                {runWorkout?.weeklyGoal || 0}
              </p>
              <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, margin: 0 }}>
                Quilômetros
              </p>
            </div>
          </div>

          {/* Lista de Recordes */}
          {runWorkout?.records && runWorkout.records.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Trophy style={{ width: '1rem', height: '1rem', color: themeColors.neon.orange }} />
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Recordes Pessoais
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {runWorkout.records.map((record, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      border: `1px solid ${themeColors.border}`,
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', color: themeColors.textSecondary }}>
                      {record.label}
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: themeColors.neon.orange }}>
                      {record.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botão Registrar Corrida */}
          <Button
            variant="primary"
            onClick={() => console.log('Registrar corrida')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: themeColors.neon.orange,
              borderColor: themeColors.neon.orange,
            }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            Registrar Corrida
          </Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
