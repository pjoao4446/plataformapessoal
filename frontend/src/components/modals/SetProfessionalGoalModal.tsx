import { useState, useEffect, useMemo } from 'react';
import { BaseModal } from '../ui/BaseModal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Target, Calculator } from 'lucide-react';

export interface SetProfessionalGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * SetProfessionalGoalModal - Modal para definir/editar meta de TCV anual
 * Design System: VertexGuard Premium Dark/Light
 */
export function SetProfessionalGoalModal({
  isOpen,
  onClose,
  onSuccess,
}: SetProfessionalGoalModalProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Campos do formulário
  const [year, setYear] = useState(2026);
  const [annualTarget, setAnnualTarget] = useState('');
  const [q1Target, setQ1Target] = useState('');
  const [q2Target, setQ2Target] = useState('');
  const [q3Target, setQ3Target] = useState('');
  const [q4Target, setQ4Target] = useState('');

  // Carregar dados existentes ao abrir o modal
  useEffect(() => {
    if (isOpen && user) {
      loadExistingGoal();
    }
  }, [isOpen, user]);

  const loadExistingGoal = async () => {
    if (!user) return;

    setLoadingData(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('professional_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', 2026)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows returned, que é ok se não existir meta ainda
        console.error('Erro ao carregar meta:', fetchError);
      }

      if (data) {
        setAnnualTarget(data.target_tcv_annual?.toString() || '');
        setQ1Target(data.target_q1?.toString() || '');
        setQ2Target(data.target_q2?.toString() || '');
        setQ3Target(data.target_q3?.toString() || '');
        setQ4Target(data.target_q4?.toString() || '');
      } else {
        // Limpar campos se não existir meta
        setAnnualTarget('');
        setQ1Target('');
        setQ2Target('');
        setQ3Target('');
        setQ4Target('');
      }
    } catch (err) {
      console.error('Erro ao carregar meta:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Calcular soma dos quarters
  const quartersSum = useMemo(() => {
    const q1 = parseFloat(q1Target) || 0;
    const q2 = parseFloat(q2Target) || 0;
    const q3 = parseFloat(q3Target) || 0;
    const q4 = parseFloat(q4Target) || 0;
    return q1 + q2 + q3 + q4;
  }, [q1Target, q2Target, q3Target, q4Target]);

  const annualTargetValue = parseFloat(annualTarget) || 0;
  const difference = annualTargetValue - quartersSum;
  const hasDifference = Math.abs(difference) > 0.01; // Tolerância para arredondamento

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    // Validações
    if (!annualTarget || parseFloat(annualTarget) <= 0) {
      setError('Meta Anual deve ser maior que zero');
      return;
    }

    setLoading(true);
    try {
      const goalData = {
        user_id: user.id,
        year: 2026,
        target_tcv_annual: parseFloat(annualTarget),
        target_q1: q1Target ? parseFloat(q1Target) : null,
        target_q2: q2Target ? parseFloat(q2Target) : null,
        target_q3: q3Target ? parseFloat(q3Target) : null,
        target_q4: q4Target ? parseFloat(q4Target) : null,
      };

      // Usar upsert - se não houver constraint única, fazer insert/update manual
      // Primeiro, verificar se já existe
      const { data: existing } = await supabase
        .from('professional_goals')
        .select('id')
        .eq('user_id', user.id)
        .eq('year', 2026)
        .single();

      if (existing) {
        // Atualizar
        const { error: updateError } = await supabase
          .from('professional_goals')
          .update(goalData)
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Inserir
        const { error: insertError } = await supabase
          .from('professional_goals')
          .insert([goalData]);

        if (insertError) throw insertError;
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error('Erro ao salvar meta:', err);
      setError(err.message || 'Erro ao salvar meta');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setAnnualTarget('');
    setQ1Target('');
    setQ2Target('');
    setQ3Target('');
    setQ4Target('');
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Definir Meta de TCV 2026"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        {loadingData ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 style={{ width: '2rem', height: '2rem', color: themeColors.neon.purple, animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Ano */}
            <div>
              <Input
                label="Ano"
                type="number"
                value={year.toString()}
                disabled
                required
                style={{ backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}
              />
              <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, marginTop: '0.25rem', margin: 0 }}>
                Meta definida para o ano de 2026
              </p>
            </div>

            {/* Meta Anual */}
            <div>
              <Input
                label="Meta Anual (TCV)"
                type="number"
                step="0.01"
                value={annualTarget}
                onChange={(e) => setAnnualTarget(e.target.value)}
                placeholder="0.00"
                required
                icon={<Target style={{ width: '1rem', height: '1rem' }} />}
              />
              {annualTargetValue > 0 && (
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginTop: '0.5rem', margin: 0 }}>
                  {formatCurrency(annualTargetValue)}
                </p>
              )}
            </div>

            {/* Distribuição por Quarter */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: themeColors.text,
                  marginBottom: '1rem',
                }}
              >
                Distribuição por Quarter
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                }}
              >
                {/* Q1 */}
                <div>
                  <Input
                    label="Q1 (Jan-Mar)"
                    type="number"
                    step="0.01"
                    value={q1Target}
                    onChange={(e) => setQ1Target(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Q2 */}
                <div>
                  <Input
                    label="Q2 (Abr-Jun)"
                    type="number"
                    step="0.01"
                    value={q2Target}
                    onChange={(e) => setQ2Target(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Q3 */}
                <div>
                  <Input
                    label="Q3 (Jul-Set)"
                    type="number"
                    step="0.01"
                    value={q3Target}
                    onChange={(e) => setQ3Target(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Q4 */}
                <div>
                  <Input
                    label="Q4 (Out-Dez)"
                    type="number"
                    step="0.01"
                    value={q4Target}
                    onChange={(e) => setQ4Target(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Helper: Soma dos Quarters */}
              <Card
                padding="md"
                style={{
                  marginTop: '1rem',
                  backgroundColor: hasDifference
                    ? (difference > 0
                        ? `${themeColors.neon.orange}20`
                        : `${themeColors.status.error}20`)
                    : `${themeColors.neon.emerald}20`,
                  border: `1px solid ${
                    hasDifference
                      ? difference > 0
                        ? themeColors.neon.orange
                        : themeColors.status.error
                      : themeColors.neon.emerald
                  }`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0, marginBottom: '0.25rem' }}>
                      Soma dos Quarters
                    </p>
                    <p
                      style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: hasDifference
                          ? difference > 0
                            ? themeColors.neon.orange
                            : themeColors.status.error
                          : themeColors.neon.emerald,
                        margin: 0,
                      }}
                    >
                      {formatCurrency(quartersSum)}
                    </p>
                  </div>
                  {hasDifference && (
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0, marginBottom: '0.25rem' }}>
                        Diferença
                      </p>
                      <p
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: difference > 0 ? themeColors.neon.orange : themeColors.status.error,
                          margin: 0,
                        }}
                      >
                        {difference > 0 ? '+' : ''}
                        {formatCurrency(difference)}
                      </p>
                    </div>
                  )}
                  {!hasDifference && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calculator style={{ width: '1rem', height: '1rem', color: themeColors.neon.emerald }} />
                      <span style={{ fontSize: '0.75rem', color: themeColors.neon.emerald, fontWeight: '600' }}>
                        OK
                      </span>
                    </div>
                  )}
                </div>
                {hasDifference && (
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: difference > 0 ? themeColors.neon.orange : themeColors.status.error,
                      margin: 0,
                      marginTop: '0.5rem',
                    }}
                  >
                    {difference > 0
                      ? `A soma dos quarters está abaixo da meta anual em ${formatCurrency(difference)}`
                      : `A soma dos quarters está acima da meta anual em ${formatCurrency(Math.abs(difference))}`}
                  </p>
                )}
              </Card>
            </div>

            {/* Erro */}
            {error && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: `${themeColors.status.error}20`,
                  border: `1px solid ${themeColors.status.error}`,
                  color: themeColors.status.error,
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </div>
            )}

            {/* Botões */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                    Salvando...
                  </>
                ) : (
                  'Salvar Meta'
                )}
              </Button>
            </div>
          </div>
        )}
      </form>

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

