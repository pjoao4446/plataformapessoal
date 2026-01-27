import { useState, useEffect } from 'react';
import { BaseModal } from '../ui/BaseModal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import type { Account } from '../../mocks/database';

export interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accountToEdit?: Account | null;
}

const ACCOUNT_COLORS = [
  { value: '#10B981', label: 'Verde', color: '#10B981' },
  { value: '#3B82F6', label: 'Azul', color: '#3B82F6' },
  { value: '#A855F7', label: 'Roxo', color: '#A855F7' },
  { value: '#000000', label: 'Preto', color: '#000000' },
  { value: '#FF7A00', label: 'Laranja', color: '#FF7A00' },
];

/**
 * CreateAccountModal - Modal para cadastro de contas bancárias
 * Design System: VertexGuard Premium Dark/Light
 */
export function CreateAccountModal({
  isOpen,
  onClose,
  onSuccess,
  accountToEdit,
}: CreateAccountModalProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    bank: '',
    type: 'checking' as 'checking' | 'investment' | 'cash',
    balance: '',
    color: '#10B981',
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (accountToEdit && isOpen) {
      setFormData({
        name: accountToEdit.name || '',
        bank: accountToEdit.bank || '',
        type: accountToEdit.type || 'checking',
        balance: accountToEdit.balance?.toString() || '0',
        color: accountToEdit.color || '#10B981',
      });
    } else if (!accountToEdit && isOpen) {
      // Limpar formulário quando criar novo
      setFormData({
        name: '',
        bank: '',
        type: 'checking',
        balance: '',
        color: '#10B981',
      });
    }
  }, [accountToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Nome da conta é obrigatório');
      return;
    }

    if (!formData.bank.trim()) {
      setError('Instituição é obrigatória');
      return;
    }

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      if (accountToEdit) {
        // Atualizar conta existente
        const { error: updateError } = await supabase
          .from('accounts')
          .update({
            name: formData.name.trim(),
            bank_name: formData.bank.trim(),
            type: formData.type,
            balance: parseFloat(formData.balance) || 0,
            color: formData.color,
          })
          .eq('id', accountToEdit.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Criar nova conta
        const { data, error: insertError } = await supabase
          .from('accounts')
          .insert([
            {
              name: formData.name.trim(),
              bank_name: formData.bank.trim(),
              type: formData.type,
              balance: parseFloat(formData.balance) || 0,
              color: formData.color,
              user_id: user.id,
            },
          ])
          .select();

        if (insertError) {
          throw insertError;
        }
      }

      // Limpar formulário
      setFormData({
        name: '',
        bank: '',
        type: 'checking',
        balance: '',
        color: '#10B981',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao criar conta:', err);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        bank: '',
        type: 'checking',
        balance: '',
        color: '#10B981',
      });
      setError(null);
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={accountToEdit ? "Editar Conta" : "Nova Conta"}
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

        <Input
          label="Nome da Conta"
          placeholder="Ex: Conta Principal"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
        />

        <Select
          label="Instituição"
          value={formData.bank}
          onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
          required
          disabled={loading}
        >
          <option value="">Selecione uma instituição</option>
          <option value="nubank">Nubank</option>
          <option value="inter">Inter</option>
          <option value="xp">XP Investimentos</option>
          <option value="itau">Itaú</option>
          <option value="bradesco">Bradesco</option>
          <option value="banco-do-brasil">Banco do Brasil</option>
          <option value="caixa">Caixa Econômica Federal</option>
          <option value="santander">Santander</option>
          <option value="wallet">Carteira</option>
          <option value="outro">Outro</option>
        </Select>

        <Select
          label="Tipo de Conta"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          required
          disabled={loading}
        >
          <option value="checking">Conta Corrente</option>
          <option value="investment">Investimento</option>
          <option value="cash">Dinheiro Físico</option>
        </Select>

        <Input
          label="Saldo Atual"
          type="number"
          step="0.01"
          placeholder="0,00"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
          required
          disabled={loading}
        />

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: themeColors.text,
              marginBottom: '0.75rem',
            }}
          >
            Cor
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {ACCOUNT_COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => setFormData({ ...formData, color: colorOption.value })}
                disabled={loading}
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: colorOption.color,
                  border: formData.color === colorOption.value
                    ? `3px solid ${themeColors.neon.purple}`
                    : `2px solid ${themeColors.border}`,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.5 : 1,
                  boxShadow: formData.color === colorOption.value
                    ? `0 0 0 4px ${themeColors.neon.purple}33`
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!loading && formData.color !== colorOption.value) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.borderColor = themeColors.borderStrong;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && formData.color !== colorOption.value) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = themeColors.border;
                  }
                }}
                aria-label={colorOption.label}
              />
            ))}
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

