import { useState, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageContainer } from '../../components/layout/PageContainer';
import {
  Building2,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  DollarSign,
  Rocket,
  Lightbulb,
  Pause,
  CheckSquare,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import {
  calculateProjectProgress,
  type Project,
  type ProjectStatus,
  type Milestone,
} from '../../mocks/database';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

/**
 * GoalsBusinessPage - Página de Metas Empresariais e Projetos
 * Visão de Roadmap com milestones e progresso
 * Design System: VertexGuard Premium Dark/Light
 */
export const GoalsBusinessPage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar projetos do Supabase
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Por enquanto, deixar vazio pois pode não haver tabela de projetos
      // Se houver, buscar assim:
      // const { data } = await supabase
      //   .from('projects')
      //   .select('*')
      //   .eq('user_id', user.id);
      // setProjects(data || []);
      
      // Dados mockados para demonstração
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Plataforma E-commerce',
          title: 'Plataforma E-commerce',
          description: 'Sistema completo de e-commerce com gestão de produtos, carrinho e checkout',
          status: 'in_progress',
          startDate: '2024-01-15',
          deadline: '2024-08-30',
          progress: 45,
          techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
          milestones: [
            {
              id: 'm1',
              title: 'Setup inicial e arquitetura',
              description: 'Configurar repositório, CI/CD e definir arquitetura',
              deadline: '2024-02-15',
              completed: true,
              completedDate: '2024-02-10',
            },
            {
              id: 'm2',
              title: 'Sistema de autenticação',
              description: 'Implementar login, registro e recuperação de senha',
              deadline: '2024-03-30',
              completed: true,
              completedDate: '2024-03-25',
            },
            {
              id: 'm3',
              title: 'Catálogo de produtos',
              description: 'CRUD de produtos com busca e filtros',
              deadline: '2024-05-15',
              completed: false,
            },
            {
              id: 'm4',
              title: 'Carrinho de compras',
              description: 'Adicionar, remover e atualizar itens no carrinho',
              deadline: '2024-06-30',
              completed: false,
            },
            {
              id: 'm5',
              title: 'Sistema de pagamento',
              description: 'Integração com gateway de pagamento',
              deadline: '2024-08-15',
              completed: false,
            },
          ],
        },
        {
          id: '2',
          name: 'App de Gestão Financeira',
          title: 'App de Gestão Financeira',
          description: 'Aplicativo mobile para controle de finanças pessoais',
          status: 'mvp',
          startDate: '2024-02-01',
          deadline: '2024-07-31',
          progress: 70,
          techStack: ['React Native', 'Firebase', 'TypeScript'],
          revenue: 2500,
          milestones: [
            {
              id: 'm6',
              title: 'MVP - Funcionalidades básicas',
              description: 'Cadastro, transações e relatórios simples',
              deadline: '2024-04-30',
              completed: true,
              completedDate: '2024-04-25',
            },
            {
              id: 'm7',
              title: 'Sistema de categorias',
              description: 'Gestão de categorias de receitas e despesas',
              deadline: '2024-05-31',
              completed: true,
              completedDate: '2024-05-28',
            },
            {
              id: 'm8',
              title: 'Gráficos e relatórios avançados',
              description: 'Dashboard com gráficos e análises',
              deadline: '2024-06-30',
              completed: false,
            },
            {
              id: 'm9',
              title: 'Lançamento na App Store',
              description: 'Publicar app nas lojas',
              deadline: '2024-07-31',
              completed: false,
            },
          ],
        },
        {
          id: '3',
          name: 'SaaS de Gestão de Projetos',
          title: 'SaaS de Gestão de Projetos',
          description: 'Plataforma web para gestão de projetos e equipes',
          status: 'idea',
          startDate: '2024-06-01',
          deadline: '2024-12-31',
          progress: 5,
          techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
          milestones: [
            {
              id: 'm10',
              title: 'Pesquisa de mercado',
              description: 'Validar ideia e identificar concorrentes',
              deadline: '2024-06-30',
              completed: true,
              completedDate: '2024-06-20',
            },
            {
              id: 'm11',
              title: 'Protótipo de alta fidelidade',
              description: 'Criar wireframes e protótipo no Figma',
              deadline: '2024-07-31',
              completed: false,
            },
            {
              id: 'm12',
              title: 'Desenvolvimento do MVP',
              description: 'Implementar funcionalidades core',
              deadline: '2024-10-31',
              completed: false,
            },
            {
              id: 'm13',
              title: 'Beta testing',
              description: 'Testar com usuários beta',
              deadline: '2024-11-30',
              completed: false,
            },
          ],
        },
      ];
      
      setProjects(mockProjects);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const stats = useMemo(() => {
    const activeProjects = projects.filter(p => 
      p.status === 'in_progress' || p.status === 'mvp'
    ).length;
    
    const nextDeadline = projects
      .flatMap(p => p.milestones)
      .filter(m => !m.completed && m.deadline)
      .sort((a, b) => {
        if (!a.deadline || !b.deadline) return 0;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      })[0];

    return {
      activeProjects,
      nextDeadline: nextDeadline?.deadline,
    };
  }, [projects]);

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Obter cor e ícone do status
  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case 'idea':
        return {
          color: themeColors.textMuted,
          bgColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          icon: Lightbulb,
          label: 'Ideia',
        };
      case 'in_progress':
        return {
          color: themeColors.neon.cyan,
          bgColor: `${themeColors.neon.cyan}33`,
          icon: Rocket,
          label: 'Em Progresso',
        };
      case 'mvp':
        return {
          color: themeColors.neon.purple,
          bgColor: `${themeColors.neon.purple}33`,
          icon: Rocket,
          label: 'MVP',
        };
      case 'completed':
        return {
          color: themeColors.neon.emerald,
          bgColor: `${themeColors.neon.emerald}33`,
          icon: CheckCircle2,
          label: 'Concluído',
        };
      case 'paused':
        return {
          color: themeColors.neon.orange,
          bgColor: `${themeColors.neon.orange}33`,
          icon: Pause,
          label: 'Pausado',
        };
      default:
        return {
          color: themeColors.textMuted,
          bgColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          icon: Circle,
          label: status,
        };
    }
  };

  // Toggle milestone
  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;
      
      const updatedMilestones = project.milestones.map(milestone => {
        if (milestone.id !== milestoneId) return milestone;
        return { ...milestone, completed: !milestone.completed };
      });
      
      const newProgress = calculateProjectProgress(updatedMilestones);
      
      return {
        ...project,
        milestones: updatedMilestones,
        progress: newProgress,
      };
    }));
  };

  return (
    <PageContainer>
      {/* Botão Novo Projeto */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="primary"
          onClick={() => console.log('Novo projeto')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus style={{ width: '1rem', height: '1rem' }} />
          Novo Projeto
        </Button>
      </div>

      {/* Resumo Rápido */}
      <Card variant="glass" padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginBottom: '0.25rem', margin: 0 }}>
              Projetos Ativos
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
              {stats.activeProjects} {stats.activeProjects === 1 ? 'Projeto' : 'Projetos'}
            </p>
          </div>
          {stats.nextDeadline && (
            <>
              <div style={{ width: '1px', height: '2rem', backgroundColor: themeColors.border }} />
              <div>
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginBottom: '0.25rem', margin: 0 }}>
                  Próxima Entrega
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar style={{ width: '1rem', height: '1rem', color: themeColors.neon.purple }} />
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                    {formatDate(stats.nextDeadline)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Grid de Projetos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {loading ? (
          <Card padding="lg">
            <div style={{ textAlign: 'center', padding: '2rem', color: themeColors.textSecondary }}>
              Carregando projetos...
            </div>
          </Card>
        ) : projects.length === 0 ? (
          <Card padding="lg">
            <div style={{ textAlign: 'center', padding: '2rem', color: themeColors.textSecondary }}>
              <Building2 style={{ width: '3rem', height: '3rem', color: themeColors.textMuted, margin: '0 auto 1rem' }} />
              <p style={{ margin: 0 }}>
                Nenhum projeto cadastrado
              </p>
            </div>
          </Card>
        ) : (
          projects.map((project: Project) => {
          const statusConfig = getStatusConfig(project.status);
          const StatusIcon = statusConfig.icon;
          const currentProgress = calculateProjectProgress(project.milestones);

          return (
            <Card key={project.id} padding="lg" variant="glass">
              {/* Header do Card */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, marginBottom: '0.25rem', margin: 0 }}>
                    {project.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                    {project.description}
                  </p>
                </div>
                {/* Badge de Status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: statusConfig.bgColor,
                    color: statusConfig.color,
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}
                >
                  <StatusIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                  {statusConfig.label}
                </div>
              </div>

              {/* Barra de Progresso */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: themeColors.textSecondary }}>Progresso</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.text }}>
                    {currentProgress}%
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
                      width: `${currentProgress}%`,
                    }}
                  />
                </div>
              </div>

              {/* Lista de Milestones */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.text, marginBottom: '0.75rem', margin: 0 }}>
                  Marcos (Milestones)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {project.milestones.map(milestone => (
                    <div
                      key={milestone.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        backgroundColor: milestone.completed
                          ? `${themeColors.neon.emerald}1A`
                          : theme === 'dark'
                          ? 'rgba(255, 255, 255, 0.02)'
                          : 'rgba(0, 0, 0, 0.02)',
                        border: `1px solid ${milestone.completed ? themeColors.neon.emerald : themeColors.border}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => toggleMilestone(project.id, milestone.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = milestone.completed
                          ? themeColors.neon.emerald
                          : themeColors.neon.purple;
                        e.currentTarget.style.backgroundColor = milestone.completed
                          ? `${themeColors.neon.emerald}33`
                          : theme === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = milestone.completed
                          ? themeColors.neon.emerald
                          : themeColors.border;
                        e.currentTarget.style.backgroundColor = milestone.completed
                          ? `${themeColors.neon.emerald}1A`
                          : theme === 'dark'
                          ? 'rgba(255, 255, 255, 0.02)'
                          : 'rgba(0, 0, 0, 0.02)';
                      }}
                    >
                      {milestone.completed ? (
                        <CheckCircle2
                          style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            color: themeColors.neon.emerald,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Circle
                          style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            color: themeColors.textMuted,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: milestone.completed ? themeColors.textSecondary : themeColors.text,
                            textDecoration: milestone.completed ? 'line-through' : 'none',
                            margin: 0,
                          }}
                        >
                          {milestone.title}
                        </p>
                        {milestone.deadline && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                            <Calendar style={{ width: '0.75rem', height: '0.75rem', color: themeColors.textMuted }} />
                            <span style={{ fontSize: '0.75rem', color: themeColors.textMuted }}>
                              {formatDate(milestone.deadline)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Tech Stack */}
              {project.techStack && project.techStack.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {project.techStack.map((tech, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          backgroundColor: theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                          color: themeColors.text,
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          border: `1px solid ${themeColors.border}`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rodapé - Receita */}
              {project.revenue && project.revenue > 0 && (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: `${themeColors.neon.emerald}1A`,
                    border: `1px solid ${themeColors.neon.emerald}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.emerald }} />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0 }}>
                      Faturamento Mensal
                    </p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.neon.emerald, margin: 0 }}>
                      {formatCurrency(project.revenue)}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          );
          })
        )}
      </div>
    </PageContainer>
  );
};
