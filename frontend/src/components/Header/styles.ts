import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  width: 100%;
  background-color: black;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
  box-shadow: 0px 0px 5px rgba(124, 49, 147, 0.42);
  z-index: 5;
`;

export const ContainerContent = styled.div`
  width: 80%;
  max-width: 1700px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ContainerContentLeft = styled.div`
  /* Ocupa o espaço necessário para a logo */
`;

export const ContainerContentRight = styled.div`
  /* Ocupa o espaço necessário para a navegação */
`;

export const Logo = styled.img`
  height: 50px;
  width: auto;
`;

export const Nav = styled.nav`
  display: flex;
  
  /* ANTES: align-items: baseline; */
  /* DEPOIS (O CORRETO PARA ESTE CASO): */
  align-items: center;

  gap: 2rem;
`;

export const NavLink = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
  font-size: 1rem;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

export const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: bold;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.accentCyan};
  }
`;