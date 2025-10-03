import styled from 'styled-components';

export const CircularProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CircularProgressContainer = styled.div<{ size: number }>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CircularProgressSVG = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

export const CircularProgressCircle = styled.circle<{ backgroundColor?: string }>`
  fill: none;
  stroke: ${props => props.backgroundColor || 'rgba(255, 255, 255, 0.1)'};
  stroke-linecap: round;
`;

export const CircularProgressCircleFill = styled.circle<{ color: string }>`
  fill: none;
  stroke: ${props => props.color};
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease-in-out;
  filter: drop-shadow(0 0 10px ${props => props.color});
`;

export const CircularProgressContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const CircularProgressIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
`;

export const CircularProgressText = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
`;

export const CircularProgressPercentage = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  line-height: 1;
`;

