import { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CreateOpportunityModal } from '../../components/modals/CreateOpportunityModal';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
} from 'lucide-react';

/**
 * PipelineTab - Aba de Pipeline de Vendas
 * Gerencia o pipeline kanban de oportunidades
 * Design System: VertexGuard Premium Dark/Light
 */
export const PipelineTab: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<any>(null);

  // Buscar dados
  useEffect(() => {
    if (user) {
      fetchOpportunities();
    }
  }, [user]);

  const fetchOpportunities = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: opportunitiesData } = await supabase
        .from('professional_opportunities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setOpportunities(opportunitiesData || []);
    } catch (err) {
      console.error('Erro ao carregar oportunidades:', err);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar oportunidades por status
  const opportunitiesByStatus = useMemo(() => {
    return {
      negotiation: opportunities.filter(o => o.status === 'negotiation'),
      formal_agreement: opportunities.filter(o => o.status === 'formal_agreement'),
      signed_contract: opportunities.filter(o => o.status === 'signed_contract'),
    };
  }, [opportunities]);

  // Calcular totais por coluna
  const columnTotals = useMemo(() => {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      }).format(value);
    };

    return {
      negotiation: {
        count: opportunitiesByStatus.negotiation.length,
        total: opportunitiesByStatus.negotiation.reduce(
          (sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0),
          0
        ),
        formatted: formatCurrency(
          opportunitiesByStatus.negotiation.reduce(
            (sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0),
            0
          )
        ),
      },
      formal_agreement: {
        count: opportunitiesByStatus.formal_agreement.length,
        total: opportunitiesByStatus.formal_agreement.reduce(
          (sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0),
          0
        ),
        formatted: formatCurrency(
          opportunitiesByStatus.formal_agreement.reduce(
            (sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0),
            0
          )
        ),
      },
      signed_contract: {
        count: opportunitiesByStatus.signed_contract.length,
        total: opportunitiesByStatus.signed_contract.reduce(
          (sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0),
          0
        ),
        formatted: formatCurrency(
          opportunitiesByStatus.signed_contract.reduce(
            (sum, o) => sum + (parseFloat(o.calculated_tcv_brl) || 0),
            0
          )
        ),
      },
    };
  }, [opportunitiesByStatus]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleNewOpportunity = () => {
    setEditingOpportunity(null);
    setIsModalOpen(true);
  };

  const handleEditOpportunity = (opportunity: any) => {
    setEditingOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta oportunidade?')) return;

    try {
      const { error } = await supabase
        .from('professional_opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchOpportunities();
    } catch (err) {
      console.error('Erro ao excluir oportunidade:', err);
      alert('Erro ao excluir oportunidade');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('professional_opportunities')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchOpportunities();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status');
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setEditingOpportunity(null);
    fetchOpportunities();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
          Pipeline de Vendas
        </h2>
        <Button variant="primary" onClick={handleNewOpportunity}>
          <Plus style={{ width: '1rem', height: '1rem' }} />
          Nova Oportunidade
        </Button>
      </div>

      {/* Kanban - 3 Colunas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {/* Coluna: Em Negociação */}
        <div>
          <Card padding="md" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                  Em Negociação
                </h3>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: `${themeColors.neon.orange}33`,
                    color: themeColors.neon.orange,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  {columnTotals.negotiation.count}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                {columnTotals.negotiation.count} Deals • {columnTotals.negotiation.formatted}
              </p>
            </div>
          </Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {opportunitiesByStatus.negotiation.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onEdit={() => handleEditOpportunity(opp)}
                onDelete={() => handleDeleteOpportunity(opp.id)}
                onStatusChange={(newStatus) => handleUpdateStatus(opp.id, newStatus)}
                theme={theme}
                themeColors={themeColors}
                formatCurrency={formatCurrency}
              />
            ))}
            {opportunitiesByStatus.negotiation.length === 0 && (
              <Card padding="lg">
                <div style={{ textAlign: 'center', padding: '2rem', color: themeColors.textSecondary }}>
                  <p style={{ margin: 0 }}>Nenhuma oportunidade em negociação</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Coluna: Acordo Formal */}
        <div>
          <Card padding="md" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                  Acordo Formal
                </h3>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: `${themeColors.neon.cyan}33`,
                    color: themeColors.neon.cyan,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  {columnTotals.formal_agreement.count}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                {columnTotals.formal_agreement.count} Deals • {columnTotals.formal_agreement.formatted}
              </p>
            </div>
          </Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {opportunitiesByStatus.formal_agreement.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onEdit={() => handleEditOpportunity(opp)}
                onDelete={() => handleDeleteOpportunity(opp.id)}
                onStatusChange={(newStatus) => handleUpdateStatus(opp.id, newStatus)}
                theme={theme}
                themeColors={themeColors}
                formatCurrency={formatCurrency}
              />
            ))}
            {opportunitiesByStatus.formal_agreement.length === 0 && (
              <Card padding="lg">
                <div style={{ textAlign: 'center', padding: '2rem', color: themeColors.textSecondary }}>
                  <p style={{ margin: 0 }}>Nenhum acordo formal</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Coluna: Contrato Assinado */}
        <div>
          <Card padding="md" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
                  Contrato Assinado
                </h3>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: `${themeColors.neon.emerald}33`,
                    color: themeColors.neon.emerald,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  {columnTotals.signed_contract.count}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                {columnTotals.signed_contract.count} Deals • {columnTotals.signed_contract.formatted}
              </p>
            </div>
          </Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {opportunitiesByStatus.signed_contract.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onEdit={() => handleEditOpportunity(opp)}
                onDelete={() => handleDeleteOpportunity(opp.id)}
                onStatusChange={(newStatus) => handleUpdateStatus(opp.id, newStatus)}
                theme={theme}
                themeColors={themeColors}
                formatCurrency={formatCurrency}
              />
            ))}
            {opportunitiesByStatus.signed_contract.length === 0 && (
              <Card padding="lg">
                <div style={{ textAlign: 'center', padding: '2rem', color: themeColors.textSecondary }}>
                  <p style={{ margin: 0 }}>Nenhum contrato assinado</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreateOpportunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOpportunity(null);
        }}
        onSuccess={handleModalSuccess}
        opportunityToEdit={editingOpportunity}
      />
    </div>
  );
};

