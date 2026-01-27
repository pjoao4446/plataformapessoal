import { FC, useState, useMemo } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { getTheme } from '../../../styles/theme';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Building2, User, Landmark, TrendingUp, TrendingDown, MoreHorizontal, Edit, DollarSign, AlertTriangle, Plus } from 'lucide-react';
import type { OwnerType } from '../../../types';
import { CreatePatrimonyItemModal } from '../../../components/modals/CreatePatrimonyItemModal';

/**
 * PatrimonyTab - Aba de Patrimônio
 * Dívidas (Passivos) e Investimentos (Ativos)
 */
export const PatrimonyTab: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const [ownerFilter, setOwnerFilter] = useState<OwnerType>('personal');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isPatrimonyModalOpen, setIsPatrimonyModalOpen] = useState(false);

  // Dados de passivos (dívidas) - zerado (sem dados mockados)
  const mockLiabilities = useMemo(() => [], []);

  // Dados de ativos (investimentos) - zerado (sem dados mockados)
  const mockAssets = useMemo(() => [], []);

  // Filtrar por contexto
  const filteredLiabilities = useMemo(() => 
    mockLiabilities.filter(l => l.owner_type === ownerFilter),
    [mockLiabilities, ownerFilter]
  );

  const filteredAssets = useMemo(() => 
    mockAssets.filter(a => a.owner_type === ownerFilter),
    [mockAssets, ownerFilter]
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getCreditorIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return Landmark;
      case 'person':
        return User;
      case 'government':
        return Building2;
      default:
        return Building2;
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'emergency_fund':
        return DollarSign;
      case 'fixed_income':
        return TrendingUp;
      case 'stock':
        return TrendingUp;
      case 'crypto':
        return TrendingUp;
      default:
        return TrendingUp;
    }
  };

  const getAssetTypeLabel = (type: string) => {
    switch (type) {
      case 'emergency_fund':
        return 'Reserva de Emergência';
      case 'fixed_income':
        return 'Renda Fixa';
      case 'stock':
        return 'Ações';
      case 'crypto':
        return 'Criptomoedas';
      default:
        return 'Investimento';
    }
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Calcular Patrimônio Líquido
  const netWorth = useMemo(() => {
    const totalAssets = filteredAssets.reduce((sum, a) => sum + a.current_value, 0);
    const totalLiabilities = filteredLiabilities.reduce((sum, l) => sum + l.current_value, 0);
    return {
      net: totalAssets - totalLiabilities,
      assets: totalAssets,
      liabilities: totalLiabilities,
    };
  }, [filteredAssets, filteredLiabilities]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header de Patrimônio Líquido */}
      <Card
        padding="lg"
        style={{
          background: netWorth.net >= 0
            ? `linear-gradient(135deg, ${themeColors.neon.emerald} 0%, ${themeColors.neon.emerald}88 100%)`
            : `linear-gradient(135deg, #F43F5E 0%, #F43F5E88 100%)`,
          border: `2px solid ${netWorth.net >= 0 ? themeColors.neon.emerald : '#F43F5E'}`,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 0.5rem 0', fontWeight: '500' }}>
            Patrimônio Líquido
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            {netWorth.net >= 0 ? (
              <TrendingUp style={{ width: '3rem', height: '3rem', color: 'white', opacity: 0.9 }} />
            ) : (
              <TrendingDown style={{ width: '3rem', height: '3rem', color: 'white', opacity: 0.9 }} />
            )}
            <p
              style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
                lineHeight: 1,
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              {formatCurrency(netWorth.net)}
            </p>
          </div>
          {/* Legenda Dinâmica */}
          <p
            style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.85)',
              margin: '0 0 1.5rem 0',
              fontStyle: 'italic',
            }}
          >
            {netWorth.net >= 0 
              ? '✨ Sua riqueza está crescendo.'
              : '⚠️ Atenção: Passivos superam Ativos.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 0.25rem 0' }}>
                Total Ativos
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: 0 }}>
                {formatCurrency(netWorth.assets)}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 0.25rem 0' }}>
                Total Dívidas
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: 0 }}>
                {formatCurrency(netWorth.liabilities)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Header com Filtro de Contexto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
          Patrimônio
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setOwnerFilter('personal')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: `1px solid ${ownerFilter === 'personal' ? themeColors.neon.purple : themeColors.border}`,
                backgroundColor: ownerFilter === 'personal'
                  ? `${themeColors.neon.purple}33`
                  : themeColors.surface,
                color: ownerFilter === 'personal' ? themeColors.neon.purple : themeColors.textSecondary,
                fontSize: '0.875rem',
                fontWeight: ownerFilter === 'personal' ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Pessoal
            </button>
            <button
              onClick={() => setOwnerFilter('business')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: `1px solid ${ownerFilter === 'business' ? themeColors.neon.purple : themeColors.border}`,
                backgroundColor: ownerFilter === 'business'
                  ? `${themeColors.neon.purple}33`
                  : themeColors.surface,
                color: ownerFilter === 'business' ? themeColors.neon.purple : themeColors.textSecondary,
                fontSize: '0.875rem',
                fontWeight: ownerFilter === 'business' ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Empresa
            </button>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsPatrimonyModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            Novo Ativo/Passivo
          </Button>
        </div>
      </div>

      {/* Grid de 2 Colunas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'stretch', minHeight: '600px' }}>
        {/* Coluna Esquerda - Passivos (Dívidas) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          <Card padding="lg" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <AlertTriangle style={{ width: '1.5rem', height: '1.5rem', color: '#F43F5E' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                Minhas Dívidas
              </h3>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {filteredLiabilities.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: themeColors.textSecondary }}>
                Nenhuma dívida cadastrada
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredLiabilities.map((liability) => {
                  const CreditorIcon = getCreditorIcon(liability.creditor_type || 'bank');
                  const progress = (liability.amount_paid / liability.original_value) * 100;
                  const isDropdownOpen = activeDropdown === `liability-${liability.id}`;

                  return (
                    <div
                      key={liability.id}
                      style={{
                        padding: '1.25rem',
                        backgroundColor: themeColors.surface,
                        border: `1px solid ${themeColors.border}`,
                        borderRadius: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        position: 'relative',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = themeColors.status.error;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = themeColors.border;
                      }}
                    >
                      {/* Header do Card */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                          <div
                            style={{
                              width: '2.5rem',
                              height: '2.5rem',
                              borderRadius: '0.5rem',
                              backgroundColor: liability.creditor_type === 'bank'
                                ? `${themeColors.neon.purple}33`
                                : liability.creditor_type === 'person'
                                ? `${themeColors.neon.pink}33`
                                : `${themeColors.status.error}33`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <CreditorIcon 
                              style={{ 
                                width: '1.25rem', 
                                height: '1.25rem', 
                                color: liability.creditor_type === 'bank'
                                  ? themeColors.neon.purple
                                  : liability.creditor_type === 'person'
                                  ? themeColors.neon.pink
                                  : themeColors.status.error
                              }} 
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <p style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                                {liability.title}
                              </p>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0.25rem 0 0 0' }}>
                              {liability.creditor_name}
                            </p>
                          </div>
                        </div>
                        {/* Botão Gerenciar - Ghost Pill */}
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => toggleDropdown(`liability-${liability.id}`)}
                            style={{
                              padding: '0.375rem',
                              borderRadius: '9999px',
                              border: 'none',
                              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                              color: themeColors.textSecondary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                              width: '2rem',
                              height: '2rem',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                              e.currentTarget.style.color = themeColors.text;
                            }}
                            onMouseLeave={(e) => {
                              if (!isDropdownOpen) {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                                e.currentTarget.style.color = themeColors.textSecondary;
                              }
                            }}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {/* Dropdown Menu */}
                          {isDropdownOpen && (
                            <>
                              <div
                                style={{
                                  position: 'fixed',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  zIndex: 49,
                                }}
                                onClick={() => setActiveDropdown(null)}
                              />
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 0.5rem)',
                                  right: 0,
                                  minWidth: '10rem',
                                  backgroundColor: themeColors.surface,
                                  border: `1px solid ${themeColors.border}`,
                                  borderRadius: '0.75rem',
                                  boxShadow: `0 10px 30px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'}`,
                                  zIndex: 50,
                                  padding: '0.5rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <button
                                  style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: themeColors.text,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme === 'dark'
                                      ? 'rgba(255, 255, 255, 0.05)'
                                      : 'rgba(0, 0, 0, 0.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <DollarSign size={16} />
                                  Amortizar
                                </button>
                                <button
                                  style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: themeColors.text,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme === 'dark'
                                      ? 'rgba(255, 255, 255, 0.05)'
                                      : 'rgba(0, 0, 0, 0.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Edit size={16} />
                                  Editar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Valor Atual */}
                      <div>
                        <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0 0 0.5rem 0' }}>
                          Valor Atual
                        </p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FB7185', margin: 0 }}>
                          {formatCurrency(liability.current_value)}
                        </p>
                      </div>

                      {/* Barra de Progresso */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary }}>
                            Pago: {formatCurrency(liability.amount_paid)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary }}>
                            Total: {formatCurrency(liability.original_value)}
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
                              width: `${progress}%`,
                              height: '100%',
                              backgroundColor: themeColors.neon.emerald,
                              transition: 'width 0.3s',
                              borderRadius: '9999px',
                              boxShadow: `0 0 8px ${themeColors.neon.emerald}66`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </div>
          </Card>
        </div>

        {/* Coluna Direita - Ativos (Investimentos) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          <Card padding="lg" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: themeColors.neon.emerald }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                Meus Investimentos
              </h3>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {filteredAssets.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: themeColors.textSecondary }}>
                Nenhum investimento cadastrado
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredAssets.map((asset) => {
                  const AssetIcon = getAssetIcon(asset.type);
                  const isDropdownOpen = activeDropdown === `asset-${asset.id}`;

                  return (
                    <div
                      key={asset.id}
                      style={{
                        padding: '1.25rem',
                        backgroundColor: themeColors.surface,
                        border: `1px solid ${themeColors.border}`,
                        borderRadius: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        position: 'relative',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = themeColors.neon.emerald;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = themeColors.border;
                      }}
                    >
                      {/* Header do Card */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                          <div
                            style={{
                              width: '2.5rem',
                              height: '2.5rem',
                              borderRadius: '0.5rem',
                              backgroundColor: `${themeColors.neon.emerald}33`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <AssetIcon style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.emerald }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                              {asset.title}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0.25rem 0 0 0' }}>
                              {getAssetTypeLabel(asset.type)}
                            </p>
                          </div>
                        </div>
                        {/* Botão Gerenciar - Ghost Pill */}
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => toggleDropdown(`asset-${asset.id}`)}
                            style={{
                              padding: '0.375rem',
                              borderRadius: '9999px',
                              border: 'none',
                              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                              color: themeColors.textSecondary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                              width: '2rem',
                              height: '2rem',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                              e.currentTarget.style.color = themeColors.text;
                            }}
                            onMouseLeave={(e) => {
                              if (!isDropdownOpen) {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                                e.currentTarget.style.color = themeColors.textSecondary;
                              }
                            }}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {/* Dropdown Menu */}
                          {isDropdownOpen && (
                            <>
                              <div
                                style={{
                                  position: 'fixed',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  zIndex: 49,
                                }}
                                onClick={() => setActiveDropdown(null)}
                              />
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 0.5rem)',
                                  right: 0,
                                  minWidth: '10rem',
                                  backgroundColor: themeColors.surface,
                                  border: `1px solid ${themeColors.border}`,
                                  borderRadius: '0.75rem',
                                  boxShadow: `0 10px 30px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'}`,
                                  zIndex: 50,
                                  padding: '0.5rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <button
                                  style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: themeColors.text,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme === 'dark'
                                      ? 'rgba(255, 255, 255, 0.05)'
                                      : 'rgba(0, 0, 0, 0.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <TrendingUp size={16} />
                                  Adicionar Valor
                                </button>
                                <button
                                  style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: themeColors.text,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme === 'dark'
                                      ? 'rgba(255, 255, 255, 0.05)'
                                      : 'rgba(0, 0, 0, 0.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Edit size={16} />
                                  Editar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Valor Atual */}
                      <div>
                        <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: '0 0 0.5rem 0' }}>
                          Valor Atual
                        </p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#34D399', margin: 0 }}>
                          {formatCurrency(asset.current_value)}
                        </p>
                      </div>

                      {/* Barra de Progresso (Simulada - Crescimento do Investimento) */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary }}>
                            Crescimento
                          </span>
                          <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary }}>
                            {getAssetTypeLabel(asset.type)}
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
                          {/* Simulação de crescimento (mockado) */}
                          <div
                            style={{
                              width: `${Math.min((asset.current_value / 10000) * 10, 100)}%`,
                              height: '100%',
                              backgroundColor: themeColors.neon.purple,
                              transition: 'width 0.3s',
                              borderRadius: '9999px',
                              boxShadow: `0 0 8px ${themeColors.neon.purple}66`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Novo Item de Patrimônio */}
      <CreatePatrimonyItemModal
        isOpen={isPatrimonyModalOpen}
        onClose={() => setIsPatrimonyModalOpen(false)}
        onSuccess={() => {
          setIsPatrimonyModalOpen(false);
          // Recarregar dados se necessário
          // Por enquanto, os dados são mockados, então apenas fechamos o modal
        }}
      />
    </div>
  );
};
