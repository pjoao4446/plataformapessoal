import { useState, useEffect } from 'react';
import { BaseModal } from '../ui/BaseModal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export interface CreatePatrimonyItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type PatrimonyType = 'asset' | 'liability';

type AssetType = 'emergency_fund' | 'fixed_income' | 'stock' | 'crypto' | 'property' | 'vehicle' | 'brokerage_balance';
type LiabilityType = 'personal_loan' | 'financing' | 'credit_card_debt' | 'other';

/**
 * CreatePatrimonyItemModal - Modal para cadastrar itens de patrimônio
 * Suporta Ativos (Investimentos/Bens) e Passivos (Dívidas)
 */
export function CreatePatrimonyItemModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePatrimonyItemModalProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PatrimonyType>('asset');
  
  // Dados do formulário
  const [title, setTitle] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('emergency_fund');
  const [liabilityType, setLiabilityType] = useState<LiabilityType>('personal_loan');
  const [currentValue, setCurrentValue] = useState('');
  const [originalValue, setOriginalValue] = useState(''); // Apenas para passivos
  const [acquisitionDate, setAcquisitionDate] = useState(''); // Apenas para ativos

  // Resetar formulário quando trocar de tab ou fechar modal
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setAssetType('emergency_fund');
      setLiabilityType('personal_loan');
      setCurrentValue('');
      setOriginalValue('');
      setAcquisitionDate('');
      setError(null);
    }
  }, [activeTab, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    // Validações
    if (!title.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!currentValue || parseFloat(currentValue) <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }

    // Validações específicas para passivos
    if (activeTab === 'liability') {
      if (!originalValue || parseFloat(originalValue) <= 0) {
        setError('Valor original é obrigatório');
        return;
      }
      const original = parseFloat(originalValue);
      const current = parseFloat(currentValue);
      if (current > original) {
        setError('Valor atual não pode ser maior que o valor original');
        return;
      }
    }

    setLoading(true);

    try {
      if (activeTab === 'asset') {
        // Criar registro na tabela assets
        const assetData: any = {
          title: title.trim(),
          type: assetType,
          current_value: parseFloat(currentValue),
          user_id: user.id,
          owner_type: 'personal', // Padrão pessoal
        };

        if (acquisitionDate) {
          assetData.acquisition_date = acquisitionDate;
        }

        const { error: insertError } = await supabase
          .from('assets')
          .insert([assetData]);

        if (insertError) throw insertError;

        showToast('Ativo cadastrado com sucesso!', 'success');
      } else {
        // Criar registro na tabela liabilities
        const liabilityData: any = {
          title: title.trim(),
          type: liabilityType,
          original_value: parseFloat(originalValue),
          current_value: parseFloat(currentValue), // Saldo devedor atual
          amount_paid: parseFloat(originalValue) - parseFloat(currentValue),
          user_id: user.id,
          status: 'active',
          owner_type: 'personal', // Padrão pessoal
        };

        const { error: insertError } = await supabase
          .from('liabilities')
          .insert([liabilityData]);

        if (insertError) throw insertError;

        showToast('Passivo cadastrado com sucesso!', 'success');
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error('Erro ao criar item de patrimônio:', err);
      setError(err.message || 'Erro ao criar item. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setAssetType('emergency_fund');
      setLiabilityType('personal_loan');
      setCurrentValue('');
      setOriginalValue('');
      setAcquisitionDate('');
      setError(null);
      onClose();
    }
  };

  // Sistema simples de toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? themeColors.neon.emerald : themeColors.status.error};
      color: white;
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-weight: 600;
      max-width: 400px;
      animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  // Adicionar animações CSS
  useEffect(() => {
    const styleId = 'patrimony-modal-toast-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const isAsset = activeTab === 'asset';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Novo Item de Patrimônio"
      size="md"
      footer={
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
              'Salvar'
            )}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: `${themeColors.status.error}20`,
              border: `1px solid ${themeColors.status.error}`,
              borderRadius: '0.5rem',
              color: themeColors.status.error,
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Tabs Grandes */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('asset')}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '0.75rem',
              border: 'none',
              backgroundColor: isAsset ? '#10B981' : themeColors.surface,
              color: isAsset ? 'white' : themeColors.textSecondary,
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
            }}
          >
            <TrendingUp style={{ width: '1.25rem', height: '1.25rem' }} />
            ATIVO
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('liability')}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '0.75rem',
              border: 'none',
              backgroundColor: !isAsset ? '#F43F5E' : themeColors.surface,
              color: !isAsset ? 'white' : themeColors.textSecondary,
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
            }}
          >
            <TrendingDown style={{ width: '1.25rem', height: '1.25rem' }} />
            PASSIVO
          </button>
        </div>

        {/* Nome */}
        <Input
          label="Nome"
          placeholder={isAsset ? 'Ex: Reserva de Emergência, Apartamento' : 'Ex: Empréstimo Pessoal, Dívida Antiga'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />

        {/* Tipo */}
        {isAsset ? (
          <Select
            label="Tipo"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value as AssetType)}
            required
            disabled={loading}
          >
            <option value="emergency_fund">Reserva de Emergência</option>
            <option value="fixed_income">Renda Fixa</option>
            <option value="stock">Ações</option>
            <option value="crypto">Criptomoedas</option>
            <option value="property">Imóvel</option>
            <option value="vehicle">Veículo</option>
            <option value="brokerage_balance">Saldo em Corretora</option>
          </Select>
        ) : (
          <Select
            label="Tipo"
            value={liabilityType}
            onChange={(e) => setLiabilityType(e.target.value as LiabilityType)}
            required
            disabled={loading}
          >
            <option value="personal_loan">Empréstimo Pessoal</option>
            <option value="financing">Financiamento</option>
            <option value="credit_card_debt">Dívida de Cartão</option>
            <option value="other">Outros</option>
          </Select>
        )}

        {/* Valor Atual */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: themeColors.text,
              marginBottom: '0.5rem',
            }}
          >
            {isAsset ? 'Valor Atual' : 'Valor Atual (Saldo Devedor)'} <span style={{ color: themeColors.status.error }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1rem',
                fontWeight: '600',
                color: themeColors.textSecondary,
              }}
            >
              R$
            </span>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                fontSize: '1rem',
                fontWeight: '600',
                backgroundColor: themeColors.surface,
                border: `1px solid ${themeColors.border}`,
                borderRadius: '0.75rem',
                color: themeColors.text,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = themeColors.neon.purple;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${themeColors.neon.purple}33`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = themeColors.border;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Valor Original (apenas para passivos) */}
        {!isAsset && (
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: themeColors.text,
                marginBottom: '0.5rem',
              }}
            >
              Valor Original <span style={{ color: themeColors.status.error }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: themeColors.textSecondary,
                }}
              >
                R$
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={originalValue}
                onChange={(e) => setOriginalValue(e.target.value)}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  backgroundColor: themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '0.75rem',
                  color: themeColors.text,
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = themeColors.neon.purple;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${themeColors.neon.purple}33`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = themeColors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: '0.5rem 0 0 0' }}>
              Qual era o valor total da dívida quando foi contraída
            </p>
          </div>
        )}

        {/* Data de Aquisição (apenas para ativos) */}
        {isAsset && (
          <Input
            label="Data de Aquisição (Opcional)"
            type="date"
            value={acquisitionDate}
            onChange={(e) => setAcquisitionDate(e.target.value)}
            disabled={loading}
          />
        )}

        {/* Aviso para passivos */}
        {!isAsset && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: `${themeColors.status.warning}20`,
              border: `1px solid ${themeColors.status.warning}`,
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <AlertCircle style={{ width: '1rem', height: '1rem', color: themeColors.status.warning, flexShrink: 0, marginTop: '0.125rem' }} />
            <p style={{ fontSize: '0.875rem', color: themeColors.text, margin: 0, lineHeight: '1.5' }}>
              <strong>Atenção:</strong> Dívidas recorrentes (mensais) devem ser cadastradas na aba <strong>Recorrências</strong> para gerar previsão de fluxo de caixa.
            </p>
          </div>
        )}
      </form>
    </BaseModal>
  );
}

