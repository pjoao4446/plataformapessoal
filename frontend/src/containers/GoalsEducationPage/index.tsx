import { useMemo, useState, useEffect } from 'react';
import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageContainer } from '../../components/layout/PageContainer';
import {
  Languages,
  Mic2,
  Cpu,
  Globe,
  Plus,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import type { Skill, SkillCategory } from '../../mocks/database';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

/**
 * GoalsEducationPage - Página de Habilidades Educacionais
 * Visual gamificado estilo RPG com ficha de personagem
 * Design System: VertexGuard Premium Dark/Light
 */
export const GoalsEducationPage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar habilidades do Supabase
  useEffect(() => {
    if (user) {
      fetchSkills();
    }
  }, [user]);

  const fetchSkills = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Por enquanto, deixar vazio pois pode não haver tabela de habilidades
      // Se houver, buscar assim:
      // const { data } = await supabase
      //   .from('skills')
      //   .select('*')
      //   .eq('user_id', user.id);
      // setSkills(data || []);
      setSkills([]);
    } catch (err) {
      console.error('Erro ao carregar habilidades:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular total de horas estudadas
  const totalHours = useMemo(() => {
    return skills.reduce((total, skill) => total + (skill.hoursStudied || 0), 0);
  }, [skills]);

  // Obter ícone da categoria
  const getCategoryIcon = (category: SkillCategory) => {
    switch (category) {
      case 'language':
        return Languages;
      case 'soft_skill':
        return Mic2;
      case 'tech':
        return Cpu;
      case 'general':
        return Globe;
      default:
        return BookOpen;
    }
  };

  // Obter cor da categoria
  const getCategoryColor = (category: SkillCategory): string => {
    switch (category) {
      case 'language':
        return themeColors.neon.cyan;
      case 'soft_skill':
        return themeColors.neon.purple;
      case 'tech':
        return themeColors.neon.emerald;
      case 'general':
        return themeColors.neon.orange;
      default:
        return themeColors.neon.purple;
    }
  };

  // Obter cor do gradiente baseado no nível
  const getLevelGradient = (level: number): string => {
    if (level >= 75) {
      return `linear-gradient(to right, ${themeColors.neon.emerald}, ${themeColors.neon.cyan})`;
    } else if (level >= 50) {
      return `linear-gradient(to right, ${themeColors.neon.purple}, ${themeColors.neon.pink})`;
    } else {
      return `linear-gradient(to right, ${themeColors.neon.orange}, ${themeColors.neon.purple})`;
    }
  };

  // Formatar horas
  const formatHours = (hours: number): string => {
    if (hours >= 1000) {
      return `${(hours / 1000).toFixed(1)}k`;
    }
    return hours.toString();
  };

  return (
    <PageContainer>
      {/* KPI - Total de Horas Estudadas */}
      <div>
        <Card variant="neon" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginBottom: '0.5rem', margin: 0 }}>
                Total de Horas Estudadas
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <p
                  style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: themeColors.neon.purple,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {formatHours(totalHours)}
                </p>
                <span style={{ fontSize: '1.25rem', color: themeColors.textSecondary }}>h</span>
              </div>
            </div>
            <div
              style={{
                width: '6rem',
                height: '6rem',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${themeColors.neon.purple}, ${themeColors.neon.cyan})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 20px ${themeColors.neon.purple}66`,
              }}
            >
              <BookOpen style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Grid de Skills */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: themeColors.textSecondary }}>
            Carregando habilidades...
          </div>
        ) : skills.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: themeColors.textSecondary }}>
            Nenhuma habilidade cadastrada
          </div>
        ) : (
          skills.map(skill => {
          const CategoryIcon = getCategoryIcon(skill.category);
          const categoryColor = getCategoryColor(skill.category);
          const levelGradient = getLevelGradient(skill.level);

          return (
            <Card
              key={skill.id}
              padding="lg"
              variant="glass"
              style={{
                position: 'relative',
                border: `2px solid ${categoryColor}33`,
                background: theme === 'dark'
                  ? `linear-gradient(135deg, rgba(21, 23, 37, 0.9), rgba(30, 33, 57, 0.9))`
                  : `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.9))`,
              }}
            >
              {/* Ícone Grande no Topo */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    width: '5rem',
                    height: '5rem',
                    borderRadius: '1rem',
                    background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}CC)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${categoryColor}66`,
                    border: `2px solid ${categoryColor}99`,
                  }}
                >
                  <CategoryIcon style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                </div>
              </div>

              {/* Título e Label de Nível */}
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, marginBottom: '0.25rem', margin: 0 }}>
                  {skill.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <TrendingUp style={{ width: '0.875rem', height: '0.875rem', color: categoryColor }} />
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: categoryColor,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      backgroundColor: `${categoryColor}33`,
                    }}
                  >
                    {skill.currentLevelLabel}
                  </span>
                </div>
              </div>

              {/* Barra de XP (Level) */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nível
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: themeColors.text }}>
                    {skill.level}/100
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '1rem',
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: `1px solid ${categoryColor}33`,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: levelGradient,
                      borderRadius: '9999px',
                      transition: 'width 0.5s ease',
                      width: `${skill.level}%`,
                      boxShadow: `0 0 10px ${categoryColor}66`,
                    }}
                  />
                  {/* Efeito de brilho */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: `${skill.level}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)`,
                      animation: 'shimmer 2s infinite',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: themeColors.textMuted }}>
                    Meta: {skill.targetLevel}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock style={{ width: '0.75rem', height: '0.75rem', color: themeColors.textMuted }} />
                    <span style={{ fontSize: '0.75rem', color: themeColors.textMuted }}>
                      {formatHours(skill.hoursStudied)}h
                    </span>
                  </div>
                </div>
              </div>

              {/* Próximo Milestone */}
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  border: `1px solid ${themeColors.border}`,
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Target style={{ width: '0.875rem', height: '0.875rem', color: categoryColor, marginTop: '0.125rem', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, marginBottom: '0.25rem', margin: 0 }}>
                      Próximo Nível:
                    </p>
                    <p style={{ fontSize: '0.875rem', color: themeColors.text, fontWeight: '500', margin: 0 }}>
                      {skill.nextMilestone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão Registrar Sessão */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log(`Registrar sessão de estudo: ${skill.title}`)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  borderColor: categoryColor,
                  color: categoryColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${categoryColor}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Plus style={{ width: '1rem', height: '1rem' }} />
                Registrar Sessão
              </Button>
            </Card>
          );
          })
        )}
      </div>

      {/* CSS para animação de shimmer */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </PageContainer>
  );
};
