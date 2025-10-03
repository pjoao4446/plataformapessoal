import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header } from '../../components/Header';
import { Rodape } from '../../components/Rodape';
import { CircularProgressBar } from '../../components/CircularProgressBar';
import { StatsCard } from '../../components/StatsCard';
import { AnimatedPage } from '../../components/AnimatedPage';
import { MainContent } from '../../components/MainContent';
import { PageBannerWithEditor } from '../../components/PageBannerWithEditor';
import { useAuth } from '../../context/AuthContext';
import heroBg from '../../assets/images/backgroundtelainicio4.png';
import { FiTrash2 } from 'react-icons/fi';

// Importar ícones dos elos
import emblemDiamante from '../../assets/images/emblemadiamante.png';
import emblemMestre from '../../assets/images/emblemamestre.png';
import emblemPlatina from '../../assets/images/emblemaplatina.png';

const ProfileWrapper = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ProfileBanner = styled.section`
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

const BannerContent = styled.div`
  width: 80%;
  max-width: 1700px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContainerContentRow = styled.section`
  width: 80%;
  max-width: 1700px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ContainerContentLeft = styled.section`
  width: auto;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const ContainerContentRight = styled.section`
  width: auto;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
  flex: 1;
`;

const UserAvatar = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, ${(p) => p.theme.colors.primary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #000;
  font-weight: bold;
  box-shadow: 0 0 40px ${(p) => p.theme.colors.accentCyan}50;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 60px ${(p) => p.theme.colors.accentCyan}70;
  }
  
  &:hover .avatar-overlay {
    opacity: 1;
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  padding: 20px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const WelcomeTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const WelcomeSubtitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const PageDescription = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 80%;
  margin-top: 1rem;
`;

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

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.surface} 0%, ${(p) => p.theme.colors.surfaceDark} 100%);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, ${(p) => p.theme.colors.primary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #000;
  font-weight: bold;
  box-shadow: 0 0 30px ${(p) => p.theme.colors.accentCyan}40;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px ${(p) => p.theme.colors.accentCyan}30;
`;

const ProfileEmail = styled.p`
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const ProfilePhone = styled.p`
  font-size: 1rem;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const ProfileLocation = styled.p`
  font-size: 1rem;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const ProfileBio = styled.p`
  font-size: 1rem;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 1rem;
  font-style: italic;
`;

const ProfileRole = styled.div`
  display: inline-block;
  background: ${(p) => p.theme.colors.accentCyan}20;
  color: ${(p) => p.theme.colors.accentCyan};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
  border: 1px solid ${(p) => p.theme.colors.accentCyan}40;
  margin-bottom: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: ${(p) => p.theme.colors.accentCyan};
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${(p) => p.theme.colors.accentCyan}40;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(p) => p.theme.colors.accentCyan}20;
    transform: translateY(-2px);
  }
`;

const ElosSection = styled.div`
  margin-top: 3rem;
`;

const ElosTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: ${(p) => p.theme.colors.text};
  text-align: left;
  margin-bottom: 2rem;
  text-transform: uppercase;
  text-shadow: 0 0 10px ${(p) => p.theme.colors.accentCyan}30;
`;

const ElosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CertificationsSection = styled.div`
  margin-top: 3rem;
`;

const CertificationsTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: ${(p) => p.theme.colors.text};
  text-align: left;
  margin-bottom: 2rem;
  text-transform: uppercase;
  text-shadow: 0 0 10px ${(p) => p.theme.colors.accentCyan}30;
`;

const CertificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const CertificationCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  justify-content: space-between;
  padding: 1.8rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
  border: 1px solid transparent;
  min-height: 200px;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px ${props => props.theme.colors.accentCyan}40;
    border-color: ${props => props.theme.colors.accentCyan};
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  a {
    color: ${props => props.theme.colors.accentCyan};
    text-decoration: none;
    font-weight: 600;
    font-size: 0.8rem;
    transition: color 0.3s ease;

    &:hover {
      color: ${props => props.theme.colors.accentCyan}CC;
    }
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8);

  ${CertificationCard}:hover & {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    background: rgba(255, 0, 0, 1);
    transform: scale(1.1);
  }

  svg {
    color: white;
    width: 16px;
    height: 16px;
  }
`;

const EmptyCertificationCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  justify-content: center;
  padding: 1.8rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
  border: 1px solid transparent;
  min-height: 200px;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px ${props => props.theme.colors.accentCyan}40;
    border-color: ${props => props.theme.colors.accentCyan};
  }

  .icon {
    font-size: 3rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 1rem;
    opacity: 0.6;
  }

  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.5;
  }
