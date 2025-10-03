// ARQUIVO: src/components/Header/index.tsx (VERSÃO COMPLETA E CORRIGIDA)

import type { FC } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTE O 'useNavigate'
import { FiUser, FiLogOut } from 'react-icons/fi';
import logoImage from '../../assets/images/logoajustadamenu.png';

import { Dropdown } from '../Dropdown';
import { useAuth } from '../../context/AuthContext';
import { 
  HeaderWrapper, 
  ContainerContent, 
  ContainerContentLeft,
  ContainerContentRight,
  Logo, 
  Nav, 
  NavLink, 
  LogoutButton 
} from './styles';

// ... (as listas de itens para os submenus continuam aqui, sem alterações)
const segmentosItems = [
  { label: 'Infraestrutura', to: '/segmento/infraestrutura' },
  { label: 'Desenvolvimento', to: '/segmento/desenvolvimento' },
  { label: 'Ciência de Dados', to: '/segmento/dados' },
];

const gameficacaoItems = [
  { label: 'Meus Elos', to: '/elos' },
  { label: 'Ranking', to: '/ranking' },
];

const perfilItems = [
  { label: 'Acessar Perfil', to: '/perfil' },
  { label: 'Configurações', to: '/settings' },
];

const PerfilTrigger = (
  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <FiUser size={20} />
    Perfil
  </span>
);

export const Header: FC = () => {
  const navigate = useNavigate(); // 2. CRIE A FUNÇÃO DE NAVEGAÇÃO
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login'); // 3. NAVEGUE PARA A TELA DE LOGIN
  }

  return (
    <HeaderWrapper>
      <ContainerContent>
        <ContainerContentLeft>
          <Logo src={logoImage} alt="Logo da Sentios Academy" />
        </ContainerContentLeft>
        <ContainerContentRight>
          <Nav>
            <NavLink to="/inicio">Página Inicial</NavLink>
            <Dropdown trigger="Segmentos" items={segmentosItems} />
            <Dropdown trigger="Gameficação" items={gameficacaoItems} />
            {(user?.role === 'professor' || user?.role === 'admin') && (
              <NavLink to="/cursos">Controle de Cursos</NavLink>
            )}
            <Dropdown trigger={PerfilTrigger} items={perfilItems} />
            
            {/* 4. CHAME A FUNÇÃO handleLogout NO onClick DO BOTÃO */}
            <LogoutButton onClick={handleLogout}>
              <FiLogOut size={20} />
              Sair
            </LogoutButton>
          </Nav>
        </ContainerContentRight>
      </ContainerContent>
    </HeaderWrapper>
  );
};