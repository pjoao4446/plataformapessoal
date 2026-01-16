import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PageContainer } from '../../components/layout/PageContainer';
import {
  CheckSquare,
  Dumbbell,
  Brain,
  PhoneOff,
  Flame,
  CheckCircle2,
  Target,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import {
  MOCK_HABITS,
  MOCK_DAILY_LOGS,
  getTodayLogs,
  getLogsByHabitId,
  getTodayDateString,
  type Habit,
  type HabitCategory,
  type DailyLog,
} from '../../mocks/database';

/**
 * TasksPage - Página de Gestão de Hábitos e Atividades
 * Interface gamificada com score diário e tracking de consistência
 * Design System: VertexGuard Premium Dark/Light
 */
export const TasksPage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const [logs, setLogs] = useState<DailyLog[]>(MOCK_DAILY_LOGS);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [completedHabits, setCompletedHabits] = useState<Set<string>>(
    new Set(logs.filter(log => log.date === getTodayDateString() && log.completed).map(log => log.habitId))
  );
  const [glowingHabits, setGlowingHabits] = useState<Set<string>>(new Set());

  // Obter logs de hoje
  const todayLogs = useMemo(() => {
    return logs.filter(log => log.date === getTodayDateString());
  }, [logs]);

  // Calcular Score do Dia
  const dailyScore = useMemo(() => {
    const todayHabits = MOCK_HABITS.filter(h => h.frequency === 'daily' || 
      (h.frequency === 'weekly' && todayLogs.some(log => log.habitId === h.id && log.completed)));
    
    if (todayHabits.length === 0) return 100;
    
    const completedCount = todayHabits.filter(habit => {
      const log = todayLogs.find(l => l.habitId === habit.id);
      return log?.completed || false;
    }).length;
    
    return Math.round((completedCount / todayHabits.length) * 100);
  }, [todayLogs]);

  // Frase motivacional baseada no score
  const motivationalPhrase = useMemo(() => {
    if (dailyScore === 100) return '🔥 Perfeito! Você está no topo hoje!';
    if (dailyScore >= 75) return '💪 Excelente progresso! Continue assim!';
    if (dailyScore >= 50) return '✨ Você está no caminho certo!';
    if (dailyScore >= 25) return '🌱 Todo progresso conta! Vamos lá!';
    return '🚀 Comece agora e construa seu dia!';
  }, [dailyScore]);

  // Obter log de hoje para um hábito específico
  const getTodayLog = (habitId: string): DailyLog | undefined => {
    return todayLogs.find(log => log.habitId === habitId);
  };

  // Verificar se hábito está completo hoje
  const isCompletedToday = (habitId: string): boolean => {
    return completedHabits.has(habitId);
  };

  // Obter cor da categoria
  const getCategoryColor = (category: HabitCategory): string => {
    switch (category) {
      case 'health':
        return themeColors.neon.emerald;
      case 'intellect':
        return themeColors.neon.cyan;
      case 'detox':
        return themeColors.neon.orange;
      case 'business':
        return themeColors.neon.purple;
      default:
        return themeColors.neon.purple;
    }
  };

  // Obter ícone da categoria
  const getCategoryIcon = (category: HabitCategory) => {
    switch (category) {
      case 'health':
        return Dumbbell;
      case 'intellect':
        return Brain;
      case 'detox':
        return PhoneOff;
      case 'business':
        return Target;
      default:
        return CheckSquare;
    }
  };

  // Heatmap de consistência (últimos 30 dias)
  const getHeatmapData = (habitId: string): boolean[] => {
    const habitLogs = getLogsByHabitId(habitId);
    const heatmap: boolean[] = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const log = habitLogs.find(l => l.date === dateStr);
      heatmap.push(log?.completed || false);
    }
    
    return heatmap;
  };

  // Completar hábito booleano
  const handleBooleanHabitComplete = (habitId: string) => {
    const isCompleted = isCompletedToday(habitId);
    
    if (isCompleted) {
      // Desmarcar
      setCompletedHabits(prev => {
        const newSet = new Set(prev);
        newSet.delete(habitId);
        return newSet;
      });
      
      // Atualizar log
      setLogs(prev => prev.map(log => 
        log.habitId === habitId && log.date === getTodayDateString()
          ? { ...log, completed: false, value: 0 }
          : log
      ));
    } else {
      // Completar
      setCompletedHabits(prev => new Set(prev).add(habitId));
      
      // Animação de glow
      setGlowingHabits(prev => new Set(prev).add(habitId));
      setTimeout(() => {
        setGlowingHabits(prev => {
          const newSet = new Set(prev);
          newSet.delete(habitId);
          return newSet;
        });
      }, 1000);
      
      // Criar ou atualizar log
      const existingLog = todayLogs.find(log => log.habitId === habitId);
      if (existingLog) {
        setLogs(prev => prev.map(log =>
          log.id === existingLog.id
            ? { ...log, completed: true, value: 1 }
            : log
        ));
      } else {
        const newLog: DailyLog = {
          id: `l${Date.now()}`,
          habitId,
          date: getTodayDateString(),
          value: 1,
          completed: true,
        };
        setLogs(prev => [...prev, newLog]);
      }
    }
  };

  // Registrar hábito numérico
  const handleNumericHabitSubmit = (habit: Habit) => {
    const value = parseFloat(inputValues[habit.id] || '0');
    
    if (value <= 0) return;
    
    const isCompleted = habit.goalPerDay ? value >= habit.goalPerDay : value > 0;
    
    // Animação de glow
    setGlowingHabits(prev => new Set(prev).add(habit.id));
    setTimeout(() => {
      setGlowingHabits(prev => {
        const newSet = new Set(prev);
        newSet.delete(habit.id);
        return newSet;
      });
    }, 1000);
    
    if (isCompleted) {
      setCompletedHabits(prev => new Set(prev).add(habit.id));
    }
    
    // Criar ou atualizar log
    const existingLog = todayLogs.find(log => log.habitId === habit.id);
    if (existingLog) {
      setLogs(prev => prev.map(log =>
        log.id === existingLog.id
          ? { ...log, completed: isCompleted, value }
          : log
      ));
    } else {
      const newLog: DailyLog = {
        id: `l${Date.now()}`,
        habitId: habit.id,
        date: getTodayDateString(),
        value,
        completed: isCompleted,
      };
      setLogs(prev => [...prev, newLog]);
    }
    
    // Limpar input
    setInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[habit.id];
      return newValues;
    });
  };

  // Agrupar hábitos por categoria
  const habitsByCategory = useMemo(() => {
    const grouped: Record<HabitCategory, Habit[]> = {
      health: [],
      intellect: [],
      detox: [],
      business: [],
    };
    
    MOCK_HABITS.forEach(habit => {
      grouped[habit.category].push(habit);
    });
    
    return grouped;
  }, []);

  return (
    <PageContainer>
      {/* Score do Dia */}
      <div>
        <Card variant="neon" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginBottom: '0.5rem', margin: 0 }}>
                Score do Dia
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <p
                  style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: dailyScore >= 75 ? themeColors.neon.emerald : dailyScore >= 50 ? themeColors.neon.cyan : themeColors.neon.orange,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {dailyScore}%
                </p>
                <Sparkles style={{ width: '1.5rem', height: '1.5rem', color: themeColors.neon.purple }} />
              </div>
              <p style={{ fontSize: '1rem', color: themeColors.text, fontWeight: '500', margin: 0 }}>
                {motivationalPhrase}
              </p>
            </div>
            <div
              style={{
                width: '8rem',
                height: '8rem',
                borderRadius: '50%',
                border: `4px solid ${dailyScore >= 75 ? themeColors.neon.emerald : dailyScore >= 50 ? themeColors.neon.cyan : themeColors.neon.orange}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `conic-gradient(${dailyScore >= 75 ? themeColors.neon.emerald : dailyScore >= 50 ? themeColors.neon.cyan : themeColors.neon.orange} ${dailyScore * 3.6}deg, ${themeColors.surface} ${dailyScore * 3.6}deg)`,
              }}
            >
              <div
                style={{
                  width: '6rem',
                  height: '6rem',
                  borderRadius: '50%',
                  backgroundColor: themeColors.surface,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target style={{ width: '2rem', height: '2rem', color: themeColors.neon.purple }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid de Hábitos por Categoria */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {(['health', 'intellect', 'detox', 'business'] as HabitCategory[]).map(category => {
          const habits = habitsByCategory[category];
          if (habits.length === 0) return null;
          
          const CategoryIcon = getCategoryIcon(category);
          const categoryColor = getCategoryColor(category);
          const categoryNames: Record<HabitCategory, string> = {
            health: 'Saúde',
            intellect: 'Intelecto',
            detox: 'Detox',
            business: 'Negócios',
          };

          return (
            <div key={category}>
              {/* Cabeçalho da Categoria */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: `${categoryColor}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CategoryIcon style={{ width: '1.25rem', height: '1.25rem', color: categoryColor }} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                  {categoryNames[category]}
                </h2>
              </div>

              {/* Grid de Cards de Hábitos */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {habits.map(habit => {
                  const isCompleted = isCompletedToday(habit.id);
                  const isGlowing = glowingHabits.has(habit.id);
                  const todayLog = getTodayLog(habit.id);
                  const heatmap = getHeatmapData(habit.id);
                  const isNumeric = habit.goalPerDay !== undefined;

                  return (
                    <Card
                      key={habit.id}
                      padding="lg"
                      style={{
                        position: 'relative',
                        border: isGlowing ? `2px solid ${categoryColor}` : undefined,
                        boxShadow: isGlowing
                          ? `0 0 20px ${categoryColor}66, 0 0 40px ${categoryColor}33`
                          : undefined,
                        transition: 'all 0.3s ease-in-out',
                        animation: isGlowing ? 'pulse 0.6s ease-in-out' : undefined,
                      }}
                    >
                      {/* Título e Streak */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                          {habit.title}
                        </h3>
                        {habit.streak > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Flame style={{ width: '1rem', height: '1rem', color: themeColors.neon.orange }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.neon.orange }}>
                              {habit.streak}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Hábito Booleano */}
                      {!isNumeric && (
                        <div>
                          <button
                            onClick={() => handleBooleanHabitComplete(habit.id)}
                            style={{
                              width: '100%',
                              padding: '1.5rem',
                              borderRadius: '0.75rem',
                              border: `2px solid ${isCompleted ? categoryColor : themeColors.border}`,
                              backgroundColor: isCompleted
                                ? `${categoryColor}33`
                                : theme === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.02)',
                              color: isCompleted ? categoryColor : themeColors.textSecondary,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.75rem',
                              fontSize: '1rem',
                              fontWeight: '600',
                            }}
                            onMouseEnter={(e) => {
                              if (!isCompleted) {
                                e.currentTarget.style.borderColor = categoryColor;
                                e.currentTarget.style.backgroundColor = `${categoryColor}1A`;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isCompleted) {
                                e.currentTarget.style.borderColor = themeColors.border;
                                e.currentTarget.style.backgroundColor = theme === 'dark'
                                  ? 'rgba(255, 255, 255, 0.05)'
                                  : 'rgba(0, 0, 0, 0.02)';
                              }
                            }}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 style={{ width: '1.5rem', height: '1.5rem' }} />
                                <span>Concluído!</span>
                              </>
                            ) : (
                              <>
                                <CheckSquare style={{ width: '1.5rem', height: '1.5rem' }} />
                                <span>Marcar como feito</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Hábito Numérico */}
                      {isNumeric && (
                        <div>
                          <div style={{ marginBottom: '1rem' }}>
                            <label
                              style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                color: themeColors.textSecondary,
                                marginBottom: '0.5rem',
                              }}
                            >
                              Meta: {habit.goalPerDay} {habit.unit}
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <div style={{ flex: 1 }}>
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={inputValues[habit.id] || (todayLog?.value || 0).toString()}
                                  onChange={(e) =>
                                    setInputValues(prev => ({ ...prev, [habit.id]: e.target.value }))
                                  }
                                  placeholder={`0 ${habit.unit}`}
                                />
                              </div>
                              <Button
                                variant="primary"
                                onClick={() => handleNumericHabitSubmit(habit)}
                                disabled={!inputValues[habit.id] && !todayLog}
                              >
                                Registrar
                              </Button>
                            </div>
                            {todayLog && (
                              <p
                                style={{
                                  fontSize: '0.875rem',
                                  marginTop: '0.5rem',
                                  margin: 0,
                                  color: todayLog.completed ? themeColors.neon.emerald : themeColors.textSecondary,
                                }}
                              >
                                {todayLog.completed ? '✅ Meta atingida!' : `Registrado: ${todayLog.value} ${habit.unit}`}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Heatmap Mini */}
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${themeColors.border}` }}>
                        <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, marginBottom: '0.5rem', margin: 0 }}>
                          Últimos 30 dias
                        </p>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(10, 1fr)',
                            gap: '0.25rem',
                          }}
                        >
                          {heatmap.map((completed, index) => (
                            <div
                              key={index}
                              style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '0.25rem',
                                backgroundColor: completed
                                  ? categoryColor
                                  : theme === 'dark'
                                  ? 'rgba(255, 255, 255, 0.1)'
                                  : 'rgba(0, 0, 0, 0.1)',
                                border: `1px solid ${themeColors.border}`,
                              }}
                              title={`Dia ${index + 1}: ${completed ? 'Completo' : 'Incompleto'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS para animação de pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
    </PageContainer>
  );
};
