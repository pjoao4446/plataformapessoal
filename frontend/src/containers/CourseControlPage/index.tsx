import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '../../components/Header';
import { Rodape } from '../../components/Rodape';
import { Modal } from '../../components/Modal';
import { MainContent } from '../../components/MainContent';
import { AnimatedPage } from '../../components/AnimatedPage';
import { PageBannerWithEditor } from '../../components/PageBannerWithEditor';
import { useAuth } from '../../context/AuthContext';
import heroBg from '../../assets/images/backgroundtelainicio4.png';

const Page = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
`;

const ContentSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Banner = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #24053be1 70%, #1b042c7a) 70%, url(${heroBg});
  background-position: center; 
  height: 440px;
  width: 100%;
  box-shadow: 0px 0px 5px rgba(124, 49, 147, 0.42);
  z-index: 5;
`;

const ContainerContentRow = styled.section`
  width: 80%;
  max-width: 1700px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ContainerContentLeft = styled.section`
  width: auto;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ContainerContentRight = styled.section`
  width: auto;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BannerTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  
  span {
    color: ${(p) => p.theme.colors.accentCyan};
  }
`;

const BannerSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #ccc;
  margin-bottom: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const ContainerContent = styled.div`
  width: 80%;
  max-width: 1700px;
  margin: 0 auto;
  padding: 40px 0;
`;

const ControlSection = styled.div`
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 24px;
  color: #fff;
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, #00cccc 100%);
  border: none;
  color: #000;
  font-weight: bold;
  border-radius: 8px;
  padding: 16px 32px;
  margin-bottom: 24px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 255, 255, 0.3);
  }
`;

const SearchFilterSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${(p) => p.theme.colors.text};
  border-radius: 8px;
  padding: 12px 16px;
  flex: 1;
  min-width: 200px;
  
  &::placeholder {
    color: #666;
  }
`;

const FilterSelect = styled.select`
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${(p) => p.theme.colors.text};
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 150px;
`;

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CourseCard = styled.div<{ $courseType: 'modulo_essencial' | 'trilha_especializacao' }>`
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0;
  display: flex;
  gap: 0;
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 200px;
  
  &:hover {
    border-color: rgba(0, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const CourseThumbnail = styled.img<{ $courseType: 'modulo_essencial' | 'trilha_especializacao' }>`
  width: ${props => props.$courseType === 'modulo_essencial' ? '250px' : '120px'};
  height: ${props => props.$courseType === 'modulo_essencial' ? '200px' : '120px'};
  object-fit: ${props => props.$courseType === 'modulo_essencial' ? 'cover' : 'contain'};
  border-radius: ${props => props.$courseType === 'modulo_essencial' ? '12px 0 0 12px' : '8px'};
  background: ${props => props.$courseType === 'modulo_essencial' ? '#333' : 'transparent'};
  padding: ${props => props.$courseType === 'trilha_especializacao' ? '8px' : '0'};
  flex-shrink: 0;
`;

const ThumbnailContainer = styled.div<{ $courseType: 'modulo_essencial' | 'trilha_especializacao' }>`
  width: ${props => props.$courseType === 'trilha_especializacao' ? '250px' : 'auto'};
  height: ${props => props.$courseType === 'trilha_especializacao' ? '200px' : 'auto'};
  background: ${props => props.$courseType === 'trilha_especializacao' ? '#333' : 'transparent'};
  border-radius: ${props => props.$courseType === 'trilha_especializacao' ? '12px 0 0 12px' : '0'};
  display: ${props => props.$courseType === 'trilha_especializacao' ? 'flex' : 'contents'};
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CourseInfo = styled.div<{ $courseType: 'modulo_essencial' | 'trilha_especializacao' }>`
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CourseTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 8px;
  color: ${(p) => p.theme.colors.accentCyan};
`;

const CourseDescription = styled.p`
  color: #aaa;
  margin-bottom: 12px;
  line-height: 1.5;
`;

const CourseMeta = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const MetaTag = styled.span`
  background: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #ccc;
`;

const CourseActions = styled.div<{ $courseType: 'modulo_essencial' | 'trilha_especializacao' }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 24px 24px 0;
  justify-content: center;
  min-width: 140px;
`;

const EditButton = styled.button`
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  }
`;

const DeleteButton = styled.button`
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const AccessButton = styled.button`
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, #00cccc 100%);
  border: none;
  color: #000;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 255, 255, 0.4);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #aaa;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ff6b6b;
`;

// Modal Form Styles
const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${(p) => p.theme.colors.accentCyan}, ${(p) => p.theme.colors.primary});
    border-radius: 12px 12px 0 0;
  }
`;

const FormSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.accentCyan};
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 180px;
`;

const FormInput = styled.input`
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${(p) => p.theme.colors.text};
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accentCyan};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.accentCyan}20;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const FormTextArea = styled.textarea`
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${(p) => p.theme.colors.text};
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 0.95rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.4;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accentCyan};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.accentCyan}20;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const FormSelect = styled.select`
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${(p) => p.theme.colors.text};
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accentCyan};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.accentCyan}20;
  }
  
  option {
    background: #1a1a1a;
    color: ${(p) => p.theme.colors.text};
  }