`;

const AddCertificationButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.accentCyan}, ${props => props.theme.colors.accentPurple});
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.surfaceDark};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accentCyan};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.accentCyan}20;
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.surfaceDark};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accentCyan};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.accentCyan}20;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, ${props.theme.colors.accentCyan}, ${props.theme.colors.accentPurple});
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
  ` : props.variant === 'danger' ? `
    background: linear-gradient(135deg, #ff4757, #ff3742);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
    }
  ` : `
    background-color: ${props.theme.colors.surfaceDark};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background-color: ${props.theme.colors.border};
    }
  `}
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const ConfirmationContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const ConfirmationTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const ConfirmationMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const EloCard = styled.div`
  height: 500px;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.surface} 0%, ${(p) => p.theme.colors.surfaceDark} 100%);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 20px ${(p) => p.theme.colors.accentCyan}20;
    border-color: ${(p) => p.theme.colors.accentCyan}40;
  }
`;

const EloIcon = styled.img`
  width: 160px;
  height: 160px;
  margin: 0 auto 1rem;
  filter: drop-shadow(0 0 15px ${(p) => p.theme.colors.accentCyan}70);
  transition: all 0.3s ease-in-out;
  
  ${EloCard}:hover & {
    transform: scale(1.1);
    filter: drop-shadow(0 0 20px ${(p) => p.theme.colors.accentCyan}90);
  }
`;

const EloName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 1.5rem;
  text-transform: uppercase;
`;

const ProgressBarContainer = styled.div`
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${(p) => p.theme.colors.surfaceDark};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressBarFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${(p) => p.$percentage}%;
  background: linear-gradient(90deg, ${(p) => p.$color} 0%, ${(p) => p.$color}CC 100%);
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
  box-shadow: 0 0 10px ${(p) => p.$color}60;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${(p) => p.theme.colors.textSecondary};
  text-transform: uppercase;
