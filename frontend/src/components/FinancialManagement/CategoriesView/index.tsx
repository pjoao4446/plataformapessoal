import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';

const Container = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 100%;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const HeaderCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin: 0;
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.75rem 1.25rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.hover};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: ${props => props.theme.shadows.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableWrapper = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.surface};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.hover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.hover};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ActionsCell = styled(TableCell)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.125rem;
`;

const ColorBadge = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.$color || '#3B82F6'};
  border: 2px solid ${props => props.theme.colors.border};
  display: inline-block;
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled(Card)`
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%);
    color: ${props.theme.colors.text};
  ` : `
    background: ${props.theme.colors.surface};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

type Category = {
  id: number;
  name: string;
  type: 'expense' | 'revenue';
  color: string;
  icon: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
};

type CategoriesViewProps = {
  onRefresh?: () => void;
};

export const CategoriesView: FC<CategoriesViewProps> = ({ onRefresh }) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'revenue'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'expense' | 'revenue',
    color: '#3B82F6',
    icon: '',
  });

  useEffect(() => {
    fetchCategories();
  }, [typeFilter]);

  const fetchCategories = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const url = typeFilter === 'all' 
        ? 'http://localhost:4000/api/financial/categories'
        : `http://localhost:4000/api/financial/categories?type=${typeFilter}`;
      
      const res = await fetch(url, {
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:4000/api/financial/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchCategories();
        onRefresh?.();
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao deletar categoria');
      }
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      alert('Erro ao deletar categoria');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color || '#3B82F6',
      icon: category.icon || '',
    });
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'expense',
      color: '#3B82F6',
      icon: '',
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'expense',
      color: '#3B82F6',
      icon: '',
    });
  };

  const handleSave = async () => {
    if (!token) return;
    if (!formData.name.trim()) {
      alert('O nome da categoria é obrigatório');
      return;
    }

    try {
      const url = editingCategory
        ? `http://localhost:4000/api/financial/categories/${editingCategory.id}`
        : 'http://localhost:4000/api/financial/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory
        ? { name: formData.name, color: formData.color, icon: formData.icon || null }
        : { name: formData.name, type: formData.type, color: formData.color, icon: formData.icon || null };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        handleModalClose();
        fetchCategories();
        onRefresh?.();
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao salvar categoria');
      }
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria');
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'expense' ? 'Despesa' : 'Receita';
  };

  return (
    <Container>
      <HeaderCard>
        <Title>Categorias Financeiras</Title>
        <HeaderControls>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'all' | 'expense' | 'revenue')}>
            <option value="all">Todas</option>
            <option value="expense">Despesas</option>
            <option value="revenue">Receitas</option>
          </Select>
          <AddButton onClick={handleNew}>
            <FiPlus />
            Nova Categoria
          </AddButton>
        </HeaderControls>
      </HeaderCard>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : categories.length === 0 ? (
        <EmptyState>Nenhuma categoria encontrada</EmptyState>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Cor</TableHeaderCell>
                <TableHeaderCell>Nome</TableHeaderCell>
                <TableHeaderCell>Tipo</TableHeaderCell>
                <TableHeaderCell>Ícone</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <ColorBadge $color={category.color || '#3B82F6'} />
                  </TableCell>
                  <TableCell style={{ fontWeight: 500 }}>{category.name}</TableCell>
                  <TableCell>{getTypeLabel(category.type)}</TableCell>
                  <TableCell>{category.icon || '-'}</TableCell>
                  <ActionsCell>
                    <ActionButton onClick={() => handleEdit(category)} title="Editar">
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(category.id)} title="Excluir">
                      <FiTrash2 />
                    </ActionButton>
                  </ActionsCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      <ModalOverlay $isOpen={modalOpen} onClick={handleModalClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </ModalTitle>
            <CloseButton onClick={handleModalClose}>×</CloseButton>
          </ModalHeader>

          <FormGroup>
            <Label>Nome da Categoria</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Alimentação"
            />
          </FormGroup>

          {!editingCategory && (
            <FormGroup>
              <Label>Tipo</Label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'expense' | 'revenue' })}
              >
                <option value="expense">Despesa</option>
                <option value="revenue">Receita</option>
              </Select>
            </FormGroup>
          )}

          <FormGroup>
            <Label>Cor</Label>
            <Input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Ícone (opcional)</Label>
            <Input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Ex: 🍔"
            />
          </FormGroup>

          <ModalActions>
            <Button $variant="secondary" onClick={handleModalClose}>
              Cancelar
            </Button>
            <Button $variant="primary" onClick={handleSave}>
              Salvar
            </Button>
          </ModalActions>
        </Modal>
      </ModalOverlay>
    </Container>
  );
};
