import { type FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header } from '../../components/Header';
import { Rodape } from '../../components/Rodape';
import { AnimatedPage } from '../../components/AnimatedPage';
import { MainContent } from '../../components/MainContent';
import { PageBannerWithEditor } from '../../components/PageBannerWithEditor';
import { useAuth } from '../../context/AuthContext';
import heroBg from '../../assets/images/backgroundtelainicio4.png';

const SettingsWrapper = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const SettingsBanner = styled.section`
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

const SettingsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SettingsCard = styled.div`
  background: linear-gradient(135deg, ${(p) => p.theme.colors.surface} 0%, ${(p) => p.theme.colors.surfaceDark} 100%);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  text-shadow: 0 0 10px ${(p) => p.theme.colors.accentCyan}30;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${(p) => p.theme.colors.surfaceDark};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: ${(p) => p.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accentCyan};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.accentCyan}20;
  }
  
  &::placeholder {
    color: ${(p) => p.theme.colors.textSecondary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${(p) => p.theme.colors.surfaceDark};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: ${(p) => p.theme.colors.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accentCyan};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.accentCyan}20;
  }
  
  &::placeholder {
    color: ${(p) => p.theme.colors.textSecondary};
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, ${(p) => p.theme.colors.primary} 100%);
  color: #000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  width: auto;
  min-width: 150px;
  align-self: flex-start;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${(p) => p.theme.colors.accentCyan}40;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;



const SuccessMessage = styled.div`
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(46, 204, 113, 0.3);
`;

