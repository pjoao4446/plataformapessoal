// ARQUIVO 5: src/containers/DashboardPage/styles.ts (NOVO ARQUIVO)

import styled from 'styled-components';
import heroBg from '../../assets/images/backgroundtelainicio4.png';

const EMBLEM_MAX_WIDTH_BASE = 450; // O tamanho máximo que o MAIOR emblema pode ter (em px)
const EMBLEM_MIN_WIDTH_BASE = 250; // O tamanho mínimo que o MAIOR emblema pode ter (em px)



export const DashboardWrapper = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh
`;

export const BannerPageInicio = styled.section`
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

export const ContainerContentColumn = styled.section`
  width: 80%;
  max-width: 1700px;
  display: flex;
  flex-direction: column;
`;

export const ContainerContentColumnTop = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const ContainerContentColumnBottom = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const ContainerContentRow = styled.section`
  width: 80%;
  max-width: 1700px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;



export const ContainerContentLeft = styled.section`
  width: 50%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ContainerContentRight = styled.section`
  width: 50%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

export const WelcomeTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: bold;
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

// 1. ADICIONE ESTE NOVO ESTILO (O "Container-Pai")
export const EmblemWrapper = styled.div<{ scaleFactor?: number }>`
  position: relative;
  /* A largura ideal ainda é uma porcentagem, calculada a partir do fator de escala */
  width: ${props => (props.scaleFactor || 1) * 100}%;

  /* O tamanho MÍNIMO agora é proporcional */
  min-width: ${props => `calc(${EMBLEM_MIN_WIDTH_BASE}px * ${props.scaleFactor || 1})`};

  /* O tamanho MÁXIMO agora também é proporcional */
  max-width: ${props => `calc(${EMBLEM_MAX_WIDTH_BASE}px * ${props.scaleFactor || 1})`};
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

// 2. ADICIONE ESTE NOVO ESTILO (A "Faixa Colorida")
export const EmblemBackground = styled.div`
  width: 100%;
  height: 70%;
  
  /* --- A MUDANÇA ESTÁ AQUI --- */
  background: rgba(15, 23, 42, 0.6); /* Fundo escuro semi-transparente */
  backdrop-filter: blur(5px); /* Efeito de vidro fosco */
  border: 1px solid ${props => props.theme.colors.surface}; /* Borda sutil */
  
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  display: flex;
  align-items: center;
  padding-left: 75px; 
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EloTitle = styled.h4`
  font-size: 1rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  line-height: 1.2;
  
  /* --- ADIÇÃO PARA O EFEITO NEON --- */
  text-shadow: 0 0 8px ${props => props.theme.colors.accentCyan};
`;

export const EloSubtitle = styled.p`
  font-size: 0.75rem;
  /* ANTES: color: ${props => props.theme.colors.text}; */
  /* DEPOIS: */
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
`;

export const InfoLink = styled.a`
  font-size: 0.75rem;
  font-weight: bold;
  color: ${props => props.theme.colors.accentCyan};
  cursor: pointer;
  margin-top: 2px;

  &:hover {
    text-decoration: underline;
`;

export const WelcomeSubtitle = styled.p`
  font-size: 1.25rem;
  padding-top: 25px;
  color: white;
`;

export const EmblemImage = styled.img`
  height: 105px;
  width: 105px;
  position: absolute;
  left: -40px;      /* Move o emblema 40 pixels para a ESQUERDA, para fora da faixa */
  top: 50%;         /* Posiciona o topo do emblema no meio vertical do pai */
  transform: translateY(-50%); /* Ajuste fino para centralizar o emblema perfeitamente na vertical */
`;

export const PillarsSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-itens: center;
  padding-top: 30px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-transform: uppercase;
`;

export const PillarsGrid = styled.div`
  width: 100%;
  height: 500px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
`;