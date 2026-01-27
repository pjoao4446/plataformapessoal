import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { useTheme } from '../../context/ThemeContext';
import { usePageTitleContext } from '../../context/PageTitleContext';
import { getTheme } from '../../styles/theme';
import { 
  Briefcase,
  LayoutDashboard,
  GitBranch,
  FileSearch,
} from 'lucide-react';
import { NuageTab } from './NuageTab';
import { PipelineTab } from './PipelineTab';
import { TechnicalValidationTab } from './TechnicalValidationTab';

type TabType = 'dashboard' | 'pipeline' | 'technical-validation';

/**
 * ProfessionalPage - Controlador de Abas da Gestão Profissional
 * Gerencia apenas a navegação entre abas, delegando complexidade para componentes filhos
 * Design System: VertexGuard Premium Dark/Light
 */
export const ProfessionalPage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { setTitle } = usePageTitleContext();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard Inicial', icon: LayoutDashboard },
    { id: 'pipeline' as TabType, label: 'Pipeline de Vendas', icon: GitBranch },
    { id: 'technical-validation' as TabType, label: 'Oportunidades em Technical Validation', icon: FileSearch },
  ];

  // Mapeamento de abas para labels
  const tabLabels: Record<TabType, string> = {
    dashboard: 'Dashboard Inicial',
    pipeline: 'Pipeline de Vendas',
    'technical-validation': 'Oportunidades em Technical Validation',
  };

  // Atualizar título quando a aba mudar
  useEffect(() => {
    const activeTabLabel = tabLabels[activeTab] || 'Dashboard Inicial';
    setTitle(`Gestão Profissional - ${activeTabLabel}`);
  }, [activeTab, setTitle]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NuageTab />;
      case 'pipeline':
        return <PipelineTab />;
      case 'technical-validation':
        return <TechnicalValidationTab />;
      default:
        return <NuageTab />;
    }
  };

  return (
    <>
      <style>{`
        .professional-tabs-container::-webkit-scrollbar {
          display: none;
        }
        .professional-tabs-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <PageContainer>
        {/* Container Centralizado */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
          {/* Segmented Control Full-Width */}
          <div
            className="professional-tabs-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              border: `1px solid ${themeColors.border}`,
              borderRadius: '0.75rem',
              padding: '0.25rem',
              marginBottom: '1.5rem',
              width: '100%',
              boxSizing: 'border-box',
              position: 'relative',
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
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1rem',
                    border: 'none',
                    background: isActive 
                      ? `linear-gradient(135deg, ${themeColors.neon.purple}, ${themeColors.neon.cyan})`
                      : 'transparent',
                    color: isActive ? '#FFFFFF' : themeColors.textSecondary,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    flex: 1,
                    textAlign: 'center',
                    boxSizing: 'border-box',
                    boxShadow: isActive ? `0 2px 8px ${themeColors.neon.purple}30` : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = themeColors.text;
                      e.currentTarget.style.backgroundColor = theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.05)';
                    } else {
                      e.currentTarget.style.boxShadow = `0 4px 12px ${themeColors.neon.purple}40`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = themeColors.textSecondary;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    } else {
                      e.currentTarget.style.boxShadow = `0 2px 8px ${themeColors.neon.purple}30`;
                    }
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Área de Conteúdo */}
          <div>{renderTabContent()}</div>
        </div>
      </PageContainer>
    </>
  );
};

