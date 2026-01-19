import { FC, useState, useMemo, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { getTheme } from '../../../styles/theme';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  UtensilsCrossed,
  Car,
  Home,
  DollarSign,
  Briefcase,
  ShoppingBag,
  Heart,
  GraduationCap,
  Gamepad2,
  Plane,
  Coffee,
  Zap,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';
import { ManageCategoryModal } from '../../../components/modals/ManageCategoryModal';

interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  icon?: string;
  budget_limit?: number;
}

/**
 * CategoriesTab - Aba de Categorias com Gestão de Orçamento
 * Visualiza categorias com limites de orçamento e gastos atuais
 */
export const CategoriesTab: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // Buscar categorias e transações do Supabase
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (categoriesError) {
        console.error('Erro ao buscar categorias:', categoriesError);
      } else {
        setCategories(categoriesData || []);
      }

      // Buscar transações do mês atual
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', firstDay.toISOString().split('T')[0])
        .lte('date', lastDay.toISOString().split('T')[0]);

      if (transactionsError) {
        console.error('Erro ao buscar transações:', transactionsError);
      } else {
        setTransactions(transactionsData || []);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para obter ícone da categoria (fallback se não tiver emoji)
  const getCategoryIcon = (category: Category) => {
    if (category.icon) {
      // Se tiver emoji, retornar componente que renderiza emoji
      return () => <span style={{ fontSize: '2rem' }}>{category.icon}</span>;
    }
    
    const name = category.name.toLowerCase();
    if (name.includes('aliment') || name.includes('comida')) return UtensilsCrossed;
    if (name.includes('transporte') || name.includes('uber') || name.includes('taxi')) return Car;
    if (name.includes('moradia') || name.includes('casa') || name.includes('aluguel')) return Home;
    if (name.includes('salário') || name.includes('salario')) return DollarSign;
    if (name.includes('freelance') || name.includes('trabalho')) return Briefcase;
    if (name.includes('compras') || name.includes('shopping')) return ShoppingBag;
    if (name.includes('saúde') || name.includes('saude')) return Heart;
    if (name.includes('educação') || name.includes('educacao')) return GraduationCap;
    if (name.includes('lazer') || name.includes('jogo')) return Gamepad2;
    if (name.includes('viagem') || name.includes('turismo')) return Plane;
    if (name.includes('café') || name.includes('cafe')) return Coffee;
    return Zap;
  };

  // Calcular gastos atuais por categoria (apenas despesas do mês atual)
  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    
    transactions
      .filter(t => t.category_id)
      .forEach(t => {
        const categoryId = t.category_id;
        spending[categoryId] = (spending[categoryId] || 0) + Math.abs(t.amount || 0);
      });

    return spending;
  }, [transactions]);

  // Filtrar apenas categorias de despesa para orçamento
  const expenseCategories = useMemo(() => {
    return categories.filter(c => c.type === 'expense');
  }, [categories]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return themeColors.neon.emerald; // Verde - Confortável
    if (percentage < 90) return themeColors.neon.orange; // Amarelo - Atenção
    return themeColors.status.error; // Vermelho - Perigo/Estourado
  };

  const handleNewCategory = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    if (!user) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchData();
    } catch (err: any) {
      console.error('Erro ao excluir categoria:', err);
      alert('Erro ao excluir categoria. Tente novamente.');
    }
  };

  const handleModalSuccess = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p style={{ color: themeColors.textSecondary }}>Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: '0 0 0.5rem 0' }}>
            Gestão de Orçamento por Categoria
          </h2>
          <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
            Monitore seus gastos e defina limites para cada categoria
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleNewCategory}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
        >
          <Plus style={{ width: '1rem', height: '1rem' }} />
          Nova Categoria
        </Button>
      </div>

      {/* Grid de Categorias */}
      {expenseCategories.length === 0 ? (
        <Card padding="lg">
          <div style={{ padding: '3rem', textAlign: 'center', color: themeColors.textSecondary }}>
            <p style={{ fontSize: '1rem', margin: '0 0 1rem 0' }}>
              Nenhuma categoria de despesa cadastrada.
            </p>
            <Button variant="primary" onClick={handleNewCategory}>
              Criar Primeira Categoria
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {expenseCategories.map((category) => {
            const IconComponent = getCategoryIcon(category);
            const currentSpending = categorySpending[category.id] || 0;
            const budgetLimit = category.budget_limit || 0;
            const percentage = budgetLimit > 0 ? (currentSpending / budgetLimit) * 100 : 0;
            const progressColor = getProgressColor(percentage);
            const remaining = budgetLimit - currentSpending;
            const exceeded = currentSpending - budgetLimit;

            return (
              <Card
                key={category.id}
                padding="lg"
                style={{
                  position: 'relative',
                  border: `1px solid ${themeColors.border}`,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = category.color;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = theme === 'dark'
                    ? `0 10px 25px -5px ${category.color}33`
                    : `0 10px 25px -5px ${category.color}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = themeColors.border;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Menu de Ações */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 10,
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category);
                    }}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                      color: themeColors.textSecondary,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.color = themeColors.neon.purple;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                      e.currentTarget.style.color = themeColors.textSecondary;
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                      color: themeColors.textSecondary,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.color = themeColors.status.error;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                      e.currentTarget.style.color = themeColors.textSecondary;
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Ícone Grande */}
                <div
                  style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '1rem',
                    backgroundColor: `${category.color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    border: `2px solid ${category.color}66`,
                  }}
                >
                  {category.icon ? (
                    <span style={{ fontSize: '2rem' }}>{category.icon}</span>
                  ) : (
                    <IconComponent style={{ width: '2rem', height: '2rem', color: category.color }} />
                  )}
                </div>

                {/* Nome da Categoria */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: '0 0 1rem 0' }}>
                  {category.name}
                </h3>

                {/* Gasto Atual vs Meta */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: themeColors.textSecondary, 
                    margin: '0 0 0.5rem 0' 
                  }}>
                    Gasto vs Meta
                  </p>
                  <p style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: themeColors.text,
                    margin: 0 
                  }}>
                    {formatCurrency(currentSpending)} / {budgetLimit > 0 ? formatCurrency(budgetLimit) : 'Sem meta'}
                  </p>
                </div>

                {/* Barra de Progresso */}
                {budgetLimit > 0 ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary }}>
                        {percentage.toFixed(1)}% utilizado
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: progressColor,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        {percentage >= 100 && <AlertCircle size={12} />}
                        {percentage >= 100 ? 'Limite excedido!' : percentage >= 90 ? 'Atenção!' : 'Dentro do limite'}
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '12px',
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        position: 'relative',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          height: '100%',
                          backgroundColor: progressColor,
                          borderRadius: '9999px',
                          transition: 'width 0.3s',
                          boxShadow: percentage >= 90 ? `0 0 12px ${progressColor}66` : 'none',
                          animation: percentage >= 100 ? 'pulse 2s infinite' : 'none',
                        }}
                      />
                      {percentage > 100 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: '100%',
                            width: `${Math.min(percentage - 100, 50)}%`,
                            height: '100%',
                            backgroundColor: themeColors.status.error,
                            borderRadius: '9999px',
                            opacity: 0.7,
                            animation: 'pulse 1.5s infinite',
                          }}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '1rem',
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                      borderRadius: '0.5rem',
                      textAlign: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                      Clique em Editar para definir um limite de orçamento
                    </p>
                  </div>
                )}

                {/* Footer: Restante ou Excedido */}
                {budgetLimit > 0 && (
                  <div
                    style={{
                      padding: '0.75rem',
                      backgroundColor: percentage >= 100
                        ? `${themeColors.status.error}15`
                        : percentage >= 90
                        ? `${themeColors.neon.orange}15`
                        : `${themeColors.neon.emerald}15`,
                      borderRadius: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: percentage >= 100
                          ? themeColors.status.error
                          : percentage >= 90
                          ? themeColors.neon.orange
                          : themeColors.neon.emerald,
                        margin: 0,
                      }}
                    >
                      {percentage >= 100
                        ? `⚠️ Excedeu ${formatCurrency(exceeded)}`
                        : `✅ Você economizou ${formatCurrency(remaining)}`}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Resumo Geral */}
      {expenseCategories.length > 0 && (
        <Card padding="lg">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, marginBottom: '1.5rem', margin: 0 }}>
            Resumo do Orçamento
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0 0 0.5rem 0' }}>
                Total Orçado
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                {formatCurrency(
                  expenseCategories.reduce((sum, cat) => sum + (cat.budget_limit || 0), 0)
                )}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0 0 0.5rem 0' }}>
                Total Gasto
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                {formatCurrency(
                  expenseCategories.reduce((sum, cat) => sum + (categorySpending[cat.id] || 0), 0)
                )}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0 0 0.5rem 0' }}>
                Disponível
              </p>
              <p
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: themeColors.neon.emerald,
                  margin: 0,
                }}
              >
                {formatCurrency(
                  expenseCategories.reduce((sum, cat) => sum + (cat.budget_limit || 0), 0) -
                  expenseCategories.reduce((sum, cat) => sum + (categorySpending[cat.id] || 0), 0)
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de Categoria */}
      <ManageCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoryToEdit(null);
        }}
        onSuccess={handleModalSuccess}
        categoryToEdit={categoryToEdit}
      />

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
    </div>
  );
};
