import styled from 'styled-components';

export const CardWrapper = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid ${props => props.theme.colors.surface};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
  }
`;

export const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ContentWrapper = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

export const ButtonWrapper = styled.div`
  margin-top: auto;
  padding-top: 1rem;
`;