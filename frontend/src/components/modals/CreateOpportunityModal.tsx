import { useState, useMemo, useEffect } from 'react';
import { BaseModal } from '../ui/BaseModal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Calculator } from 'lucide-react';

export interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  opportunityToEdit?: any;
}

/**
 * CreateOpportunityModal - Modal para cadastro de oportunidades NuageIT
 * Calculadora automática de TCV (Total Contract Value)
 * Design System: VertexGuard Premium Dark/Light
 */
export function CreateOpportunityModal({
  isOpen,
  onClose,
  onSuccess,
  opportunityToEdit,
}: CreateOpportunityModalProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados básicos
  const [clientName, setClientName] = useState('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [status, setStatus] = useState<'negotiation' | 'formal_agreement' | 'signed_contract'>('negotiation');
  const [probability, setProbability] = useState<number>(50);

  // Seção A: Setup
  const [hasSetup, setHasSetup] = useState(false);
  const [setupValue, setSetupValue] = useState('');

  // Seção B: Recorrência
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [monthlyRecurrence, setMonthlyRecurrence] = useState('');
  const [recurrenceMonths, setRecurrenceMonths] = useState('24');

  // Seção C: Billing
  const [hasBilling, setHasBilling] = useState(false);
  const [billingMonthlyUSD, setBillingMonthlyUSD] = useState('');
  const [ingramDiscount, setIngramDiscount] = useState('13');
  const [clientRepass, setClientRepass] = useState('4');
  const [dollarRate, setDollarRate] = useState('5.30');

  // Forçar probabilidade para 100% quando status for signed_contract
  useEffect(() => {
    if (status === 'signed_contract') {
      setProbability(100);
    } else if (!opportunityToEdit) {
      // Valores padrão baseados no status
      if (status === 'negotiation') {
        setProbability(50);
      } else if (status === 'formal_agreement') {
        setProbability(80);
      }
    }
  }, [status, opportunityToEdit]);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (opportunityToEdit) {
      setClientName(opportunityToEdit.client_name || '');
      setExpectedCloseDate(opportunityToEdit.expected_close_date || '');
      setStatus(opportunityToEdit.status || 'negotiation');
      setProbability(opportunityToEdit.probability_percent ? parseFloat(opportunityToEdit.probability_percent) : 
        (opportunityToEdit.status === 'signed_contract' ? 100 :
         opportunityToEdit.status === 'formal_agreement' ? 80 : 50));
      setHasSetup(opportunityToEdit.has_setup || false);
      setSetupValue(opportunityToEdit.setup_value?.toString() || '');
      setHasRecurrence(opportunityToEdit.has_recurring || false);
      setMonthlyRecurrence(opportunityToEdit.recurring_monthly_value?.toString() || '');
      setRecurrenceMonths(opportunityToEdit.recurring_months_duration?.toString() || '24');
      setHasBilling(opportunityToEdit.has_billing || false);
      setBillingMonthlyUSD(opportunityToEdit.billing_monthly_usd?.toString() || '');
      setIngramDiscount(opportunityToEdit.billing_total_discount_percent?.toString() || '13');
      setClientRepass(opportunityToEdit.billing_client_discount_percent?.toString() || '4');
      setDollarRate(opportunityToEdit.billing_dolar_rate?.toString() || '5.30');
    } else {
      // Limpar formulário quando criar novo
      setClientName('');
      setExpectedCloseDate('');
      setStatus('negotiation');
      setProbability(50);
      setHasSetup(false);
      setSetupValue('');
      setHasRecurrence(false);
      setMonthlyRecurrence('');
      setRecurrenceMonths('24');
      setHasBilling(false);
      setBillingMonthlyUSD('');
      setIngramDiscount('13');
      setClientRepass('4');
      setDollarRate('5.30');
    }
  }, [opportunityToEdit, isOpen]);

  // Cálculo do TCV em tempo real
  const tcvCalculation = useMemo(() => {
    // Setup (A)
    const setupTCV = hasSetup ? (parseFloat(setupValue) || 0) : 0;

    // Recorrência (B)
    const recurrenceTCV = hasRecurrence
      ? (parseFloat(monthlyRecurrence) || 0) * (parseInt(recurrenceMonths) || 24)
      : 0;

    // Billing (C)
    const billingMarginPercent = hasBilling
      ? (parseFloat(ingramDiscount) || 13) - (parseFloat(clientRepass) || 4)
      : 0;
    const monthlyBillingBRL = hasBilling
      ? (parseFloat(billingMonthlyUSD) || 0) * (billingMarginPercent / 100) * (parseFloat(dollarRate) || 5.30)
      : 0;
    const billingTCV = monthlyBillingBRL * 24;

    // Total
    const totalTCV = setupTCV + recurrenceTCV + billingTCV;

    return {
      setupTCV,
      recurrenceTCV,
      billingTCV,
      monthlyBillingBRL,
      billingMarginPercent,
      totalTCV,
    };
  }, [
    hasSetup,
    setupValue,
    hasRecurrence,
    monthlyRecurrence,
    recurrenceMonths,
    hasBilling,
    billingMonthlyUSD,
    ingramDiscount,
    clientRepass,
    dollarRate,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!clientName.trim()) {
      setError('Nome do Cliente é obrigatório');
      return;
    }

    if (hasSetup && !setupValue) {
      setError('Valor do Setup é obrigatório quando Setup está ativado');
      return;
    }

    if (hasRecurrence && !monthlyRecurrence) {
      setError('Valor Mensal é obrigatório quando Recorrência está ativada');
      return;
    }

    if (hasBilling && !billingMonthlyUSD) {
      setError('Billing Mensal Estimado (USD) é obrigatório quando Billing está ativado');
      return;
    }

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      // Sanitização e mapeamento exato baseado no schema do banco
      const opportunityData: any = {
        // Campos obrigatórios
        client_name: clientName.trim(),
        user_id: user.id,
        status: status,
        expected_close_date: expectedCloseDate || null,
        probability_percent: status === 'signed_contract' ? 100 : probability,
        
        // Setup (sempre enviar valores numéricos, nunca null)
        has_setup: hasSetup,
        setup_value: hasSetup ? (parseFloat(setupValue) || 0) : 0,
        
        // Recorrência (sempre enviar valores numéricos, nunca null)
        has_recurring: hasRecurrence,
        recurring_monthly_value: hasRecurrence ? (parseFloat(monthlyRecurrence) || 0) : 0,
        recurring_months_duration: hasRecurrence ? (parseInt(recurrenceMonths) || 24) : 24,
        
        // Billing (sempre enviar valores numéricos, nunca null)
        has_billing: hasBilling,
        billing_monthly_usd: hasBilling ? (parseFloat(billingMonthlyUSD) || 0) : 0,
        billing_dolar_rate: hasBilling ? (parseFloat(dollarRate) || 5.5) : 5.5,
        billing_total_discount_percent: hasBilling ? (parseFloat(ingramDiscount) || 13) : 13,
        billing_client_discount_percent: hasBilling ? (parseFloat(clientRepass) || 4) : 4,
        
        // TCV calculado (sempre numérico)
        calculated_tcv_brl: parseFloat(tcvCalculation.totalTCV.toString()) || 0,
      };

      if (opportunityToEdit) {
        // Atualizar oportunidade existente
        const { data, error: updateError } = await supabase
          .from('professional_opportunities')
          .update(opportunityData)
          .eq('id', opportunityToEdit.id)
          .select();

        if (updateError) {
          throw updateError;
        }
      } else {
        // Criar nova oportunidade
        const { data, error: insertError } = await supabase
          .from('professional_opportunities')
          .insert([opportunityData])
          .select();

        if (insertError) {
          throw insertError;
        }
      }

      // Limpar formulário
      handleClose();
      onSuccess();
    } catch (err: any) {
      console.error('Erro ao criar oportunidade:', err);
      setError(err.message || 'Erro ao criar oportunidade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setClientName('');
      setExpectedCloseDate('');
      setStatus('negotiation');
      setProbability(50);
      setHasSetup(false);
      setSetupValue('');
      setHasRecurrence(false);
      setMonthlyRecurrence('');
      setRecurrenceMonths('24');
      setHasBilling(false);
      setBillingMonthlyUSD('');
      setIngramDiscount('13');
      setClientRepass('4');
      setDollarRate('5.30');
      setError(null);
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={opportunityToEdit ? "Editar Oportunidade NuageIT" : "Nova Oportunidade NuageIT"}
      size="xl"
      footer={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          {/* Card Totalizador TCV */}
          <Card
            variant="neon"
            padding="lg"
            style={{
              border: `2px solid ${themeColors.neon.purple}`,
              background: theme === 'dark'
                ? `linear-gradient(135deg, rgba(26, 29, 45, 0.95), rgba(30, 33, 57, 0.95))`
                : `linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95))`,
              boxShadow: `0 0 30px ${themeColors.neon.purple}40`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calculator style={{ width: '1.5rem', height: '1.5rem', color: themeColors.neon.purple }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                    TCV TOTAL ESTIMADO
                  </p>
                  <p
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: themeColors.neon.purple,
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {formatCurrency(tcvCalculation.totalTCV)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              style={{ flex: 1 }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                  Salvando...
                </>
              ) : (
                'Salvar Oportunidade'
              )}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              backgroundColor: `${themeColors.status.error}20`,
              border: `1px solid ${themeColors.status.error}`,
              color: themeColors.status.error,
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Dados Básicos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, margin: 0 }}>
            Dados Básicos
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Nome do Cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              placeholder="Ex: Empresa XYZ"
            />
            <Input
              label="Data Prevista de Fechamento"
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
            />
          </div>
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="negotiation">Em Negociação</option>
            <option value="formal_agreement">Acordo Formal</option>
            <option value="signed_contract">Contrato Assinado</option>
          </Select>
          
          {/* Campo de Probabilidade */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: themeColors.text,
                marginBottom: '0.5rem',
              }}
            >
              Probabilidade de Fechamento (%)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={probability}
                onChange={(e) => {
                  if (status !== 'signed_contract') {
                    setProbability(parseInt(e.target.value));
                  }
                }}
                disabled={status === 'signed_contract'}
                style={{
                  flex: 1,
                  height: '0.5rem',
                  borderRadius: '9999px',
                  background: theme === 'dark' 
                    ? `linear-gradient(to right, ${themeColors.neon.purple} 0%, ${themeColors.neon.purple} ${probability}%, rgba(255, 255, 255, 0.1) ${probability}%, rgba(255, 255, 255, 0.1) 100%)`
                    : `linear-gradient(to right, ${themeColors.neon.purple} 0%, ${themeColors.neon.purple} ${probability}%, rgba(0, 0, 0, 0.1) ${probability}%, rgba(0, 0, 0, 0.1) 100%)`,
                  outline: 'none',
                  cursor: status === 'signed_contract' ? 'not-allowed' : 'pointer',
                }}
              />
              <span
                style={{
                  minWidth: '3rem',
                  textAlign: 'right',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: status === 'signed_contract' 
                    ? themeColors.neon.emerald 
                    : themeColors.neon.purple,
                }}
              >
                {probability}%
              </span>
            </div>
            {status === 'signed_contract' && (
              <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, marginTop: '0.25rem', margin: 0 }}>
                Probabilidade fixada em 100% para contratos assinados
              </p>
            )}
          </div>
        </div>

        {/* SEÇÃO A: Setup / Pontual */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: `1px solid ${themeColors.border}`,
            backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, marginBottom: '1rem', margin: 0 }}>
            SEÇÃO A: Setup / Pontual
          </h3>
          <Switch
            id="switch-setup"
            label="Contrato tem Setup?"
            checked={hasSetup}
            onChange={(e) => setHasSetup(e.target.checked)}
          />
          {hasSetup && (
            <div style={{ marginTop: '1rem' }}>
              <Input
                label="Valor do Setup (R$)"
                type="number"
                step="0.01"
                min="0"
                value={setupValue}
                onChange={(e) => setSetupValue(e.target.value)}
                required={hasSetup}
                placeholder="0.00"
              />
              <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, marginTop: '0.5rem', margin: 0 }}>
                Contribuição ao TCV: {formatCurrency(tcvCalculation.setupTCV)}
              </p>
            </div>
          )}
        </div>

        {/* SEÇÃO B: Serviços Recorrentes */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: `1px solid ${themeColors.border}`,
            backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, marginBottom: '1rem', margin: 0 }}>
            SEÇÃO B: Serviços Recorrentes (Sustentação/FinOps)
          </h3>
          <Switch
            id="switch-recurrence"
            label="Tem Recorrência?"
            checked={hasRecurrence}
            onChange={(e) => setHasRecurrence(e.target.checked)}
          />
          {hasRecurrence && (
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Valor Mensal (R$)"
                type="number"
                step="0.01"
                min="0"
                value={monthlyRecurrence}
                onChange={(e) => setMonthlyRecurrence(e.target.value)}
                required={hasRecurrence}
                placeholder="0.00"
              />
              <Input
                label="Meses considerados"
                type="number"
                min="1"
                value={recurrenceMonths}
                onChange={(e) => setRecurrenceMonths(e.target.value)}
                placeholder="24"
              />
            </div>
          )}
          {hasRecurrence && (
            <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, marginTop: '0.5rem', margin: 0 }}>
              Contribuição ao TCV: {formatCurrency(tcvCalculation.recurrenceTCV)} ({recurrenceMonths} meses)
            </p>
          )}
        </div>

        {/* SEÇÃO C: Billing (Distribuição AWS via Ingram) */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: `1px solid ${themeColors.border}`,
            backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: themeColors.text, marginBottom: '1rem', margin: 0 }}>
            SEÇÃO C: Billing (Distribuição AWS via Ingram)
          </h3>
          <Switch
            id="switch-billing"
            label="Tem Billing/Revenda?"
            checked={hasBilling}
            onChange={(e) => setHasBilling(e.target.checked)}
          />
          {hasBilling && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                label="Billing Mensal Estimado (USD)"
                type="number"
                step="0.01"
                min="0"
                value={billingMonthlyUSD}
                onChange={(e) => setBillingMonthlyUSD(e.target.value)}
                required={hasBilling}
                placeholder="0.00"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Desconto Total Ingram (%)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={ingramDiscount}
                  onChange={(e) => setIngramDiscount(e.target.value)}
                  placeholder="13"
                />
                <Input
                  label="Repasse ao Cliente (%)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={clientRepass}
                  onChange={(e) => setClientRepass(e.target.value)}
                  placeholder="4"
                />
                <Input
                  label="Cotação Dólar (R$)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={dollarRate}
                  onChange={(e) => setDollarRate(e.target.value)}
                  placeholder="5.30"
                />
              </div>

              {/* Display de Cálculos Intermediários */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                    Margem Nuage: <strong style={{ color: themeColors.neon.purple }}>{tcvCalculation.billingMarginPercent.toFixed(2)}%</strong> ({ingramDiscount} - {clientRepass})
                  </p>
                  <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                    Receita Mensal Estimada: <strong style={{ color: themeColors.neon.emerald }}>{formatCurrency(tcvCalculation.monthlyBillingBRL)}</strong>
                  </p>
                  <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
                    Contribuição ao TCV (24 meses): <strong style={{ color: themeColors.neon.cyan }}>{formatCurrency(tcvCalculation.billingTCV)}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* CSS para animação de spin */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </BaseModal>
  );
}

