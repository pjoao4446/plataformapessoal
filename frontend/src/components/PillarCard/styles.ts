// ARQUIVO 3: src/components/PillarCard/styles.ts (NOVO COMPONENTE)

import styled from 'styled-components';

export const CardWrapper = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid transparent;
  transition: all 0.3s ease-in-out;
  min-height: 250px;
  box-shadow: 0 0 5px rgba(78, 70, 229, 0.37);

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
  }
`;

export const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(75, 0, 85, 0.46) 0%, rgba(93, 111, 153, 0.25) 85%);
`;

export const Content = styled.div`
  position: relative;
  z-index: 3;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Alinha o conteúdo na base */
`;

export const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  margin-bottom: 1rem;
`;