import { Link } from 'react-router-dom';
import styled from 'styled-components';

// A palavra 'export' aqui é a chave!
export const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.accent};
  text-decoration: none;
  font-weight: bold;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(0.8);
  }
`;