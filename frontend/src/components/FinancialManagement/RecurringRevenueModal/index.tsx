import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
// TODO: Criar componentes Modal, Input e Button ou remover este arquivo se não estiver em uso
// import { Modal } from '../../Modal';
// import { Input } from '../../Input';
// import { Button } from '../../Button';
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
  type: 'revenue';
  color: string;
};

type RecurringRevenue = {
  id?: number;
  category_id: number;
  amount: number;
  description: string;
  notes?: string;
  due_day: number;
  is_active?: boolean;
  category_name?: string;
  category_color?: string;
};

type RecurringRevenueModalProps = {
  isOpen: boolean;
  onClose: () => void;
  revenue?: RecurringRevenue | null;
  onSave: () => void;
};

export const RecurringRevenueModal: FC<RecurringRevenueModalProps> = ({
  isOpen,
  onClose,
  revenue,
  onSave,
}) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category_id: 0,
    amount: '',
    description: '',
    notes: '',
    due_day: new Date().getDate(),
    is_active: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (revenue) {
        setFormData({
          category_id: revenue.category_id,
          amount: revenue.amount.toString(),
          description: revenue.description,
          notes: revenue.notes || '',
          due_day: revenue.due_day,
          is_active: revenue.is_active !== undefined ? revenue.is_active : true,
        });
      } else {
        setFormData({
          category_id: 0,
          amount: '',
          description: '',
          notes: '',
          due_day: new Date().getDate(),
          is_active: true,
        });
      }
      setError(null);
    }
  }, [isOpen, revenue]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/financial/categories?type=revenue', {
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
      setError('Dia de recebimento deve estar entre 1 e 31');
      return;
    }

    setLoading(true);

    try {
      const url = revenue?.id
        ? `http://localhost:4000/api/financial/recurring-revenues/${revenue.id}`
        : 'http://localhost:4000/api/financial/recurring-revenues';
      
      const method = revenue?.id ? 'PUT' : 'POST';

      const payload = {
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        notes: formData.notes || null,
        due_day: formData.due_day,
        is_active: formData.is_active,
      };

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
        throw new Error(errorData.error || 'Erro ao salvar receita recorrente');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar receita recorrente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={revenue ? 'Editar Receita Recorrente' : 'Nova Receita Recorrente'}
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
            placeholder="Ex: Salário"
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
            Dia de Recebimento <Required>*</Required>
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
            <Label>Receita ativa</Label>
          </CheckboxGroup>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : revenue ? 'Salvar Alterações' : 'Criar Receita Recorrente'}
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

