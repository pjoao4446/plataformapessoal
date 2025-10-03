import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '../../components/Header';
import { Rodape } from '../../components/Rodape';
import { MainContent } from '../../components/MainContent';
import { AnimatedPage } from '../../components/AnimatedPage';
import { Modal } from '../../components/Modal';
import { ProgressBar } from '../../components/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiVideo, FiFileText, FiCheck, FiX } from 'react-icons/fi';

const Page = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
  display: flex;
  flex-direction: column;
`;

// Banner do curso

// Seção de conteúdo principal
const ContentSection = styled.section`
  width: 100%;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  flex: 1;
`;

const ContainerContent = styled.div`
  width: 80%;
  max-width: 1700px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const MainContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SidebarArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Botão adicionar módulo
const AddModuleButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, #00cccc 100%);
  border: none;
  color: #000;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 255, 255, 0.4);
  }
`;

// Área de conteúdo principal
const ContentArea = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: none;
  border-radius: 16px;
  padding: 0;
  min-height: 400px;
`;

const ContentTitle = styled.h2`
  font-size: 1.8rem;
  color: ${(p) => p.theme.colors.text};
  margin: 0;
  padding: 24px 24px 16px 24px;
  font-weight: 600;
`;

const ContentText = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.textSecondary};
  padding: 24px;
`;

const VideoContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 400px;
  border-radius: 8px;
  background: #000;
`;

// Sidebar - Menu de módulos
const ModulesMenu = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
`;

const ModulesTitle = styled.h3`
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 1rem;
`;

const ModulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModuleItem = styled.div`
  margin-bottom: 8px;
`;

const ModuleHeader = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(p) => p.$isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent'};
  border: 1px solid ${(p) => p.$isActive ? 'rgba(0, 255, 255, 0.3)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ModuleHeaderLeft = styled.div`
  flex: 1;
`;

const ModuleItemTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 4px;
`;

const ModuleItemMeta = styled.div`
  font-size: 0.8rem;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const AddTopicButton = styled.button`
    background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: ${(p) => p.theme.colors.accentCyan};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const TopicsList = styled.div`
  margin-left: 16px;
  margin-top: 8px;
`;

const TopicItem = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(p) => p.$isActive ? 'rgba(0, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${(p) => p.$isActive ? 'rgba(0, 255, 255, 0.4)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const TopicTitle = styled.div`
  font-size: 0.85rem;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const TopicInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 6px;
  padding: 8px 12px;
  color: ${(p) => p.theme.colors.text};
  font-size: 0.85rem;
  width: 100%;
  margin-bottom: 4px;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accentCyan};
  }
`;

const TopicInputActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

const TopicActionButton = styled.button<{ $variant: 'save' | 'cancel' }>`
  background: ${(p) => p.$variant === 'save' ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${(p) => p.$variant === 'save' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${(p) => p.$variant === 'save' ? p.theme.colors.accentCyan : p.theme.colors.textSecondary};
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(p) => p.$variant === 'save' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const EmptyModulesMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(p) => p.theme.colors.textSecondary};
  font-style: italic;
`;

const EmptyContentMessage = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const ContentNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  border-radius: 16px 16px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00D4FF, #0099CC, #8B5CF6);
  }
`;

const ContentNavButton = styled.button<{ $active?: boolean }>`
  padding: 14px 20px;
  border: none;
  border-radius: 0;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #00D4FF, #0099CC)' 
    : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : props.theme.colors.text};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  flex: 1;
  justify-content: center;
  
  &:first-child {
    border-radius: 16px 0 0 0;
  }
  
  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #00D4FF, #0099CC)' 
      : 'rgba(255, 255, 255, 0.08)'};
    color: #ffffff;
  }
`;

const AINavButton = styled.button<{ $active?: boolean }>`
  padding: 14px 24px;
  border: none;
  border-radius: 0 16px 0 0;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))'};
  color: ${props => props.$active ? '#ffffff' : '#E0E7FF'};
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid ${props => props.$active ? 'transparent' : 'rgba(139, 92, 246, 0.4)'};
  border-bottom: none;
  border-left: none;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$active 
      ? 'linear-gradient(90deg, #8B5CF6, #7C3AED)' 
      : 'linear-gradient(90deg, rgba(139, 92, 246, 0.6), rgba(124, 58, 237, 0.4))'};
  }
  
  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.2))'};
    color: #ffffff;
  }
`;

const VideoContent = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(0, 153, 204, 0.02));
  border-radius: 0 0 16px 16px;
  border: none;
  border-top: none;
`;

