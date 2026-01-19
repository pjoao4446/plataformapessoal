import { useState } from 'react';
import { BaseModal } from '../ui/BaseModal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export interface CreateCreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CARD_COLORS = [
  { value: '#10B981', label: 'Verde', color: '#10B981' },
  { value: '#3B82F6', label: 'Azul', color: '#3B82F6' },
  { value: '#820AD1', label: 'Roxo', color: '#820AD1' },
  { value: '#000000', label: 'Preto', color: '#000000' },
  { value: '#FF7A00', label: 'Laranja', color: '#FF7A00' },
];

// Gerar array de dias (1 a 31)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

/**
 * CreateCreditCardModal - Modal para cadastro de cartões de crédito
 * Design System: VertexGuard Premium Dark/Light
 */
export function CreateCreditCardModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCreditCardModalProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    limit: '',
    closingDay: 10,
    dueDay: 15,
    color: '#820AD1',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Apelido do cartão é obrigatório');
      return;
    }

    if (!formData.limit || parseFloat(formData.limit) <= 0) {
      setError('Limite total deve ser maior que zero');
      return;
    }

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from('credit_cards')
        .insert([
          {
            name: formData.name.trim(),
            limit_amount: parseFloat(formData.limit), // Corrigido: limit -> limit_amount
            closing_day: formData.closingDay,
            due_day: formData.dueDay,
            color: formData.color,
            user_id: user.id,
          },
        ])
        .select('*');

      if (insertError) {
        throw insertError;
      }

      // Limpar formulário
      setFormData({
        name: '',
        limit: '',
        closingDay: 10,
        dueDay: 15,
        color: '#820AD1',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao criar cartão:', err);
      setError(err.message || 'Erro ao criar cartão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        limit: '',
        closingDay: 10,
        dueDay: 15,
        color: '#820AD1',
      });
      setError(null);
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Novo Cartão de Crédito"
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
          label="Apelido do Cartão"
          placeholder="Ex: Nubank Roxinho"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
        />

        <Input
          label="Limite Total"
          type="number"
          step="0.01"
          placeholder="0,00"
          value={formData.limit}
          onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
          required
          disabled={loading}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Select
            label="Dia do Fechamento"
            value={formData.closingDay}
            onChange={(e) => setFormData({ ...formData, closingDay: Number(e.target.value) })}
            required
            disabled={loading}
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>

          <Select
            label="Dia do Vencimento"
            value={formData.dueDay}
            onChange={(e) => setFormData({ ...formData, dueDay: Number(e.target.value) })}
            required
            disabled={loading}
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>
        </div>

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
            {CARD_COLORS.map((colorOption) => (
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

