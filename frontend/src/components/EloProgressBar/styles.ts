// ARQUIVO: src/components/EloProgressBar/styles.ts (VERSÃO ATUALIZADA)

import styled from 'styled-components';

export const ProgressBarWrapper = styled.div`
  width: 100%;
`;

export const Container = styled.div`
  width: 100%; /* O container interno agora usa 100% do ProgressBarContainer */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

// NOVO TÍTULO
export const ProgressBarTitle = styled.h3`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

export const EloDisplay = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Alinha pelo topo para nomes de tamanhos diferentes */
`;

// ESTILO MODIFICADO
export const EloInfo = styled.div`
  display: flex;
  flex-direction: column; /* Para colocar o nome ABAIXO do ícone */
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  width: 80px; /* Largura fixa para garantir alinhamento */
  text-align: center;
`;

export const EloIcon = styled.img`
  height: 60px; /* Aumentei um pouco o ícone */
  width: 60px;
`;

export const BarContainer = styled.div`
  width: 100%;
  height: 30px; /* DEIXAMOS A BARRA MAIS GROSSA */
  background-color: ${props => props.theme.colors.background};
  border-radius: 50px 50px 50px 50px;
  position: relative; /* Essencial para posicionar o marcador */
`;

export const BarProgress = styled.div<{ percentage: number }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background-image: ${props => props.theme.gradients.primary};
  border-radius: 50px 50px 50px 50px;
  transition: width 0.5s ease-in-out;
`;

// --- NOVOS ESTILOS PARA O MARCADOR E PORCENTAGEM ---

export const ProgressMarker = styled.div<{ percentage: number }>`
  position: absolute;
  top: 50%;
  left: ${props => props.percentage}%;
  transform: translate(-90%, -30%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const NeonBall = styled.div`
  width: 40px;   /* Tamanho da bolinha */
  height: 40px;
  border-radius: 50%; /* Deixa ela redonda */
  background-color: ${props => props.theme.colors.accentCyan};
  border: 3px solid white;
  box-shadow: 0 0 10px ${props => props.theme.colors.accentCyan}; /* Efeito neon */
`;

export const PercentageText = styled.span`
  margin-top: 0.75rem;
  font-weight: bold;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.background};
  padding: 2px 6px;
  border-radius: 4px;
`;

export const ProgressLink = styled.a`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  text-decoration: none;
  margin-top: 2rem; /* Mais espaço depois da barra */
  &:hover {
    text-decoration: underline;
  }
`;