const TextContent = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-radius: 0 0 16px 16px;
  border: none;
  border-top: none;
`;

const AIContent = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(124, 58, 237, 0.03));
  border-radius: 0 0 16px 16px;
  border: none;
  border-top: none;
`;

// Modal styles
const ModalContent = styled.div`
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

const FileUploadArea = styled.div`
  border: 2px dashed rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(0, 255, 255, 0.5);
    background: rgba(0, 255, 255, 0.05);
  }
`;

const FileUploadText = styled.p`
  color: ${(p) => p.theme.colors.textSecondary};
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

// Types
interface Course {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  banner_path?: string;
}

interface Module {
  id: number;
  course_id: number;
  title: string;
  position: number;
}

interface Topic {
  id: number;
  module_id: number;
  title: string;
  position: number;
}

export function CourseContentPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // States
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [contentType, setContentType] = useState<'video' | 'text' | 'ai' | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Modal states for multiple modules
  const [modalModules, setModalModules] = useState<Module[]>([]);
  const [modalTopics, setModalTopics] = useState<Topic[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [addingTopicToModule, setAddingTopicToModule] = useState<number | null>(null);
  const [addingTopicToModalModule, setAddingTopicToModalModule] = useState<number | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  
  // Estados para upload de vídeo
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [topicVideos, setTopicVideos] = useState<{[topicId: number]: string}>({});

  // Load course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data.course);
          setModules(data.modules || []);
          setTopics(data.topics || []);
          
          // Carregar vídeos dos tópicos
          const videos: {[topicId: number]: string} = {};
          data.topics?.forEach((topic: Topic) => {
            if (topic.video_path) {
              videos[topic.id] = topic.video_path;
            }
          });
          setTopicVideos(videos);
          
          // Auto-redirect para o primeiro módulo (Bem-vindo)
          if (data.modules && data.modules.length > 0) {
            const firstModule = data.modules[0];
            setSelectedModule(firstModule);
            
            // Se o primeiro módulo tem tópicos, selecionar o primeiro tópico
            if (data.topics && data.topics.length > 0) {
              const firstModuleTopics = data.topics.filter((topic: Topic) => topic.module_id === firstModule.id);
              if (firstModuleTopics.length > 0) {
                setSelectedTopic(firstModuleTopics[0]);
                setContentType('video'); // Definir como vídeo por padrão
              }
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar curso:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Handlers
  const handleOpenModal = () => {
    setIsModalOpen(true);
    resetModal();
  };

  const resetModal = () => {
    setNewModuleTitle('');
    setModalModules([]);
    setModalTopics([]);
    setAddingTopicToModalModule(null);
    setNewTopicTitle('');
  };

  const handleAddModuleToModal = () => {
    if (!newModuleTitle.trim()) return;
    
    const newModule: Module = {
      id: Date.now() + Math.random(), // Unique ID for modal
      course_id: parseInt(id!),
      title: newModuleTitle,
      position: modalModules.length + 1
    };
    
    setModalModules([...modalModules, newModule]);
    setNewModuleTitle('');
  };

  const handleSaveAllModules = async () => {
    if (modalModules.length === 0) return;
    
    setSaving(true);
    try {
      const savedModules = [];
      const savedTopics = [];
      
      // Save each module to the database
      for (const module of modalModules) {
        const moduleResponse = await fetch('http://localhost:4000/modules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            course_id: parseInt(id!),
            title: module.title,
            position: modules.length + savedModules.length + 1
          })
        });
        
        if (!moduleResponse.ok) {
          throw new Error(`Erro ao salvar módulo: ${moduleResponse.statusText}`);
        }
        
        const savedModule = await moduleResponse.json();
        savedModules.push(savedModule);
        
        // Save topics for this module
        const moduleTopics = modalTopics.filter(topic => topic.module_id === module.id);
        for (let index = 0; index < moduleTopics.length; index++) {
          const topic = moduleTopics[index];
          const topicResponse = await fetch('http://localhost:4000/topics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              module_id: savedModule.id,
              title: topic.title,
              position: index + 1
            })
          });
          
          if (!topicResponse.ok) {
            throw new Error(`Erro ao salvar tópico: ${topicResponse.statusText}`);
          }
          
          const savedTopic = await topicResponse.json();
          savedTopics.push(savedTopic);
        }
      }
      
      // Update local state
      setModules(prev => [...prev, ...savedModules]);
      setTopics(prev => [...prev, ...savedTopics]);
      
      // Close modal and reset
      setIsModalOpen(false);
      resetModal();
      
    } catch (error) {
      console.error('Erro ao salvar módulos:', error);
      alert('Erro ao salvar módulos. Verifique o console para mais detalhes.');
    } finally {
      setSaving(false);
    }
  };

  const handleModuleClick = (module: Module) => {
    // Módulos não são clicáveis - apenas visualização
    // setSelectedModule(module);
    // setSelectedTopic(null);
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setContentType('video'); // Sempre iniciar com "Video Aula" selecionado
    // Encontrar o módulo pai
    const parentModule = modules.find(m => m.id === topic.module_id);
    if (parentModule) {
      setSelectedModule(parentModule);
    }
  };

  const handleAddTopic = (moduleId: number) => {
    setAddingTopicToModule(moduleId);
    setNewTopicTitle('');
  };

  const handleSaveTopic = async () => {
    if (!newTopicTitle.trim() || !addingTopicToModule) return;
    
    try {
      const response = await fetch('http://localhost:4000/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          module_id: addingTopicToModule,
          title: newTopicTitle,
          position: topics.filter(t => t.module_id === addingTopicToModule).length + 1
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao salvar tópico: ${response.statusText}`);
      }
      
      const newTopic = await response.json();
      setTopics([...topics, newTopic]);
      setAddingTopicToModule(null);
      setNewTopicTitle('');
    } catch (error) {
      console.error('Erro ao salvar tópico:', error);
      alert('Erro ao salvar tópico. Verifique o console para mais detalhes.');
    }
  };

  const handleCancelTopic = () => {
    setAddingTopicToModule(null);
    setNewTopicTitle('');
  };

  // Modal topic handlers
  const handleAddTopicToModalModule = (moduleId: number) => {
    setAddingTopicToModalModule(moduleId);
    setNewTopicTitle('');
  };

  const handleSaveModalTopic = () => {
    if (!newTopicTitle.trim() || !addingTopicToModalModule) return;
    
    const newTopic: Topic = {
      id: Date.now() + Math.random(),
      module_id: addingTopicToModalModule,
      title: newTopicTitle,
      position: modalTopics.filter(t => t.module_id === addingTopicToModalModule).length + 1
    };
    
    setModalTopics([...modalTopics, newTopic]);
    setAddingTopicToModalModule(null);
    setNewTopicTitle('');
  };

  const handleCancelModalTopic = () => {
    setAddingTopicToModalModule(null);
    setNewTopicTitle('');
  };

  const getModuleTopics = (moduleId: number) => {
    try {
      return topics.filter(topic => topic.module_id === moduleId);
    } catch (error) {
      console.error('Error in getModuleTopics:', error);
      return [];
    }
  };

  const getModalModuleTopics = (moduleId: number) => {
    return modalTopics.filter(topic => topic.module_id === moduleId);
  };

  // Funções para gerenciar vídeos
  const handleVideoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('📁 Arquivo selecionado:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Validar tamanho do arquivo (100MB = 100 * 1024 * 1024 bytes)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        const fileSizeMB = Math.round(file.size / (1024 * 1024));
        setUploadError(`📁 Arquivo muito grande\n\nO vídeo tem ${fileSizeMB}MB, mas o limite é 100MB.\n\nDicas para reduzir o tamanho:\n• Comprima o vídeo usando um editor\n• Reduza a qualidade/resolução\n• Use formatos como MP4 ou WebM`);
        setSelectedVideoFile(null);
        return;
      }
      
      // Validar se é um arquivo de vídeo
      if (file.type.startsWith('video/')) {
        const acceptedFormats = ['video/mp4', 'video/avi', 'video/mov', 'video/webm', 'video/x-msvideo', 'video/quicktime'];
        const isAcceptedFormat = acceptedFormats.some(format => file.type.includes(format.split('/')[1]));
        
        if (isAcceptedFormat || file.type.startsWith('video/')) {
          setSelectedVideoFile(file);
          setUploadError(null); // Limpar erro anterior
          
          // Mostrar informações do arquivo
          const fileSizeMB = Math.round(file.size / (1024 * 1024));
          console.log(`✅ Arquivo válido: ${file.name} (${fileSizeMB}MB)`);
        } else {
          setUploadError('🎬 Formato não recomendado\n\nFormatos recomendados:\n• MP4 (mais compatível)\n• WebM (menor tamanho)\n• AVI\n• MOV\n\nO arquivo será aceito, mas pode ter problemas de reprodução.');
          setSelectedVideoFile(file);
        }
      } else {
        setUploadError('🎬 Formato de arquivo inválido\n\nApenas arquivos de vídeo são permitidos.\n\nFormatos aceitos:\n• MP4, AVI, MOV, WebM, MKV\n\nSelecione um arquivo de vídeo válido.');
        setSelectedVideoFile(null);
      }
    }
  };

  const handleCloseVideoModal = () => {
    setShowVideoUpload(false);
    setSelectedVideoFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setUploadingVideo(false);
  };

  const handleVideoUpload = async () => {
    if (!selectedVideoFile || !selectedTopic) {
      console.log('❌ Arquivo ou tópico não selecionado');
      return;
    }

    console.log('📹 Iniciando upload de vídeo:', selectedVideoFile.name);
    console.log('📋 Tópico selecionado:', selectedTopic.id);
    
    // Verificar token de autenticação
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ Token de autenticação não encontrado');
      setUploadError('Você precisa estar logado para fazer upload de vídeos');
      return;
    }
    console.log('🔑 Token encontrado:', token.substring(0, 20) + '...');
    
    setUploadingVideo(true);
    setUploadProgress(0);
    setUploadError(null);
    
    // Fazer upload real diretamente
    performRealUpload(token);
  };

  const performRealUpload = async (token: string) => {
    try {
      // Pequeno progresso inicial para mostrar que algo está acontecendo
      setUploadProgress(5);
      
      const formData = new FormData();
      formData.append('video', selectedVideoFile!);
      formData.append('topicId', selectedTopic!.id.toString());

      console.log('📤 Enviando dados:', {
        fileName: selectedVideoFile!.name,
        fileSize: selectedVideoFile!.size,
        fileType: selectedVideoFile!.type,
        topicId: selectedTopic!.id
      });

      const xhr = new XMLHttpRequest();
      
      // Configurar progresso real do upload
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          // Começar de 10% e ir até 90% durante o upload
          const uploadProgress = Math.round((e.loaded / e.total) * 80) + 10;
          console.log(`📊 Progresso do upload: ${uploadProgress}%`);
          setUploadProgress(uploadProgress);
        }
      });

      // Configurar resposta
      xhr.addEventListener('load', () => {
        console.log('📥 Resposta recebida:', xhr.status, xhr.responseText);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            console.log('✅ Upload bem-sucedido:', result);
            
            // Completar o progresso em 100%
            setUploadProgress(100);
            
            // Aguardar um pouco para mostrar 100% e depois fechar
            setTimeout(() => {
              setTopicVideos(prev => ({
                ...prev,
                [selectedTopic!.id]: result.videoPath
              }));
              setShowVideoUpload(false);
              setSelectedVideoFile(null);
              setUploadProgress(0);
              setUploadingVideo(false);
            }, 500);
            
          } catch (parseError) {
            console.error('❌ Erro ao fazer parse da resposta:', parseError);
            setUploadError('Erro ao processar resposta do servidor');
            setUploadingVideo(false);
          }
        } else {
          console.log('❌ Erro HTTP:', xhr.status, xhr.responseText);
          let errorMessage = `Erro ${xhr.status}: Erro ao enviar vídeo`;
          let errorDetails = '';
          
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.error || errorMessage;
            errorDetails = errorData.details || '';
            
              // Mensagens específicas baseadas no código de erro
              if (errorData.code === 'FILE_TOO_LARGE') {
                errorMessage = '📁 Arquivo muito grande';
                errorDetails = `O vídeo deve ter no máximo ${errorData.maxSize || '100MB'}. Formatos recomendados: MP4, AVI, MOV, WebM`;
              } else if (errorData.code === 'INVALID_FORMAT') {
                errorMessage = '🎬 Formato de arquivo inválido';
                errorDetails = 'Apenas arquivos de vídeo são permitidos. Formatos aceitos: MP4, AVI, MOV, WebM, MKV';
              } else if (errorData.code === 'NO_FILE') {
                errorMessage = '📎 Nenhum arquivo selecionado';
                errorDetails = 'Selecione um arquivo de vídeo antes de enviar';
              } else if (errorData.code === 'TOPIC_NOT_FOUND') {
                errorMessage = '🔍 Tópico não encontrado';
                errorDetails = 'Recarregue a página e tente novamente';
              } else if (errorData.code === 'MISSING_TOPIC_ID') {
                errorMessage = '🔍 Tópico não especificado';
                errorDetails = 'Selecione um tópico válido';
              } else if (errorData.code === 'INVALID_TOPIC_ID') {
                errorMessage = '🔍 ID do tópico inválido';
                errorDetails = 'O ID do tópico deve ser um número válido';
              } else if (errorData.code === 'INTERNAL_SERVER_ERROR') {
                errorMessage = '❌ Erro interno do servidor';
                errorDetails = 'Ocorreu um erro inesperado. Tente novamente em alguns minutos';
              }
            
          } catch (e) {
            console.log('❌ Não foi possível fazer parse do erro:', xhr.responseText);
            errorMessage = '❌ Erro inesperado';
            errorDetails = 'Tente novamente em alguns minutos';
          }
          
          setUploadError(errorDetails ? `${errorMessage}\n\n${errorDetails}` : errorMessage);
          setUploadingVideo(false);
        }
      });

      xhr.addEventListener('error', (e) => {
        console.error('❌ Erro de conexão:', e);
        setUploadError('🌐 Erro de conexão\n\nVerifique sua internet e tente novamente. Se o problema persistir, pode ser um problema temporário do servidor.');
        setUploadingVideo(false);
      });

      xhr.addEventListener('timeout', () => {
        console.error('❌ Timeout no upload');
        setUploadError('⏱️ Timeout no upload\n\nO upload está demorando muito. Isso pode acontecer com arquivos grandes ou conexão lenta. Tente:\n• Comprimir o vídeo antes de enviar\n• Verificar sua conexão de internet\n• Tentar novamente em alguns minutos');
        setUploadingVideo(false);
      });

      // Configurar timeout de 5 minutos para uploads grandes
      xhr.timeout = 5 * 60 * 1000;

      // Enviar requisição
        xhr.open('POST', 'http://localhost:4000/api/videos/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);

    } catch (error) {
      console.error('❌ Erro inesperado ao enviar vídeo:', error);
      setUploadError(`Erro inesperado: ${error.message}`);
      setUploadingVideo(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (!selectedTopic) return;

    if (confirm('Tem certeza que deseja deletar este vídeo?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/videos/${selectedTopic.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setTopicVideos(prev => {
            const newVideos = { ...prev };
            delete newVideos[selectedTopic.id];
            return newVideos;
          });
          alert('Vídeo deletado com sucesso!');
        } else {
          throw new Error('Erro ao deletar vídeo');
        }
      } catch (error) {
        console.error('Erro ao deletar vídeo:', error);
        alert('Erro ao deletar vídeo. Tente novamente.');
      }
    }
  };


  if (loading) {
    return (
      <AnimatedPage>
      <Page>
        <Header />
          <MainContent>
            <EmptyContentMessage>Carregando curso...</EmptyContentMessage>
          </MainContent>
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
            <EmptyContentMessage>Curso não encontrado</EmptyContentMessage>
          </MainContent>
      </Page>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
    <Page>
      <Header />
        <MainContent>
          {/* Conteúdo Principal */}
          <ContentSection>
            <ContainerContent>

              <ContentGrid>
                <MainContentArea>
                  <ContentArea>
                    {selectedTopic ? (
                      <>
                        {/* Menu de navegação principal */}
                        <ContentNavigation>
                          <ContentNavButton 
                            $active={contentType === 'video'}
                            onClick={() => setContentType('video')}
                          >
                            <FiVideo size={16} />
                            Video Aula
                          </ContentNavButton>
                          <ContentNavButton 
                            $active={contentType === 'text'}
                            onClick={() => setContentType('text')}
                          >
                            <FiFileText size={16} />
                            Conteúdo
                          </ContentNavButton>
                          <AINavButton 
                            $active={contentType === 'ai'}
                            onClick={() => setContentType('ai')}
                          >
                            🤖 Aprenda com IA
                          </AINavButton>
                        </ContentNavigation>

                        <ContentTitle>{selectedTopic.title}</ContentTitle>

                        {/* Conteúdo baseado no tipo selecionado */}
                        {contentType === 'video' && (
                          <VideoContent>
                            <h3 style={{ margin: '0 0 16px 0', color: '#00D4FF' }}>📹 Video Aula</h3>
                            
                            {/* Sistema de vídeo para todos os tópicos */}
                            <div style={{ 
                              background: selectedModule?.title === 'Bem-vindo' 
                                ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(139, 92, 246, 0.1))'
                                : 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '12px',
                              padding: '24px',
                              textAlign: 'center',
                              border: selectedModule?.title === 'Bem-vindo' 
                                ? '2px solid rgba(0, 212, 255, 0.3)'
                                : '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                              {/* Cabeçalho especial para módulo Bem-vindo - apenas se não houver vídeo */}
                              {selectedModule?.title === 'Bem-vindo' && !topicVideos[selectedTopic.id] && (
                                <>
                                  <div style={{ 
                                    fontSize: '4rem', 
                                    marginBottom: '16px',
                                    filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))'
                                  }}>
                                    🎬
                                  </div>
                                  <h4 style={{ 
                                    color: '#00D4FF', 
                                    margin: '0 0 12px 0',
                                    fontSize: '1.5rem',
                                    fontWeight: '600'
                                  }}>
                                    Bem-vindo ao Curso!
                                  </h4>
                                </>
                              )}
                              
                              {/* Conteúdo de vídeo baseado na existência do vídeo */}
                              {topicVideos[selectedTopic.id] ? (
                                <div style={{ 
                                  margin: '0',
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}>
                                  {/* Player de vídeo - ocupando máximo espaço */}
                                  <video
                                    controls
                                    style={{
                                      width: '100%',
                                      height: 'auto',
                                      minHeight: '400px',
                                      maxHeight: '70vh',
                                      borderRadius: '8px',
                                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                      backgroundColor: '#000'
                                    }}
                                  >
                                    <source src={`http://localhost:4000${topicVideos[selectedTopic.id]}`} type="video/mp4" />
                                    Seu navegador não suporta o elemento de vídeo.
                                  </video>
                                  
                                  {/* Botão para deletar vídeo - apenas para professores - posicionado na parte inferior */}
                                  {user && (user.role === 'professor' || user.role === 'admin') && (
                                    <div style={{
                                      marginTop: '12px',
                                      display: 'flex',
                                      justifyContent: 'center'
                                    }}>
                                      <button
                                        onClick={handleDeleteVideo}
                                        style={{
                                          background: 'rgba(255, 71, 87, 0.1)',
                                          border: '1px solid rgba(255, 71, 87, 0.3)',
                                          borderRadius: '4px',
                                          padding: '6px 12px',
                                          color: '#ff4757',
                                          fontSize: '0.75rem',
                                          fontWeight: '400',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.background = 'rgba(255, 71, 87, 0.2)';
                                          e.target.style.borderColor = 'rgba(255, 71, 87, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.background = 'rgba(255, 71, 87, 0.1)';
                                          e.target.style.borderColor = 'rgba(255, 71, 87, 0.3)';
                                        }}
                                      >
                                        🗑️ Remover
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                /* Botão para adicionar vídeo - apenas para professores */
                                user && (user.role === 'professor' || user.role === 'admin') && (
                                  <button
                                    onClick={() => setShowVideoUpload(true)}
                                    style={{
                                      background: 'linear-gradient(135deg, #00D4FF, #0099CC)',
                                      border: 'none',
                                      borderRadius: '8px',
                                      padding: '12px 24px',
                                      color: '#ffffff',
                                      fontSize: '1rem',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      margin: '16px 0',
                                      transition: 'all 0.3s ease',
                                      boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.transform = 'translateY(-2px)';
                                      e.target.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.transform = 'translateY(0)';
                                      e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
                                    }}
                                  >
                                    📹 Clique aqui para adicionar a vídeo aula
                                  </button>
                                )
                              )}
                              
                              {/* Mensagem especial para módulo Bem-vindo - apenas se não houver vídeo */}
                              {selectedModule?.title === 'Bem-vindo' && !topicVideos[selectedTopic.id] && (
                                <p style={{ 
                                  color: '#A78BFA', 
                                  fontSize: '0.9rem',
                                  fontStyle: 'italic',
                                  margin: '20px 0 0 0'
                                }}>
                                  Prepare-se para uma jornada incrível de aprendizado!
                                </p>
                              )}
                            </div>
                          </VideoContent>
                        )}

                        {contentType === 'text' && (
                          <TextContent>
                            <h3 style={{ margin: '0 0 16px 0', color: '#ffffff' }}>📄 Conteúdo Textual</h3>
                            <p>Aqui será exibido o conteúdo textual para "{selectedTopic.title}".</p>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>
                              Área reservada para conteúdo em texto, imagens e documentos.
                            </p>
                          </TextContent>
                        )}

                        {contentType === 'ai' && (
                          <AIContent>
                            <h3 style={{ margin: '0 0 16px 0', color: '#8B5CF6' }}>🤖 Aprenda com IA</h3>
                            <p>Aqui será exibido o chat com IA para "{selectedTopic.title}".</p>
                            <p style={{ color: '#A78BFA', fontSize: '0.9rem' }}>
                              Área reservada para interação com inteligência artificial.
                            </p>
                          </AIContent>
                        )}

                        {!contentType && (
                          <div style={{ 
                            padding: '40px', 
                            textAlign: 'center', 
                            color: '#888',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <p>Selecione um tipo de conteúdo acima para começar a aprender.</p>
                          </div>
                        )}
                      </>
                    ) : selectedModule ? (
                      <>
                        <ContentTitle>{selectedModule.title}</ContentTitle>
                        <ContentText>
                          Selecione um tópico do módulo para visualizar o conteúdo.
                        </ContentText>
                      </>
                    ) : (
                      <EmptyContentMessage>
                        {modules.length > 0 
                          ? 'Selecione um tópico no menu lateral para começar'
                          : 'Nenhum módulo foi criado ainda. Clique em "Adicionar Módulo" para começar.'
                        }
                      </EmptyContentMessage>
                    )}
                  </ContentArea>
                </MainContentArea>

                <SidebarArea>
                  <ModulesMenu>
                    <ModulesTitle>Módulos do Curso</ModulesTitle>
                    {(user?.role === 'professor' || user?.role === 'admin') && (
                      <AddModuleButton onClick={handleOpenModal}>
                        <FiPlus size={20} />
                        Adicionar Módulo
                      </AddModuleButton>
                    )}
                    {modules.length > 0 ? (
                      <ModulesList>
                        {modules.map((module) => {
                          if (!module || !module.id) {
                            console.error('Invalid module:', module);
                            return null;
                          }
                          const moduleTopics = getModuleTopics(module.id);
                          return (
                            <ModuleItem key={module.id}>
                              <ModuleHeader
                                $isActive={false}
                                style={{ cursor: 'default' }}
                              >
                                <ModuleHeaderLeft>
                                  <ModuleItemTitle>{module.title}</ModuleItemTitle>
                                  <ModuleItemMeta>
                                    Módulo {module.position} • {moduleTopics.length} tópicos
                                  </ModuleItemMeta>
                                </ModuleHeaderLeft>
                                {(user?.role === 'professor' || user?.role === 'admin') && (
                                  <AddTopicButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddTopic(module.id);
                                    }}
                                  >
                                    <FiPlus size={12} />
                                  </AddTopicButton>
                                )}
              </ModuleHeader>
              
                              {/* Lista de tópicos */}
                              <TopicsList>
                                {moduleTopics.map((topic) => (
                                  <TopicItem
                                    key={topic.id}
                                    $isActive={selectedTopic?.id === topic.id}
                                    onClick={() => handleTopicClick(topic)}
                                  >
                                    <TopicTitle>{topic.title}</TopicTitle>
                                  </TopicItem>
                                ))}
                                
                                {/* Input para adicionar novo tópico */}
                                {addingTopicToModule === module.id && (
                                  <>
                                    <TopicInput
                                      type="text"
                                      value={newTopicTitle}
                                      onChange={(e) => setNewTopicTitle(e.target.value)}
                                      placeholder="Digite o nome do tópico"
                                      autoFocus
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSaveTopic();
                                        } else if (e.key === 'Escape') {
                                          handleCancelTopic();
                                        }
                                      }}
                                    />
                                    <TopicInputActions>
                                      <TopicActionButton
                                        $variant="cancel"
                                        onClick={handleCancelTopic}
                                      >
                                        <FiX size={12} />
                                      </TopicActionButton>
                                      <TopicActionButton
                                        $variant="save"
                                        onClick={handleSaveTopic}
                                      >
                                        <FiCheck size={12} />
                                      </TopicActionButton>
                                    </TopicInputActions>
                                  </>
                                )}
                              </TopicsList>
                            </ModuleItem>
                          );
                        })}
                      </ModulesList>
                    ) : (
                      <EmptyModulesMessage>
                        Nenhum módulo criado ainda
                      </EmptyModulesMessage>
                    )}
                  </ModulesMenu>
                </SidebarArea>
              </ContentGrid>
            </ContainerContent>
          </ContentSection>
        </MainContent>
        <Rodape />

        {/* Modal para Adicionar Múltiplos Módulos */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="📚 Gerenciar Módulos do Curso"
        >
          <ModalContent>
            {/* Formulário para adicionar novo módulo */}
            <FormSection>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <div style={{ flex: 1 }}>
                  <FormLabel>Título do Módulo</FormLabel>
                  <FormInput
                    type="text"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="Digite o título do módulo"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddModuleToModal();
                      }
                    }}
                  />
                </div>
                <SaveButton 
                  onClick={handleAddModuleToModal} 
                  disabled={!newModuleTitle.trim()}
                  style={{ marginBottom: 0 }}
                >
                  <FiPlus size={16} />
                  Adicionar
                </SaveButton>
              </div>
            </FormSection>

            {/* Lista de módulos criados no modal */}
            {modalModules.length > 0 && (
              <FormSection>
                <FormLabel>Módulos Criados</FormLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {modalModules.map((module) => {
                    const moduleTopics = getModalModuleTopics(module.id);
                    return (
                      <div
                        key={module.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                              {module.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                              {moduleTopics.length} tópicos
                            </div>
                          </div>
                          <AddTopicButton
                            onClick={() => handleAddTopicToModalModule(module.id)}
                          >
                            <FiPlus size={12} />
                          </AddTopicButton>
                        </div>

                        {/* Tópicos do módulo */}
                        {moduleTopics.length > 0 && (
                          <div style={{ marginLeft: '16px' }}>
                            {moduleTopics.map((topic) => (
                              <div
                                key={topic.id}
                                style={{
                                  padding: '8px 12px',
                                  marginBottom: '4px',
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  borderRadius: '6px',
                                  fontSize: '0.85rem',
                                  color: '#ccc'
                                }}
                              >
                                • {topic.title}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Input para adicionar tópico */}
                        {addingTopicToModalModule === module.id && (
                          <div style={{ marginLeft: '16px', marginTop: '8px' }}>
                            <TopicInput
                              type="text"
                              value={newTopicTitle}
                              onChange={(e) => setNewTopicTitle(e.target.value)}
                              placeholder="Digite o nome do tópico"
                              autoFocus
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveModalTopic();
                                } else if (e.key === 'Escape') {
                                  handleCancelModalTopic();
                                }
                              }}
                            />
                            <TopicInputActions>
                              <TopicActionButton
                                $variant="cancel"
                                onClick={handleCancelModalTopic}
                              >
                                <FiX size={12} />
                              </TopicActionButton>
                              <TopicActionButton
                                $variant="save"
                                onClick={handleSaveModalTopic}
                              >
                                <FiCheck size={12} />
                              </TopicActionButton>
                            </TopicInputActions>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </FormSection>
            )}

            {/* Botões de ação */}
            <ButtonGroup>
              <CancelButton onClick={() => setIsModalOpen(false)}>
                Cancelar
              </CancelButton>
              <SaveButton 
                onClick={handleSaveAllModules} 
                disabled={saving || modalModules.length === 0}
              >
                {saving ? 'Salvando...' : `Salvar ${modalModules.length} Módulo${modalModules.length !== 1 ? 's' : ''}`}
              </SaveButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>

        {/* Modal de Upload de Vídeo */}
        {showVideoUpload && (
          <Modal 
            isOpen={showVideoUpload} 
            onClose={handleCloseVideoModal}
            title="📹 Adicionar Vídeo Aula"
            size="small"
          >
            <ModalContent>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  Selecione o arquivo de vídeo:
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileSelect}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px dashed rgba(0, 212, 255, 0.3)',
                    borderRadius: '8px',
                    background: 'rgba(0, 212, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
                {selectedVideoFile && (
                  <p style={{ 
                    margin: '8px 0 0 0',
                    color: '#00D4FF',
                    fontSize: '0.9rem'
                  }}>
                    ✅ Arquivo selecionado: {selectedVideoFile.name}
                  </p>
                )}
                
                {/* Barra de progresso */}
                {uploadingVideo && (
                  <ProgressBar 
                    progress={uploadProgress} 
                    label="Enviando vídeo..."
                  />
                )}
                
                {/* Mensagem de erro */}
                {uploadError && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: 'rgba(255, 71, 87, 0.1)',
                    border: '1px solid rgba(255, 71, 87, 0.3)',
                    borderRadius: '8px',
                    color: '#ff4757',
                    fontSize: '0.9rem',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.4'
                  }}>
                    {uploadError}
                  </div>
                )}
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end' 
              }}>
                <button
                  onClick={handleCloseVideoModal}
                  disabled={uploadingVideo}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    background: 'transparent',
                    color: uploadingVideo ? '#666' : '#ffffff',
                    cursor: uploadingVideo ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    opacity: uploadingVideo ? 0.6 : 1
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleVideoUpload}
                  disabled={!selectedVideoFile || uploadingVideo}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    background: selectedVideoFile && !uploadingVideo 
                      ? 'linear-gradient(135deg, #00D4FF, #0099CC)'
                      : 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    cursor: selectedVideoFile && !uploadingVideo ? 'pointer' : 'not-allowed',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  {uploadingVideo ? 'Enviando...' : 'Enviar Vídeo'}
                </button>
              </div>
            </ModalContent>
          </Modal>
        )}
    </Page>
    </AnimatedPage>
  );
}
