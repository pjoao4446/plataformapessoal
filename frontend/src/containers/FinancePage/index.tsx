import { useState } from 'react';
import type { FC } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { 
  LayoutDashboard, 
  Wallet, 
  Repeat, 
  Building2, 
  Tag,
  TrendingUp,
} from 'lucide-react';
import { WalletTab } from './tabs/WalletTab';
import { OverviewTab } from './tabs/OverviewTab';
import { TransactionsTab } from './tabs/TransactionsTab';
import { RecurrencesTab } from './tabs/RecurrencesTab';
import { PatrimonyTab } from './tabs/PatrimonyTab';
import { CategoriesTab } from './tabs/CategoriesTab';
import { MOCK_CARDS, type CreditCard } from '../../mocks/database';

type TabType = 'overview' | 'transactions' | 'wallet' | 'recurrences' | 'patrimony' | 'categories';

/**
 * FinancePage - Controlador de Abas da Gestão Financeira
 * Gerencia apenas a navegação entre abas, delegando complexidade para componentes filhos
 * Design System: VertexGuard Premium Dark/Light
 */
export const FinancePage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [cards, setCards] = useState<CreditCard[]>(MOCK_CARDS);

  const tabs = [
    { id: 'overview' as TabType, label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'transactions' as TabType, label: 'Transações', icon: TrendingUp },
    { id: 'wallet' as TabType, label: 'Carteira', icon: Wallet },
    { id: 'recurrences' as TabType, label: 'Recorrências', icon: Repeat },
    { id: 'patrimony' as TabType, label: 'Patrimônio', icon: Building2 },
    { id: 'categories' as TabType, label: 'Categorias', icon: Tag },
  ];

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
    <PageContainer>
      <div style={{ padding: '2rem' }}>
        {/* Container Centralizado */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          {/* Barra de Navegação (Tabs) */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: `2px solid ${themeColors.border}`,
              marginBottom: '2rem',
              overflowX: 'auto',
              paddingBottom: '0',
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
                  padding: '1rem 1.5rem',
                  border: 'none',
                  background: 'transparent',
                  color: isActive ? themeColors.neon.purple : themeColors.textSecondary,
                  borderBottom: isActive ? `2px solid ${themeColors.neon.purple}` : '2px solid transparent',
                  cursor: 'pointer',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.9375rem',
                  transition: 'all 0.2s',
                  marginBottom: '-2px',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = themeColors.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = themeColors.textSecondary;
                  }
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

          {/* Área de Conteúdo (Renderização Condicional) */}
          <div>{renderTabContent()}</div>
        </div>
      </div>
    </PageContainer>
  );
};