`;

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  avatar_path?: string;
  created_at: string;
  updated_at: string;
}

export const ProfilePage: FC = () => {
  const { user, updateUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [certificationForm, setCertificationForm] = useState({
    name: '',
    image: null as File | null,
    url: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCertifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:4000/certifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const certificationsData = await response.json();
          setCertifications(certificationsData);
        } else {
          console.error('Erro ao carregar certificações');
        }
      } catch (error) {
        console.error('Erro na requisição de certificações:', error);
      }
    };

    fetchUserProfile();
    fetchCertifications();
  }, []);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/uploads/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📁 Avatar salvo:', data.path);
        
        // Atualizar o perfil local
        setUserProfile(prev => prev ? { ...prev, avatar_path: data.path } : null);
        
        // Atualizar o contexto global
        updateUser({ avatar_path: data.path });
        
        console.log('✅ Avatar atualizado com sucesso!');
      } else {
        console.error('❌ Erro ao salvar avatar');
      }
    } catch (error) {
      console.error('❌ Erro no upload:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCertificationFormChange = (field: string, value: string | File | null) => {
    setCertificationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCertification = async () => {
    if (!certificationForm.name.trim()) {
      alert('Nome da certificação é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', certificationForm.name);
      formData.append('url', certificationForm.url);
      
      if (certificationForm.image) {
        formData.append('image', certificationForm.image);
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/certifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const newCertification = await response.json();
        setCertifications(prev => [...prev, newCertification]);
        setCertificationForm({ name: '', image: null, url: '' });
        setShowAddCertification(false);
        console.log('✅ Certificação adicionada com sucesso!');
      } else {
        console.error('❌ Erro ao adicionar certificação');
      }
    } catch (error) {
      console.error('❌ Erro no upload:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddCertification(false);
    setCertificationForm({ name: '', image: null, url: '' });
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

  const handleDeleteCertification = (certificationId: number) => {
    showConfirmationModal(
      'Confirmar Exclusão',
      'Tem certeza que deseja remover esta certificação? Esta ação não pode ser desfeita.',
      async () => {
        setSaving(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:4000/certifications/${certificationId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            setCertifications(prev => prev.filter(cert => cert.id !== certificationId));
            console.log('✅ Certificação removida com sucesso!');
          } else {
            console.error('❌ Erro ao remover certificação');
          }
        } catch (error) {
          console.error('❌ Erro na requisição:', error);
        } finally {
          setSaving(false);
        }
      }
    );
  };

  // Dados mockados dos elos (por enquanto)
  const elosData = [
    {
      id: 'geral',
      name: 'Elo Geral',
      icon: emblemDiamante,
      currentElo: 'DIAMANTE',
      nextElo: 'MESTRE',
      percentage: 45,
      level: 18,
      xp: 3200,
      ranking: 8,
      color: '#7C3193'
    },
    {
      id: 'infraestrutura',
      name: 'Infraestrutura',
      icon: emblemDiamante,
      currentElo: 'DIAMANTE',
      nextElo: 'MESTRE',
      percentage: 30,
      level: 15,
      xp: 2450,
      ranking: 42,
      color: '#00FFFF'
    },
    {
      id: 'desenvolvimento',
      name: 'Desenvolvimento',
      icon: emblemMestre,
      currentElo: 'MESTRE',
      nextElo: 'ORACLE',
      percentage: 35,
      level: 12,
      xp: 1890,
      ranking: 28,
      color: '#FFD700'
    },
    {
      id: 'dados',
      name: 'Ciência de Dados',
      icon: emblemPlatina,
      currentElo: 'PLATINA',
      nextElo: 'DIAMANTE',
      percentage: 80,
      level: 8,
      xp: 1200,
      ranking: 156,
      color: '#E5E4E2'
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getFirstAndLastName = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0];
    if (names.length === 2) return name;
    return `${names[0]} ${names[names.length - 1]}`;
  };

  if (loading) {
    return (
      <AnimatedPage>
        <ProfileWrapper>
          <Header />
          <MainContent>
            <ContentSection>
              <ContainerContent>
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ fontSize: '1.5rem', color: '#666' }}>Carregando perfil...</div>
                </div>
              </ContainerContent>
            </ContentSection>
          </MainContent>
          <Rodape />
        </ProfileWrapper>
      </AnimatedPage>
    );
  }

  if (!userProfile) {
    return (
      <AnimatedPage>
        <ProfileWrapper>
          <Header />
          <MainContent>
            <ContentSection>
              <ContainerContent>
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ fontSize: '1.5rem', color: '#666' }}>Erro ao carregar perfil</div>
                </div>
              </ContainerContent>
            </ContentSection>
          </MainContent>
          <Rodape />
        </ProfileWrapper>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <ProfileWrapper>
        <Header />
        <MainContent>
          <PageBannerWithEditor pageId="profile">
            <ContainerContentRow>
              <ContainerContentLeft>
                <UserAvatar onClick={() => document.getElementById('profile-avatar-input')?.click()}>
                  {(userProfile.avatar_path || user?.avatar_path) ? (
                    <img src={`http://localhost:4000${userProfile.avatar_path || user?.avatar_path}`} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    getInitials(userProfile.name)
                  )}
                  <AvatarOverlay className="avatar-overlay">
                    📷<br />
                    Clique aqui e adicione ou altere a sua foto de perfil
                  </AvatarOverlay>
                  <HiddenFileInput
                    type="file"
                    id="profile-avatar-input"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={saving}
                  />
                </UserAvatar>
              </ContainerContentLeft>
              <ContainerContentRight>
                <WelcomeTitle>BEM-VINDO, AGENTE <span>{getFirstAndLastName(userProfile.name).toUpperCase()}</span>.</WelcomeTitle>
                <WelcomeSubtitle>MEU PERFIL</WelcomeSubtitle>
                <PageDescription>Acompanhe seu progresso e conquistas na plataforma</PageDescription>
              </ContainerContentRight>
            </ContainerContentRow>
          </PageBannerWithEditor>

          <ContentSection>
            <ContainerContent>
          {/* Header do Perfil */}
          <ProfileHeader>
            <ProfileInfo>
              <ProfileName>{userProfile.name}</ProfileName>
              <ProfileEmail>{userProfile.email}</ProfileEmail>
              {userProfile.phone && <ProfilePhone>📞 {userProfile.phone}</ProfilePhone>}
              {userProfile.location && <ProfileLocation>📍 {userProfile.location}</ProfileLocation>}
              {userProfile.bio && <ProfileBio>"{userProfile.bio}"</ProfileBio>}
              <ProfileRole>{userProfile.role}</ProfileRole>
              
              {(userProfile.website || userProfile.linkedin || userProfile.github) && (
                <SocialLinks>
                  {userProfile.website && (
                    <SocialLink href={userProfile.website} target="_blank" rel="noopener noreferrer">
                      🌐 Website
                    </SocialLink>
                  )}
                  {userProfile.linkedin && (
                    <SocialLink href={userProfile.linkedin} target="_blank" rel="noopener noreferrer">
                      💼 LinkedIn
                    </SocialLink>
                  )}
                  {userProfile.github && (
                    <SocialLink href={userProfile.github} target="_blank" rel="noopener noreferrer">
                      💻 GitHub
                    </SocialLink>
                  )}
                </SocialLinks>
              )}
            </ProfileInfo>
          </ProfileHeader>

          {/* Seção dos Elos */}
          <ElosSection>
            <ElosTitle>Meus Elos</ElosTitle>
            <ElosGrid>
              {elosData.map((elo) => (
                <EloCard key={elo.id}>
                  <EloIcon src={elo.icon} alt={`Elo ${elo.name}`} />
                  <EloName>{elo.name}</EloName>
                  
                  <ProgressBarContainer>
                    <ProgressBar>
                      <ProgressBarFill 
                        $percentage={elo.percentage} 
                        $color={elo.color}
                      />
                    </ProgressBar>
                    <ProgressInfo>
                      <span>{elo.currentElo}</span>
                      <span>{elo.percentage}% para {elo.nextElo}</span>
                    </ProgressInfo>
                  </ProgressBarContainer>

                  <StatsContainer>
                    <StatItem>
                      <StatValue>{elo.xp}</StatValue>
                      <StatLabel>XP</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>#{elo.ranking}</StatValue>
                      <StatLabel>Ranking</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>Nv.{elo.level}</StatValue>
                      <StatLabel>Nível</StatLabel>
                    </StatItem>
                  </StatsContainer>
                </EloCard>
              ))}
            </ElosGrid>
          </ElosSection>

          {/* Seção das Certificações */}
          <CertificationsSection>
            <CertificationsTitle>Minhas Certificações</CertificationsTitle>
            <CertificationsGrid>
              {/* Renderizar certificações existentes */}
              {certifications.map((cert, index) => (
                <CertificationCard key={cert.id}>
                  <DeleteButton 
                    onClick={() => handleDeleteCertification(cert.id)}
                    disabled={saving}
                    title="Remover certificação"
                  >
                    <FiTrash2 />
                  </DeleteButton>
                  <img 
                    src={cert.image_path ? `http://localhost:4000${cert.image_path}` : '/default-cert.png'} 
                    alt={cert.name} 
                  />
                  <p>{cert.name}</p>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer">
                      Ver Certificado
                    </a>
                  )}
                </CertificationCard>
              ))}
              
              {/* Sempre mostrar o card de adicionar certificação */}
              <EmptyCertificationCard onClick={() => setShowAddCertification(true)}>
                <div className="icon">🏆</div>
                <p>Clique aqui para adicionar suas certificações</p>
              </EmptyCertificationCard>
            </CertificationsGrid>
          </CertificationsSection>
            </ContainerContent>
          </ContentSection>
        </MainContent>
        <Rodape />
      </ProfileWrapper>

      {/* Modal para adicionar certificação */}
      {showAddCertification && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Adicionar Certificação</ModalTitle>
            
            <FormGroup>
              <Label htmlFor="cert-name">Nome da Certificação *</Label>
              <Input
                id="cert-name"
                type="text"
                value={certificationForm.name}
                onChange={(e) => handleCertificationFormChange('name', e.target.value)}
                placeholder="Ex: AWS Cloud Practitioner"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="cert-image">Imagem da Certificação</Label>
              <FileInput
                id="cert-image"
                type="file"
                accept="image/*"
                onChange={(e) => handleCertificationFormChange('image', e.target.files?.[0] || null)}
              />
              <small style={{ color: '#666', fontSize: '0.8rem' }}>
                Recomendado: 200x200px, formato PNG ou JPG
              </small>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="cert-url">URL do Certificado (opcional)</Label>
              <Input
                id="cert-url"
                type="url"
                value={certificationForm.url}
                onChange={(e) => handleCertificationFormChange('url', e.target.value)}
                placeholder="https://www.credly.com/badges/..."
              />
            </FormGroup>

            <ButtonGroup>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleAddCertification} disabled={saving}>
                {saving ? 'Salvando...' : 'Adicionar'}
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de Confirmação */}
      {showConfirmation && confirmationData && (
        <ConfirmationModal onClick={handleCancelConfirmation}>
          <ConfirmationContent onClick={(e) => e.stopPropagation()}>
            <ConfirmationTitle>{confirmationData.title}</ConfirmationTitle>
            <ConfirmationMessage>{confirmationData.message}</ConfirmationMessage>
            <ConfirmationButtons>
              <Button variant="secondary" onClick={handleCancelConfirmation}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleConfirm} disabled={saving}>
                {saving ? 'Processando...' : 'Confirmar'}
              </Button>
            </ConfirmationButtons>
          </ConfirmationContent>
        </ConfirmationModal>
      )}
    </AnimatedPage>
  );
};
