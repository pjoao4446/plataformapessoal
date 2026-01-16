import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { useAuth } from '../../../context/AuthContext';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const Required = styled.span`
  color: #ef4444;
  margin-left: 0.25rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accentCyan};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accentCyan};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

type Category = {
  id: number;
  name: string;
  type: 'expense';
  color: string;
};

type CreditCard = {
  id: number;
  name: string;
  last_four_digits: string;
};

type RecurringExpense = {
  id?: number;
  category_id: number;
  amount: number;
  description: string;
  payment_method?: string;
  notes?: string;
  due_day: number;
  is_active?: boolean;
  credit_card_id?: number | null;
  is_installment?: boolean;
  total_installments?: number | null;
  current_installment?: number;
  end_date?: string | null;
};

type RecurringExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  expense?: RecurringExpense | null;
  onSave: () => void;
};

export const RecurringExpenseModal: FC<RecurringExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSave,
}) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category_id: 0,
    amount: '',
    description: '',
    payment_method: '',
    notes: '',
    due_day: new Date().getDate(),
    is_active: true,
    credit_card_id: null as number | null,
    is_installment: false,
    total_installments: '',
    current_installment: 1,
    end_date: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchCreditCards();
      if (expense) {
        setFormData({
          category_id: expense.category_id,
          amount: expense.amount.toString(),
          description: expense.description,
          payment_method: expense.payment_method || '',
          notes: expense.notes || '',
          due_day: expense.due_day,
          is_active: expense.is_active !== undefined ? expense.is_active : true,
          credit_card_id: expense.credit_card_id || null,
          is_installment: expense.is_installment || false,
          total_installments: expense.total_installments?.toString() || '',
          current_installment: expense.current_installment || 1,
          end_date: expense.end_date || '',
        });
      } else {
        setFormData({
          category_id: 0,
          amount: '',
          description: '',
          payment_method: '',
          notes: '',
          due_day: new Date().getDate(),
          is_active: true,
          credit_card_id: null,
          is_installment: false,
          total_installments: '',
          current_installment: 1,
          end_date: '',
        });
      }
      setError(null);
    }
  }, [isOpen, expense]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/financial/categories?type=expense', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchCreditCards = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/financial/credit-cards', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCreditCards(data);
      }
    } catch (error) {
      console.error('Erro ao buscar cartões:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.category_id) {
      setError('Selecione uma categoria');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }
    if (!formData.description.trim()) {
      setError('Descrição é obrigatória');
      return;
    }
    if (formData.due_day < 1 || formData.due_day > 31) {
      setError('Dia de vencimento deve estar entre 1 e 31');
      return;
    }
    if (formData.is_installment) {
      if (!formData.total_installments || parseInt(formData.total_installments) < 2) {
        setError('Despesa parcelada deve ter pelo menos 2 parcelas');
        return;
      }
    }

    setLoading(true);

    try {
      const url = expense?.id
        ? `http://localhost:4000/api/financial/recurring-expenses/${expense.id}`
        : 'http://localhost:4000/api/financial/recurring-expenses';
      
      const method = expense?.id ? 'PUT' : 'POST';

      const payload: any = {
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        payment_method: formData.payment_method || null,
        notes: formData.notes || null,
        due_day: formData.due_day,
        is_active: formData.is_active,
        credit_card_id: formData.credit_card_id || null,
        is_installment: formData.is_installment,
      };

      if (formData.is_installment) {
        payload.total_installments = parseInt(formData.total_installments);
        payload.current_installment = formData.current_installment || 1;
        if (formData.end_date) {
          payload.end_date = formData.end_date;
        }
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao salvar despesa recorrente');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar despesa recorrente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expense ? 'Editar Despesa Recorrente' : 'Nova Despesa Recorrente'}
      size="small"
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            Valor <Required>*</Required>
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
            autoFocus
          />
        </FormGroup>

        <FormGroup>
          <Label>
            Descrição <Required>*</Required>
          </Label>
          <Input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ex: Aluguel"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>
            Categoria <Required>*</Required>
          </Label>
          <Select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
            required
          >
            <option value={0}>Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            Dia de Vencimento <Required>*</Required>
          </Label>
          <Input
            type="number"
            min="1"
            max="31"
            value={formData.due_day}
            onChange={(e) => setFormData({ ...formData, due_day: Number(e.target.value) })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Método de Pagamento</Label>
          <Select
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Cartão de Débito">Cartão de Débito</option>
            <option value="PIX">PIX</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Transferência">Transferência</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Cartão de Crédito (opcional)</Label>
          <Select
            value={formData.credit_card_id || ''}
            onChange={(e) => setFormData({ ...formData, credit_card_id: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">Nenhum</option>
            {creditCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name} - **** {card.last_four_digits}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              checked={formData.is_installment}
              onChange={(e) => setFormData({ ...formData, is_installment: e.target.checked, total_installments: e.target.checked ? formData.total_installments || '2' : '' })}
            />
            <Label>É uma despesa parcelada (tem fim)</Label>
          </CheckboxGroup>
        </FormGroup>

        {formData.is_installment && (
          <>
            <FormGroup>
              <Label>
                Total de Parcelas <Required>*</Required>
              </Label>
              <Input
                type="number"
                min="2"
                value={formData.total_installments}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, total_installments: value });
                  // Calcular end_date automaticamente
                  if (value && formData.due_day) {
                    const monthsToAdd = parseInt(value) - 1;
                    const startDate = new Date();
                    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + monthsToAdd, formData.due_day);
                    setFormData(prev => ({ ...prev, total_installments: value, end_date: endDate.toISOString().split('T')[0] }));
                  }
                }}
                placeholder="Ex: 12"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Parcela Atual</Label>
              <Input
                type="number"
                min="1"
                max={formData.total_installments ? parseInt(formData.total_installments) : undefined}
                value={formData.current_installment}
                onChange={(e) => setFormData({ ...formData, current_installment: parseInt(e.target.value) || 1 })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Data de Término</Label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </FormGroup>
          </>
        )}

        <FormGroup>
          <Label>Observações</Label>
          <TextArea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Observações adicionais (opcional)"
          />
        </FormGroup>

        <FormGroup>
          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <Label>Despesa ativa</Label>
          </CheckboxGroup>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : expense ? 'Salvar Alterações' : 'Criar Despesa Recorrente'}
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};