`;

const FormLabel = styled.label`
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const ImageUploadArea = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &:hover {
    border-color: ${(p) => p.theme.colors.accentCyan}60;
    background: rgba(0, 255, 255, 0.05);
  }
  
  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

const UploadIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 6px;
  color: ${(p) => p.theme.colors.accentCyan};
`;

const UploadText = styled.p`
  color: #ccc;
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.3;
`;


const PreviewImage = styled.img`
  max-width: 150px;
  max-height: 90px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, #00cccc 100%);
  border: none;
  color: #000;
  font-weight: bold;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  background: #333;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #444;
  }
`;

// Modal de Confirmação
const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const ConfirmationContent = styled.div`
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

type Course = {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image_path?: string | null;
  type: 'modulo_essencial' | 'trilha_especializacao';
  segment: 'infraestrutura' | 'desenvolvimento' | 'dados';
  level: 'fundamentos' | 'intermediario' | 'avancado';
  provider?: 'aws' | 'azure' | 'gcp' | null;
  created_at: string;
};

type QuizDraft = { question: string; options: string[]; correct_option_index: number };
type LessonDraft = { title: string; video_url?: string; summary?: string; quizzes: QuizDraft[] };
type ModuleDraft = { title: string; lessons: LessonDraft[] };

export function CourseControlPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSegment, setFilterSegment] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Confirmation modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'modulo_essencial' | 'trilha_especializacao'>('modulo_essencial');
  const [segment, setSegment] = useState<'infraestrutura' | 'desenvolvimento' | 'dados'>('infraestrutura');
  const [level, setLevel] = useState<'fundamentos' | 'intermediario' | 'avancado'>('fundamentos');
  const [provider, setProvider] = useState<'aws' | 'azure' | 'gcp'>('aws');
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [bannerPath, setBannerPath] = useState<string | null>(null);
  const [duration, setDuration] = useState('');
  const [modules, setModules] = useState<ModuleDraft[]>([]);

  useEffect(() => {
    // Verificar se o usuário tem permissão para acessar esta página
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'professor' && user.role !== 'admin') {
      navigate('/'); // Redirecionar para home se não tiver permissão
      return;
    }
    
    loadCourses();
  }, [user, navigate]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/courses');
      const data = await res.json();
      setCourses(data);
    } catch (e) {
      setError('Falha ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || course.type === filterType;
    const matchesSegment = filterSegment === 'all' || course.segment === filterSegment;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    const matchesProvider = filterProvider === 'all' || course.provider === filterProvider;
    
    return matchesSearch && matchesType && matchesSegment && matchesLevel && matchesProvider;
  });

  const openCreateModal = () => {
    resetForm();
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setTitle(course.title);
    setSubtitle(course.subtitle || '');
    setDescription(course.description || '');
    setType(course.type);
    setSegment(course.segment);
    setLevel(course.level);
    setProvider(course.provider || 'aws');
    setImagePath(course.image_path || null);
    setModules([]); // Por enquanto, não carregamos módulos na edição
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setDescription('');
    setType('modulo_essencial');
    setSegment('infraestrutura');
    setLevel('fundamentos');
    setProvider('aws');
    setImagePath(null);
    setBannerPath(null);
    setDuration('');
    setModules([]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    resetForm();
  };

  const showConfirmationModal = (title: string, message: string, onConfirm: () => void) => {
    setConfirmationData({ title, message, onConfirm });
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (confirmationData) {
      confirmationData.onConfirm();
    }
    setShowConfirmation(false);
    setConfirmationData(null);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationData(null);
  };


  const handleImageUpload = async (file: File, type: 'thumbnail' | 'banner') => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('http://localhost:4000/uploads/image', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      
      const data = await res.json();
      if (res.ok) {
        if (type === 'thumbnail') {
          setImagePath(data.path);
        } else {
          setBannerPath(data.path);
        }
      } else {
        alert(data.error || 'Falha no upload');
      }
    } catch (error) {
      alert('Erro no upload da imagem');
    }
  };

  const handleSave = async () => {
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
        image_path: imagePath,
        banner_path: bannerPath,
        duration,
        modules 
      };
      
      const url = editingCourse 
        ? `http://localhost:4000/courses/${editingCourse.id}`
        : 'http://localhost:4000/builder/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          ...(token ? { Authorization: `Bearer ${token}` } : {}) 
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error('Falha ao salvar');
      
      await loadCourses();
      closeModal();
    } catch (e) {
      alert('Erro ao salvar curso');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    const courseTitle = course ? course.title : 'este curso';
    
    showConfirmationModal(
      'Confirmar Exclusão',
      `Tem certeza que deseja deletar "${courseTitle}"? Esta ação não pode ser desfeita e todos os dados relacionados ao curso serão perdidos permanentemente.`,
      async () => {
        try {
          const response = await fetch(`http://localhost:4000/courses/${courseId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            await loadCourses();
          } else {
            alert('Erro ao deletar curso. Tente novamente.');
          }
        } catch (error) {
          alert('Erro ao deletar curso. Tente novamente.');
        }
      }
    );
  };

  const handleAccessCourse = (courseId: number) => {
    navigate(`/curso/${courseId}`);
  };

  const canManageCourses = user && (user.role === 'professor' || user.role === 'admin');

  return (
    <AnimatedPage>
      <Page>
        <Header />
        <MainContent>
        <PageBannerWithEditor pageId="courses">
          <ContainerContentLeft>
            <BannerTitle>CONTROLE DE <span>CURSOS</span></BannerTitle>
            <BannerSubtitle>GERENCIE TODOS OS CURSOS DA PLATAFORMA</BannerSubtitle>
          </ContainerContentLeft>
          <ContainerContentRight>
            {/* Espaço para futuras funcionalidades */}
          </ContainerContentRight>
        </PageBannerWithEditor>

        <ContentSection>
          <ContainerContent>

        <ControlSection>
          <SectionTitle>Gerenciamento de Cursos</SectionTitle>
          
          {canManageCourses && (
            <CreateButton onClick={openCreateModal}>
              ➕ Criar Novo Curso
            </CreateButton>
          )}

          <SearchFilterSection>
            <SearchInput
              placeholder="Pesquisar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <FilterSelect value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">Todos os Tipos</option>
              <option value="modulo_essencial">Módulo Essencial</option>
              <option value="trilha_especializacao">Trilha de Especialização</option>
            </FilterSelect>
            
            <FilterSelect value={filterSegment} onChange={(e) => setFilterSegment(e.target.value)}>
              <option value="all">Todos os Segmentos</option>
              <option value="infraestrutura">Infraestrutura</option>
              <option value="desenvolvimento">Desenvolvimento</option>
              <option value="dados">Ciência de Dados</option>
            </FilterSelect>
            
            <FilterSelect value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="all">Todos os Níveis</option>
              <option value="fundamentos">Fundamentos</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </FilterSelect>
            
            <FilterSelect value={filterProvider} onChange={(e) => setFilterProvider(e.target.value)}>
              <option value="all">Todos os Provedores</option>
              <option value="aws">AWS</option>
              <option value="azure">Azure</option>
              <option value="gcp">GCP</option>
            </FilterSelect>
          </SearchFilterSection>

          {loading && <LoadingMessage>Carregando cursos...</LoadingMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {!loading && !error && (
            <CourseList>
              {filteredCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
                  Nenhum curso encontrado com os filtros aplicados.
                </div>
              ) : (
                filteredCourses.map((course) => (
                  <CourseCard key={course.id} $courseType={course.type}>
                    <ThumbnailContainer $courseType={course.type}>
                      <CourseThumbnail 
                        $courseType={course.type}
                        src={course.image_path ? `http://localhost:4000${course.image_path}` : '/placeholder-course.jpg'}
                        alt={course.title}
                      />
                    </ThumbnailContainer>
                    <CourseInfo $courseType={course.type}>
                      <CourseTitle>{course.title}</CourseTitle>
                      {course.subtitle && <p style={{ color: '#888', marginBottom: '12px', fontSize: '1.1rem' }}>{course.subtitle}</p>}
                      <CourseMeta>
                        <MetaTag>
                          {course.type === 'modulo_essencial' ? 'Módulo Essencial' : 'Trilha de Especialização'}
                        </MetaTag>
                        <MetaTag>{course.segment.charAt(0).toUpperCase() + course.segment.slice(1)}</MetaTag>
                        <MetaTag>{course.level.charAt(0).toUpperCase() + course.level.slice(1)}</MetaTag>
                        {course.provider && <MetaTag>{course.provider.toUpperCase()}</MetaTag>}
                      </CourseMeta>
                    </CourseInfo>
                    <CourseActions $courseType={course.type}>
                      <AccessButton onClick={() => handleAccessCourse(course.id)}>
                        👁️ Acessar o Curso
                      </AccessButton>
                      {canManageCourses && (
                        <>
                          <EditButton onClick={() => openEditModal(course)}>
                            ✏️ Editar
                          </EditButton>
                          <DeleteButton onClick={() => handleDelete(course.id)}>
                            🗑️ Deletar
                          </DeleteButton>
                        </>
                      )}
                    </CourseActions>
                  </CourseCard>
                ))
              )}
            </CourseList>
          )}
        </ControlSection>
          </ContainerContent>
        </ContentSection>
      </MainContent>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCourse ? '✏️ Editar Curso' : '🚀 Criar Novo Curso'}>
          <ModalForm onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            
            {/* Seção: Informações Básicas */}
            <FormSection>
              <FormSectionTitle>📋 Informações Básicas</FormSectionTitle>
              
              <FormRow>
                <FormColumn style={{ flex: 2 }}>
                  <FormLabel>Título do Curso</FormLabel>
                  <FormInput
                    placeholder="Ex: Fundamentos de AWS Cloud"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </FormColumn>
                
                <FormColumn>
                  <FormLabel>Subtítulo</FormLabel>
                  <FormInput
                    placeholder="Ex: Do básico ao avançado"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </FormColumn>
                
                <FormColumn>
                  <FormLabel>Duração Estimada</FormLabel>
                  <FormInput
                    placeholder="Ex: 40 horas"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </FormColumn>
              </FormRow>
              
              <FormRow>
                <FormColumn>
                  <FormLabel>Descrição Completa</FormLabel>
                  <FormTextArea
                    placeholder="Descreva detalhadamente o que o aluno aprenderá neste curso, os pré-requisitos e os objetivos de aprendizagem..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormColumn>
              </FormRow>
            </FormSection>

            {/* Seção: Categorização */}
            <FormSection>
              <FormSectionTitle>🏷️ Categorização</FormSectionTitle>
              
              <FormRow>
                <FormColumn>
                  <FormLabel>Tipo de Curso</FormLabel>
                  <FormSelect value={type} onChange={(e: any) => setType(e.target.value)}>
                    <option value="modulo_essencial">📚 Módulo Essencial</option>
                    <option value="trilha_especializacao">🎯 Trilha de Especialização</option>
                  </FormSelect>
                </FormColumn>
                
                <FormColumn>
                  <FormLabel>Segmento</FormLabel>
                  <FormSelect value={segment} onChange={(e: any) => setSegment(e.target.value)}>
                    <option value="infraestrutura">🏗️ Infraestrutura</option>
                    <option value="desenvolvimento">💻 Desenvolvimento</option>
                    <option value="dados">📊 Ciência de Dados</option>
                  </FormSelect>
                </FormColumn>
                
                <FormColumn>
                  <FormLabel>Nível de Dificuldade</FormLabel>
                  <FormSelect value={level} onChange={(e: any) => setLevel(e.target.value)}>
                    <option value="fundamentos">🌱 Fundamentos</option>
                    <option value="intermediario">⚡ Intermediário</option>
                    <option value="avancado">🚀 Avançado</option>
                  </FormSelect>
                </FormColumn>
                
                {type === 'trilha_especializacao' && (
                  <FormColumn>
                    <FormLabel>Provedor Cloud</FormLabel>
                    <FormSelect value={provider} onChange={(e: any) => setProvider(e.target.value)}>
                      <option value="aws">☁️ Amazon Web Services</option>
                      <option value="azure">🔷 Microsoft Azure</option>
                      <option value="gcp">🌐 Google Cloud Platform</option>
                    </FormSelect>
                  </FormColumn>
                )}
              </FormRow>
            </FormSection>


            {/* Seção: Imagens */}
            <FormSection>
              <FormSectionTitle>🖼️ Imagens do Curso</FormSectionTitle>
              
              <FormRow>
                <FormColumn>
                  <FormLabel>Imagem de Miniatura (Cards)</FormLabel>
                  <ImageUploadArea>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'thumbnail');
                      }}
                    />
                    <UploadIcon>🖼️</UploadIcon>
                    <UploadText>
                      Clique para enviar a miniatura<br />
                      <small>Recomendado: 400x250px, formato JPG/PNG</small>
                    </UploadText>
                    {imagePath && (
                      <PreviewImage 
                        src={`http://localhost:4000${imagePath}`} 
                        alt="Preview miniatura" 
                      />
                    )}
                  </ImageUploadArea>
                </FormColumn>
                
                <FormColumn>
                  <FormLabel>Banner do Curso (Página)</FormLabel>
                  <ImageUploadArea>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'banner');
                      }}
                    />
                    <UploadIcon>🎨</UploadIcon>
                    <UploadText>
                      Clique para enviar o banner<br />
                      <small>Recomendado: 1200x400px, formato JPG/PNG</small>
                    </UploadText>
                    {bannerPath && (
                      <PreviewImage 
                        src={`http://localhost:4000${bannerPath}`} 
                        alt="Preview banner" 
                      />
                    )}
                  </ImageUploadArea>
                </FormColumn>
              </FormRow>
            </FormSection>
            
            <ModalActions>
              <CancelButton type="button" onClick={closeModal}>
                ❌ Cancelar
              </CancelButton>
              <SaveButton type="submit" disabled={saving}>
                {saving ? '⏳ Salvando...' : editingCourse ? '💾 Atualizar Curso' : '🚀 Criar Curso'}
              </SaveButton>
            </ModalActions>
          </ModalForm>
        </Modal>

        {/* Modal de Confirmação */}
        {showConfirmation && confirmationData && (
          <ConfirmationModal onClick={handleCancelConfirmation}>
            <ConfirmationContent onClick={(e) => e.stopPropagation()}>
              <ConfirmationTitle>{confirmationData.title}</ConfirmationTitle>
              <ConfirmationMessage>{confirmationData.message}</ConfirmationMessage>
              <ConfirmationButtons>
                <CancelConfirmButton onClick={handleCancelConfirmation}>
                  Cancelar
                </CancelConfirmButton>
                <ConfirmButton onClick={handleConfirm} disabled={saving}>
                  {saving ? 'Processando...' : 'Confirmar Exclusão'}
                </ConfirmButton>
              </ConfirmationButtons>
            </ConfirmationContent>
          </ConfirmationModal>
        )}
      
        <Rodape />
      </Page>
    </AnimatedPage>
  );
}