// Componente de Card de Oportunidade Redesenhado
interface OpportunityCardProps {
  opportunity: any;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: string) => void;
  theme: string;
  themeColors: any;
  formatCurrency: (value: number) => string;
}

const OpportunityCard: FC<OpportunityCardProps> = ({
  opportunity,
  onEdit,
  onDelete,
  onStatusChange,
  theme,
  themeColors,
  formatCurrency,
}) => {
  // Obter probabilidade baseada no status ou usar a probabilidade salva
  const getProbability = () => {
    if (opportunity.probability_percent) {
      return parseFloat(opportunity.probability_percent);
    }
    // Fallback baseado no status
    switch (opportunity.status) {
      case 'negotiation':
        return 50;
      case 'formal_agreement':
        return 80;
      case 'signed_contract':
        return 100;
      default:
        return 0;
    }
  };

  const probability = getProbability();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'negotiation':
        return themeColors.neon.orange;
      case 'formal_agreement':
        return themeColors.neon.cyan;
      case 'signed_contract':
        return themeColors.neon.emerald;
      default:
        return themeColors.textMuted;
    }
  };

  const getProbabilityColor = () => {
    if (opportunity.status === 'signed_contract') {
      return themeColors.neon.emerald;
    }
    if (opportunity.status === 'formal_agreement') {
      return themeColors.neon.cyan;
    }
    return themeColors.neon.orange;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isDatePast = (dateString: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const tcvValue = parseFloat(opportunity.calculated_tcv_brl) || 0;
  const isWon = opportunity.status === 'signed_contract';

  return (
    <Card padding="md" variant="glass">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Header: Nome do Cliente + Edit */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: themeColors.text, margin: 0, flex: 1 }}>
            {opportunity.client_name}
          </h4>
          <button
            onClick={onEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.75rem',
              height: '1.75rem',
              borderRadius: '0.375rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: themeColors.textSecondary,
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = themeColors.neon.purple;
              e.currentTarget.style.backgroundColor = `${themeColors.neon.purple}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = themeColors.textSecondary;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Editar"
          >
            <Edit style={{ width: '0.875rem', height: '0.875rem' }} />
          </button>
        </div>

        {/* Tags: Setup, Recorrência, Billing */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {opportunity.has_setup && (
            <span
              style={{
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                backgroundColor: `${themeColors.neon.purple}33`,
                color: themeColors.neon.purple,
                fontSize: '0.7rem',
                fontWeight: '600',
              }}
            >
              Setup
            </span>
          )}
          {opportunity.has_recurring && (
            <span
              style={{
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                backgroundColor: `${themeColors.neon.cyan}33`,
                color: themeColors.neon.cyan,
                fontSize: '0.7rem',
                fontWeight: '600',
              }}
            >
              Recorrência
            </span>
          )}
          {opportunity.has_billing && (
            <span
              style={{
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                backgroundColor: `${themeColors.neon.orange}33`,
                color: themeColors.neon.orange,
                fontSize: '0.7rem',
                fontWeight: '600',
              }}
            >
              Billing
            </span>
          )}
        </div>

        {/* TCV em Destaque */}
        <div>
          <p
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: isWon ? themeColors.neon.emerald : themeColors.text,
              margin: 0,
              marginBottom: '0.375rem',
            }}
          >
            {formatCurrency(tcvValue)}
          </p>
          
          {/* Barra de Probabilidade */}
          <div
            style={{
              width: '100%',
              height: '0.375rem',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${probability}%`,
                backgroundColor: getProbabilityColor(),
                borderRadius: '9999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <p style={{ fontSize: '0.7rem', color: themeColors.textMuted, margin: '0.25rem 0 0 0' }}>
            {probability}% de probabilidade
          </p>
        </div>

        {/* Footer: Data de Fechamento */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem', borderTop: `1px solid ${themeColors.border}` }}>
          <Calendar style={{ width: '0.875rem', height: '0.875rem', color: themeColors.textMuted }} />
          <span
            style={{
              fontSize: '0.75rem',
              color: isDatePast(opportunity.expected_close_date) && !isWon
                ? themeColors.status.error
                : themeColors.textSecondary,
              fontWeight: isDatePast(opportunity.expected_close_date) && !isWon ? '600' : 'normal',
            }}
          >
            {formatDate(opportunity.expected_close_date)}
            {isDatePast(opportunity.expected_close_date) && !isWon && ' (Atrasado)'}
          </span>
        </div>

        {/* Botões de Ação (Mover Status) */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
          {opportunity.status !== 'negotiation' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange('negotiation')}
              style={{ fontSize: '0.75rem', padding: '0.375rem 0.625rem' }}
            >
              ← Negociação
            </Button>
          )}
          {opportunity.status !== 'formal_agreement' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange('formal_agreement')}
              style={{ fontSize: '0.75rem', padding: '0.375rem 0.625rem' }}
            >
              → Acordo
            </Button>
          )}
          {opportunity.status !== 'signed_contract' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange('signed_contract')}
              style={{ fontSize: '0.75rem', padding: '0.375rem 0.625rem' }}
            >
              → Assinado
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
