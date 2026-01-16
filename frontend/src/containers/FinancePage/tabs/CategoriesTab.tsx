import { FC, useState, useMemo } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { getTheme } from '../../../styles/theme';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
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
  X,
} from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_TRANSACTIONS } from '../../../mocks/database';
import type { Category } from '../../../mocks/database';

/**
 * CategoriesTab - Aba de Categorias com Gestão de Orçamento
 * Visualiza categorias com limites de orçamento e gastos atuais
 */
export const CategoriesTab: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const [budgetLimits, setBudgetLimits] = useState<Record<string, number>>({
    '1': 1000, // Alimentação
    '2': 500,  // Transporte
    '3': 2000, // Moradia
    '4': 0,    // Salário (receita, sem limite)
    '5': 0,    // Freelance (receita, sem limite)
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editBudgetValue, setEditBudgetValue] = useState<string>('');

  // Função para obter ícone da categoria
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
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

  // Calcular gastos atuais por categoria (apenas despesas)
  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    
    MOCK_TRANSACTIONS
      .filter(t => t.type === 'expense' && t.categoryId)
      .forEach(t => {
        const categoryId = t.categoryId!;
        spending[categoryId] = (spending[categoryId] || 0) + Math.abs(t.amount);
      });

    return spending;
  }, []);

  // Filtrar apenas categorias de despesa para orçamento
  const expenseCategories = useMemo(() => {
    return MOCK_CATEGORIES.filter(c => c.type === 'expense');
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return themeColors.neon.emerald;
    if (percentage < 90) return themeColors.neon.orange;
    return themeColors.status.error;
  };

  const handleEditBudget = (category: Category) => {
    setEditingCategory(category);
    setEditBudgetValue(budgetLimits[category.id]?.toString() || '0');
  };

  const handleSaveBudget = () => {
    if (editingCategory) {
      const value = parseFloat(editBudgetValue) || 0;
      setBudgetLimits(prev => ({
        ...prev,
        [editingCategory.id]: value,
      }));
      setEditingCategory(null);
      setEditBudgetValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditBudgetValue('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: '0 0 0.5rem 0' }}>
          Gestão de Orçamento por Categoria
        </h2>
        <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
          Monitore seus gastos e defina limites para cada categoria
        </p>
      </div>

      {/* Grid de Categorias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {expenseCategories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          const currentSpending = categorySpending[category.id] || 0;
          const budgetLimit = budgetLimits[category.id] || 0;
          const percentage = budgetLimit > 0 ? (currentSpending / budgetLimit) * 100 : 0;
          const progressColor = getProgressColor(percentage);
          const isEditing = editingCategory?.id === category.id;

          return (
            <Card
              key={category.id}
              padding="lg"
              style={{
                position: 'relative',
                border: `1px solid ${themeColors.border}`,
                transition: 'all 0.3s',
                cursor: 'pointer',
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
              onClick={() => !isEditing && handleEditBudget(category)}
            >
              {/* Botão de Edição */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditBudget(category);
                }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
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
                  zIndex: 10,
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
                <Icon style={{ width: '2rem', height: '2rem', color: category.color }} />
              </div>

              {/* Nome da Categoria */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: '0 0 1rem 0' }}>
                {category.name}
              </h3>

              {/* Modal de Edição (Inline) */}
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, marginBottom: '0.5rem' }}>
                      Limite de Orçamento Mensal
                    </label>
                    <Input
                      type="number"
                      value={editBudgetValue}
                      onChange={(e) => setEditBudgetValue(e.target.value)}
                      placeholder="0.00"
                      style={{ width: '100%' }}
                      autoFocus
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveBudget();
                      }}
                      style={{ flex: 1 }}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelEdit();
                      }}
                      style={{ flex: 1 }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Gasto Atual vs Meta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: themeColors.textSecondary }}>
                        Gasto Atual
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text }}>
                        {formatCurrency(currentSpending)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: themeColors.textSecondary }}>
                        Meta de Gasto
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.textSecondary }}>
                        {budgetLimit > 0 ? formatCurrency(budgetLimit) : 'Não definido'}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  {budgetLimit > 0 ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary }}>
                          {percentage.toFixed(1)}% utilizado
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: progressColor,
                          }}
                        >
                          {percentage >= 100 ? 'Limite excedido!' : percentage >= 90 ? 'Atenção!' : 'Dentro do limite'}
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '10px',
                          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                            height: '100%',
                            backgroundColor: progressColor,
                            borderRadius: '9999px',
                            transition: 'width 0.3s',
                            boxShadow: `0 0 8px ${progressColor}66`,
                          }}
                        />
                        {percentage > 100 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: '100%',
                              width: `${percentage - 100}%`,
                              height: '100%',
                              backgroundColor: themeColors.status.error,
                              borderRadius: '9999px',
                              opacity: 0.5,
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
                      }}
                    >
                      <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                        Clique para definir um limite de orçamento
                      </p>
                    </div>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* Resumo Geral */}
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
                expenseCategories.reduce((sum, cat) => sum + (budgetLimits[cat.id] || 0), 0)
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
                expenseCategories.reduce((sum, cat) => sum + (budgetLimits[cat.id] || 0), 0) -
                expenseCategories.reduce((sum, cat) => sum + (categorySpending[cat.id] || 0), 0)
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
