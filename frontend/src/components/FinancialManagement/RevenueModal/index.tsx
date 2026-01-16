import { FC, useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Select } from '../../ui/Select';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getTheme } from '../../../styles/theme';

type Revenue = {
  id: number;
  category_name: string;
  amount: number;
  description: string;
  payment_method?: string;
  transaction_date: string;
};

type RevenueModalProps = {
  isOpen: boolean;
  onClose: () => void;
  revenue?: Revenue | null;
  onSave: () => void;
};

export const RevenueModal: FC<RevenueModalProps> = ({
  isOpen,
  onClose,
  revenue,
  onSave,
}) => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    description: '',
    payment_method: '',
    transaction_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && categories.length > 0) {
      if (revenue) {
        const category = categories.find(cat => cat.name === revenue.category_name);
        setFormData({
          category_id: category?.id.toString() || '',
          amount: revenue.amount.toString(),
          description: revenue.description,
          payment_method: revenue.payment_method || '',
          transaction_date: revenue.transaction_date,
        });
      } else {
        setFormData({
          category_id: '',
          amount: '',
          description: '',
          payment_method: '',
          transaction_date: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [isOpen, revenue, categories]);

  const fetchCategories = async () => {
    if (!token) return;
    
    try {
      const res = await fetch('http://localhost:4000/api/financial/categories?type=income', {
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

    setLoading(true);

    try {
      const url = revenue?.id
        ? `http://localhost:4000/api/financial/revenues/${revenue.id}`
        : 'http://localhost:4000/api/financial/revenues';
      
      const method = revenue?.id ? 'PUT' : 'POST';

      const payload = {
        category_id: parseInt(formData.category_id),
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        payment_method: formData.payment_method || null,
        transaction_date: formData.transaction_date,
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
        throw new Error(errorData.error || 'Erro ao salvar receita');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar receita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={revenue ? 'Editar Receita' : 'Nova Receita'}
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Input
          label="Valor"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
          autoFocus
        />

        <Input
          label="Descrição"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Ex: Salário"
          required
        />

        <Select
          label="Categoria"
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        <Select
          label="Método de Pagamento"
          value={formData.payment_method}
          onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="PIX">PIX</option>
          <option value="Transferência">Transferência</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de Débito">Cartão de Débito</option>
        </Select>

        <Input
          label="Data"
          type="date"
          value={formData.transaction_date}
          onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
          required
        />

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: `${themeColors.status.error}20`,
              border: `1px solid ${themeColors.status.error}`,
              borderRadius: '0.75rem',
              color: themeColors.status.error,
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : revenue ? 'Salvar Alterações' : 'Criar Receita'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
