import styled from 'styled-components';

export const StatsCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  transition: all 0.3s ease;
  min-height: 120px;
  gap: 0.75rem;
`;

export const StatsCardIcon = styled.img<{ color: string }>`
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 0 8px ${props => props.color});
`;

export const StatsCardValue = styled.div<{ color: string }>`
  font-size: 36px;
  font-weight: bold;
  color: ${props => props.color};
  text-shadow: 0 0 10px ${props => props.color};
  text-align: center;
`;

export const StatsCardLabel = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-weight: 500;
`;
