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

export interface CreateRecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type RecurrenceType = 'fixed' | 'subscription' | 'loan' | 'installment';

interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
}

// Gerar array de dias (1 a 31)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

/**
 * CreateRecurrenceModal - Modal para cadastrar recorrências
 * Suporta custos fixos, assinaturas, empréstimos e parcelamentos
 * Quando for empréstimo, cria automaticamente registro em liabilities
 */
export function CreateRecurrenceModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRecurrenceModalProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dados do formulário
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<RecurrenceType>('fixed');
  const [categoryId, setCategoryId] = useState('');
  const [dueDay, setDueDay] = useState(10);
  const [endDate, setEndDate] = useState('');
  
  // Campos extras para empréstimos
  const [totalDebt, setTotalDebt] = useState('');
  const [installments, setInstallments] = useState('');
  
  // Dados carregados
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Carregar categorias quando o modal abrir
  useEffect(() => {
    if (isOpen && user) {
      fetchCategories();
    }
  }, [isOpen, user]);

  // Resetar formulário quando o modal fechar ou tipo mudar
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setAmount('');
      setType('fixed');
      setCategoryId('');
      setDueDay(10);
      setEndDate('');
      setTotalDebt('');
      setInstallments('');
      setError(null);
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    if (!user) return;
    
    setLoadingData(true);
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'expense')
        .eq('user_id', user.id)
        .order('name');

      if (categoriesError) {
        console.error('Erro ao buscar categorias:', categoriesError);
      } else {
        setCategories(categoriesData || []);
      }
    } catch (err: any) {
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    // Validações
    if (!title.trim()) {
      setError('Título é obrigatório');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Valor mensal deve ser maior que zero');
      return;
    }

    if (!categoryId) {
      setError('Selecione uma categoria');
      return;
    }

    // Validações específicas para empréstimos
    if (type === 'loan') {
      if (!totalDebt || parseFloat(totalDebt) <= 0) {
        setError('Valor total da dívida é obrigatório');
        return;
      }
      if (!installments || parseInt(installments) <= 0) {
        setError('Número de parcelas é obrigatório');
        return;
      }
    }

    setLoading(true);

    try {
      const monthlyAmount = parseFloat(amount);
      
      // 1. Criar registro na tabela recurrences
      const recurrenceData: any = {
        description: title.trim(), // Usar description como campo principal
        amount: monthlyAmount,
        type: type,
        category_id: categoryId,
        due_day: dueDay,
        user_id: user.id,
        is_active: true,
        end_date: endDate || null,
      };

      // Adicionar campos de parcelas se for loan ou installment
      if (type === 'loan' || type === 'installment') {
        const totalInstallments = parseInt(installments) || 1;
        recurrenceData.total_installments = totalInstallments;
        recurrenceData.current_installment = 1;
      }

      const { data: recurrenceResult, error: recurrenceError } = await supabase
        .from('recurrences')
        .insert([recurrenceData])
        .select();

      if (recurrenceError) throw recurrenceError;

      // 2. Se for empréstimo, criar registro na tabela liabilities
      if (type === 'loan') {
        const totalDebtValue = parseFloat(totalDebt);
        const totalInstallments = parseInt(installments) || 1;
        
        const liabilityData = {
          title: title.trim(),
          original_value: totalDebtValue, // Valor total original da dívida
          current_value: totalDebtValue, // Saldo devedor inicial = valor total
          amount_paid: 0,
          type: 'loan',
          description: 'Integrado via Recorrências',
          user_id: user.id,
          status: 'active',
          owner_type: 'personal', // Padrão pessoal
        };

        const { error: liabilityError } = await supabase
          .from('liabilities')
          .insert([liabilityData]);

        if (liabilityError) {
          console.error('Erro ao criar dívida:', liabilityError);
          // Não bloquear o sucesso da recorrência, apenas logar o erro
          showToast('Recorrência criada! (Aviso: Erro ao vincular dívida ao Patrimônio)', 'error');
        } else {
          showToast('Recorrência criada! (E dívida vinculada ao Patrimônio)', 'success');
        }
      } else {
        showToast('Recorrência criada com sucesso!', 'success');
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error('Erro ao criar recorrência:', err);
      setError(err.message || 'Erro ao criar recorrência. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setAmount('');
      setType('fixed');
      setCategoryId('');
      setDueDay(10);
      setEndDate('');
      setTotalDebt('');
      setInstallments('');
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
    const styleId = 'recurrence-modal-toast-styles';
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

  const isLoan = type === 'loan';
  const isInstallment = type === 'installment';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nova Recorrência"
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
            disabled={loading || loadingData}
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

        {/* Título */}
        <Input
          label="Título"
          placeholder="Ex: Netflix, Aluguel, Empréstimo Consignado"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading || loadingData}
        />

        {/* Valor Mensal */}
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
            Valor Mensal <span style={{ color: themeColors.status.error }}>*</span>
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={loading || loadingData}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                fontSize: '1.125rem',
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

        {/* Tipo */}
        <Select
          label="Tipo"
          value={type}
          onChange={(e) => setType(e.target.value as RecurrenceType)}
          required
          disabled={loading || loadingData}
        >
          <option value="fixed">Custo Fixo (ex: Luz, Água)</option>
          <option value="subscription">Assinatura (ex: Spotify, Netflix)</option>
          <option value="loan">Empréstimo/Financiamento</option>
          <option value="installment">Parcelamento de Cartão</option>
        </Select>

        {/* Categoria */}
        <Select
          label="Categoria"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          disabled={loading || loadingData}
        >
          <option value="">Selecione uma categoria</option>
          {categories.length === 0 ? (
            <option value="" disabled>Nenhuma categoria encontrada</option>
          ) : (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          )}
        </Select>
        {categories.length === 0 && !loadingData && (
          <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: '-0.5rem 0 0 0' }}>
            Você precisa criar uma categoria primeiro. Acesse a seção de Categorias.
          </p>
        )}

        {/* Dia de Vencimento */}
        <Select
          label="Dia de Vencimento"
          value={dueDay}
          onChange={(e) => setDueDay(Number(e.target.value))}
          required
          disabled={loading || loadingData}
        >
          {DAYS.map((day) => (
            <option key={day} value={day}>
              Dia {day}
            </option>
          ))}
        </Select>

        {/* Campos extras para empréstimos */}
        {isLoan && (
          <>
            <div
              style={{
                padding: '1rem',
                backgroundColor: `${themeColors.status.error}15`,
                border: `1px solid ${themeColors.status.error}40`,
                borderRadius: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: themeColors.text, margin: '0 0 1rem 0' }}>
                📋 Informações da Dívida (será vinculada ao Patrimônio)
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    Valor Total da Dívida (Saldo Devedor Inicial) <span style={{ color: themeColors.status.error }}>*</span>
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
                      value={totalDebt}
                      onChange={(e) => setTotalDebt(e.target.value)}
                      required
                      disabled={loading || loadingData}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 3rem',
                        fontSize: '1rem',
                        backgroundColor: themeColors.surface,
                        border: `1px solid ${themeColors.border}`,
                        borderRadius: '0.75rem',
                        color: themeColors.text,
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                <Input
                  label="Número de Parcelas"
                  type="number"
                  min="1"
                  placeholder="Ex: 24"
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  required
                  disabled={loading || loadingData}
                />
              </div>
            </div>
          </>
        )}

        {/* Campos extras para parcelamentos */}
        {isInstallment && (
          <Input
            label="Número de Parcelas"
            type="number"
            min="1"
            placeholder="Ex: 12"
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
            required
            disabled={loading || loadingData}
          />
        )}

        {/* Data Fim (Opcional) */}
        <div>
          <Input
            label="Data Fim (Opcional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading || loadingData}
          />
          <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: '0.5rem 0 0 0' }}>
            Deixe em branco para recorrência infinita
          </p>
        </div>

        {loadingData && (
          <div style={{ textAlign: 'center', padding: '1rem', color: themeColors.textSecondary }}>
            Carregando dados...
          </div>
        )}
      </form>
    </BaseModal>
  );
}

