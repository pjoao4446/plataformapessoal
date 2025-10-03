import styled from 'styled-components';
import heroBg from '../../assets/images/backgroundtelainicio4.png';


const EMBLEM_MAX_WIDTH_BASE = 450; // O tamanho máximo que o MAIOR emblema pode ter (em px)
const EMBLEM_MIN_WIDTH_BASE = 250; // O tamanho mínimo que o MAIOR emblema pode ter (em px)

export const SegmentoWrapper = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;


export const SegmentoBanner = styled.section`
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

// Corrigido: Renomeado de ContainerContent para BannerContent para evitar conflito de nomes
export const BannerContent = styled.div`
  width: 80%;
  max-width: 1700px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BannerLeftColumn = styled.div`
  width: 60%;
`;

export const BannerRightColumn = styled.div`
  width: 40%;
  display: flex;
  justify-content: flex-end;
`;

export const PageSubtitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  text-transform: uppercase;
  font-weight: bold;
`;

export const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  text-transform: uppercase;
  color: ${props => props.theme.colors.text};
  margin: 0.5rem 0;
`;

export const PageDescription = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 80%;
`;

export const ContentSection = styled.section`
  width: 100%;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export const ContainerContent = styled.div`
  width: 80%;
  max-width: 1700px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  text-transform: uppercase;
  color: ${props => props.theme.colors.text};
  width: 80%;
  max-width: 1700px;
`;

export const ProgressBarContainer = styled.div`
  width: 80%;
  max-width: 1700px;
  margin: 0 auto;
  margin-bottom: 2rem;
`;

export const ProgressStatsGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const ProgressCircularCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-height: 200px;
  width: 32%;

  @media (max-width: 768px) {
    width: 100%;
    flex: 1;
  }

`;

export const ProgressStatsCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-height: 200px;
  width: 32%;


  @media (max-width: 768px) {
    width: 100%;
    flex: 1;
  }

 
`;

export const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;


// ESTILIZAÇÃO ELO - BACKGROUND IoNavigateCircleSharp


export const EmblemWrapper = styled.div<{ $scaleFactor?: number }>`
  position: relative;
  width: ${props => (props.$scaleFactor || 1) * 100}%;
  min-width: ${props => `calc(${EMBLEM_MIN_WIDTH_BASE}px * ${props.$scaleFactor || 1})`};
  max-width: ${props => `calc(${EMBLEM_MAX_WIDTH_BASE}px * ${props.$scaleFactor || 1})`};
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

// 2. ADICIONE ESTE NOVO ESTILO (A "Faixa Colorida")
export const EmblemBackground = styled.div`
  width: 100%;
  height: 130px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: rgba(15, 23, 42, 0.6); /* Fundo escuro semi-transparente */
  backdrop-filter: blur(5px); /* Efeito de vidro fosco */
  border: 1px solid ${props => props.theme.colors.surface}; /* Borda sutil */
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  padding-left: 90px; 
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EloTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  line-height: 1.2;
  
  /* --- ADIÇÃO PARA O EFEITO NEON --- */
  text-shadow: 0 0 8px ${props => props.theme.colors.accentCyan};
`;

export const EloSubtitle = styled.p`
  font-size: 1.4rem;
  /* ANTES: color: ${props => props.theme.colors.text}; */
  /* DEPOIS: */
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
`;

export const Infolink = styled.a`
  font-size: 1rem;
  font-weight: bold;
  color: ${props => props.theme.colors.accentCyan};
  cursor: pointer;
  margin-top: 2px;

  &:hover {
    text-decoration: underline;
`;

export const EmblemImage = styled.img<{ $hoverColor?: string }>`
  height: 230px;
  width: 230px;
  position: absolute;
  left: -140px;
  top: 50%;
  transform: translateY(-50%);

  /* --- EFEITO DE HOVER ADICIONADO AQUI --- */
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-50%) scale(1.05); /* Mantém a centralização e aumenta a escala */
    
    /* Usamos 'drop-shadow' que é perfeito para imagens com transparência */
    filter: drop-shadow(0 0 15px ${props => props.$hoverColor || props.theme.colors.primary});
  }
`;

// ARQUIVO: src/containers/SegmentosPage/styles.ts

// ... (seus estilos existentes vêm antes aqui) ...

// --- NOVOS ESTILOS PARA A NAVEGAÇÃO DE NÍVEIS ---

export const LevelNavBar = styled.nav`
  display: flex;
  justify-content: space-between; /* Centraliza os botões */
  gap: 1.5rem; /* Espaçamento entre os botões */
  margin-bottom: 10px; /* Espaçamento abaixo da barra */
  width: 100%;
  /* backdrop-filter: blur(5px); */ /* Pode adicionar um efeito de blur */
  /* background-color: rgba(15, 23, 42, 0.4); */ /* Fundo sutil */
  border-radius: 10px;

  @media (max-width: 768px) {
    flex-wrap: wrap; /* Quebra linha em telas menores */
    gap: 1rem;
    padding: 0.5rem;
  }
`;

export const LevelButton = styled.button`
  width: 32%;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textSecondary};
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  height: 60px;

  &:hover:not(:disabled) {
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.primary}20;
    box-shadow: 0 0 10px ${props => props.theme.colors.primary}60;
  }

  &.active {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 15px ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.surfaceDark};
    color: ${props => props.theme.colors.textSecondary}80;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
