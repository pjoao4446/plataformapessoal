import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Usando a tag <footer> para semântica correta
export const FooterWrapper = styled.footer`
  width: 100%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

export const ContainerContent = styled.div`
  width: 80%;
  max-width: 1700px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 50px;
  padding-bottom: 50px;
  height: 250px;
`;

export const ContainerContentLeft = styled.div`
  width: 50%;
`;

export const ContainerContentRight = styled.div`
  width: 50%;
  display: flex;
  justify-content: flex-end; /* 'flex-end' é a propriedade correta */
`;

export const Logo = styled.img`
  height: 65px;
  width: auto;
`;

export const Nav = styled.nav`
  display: flex;
  
  /* A MÁGICA ACONTECE AQUI */
  flex-direction: column; /* Altera a direção para vertical */
  
  align-items: flex-start; /* Alinha o texto dos links à esquerda */
  gap: 1rem; /* Espaçamento entre os links */
`;

export const NavLink = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;