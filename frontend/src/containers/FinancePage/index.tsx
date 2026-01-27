import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { useTheme } from '../../context/ThemeContext';
import { usePageTitleContext } from '../../context/PageTitleContext';
import { getTheme } from '../../styles/theme';
import { 
  LayoutDashboard, 
  Wallet, 
  Repeat, 
  Building2, 
  Tag,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { WalletTab } from './tabs/WalletTab';
import { OverviewTab } from './tabs/OverviewTab';
import { TransactionsTab } from './tabs/TransactionsTab';
import { RecurrencesTab } from './tabs/RecurrencesTab';
import { PatrimonyTab } from './tabs/PatrimonyTab';
import { CategoriesTab } from './tabs/CategoriesTab';
import { CreateTransactionModal } from '../../components/modals/CreateTransactionModal';
import type { CreditCard } from '../../mocks/database';

type TabType = 'overview' | 'transactions' | 'wallet' | 'recurrences' | 'patrimony' | 'categories';

/**
 * FinancePage - Controlador de Abas da Gestão Financeira
 * Gerencia apenas a navegação entre abas, delegando complexidade para componentes filhos
 * Design System: VertexGuard Premium Dark/Light
 */
export const FinancePage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { setTitle } = usePageTitleContext();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const tabs = [
    { id: 'overview' as TabType, label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'transactions' as TabType, label: 'Transações', icon: TrendingUp },
    { id: 'wallet' as TabType, label: 'Carteira', icon: Wallet },
    { id: 'recurrences' as TabType, label: 'Recorrências', icon: Repeat },
    { id: 'patrimony' as TabType, label: 'Patrimônio', icon: Building2 },
    { id: 'categories' as TabType, label: 'Categorias', icon: Tag },
  ];

  // Mapeamento de abas para labels
  const tabLabels: Record<TabType, string> = {
    overview: 'Visão Geral',
    transactions: 'Transações',
    wallet: 'Carteira',
    recurrences: 'Recorrências',
    patrimony: 'Patrimônio',
    categories: 'Categorias',
  };

  // Atualizar título quando a aba mudar
  useEffect(() => {
    const activeTabLabel = tabLabels[activeTab] || 'Visão Geral';
    setTitle(`Gestão Financeira - ${activeTabLabel}`);
  }, [activeTab, setTitle]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'transactions':
        return <TransactionsTab />;
      case 'wallet':
        return <WalletTab cards={cards} setCards={setCards} />;
      case 'recurrences':
        return <RecurrencesTab />;
      case 'patrimony':
        return <PatrimonyTab />;
      case 'categories':
        return <CategoriesTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <>
      <style>{`
        .finance-tabs-container::-webkit-scrollbar {
          display: none;
        }
        .finance-tabs-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <PageContainer>
        {/* Container Centralizado */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
          {/* Barra de Navegação (Tabs) - Container sem overflow */}
          <div
            className="finance-tabs-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: `2px solid ${themeColors.border}`,
              borderRadius: '0.75rem',
              padding: '0.5rem',
              marginBottom: '2rem',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              overflowX: 'hidden',
              overflowY: 'visible',
              position: 'relative',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            }}
          >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: isActive 
                    ? `linear-gradient(135deg, ${themeColors.neon.purple}20, ${themeColors.neon.cyan}10)`
                    : 'transparent',
                  color: isActive ? themeColors.neon.purple : themeColors.textSecondary,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.9375rem',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = themeColors.text;
                    e.currentTarget.style.background = theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = themeColors.textSecondary;
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
          
          {/* Botão Nova Transação */}
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 1rem',
              marginLeft: 'auto',
              border: 'none',
              background: `linear-gradient(135deg, ${themeColors.neon.purple} 0%, ${themeColors.neon.cyan} 100%)`,
              color: 'white',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.8125rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxSizing: 'border-box',
              boxShadow: `0 4px 12px ${themeColors.neon.purple}40, 0 2px 4px ${themeColors.neon.cyan}20`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 20px ${themeColors.neon.purple}60, 0 4px 8px ${themeColors.neon.cyan}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${themeColors.neon.purple}40, 0 2px 4px ${themeColors.neon.cyan}20`;
            }}
          >
            <Plus size={14} />
            Nova Transação
          </button>
        </div>

          {/* Área de Conteúdo (Renderização Condicional) */}
          <div>{renderTabContent()}</div>
        </div>
      </PageContainer>

      {/* Modal de Nova Transação */}
      <CreateTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSuccess={() => {
          setIsTransactionModalOpen(false);
          // Recarregar dados se necessário (os componentes filhos já fazem isso)
        }}
      />
    </>
  );
};