`;

// ARQUIVO: src/containers/SegmentosPage/styles.ts

// ... (seus estilos existentes, incluindo LevelNavBar e LevelButton, vêm antes aqui) ...

// --- NOVOS ESTILOS PARA MÓDULOS E TRILHAS DE ESPECIALIZAÇÃO ---

export const ModulesCarousel = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  gap: 2rem;
  overflow-x: auto;
  padding: 1rem 0;
  
  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surfaceDark};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primaryLight};
  }
  
  /* Garantir que os cards não encolham */
  > a {
    flex-shrink: 0;
    width: 300px;
  }
`;

// Container para módulos essenciais usando a mesma lógica dos botões
export const ModulesGrid = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.5rem 0;
  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 1200px) {
    gap: 1rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

// Container para módulos essenciais com largura igual aos botões
export const ModuleCardContainer = styled.div`
  width: 32%;
  flex-shrink: 0;
  
  @media (max-width: 1200px) {
    width: 48%; /* 2 por linha em telas médias */
  }

  @media (max-width: 768px) {
    width: 100%; /* 1 por linha em telas pequenas */
  }
`;

export const ModuleCard = styled.div`
  height: 500px; /* Altura fixa conforme solicitado */
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
  border: 1px solid transparent;
  

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px ${props => props.theme.colors.accentCyan}40;
    border-color: ${props => props.theme.colors.accentCyan};
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 0;
  }

  div.content-area {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
  }

  h4 {
    font-size: 1.4rem;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 1rem;
    flex-grow: 1;
  }

  a.module-button {
    display: inline-block;
    background-color: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.text};
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: bold;
    text-align: center;
    transition: all 0.3s ease-in-out;
    width: fit-content;
    align-self: center;
    &:hover {
      background-color: ${props => props.theme.colors.secondaryLight};
      box-shadow: 0 0 15px ${props => props.theme.colors.secondary};
    }
  }
`;

export const SpecializationSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const CloudProviderNavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem; /* Mesmo gap dos LevelNavBar */
  margin-bottom: 2rem;
  margin-top: 1.5rem; /* Espaçamento após o título da seção */

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem; /* Mesmo gap responsivo dos LevelNavBar */
  }
`;

export const CloudProviderButton = styled.button`
  width: 32%; /* Mesma largura dos LevelButton */
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textSecondary};
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  height: 60px;

  &:hover:not(:disabled) {
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.primary}20;
    box-shadow: 0 0 10px ${props => props.theme.colors.primary}60;
  }

  &.active {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 15px ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.surfaceDark};
    color: ${props => props.theme.colors.textSecondary}80;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
`;

export const CertificationLinesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem; /* Espaçamento entre as linhas de certificação */
  width: 100%;
  margin-top: 2rem;
`;

export const CertificationLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    text-transform: uppercase;
    border-bottom: 2px solid ${props => props.theme.colors.primary};
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
    text-shadow: 0 0 10px ${props => props.theme.colors.primary}30;
  }
`;

export const CertsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Máximo 5 por linha */
  gap: 1.5rem;
  height: 350px; /* Restaurada altura original */
  width: 100%;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr); /* 4 por linha em telas grandes */
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr); /* 3 por linha em telas médias */
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr); /* 2 por linha em telas pequenas */
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr; /* 1 por linha em telas muito pequenas */
  }
`;

export const CertificationCard = styled.div`
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
    filter: drop-shadow(0 0 8px ${props => props.theme.colors.accentCyan}70);
  }

  h4 {
    font-size: 1.3rem;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  a { /* Estilo para o botão "Acesse o Curso" */
    display: inline-block;
    background-color: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.text};
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: ${props => props.theme.colors.secondaryLight};
      box-shadow: 0 0 15px ${props => props.theme.colors.secondary};
    }
  }
`;

// Card vazio bonito para quando não há cursos
export const EmptyModuleCard = styled.div`
  height: 500px; /* Mesma altura do ModuleCard */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
  border: 1px solid transparent;
  padding: 2rem;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px ${props => props.theme.colors.accentCyan}40;
    border-color: ${props => props.theme.colors.accentCyan};
  }

  .icon {
    font-size: 4rem;
    color: ${props => props.theme.colors.accentCyan};
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }

  h4 {
    font-size: 1.4rem;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  p {
    font-size: 1rem;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.5;
  }
`;

export const EmptyCertificationCard = styled.div`
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
  min-height: 200px; /* Altura mínima para manter consistência */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px ${props => props.theme.colors.accentCyan}40;
    border-color: ${props => props.theme.colors.accentCyan};
  }

  .icon {
    font-size: 3rem;
    color: ${props => props.theme.colors.accentCyan};
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  h4 {
    font-size: 1.3rem;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.4;
  }
`;

export const NoContentMessage = styled.div`
  width: 100%;
  padding: 3rem;
  background-color: ${props => props.theme.colors.surfaceDark};
  border-radius: 12px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.2rem;
  margin-top: 2rem;
  border: 1px dashed ${props => props.theme.colors.textSecondary}50;
`;