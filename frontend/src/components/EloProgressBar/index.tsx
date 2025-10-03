import type { FC } from 'react';
import { 
  ProgressBarWrapper, 
  Container,
  ProgressBarTitle, // Novo
  EloDisplay, 
  EloInfo, 
  EloIcon, 
  BarContainer, 
  BarProgress,
  ProgressMarker, // Novo
  NeonBall,       // Novo
  PercentageText, // Novo
  ProgressLink 
} from './styles';

type EloData = {
  name: string;
  icon: string;
};

type EloProgressBarProps = {
  currentElo: EloData;
  nextElo: EloData;
  percentage: number;
};

export const EloProgressBar: FC<EloProgressBarProps> = ({ currentElo, nextElo, percentage }) => {
  return (
    <ProgressBarWrapper>
      <Container>
        <ProgressBarTitle>Sua Ascensão de Elo</ProgressBarTitle>
        <BarContainer>
          <BarProgress percentage={percentage} />
          <ProgressMarker percentage={percentage}>
            <NeonBall />
            <PercentageText>{percentage}%</PercentageText>
          </ProgressMarker>
        </BarContainer>
        <EloDisplay>
          <EloInfo>
            <EloIcon src={currentElo.icon} alt={`Ícone do Elo ${currentElo.name}`} />
            <span>{currentElo.name}</span>
          </EloInfo>
          <EloInfo>
            <EloIcon src={nextElo.icon} alt={`Ícone do Elo ${nextElo.name}`} />
            <span>{nextElo.name}</span>
          </EloInfo>
        </EloDisplay>
        <ProgressLink href="/elos">Entenda sobre o progresso de Elos</ProgressLink>
      </Container>
    </ProgressBarWrapper>
  );
};