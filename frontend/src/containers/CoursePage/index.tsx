import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '../../components/Header';
import { Rodape } from '../../components/Rodape';
import { MainContent } from '../../components/MainContent';
import { CourseBanner } from '../../components/CourseBanner';
import { AnimatedPage } from '../../components/AnimatedPage';
import { useCourseProgress } from '../../hooks/useCourseProgress';
import { useAuth } from '../../context/AuthContext';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { Modal } from '../../components/Modal';

const Page = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
`;

// Seção de conteúdo padronizada
const ContentSection = styled.section`
  width: 100%;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const ContainerContent = styled.div`
  width: 80%;
  max-width: 1700px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const MainContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SidebarArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: ${(p) => p.theme.colors.accentCyan};
  text-transform: uppercase;
`;

const CourseDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 24px;
`;


const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: ${(p) => p.theme.colors.accentCyan};
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const InfoValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const AccessCourseButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, #00cccc 100%);
  border: none;
  color: #000;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 24px;
  box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 255, 0.4);
    background: linear-gradient(135deg, #00ffff 0%, #00e6e6 100%);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AdminButtonsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  width: 100%;
`;

const EditButton = styled.button`
  flex: 1;
  background: transparent;
  border: 2px solid #ffa500;
  color: #ffa500;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #ffa500;
    color: #000;
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  background: transparent;
  border: 2px solid #ff4444;
  color: #ff4444;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #ff4444;
    color: #fff;
    transform: translateY(-2px);
  }
`;

// Modal styles (copiados da CourseControlPage)
const ConfirmationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
`;

const ConfirmationModal = styled.div`
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const ConfirmationTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 16px;
`;

const ConfirmationMessage = styled.p`
  font-size: 1rem;
  color: #aaa;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const ConfirmButton = styled.button`
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 71, 87, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelConfirmButton = styled.button`
  background: #333;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #444;
  }
`;

// Edit modal styles (simplificados da CourseControlPage)
const EditModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormSectionTitle = styled.h3`
  color: ${(p) => p.theme.colors.accentCyan};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const FormLabel = styled.label`
  color: ${(p) => p.theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: ${(p) => p.theme.colors.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accentCyan};
  }
`;

const FormTextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: ${(p) => p.theme.colors.text};
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accentCyan};
  }
`;

const FormSelect = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: ${(p) => p.theme.colors.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accentCyan};
  }
  
  option {
    background: #111;
    color: ${(p) => p.theme.colors.text};
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, #00cccc 100%);
  border: none;
  color: #000;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${(p) => p.theme.colors.text};
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModuleCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${(p) => p.theme.colors.accentCyan};
    transform: translateY(-2px);
  }
`;

const ModuleTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: ${(p) => p.theme.colors.text};
`;

const ModuleDescription = styled.p`
  font-size: 0.95rem;
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: 1.5;
`;

const EmptyModulesMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: 1rem;
  font-style: italic;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin: 16px 0;