const ErrorMessage = styled.div`
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(231, 76, 60, 0.3);
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: ${(p) => p.theme.colors.accentCyan};
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
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

export const SettingsPage: FC = () => {
  const { user, updateUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    avatar_path: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            location: data.location || '',
            website: data.website || '',
            linkedin: data.linkedin || '',
            github: data.github || '',
            avatar_path: data.avatar_path || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar dados do perfil' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📁 Arquivo selecionado:', file.name, file.size, file.type);

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      console.log('🔑 Token:', token ? 'Presente' : 'Ausente');
      
      const response = await fetch('http://localhost:4000/uploads/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📡 Resposta do servidor:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('📄 Dados recebidos:', data);
        
        setFormData(prev => ({ ...prev, avatar_path: data.path }));
        
        // Atualizar o userProfile também
        if (userProfile) {
          setUserProfile(prev => prev ? { ...prev, avatar_path: data.path } : null);
        }
        
        // Atualizar o contexto global
        updateUser({ avatar_path: data.path });
        
        setMessage({ type: 'success', text: 'Avatar atualizado com sucesso!' });
      } else {
        const errorData = await response.json();
        console.error('❌ Erro do servidor:', errorData);
        setMessage({ type: 'error', text: errorData.error || 'Erro ao fazer upload do avatar' });
      }
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      setMessage({ type: 'error', text: 'Erro ao fazer upload do avatar' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao atualizar perfil' });
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/user/email', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email })
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setMessage({ type: 'success', text: 'Email atualizado com sucesso!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao atualizar email' });
      }
    } catch (error) {
      console.error('Erro ao salvar email:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar email' });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/user/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao atualizar senha' });
      }
    } catch (error) {
      console.error('Erro ao salvar senha:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar senha' });
    } finally {
      setSaving(false);
    }
  };

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
        <SettingsWrapper>
          <Header />
          <MainContent>
            <ContentSection>
              <ContainerContent>
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <LoadingSpinner />
                  <div style={{ fontSize: '1.5rem', color: '#666', marginTop: '1rem' }}>Carregando configurações...</div>
                </div>
              </ContainerContent>
            </ContentSection>
          </MainContent>
          <Rodape />
        </SettingsWrapper>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <SettingsWrapper>
        <Header />
        <MainContent>
          <PageBannerWithEditor pageId="settings">
            <ContainerContentRow>
              <ContainerContentLeft>
                <UserAvatar onClick={() => document.getElementById('banner-avatar-input')?.click()}>
                  {(userProfile?.avatar_path || user?.avatar_path) ? (
                    <img src={`http://localhost:4000${userProfile?.avatar_path || user?.avatar_path}`} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    getInitials(userProfile?.name || 'USUÁRIO')
                  )}
                  <AvatarOverlay className="avatar-overlay">
                    📷<br />
                    Clique aqui e adicione ou altere a sua foto de perfil
                  </AvatarOverlay>
                  <HiddenFileInput
                    type="file"
                    id="banner-avatar-input"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={saving}
                  />
                </UserAvatar>
              </ContainerContentLeft>
              <ContainerContentRight>
                <WelcomeTitle>BEM-VINDO, AGENTE <span>{getFirstAndLastName(userProfile?.name || 'USUÁRIO').toUpperCase()}</span>.</WelcomeTitle>
                <WelcomeSubtitle>CONFIGURAÇÕES</WelcomeSubtitle>
                <PageDescription>Gerencie suas informações pessoais e preferências da conta</PageDescription>
              </ContainerContentRight>
            </ContainerContentRow>
          </PageBannerWithEditor>

          <ContentSection>
            <ContainerContent>
          {message && (
            message.type === 'success' ? (
              <SuccessMessage>{message.text}</SuccessMessage>
            ) : (
              <ErrorMessage>{message.text}</ErrorMessage>
            )
          )}

          <SettingsGrid>
            {/* Informações Pessoais */}
            <SettingsCard>
              <CardTitle>Informações Pessoais</CardTitle>
              

              <FormGroup>
                <Label>Nome Completo</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome completo"
                />
              </FormGroup>

              <FormGroup>
                <Label>Telefone</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                />
              </FormGroup>

              <FormGroup>
                <Label>Localização</Label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Cidade, Estado"
                />
              </FormGroup>

              <FormGroup>
                <Label>Bio</Label>
                <TextArea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Conte um pouco sobre você..."
                />
              </FormGroup>

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? <LoadingSpinner /> : '💾 Salvar Perfil'}
              </Button>
            </SettingsCard>

            {/* Conta e Segurança */}
            <SettingsCard>
              <CardTitle>Conta e Segurança</CardTitle>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                />
                <Button onClick={handleSaveEmail} disabled={saving}>
                  {saving ? <LoadingSpinner /> : '📧 Atualizar Email'}
                </Button>
              </FormGroup>

              <FormGroup>
                <Label>Senha Atual</Label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Digite sua senha atual"
                />
              </FormGroup>

              <FormGroup>
                <Label>Nova Senha</Label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Digite sua nova senha"
                />
              </FormGroup>

              <FormGroup>
                <Label>Confirmar Nova Senha</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirme sua nova senha"
                />
              </FormGroup>

              <Button onClick={handleSavePassword} disabled={saving}>
                {saving ? <LoadingSpinner /> : '🔒 Alterar Senha'}
              </Button>
            </SettingsCard>

            {/* Links Sociais */}
            <SettingsCard>
              <CardTitle>Links Sociais</CardTitle>

              <FormGroup>
                <Label>Website</Label>
                <Input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://seusite.com"
                />
              </FormGroup>

              <FormGroup>
                <Label>LinkedIn</Label>
                <Input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/seuperfil"
                />
              </FormGroup>

              <FormGroup>
                <Label>GitHub</Label>
                <Input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/seuperfil"
                />
              </FormGroup>

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? <LoadingSpinner /> : '🔗 Salvar Links'}
              </Button>
            </SettingsCard>

            {/* Informações da Conta */}
            <SettingsCard>
              <CardTitle>Informações da Conta</CardTitle>

              <FormGroup>
                <Label>Função</Label>
                <Input
                  type="text"
                  value={userProfile?.role || ''}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Membro desde</Label>
                <Input
                  type="text"
                  value={userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('pt-BR') : ''}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Última atualização</Label>
                <Input
                  type="text"
                  value={userProfile?.updated_at ? new Date(userProfile.updated_at).toLocaleDateString('pt-BR') : ''}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </FormGroup>
            </SettingsCard>
          </SettingsGrid>
            </ContainerContent>
          </ContentSection>
        </MainContent>
        <Rodape />
      </SettingsWrapper>
    </AnimatedPage>
  );
};
