// ARQUIVO 1: src/containers/LoginPage/styles.ts (VERSÃO COM LAYOUT FLUIDO)

import styled, { keyframes }  from 'styled-components';
import bgImage from '../../assets/images/background-login.png';
import bgImageRight from '../../assets/images/telalogin.png';


export const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  background-image: url(${bgImage});
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoginCard = styled.div`
  width: 50%;
  height: 2000px;
  max-height: 80%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const LeftColumn = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4%;
`;

export const RightColumn = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${bgImageRight});
  background-position: center;
  background-size: cover;
  padding: 4%;
`;

export const DecorativeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Logo = styled.img`
  height: 100px;
  width: auto;
  margin-bottom: 30px;
`;

export const Subtitle = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  /* Usando clamp() para margem fluida */
  margin-bottom: 20px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* Usando clamp() para espaçamento fluido */
  gap: clamp(0.75rem, 2vh, 1.25rem);
`;

export const LinksWrapper = styled.div`
  margin-top: clamp(1rem, 3vh, 1.5rem);
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  margin-bottom: 15px;

  span, a {
    colopurpler: ;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Aplica a animação 'rotate', fazendo-a durar 1 segundo e repetir infinitamente */
  animation: ${rotate} 2s linear infinite;
`;

export const SuccessMessage = styled.div`
  padding: 1rem;
  background-color: rgba(0, 255, 255, 0.1); /* Fundo ciano com transparência */
  border-left: 4px solid ${props => props.theme.colors.accentCyan};
  border-radius: 4px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
`;