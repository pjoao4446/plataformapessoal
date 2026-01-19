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

export interface ManageCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: {
    id: string;
    name: string;
    type: 'expense' | 'income';
    color: string;
    icon?: string;
    budget_limit?: number;
  } | null;
}

const CATEGORY_COLORS = [
  { value: '#EF4444', label: 'Vermelho', color: '#EF4444' },
  { value: '#F59E0B', label: 'Laranja', color: '#F59E0B' },
  { value: '#10B981', label: 'Verde', color: '#10B981' },
  { value: '#3B82F6', label: 'Azul', color: '#3B82F6' },
  { value: '#8B5CF6', label: 'Roxo', color: '#8B5CF6' },
  { value: '#EC4899', label: 'Rosa', color: '#EC4899' },
  { value: '#06B6D4', label: 'Ciano', color: '#06B6D4' },
  { value: '#84CC16', label: 'Lima', color: '#84CC16' },
];

const COMMON_ICONS = [
  { value: '🍔', label: 'Alimentação' },
  { value: '🚗', label: 'Transporte' },
  { value: '🏠', label: 'Moradia' },
  { value: '💊', label: 'Saúde' },
  { value: '🎓', label: 'Educação' },
  { value: '🎮', label: 'Lazer' },
  { value: '✈️', label: 'Viagem' },
  { value: '☕', label: 'Café' },
  { value: '🛒', label: 'Compras' },
  { value: '💰', label: 'Dinheiro' },
  { value: '💳', label: 'Cartão' },
  { value: '📱', label: 'Tecnologia' },
];

/**
 * ManageCategoryModal - Modal para criar e editar categorias
 * Suporta definição de orçamento mensal
 */
export function ManageCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
}: ManageCategoryModalProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  // Preencher formulário quando for edição
  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        setName(categoryToEdit.name);
        setIcon(categoryToEdit.icon || '');
        setBudgetLimit(categoryToEdit.budget_limit?.toString() || '');
        setColor(categoryToEdit.color || '#3B82F6');
        setType(categoryToEdit.type);
      } else {
        // Resetar para criação
        setName('');
        setIcon('');
        setBudgetLimit('');
        setColor('#3B82F6');
        setType('expense');
      }
      setError(null);
    }
  }, [isOpen, categoryToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    // Validações
    if (!name.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    setLoading(true);

    try {
      const categoryData: any = {
        name: name.trim(),
        type: type,
        color: color,
        icon: icon || null,
        budget_limit: budgetLimit ? parseFloat(budgetLimit) : null,
        user_id: user.id,
      };

      if (categoryToEdit) {
        // Atualizar categoria existente
        const { error: updateError } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', categoryToEdit.id)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Criar nova categoria
        const { error: insertError } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (insertError) throw insertError;
      }

      showToast(categoryToEdit ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!', 'success');
      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error('Erro ao salvar categoria:', err);
      setError(err.message || 'Erro ao salvar categoria. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName('');
      setIcon('');
      setBudgetLimit('');
      setColor('#3B82F6');
      setType('expense');
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
    const styleId = 'category-modal-toast-styles';
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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={categoryToEdit ? 'Editar Categoria' : 'Nova Categoria'}
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
              categoryToEdit ? 'Atualizar' : 'Criar'
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

        {/* Nome */}
        <Input
          label="Nome"
          placeholder="Ex: Alimentação, Transporte, Salário"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />

        {/* Tipo */}
        <Select
          label="Tipo"
          value={type}
          onChange={(e) => setType(e.target.value as 'expense' | 'income')}
          required
          disabled={loading}
        >
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </Select>

        {/* Ícone */}
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
            Ícone (Emoji)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {COMMON_ICONS.map((iconOption) => (
              <button
                key={iconOption.value}
                type="button"
                onClick={() => setIcon(iconOption.value)}
                disabled={loading}
                style={{
                  fontSize: '1.5rem',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${icon === iconOption.value ? themeColors.neon.purple : themeColors.border}`,
                  backgroundColor: icon === iconOption.value ? `${themeColors.neon.purple}20` : themeColors.surface,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!loading && icon !== iconOption.value) {
                    e.currentTarget.style.borderColor = themeColors.neon.purple;
                    e.currentTarget.style.backgroundColor = `${themeColors.neon.purple}10`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && icon !== iconOption.value) {
                    e.currentTarget.style.borderColor = themeColors.border;
                    e.currentTarget.style.backgroundColor = themeColors.surface;
                  }
                }}
                title={iconOption.label}
              >
                {iconOption.value}
              </button>
            ))}
          </div>
          <Input
            placeholder="Ou digite um emoji personalizado"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          />
        </div>

        {/* Meta Mensal (Budget) - Destaque especial */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: `${themeColors.neon.purple}15`,
            border: `2px solid ${themeColors.neon.purple}40`,
            borderRadius: '0.75rem',
          }}
        >
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: themeColors.text,
              marginBottom: '0.75rem',
            }}
          >
            💰 Limite de Gasto Mensal {type === 'expense' ? '(Opcional)' : ''}
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
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                backgroundColor: themeColors.surface,
                border: `2px solid ${themeColors.neon.purple}60`,
                borderRadius: '0.75rem',
                color: themeColors.text,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = themeColors.neon.purple;
                e.currentTarget.style.boxShadow = `0 0 0 4px ${themeColors.neon.purple}33`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `${themeColors.neon.purple}60`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Cor */}
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
            {CATEGORY_COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => setColor(colorOption.value)}
                disabled={loading}
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: colorOption.color,
                  border: color === colorOption.value
                    ? `3px solid ${themeColors.neon.purple}`
                    : `2px solid ${themeColors.border}`,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.5 : 1,
                  boxShadow: color === colorOption.value
                    ? `0 0 0 4px ${themeColors.neon.purple}33`
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!loading && color !== colorOption.value) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.borderColor = themeColors.borderStrong;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && color !== colorOption.value) {
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