`;

interface Course {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  type?: 'modulo_essencial' | 'trilha_especializacao';
  segment: 'infraestrutura' | 'desenvolvimento' | 'dados';
  level: 'fundamentos' | 'intermediario' | 'avancado';
  provider?: 'aws' | 'azure' | 'gcp';
  duration?: string;
  banner_path?: string;
  modules?: Array<{
    id: number;
    title: string;
    description?: string;
  }>;
}

export function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { progress } = useCourseProgress(id || '');
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form states para edição
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'modulo_essencial' | 'trilha_especializacao'>('modulo_essencial');
  const [segment, setSegment] = useState<'infraestrutura' | 'desenvolvimento' | 'dados'>('infraestrutura');
  const [level, setLevel] = useState<'fundamentos' | 'intermediario' | 'avancado'>('fundamentos');
  const [provider, setProvider] = useState<'aws' | 'azure' | 'gcp'>('aws');
  const [duration, setDuration] = useState('');

  const handleAccessCourse = () => {
    if (id) {
      navigate(`/curso/${id}/conteudo`);
    }
  };

  const handleEditCourse = () => {
    if (!course) return;
    
    // Preencher o formulário com os dados do curso
    setTitle(course.title);
    setSubtitle(course.subtitle || '');
    setDescription(course.description);
    setType(course.type || 'modulo_essencial');
    setSegment(course.segment);
    setLevel(course.level);
    setProvider(course.provider || 'aws');
    setDuration(course.duration || '');
    
    setIsEditModalOpen(true);
  };

  const handleDeleteCourse = () => {
    if (!course) return;
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!id) return;
    
    try {
      const response = await fetch(`http://localhost:4000/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Curso deletado com sucesso!');
        navigate('/cursos');
      } else {
        alert('Erro ao deletar o curso. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      alert('Erro ao deletar o curso. Tente novamente.');
    }
    
    setShowConfirmation(false);
  };

  const handleSaveEdit = async () => {
    if (!id) return;
    
    setSaving(true);
    try {
      const payload = {
        title,
        subtitle,
        description,
        type,
        segment,
        level,
        provider,
        duration
      };
      
      const response = await fetch(`http://localhost:4000/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        alert('Curso atualizado com sucesso!');
        setIsEditModalOpen(false);
        // Recarregar os dados do curso
        fetchCourse();
      } else {
        const errorData = await response.text();
        alert(`Erro ao atualizar o curso: ${errorData}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      alert('Erro ao atualizar o curso. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const fetchCourse = async () => {
    if (!id) return;
    
      try {
        setLoading(true);
      const response = await fetch(`http://localhost:4000/courses/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      } else {
        console.error('Erro ao buscar curso');
      }
    } catch (error) {
      console.error('Erro ao buscar curso:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const formatCourseMeta = (course: Course) => ({
    segment: course.segment?.charAt(0).toUpperCase() + course.segment?.slice(1),
    level: course.level?.charAt(0).toUpperCase() + course.level?.slice(1),
    provider: course.provider?.toUpperCase(),
    duration: course.duration
  });

  if (loading) {
    return (
      <AnimatedPage>
      <Page>
        <Header />
          <MainContent>
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <p>Carregando curso...</p>
            </div>
          </MainContent>
          <Rodape />
      </Page>
      </AnimatedPage>
    );
  }

  if (!course) {
    return (
      <AnimatedPage>
      <Page>
        <Header />
          <MainContent>
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <p>Curso não encontrado</p>
            </div>
          </MainContent>
          <Rodape />
      </Page>
      </AnimatedPage>
    );
  }

  const bannerImage = course.banner_path 
    ? `http://localhost:4000${course.banner_path}` 
    : undefined;

  return (
    <AnimatedPage>
    <Page>
      <Header />
        <MainContent>
          <CourseBanner
            title={course.title}
            subtitle={course.subtitle}
            bannerImage={bannerImage}
            progress={progress}
            meta={formatCourseMeta(course)}
          />
          
          <ContentSection>
            <ContainerContent>
              <ContentGrid>
                <MainContentArea>
                  <SectionCard>
                    <SectionTitle>Descrição do Curso</SectionTitle>
                    <CourseDescription>
                      {course.description}
                    </CourseDescription>
                  </SectionCard>

                  <SectionCard>
                    <SectionTitle>Módulos do Curso</SectionTitle>
                    {course.modules && course.modules.length > 0 ? (
                      course.modules.map((module) => (
                        <ModuleCard key={module.id}>
                          <ModuleTitle>{module.title}</ModuleTitle>
                          {module.description && (
                            <ModuleDescription>{module.description}</ModuleDescription>
                          )}
                        </ModuleCard>
                      ))
                    ) : (
                      <EmptyModulesMessage>
                        Os módulos do curso aparecerão aqui
                      </EmptyModulesMessage>
                    )}
                  </SectionCard>
                </MainContentArea>

                <SidebarArea>
                  <InfoCard>
                    <InfoTitle>Informações do Curso</InfoTitle>
                    <InfoItem>
                      <InfoLabel>Segmento</InfoLabel>
                      <InfoValue>{formatCourseMeta(course).segment}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Nível</InfoLabel>
                      <InfoValue>{formatCourseMeta(course).level}</InfoValue>
                    </InfoItem>
                    {course.provider && (
                      <InfoItem>
                        <InfoLabel>Provedor</InfoLabel>
                        <InfoValue>{formatCourseMeta(course).provider}</InfoValue>
                      </InfoItem>
                    )}
                    {course.duration && (
                      <InfoItem>
                        <InfoLabel>Duração</InfoLabel>
                        <InfoValue>{course.duration}</InfoValue>
                      </InfoItem>
                    )}
                    <AccessCourseButton onClick={handleAccessCourse}>
                      🚀 Acessar o Curso
                    </AccessCourseButton>
                    
                    {(user?.role === 'professor' || user?.role === 'admin') && (
                      <AdminButtonsContainer>
                        <EditButton onClick={handleEditCourse}>
                          <FiEdit3 size={16} />
                          Editar
                        </EditButton>
                        <DeleteButton onClick={handleDeleteCourse}>
                          <FiTrash2 size={16} />
                          Deletar
                        </DeleteButton>
                      </AdminButtonsContainer>
                    )}
                  </InfoCard>
                </SidebarArea>
              </ContentGrid>
            </ContainerContent>
          </ContentSection>
        </MainContent>
        <Rodape />
    </Page>

      {/* Modal de Edição */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="✏️ Editar Curso"
      >
        <EditModalContent>
          <FormSection>
            <FormSectionTitle>Informações Básicas</FormSectionTitle>
            <FormRow>
              <FormColumn>
                <FormLabel>Título do Curso</FormLabel>
                <FormInput
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título do curso"
                />
              </FormColumn>
              <FormColumn>
                <FormLabel>Subtítulo</FormLabel>
                <FormInput
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Digite o subtítulo do curso"
                />
              </FormColumn>
            </FormRow>
            
            <FormColumn>
              <FormLabel>Descrição</FormLabel>
              <FormTextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição do curso"
              />
            </FormColumn>
          </FormSection>

          <FormSection>
            <FormSectionTitle>Configurações</FormSectionTitle>
            <FormRow>
              <FormColumn>
                <FormLabel>Tipo</FormLabel>
                <FormSelect
                  value={type}
                  onChange={(e) => setType(e.target.value as 'modulo_essencial' | 'trilha_especializacao')}
                >
                  <option value="modulo_essencial">Módulo Essencial</option>
                  <option value="trilha_especializacao">Trilha de Especialização</option>
                </FormSelect>
              </FormColumn>
              <FormColumn>
                <FormLabel>Segmento</FormLabel>
                <FormSelect
                  value={segment}
                  onChange={(e) => setSegment(e.target.value as 'infraestrutura' | 'desenvolvimento' | 'dados')}
                >
                  <option value="infraestrutura">Infraestrutura</option>
                  <option value="desenvolvimento">Desenvolvimento</option>
                  <option value="dados">Ciência de Dados</option>
                </FormSelect>
              </FormColumn>
            </FormRow>
            
            <FormRow>
              <FormColumn>
                <FormLabel>Nível</FormLabel>
                <FormSelect
                  value={level}
                  onChange={(e) => setLevel(e.target.value as 'fundamentos' | 'intermediario' | 'avancado')}
                >
                  <option value="fundamentos">Fundamentos</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </FormSelect>
              </FormColumn>
              <FormColumn>
                <FormLabel>Provedor</FormLabel>
                <FormSelect
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as 'aws' | 'azure' | 'gcp')}
                >
                  <option value="aws">AWS</option>
                  <option value="azure">Azure</option>
                  <option value="gcp">Google Cloud</option>
                </FormSelect>
              </FormColumn>
            </FormRow>
            
            <FormColumn>
              <FormLabel>Duração</FormLabel>
              <FormInput
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 40 horas"
              />
            </FormColumn>
          </FormSection>

          <ButtonGroup>
            <CancelButton onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </CancelButton>
            <SaveButton onClick={handleSaveEdit} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </SaveButton>
          </ButtonGroup>
        </EditModalContent>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      {showConfirmation && (
        <ConfirmationOverlay onClick={() => setShowConfirmation(false)}>
          <ConfirmationModal onClick={(e) => e.stopPropagation()}>
            <ConfirmationTitle>Confirmar Exclusão</ConfirmationTitle>
            <ConfirmationMessage>
              Tem certeza que deseja deletar o curso "{course?.title}"? Esta ação não pode ser desfeita e todos os dados relacionados ao curso serão perdidos permanentemente.
            </ConfirmationMessage>
            <ConfirmationButtons>
              <CancelConfirmButton onClick={() => setShowConfirmation(false)}>
                Cancelar
              </CancelConfirmButton>
              <ConfirmButton onClick={confirmDelete}>
                Sim, Deletar
              </ConfirmButton>
            </ConfirmationButtons>
          </ConfirmationModal>
        </ConfirmationOverlay>
      )}
    </AnimatedPage>
  );
}