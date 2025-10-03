import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  width: 100%;
  margin: 16px 0;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressText = styled.span`
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ProgressPercentage = styled.span`
  color: #00D4FF;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressBarFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: linear-gradient(90deg, #00D4FF, #0099CC);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

type ProgressBarProps = {
  progress: number;
  label?: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label = "Enviando vídeo..." 
}) => {
  return (
    <ProgressContainer>
      <ProgressLabel>
        <ProgressText>{label}</ProgressText>
        <ProgressPercentage>{Math.round(progress)}%</ProgressPercentage>
      </ProgressLabel>
      <ProgressBarWrapper>
        <ProgressBarFill $progress={progress} />
      </ProgressBarWrapper>
    </ProgressContainer>
  );
};
