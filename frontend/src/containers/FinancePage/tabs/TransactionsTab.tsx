import { FC, useState, useMemo, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { getTheme } from '../../../styles/theme';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Search, ArrowUpCircle, ArrowDownCircle, Repeat } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

type FilterType = 'all' | 'income' | 'expense' | 'recurring';

/**
 * TransactionsTab - Aba de Transações
 * Lista de transações financeiras com filtros e busca
 */
export const TransactionsTab: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para dados do Supabase
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar dados do Supabase
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Buscar transações
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      // Buscar categorias
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);

      // Buscar contas
      const { data: accountsData } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id);

      setTransactions(transactionsData || []);
      setCategories(categoriesData || []);
      setAccounts(accountsData || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar transações
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Aplicar filtro de tipo
    if (activeFilter === 'income') {
      filtered = filtered.filter(t => t.type === 'income');
    } else if (activeFilter === 'expense') {
      filtered = filtered.filter(t => t.type === 'expense');
    } else if (activeFilter === 'recurring') {
      // Filtrar por recorrências (pode ser baseado em outro campo)
      filtered = filtered.filter(t => t.is_recurring);
    }

    // Aplicar busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(query) ||
        (t.category_id && categories.find(c => c.id === t.category_id)?.name?.toLowerCase().includes(query))
      );
    }

    // Ordenar por data (mais recente primeiro)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });
  }, [activeFilter, searchQuery, transactions, categories]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Sem categoria';
    return categories.find(c => c.id === categoryId)?.name || 'Sem categoria';
  };

  const getAccountName = (accountId?: string) => {
    if (!accountId) return '-';
    return accounts.find(a => a.id === accountId)?.name || '-';
  };

  const filters = [
    { id: 'all' as FilterType, label: 'Todas' },
    { id: 'income' as FilterType, label: 'Receitas' },
    { id: 'expense' as FilterType, label: 'Despesas' },
  ];

  // Função para obter cor da categoria
  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return themeColors.neon.purple;
    const category = categories.find(c => c.id === categoryId);
    return category?.color || themeColors.neon.purple;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Filtros e Busca */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Filtros Estilo iOS (Tabs Segmentadas) */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: themeColors.surface,
            border: `1px solid ${themeColors.border}`,
            borderRadius: '0.75rem',
            padding: '0.25rem',
            gap: '0.25rem',
            width: 'fit-content',
          }}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem',
                  backgroundColor: isActive
                    ? themeColors.neon.purple
                    : 'transparent',
                  color: isActive ? 'white' : themeColors.textSecondary,
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Barra de Busca */}
        <div style={{ maxWidth: '400px', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: themeColors.textSecondary,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <Search size={18} />
          </div>
          <Input
            type="text"
            placeholder="Buscar transações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '2.5rem',
            }}
          />
        </div>
      </div>

      {/* Tabela de Transações */}
      <Card padding="none">
        <div style={{ padding: '1.5rem', borderBottom: `1px solid ${themeColors.border}` }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
            Extrato de Transações
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${themeColors.border}`,
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Data
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Descrição
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Categoria
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Conta
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Valor
                </th>
                <th
                  style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '3rem',
                      textAlign: 'center',
                      color: themeColors.textSecondary,
                    }}
                  >
                    Carregando transações...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '3rem',
                      textAlign: 'center',
                      color: themeColors.textSecondary,
                    }}
                  >
                    Nenhuma transação encontrada
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => {
                  const isIncome = transaction.type === 'income';
                  const isRecurring = transaction.is_recurring || false;

                  return (
                    <tr
                      key={transaction.id}
                      style={{
                        borderBottom: `1px solid ${themeColors.border}`,
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.03)';
                        e.currentTarget.style.transform = 'scale(1.001)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          fontSize: '0.875rem',
                          color: themeColors.textSecondary,
                        }}
                      >
                        {formatDate(transaction.date || '')}
                      </td>
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          fontSize: '0.875rem',
                          color: themeColors.text,
                          fontWeight: '500',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {transaction.description}
                          {isRecurring && (
                            <Repeat size={14} style={{ color: themeColors.textSecondary, opacity: 0.7 }} />
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.375rem 0.875rem',
                            borderRadius: '9999px',
                            backgroundColor: `${getCategoryColor(transaction.category_id)}20`,
                            color: getCategoryColor(transaction.category_id),
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          {getCategoryName(transaction.category_id)}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          fontSize: '0.875rem',
                          color: themeColors.textSecondary,
                        }}
                      >
                        {getAccountName(transaction.account_id)}
                      </td>
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'right',
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: isIncome ? themeColors.neon.emerald : themeColors.status.error,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          {isIncome ? (
                            <ArrowUpCircle style={{ width: '1rem', height: '1rem' }} />
                          ) : (
                            <ArrowDownCircle style={{ width: '1rem', height: '1rem' }} />
                          )}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'center',
                        }}
                      >
                        {isRecurring ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              padding: '0.375rem 0.875rem',
                              borderRadius: '9999px',
                              backgroundColor: `${themeColors.neon.purple}20`,
                              color: themeColors.neon.purple,
                              fontSize: '0.75rem',
                              fontWeight: '600',
                            }}
                          >
                            <Repeat size={12} />
                            Recorrente
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.375rem 0.875rem',
                              borderRadius: '9999px',
                              backgroundColor: isIncome
                                ? `${themeColors.neon.emerald}20`
                                : theme === 'dark'
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(0, 0, 0, 0.05)',
                              color: isIncome
                                ? themeColors.neon.emerald
                                : themeColors.textSecondary,
                              fontSize: '0.75rem',
                              fontWeight: '600',
                            }}
                          >
                            Única
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
